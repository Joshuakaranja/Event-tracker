
document.addEventListener('DOMContentLoaded', function() {

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Load saved form data if exists
    const contactForm = document.getElementById('contact-form');
    loadFormData();

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            feedback: document.getElementById('feedback').value,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        saveFormData(formData);
        
        // Show confirmation
        alert('Thank you for your feedback! We have received your message.');
        
        // Reset form
        contactForm.reset();
        localStorage.removeItem('contactFormData');
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', function() {
        // In a real app, you would handle proper logout logic here
        alert('You have been logged out. Redirecting to home page...');
        window.location.href = 'index.html';
    });

    // Save form data to localStorage
    function saveFormData(data) {
        localStorage.setItem('contactFormData', JSON.stringify(data));
    }

    // Load saved form data
    function loadFormData() {
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            document.getElementById('name').value = formData.name || '';
            document.getElementById('email').value = formData.email || '';
            document.getElementById('phone').value = formData.phone || '';
            document.getElementById('feedback').value = formData.feedback || '';
        }
    }

    // Auto-save form data when inputs change
    contactForm.addEventListener('input', function() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            feedback: document.getElementById('feedback').value
        };
        saveFormData(formData);
    });
});
