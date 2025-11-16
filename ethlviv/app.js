// Configuration
const IS_ADMIN = true; // Toggle admin mode

// Farcaster & Base Integration
const FARCASTER_CONFIG = {
    enabled: typeof window !== 'undefined' && window.parent !== window, // Detect if in iframe
    frameUrl: window.location.href
};

const BASE_CONFIG = {
    chainId: 8453, // Base Mainnet
    chainName: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org'
};

// Detect Farcaster context
function isFarcasterFrame() {
    return FARCASTER_CONFIG.enabled;
}

// Get Farcaster user data (if available)
function getFarcasterUser() {
    // This would be populated by Farcaster Frame SDK
    // For now, return mock data
    return {
        fid: null,
        username: null,
        pfp: null
    };
}

// State Management
let state = {
    currentView: 'events',
    events: [],
    registeredEvents: [],
    profile: {
        username: 'User',
        about: '',
        course: '',
        specialty: '',
        hobbies: '',
        interests: []
    },
    eventRequests: {}, // eventId -> array of userIds who requested
    selectedDate: null,
    selectedEventId: null,
    filters: {
        time: null, // 'today', 'week', 'month', 'upcoming'
        categories: [], // array of selected categories
        locations: [] // array of selected locations
    },
    showFilterModal: false
};

// Initialize App
function init() {
    loadState();
    
    // Check if running in Farcaster Frame
    if (isFarcasterFrame()) {
        console.log('Running in Farcaster Frame context');
        const farcasterUser = getFarcasterUser();
        if (farcasterUser.username) {
            state.profile.username = farcasterUser.username;
        }
    }
    
    if (state.events.length === 0) {
        createSampleEvents();
    }
    
    // Log Base network config
    console.log('Base Network Config:', BASE_CONFIG);
    
    render();
}

// Load state from localStorage
function loadState() {
    const savedEvents = localStorage.getItem('events');
    const savedRegistered = localStorage.getItem('registeredEvents');
    const savedProfile = localStorage.getItem('profile');
    const savedRequests = localStorage.getItem('eventRequests');
    
    if (savedEvents) {
        const events = JSON.parse(savedEvents);
        // Check if old events without category field - reset if needed
        if (events.length > 0 && !events[0].category) {
            console.log('Old event format detected, resetting events');
            localStorage.removeItem('events');
            return;
        }
        state.events = events;
    }
    if (savedRegistered) state.registeredEvents = JSON.parse(savedRegistered);
    if (savedProfile) state.profile = JSON.parse(savedProfile);
    if (savedRequests) state.eventRequests = JSON.parse(savedRequests);
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('events', JSON.stringify(state.events));
    localStorage.setItem('registeredEvents', JSON.stringify(state.registeredEvents));
    localStorage.setItem('profile', JSON.stringify(state.profile));
    localStorage.setItem('eventRequests', JSON.stringify(state.eventRequests));
}

// Create sample events
function createSampleEvents() {
    const sampleEvents = [
        {
            id: '1',
            title: 'Web3 Developer Meetup',
            description: 'Join us for an evening of networking and learning about the latest in Web3 development. We\'ll have talks from industry experts, hands-on workshops, and plenty of time to connect with fellow developers.',
            date: '2025-11-20',
            time: '18:00',
            location: 'On Campus',
            category: 'Meetup',
            photo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'
        },
        {
            id: '2',
            title: 'Blockchain Hackathon',
            description: 'A 48-hour hackathon focused on building innovative blockchain solutions. Form teams, build projects, and compete for prizes. Mentors and resources provided.',
            date: '2025-11-25',
            time: '09:00',
            location: 'Off Campus',
            category: 'Hackathon',
            photo: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop'
        },
        {
            id: '3',
            title: 'NFT Art Exhibition',
            description: 'Explore the intersection of art and technology at our NFT exhibition. Featuring works from emerging digital artists, live minting sessions, and panel discussions.',
            date: '2025-11-28',
            time: '14:00',
            location: 'Online',
            category: 'Workshop',
            photo: 'https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=800&h=400&fit=crop'
        },
        {
            id: '4',
            title: 'DeFi Workshop',
            description: 'Learn about decentralized finance protocols, yield farming, and liquidity provision. Hands-on session with real protocols.',
            date: '2025-11-16',
            time: '15:00',
            location: 'On Campus',
            category: 'Workshop',
            photo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop'
        },
        {
            id: '5',
            title: 'Crypto Art Fair',
            description: 'Annual crypto art fair featuring digital artists from around the world. Live auctions and artist meetups.',
            date: '2025-11-30',
            time: '10:00',
            location: 'Off Campus',
            category: 'Meetup',
            photo: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&h=400&fit=crop'
        },
        {
            id: '6',
            title: 'Smart Contract Security Lecture',
            description: 'Deep dive into smart contract security best practices, common vulnerabilities, and audit techniques.',
            date: '2025-11-18',
            time: '13:00',
            location: 'Online',
            category: 'Lecture',
            photo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop'
        }
    ];
    
    state.events = sampleEvents;
    saveState();
}

// Navigation
function navigateTo(view, params = {}) {
    state.currentView = view;
    if (params.eventId) state.selectedEventId = params.eventId;
    render();
}

// Event Handlers
function handleRegisterEvent(eventId) {
    if (!state.registeredEvents.includes(eventId)) {
        state.registeredEvents.push(eventId);
        saveState();
        render();
    }
}

function handleUnregisterEvent(eventId) {
    const index = state.registeredEvents.indexOf(eventId);
    if (index > -1) {
        state.registeredEvents.splice(index, 1);
        saveState();
        render();
    }
}

function handleFindCompany(eventId) {
    if (!state.eventRequests[eventId]) {
        state.eventRequests[eventId] = [];
    }
    
    const userId = 'currentUser';
    if (!state.eventRequests[eventId].includes(userId)) {
        state.eventRequests[eventId].push(userId);
        saveState();
        render();
    }
}

function shareEvent(url, text) {
    // Try native share API first
    if (navigator.share) {
        navigator.share({
            title: 'Event',
            text: text,
            url: url
        }).catch(() => {
            // Fallback to clipboard
            copyToClipboard(url);
        });
    } else {
        // Fallback to clipboard
        copyToClipboard(url);
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Link copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
    }
}

function getMatchedUsers(eventId) {
    // Simulate matched users based on shared interests
    if (!state.eventRequests[eventId] || state.eventRequests[eventId].length < 2) {
        return [];
    }
    
    const userInterests = state.profile.interests || [];
    
    // Sample matched users
    const sampleUsers = [
        {
            username: 'Alice_Dev',
            interests: ['Web3', 'React', 'Design']
        },
        {
            username: 'Bob_Builder',
            interests: ['Blockchain', 'Solidity', 'Web3']
        },
        {
            username: 'Charlie_Code',
            interests: ['NFT', 'Art', 'Design']
        }
    ];
    
    return sampleUsers.map(user => {
        const sharedInterests = user.interests.filter(interest => 
            userInterests.some(userInt => 
                userInt.toLowerCase().includes(interest.toLowerCase()) ||
                interest.toLowerCase().includes(userInt.toLowerCase())
            )
        );
        
        return {
            ...user,
            sharedInterests: sharedInterests.length > 0 ? sharedInterests : user.interests.slice(0, 2)
        };
    }).filter(user => user.sharedInterests.length > 0);
}

// Create Event
function showCreateEventModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Create Event</h2>
                <button class="close-modal" onclick="closeModal()">×</button>
            </div>
            <form class="modal-form" onsubmit="handleCreateEvent(event)">
                <div class="form-group">
                    <label>Event Title</label>
                    <input type="text" name="title" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" required></textarea>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select name="category" required>
                        <option value="Workshop">Workshop</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Meetup">Meetup</option>
                        <option value="Lecture">Lecture</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <select name="location" required>
                        <option value="On Campus">On Campus</option>
                        <option value="Off Campus">Off Campus</option>
                        <option value="Online">Online</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Photo URL (optional)</label>
                    <input type="text" name="photo" placeholder="https://...">
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" name="date" required>
                </div>
                <div class="form-group">
                    <label>Time</label>
                    <input type="time" name="time" required>
                </div>
                <button type="submit" class="submit-btn">Create Event</button>
            </form>
        </div>
    `;
    
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
    
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
}

function handleCreateEvent(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newEvent = {
        id: Date.now().toString(),
        title: formData.get('title'),
        description: formData.get('description'),
        photo: formData.get('photo') || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
        location: formData.get('location'),
        category: formData.get('category'),
        date: formData.get('date'),
        time: formData.get('time')
    };
    
    state.events.unshift(newEvent);
    saveState();
    closeModal();
    render();
}

// Profile Management
function handleSaveProfile(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    state.profile.username = formData.get('username');
    state.profile.about = formData.get('about');
    state.profile.course = formData.get('course');
    state.profile.specialty = formData.get('specialty');
    state.profile.hobbies = formData.get('hobbies');
    
    saveState();
    alert('Profile saved!');
}

function addInterest() {
    const input = document.getElementById('interestInput');
    const interest = input.value.trim();
    
    if (interest && !state.profile.interests.includes(interest)) {
        // Save current form values before re-rendering
        const form = document.querySelector('.profile-form');
        if (form) {
            const formData = new FormData(form);
            state.profile.username = formData.get('username');
            state.profile.about = formData.get('about');
            state.profile.course = formData.get('course');
            state.profile.specialty = formData.get('specialty');
            state.profile.hobbies = formData.get('hobbies');
        }
        
        state.profile.interests.push(interest);
        saveState();
        render();
        
        // Refocus on interest input after render
        setTimeout(() => {
            const newInput = document.getElementById('interestInput');
            if (newInput) newInput.focus();
        }, 0);
    }
}

function removeInterest(interest) {
    // Save current form values before re-rendering
    const form = document.querySelector('.profile-form');
    if (form) {
        const formData = new FormData(form);
        state.profile.username = formData.get('username');
        state.profile.about = formData.get('about');
        state.profile.course = formData.get('course');
        state.profile.specialty = formData.get('specialty');
        state.profile.hobbies = formData.get('hobbies');
    }
    
    state.profile.interests = state.profile.interests.filter(i => i !== interest);
    saveState();
    render();
}

// Calendar Functions
function getCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }
    
    return days;
}

function hasEventsOnDate(dateStr) {
    return state.registeredEvents.some(eventId => {
        const event = state.events.find(e => e.id === eventId);
        return event && event.date === dateStr;
    });
}

function getEventsForDate(dateStr) {
    return state.registeredEvents
        .map(eventId => state.events.find(e => e.id === eventId))
        .filter(event => event && event.date === dateStr);
}

function selectDate(day) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    state.selectedDate = dateStr;
    render();
}

// Filter functions
function openFilterModal() {
    state.showFilterModal = true;
    render();
}

function closeFilterModal() {
    state.showFilterModal = false;
    render();
}

function toggleTimeFilter(timeOption) {
    state.filters.time = state.filters.time === timeOption ? null : timeOption;
    saveState();
    render();
}

function toggleCategoryFilter(category) {
    const index = state.filters.categories.indexOf(category);
    if (index > -1) {
        state.filters.categories.splice(index, 1);
    } else {
        state.filters.categories.push(category);
    }
    saveState();
    render();
}

function toggleLocationFilter(location) {
    const index = state.filters.locations.indexOf(location);
    if (index > -1) {
        state.filters.locations.splice(index, 1);
    } else {
        state.filters.locations.push(location);
    }
    saveState();
    render();
}

function clearAllFilters() {
    state.filters = {
        time: null,
        categories: [],
        locations: []
    };
    saveState();
    render();
}

function getFilteredEvents(events) {
    let filtered = [...events];
    
    console.log('Total events:', filtered.length);
    console.log('Active filters:', state.filters);
    
    // Time filter
    if (state.filters.time) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            
            switch (state.filters.time) {
                case 'today':
                    return eventDate.getTime() === now.getTime();
                case 'week':
                    const weekEnd = new Date(now);
                    weekEnd.setDate(now.getDate() + 7);
                    return eventDate >= now && eventDate <= weekEnd;
                case 'month':
                    const monthEnd = new Date(now);
                    monthEnd.setMonth(now.getMonth() + 1);
                    return eventDate >= now && eventDate <= monthEnd;
                case 'upcoming':
                    return eventDate >= now;
                default:
                    return true;
            }
        });
        console.log('After time filter:', filtered.length);
    }
    
    // Category filter
    if (state.filters.categories.length > 0) {
        console.log('Filtering by categories:', state.filters.categories);
        filtered = filtered.filter(event => {
            console.log('Event category:', event.category, 'Match:', state.filters.categories.includes(event.category));
            return state.filters.categories.includes(event.category);
        });
        console.log('After category filter:', filtered.length);
    }
    
    // Location filter
    if (state.filters.locations.length > 0) {
        console.log('Filtering by locations:', state.filters.locations);
        filtered = filtered.filter(event => {
            console.log('Event location:', event.location, 'Match:', state.filters.locations.includes(event.location));
            return state.filters.locations.includes(event.location);
        });
        console.log('After location filter:', filtered.length);
    }
    
    return filtered;
}

function hasActiveFilters() {
    return state.filters.time !== null || 
           state.filters.categories.length > 0 || 
           state.filters.locations.length > 0;
}

function getActiveFilterCount() {
    let count = 0;
    if (state.filters.time) count++;
    count += state.filters.categories.length;
    count += state.filters.locations.length;
    return count;
}

// Render Functions
function render() {
    const app = document.getElementById('app');
    
    let content = '';
    
    switch (state.currentView) {
        case 'events':
            content = renderEventsView();
            break;
        case 'eventDetails':
            content = renderEventDetailsView();
            break;
        case 'myEvents':
            content = renderMyEventsView();
            break;
        case 'calendar':
            content = renderCalendarView();
            break;
        case 'profile':
            content = renderProfileView();
            break;
    }
    
    app.innerHTML = content + renderBottomNav();
    
    // Add create event button for admin
    if (IS_ADMIN && state.currentView === 'events') {
        const createBtn = document.createElement('button');
        createBtn.className = 'create-event-btn';
        createBtn.innerHTML = '+';
        createBtn.onclick = showCreateEventModal;
        app.appendChild(createBtn);
    }
}

function renderEventsView() {
    const filteredEvents = getFilteredEvents(state.events);
    const filterCount = getActiveFilterCount();
    
    const eventCards = filteredEvents.map(event => `
        <div class="event-card" onclick="navigateTo('eventDetails', { eventId: '${event.id}' })">
            <img src="${event.photo}" alt="${event.title}" class="event-image">
            <div class="event-content">
                <div class="event-category-badge">${event.category}</div>
                <h3 class="event-title">${event.title}</h3>
                <div class="event-meta">
                    <div class="event-meta-item">
                        <span>📅</span>
                        <span>${formatDate(event.date)}</span>
                    </div>
                    <div class="event-meta-item">
                        <span>🕐</span>
                        <span>${event.time}</span>
                    </div>
                    <div class="event-meta-item">
                        <span>📍</span>
                        <span>${event.location}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="header">
            <h1>Events</h1>
            <button class="filter-btn" onclick="openFilterModal()">
                <span class="filter-icon">🔍</span>
                <span>Filter${filterCount > 0 ? ' (' + filterCount + ')' : ''}</span>
            </button>
        </div>
        <div class="events-list">
            ${filteredEvents.length > 0 ? eventCards : '<div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-text">No events match your filters</div></div>'}
        </div>
    `;
}

function renderEventDetailsView() {
    const event = state.events.find(e => e.id === state.selectedEventId);
    if (!event) return '<div>Event not found</div>';
    
    const isRegistered = state.registeredEvents.includes(event.id);
    const hasRequested = state.eventRequests[event.id]?.includes('currentUser');
    const matchedUsers = hasRequested ? getMatchedUsers(event.id) : [];
    
    // Share URL for Farcaster
    const shareUrl = `${window.location.origin}${window.location.pathname}?event=${event.id}`;
    const shareText = `Check out ${event.title} on ${formatDate(event.date)}!`;
    
    return `
        <div class="event-details">
            <button class="back-btn" onclick="navigateTo('events')" style="margin: 20px;">
                ← Back
            </button>
            <img src="${event.photo}" alt="${event.title}" class="event-details-image">
            <div class="event-details-content">
                <div class="event-category-badge">${event.category}</div>
                <h1 class="event-details-title">${event.title}</h1>
                
                <div class="event-details-meta">
                    <div class="event-details-meta-item">
                        <span class="event-details-meta-label">Date:</span>
                        <span>${formatDate(event.date)}</span>
                    </div>
                    <div class="event-details-meta-item">
                        <span class="event-details-meta-label">Time:</span>
                        <span>${event.time}</span>
                    </div>
                    <div class="event-details-meta-item">
                        <span class="event-details-meta-label">Location:</span>
                        <span>${event.location}</span>
                    </div>
                </div>
                
                <button 
                    class="register-btn ${isRegistered ? 'registered' : ''}" 
                    onclick="${isRegistered ? `handleUnregisterEvent('${event.id}')` : `handleRegisterEvent('${event.id}')`}"
                >
                    ${isRegistered ? '✓ Registered - Click to Unregister' : 'Register for Event'}
                </button>
                
                <button 
                    class="find-company-btn ${hasRequested ? 'requested' : ''}" 
                    onclick="handleFindCompany('${event.id}')"
                >
                    ${hasRequested ? '✓ Looking for Company' : 'Find Company'}
                </button>
                
                <button 
                    class="share-event-btn" 
                    onclick="shareEvent('${shareUrl}', '${shareText}')"
                >
                    📤 Share Event
                </button>
                
                <div class="event-description">
                    <h3>About this event</h3>
                    <p>${event.description}</p>
                </div>
                
                ${matchedUsers.length > 0 ? `
                    <div class="matched-users">
                        <h3>Matched Users</h3>
                        ${matchedUsers.map(user => `
                            <div class="user-match-card">
                                <div class="user-match-name">${user.username}</div>
                                <div class="shared-interests">
                                    ${user.sharedInterests.map(interest => 
                                        `<span class="interest-tag">${interest}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function renderMyEventsView() {
    const registeredEventsList = state.registeredEvents
        .map(eventId => state.events.find(e => e.id === eventId))
        .filter(event => event);
    
    const filteredEvents = getFilteredEvents(registeredEventsList);
    const filterCount = getActiveFilterCount();
    
    const eventCards = filteredEvents.map(event => `
        <div class="event-card" onclick="navigateTo('eventDetails', { eventId: '${event.id}' })">
            <img src="${event.photo}" alt="${event.title}" class="event-image">
            <div class="event-content">
                <div class="event-category-badge">${event.category}</div>
                <h3 class="event-title">${event.title}</h3>
                <div class="event-meta">
                    <div class="event-meta-item">
                        <span>📅</span>
                        <span>${formatDate(event.date)}</span>
                    </div>
                    <div class="event-meta-item">
                        <span>🕐</span>
                        <span>${event.time}</span>
                    </div>
                    <div class="event-meta-item">
                        <span>📍</span>
                        <span>${event.location}</span>
                    </div>
                </div>
                <span class="registered-badge">✓ Registered</span>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="header">
            <h1>My Events</h1>
            <button class="filter-btn" onclick="openFilterModal()">
                <span class="filter-icon">🔍</span>
                <span>Filter${filterCount > 0 ? ' (' + filterCount + ')' : ''}</span>
            </button>
        </div>
        <div class="events-list">
            ${filteredEvents.length > 0 ? eventCards : registeredEventsList.length === 0 ? '<div class="empty-state"><div class="empty-state-icon">📅</div><div class="empty-state-text">No registered events yet</div></div>' : '<div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-text">No events match your filters</div></div>'}
        </div>
    `;
}

function renderCalendarView() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const days = getCalendarDays(year, month);
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const selectedDateEvents = state.selectedDate ? getEventsForDate(state.selectedDate) : [];
    
    return `
        <div class="calendar-container">
            <h1 class="calendar-header">${monthName}</h1>
            
            <div class="calendar-grid">
                ${dayHeaders.map(day => `<div class="calendar-day-header">${day}</div>`).join('')}
                ${days.map(day => {
                    if (day === null) {
                        return '<div class="calendar-day empty"></div>';
                    }
                    
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const hasEvents = hasEventsOnDate(dateStr);
                    const isSelected = state.selectedDate === dateStr;
                    
                    return `
                        <div 
                            class="calendar-day ${hasEvents ? 'has-events' : ''} ${isSelected ? 'selected' : ''}"
                            onclick="selectDate(${day})"
                        >
                            <span class="calendar-day-number">${day}</span>
                            ${hasEvents ? '<span class="calendar-day-marker">📌</span>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            
            ${selectedDateEvents.length > 0 ? `
                <div class="calendar-events">
                    <h3>Events on ${formatDate(state.selectedDate)}</h3>
                    ${selectedDateEvents.map(event => `
                        <div class="event-card" onclick="navigateTo('eventDetails', { eventId: '${event.id}' })">
                            <img src="${event.photo}" alt="${event.title}" class="event-image">
                            <div class="event-content">
                                <div class="event-category-badge">${event.category}</div>
                                <h3 class="event-title">${event.title}</h3>
                                <div class="event-meta">
                                    <div class="event-meta-item">
                                        <span>🕐</span>
                                        <span>${event.time}</span>
                                    </div>
                                    <div class="event-meta-item">
                                        <span>📍</span>
                                        <span>${event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function renderProfileView() {
    return `
        <div class="profile-container">
            <div class="profile-header">
                <div class="profile-photo">👤</div>
                <h2 class="profile-username">${state.profile.username}</h2>
            </div>
            
            <form class="profile-form" onsubmit="handleSaveProfile(event)">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value="${state.profile.username}" required>
                </div>
                
                <div class="form-group">
                    <label>About Me</label>
                    <textarea name="about">${state.profile.about}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Course</label>
                    <input type="text" name="course" value="${state.profile.course}">
                </div>
                
                <div class="form-group">
                    <label>Specialty</label>
                    <input type="text" name="specialty" value="${state.profile.specialty}">
                </div>
                
                <div class="form-group">
                    <label>Hobbies</label>
                    <textarea name="hobbies">${state.profile.hobbies}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Interests (used for matching)</label>
                    <div class="interests-input">
                        ${state.profile.interests.map(interest => `
                            <span class="interest-tag-input">
                                ${interest}
                                <button type="button" class="remove-tag" onclick="removeInterest('${interest}')">×</button>
                            </span>
                        `).join('')}
                    </div>
                    <div class="add-interest-container">
                        <input type="text" id="interestInput" class="add-interest-input" placeholder="Add interest...">
                        <button type="button" class="add-interest-btn" onclick="addInterest()">Add</button>
                    </div>
                </div>
                
                <button type="submit" class="save-profile-btn">Save Profile</button>
            </form>
        </div>
    `;
}

function renderBottomNav() {
    const filterModal = state.showFilterModal ? renderFilterModal() : '';
    
    return filterModal + `
        <nav class="bottom-nav">
            <button class="nav-item ${state.currentView === 'events' ? 'active' : ''}" onclick="navigateTo('events')">
                <div class="nav-icon">🏠</div>
                <div>Home</div>
            </button>
            <button class="nav-item ${state.currentView === 'myEvents' ? 'active' : ''}" onclick="navigateTo('myEvents')">
                <div class="nav-icon">✓</div>
                <div>My Events</div>
            </button>
            <button class="nav-item ${state.currentView === 'calendar' ? 'active' : ''}" onclick="navigateTo('calendar')">
                <div class="nav-icon">📅</div>
                <div>Calendar</div>
            </button>
            <button class="nav-item ${state.currentView === 'profile' ? 'active' : ''}" onclick="navigateTo('profile')">
                <div class="nav-icon">👤</div>
                <div>Profile</div>
            </button>
        </nav>
    `;
}

function renderFilterModal() {
    const categories = ['Workshop', 'Hackathon', 'Meetup', 'Lecture'];
    const locations = ['On Campus', 'Off Campus', 'Online'];
    
    return `
        <div class="modal" onclick="if(event.target === this) closeFilterModal()">
            <div class="modal-content filter-modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Filter Events</h2>
                    <button class="close-modal" onclick="closeFilterModal()">×</button>
                </div>
                
                <div class="filter-section">
                    <h3 class="filter-section-title">Time</h3>
                    <div class="filter-options">
                        <label class="filter-checkbox">
                            <input type="radio" name="time" ${state.filters.time === 'today' ? 'checked' : ''} onchange="toggleTimeFilter('today')">
                            <span>Today</span>
                        </label>
                        <label class="filter-checkbox">
                            <input type="radio" name="time" ${state.filters.time === 'week' ? 'checked' : ''} onchange="toggleTimeFilter('week')">
                            <span>This Week</span>
                        </label>
                        <label class="filter-checkbox">
                            <input type="radio" name="time" ${state.filters.time === 'month' ? 'checked' : ''} onchange="toggleTimeFilter('month')">
                            <span>This Month</span>
                        </label>
                        <label class="filter-checkbox">
                            <input type="radio" name="time" ${state.filters.time === 'upcoming' ? 'checked' : ''} onchange="toggleTimeFilter('upcoming')">
                            <span>Upcoming</span>
                        </label>
                    </div>
                </div>
                
                <div class="filter-section">
                    <h3 class="filter-section-title">Category</h3>
                    <div class="filter-options">
                        ${categories.map(cat => `
                            <label class="filter-checkbox">
                                <input type="checkbox" ${state.filters.categories.includes(cat) ? 'checked' : ''} onchange="toggleCategoryFilter('${cat}')">
                                <span>${cat}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <div class="filter-section">
                    <h3 class="filter-section-title">Location</h3>
                    <div class="filter-options">
                        ${locations.map(loc => `
                            <label class="filter-checkbox">
                                <input type="checkbox" ${state.filters.locations.includes(loc) ? 'checked' : ''} onchange="toggleLocationFilter('${loc}')">
                                <span>${loc}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <div class="filter-modal-actions">
                    ${hasActiveFilters() ? '<button class="clear-filters-btn" onclick="clearAllFilters()">Clear All Filters</button>' : ''}
                    <button class="apply-filters-btn" onclick="closeFilterModal()">Apply Filters</button>
                </div>
            </div>
        </div>
    `;
}

// Utility Functions
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
