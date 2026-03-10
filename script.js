window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 800); // Artificial delay to show animation
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // 1. Follow Buttons Toggle
    const followBtns = document.querySelectorAll('.follow-btn');

    followBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (this.classList.contains('following')) {
                this.classList.remove('following');
                this.innerHTML = '<i class="fa-solid fa-user-plus"></i> Follow';
            } else {
                this.classList.add('following');
                this.innerHTML = '<i class="fa-solid fa-user-check"></i> Following';
            }
        });
    });

    // 2. Feed Tabs active state
    const tabs = document.querySelectorAll('.feed-tabs .tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Switch tabs
            const tabId = this.id; // e.g., 'tab-recents', 'tab-friends', 'tab-popular'
            if (tabId) {
                const targetFeedId = tabId.replace('tab-', 'feed-');
                const targetFeed = document.getElementById(targetFeedId);
                const allFeeds = document.querySelectorAll('.feed-content-pane');

                if (targetFeed) {
                    allFeeds.forEach(feed => {
                        if (feed.id === targetFeedId) {
                            feed.style.display = 'block';
                        } else {
                            feed.style.display = 'none';
                        }
                    });
                } else {
                    // Fallback visually if pane doesn't exist
                    console.warn('Target feed pane ' + targetFeedId + ' not found.');
                }
            }
        });
    });

    // 3. Navigation active state & Tab Switching
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                e.preventDefault();
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');

                if (contentSections.length > 0) {
                    contentSections.forEach(sec => {
                        sec.style.display = 'none';
                        sec.classList.remove('fade-enter');
                    });
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        targetEl.style.display = targetId === 'content-newsfeed' ? 'contents' : 'block';
                        void targetEl.offsetWidth; // Trigger reflow
                        targetEl.classList.add('fade-enter');
                    }
                }
            } else {
                // If it doesn't have a data-target (like in older pages), just switch the active class
                const href = this.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('javascript:')) {
                    // Real link, allow navigation
                    return;
                }
                e.preventDefault();
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // 4. Like button click interaction (Home 1)
    const likeBtns = document.querySelectorAll('.like-trigger');

    likeBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            if (icon && icon.classList.contains('fa-solid')) {
                icon.classList.remove('fa-solid', 'liked');
                icon.classList.add('fa-regular');
                icon.style.color = 'inherit';
            } else if (icon) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid', 'liked');
                icon.style.color = 'var(--red-like)';
            }
        });
    });

    // 4.1 Fire button interaction (Home 2)
    const fireBtns = document.querySelectorAll('.action-bar button:first-child');
    fireBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const icon = this.querySelector('.fa-fire');
            if (icon) {
                if (this.style.color === 'var(--primary)') {
                    this.style.color = 'var(--text-muted)';
                } else {
                    this.style.color = 'var(--primary)';
                }
            }
        });
    });

    // 5. Input 'Send' Interaction demo
    const sendBtn = document.querySelector('.send-btn');
    const inputField = document.querySelector('#create-input');

    if (sendBtn && inputField) {
        sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (inputField.value.trim() !== '') {
                alert('Post shared successfully: ' + inputField.value);
                inputField.value = '';
            }
        });

        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && inputField.value.trim() !== '') {
                alert('Post shared successfully: ' + inputField.value);
                inputField.value = '';
            }
        })
    }

    // 6. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        // Check for saved theme
        const savedTheme = localStorage.getItem('social-dashboard-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeBtn.innerHTML = '<i class="fa-solid fa-sun" style="width: 20px;"></i> Light Mode';
            themeBtn.classList.remove('active');
        } else if (savedTheme === 'light') {
            document.body.classList.remove('dark-mode');
            themeBtn.innerHTML = '<i class="fa-solid fa-moon" style="width: 20px;"></i> Dark Mode';
            themeBtn.classList.add('active');
        } else {
            // No saved theme, check if body has dark-mode pre-applied
            if (document.body.classList.contains('dark-mode')) {
                themeBtn.innerHTML = '<i class="fa-solid fa-sun" style="width: 20px;"></i> Light Mode';
                themeBtn.classList.remove('active');
            }
        }

        themeBtn.addEventListener('click', function (e) {
            e.preventDefault();

            document.body.classList.toggle('dark-mode');

            if (document.body.classList.contains('dark-mode')) {
                themeBtn.innerHTML = '<i class="fa-solid fa-sun" style="width: 20px;"></i> Light Mode';
                themeBtn.classList.remove('active');
                localStorage.setItem('social-dashboard-theme', 'dark');
            } else {
                themeBtn.innerHTML = '<i class="fa-solid fa-moon" style="width: 20px;"></i> Dark Mode';
                themeBtn.classList.add('active');
                localStorage.setItem('social-dashboard-theme', 'light');
            }
        });
    }

    // 7. Generate 100+ Friends
    const friendsContainers = document.querySelectorAll('#content-friends .friends-grid');
    if (friendsContainers.length > 0) {
        const avatars = [
            'images/avatar_5.webp', 'images/avatar_22.webp', 'images/avatar_47.webp',
            'images/avatar_11.webp', 'images/avatar_12.webp', 'images/avatar_33.webp',
            'images/avatar_44.webp', 'images/avatar_60.webp', 'images/avatar_68.webp',
            'images/avatar_8.webp', 'images/avatar_53.webp', 'images/avatar_43.webp',
            'images/unsplash_photo-1542204165-65bf26472b9b.webp'
        ];

        const names = [
            "Emma Watson", "James Smith", "Olivia Johnson", "William Brown",
            "Sophia Jones", "Benjamin Garcia", "Isabella Miller", "Lucas Davis",
            "Mia Rodriguez", "Henry Martinez", "Charlotte Hernandez", "Alexander Lopez",
            "Amelia Gonzalez", "Sebastian Wilson", "Harper Anderson", "Jack Thomas",
            "Evelyn Taylor", "Levi Moore", "Abigail Jackson", "Mateo Martin",
            "Emily Lee", "Theodore Perez", "Elizabeth Thompson", "John White",
            "Sofia Harris", "Owen Clark", "Avery Lewis", "Daniel Robinson",
            "Ella Walker", "Matthew Young", "Scarlett Allen", "Joseph King",
            "Grace Wright", "Samuel Scott", "Chloe Green", "David Baker",
            "Victoria Adams", "Wyatt Nelson", "Riley Hill", "Carter Ramirez",
            "Aria Campbell", "Jayden Mitchell", "Lily Roberts", "Gabriel Campbell",
            "Aubrey Phillips", "Isaac Evans", "Zoey Turner", "Lincoln Torres",
            "Penelope Parker", "Anthony Collins"
        ];

        friendsContainers.forEach(container => {
            let htmlStr = '';
            for (let i = 0; i < 105; i++) {
                const avatar = avatars[i % avatars.length];
                const name = names[i % names.length];
                htmlStr += `
                    <div class="glass-card new-post-st" style="text-align: center; padding: 20px; margin-bottom: 0;">
                        <img src="${avatar}" alt="User" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%; border: 3px solid var(--primary);">
                        <h4 style="margin-top: 10px; color: var(--text-main);">${name}</h4>
                        <a href="404.html" class="gradient-btn" style="width: 100%; margin-top: 15px; padding: 5px; display: block; text-decoration: none; text-align: center; color: white;">Message</a>
                    </div>
                `;
            }
            container.innerHTML = htmlStr;
        });
    }

    // 8. Infinite Scroll Logic
    const initInfiniteScroll = (loaderId, isMasonry) => {
        let loader = document.getElementById(loaderId);

        if (!loader) {
            loader = document.createElement('div');
            loader.id = loaderId;
            loader.style.width = '100%';
            loader.style.padding = '20px';
            loader.style.textAlign = 'center';
            loader.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--primary);"></i>';
            const newsfeed = document.getElementById('content-newsfeed');
            if (newsfeed) {
                newsfeed.appendChild(loader);
            } else {
                return;
            }
        }

        let isLoading = false;

        const loadMorePosts = () => {
            if (isLoading) return;
            isLoading = true;
            loader.style.display = 'block';

            // Find the active feed container
            let feedContainer;
            if (isMasonry) {
                // For Home 2 (Masonry Layout)
                feedContainer = document.querySelector('#content-newsfeed .feed-content-pane[style*="display: block"]') || document.querySelector('#content-newsfeed .feed-content-pane.active-pane') || document.querySelector('#content-newsfeed .masonry-grid');
            } else {
                // For Home 1 (List Layout)
                feedContainer = document.querySelector('#content-newsfeed .feed-content-pane[style*="display: block"]') || document.querySelector('#content-newsfeed .feed-content-pane.active-pane');
            }

            if (!feedContainer) {
                isLoading = false;
                loader.style.display = 'none';
                return;
            }

            // Simulate network delay
            setTimeout(() => {
                const existingPosts = feedContainer.querySelectorAll(isMasonry ? '.new-post-st' : '.post-card');
                if (existingPosts.length === 0) {
                    isLoading = false;
                    loader.style.display = 'none';
                    return;
                }

                // Clone 3 random posts to simulate new content
                const fragment = document.createDocumentFragment();
                for (let i = 0; i < 3; i++) {
                    const randomIndex = Math.floor(Math.random() * existingPosts.length);
                    const clone = existingPosts[randomIndex].cloneNode(true);

                    // Re-bind like logic if it's Home 1
                    if (!isMasonry) {
                        const likeTrigger = clone.querySelector('.like-trigger');
                        if (likeTrigger) {
                            likeTrigger.addEventListener('click', function (e) {
                                e.preventDefault();
                                const icon = this.querySelector('i');
                                if (icon && icon.classList.contains('fa-solid')) {
                                    icon.classList.remove('fa-solid', 'liked');
                                    icon.classList.add('fa-regular');
                                    icon.style.color = 'inherit';
                                } else if (icon) {
                                    icon.classList.remove('fa-regular');
                                    icon.classList.add('fa-solid', 'liked');
                                    icon.style.color = 'var(--red-like)';
                                }
                            });
                        }
                    } else {
                        // Re-bind fire logic for Home 2
                        const fireBtn = clone.querySelector('.action-bar button:first-child');
                        if (fireBtn) {
                            fireBtn.addEventListener('click', function (e) {
                                e.preventDefault();
                                const icon = this.querySelector('.fa-fire');
                                if (icon) {
                                    if (this.style.color === 'var(--primary)') {
                                        this.style.color = 'var(--text-muted)';
                                    } else {
                                        this.style.color = 'var(--primary)';
                                    }
                                }
                            });
                        }
                    }

                    fragment.appendChild(clone);
                }

                if (isMasonry && feedContainer.contains(loader)) {
                    // For Home 2, insert before the loader/creator panel if loader is inside container
                    feedContainer.insertBefore(fragment, loader);
                } else if (!isMasonry) {
                    // For Home 1
                    feedContainer.appendChild(fragment);
                } else {
                    feedContainer.appendChild(fragment);
                }

                isLoading = false;
                loader.style.display = 'none';
            }, 1000); // 1 second fake loading time
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMorePosts();
            }
        }, { rootMargin: '100px' });

        observer.observe(loader);
    };

    // Initialize for Home 1 (index.html)
    initInfiniteScroll('infinite-scroll-loader', false);

    // Initialize for Home 2 (home2.html) -> .masonry-grid is the container
    initInfiniteScroll('infinite-scroll-loader-home2', true);

});
