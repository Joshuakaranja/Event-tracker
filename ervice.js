document.addEventListener('DOMContentLoaded', () => {
    // SEARCH FUNCTIONALITY
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const eventCards = document.querySelectorAll('.event-card');
  
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.toLowerCase().trim();
      eventCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(query) ? 'block' : 'none';
      });
    });
  
    // CATEGORY FILTER
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        document.querySelector('.category-btn.active').classList.remove('active');
        button.classList.add('active');
  
        const category = button.dataset.category;
        eventCards.forEach(card => {
          const matches = card.dataset.category === category || category === 'all';
          card.style.display = matches ? 'block' : 'none';
        });
      });
    });
  
    // BOOKING FUNCTIONALITY
    const attachBookListeners = () => {
      const bookButtons = document.querySelectorAll('.book-btn');
      bookButtons.forEach(button => {
        button.addEventListener('click', () => {
          button.textContent = 'Booked';
          button.disabled = true;
        });
      });
    };
    attachBookListeners();
  
    // CREATE EVENT FUNCTIONALITY
    const eventForm = document.getElementById('event-form');
    const eventsGrid = document.querySelector('.events-grid');
  
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const name = document.getElementById('event-name').value;
      const category = document.getElementById('event-category').value;
      const date = document.getElementById('event-date').value;
      const price = document.getElementById('event-price').value;
  
      const newCard = document.createElement('div');
      newCard.className = 'event-card';
      newCard.setAttribute('data-category', category);
      newCard.innerHTML = `
        <div class="event-img">
          <img src="https://via.placeholder.com/300x200?text=New+Event" alt="${name}">
          <span class="price">KSh ${price}</span>
        </div>
        <div class="event-info">
          <h3>${name}</h3>
          <p>Newly added event by user.</p>
          <div class="event-meta">
            <span><i class="fas fa-calendar-alt"></i> ${date}</span>
            <span><i class="fas fa-map-marker-alt"></i> User Location</span>
          </div>
          <button class="book-btn">Book Now</button>
        </div>
      `;
  
      eventsGrid.appendChild(newCard);
      attachBookListeners(); // Reattach listeners for new buttons
      eventForm.reset();
    });
  });
  