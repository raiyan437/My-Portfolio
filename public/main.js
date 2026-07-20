document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Preloader Fade Out
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Wait a slight delay for loading aesthetic, then turn it off
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('off');
            }, 600);
        });
        
        // Fallback in case load event already fired
        if (document.readyState === 'complete') {
            setTimeout(() => {
                preloader.classList.add('off');
            }, 600);
        }
    }

    /* ==========================================================================
       Mobile Navigation Menu Toggle
       ========================================================================== */
    const showMenuBtn = document.getElementById('show-menu');
    const navbar = document.getElementById('navbar');

    if (showMenuBtn && navbar) {
        showMenuBtn.addEventListener('click', () => {
            showMenuBtn.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Close menu if links are clicked
        const navLinks = navbar.querySelectorAll('.menu li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                showMenuBtn.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       AOS (Animate On Scroll) Init
       ========================================================================== */
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1500,
            once: true,
            offset: 50
        });
    }

    /* ==========================================================================
       Contact Form Submission Handling
       ========================================================================== */
    const contactForm = document.getElementById('cf-form');
    const submitBtn = document.getElementById('submit-btn');
    const msgAlert = document.getElementById('msg-alert');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation
            const nameInput = document.getElementById('full-name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
                alert('Please fill in all fields.');
                return;
            }

            // Update submit button text to simulate sending state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            if (msgAlert) {
                msgAlert.style.display = 'none';
            }

            // Simulate server network latency
            setTimeout(() => {
                // Re-enable and reset button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }

                // Show success feedback
                if (msgAlert) {
                    msgAlert.style.display = 'block';
                    msgAlert.classList.add('fade-in');
                }

                // Reset the form input fields
                contactForm.reset();

                // Automatically hide feedback banner after 4 seconds
                setTimeout(() => {
                    if (msgAlert) {
                        msgAlert.style.display = 'none';
                    }
                }, 4000);

            }, 1500);
        });
    }
});
