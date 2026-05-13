/* =====================================================
   MAKHASWA HOLDINGS — FORMS.JS
   Web3Forms integration for:
     - Contact form  (#contact-form)
     - Careers form  (#careers-form)  — includes CV upload
*/

const WEB3FORMS_ACCESS_KEY = '6c3cc842-8262-4cd0-9510-466f761b9a94';
/* ------------------------------------------------------------------
   UTILITY HELPERS
------------------------------------------------------------------ */

/**
 * Show a status message in the given status element.
 * @param {HTMLElement} el      - The status container element.
 * @param {'success'|'error'|'loading'|''} type
 * @param {string} message
 */
function setStatus(el, type, message) {
    if (!el) return;
    el.className = 'form-status'; // reset classes
    if (type) el.classList.add('form-status--' + type);
    el.innerHTML = message;
    el.style.display = message ? 'block' : 'none';
}

/**
 * Disable / enable all interactive fields and the submit button inside a form.
 * @param {HTMLFormElement} form
 * @param {boolean} disabled
 */
function setFormDisabled(form, disabled) {
    form.querySelectorAll('input, select, textarea, button').forEach(el => {
        el.disabled = disabled;
    });
}

/**
 * Return a human-readable file-size string (e.g. "4.2 MB").
 */
function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/* ------------------------------------------------------------------
   CONTACT FORM
------------------------------------------------------------------ */

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const statusEl = document.getElementById('contact-form-status');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Guard against double-submission
        if (form.dataset.submitting === 'true') return;
        form.dataset.submitting = 'true';

        setFormDisabled(form, true);
        setStatus(statusEl, 'loading',
            '<span class="status-icon">⏳</span> Sending your message…');

        // Build JSON payload
        const data = {
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `[Makhaswa Holdings] New Enquiry – ${form.querySelector('[name="subject"]').value || 'General'}`,
            from_name: 'Makhaswa Holdings Website',
            name: form.querySelector('[name="name"]').value.trim(),
            email: form.querySelector('[name="email"]').value.trim(),
            enquiry_type: form.querySelector('[name="subject"]').value,
            message: form.querySelector('[name="message"]').value.trim(),
            botcheck: form.querySelector('[name="botcheck"]').checked,
        };

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setStatus(statusEl, 'success',
                    '<span class="status-icon">✅</span> <strong>Message sent!</strong> ' +
                    'Thank you for reaching out. A member of our team will be in touch shortly.');
                form.reset();
            } else {
                throw new Error(result.message || 'Submission failed.');
            }
        } catch (err) {
            console.error('[Contact Form]', err);
            setStatus(statusEl, 'error',
                '<span class="status-icon">❌</span> <strong>Something went wrong.</strong> ' +
                'Please try again, or email us directly at ' +
                '<a href="mailto:info@makhaswaholdings.co.za">info@makhaswaholdings.co.za</a>.');
        } finally {
            setFormDisabled(form, false);
            form.dataset.submitting = 'false';
        }
    });
}

/* ------------------------------------------------------------------
   CAREERS FORM  (includes CV file upload via multipart/FormData)
------------------------------------------------------------------ */

function initCareersForm() {
    const form = document.getElementById('careers-form');
    if (!form) return;

    const statusEl = document.getElementById('careers-form-status');
    const cvInput = document.getElementById('cv');
    const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

    // Live file-size validation
    if (cvInput) {
        cvInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            if (file.size > MAX_BYTES) {
                setStatus(statusEl, 'error',
                    `<span class="status-icon">⚠️</span> The selected file <strong>${file.name}</strong> ` +
                    `(${formatBytes(file.size)}) exceeds the 5 MB limit. Please choose a smaller file.`);
                this.value = ''; // clear the input
            } else {
                // Clear any previous size error
                if (statusEl.classList.contains('form-status--error')) {
                    setStatus(statusEl, '', '');
                }
            }
        });
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Guard against double-submission
        if (form.dataset.submitting === 'true') return;

        // Validate file size before submitting
        const cvFile = cvInput && cvInput.files[0];
        if (cvFile && cvFile.size > MAX_BYTES) {
            setStatus(statusEl, 'error',
                `<span class="status-icon">⚠️</span> Your CV (${formatBytes(cvFile.size)}) exceeds 5 MB. ` +
                'Please compress or re-export it before uploading.');
            return;
        }

        form.dataset.submitting = 'true';
        setFormDisabled(form, true);
        setStatus(statusEl, 'loading',
            '<span class="status-icon">⏳</span> Submitting your application…');

        // Build multipart FormData (required for file attachment)
        const formData = new FormData();
        formData.append('access_key', WEB3FORMS_ACCESS_KEY);
        formData.append('subject',
            `[Makhaswa Holdings] New Job Application – ${form.querySelector('[name="position"]').value}`);
        formData.append('from_name', 'Makhaswa Holdings Careers');
        formData.append('name', form.querySelector('[name="name"]').value.trim());
        formData.append('email', form.querySelector('[name="email"]').value.trim());
        formData.append('phone', form.querySelector('[name="phone"]').value.trim());
        formData.append('position', form.querySelector('[name="position"]').value);
        formData.append('message', form.querySelector('[name="message"]').value.trim());
        formData.append('botcheck', form.querySelector('[name="botcheck"]').checked);

        // Attach CV if provided
        if (cvFile) {
            formData.append('attachment', cvFile, cvFile.name);
        }

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                // NOTE: do NOT set Content-Type header — the browser sets it
                // automatically with the correct multipart boundary.
                headers: { Accept: 'application/json' },
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setStatus(statusEl, 'success',
                    '<span class="status-icon">✅</span> <strong>Application submitted!</strong> ' +
                    'Thank you for your interest in joining Makhaswa Holdings. ' +
                    'We will review your application and contact shortlisted candidates.');
                form.reset();
            } else {
                throw new Error(result.message || 'Submission failed.');
            }
        } catch (err) {
            console.error('[Careers Form]', err);
            setStatus(statusEl, 'error',
                '<span class="status-icon">❌</span> <strong>Something went wrong.</strong> ' +
                'Please try again, or email your CV directly to ' +
                '<a href="mailto:careers@makhaswaholdings.co.za">careers@makhaswaholdings.co.za</a>.');
        } finally {
            setFormDisabled(form, false);
            form.dataset.submitting = 'false';
        }
    });
}

/* ------------------------------------------------------------------
   HOMEPAGE QUICK-CONTACT FORM  (if present on index.html)
------------------------------------------------------------------ */

function initHomeContactForm() {
    // The homepage may have a contact form with a different ID
    const form = document.getElementById('home-contact-form');
    if (!form) return;

    const statusEl = document.getElementById('home-contact-form-status');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (form.dataset.submitting === 'true') return;
        form.dataset.submitting = 'true';

        setFormDisabled(form, true);
        setStatus(statusEl, 'loading',
            '<span class="status-icon">⏳</span> Sending your message…');

        const nameField = form.querySelector('[name="name"]');
        const emailField = form.querySelector('[name="email"]');
        const messageField = form.querySelector('[name="message"]');
        const subjectField = form.querySelector('[name="subject"]');
        const botField = form.querySelector('[name="botcheck"]');

        const data = {
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: subjectField
                ? `[Makhaswa Holdings] Website Enquiry – ${subjectField.value}`
                : '[Makhaswa Holdings] New Website Enquiry',
            from_name: 'Makhaswa Holdings Website',
            name: nameField ? nameField.value.trim() : '',
            email: emailField ? emailField.value.trim() : '',
            message: messageField ? messageField.value.trim() : '',
            botcheck: botField ? botField.checked : false,
        };

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setStatus(statusEl, 'success',
                    '<span class="status-icon">✅</span> <strong>Message sent!</strong> ' +
                    'We will be in touch with you shortly.');
                form.reset();
            } else {
                throw new Error(result.message || 'Submission failed.');
            }
        } catch (err) {
            console.error('[Home Contact Form]', err);
            setStatus(statusEl, 'error',
                '<span class="status-icon">❌</span> <strong>Something went wrong.</strong> ' +
                'Please email us at ' +
                '<a href="mailto:info@makhaswaholdings.co.za">info@makhaswaholdings.co.za</a>.');
        } finally {
            setFormDisabled(form, false);
            form.dataset.submitting = 'false';
        }
    });
}

/* ------------------------------------------------------------------
   INIT — runs after the DOM is ready
------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initCareersForm();
    initHomeContactForm();
});
