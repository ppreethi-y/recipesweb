document.addEventListener('DOMContentLoaded', function() {
    // Loading screen
    setTimeout(function() {
        document.querySelector('.loading-screen').classList.add('hidden');
    }, 1500);

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeMobileMenu = document.querySelector('.close-mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeMobileMenu.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Favorites functionality
    const favoritesIcon = document.querySelector('.favorites-icon');
    const favoritesPopup = document.querySelector('.favorites-popup');
    const favoritesOverlay = document.querySelector('.favorites-overlay');
    const closeFavorites = document.querySelector('.close-favorites');
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    const favoritesList = document.querySelector('.favorites-list');
    const favoritesCount = document.querySelector('.favorites-count');
    
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Update favorites count
    function updateFavoritesCount() {
        favoritesCount.textContent = favorites.length;
    }
    
    // Update favorite buttons state
    function updateFavoriteButtons() {
        favoriteBtns.forEach(btn => {
            const recipeId = btn.getAttribute('data-recipe');
            if (favorites.some(item => item.id === recipeId)) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    }
    
    // Render favorites list
    function renderFavoritesList() {
        if (favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="empty-favorites">
                    <i class="far fa-heart"></i>
                    <p>You haven't saved any recipes yet</p>
                    <a href="#" class="btn">Browse Recipes</a>
                </div>
            `;
            return;
        }
        
        favoritesList.innerHTML = favorites.map(item => `
            <div class="favorite-item" data-recipe="${item.id}">
                <div class="favorite-item-img">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="favorite-item-info">
                    <h4>${item.title}</h4>
                    <div class="favorite-item-meta">
                        <span><i class="far fa-clock"></i> ${item.time}</span>
                        <button class="remove-favorite" data-recipe="${item.id}">
                            <i class="fas fa-trash-alt"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const recipeId = this.getAttribute('data-recipe');
                removeFromFavorites(recipeId);
            });
        });
        
        // Add click event to favorite items
        document.querySelectorAll('.favorite-item').forEach(item => {
            item.addEventListener('click', function() {
                // Here you would navigate to the recipe page
                console.log('Viewing recipe:', this.getAttribute('data-recipe'));
            });
        });
    }
    
    // Add to favorites
    function addToFavorites(recipeId, title, image, time) {
        if (!favorites.some(item => item.id === recipeId)) {
            favorites.push({
                id: recipeId,
                title: title,
                image: image,
                time: time
            });
            saveFavorites();
            updateFavoritesCount();
            updateFavoriteButtons();
            renderFavoritesList();
            
            // Show added notification
            showNotification('Recipe added to favorites!');
        }
    }
    
    // Remove from favorites
    function removeFromFavorites(recipeId) {
        favorites = favorites.filter(item => item.id !== recipeId);
        saveFavorites();
        updateFavoritesCount();
        updateFavoriteButtons();
        renderFavoritesList();
        
        // Show removed notification
        showNotification('Recipe removed from favorites');
    }
    
    // Save favorites to localStorage
    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    // Toggle favorites popup
    favoritesIcon.addEventListener('click', function() {
        favoritesPopup.classList.add('active');
        favoritesOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeFavorites.addEventListener('click', function() {
        favoritesPopup.classList.remove('active');
        favoritesOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    favoritesOverlay.addEventListener('click', function() {
        favoritesPopup.classList.remove('active');
        favoritesOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Favorite button click handlers
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = this.getAttribute('data-recipe');
            const recipeCard = this.closest('.recipe-card, .rotd-content');
            const title = recipeCard.querySelector('h3').textContent;
            const image = recipeCard.querySelector('img').src;
            const time = recipeCard.querySelector('.recipe-time, .rotd-meta span:first-child')?.textContent || 'N/A';
            
            if (this.classList.contains('active')) {
                removeFromFavorites(recipeId);
            } else {
                addToFavorites(recipeId, title, image, time);
            }
        });
    });
    
    // Initialize
    updateFavoritesCount();
    updateFavoriteButtons();
    renderFavoritesList();
    
    // Search functionality
    const searchBar = document.querySelector('.search-bar input');
    const searchResults = document.querySelector('.search-results');
    
    // Mock search data - in a real app, this would come from an API
    const recipes = [
        { id: '1', title: 'Pasta Carbonara', category: 'Italian', time: '25 mins' },
        { id: '2', title: 'Classic Beef Burger', category: 'American', time: '30 mins' },
        { id: '3', title: 'Chocolate Cake', category: 'Dessert', time: '1 hour' },
        { id: '4', title: 'Margherita Pizza', category: 'Italian', time: '45 mins' },
        { id: '5', title: 'Caesar Salad', category: 'Salad', time: '15 mins' },
        { id: '6', title: 'Vegetable Stir Fry', category: 'Vegetarian', time: '20 mins' },
        { id: '7', title: 'Pancakes', category: 'Breakfast', time: '25 mins' },
        { id: '8', title: 'Chicken Curry', category: 'Indian', time: '40 mins' }
    ];
    
    searchBar.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }
        
        const results = recipes.filter(recipe => 
            recipe.title.toLowerCase().includes(query) || 
            recipe.category.toLowerCase().includes(query)
        );
        
        if (results.length > 0) {
            searchResults.innerHTML = results.map(recipe => `
                <a href="#" data-recipe="${recipe.id}">
                    <div class="search-result-item">
                        <h4>${recipe.title}</h4>
                        <span>${recipe.category} • ${recipe.time}</span>
                    </div>
                </a>
            `).join('');
            
            // Add click handlers to search results
            searchResults.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    // Here you would navigate to the recipe page
                    console.log('Viewing recipe:', this.getAttribute('data-recipe'));
                    searchResults.classList.remove('active');
                    searchBar.value = '';
                });
            });
            
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = '<div class="no-results">No recipes found</div>';
            searchResults.classList.add('active');
        }
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchBar.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('animate__fadeIn');
        } else {
            backToTopBtn.classList.remove('animate__fadeIn');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // GSAP animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    gsap.utils.toArray('.animate__animated').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out"
        });
    });
    
    // Hero content animation
    const heroContent = document.querySelector('.hero-content');
    gsap.from(heroContent.children, {
        duration: 1,
        opacity: 0,
        y: 30,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5
    });
    
    // Recipe cards animation
    const recipeCards = document.querySelectorAll('.recipe-card, .category-card');
    recipeCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            ease: "back.out(1.7)"
        });
    });
    
    // Recipe of the day animation
    const rotdContent = document.querySelector('.rotd-content');
    if (rotdContent) {
        gsap.from(rotdContent, {
            scrollTrigger: {
                trigger: rotdContent,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 100,
            duration: 1,
            ease: "power3.out"
        });
    }
    
    // Notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
});