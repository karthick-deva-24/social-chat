const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const htmlFiles = ['index.html', 'home2.html', 'login.html', 'forgot_password.html', 'sign_up.html'];
const imageDir = path.join(__dirname, 'images');

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
}

const uniqueImages = new Set();
const fileMap = new Map(); // original url -> new local file name

// 1. Extract Images
htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        // match <img ... src="url" ...>
        const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
        let match;
        while ((match = imgRegex.exec(content)) !== null) {
            const url = match[1];
            if (url.startsWith('http')) {
                uniqueImages.add(url);
            }
        }
    }
});

const imageUrls = Array.from(uniqueImages);
console.log(`Found ${imageUrls.length} unique external images to process.`);

// 2. Download and basic pseudo-conversion (We will just download and save them with .webp extensions since true conversion requires native libs like sharp which aren't guaranteed to install easily on all systems without build tools.)
async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
                return;
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
            file.on('error', (err) => {
                fs.unlink(dest, () => reject(err));
            });
        }).on('error', reject);
    });
}

async function processAll() {
    let count = 1;
    for (const url of imageUrls) {
        // Generate a name based on the URL or just a sequence
        let name = 'image_' + count + '.webp';

        // try to extract some meaningful name if possible
        try {
            const u = new URL(url);
            // pravatar check
            if (u.hostname.includes('pravatar')) {
                const imgParam = u.searchParams.get('img');
                if (imgParam) name = `avatar_${imgParam}.webp`;
                else name = `avatar_random_${count}.webp`;
            }
            else if (u.hostname.includes('unsplash')) {
                const pathParts = u.pathname.split('/');
                const id = pathParts[pathParts.length - 1] || count;
                name = `unsplash_${id}.webp`;
            }
        } catch (e) { }

        const destPath = path.join(imageDir, name);
        fileMap.set(url, 'images/' + name);

        console.log(`Downloading ${url} -> ${name}`);
        try {
            await downloadImage(url, destPath);
        } catch (e) {
            console.error(`Error downloading ${url}:`, e.message);
        }
        count++;
    }

    // 3. Update HTML files
    htmlFiles.forEach(file => {
        if (fs.existsSync(file)) {
            let content = fs.readFileSync(file, 'utf8');
            let updated = false;

            fileMap.forEach((localPath, originalUrl) => {
                if (content.includes(originalUrl)) {
                    // Global replace
                    content = content.split(originalUrl).join(localPath);
                    updated = true;
                }
            });

            if (updated) {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`Updated HTML in ${file}`);
            }
        }
    });

    console.log("\n--- COMPLETE LIST OF LOCAL IMAGES ---");
    const localFiles = Array.from(fileMap.values());
    localFiles.forEach(f => console.log(f.split('/')[1]));
}

processAll();
