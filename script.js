// ===========================================
// NAVIGATION FUNCTIONALITY
// ===========================================

// Get navigation elements
const header = document.getElementById('header');
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');
const navLinkElements = document.querySelectorAll('.nav-link');

// Mobile menu toggle functionality
mobileToggle.addEventListener('click', function() {
    // Toggle active states
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking on nav links
navLinkElements.forEach(link => {
    link.addEventListener('click', function() {
        // Close mobile menu
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const isClickInsideNav = navLinks.contains(event.target) || mobileToggle.contains(event.target);
    
    if (!isClickInsideNav && navLinks.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close mobile menu on window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const scrolled = window.scrollY > 100;
    
    if (scrolled) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===========================================
// SMOOTH SCROLLING FUNCTIONALITY
// ===========================================

// Smooth scrolling for navigation with easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            // Smooth scroll with custom easing
            smoothScrollTo(targetPosition, 1000);
        }
    });
});

// Custom smooth scroll function with easing
function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
}

// ===========================================
// HERO SECTION ANIMATIONS
// ===========================================

// Animated counter for hero metrics
function animateCounter(elementId, targetValue, suffix = '', duration = 2000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const startTime = Date.now();
    const startValue = parseFloat(element.textContent) || 0;
    
    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        current = startValue + (targetValue - startValue) * easeOutQuart;
        
        // Format the number based on type
        if (suffix === '%') {
            element.textContent = Math.floor(current) + suffix;
        } else {
            element.textContent = (Math.floor(current * 10) / 10) + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetValue + suffix;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Start counter animations when hero section is visible
function startHeroAnimations() {
    const heroSection = document.querySelector('.hero');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    animateCounter('carbon-today', 2.4);
                    animateCounter('monthly-trend', -12, '%');
                }, 500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    if (heroSection) {
        observer.observe(heroSection);
    }
}

// ===========================================
// CARBON CALCULATOR FUNCTIONALITY
// ===========================================

// Interactive carbon calculator
function calculateCarbon() {
    const activityType = document.getElementById('activity-type').value;
    const amount = parseFloat(document.getElementById('activity-amount').value) || 0;
    const resultDiv = document.getElementById('carbon-result');
    const amountSpan = document.getElementById('carbon-amount');
    const tipDiv = document.getElementById('carbon-tip');

    if (!activityType || amount <= 0) {
        showAlert('Please select an activity and enter a valid amount!', 'warning');
        return;
    }

    // Carbon calculation factors (kg CO2 equivalent)
    const carbonFactors = {
        transport: 0.2,   // per km (average car)
        energy: 0.4,      // per kWh
        food: 2.5,        // per meal (average)
        shopping: 5.0     // per item (average consumer goods)
    };

    // Environmental tips for each activity
    const tips = {
        transport: "💡 Try walking, cycling, or using public transport to reduce emissions!",
        energy: "💡 Switch to LED bulbs and unplug devices when not in use.",
        food: "💡 Consider plant-based meals - they have a lower carbon footprint!",
        shopping: "💡 Buy only what you need and choose sustainable brands."
    };

    const carbonAmount = (amount * carbonFactors[activityType]).toFixed(2);
    
    // Show result with animation
    resultDiv.style.display = 'block';
    resultDiv.style.opacity = '0';
    resultDiv.style.transform = 'scale(0.9) translateY(20px)';
    
    setTimeout(() => {
        amountSpan.textContent = carbonAmount;
        tipDiv.textContent = tips[activityType];
        
        resultDiv.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        resultDiv.style.opacity = '1';
        resultDiv.style.transform = 'scale(1) translateY(0)';
        
        // Animate the carbon value
        animateCounterValue(amountSpan, 0, parseFloat(carbonAmount), 1000);
    }, 100);

    // Add some visual feedback for the button
    const calculateBtn = event.target;
    calculateBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        calculateBtn.style.transform = '';
    }, 150);
}

// Animate counter value for carbon display
function animateCounterValue(element, start, end, duration) {
    const startTime = Date.now();
    
    function updateValue() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const current = start + (end - start) * easeOutQuart;
        element.textContent = current.toFixed(2);
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        } else {
            element.textContent = end.toFixed(2);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Show alert messages
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'warning' ? '#ff6b6b' : '#00d4aa'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    // Animate in
    setTimeout(() => {
        alert.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alert.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 300);
    }, 3000);
}

// ===========================================
// SCROLL ANIMATIONS
// ===========================================

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .dashboard-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Add CSS for animate-in class
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .feature-card:nth-child(even).animate-in {
            transition-delay: 0.1s;
        }
        
        .feature-card:nth-child(odd).animate-in {
            transition-delay: 0.2s;
        }
    `;
    document.head.appendChild(style);
}

// ===========================================
// PERFORMANCE OPTIMIZATIONS
// ===========================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    const scrolled = window.scrollY > 100;
    header.classList.toggle('scrolled', scrolled);
}, 10);

// ===========================================
// INITIALIZATION
// ===========================================

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start hero animations
    startHeroAnimations();
    
    // Initialize scroll animations
    initScrollAnimations();
    addAnimationStyles();
    
    // Replace default scroll handler with optimized version
    window.removeEventListener('scroll', window.addEventListener);
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .cta-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });
    
    console.log('🌱 EcoTrack initialized successfully!');
});

// Handle form submissions
document.addEventListener('submit', function(e) {
    e.preventDefault();
    showAlert('Feature coming soon! Thanks for your interest.', 'info');
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===========================================
// GLOBAL ERROR HANDLING
// ===========================================

// Handle JavaScript errors gracefully
window.addEventListener('error', function(e) {
    console.error('EcoTrack Error:', e.error);
    // Don't show errors to users in production
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault();
});