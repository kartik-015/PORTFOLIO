const texts = [
    "Machine Learning",
    "Cybersecurity",
    "Python Development",
    "Data Analysis",
    "Video Editing",
    "Frontend Development"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;

function typeText() {
    const currentText = texts[textIndex];
    const typingElement = document.getElementById('typing-text');

    if (isDeleting) {
        // Remove a character
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Add a character
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    // Simple bright text styling
    typingElement.style.color = '#ffffff';
    typingElement.style.fontWeight = '600';

    // Determine next action
    if (!isDeleting && charIndex === currentText.length) {
        // Start deleting after delay
        isDeleting = true;
        setTimeout(typeText, newTextDelay);
        return;
    }

    if (isDeleting && charIndex === 0) {
        // Move to next text
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeText, typingDelay);
        return;
    }

    // Set next timeout
    setTimeout(typeText, isDeleting ? erasingDelay : typingDelay);
}

// Start everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations(); // Initialize GSAP ScrollTrigger animations
    // Start the typing animation
    typeText();

    // Initialize 3D Image Effect
    const container = document.querySelector('.image-container');
    const wrapper = document.querySelector('.image-wrapper');
    const image = document.querySelector('.profile-image');
    let isHovering = false;

    // Track when cursor enters/leaves the circular area
    wrapper.addEventListener('mouseenter', () => {
        isHovering = true;
    });

    wrapper.addEventListener('mouseleave', () => {
        isHovering = false;
        container.style.transform = 'rotateX(0) rotateY(0)';
        image.style.transform = 'scale(1) translate(0, 0)';
    });

    // Initialize skill scroller animation
    initSkillScroller();

    // Track mouse movement only when inside the circle
    wrapper.addEventListener('mousemove', (e) => {
        if (!isHovering) return;

        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from center
        const distanceX = (e.clientX - centerX) / (rect.width / 2);
        const distanceY = (e.clientY - centerY) / (rect.height / 2);

        // Calculate rotation (max rotation of 20 degrees)
        const rotateX = distanceY * 20;
        const rotateY = -distanceX * 20;

        // Apply the transformation
        container.style.transform = `
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;

        // Add subtle scale effect to the image
        image.style.transform = `scale(1.1) translate(${-distanceX * 15}px, ${-distanceY * 15}px)`;
    });
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Form validation and submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Send data to the backend
        fetch('http://localhost:3000/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, subject, message }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
                // Reset label positions (if they were animated)
                const labels = contactForm.querySelectorAll('.form-group label');
                labels.forEach(label => {
                    label.style.top = '12px';
                    label.style.fontSize = '0.95rem';
                    label.style.color = 'var(--text-secondary)';
                });
            } else {
                showNotification(data.message || 'Error sending message. Please try again.', 'error');
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            showNotification('An unexpected error occurred. Please try again later.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });

    // Form field animations
    const formGroups = contactForm.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');

        input.addEventListener('focus', () => {
            label.style.top = '-10px';
            label.style.fontSize = '0.8rem';
            label.style.color = 'var(--secondary-color)';
            label.style.background = 'var(--background-light)';
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                label.style.top = '12px';
                label.style.fontSize = '0.95rem';
                label.style.color = 'var(--text-secondary)';
                label.style.background = 'transparent';
            }
        });
    });

    // Contact info hover effects
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(5px)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });
});

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Add show class after a small delay
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Certifications Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certificateCards = document.querySelectorAll('.certificate-card');
    const viewCertificateLinks = document.querySelectorAll('.view-certificate');
    const modal = document.createElement('div');
    modal.className = 'certificate-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close"><i class="fas fa-times"></i></button>
            <img src="" alt="Certificate" class="modal-image">
        </div>
    `;
    document.body.appendChild(modal);

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            certificateCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Modal functionality
    viewCertificateLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const certificateImage = link.closest('.certificate-card').querySelector('img').src;
            modal.querySelector('.modal-image').src = certificateImage;
            modal.classList.add('show');
        });
    });

    // Close modal
    const closeButton = modal.querySelector('.modal-close');
    closeButton.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });

    // Intersection Observer for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    certificateCards.forEach(card => {
        observer.observe(card);
    });
});

// Skill Scroller Animation
// 1. Replace your existing initSkillScroller function with this one
function initSkillScroller() {
    const scrollers = document.querySelectorAll(".scroller");

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        scrollers.forEach((scroller) => {
            scroller.setAttribute("data-animated", true);

            const scrollerInner = scroller.querySelector(".scroller__inner");
            const scrollerContent = Array.from(scrollerInner.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute("aria-hidden", true);
                scrollerInner.appendChild(duplicatedItem);
            });


        });
    }
}

// 2. Add this new function to your script.js file
function initSkillTagTilt() {
    const skillTags = document.querySelectorAll('.tag-list li');

    skillTags.forEach(tag => {
        tag.addEventListener('mousemove', (e) => {
            const rect = tag.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10; // Max rotation 10deg

            tag.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });

        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// 3. Finally, find the line where you call initSkillScroller() inside the 
//    DOMContentLoaded event listener, and add a call to the new function right after it.
document.addEventListener('DOMContentLoaded', () => {
    // ... (your other initialization code like typeText)
    
    initSkillScroller();
    initSkillTagTilt(); // <-- Add this line
    
    // ... (the rest of your code)
});

// GSAP Scroll-Triggered Animations
function initScrollAnimations() {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger is not loaded.');
        return;
    }

    // Animate About Me section header
    gsap.from("#about .about-header h2", {
        scrollTrigger: {
            trigger: "#about .about-header",
            start: "top 80%", // When the top of the trigger hits 80% of the viewport height
            toggleActions: "play none none none" // Play animation on enter
        },
        opacity: 0,
        y: 50, // Slide up
        duration: 0.8,
        ease: "power2.out"
    });

    gsap.from("#about .about-header p", {
        scrollTrigger: {
            trigger: "#about .about-header",
            start: "top 75%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: 0.2, // Start slightly after the h2
        ease: "power2.out"
    });

    // Animate About Me Image (about.jpg) - slide from left and fade in, aiming for maximum smoothness with sine.out ease
    gsap.from("#about .about-image img", {
        scrollTrigger: {
            trigger: "#about",                // Trigger based on the entire #about section
            start: "top 80%",             // Start when the top of #about is 80% from the top of the viewport
            end: "center center",         // End when the center of #about is at the center of the viewport
            scrub: 1,                   // Keep scrub at 1 second for smooth scroll tracking
        },
        xPercent: -100,             // Start 100% to its left
        opacity: 0,
        ease: "sine.out"             // Change to sine.out for a gentler, smoother ease
    });

    // The About Me Text (.about-text) will now have no scroll animation and appear statically.



     // Animate Education timeline items
    gsap.utils.toArray('#education .timeline-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none none",
            },
            opacity: 0,
            x: -50, // Slide in from the left
            duration: 0.7,
            delay: index * 0.2, // Stagger animation for each timeline item
            ease: "circ.out"
        });
    });

    // Animate Scroll Sticker
    const sticker = document.getElementById('scroll-sticker');
    if (sticker) {
        gsap.to(sticker, {
            scrollTrigger: {
                trigger: document.body, // Trigger based on the whole page scroll
                start: "200px", // Start animation when scrolled 200px down from the top of the page
                end: "bottom bottom", // End when the bottom of the body hits the bottom of the viewport
                scrub: 0.5 // Smoothly animates with scroll, value is lag (0.5 seconds)
            },
            x: 0, // Target x position (on-screen, from initial translateX(150%))
            opacity: 1, // Target opacity (fully visible, from initial opacity: 0)
            ease: "none" // With scrub, ease is often set to "none" for direct scroll linkage
        });
    }
}