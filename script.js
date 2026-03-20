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
            fireBtn.classList.toggle('active-fire');
            if (fireBtn.classList.contains('active-fire')) {
                fireBtn.style.color = 'var(--primary)';
            } else {
                fireBtn.style.color = 'var(--text-muted)';
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
                                <img src="images/refresh_avatar_11.webp" alt="Me" class="comment-avatar">
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

        // E. More Button Toggle (Dropdown)
        const moreBtn = e.target.closest('.more-btn');
        if (moreBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close any other open ones first
            document.querySelectorAll('.more-btn-dropdown.open').forEach(d => {
                if (!moreBtn.parentElement.contains(d)) {
                    d.classList.remove('open');
                    const post = d.closest('.post-card');
                    if (post) post.classList.remove('menu-open');
                }
            });

            // Ensure dropdown exists
            let dropdown = moreBtn.parentElement.querySelector('.more-btn-dropdown');
            if (!dropdown) {
                // If it's not wrapped yet, wrap it dynamically for better UX
                if (!moreBtn.parentElement.classList.contains('more-wrapper')) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'more-wrapper';
                    moreBtn.parentNode.insertBefore(wrapper, moreBtn);
                    wrapper.appendChild(moreBtn);
                    
                    dropdown = document.createElement('div');
                    dropdown.className = 'more-btn-dropdown';
                    dropdown.innerHTML = `
                        <a href="404.html" class="dropdown-item"><i class="fa-regular fa-bookmark"></i> Save Post</a>
                        <a href="404.html" class="dropdown-item"><i class="fa-solid fa-ban"></i> Not Interested</a>
                        <a href="404.html" class="dropdown-item"><i class="fa-regular fa-flag"></i> Report Post</a>
                        <a href="404.html" class="dropdown-item hide-post-trigger" style="color: var(--red-like);"><i class="fa-solid fa-trash-can"></i> Hide Post</a>
                    `;
                    wrapper.appendChild(dropdown);
                }
            }

            // Toggle open class
            if (dropdown) {
                const isOpen = dropdown.classList.toggle('open');
                const container = dropdown.closest('.post-card') || dropdown.closest('.glass-card');
                if (container) {
                    if (isOpen) container.classList.add('menu-open');
                    else container.classList.remove('menu-open');
                }
            }
            return;
        }

        // Close dropdowns if clicking elsewhere
        if (!e.target.closest('.more-btn-dropdown')) {
            document.querySelectorAll('.more-btn-dropdown.open').forEach(d => {
                d.classList.remove('open');
                const container = d.closest('.post-card') || d.closest('.glass-card');
                if (container) container.classList.remove('menu-open');
            });
        }
    });

    // Handle Scroll Closing (Optional but good for fixed headers/sidebars)
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.more-btn-dropdown.open').forEach(d => d.classList.remove('open'));
    }, { passive: true });

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
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('drawer-overlay');

    function switchTab(targetId) {
        if (!targetId) return;
        
        // Update sidebar active states
        navItems.forEach(nav => {
            if (nav.getAttribute('data-target') === targetId) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });

        contentSections.forEach(sec => {
            sec.classList.remove('active', 'fade-enter');
        });

        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            targetEl.classList.add('active', 'fade-enter');
            
            // Trigger reflow
            void targetEl.offsetWidth; 

            // Scroll to the content area on mobile
            if (window.innerWidth <= 1024) {
                const contentArea = targetEl;
                const offset = contentArea.offsetTop - 100; // Leave some space for the top nav
                window.scrollTo({ top: offset > 0 ? offset : 0, behavior: 'smooth' });
            }
        }
    }

    // Attach to nav items
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            const targetId = this.getAttribute('data-target');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                switchTab(targetId);
                // Update URL hash without jumping
                history.pushState(null, null, '#' + targetId.replace('content-', ''));
            }
        });
    });


    // Handle Hash Navigation (e.g., from footer links on other pages)
    function handleHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetId = 'content-' + hash;
            switchTab(targetId);
        }
    }

    window.addEventListener('hashchange', handleHash);
    // Handle Global Redirects to 404 (Comments & Specific Footer Sections)
    document.addEventListener('click', (e) => {
        // 1. Handle Comment Clicks
        const actionBtn = e.target.closest('.action-btn, .stat, .comment-submit-btn');
        if (actionBtn && (actionBtn.innerText.includes('Comment') || actionBtn.innerText.includes('Send') && actionBtn.classList.contains('comment-submit-btn'))) {
            e.preventDefault();
            window.location.href = '404.html';
            return;
        }

        // 2. Handle Footer Section Links (Explore & Legal & Support)
        const footerLink = e.target.closest('.footer-col a');
        if (footerLink) {
            const sectionHeader = footerLink.closest('.footer-col').querySelector('h4');
            if (sectionHeader) {
                const headerText = sectionHeader.innerText;
                if (headerText.includes('Explore') || headerText.includes('Legal')) {
                    e.preventDefault();
                    window.location.href = '404.html';
                }
            }
        }
    });

    handleHash(); // Initial check

    // 4. Input 'Send' Interaction (News Feed Creator)
    const setupPostValidation = (btnSelector, inputSelector) => {
        const btn = document.querySelector(btnSelector);
        const input = document.querySelector(inputSelector);

        if (btn && input) {
            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = 'validation-tooltip';
            tooltip.innerText = 'Please fill this slot';
            
            // Ensure parent has relative positioning
            const parent = input.parentElement;
            if (parent) {
                parent.style.position = 'relative';
                parent.appendChild(tooltip);
            }

            let tooltipTimeout;

            const showTooltip = () => {
                tooltip.classList.add('show');
                clearTimeout(tooltipTimeout);
                tooltipTimeout = setTimeout(() => {
                    tooltip.classList.remove('show');
                }, 3000);
            };

            const handleSend = () => {
                const val = input.value.trim();
                if (val === '') {
                    showTooltip();
                    input.focus();
                } else {
                    window.location.href = '404.html';
                }
            };

            btn.addEventListener('click', handleSend);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            });

            // Hide tooltip when typing
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    tooltip.classList.remove('show');
                }
            });
        }
    };

    setupPostValidation('.send-btn', '#create-input'); // Home 1
    setupPostValidation('.create-panel .gradient-btn', '#create-input-home2'); // Home 2

    // 5. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const updateThemeUI = (isDark) => {
            document.body.classList.toggle('dark-mode', isDark);
            themeBtn.innerHTML = isDark 
                ? '<i class="fa-solid fa-sun" style="width: 20px;"></i> <span>Light Mode</span>'
                : '<i class="fa-solid fa-moon" style="width: 20px;"></i> <span>Dark Mode</span>';
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
                        <img src="${avatar}" alt="User" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%; border: 3px solid var(--primary); margin-bottom: 10px;">
                        <h4 style="color: var(--text-main); font-size: 1.1rem;">${name}</h4>
                        <a href="404.html" class="gradient-btn" style="width: 100%; margin-top: 20px; padding: 10px 15px; display: block; text-decoration: none; color: white;">Message</a>
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

            let feedContainer = document.querySelector('#content-newsfeed .feed-content-pane.active-pane')
                               || document.querySelector('#content-newsfeed .feed-content-pane:not([style*="display: none"])')
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
                        // For Masonry, we need to append to the grid carefully
                        fragment.childNodes.forEach(node => {
                            if (node.nodeType === 1) { // ELEMENT_NODE
                                feedContainer.insertBefore(node.cloneNode(true), loader);
                            }
                        });
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
                        <img src="images/refresh_avatar_11.webp" alt="Me" class="comment-avatar">
                        <input type="text" placeholder="Write a comment..." class="comment-input-box">
                        <button class="comment-submit-btn" onclick="window.location.href='404.html'">Send</button>
                    </div>
                `;
                post.appendChild(commentSection);
            }
        });
    };
    // 8. Mobile Drawer Logic
    const drawerTrigger = document.getElementById('mobile-drawer-trigger');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const sidebarElement = document.querySelector('.sidebar');

    if (drawerTrigger && drawerOverlay && sidebarElement) {
        const toggleDrawer = (isOpen) => {
            sidebarElement.classList.toggle('open', isOpen);
            drawerOverlay.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        drawerTrigger.addEventListener('click', () => toggleDrawer(true));
        drawerOverlay.addEventListener('click', () => toggleDrawer(false));

        // Close on nav click (mobile focus)
        sidebarElement.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    toggleDrawer(false);
                }
            });
        });
    }

    // 9. Name Input Validation (Alphabets only)
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');

    if (firstNameInput) {
        firstNameInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
        });
    }
    if (lastNameInput) {
        lastNameInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
        });
    }

    addCommentSections();
});
