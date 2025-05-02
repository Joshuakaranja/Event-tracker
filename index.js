document.addEventListener('DOMContentLoaded', function() {
   
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logout-btn');
    const protectedPages = ['service.html', 'calendar.html', 'contact.html'];
    const currentPage = window.location.pathname.split('/').pop();

    checkAuth();
    updateNavForAuth();

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
              
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
    
                window.location.href = 'service.html';
            } else {
                alert('Please enter both email and password');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            window.location.href = 'index.html';
        });
    }

  
    if (document.querySelector('.calendar-grid')) {
        // Calendar DOM elements
        const monthDisplay = document.getElementById('month-display');
        const yearDisplay = document.getElementById('current-year');
        const calendarGrid = document.querySelector('.calendar-grid');
        const selectedDateDisplay = document.getElementById('selected-date');
        const eventDisplay = document.getElementById('event-display');
        const newEventInput = document.getElementById('new-event');
        const saveEventBtn = document.getElementById('save-event');
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');
        const prevYearBtn = document.getElementById('prev-year');
        const nextYearBtn = document.getElementById('next-year');

        // Calendar state
        let currentDate = new Date();
        let selectedDate = null;
        let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

        // Initialize calendar
        renderCalendar();
        updateSelectedDateDisplay();

        // Event listeners for calendar controls
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        prevYearBtn.addEventListener('click', () => {
            currentDate.setFullYear(currentDate.getFullYear() - 1);
            yearDisplay.textContent = currentDate.getFullYear();
            renderCalendar();
        });

        nextYearBtn.addEventListener('click', () => {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            yearDisplay.textContent = currentDate.getFullYear();
            renderCalendar();
        });

        // Save event
        saveEventBtn.addEventListener('click', saveEvent);

        // Calendar functions
        function renderCalendar() {
            // Clear existing calendar days (keep headers)
            while (calendarGrid.children.length > 7) {
                calendarGrid.removeChild(calendarGrid.lastChild);
            }

            // Set month and year displays
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'];
            monthDisplay.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
            yearDisplay.textContent = currentDate.getFullYear();

            // Get first day of month and total days in month
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            const startingDay = firstDay.getDay();

            // Add empty cells for days before the first day of the month
            for (let i = 0; i < startingDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.classList.add('day', 'other-month');
                calendarGrid.appendChild(emptyDay);
            }

            // Add cells for each day of the month
            const today = new Date();
            for (let i = 1; i <= daysInMonth; i++) {
                const day = document.createElement('div');
                day.classList.add('day');
                day.textContent = i;
                
                // Highlight today
                if (i === today.getDate() && 
                    currentDate.getMonth() === today.getMonth() && 
                    currentDate.getFullYear() === today.getFullYear()) {
                    day.classList.add('today');
                }
                
                // Highlight selected date
                if (selectedDate && 
                    i === selectedDate.getDate() && 
                    currentDate.getMonth() === selectedDate.getMonth() && 
                    currentDate.getFullYear() === selectedDate.getFullYear()) {
                    day.classList.add('selected');
                }
                
                // Add event indicator
                const dateKey = formatDateKey(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
                if (events[dateKey] && events[dateKey].length > 0) {
                    const eventIndicator = document.createElement('span');
                    eventIndicator.classList.add('event-indicator');
                    eventIndicator.textContent = `${events[dateKey].length} event${events[dateKey].length > 1 ? 's' : ''}`;
                    day.appendChild(eventIndicator);
                }
                
                // Add click event
                day.addEventListener('click', () => selectDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), i)));
                
                calendarGrid.appendChild(day);
            }
        }

        function selectDate(date) {
            selectedDate = date;
            renderCalendar();
            updateSelectedDateDisplay();
            displayEvents();
            if (newEventInput) newEventInput.value = '';
        }

        function updateSelectedDateDisplay() {
            if (!selectedDate) {
                selectedDateDisplay.textContent = 'No Date Selected';
                return;
            }
            
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'];
            selectedDateDisplay.textContent = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
        }

        function displayEvents() {
            if (!selectedDate) {
                eventDisplay.innerHTML = '<p>Select a date to view events</p>';
                return;
            }
            
            const dateKey = formatDateKey(selectedDate);
            const dateEvents = events[dateKey] || [];
            
            if (dateEvents.length === 0) {
                eventDisplay.innerHTML = '<p>No events for this date</p>';
                return;
            }
            
            eventDisplay.innerHTML = dateEvents.map((event, index) => `
                <div class="event-item">
                    <p>${event}</p>
                    <button onclick="deleteEvent('${dateKey}', ${index})" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        function saveEvent() {
            if (!selectedDate) {
                alert('Please select a date first');
                return;
            }
            
            const eventText = newEventInput.value.trim();
            if (!eventText) {
                alert('Please enter an event');
                return;
            }
            
            const dateKey = formatDateKey(selectedDate);
            
            if (!events[dateKey]) {
                events[dateKey] = [];
            }
            
            events[dateKey].push(eventText);
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            
            newEventInput.value = '';
            renderCalendar();
            displayEvents();
        }

        function formatDateKey(date) {
            return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        }

      
        window.deleteEvent = function(dateKey, index) {
            if (confirm('Are you sure you want to delete this event?')) {
                events[dateKey].splice(index, 1);
                
                if (events[dateKey].length === 0) {
                    delete events[dateKey];
                }
                
                localStorage.setItem('calendarEvents', JSON.stringify(events));
                renderCalendar();
                displayEvents();
            }
        };
    }

  
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }

    
    function checkAuth() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (protectedPages.includes(currentPage)){
            if (!isLoggedIn) {
                window.location.href = 'index.html';
            }
        } else if (currentPage === 'index.html' && isLoggedIn) {
            window.location.href = 'service.html';
        }
    }

    function updateNavForAuth() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        if (navLinks) {
            navLinks.forEach(link => {
                if (isLoggedIn) {
                    link.style.display = 'block';
                } else if (link.getAttribute('href') !== 'index.html') {
                    link.style.display = 'none';
                }
            });
        }
    }
});
