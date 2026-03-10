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
        btn.addEventListener('click', function () {
            if (this.classList.contains('following')) {
                this.classList.remove('following');
                this.innerText = 'Follow';
            } else {
                this.classList.add('following');
                this.innerText = 'Following';
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
                const allFeeds = document.querySelectorAll('.feed-content-pane');

                allFeeds.forEach(feed => {
                    if (feed.id === targetFeedId) {
                        feed.style.display = 'block';
                    } else {
                        feed.style.display = 'none';
                    }
                });
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
                    contentSections.forEach(sec => sec.style.display = 'none');
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        targetEl.style.display = targetId === 'content-newsfeed' ? 'contents' : 'block';
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

    // 4. Like button click interaction
    const likeBtn = document.querySelector('.like-trigger');

    if (likeBtn) {
        likeBtn.addEventListener('click', function () {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-solid')) {
                icon.classList.remove('fa-solid', 'liked');
                icon.classList.add('fa-regular');
                icon.style.color = 'inherit';
            } else {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid', 'liked');
                icon.style.color = 'var(--red-like)';
            }
        });
    }

    // 5. Input 'Send' Interaction demo
    const sendBtn = document.querySelector('.send-btn');
    const inputField = document.querySelector('#create-input');

    if (sendBtn && inputField) {
        sendBtn.addEventListener('click', () => {
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

});
