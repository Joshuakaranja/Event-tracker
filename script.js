document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
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
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Current date
    let currentDate = new Date();
    let selectedDate = null;
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

    // Initialize calendar
    renderCalendar();
    updateSelectedDateDisplay();

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Navigation controls
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

    // Render calendar function
    function renderCalendar() {
        // Clear existing calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers (keeps the 7 day headers we have in HTML)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('day-header');
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Set month and year displays
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        monthDisplay.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        yearDisplay.textContent = currentDate.getFullYear();

        // Get first day of month and total days in month
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        
        // Get day of week for first day (0 = Sunday, 6 = Saturday)
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
            
            // Add event indicator if there are events
            const dateKey = formatDateKey(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
            if (events[dateKey] && events[dateKey].length > 0) {
                const eventIndicator = document.createElement('span');
                eventIndicator.classList.add('event-indicator');
                eventIndicator.textContent = `${events[dateKey].length} event(s)`;
                day.appendChild(eventIndicator);
            }
            
            // Add click event
            day.addEventListener('click', () => selectDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), i)));
            
            calendarGrid.appendChild(day);
        }
    }

    // Select date function
    function selectDate(date) {
        selectedDate = date;
        renderCalendar();
        updateSelectedDateDisplay();
        displayEvents();
        newEventInput.value = '';
    }

    // Update selected date display
    function updateSelectedDateDisplay() {
        if (!selectedDate) {
            selectedDateDisplay.textContent = 'No Date Selected';
            return;
        }
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        selectedDateDisplay.textContent = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    }

    // Display events for selected date
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

    // Save event function
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

    // Helper function to format date as key
    function formatDateKey(date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    // Make deleteEvent function available globally
    window.deleteEvent = function(dateKey, index) {
        if (confirm('Are you sure you want to delete this event?')) {
            events[dateKey].splice(index, 1);
            
            // Remove date key if no events left
            if (events[dateKey].length === 0) {
                delete events[dateKey];
            }
            
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            renderCalendar();
            displayEvents();
        }
    };
});