// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('mobile-open');
        navActions.classList.toggle('mobile-open');
    });
}

// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    lastScrollY = window.scrollY;
});

// ===== Pricing Toggle =====
const toggleSwitch = document.querySelector('.toggle-switch');
const toggleLabels = document.querySelectorAll('.toggle-label');
const priceAmounts = document.querySelectorAll('.price-amount');

const prices = {
    monthly: ['9', '19', 'Na mieru'],
    yearly: ['7', '15', 'Na mieru']
};

if (toggleSwitch) {
    let isYearly = false;
    
    toggleSwitch.addEventListener('click', () => {
        isYearly = !isYearly;
        
        // Update slider position
        const slider = toggleSwitch.querySelector('.toggle-slider');
        slider.style.left = isYearly ? '27px' : '3px';
        
        // Update active label
        toggleLabels.forEach((label, index) => {
            label.classList.toggle('active', (index === 0 && !isYearly) || (index === 1 && isYearly));
        });
        
        // Update prices with animation
        priceAmounts.forEach((amount, index) => {
            amount.style.opacity = '0';
            amount.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                amount.textContent = isYearly ? prices.yearly[index] : prices.monthly[index];
                amount.style.opacity = '1';
                amount.style.transform = 'translateY(0)';
            }, 150);
        });
    });
    
    // Add transition styles
    priceAmounts.forEach(amount => {
        amount.style.transition = 'all 0.3s ease';
    });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            mobileMenuBtn?.classList.remove('active');
            navLinks?.classList.remove('mobile-open');
            navActions?.classList.remove('mobile-open');
        }
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in animation to elements
document.querySelectorAll('.feature-card, .step-card, .testimonial-card, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// Add visible class styles
const style = document.createElement('style');
style.textContent = `
    .fade-in-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Stagger animation for grid items
document.querySelectorAll('.features-grid, .testimonials-grid, .pricing-grid').forEach(grid => {
    const items = grid.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
    items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
});

// ===== Counter Animation for Stats =====
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// Observe stat numbers
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target;
            const targetText = statNumber.textContent;
            const targetNumber = parseInt(targetText.replace(/\D/g, ''));
            const suffix = targetText.replace(/[\d]/g, '');
            
            if (!isNaN(targetNumber)) {
                statNumber.textContent = '0' + suffix;
                
                const animate = () => {
                    const start = 0;
                    const duration = 2000;
                    const startTime = performance.now();
                    
                    const step = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        const currentNumber = Math.floor(easeProgress * targetNumber);
                        
                        statNumber.textContent = currentNumber + suffix;
                        
                        if (progress < 1) {
                            requestAnimationFrame(step);
                        }
                    };
                    
                    requestAnimationFrame(step);
                };
                
                animate();
            }
            
            statsObserver.unobserve(statNumber);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

// ===== Dashboard Animation =====
const animateDashboard = () => {
    const bars = document.querySelectorAll('.chart-bars .bar');
    
    bars.forEach((bar, index) => {
        const originalHeight = bar.style.height;
        bar.style.height = '0%';
        bar.style.transition = 'height 0.8s ease';
        
        setTimeout(() => {
            bar.style.height = originalHeight;
        }, 500 + (index * 100));
    });
};

// Animate dashboard on load
window.addEventListener('load', () => {
    setTimeout(animateDashboard, 500);
});

// ===== Form Handling (for future use) =====
const handleFormSubmit = (formElement, callback) => {
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Add loading state
            const submitBtn = formElement.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Odosielam...';
            
            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success
            if (callback) callback(data);
            
            // Reset form
            formElement.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
        } catch (error) {
            console.error('Form submission error:', error);
        }
    });
};

// ===== Initialize =====
console.log('Worktune.ai landing page initialized');
