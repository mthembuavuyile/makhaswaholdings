/**
 * =====================================================
 * MAKHASWA HOLDINGS — FORM HANDLING LOGIC
 * =====================================================
 * This file contains reusable, DRY form handling logic.
 * It's designed to easily integrate with third-party services 
 * like Web3Forms, EmailJS, or Formspree in the future.
 */

class BaseFormHandler {
    constructor(formId, options = {}) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.originalButtonText = this.submitButton ? this.submitButton.textContent : 'Submit';
        this.options = {
            successMessage: 'Form submitted successfully!',
            errorMessage: 'An error occurred. Please try again later.',
            ...options
        };

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validation Hook
        if (this.options.onBeforeSubmit) {
            const isValid = this.options.onBeforeSubmit(this.form);
            if (!isValid) return;
        }

        this.setLoading(true);

        try {
            // Collect form data
            const formData = new FormData(this.form);
            
            // =======================================================
            // FUTURE INTEGRATION POINT: 
            // Web3Forms, EmailJS, Formspree API calls can be placed here.
            // Example: await fetch('API_ENDPOINT', { method: 'POST', body: formData })
            // =======================================================
            
            // Mock API delay for now
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Post-submission Hook
            if (this.options.onSubmit) {
                await this.options.onSubmit(formData);
            }

            this.showSuccess();
            this.form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError(this.options.errorMessage);
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(isLoading) {
        if (!this.submitButton) return;
        
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.textContent = 'Submitting...';
            this.form.classList.add('is-submitting');
            this.form.style.opacity = '0.7';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.textContent = this.originalButtonText;
            this.form.classList.remove('is-submitting');
            this.form.style.opacity = '1';
        }
    }

    showSuccess() {
        alert(this.options.successMessage);
    }

    showError(message) {
        alert(message);
    }
}

// =====================================================
// FORM INITIALIZATIONS
// =====================================================
document.addEventListener('DOMContentLoaded', () => {

    // 1. Careers Form Initialization
    if (document.getElementById('careers-form')) {
        new BaseFormHandler('careers-form', {
            successMessage: 'Thank you for your application! We will review your profile and get in touch if there is a match.',
            onBeforeSubmit: (form) => {
                const fileInput = form.querySelector('#cv');
                if (fileInput && fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    const maxSize = 5 * 1024 * 1024; // 5MB limit
                    
                    // Validate File Size
                    if (file.size > maxSize) {
                        alert('Your CV file size must be less than 5MB.');
                        return false;
                    }

                    // Validate File Type (extra check alongside accept attribute)
                    const allowedTypes = [
                        'application/pdf', 
                        'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ];
                    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
                        alert('Please upload a valid PDF, DOC, or DOCX file.');
                        return false;
                    }
                }
                return true;
            },
            onSubmit: (formData) => {
                console.log('Careers form data prepared for submission:');
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value instanceof File ? value.name : value);
                }
            }
        });
    }

    // 2. Contact Form Initialization
    if (document.getElementById('contact-form')) {
        new BaseFormHandler('contact-form', {
            successMessage: 'Thank you for your message. Makhaswa Holdings will respond shortly.',
            onSubmit: (formData) => {
                console.log('Contact form data prepared for submission:');
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value);
                }
            }
        });
    }

});
