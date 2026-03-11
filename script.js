window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 800); // Artificial delay to show animation
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // 1. GLOBAL EVENT DELEGATION
    // This handles clicks on buttons for both static and dynamically loaded posts
    document.addEventListener('click', function (e) {
        // A. Follow Buttons Toggle
        const followBtn = e.target.closest('.follow-btn');
        if (followBtn) {
            e.preventDefault();
            if (followBtn.classList.contains('following')) {
                followBtn.classList.remove('following');
                followBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Follow';
            } else {
                followBtn.classList.add('following');
                followBtn.innerHTML = '<i class="fa-solid fa-user-check"></i> Following';
            }
            return;
        }

        // B. Like trigger (Home 1)
        const likeBtn = e.target.closest('.like-trigger');
        if (likeBtn) {
            e.preventDefault();
            const icon = likeBtn.querySelector('i');
            if (icon && icon.classList.contains('fa-solid')) {
                icon.classList.remove('fa-solid', 'liked');
                icon.classList.add('fa-regular');
                icon.style.color = 'inherit';
            } else if (icon) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid', 'liked');
                icon.style.color = 'var(--red-like)';
            }
            return;
        }

        // C. Fire button interaction (Home 2)
        const fireBtn = e.target.closest('.action-bar button:first-child');
        if (fireBtn && fireBtn.querySelector('.fa-fire')) {
            e.preventDefault();
            if (fireBtn.style.color === 'var(--primary)' || fireBtn.style.color === 'rgb(79, 70, 229)') {
                fireBtn.style.color = 'var(--text-muted)';
            } else {
                fireBtn.style.color = 'var(--primary)';
            }
            return;
        }

        // D. Comment Icon Toggle
        const commentLink = e.target.closest('.fa-comment');
        if (commentLink) {
            const btn = commentLink.closest('.stat');
            if (btn) {
                const postCard = btn.closest('.post-card') || btn.closest('.new-post-st');
                if (postCard) {
                    let commentArea = postCard.querySelector('.comment-section-wrapper');
                    
                    // If doesn't exist (e.g. infinite scroll cloned post without section), create it
                    if (!commentArea) {
                        commentArea = document.createElement('div');
                        commentArea.className = 'comment-section-wrapper';
                        commentArea.innerHTML = `
                            <div class="comment-input-area">
                                <img src="https://i.pravatar.cc/150?img=11" alt="Me" class="comment-avatar">
                                <input type="text" placeholder="Write a comment..." class="comment-input-box">
                                <button class="comment-submit-btn" onclick="window.location.href='404.html'">Send</button>
                            </div>
                        `;
                        postCard.appendChild(commentArea);
                    }

                    // Toggle visibility
                    if (window.getComputedStyle(commentArea).display === 'block') {
                        commentArea.style.display = 'none';
                    } else {
                        commentArea.style.display = 'block';
                        const input = commentArea.querySelector('.comment-input-box');
                        if (input) input.focus();
                    }
                }
            }
            return;
        }
    });

    // 2. Feed Tabs Logic (Home 1)
    const tabs = document.querySelectorAll('.feed-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const tabId = this.id; 
            if (tabId) {
                const targetFeedId = tabId.replace('tab-', 'feed-');
                const targetFeed = document.getElementById(targetFeedId);
                const allFeeds = document.querySelectorAll('.feed-content-pane');

                if (targetFeed) {
                    allFeeds.forEach(feed => {
                        feed.style.display = (feed.id === targetFeedId) ? 'block' : 'none';
                    });
                }
            }
        });
    });

    // 3. Navigation Tab Switching
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                e.preventDefault();
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');

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
        });
    });

    // 4. Input 'Send' Interaction (News Feed Creator)
    const sendBtn = document.querySelector('.send-btn');
    const inputField = document.querySelector('#create-input');

    if (sendBtn && inputField) {
        const handleSend = (e) => {
            if (inputField.value.trim() !== '') {
                alert('Post shared successfully: ' + inputField.value);
                inputField.value = '';
            }
        };
        sendBtn.addEventListener('click', handleSend);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    // 5. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const updateThemeUI = (isDark) => {
            document.body.classList.toggle('dark-mode', isDark);
            themeBtn.innerHTML = isDark 
                ? '<i class="fa-solid fa-sun" style="width: 20px;"></i> Light Mode'
                : '<i class="fa-solid fa-moon" style="width: 20px;"></i> Dark Mode';
            themeBtn.classList.toggle('active', !isDark);
        };

        const currentTheme = localStorage.getItem('social-dashboard-theme') || (document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        updateThemeUI(currentTheme === 'dark');

        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isDark = !document.body.classList.contains('dark-mode');
            updateThemeUI(isDark);
            localStorage.setItem('social-dashboard-theme', isDark ? 'dark' : 'light');
        });
    }

    // 6. Generate Friends (Static Friends Tab)
    const friendsContainers = document.querySelectorAll('#content-friends .friends-grid');
    if (friendsContainers.length > 0) {
        const avatars = [
            'images/refresh_avatar_1.webp', 'images/refresh_avatar_2.webp', 'images/refresh_avatar_3.webp',
            'images/refresh_avatar_4.webp', 'images/refresh_avatar_5.webp', 'images/refresh_avatar_6.webp',
            'images/refresh_avatar_7.webp', 'images/refresh_avatar_8.webp', 'images/refresh_avatar_9.webp',
            'images/refresh_avatar_10.webp', 'images/refresh_avatar_11.webp', 'images/refresh_avatar_12.webp',
            'images/refresh_avatar_13.webp', 'images/refresh_avatar_14.webp', 'images/refresh_avatar_15.webp'
        ];
        const names = [
            "Emma Watson", "James Smith", "Olivia Johnson", "William Brown", "Sophia Jones", 
            "Lucas Davis", "Isabella Martinez", "Ethan Hunt", "Mia Garcia", "Alexander Wright",
            "Charlotte Moore", "Benjamin Taylor", "Amelia Anderson", "Daniel Thomas", "Chloe Jackson"
        ];

        friendsContainers.forEach(container => {
            let htmlStr = '';
            for (let i = 0; i < 15; i++) {
                const avatar = avatars[i];
                const name = names[i];
                htmlStr += `
                    <div class="glass-card new-post-st" style="text-align: center; padding: 20px;">
                        <img src="${avatar}" alt="User" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%; border: 3px solid var(--primary);">
                        <h4 style="margin-top: 10px; color: var(--text-main);">${name}</h4>
                        <a href="404.html" class="gradient-btn" style="width: 100%; margin-top: 15px; padding: 5px; display: block; text-decoration: none; color: white;">Message</a>
                    </div>
                `;
            }
            container.innerHTML = htmlStr;
        });
    }

    // 7. Infinite Scroll Logic
    const initInfiniteScroll = (loaderId, isMasonry) => {
        let loader = document.getElementById(loaderId);
        if (!loader) return;

        let isLoading = false;
        const loadMorePosts = () => {
            if (isLoading) return;
            isLoading = true;
            loader.style.display = 'block';

            let feedContainer = document.querySelector('#content-newsfeed .feed-content-pane[style*="display: block"]') 
                               || document.querySelector('#content-newsfeed .feed-content-pane.active-pane')
                               || document.querySelector('#content-newsfeed .masonry-grid');

            if (!feedContainer) {
                isLoading = false;
                loader.style.display = 'none';
                return;
            }

            setTimeout(() => {
                const existingPosts = feedContainer.querySelectorAll(isMasonry ? '.new-post-st' : '.post-card');
                if (existingPosts.length > 0) {
                    const fragment = document.createDocumentFragment();
                    for (let i = 0; i < 3; i++) {
                        const randomIndex = Math.floor(Math.random() * existingPosts.length);
                        const clone = existingPosts[randomIndex].cloneNode(true);
                        
                        // We remove any existing comment sections in the clone to avoid duplication
                        const existingComment = clone.querySelector('.comment-section-wrapper');
                        if (existingComment) existingComment.remove();
                        
                        fragment.appendChild(clone);
                    }
                    if (isMasonry) {
                        feedContainer.insertBefore(fragment, loader);
                    } else {
                        feedContainer.appendChild(fragment);
                    }
                }
                isLoading = false;
                loader.style.display = 'none';
            }, 1000);
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) loadMorePosts();
        }, { rootMargin: '100px' });
        observer.observe(loader);
    };

    initInfiniteScroll('infinite-scroll-loader', false);
    initInfiniteScroll('infinite-scroll-loader-home2', true);

    // 8. Dynamic Comment Section Injection for Initial Posts
    const addCommentSections = () => {
        const posts = document.querySelectorAll('.post-card, .new-post-st');
        posts.forEach(post => {
            if (!post.querySelector('.comment-section-wrapper') && post.querySelector('.fa-comment')) {
                const commentSection = document.createElement('div');
                commentSection.className = 'comment-section-wrapper';
                commentSection.innerHTML = `
                    <div class="comment-input-area">
                        <img src="https://i.pravatar.cc/150?img=11" alt="Me" class="comment-avatar">
                        <input type="text" placeholder="Write a comment..." class="comment-input-box">
                        <button class="comment-submit-btn" onclick="window.location.href='404.html'">Send</button>
                    </div>
                `;
                post.appendChild(commentSection);
            }
        });
    };
    addCommentSections();
});
