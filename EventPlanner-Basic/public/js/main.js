// Global State
let currentUser = null;
let bookings = [];
let vendors = [];
let favorites = [];
let payments = [];
let gallery = [];
let budget = { total: 0, spent: 0 };
let adminPagination = { page: 1, totalPages: 1, limit: 20, total: 0 };

const routeMap = {
    home: 'index.html',
    about: 'about.html',
    contact: 'contact.html',
    register: 'register.html',
    login: 'login.html',
    vendors: 'vendors.html',
    vendorDetails: 'vendor-details.html',
    favorites: 'favorites.html',
    bookings: 'bookings.html',
    paymentGateway: 'payment-gateway.html',
    payments: 'payments.html',
    budget: 'budget.html',
    gallery: 'gallery.html',
    profile: 'profile.html',
    admin: 'admin.html'
};

const protectedPages = new Set([
    'vendors.html',
    'vendor-details.html',
    'favorites.html',
    'bookings.html',
    'payment-gateway.html',
    'payments.html',
    'budget.html',
    'gallery.html',
    'profile.html',
    'admin.html',
    'vendor-dashboard.html'
]);

// Mock vendors data
const mockVendors = [
    {
        id: 1,
        name: 'Vibrant Visions Photography',
        category: 'Photographer',
        rating: 4.9,
        price: 75000,
        desc: 'Capturing the essence of weddings with cinematic brilliance. Professional photography and videography services.',
        img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=900',
        location: 'Mumbai, Maharashtra',
        email: 'contact@vibrantvisions.in',
        reviews: [
            { user: 'Ananya S.', rating: 5, comment: 'Absolutely amazing work! They captured every emotion perfectly.' },
            { user: 'Rahul M.', rating: 4, comment: 'Great quality and professional team.' }
        ]
    },
    {
        id: 2,
        name: 'Spice Route Catering',
        category: 'Caterer',
        rating: 4.8,
        price: 800,
        desc: 'Authentic Indian flavors and international cuisines for your grand feast. Expert culinary team with 15+ years experience.',
        img: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=900',
        location: 'Delhi, NCR',
        email: 'info@spiceroute.com',
        reviews: [
            { user: 'Priya K.', rating: 5, comment: 'The food was the highlight of our wedding. Everyone loved it!' }
        ]
    },
    {
        id: 3,
        name: 'Royal Mandap Decorators',
        category: 'Decorator',
        rating: 4.7,
        price: 150000,
        desc: 'Traditional and contemporary wedding decor that feels like royalty. Custom designs for your vision.',
        img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=900',
        location: 'Bangalore, Karnataka',
        email: 'royal@mandap.in',
        reviews: [
            { user: 'Suresh V.', rating: 4, comment: 'Beautiful setup, they transform venues amazingly.' }
        ]
    },
    {
        id: 4,
        name: 'Shringar Bridal Studio',
        category: 'Makeup Artist',
        rating: 4.9,
        price: 25000,
        desc: 'Expert bridal makeup and styling for the perfect traditional and modern looks. Specializing in Indian and fusion weddings.',
        img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=900',
        location: 'Chennai, Tamil Nadu',
        email: 'shringar@beauty.com',
        reviews: [
            { user: 'Meera R.', rating: 5, comment: 'I felt like a queen! Thank you for the amazing makeover.' }
        ]
    },
    {
        id: 5,
        name: 'Eternal Frames Studio',
        category: 'Photographer',
        rating: 4.6,
        price: 60000,
        desc: 'Candid photography that captures every emotion of your special day. Beautiful, timeless moments preserved.',
        img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=900',
        location: 'Pune, Maharashtra',
        email: 'eternal@frames.in',
        reviews: []
    },
    {
        id: 6,
        name: 'The Grand Ballroom',
        category: 'Venue',
        rating: 4.9,
        price: 500000,
        desc: 'Luxury wedding venue with stunning architecture and world-class facilities. Capacity for 200-1000 guests.',
        img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=900',
        location: 'Hyderabad, Telangana',
        email: 'events@grandbballroom.com',
        reviews: [
            { user: 'Vikram P.', rating: 5, comment: 'Perfect venue, amazing staff, unforgettable experience!' }
        ]
    },
    {
        id: 7,
        name: 'Harmony Music & DJ',
        category: 'DJ/Music',
        rating: 4.8,
        price: 50000,
        desc: 'Professional DJ and live music services for weddings. High-energy entertainment with state-of-the-art sound systems.',
        img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=900',
        location: 'Indore, Madhya Pradesh',
        email: 'harmony@musicdj.com',
        reviews: [
            { user: 'Rohan D.', rating: 5, comment: 'Best DJ ever! Kept the dance floor packed all night!' }
        ]
    }
];

let vendorCatalog = [...mockVendors];

async function loadVendorsFromApi() {
    try {
        const response = await fetch('/api/vendors');
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            vendorCatalog = data;
        }
    } catch (_error) {
        // Keep local fallback data when API is unreachable.
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkUserLogin();
    loadFavorites();
    hydratePageData();
    initMobileMenu();
    animatePageReveal();
    guardProtectedPage();
});

// ===== AUTHENTICATION =====
async function register(event) {
    event.preventDefault();

    try {
        const payload = {
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            phone: document.getElementById('regPhone').value,
            password: document.getElementById('regPassword').value,
            role: 'user'
        };

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Registration failed');
        }

        currentUser = result.user;
        localStorage.setItem('wedding_user', JSON.stringify(result.user));
        if (result.token) {
            localStorage.setItem('wedding_token', result.token);
        } else {
            localStorage.removeItem('wedding_token');
        }
        showMessage('success', 'Registration successful! Welcome!');
        document.getElementById('registerForm').reset();
        updateAuthUI();
        setTimeout(() => showSection('home'), 800);
    } catch (error) {
        showMessage('error', error.message || 'Registration failed');
    }
}

async function login(event) {
    event.preventDefault();

    try {
        const payload = {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        };

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Login failed');
        }

        currentUser = result.user;
        localStorage.setItem('wedding_user', JSON.stringify(result.user));
        if (result.token) {
            localStorage.setItem('wedding_token', result.token);
        } else {
            localStorage.removeItem('wedding_token');
        }
        showMessage('success', 'Login successful!');
        document.getElementById('loginForm').reset();
        updateAuthUI();

        const nextPage = localStorage.getItem('after_login_page');
        if (nextPage) {
            localStorage.removeItem('after_login_page');
            setTimeout(() => { window.location.href = nextPage; }, 600);
        } else {
            setTimeout(() => showSection('home'), 800);
        }
    } catch (error) {
        showMessage('error', error.message || 'Login failed');
    }
}

function logout() {
    localStorage.removeItem('wedding_user');
    localStorage.removeItem('wedding_token');
    currentUser = null;
    showMessage('success', 'Logged out successfully');
    setTimeout(() => showSection('home'), 1000);
    updateAuthUI();
}

function checkUserLogin() {
    const saved = localStorage.getItem('wedding_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authNav = document.querySelectorAll('.auth-nav');
    const userNav = document.querySelectorAll('.user-nav');
    const adminNav = document.querySelectorAll('.admin-nav');
    const userProfile = document.getElementById('user-profile');

    if (currentUser) {
        authNav.forEach(el => el.style.display = 'none');
        userNav.forEach(el => el.style.display = 'block');
        adminNav.forEach(el => el.style.display = currentUser.role === 'admin' ? 'block' : 'none');
        if (userProfile) {
            userProfile.style.display = 'flex';
            const nameSpan = document.getElementById('user-name');
            if (nameSpan) nameSpan.textContent = currentUser.name;
        }
        loadBookings();
        loadPayments();
    } else {
        authNav.forEach(el => el.style.display = 'block');
        userNav.forEach(el => el.style.display = 'none');
        adminNav.forEach(el => el.style.display = 'none');
        if (userProfile) userProfile.style.display = 'none';
    }
}

function updateProfile(event) {
    event.preventDefault();

    if (!currentUser) return;

    currentUser = {
        ...currentUser,
        name: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value
    };

    localStorage.setItem('wedding_user', JSON.stringify(currentUser));
    disableEdit();
    showMessage('success', 'Profile updated successfully!');
    updateAuthUI();
}

function enableEdit() {
    document.getElementById('profileName').disabled = false;
    document.getElementById('profileEmail').disabled = false;
    document.getElementById('profilePhone').disabled = false;
    document.querySelector('.edit-btn').style.display = 'none';
    document.getElementById('save-btn').style.display = 'block';
}

function disableEdit() {
    document.getElementById('profileName').disabled = true;
    document.getElementById('profileEmail').disabled = true;
    document.getElementById('profilePhone').disabled = true;
    document.querySelector('.edit-btn').style.display = 'block';
    document.getElementById('save-btn').style.display = 'none';
}

// ===== ROUTE NAVIGATION =====
function showSection(sectionId) {
    const target = routeMap[sectionId] || 'index.html';
    const needsAuth = protectedPages.has(target);

    if (!currentUser && needsAuth) {
        localStorage.setItem('after_login_page', target);
        showMessage('error', 'Please login to access this page');
        setTimeout(() => { window.location.href = 'login.html'; }, 600);
        return;
    }

    window.location.href = target;
}

// ===== VENDORS =====
function displayVendors(vendorList, targetId = 'vendorsList') {
    const container = document.getElementById(targetId);
    if (!container) return;

    container.innerHTML = vendorList.map(vendor => `
        <div id="vendor-card-${vendor.id}" class="vendor-card" onclick="openVendorDetails(${vendor.id})" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openVendorDetails(${vendor.id})}">
            <div id="vendor-image-${vendor.id}" class="vendor-image">
                <img id="vendor-img-${vendor.id}" src="${vendor.img}" alt="${vendor.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900'">
                <div id="vendor-overlay-left-${vendor.id}" class="vendor-overlay-left">
                    <div id="vendor-category-badge-${vendor.id}" class="vendor-category">${vendor.category}</div>
                </div>
                <div id="vendor-overlay-right-${vendor.id}" class="vendor-overlay-right">
                    <div id="vendor-rating-badge-${vendor.id}" class="vendor-rating">⭐ ${vendor.rating}</div>
                </div>
            </div>
            <div id="vendor-content-${vendor.id}" class="vendor-content">
                <div id="vendor-header-${vendor.id}" class="vendor-header">
                    <div>
                        <h3 id="vendor-title-${vendor.id}" class="vendor-title">${vendor.name}</h3>
                    </div>
                </div>
                <p id="vendor-location-${vendor.id}" class="vendor-location">📍 ${vendor.location}</p>
                <p id="vendor-desc-${vendor.id}">${vendor.desc}</p>
                <div id="vendor-price-${vendor.id}" class="vendor-price">₹${vendor.price.toLocaleString()} <span>/ starting</span></div>
                <div id="vendor-actions-${vendor.id}" class="vendor-actions">
                    <button id="btn-favorite-vendor-${vendor.id}" class="favorite-btn ${favorites.includes(vendor.id) ? 'active' : ''}" onclick="event.stopPropagation();toggleFavorite(${vendor.id})">
                        ${favorites.includes(vendor.id) ? '❤️ Saved' : '🤍 Save'}
                    </button>
                    <button id="btn-view-vendor-${vendor.id}" onclick="event.stopPropagation();openVendorDetails(${vendor.id})">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

function openVendorDetails(vendorId) {
    window.location.href = `vendor-details.html?id=${vendorId}`;
}

function normalizeCategoryValue(value) {
    return String(value || '').toLowerCase().replace(/\s|\/|&/g, '');
}

function filterVendors() {
    const search = document.getElementById('vendorSearch').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const normalizedCategory = normalizeCategoryValue(category);

    const filtered = vendorCatalog.filter(v => 
        (v.name.toLowerCase().includes(search) || v.desc.toLowerCase().includes(search)) &&
        (!category || normalizeCategoryValue(v.category) === normalizedCategory)
    );

    displayVendors(filtered);
}

function toggleFavorite(vendorId) {
    if (favorites.includes(vendorId)) {
        favorites = favorites.filter(id => id !== vendorId);
        showMessage('success', 'Removed from favorites');
    } else {
        favorites.push(vendorId);
        showMessage('success', 'Added to favorites!');
    }
    localStorage.setItem('wedding_favorites', JSON.stringify(favorites));
    displayVendors(vendorCatalog, 'vendorsList');
    displayFavorites();
}

// ===== FAVORITES =====
function displayFavorites() {
    const favoriteVendors = vendorCatalog.filter(v => favorites.includes(v.id));
    const container = document.getElementById('favoritesList');
    if (!container) return;

    if (favoriteVendors.length === 0) {
        container.innerHTML = '<p id="favorites-empty-msg" class="empty-message">No favorites yet. Save some vendors!</p>';
        return;
    }

    displayVendors(favoriteVendors, 'favoritesList');
}

function displayVendorDetails() {
    const mount = document.getElementById('vendorDetailsMount');
    if (!mount) return;

    const params = new URLSearchParams(window.location.search);
    const vendorId = Number(params.get('id'));
    const vendor = vendorCatalog.find(v => v.id === vendorId);

    if (!vendor) {
        mount.innerHTML = `
            <div id="vendor-details-not-found" class="form-container">
                <h3 id="vendor-details-not-found-title">Vendor Not Found</h3>
                <p id="vendor-details-not-found-msg" class="empty-message">The selected vendor could not be loaded.</p>
                <a id="vendor-details-back-link" class="inline-link" href="vendors.html">Back to Vendors</a>
            </div>
        `;
        return;
    }

    mount.innerHTML = `
        <div id="vendor-details-shell" class="form-container vendor-detail-shell reveal-up">
            <a id="vendor-details-back" class="inline-link" href="vendors.html">← Back to Vendors</a>
            <div id="vendor-details-grid" class="vendor-detail-grid">
                <img id="vendor-details-img" class="vendor-detail-image" src="${vendor.img}" alt="${vendor.name}" referrerpolicy="no-referrer">
                <div id="vendor-details-content" class="vendor-detail-content">
                    <div id="vendor-details-top" class="vendor-detail-top">
                        <div id="vendor-details-category" class="vendor-category">${vendor.category}</div>
                        <div id="vendor-details-rating" class="vendor-rating">⭐ ${vendor.rating}</div>
                    </div>
                    <h2 id="vendor-details-title" class="vendor-detail-title">${vendor.name}</h2>
                    <p id="vendor-details-location" class="vendor-location">📍 ${vendor.location}</p>
                    <p id="vendor-details-desc" class="vendor-detail-desc">${vendor.desc}</p>
                    <div id="vendor-details-meta" class="vendor-detail-meta">
                        <p id="vendor-details-price"><strong>Starting Price:</strong> ₹${vendor.price.toLocaleString()}</p>
                        ${vendor.email ? `<p id="vendor-details-email"><strong>Email:</strong> <a id="vendor-details-email-link" href="mailto:${vendor.email}">${vendor.email}</a></p>` : ''}
                    </div>
                    <div id="vendor-details-actions" class="vendor-actions vendor-detail-actions">
                        <button id="btn-detail-favorite-${vendor.id}" onclick="toggleFavorite(${vendor.id})" class="favorite-btn ${favorites.includes(vendor.id) ? 'active' : ''}">
                            ${favorites.includes(vendor.id) ? '❤️ Saved' : '🤍 Save'}
                        </button>
                        <button id="btn-detail-book-${vendor.id}" onclick="bookVendor(${vendor.id}, '${vendor.name.replace(/'/g, "\\'")}')">Book Now</button>
                    </div>
                </div>
            </div>
            <div id="vendor-reviews-block" class="vendor-reviews-block">
                <h3 id="vendor-reviews-title">Reviews</h3>
                ${vendor.reviews && vendor.reviews.length > 0
                    ? vendor.reviews.map((r, i) => `<article id="vendor-review-${vendor.id}-${i}" class="vendor-review-item"><p id="vendor-review-head-${vendor.id}-${i}" class="vendor-review-head">⭐ ${r.rating}/5 by <strong>${r.user}</strong></p><p>"${r.comment}"</p></article>`).join('')
                    : '<p id="vendor-reviews-empty">No reviews yet.</p>'}
            </div>
        </div>
    `;
}

// ===== BOOKINGS =====
function normalizeBooking(raw) {
    const id = raw.booking_id || raw.id || Date.now();
    const dateVal = raw.booking_date || raw.bookingDate || new Date().toISOString().split('T')[0];
    const budgetVal = Number(raw.budget ?? raw.price ?? 0);
    return {
        booking_id: Number(id),
        user_id: String(raw.user_id || raw.userId || currentUser?.id || ''),
        vendor_name: raw.vendor_name || raw.vendorName || 'Vendor',
        service_type: raw.service_type || raw.serviceType || 'Wedding Service',
        booking_date: dateVal,
        budget: Number.isFinite(budgetVal) ? budgetVal : 0,
        payment_status: raw.payment_status || raw.paymentStatus || 'pending'
    };
}

function bookVendor(vendorId, vendorName) {
    if (!currentUser) {
        localStorage.setItem('after_login_page', 'bookings.html');
        showMessage('error', 'Please login to book a vendor');
        setTimeout(() => { window.location.href = 'login.html'; }, 600);
        return;
    }

    const selectedVendor = vendorCatalog.find(v => v.id === vendorId);
    const booking = normalizeBooking({
        booking_id: Date.now(),
        user_id: String(currentUser.id),
        vendor_name: vendorName,
        service_type: selectedVendor?.category || 'Wedding Service',
        booking_date: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        budget: selectedVendor?.price || 0,
        payment_status: 'pending'
    });

    loadBookings();
    bookings.push(booking);
    localStorage.setItem('wedding_bookings', JSON.stringify(bookings));
    showMessage('success', `${vendorName} added to My Bookings`);
    window.location.href = 'bookings.html';
}

function addBooking(event) {
    event.preventDefault();

    if (!currentUser) {
        showMessage('error', 'Please login to add bookings');
        return;
    }

    const booking = normalizeBooking({
        booking_id: Date.now(),
        user_id: String(currentUser.id),
        vendor_name: document.getElementById('vendorBookingName').value,
        service_type: document.getElementById('serviceType').value,
        booking_date: document.getElementById('bookingDate').value,
        budget: parseFloat(document.getElementById('bookingPrice').value),
        payment_status: 'pending'
    });

    bookings.push(booking);
    localStorage.setItem('wedding_bookings', JSON.stringify(bookings));
    showMessage('success', 'Booking added successfully!');
    document.getElementById('bookingForm').reset();
    displayBookings();
    populatePaymentBookingOptions();
}

function loadBookings() {
    const saved = localStorage.getItem('wedding_bookings');
    const parsed = saved ? JSON.parse(saved) : [];
    bookings = parsed.map(normalizeBooking).filter(b => !currentUser || String(b.user_id) === String(currentUser.id));
}

function displayBookings() {
    const container = document.getElementById('bookingsList');
    const summaryContainer = document.getElementById('bookingsSummary');
    if (!container) return;

    const total = bookings.reduce((sum, b) => sum + b.budget, 0);
    const paid = bookings.filter(b => b.payment_status === 'paid').length;
    const pending = bookings.filter(b => b.payment_status !== 'paid').length;

    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <article id="booking-summary-count" class="summary-card"><h4>Total Bookings</h4><p id="booking-summary-count-value">${bookings.length}</p></article>
            <article id="booking-summary-value" class="summary-card"><h4>Total Value</h4><p id="booking-summary-value-amount">₹${total.toLocaleString()}</p></article>
            <article id="booking-summary-paid" class="summary-card"><h4>Paid</h4><p id="booking-summary-paid-count">${paid}</p></article>
            <article id="booking-summary-pending" class="summary-card"><h4>Pending</h4><p id="booking-summary-pending-count">${pending}</p></article>
        `;
    }

    if (bookings.length === 0) {
        container.innerHTML = '<p id="bookings-empty-msg" class="empty-message">No bookings yet. Start planning your big day!</p>';
        return;
    }

    container.innerHTML = bookings.map((booking) => `
        <div id="booking-card-${booking.booking_id}" class="list-item booking-card">
            <div id="booking-left-${booking.booking_id}" class="booking-left">
                <div id="booking-id-label-${booking.booking_id}" class="booking-id">ID #${booking.booking_id}</div>
                <div id="booking-info-${booking.booking_id}">
                    <h4 id="booking-vendor-${booking.booking_id}">${booking.vendor_name}</h4>
                    <p id="booking-service-${booking.booking_id}" class="booking-service">${booking.service_type}</p>
                    <p id="booking-date-${booking.booking_id}" class="booking-date">${new Date(booking.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
            </div>
            <div id="booking-right-${booking.booking_id}" class="booking-right">
                <div id="booking-amount-${booking.booking_id}" class="booking-amount">₹${booking.budget.toLocaleString()}</div>
                <div id="booking-status-${booking.booking_id}" class="booking-status ${booking.payment_status === 'paid' ? 'paid' : 'pending'}">
                    <span id="booking-status-dot-${booking.booking_id}" class="status-dot"></span>
                    ${booking.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                </div>
                <div id="booking-actions-${booking.booking_id}" class="booking-actions">
                    ${booking.payment_status !== 'paid' ? `<button id="btn-pay-booking-${booking.booking_id}" onclick="startPayment(${booking.booking_id})">Pay Now</button>` : ''}
                    <button id="btn-cancel-booking-${booking.booking_id}" class="delete-btn" onclick="deleteBooking(${booking.booking_id})">Cancel</button>
                </div>
            </div>
        </div>
    `).join('');
}

function startPayment(bookingId) {
    if (!currentUser) {
        localStorage.setItem('after_login_page', 'bookings.html');
        showMessage('error', 'Please login to proceed with payment');
        setTimeout(() => { window.location.href = 'login.html'; }, 600);
        return;
    }

    localStorage.setItem('payment_gateway_booking_id', String(bookingId));
    window.location.href = 'payment-gateway.html';
}

function quickPay(bookingId, method = 'UPI') {
    const booking = bookings.find(b => b.booking_id === bookingId);
    if (!booking) {
        showMessage('error', 'Booking not found');
        return;
    }

    if (booking.payment_status === 'paid') {
        showMessage('success', 'Booking already paid');
        window.location.href = 'payments.html';
        return;
    }

    const payment = normalizePayment({
        payment_id: Date.now(),
        booking_id: booking.booking_id,
        user_id: booking.user_id,
        vendor_name: booking.vendor_name,
        amount: booking.budget,
        method,
        status: 'success',
        created_at: new Date().toISOString()
    });

    loadPayments();
    payments.push(payment);
    localStorage.setItem('wedding_payments', JSON.stringify(payments));

    bookings = bookings.map(b => b.booking_id === bookingId ? { ...b, payment_status: 'paid' } : b);
    localStorage.setItem('wedding_bookings', JSON.stringify(bookings));

    localStorage.setItem('wedding_budget', JSON.stringify(budget));

    showMessage('success', `Payment successful for ${booking.vendor_name}`);
    window.location.href = 'payments.html';
}

function displayPaymentGateway() {
    const mount = document.getElementById('paymentGatewayMount');
    if (!mount) return;

    loadBookings();
    const bookingId = Number(localStorage.getItem('payment_gateway_booking_id') || 0);
    const booking = bookings.find(b => b.booking_id === bookingId);

    if (!booking) {
        mount.innerHTML = `
            <div id="gateway-empty" class="form-container">
                <h3 id="gateway-empty-title">Payment Gateway Mock</h3>
                <p id="gateway-empty-msg" class="empty-message">No pending booking selected for payment.</p>
                <a id="gateway-back-link" class="inline-link" href="bookings.html">Back to My Bookings</a>
            </div>
        `;
        return;
    }

    mount.innerHTML = `
        <div id="gateway-shell" class="form-container gateway-shell reveal-up">
            <div id="gateway-header" class="gateway-header">
                <h2 id="gateway-title">Secure Checkout (Mock)</h2>
                <p id="gateway-subtitle">Simulated payment gateway for ${booking.vendor_name}</p>
            </div>
            <div id="gateway-summary" class="gateway-summary">
                <p id="gateway-booking-id"><strong>Booking ID:</strong> #${booking.booking_id}</p>
                <p id="gateway-vendor-name"><strong>Vendor:</strong> ${booking.vendor_name}</p>
                <p id="gateway-amount"><strong>Amount:</strong> ₹${booking.budget.toLocaleString()}</p>
            </div>
            <form id="gatewayForm" onsubmit="processGatewayPayment(event)">
                <select id="gatewayMethod" required>
                    <option value="">Select Payment Method</option>
                    <option value="Credit/Debit Card">Credit/Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Net Banking">Net Banking</option>
                </select>
                <input id="gatewayAccount" type="text" placeholder="Card/UPI/Account (mock)" required>
                <button id="btn-gateway-pay" type="submit">Pay ₹${booking.budget.toLocaleString()}</button>
                <a id="btn-gateway-cancel" class="inline-link" href="bookings.html">Cancel</a>
            </form>
        </div>
    `;
}

function processGatewayPayment(event) {
    event.preventDefault();
    const bookingId = Number(localStorage.getItem('payment_gateway_booking_id') || 0);
    const method = document.getElementById('gatewayMethod')?.value || 'UPI';
    if (!bookingId) {
        showMessage('error', 'No booking selected for payment');
        return;
    }

    localStorage.removeItem('payment_gateway_booking_id');
    quickPay(bookingId, method);
}

function deleteBooking(bookingId) {
    if (confirm('Delete this booking?')) {
        bookings = bookings.filter(b => b.booking_id !== bookingId);
        localStorage.setItem('wedding_bookings', JSON.stringify(bookings));
        displayBookings();
        populatePaymentBookingOptions();
        showMessage('success', 'Booking deleted');
    }
}

// ===== PAYMENTS =====
function normalizePayment(raw) {
    return {
        payment_id: Number(raw.payment_id || raw.id || Date.now()),
        booking_id: Number(raw.booking_id || raw.bookingId || 0),
        user_id: String(raw.user_id || raw.userId || currentUser?.id || ''),
        vendor_name: raw.vendor_name || raw.vendorName || 'Vendor',
        amount: Number(raw.amount || 0),
        method: raw.method || 'Credit/Debit Card',
        status: raw.status || 'success',
        transaction_id: raw.transaction_id || ('TXN' + Math.random().toString().slice(2, 10)),
        created_at: raw.created_at || raw.date || new Date().toISOString()
    };
}

function populatePaymentBookingOptions() {
    const bookingSelect = document.getElementById('paymentBookingId');
    if (!bookingSelect) return;

    const unpaidBookings = bookings.filter(b => b.payment_status !== 'paid');
    bookingSelect.innerHTML = `
        <option value="">Select Booking (optional)</option>
        ${unpaidBookings.map(b => `<option id="payment-booking-option-${b.booking_id}" value="${b.booking_id}">${b.vendor_name} - ₹${b.budget.toLocaleString()} (${b.booking_date})</option>`).join('')}
    `;

    const prefill = localStorage.getItem('prefill_payment_booking_id');
    if (prefill) {
        bookingSelect.value = prefill;
        localStorage.removeItem('prefill_payment_booking_id');
        handlePaymentBookingChange();
    }
}

function handlePaymentBookingChange() {
    const bookingId = Number(document.getElementById('paymentBookingId')?.value || 0);
    if (!bookingId) return;

    const selected = bookings.find(b => b.booking_id === bookingId);
    if (!selected) return;

    document.getElementById('paymentVendor').value = selected.vendor_name;
    document.getElementById('paymentAmount').value = String(selected.budget);
}

function addPayment(event) {
    if (!document.getElementById('paymentVendor')) return;
    event.preventDefault();

    if (!currentUser) {
        showMessage('error', 'Please login to record payments');
        return;
    }

    const bookingId = Number(document.getElementById('paymentBookingId').value || 0);

    const payment = normalizePayment({
        payment_id: Date.now(),
        booking_id: bookingId,
        user_id: String(currentUser.id),
        vendor_name: document.getElementById('paymentVendor').value,
        amount: parseFloat(document.getElementById('paymentAmount').value),
        method: document.getElementById('paymentMethod').value,
        status: document.getElementById('paymentStatus').value,
        created_at: new Date().toISOString()
    });

    if (!Number.isFinite(payment.amount) || payment.amount <= 0) {
        showMessage('error', 'Please enter a valid payment amount');
        return;
    }

    payments.push(payment);
    localStorage.setItem('wedding_payments', JSON.stringify(payments));

    if (bookingId) {
        bookings = bookings.map(b => b.booking_id === bookingId ? { ...b, payment_status: 'paid' } : b);
        localStorage.setItem('wedding_bookings', JSON.stringify(bookings));
    }

    budget.spent += payment.amount;
    localStorage.setItem('wedding_budget', JSON.stringify(budget));
    showMessage('success', 'Payment recorded!');
    document.getElementById('paymentForm').reset();
    populatePaymentBookingOptions();
    displayBookings();
    displayPayments();
}

function loadPayments() {
    const saved = localStorage.getItem('wedding_payments');
    const parsed = saved ? JSON.parse(saved) : [];
    payments = parsed.map(normalizePayment).filter(p => !currentUser || String(p.user_id) === String(currentUser.id));
    const budgetData = localStorage.getItem('wedding_budget');
    budget = budgetData ? JSON.parse(budgetData) : { total: 0, spent: 0 };
}

function displayPayments() {
    const container = document.getElementById('paymentsList');
    const summaryContainer = document.getElementById('paymentsSummary');
    if (!container) return;

    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const successCount = payments.filter(p => p.status === 'success').length;

    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <article id="payment-summary-total" class="summary-card"><h4>Total Paid</h4><p id="payment-summary-total-amount">₹${total.toLocaleString()}</p></article>
            <article id="payment-summary-count" class="summary-card"><h4>Transactions</h4><p id="payment-summary-count-value">${payments.length}</p></article>
            <article id="payment-summary-success" class="summary-card"><h4>Successful</h4><p id="payment-summary-success-pct">${payments.length ? Math.round((successCount / payments.length) * 100) : 0}%</p></article>
        `;
    }

    if (payments.length === 0) {
        container.innerHTML = '<p id="payments-empty-msg" class="empty-message">No payments recorded yet. Your payment history will appear here after your first vendor payment.</p>';
        return;
    }

    container.innerHTML = payments.map((payment) => `
        <div id="payment-card-${payment.payment_id}" class="list-item payment-card">
            <div id="payment-left-${payment.payment_id}" class="payment-left">
                <div id="payment-icon-${payment.payment_id}" class="payment-icon">${payment.method.includes('Card') ? '💳' : payment.method === 'UPI' ? '📱' : '🏦'}</div>
                <div id="payment-info-${payment.payment_id}">
                    <h4 id="payment-vendor-${payment.payment_id}">${payment.vendor_name}</h4>
                    <p id="payment-method-${payment.payment_id}" class="payment-method">${payment.method}</p>
                    <p id="payment-txn-${payment.payment_id}" class="txn">TXN: ${payment.transaction_id}</p>
                </div>
            </div>
            <div id="payment-right-${payment.payment_id}" class="payment-right">
                <div id="payment-amount-${payment.payment_id}" class="payment-amount">₹${payment.amount.toLocaleString()}</div>
                <div id="payment-status-${payment.payment_id}" class="payment-status ${payment.status === 'success' ? 'paid' : 'pending'}">
                    <span id="payment-status-dot-${payment.payment_id}" class="status-dot"></span>
                    ${payment.status === 'success' ? 'Success' : 'Pending'}
                </div>
                <p id="payment-date-${payment.payment_id}" class="payment-date">${new Date(payment.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <button id="btn-delete-payment-${payment.payment_id}" class="delete-btn" onclick="deletePayment(${payment.payment_id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function deletePayment(paymentId) {
    if (confirm('Delete this payment?')) {
        const deleted = payments.find(p => p.payment_id === paymentId);
        payments = payments.filter(p => p.payment_id !== paymentId);
        if (deleted) {
            budget.spent = Math.max(0, budget.spent - deleted.amount);
            if (deleted.booking_id) {
                bookings = bookings.map(b => b.booking_id === deleted.booking_id ? { ...b, payment_status: 'pending' } : b);
                localStorage.setItem('wedding_bookings', JSON.stringify(bookings));
            }
        }
        localStorage.setItem('wedding_payments', JSON.stringify(payments));
        localStorage.setItem('wedding_budget', JSON.stringify(budget));
        populatePaymentBookingOptions();
        displayBookings();
        displayPayments();
        showMessage('success', 'Payment deleted');
    }
}

// ===== GALLERY =====
function addGalleryItem(event) {
    event.preventDefault();

    const item = {
        id: Date.now(),
        title: document.getElementById('galleryTitle').value,
        url: document.getElementById('galleryUrl').value,
        desc: document.getElementById('galleryDesc').value
    };

    gallery.push(item);
    localStorage.setItem('wedding_gallery', JSON.stringify(gallery));
    showMessage('success', 'Gallery item added!');
    document.getElementById('galleryForm').reset();
    displayGallery();
}

function displayGallery() {
    const container = document.getElementById('galleryList');
    const saved = localStorage.getItem('wedding_gallery');
    gallery = saved ? JSON.parse(saved) : [];

    if (gallery.length === 0) {
        container.innerHTML = '<p id="gallery-empty-msg" class="empty-message">No gallery items yet.</p>';
        return;
    }

    container.innerHTML = gallery.map((item, index) => `
        <div id="gallery-item-${item.id}" class="gallery-item">
            <img id="gallery-img-${item.id}" src="${item.url}" alt="${item.title}" class="gallery-image" onerror="this.src='https://via.placeholder.com/250x200'">
            <div id="gallery-content-${item.id}" class="gallery-content">
                <h4 id="gallery-title-${item.id}">${item.title}</h4>
                <p id="gallery-desc-${item.id}">${item.desc}</p>
                <button id="btn-delete-gallery-${item.id}" class="delete-btn" onclick="deleteGalleryItem(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteGalleryItem(index) {
    if (confirm('Delete this gallery item?')) {
        gallery.splice(index, 1);
        localStorage.setItem('wedding_gallery', JSON.stringify(gallery));
        displayGallery();
        showMessage('success', 'Gallery item deleted');
    }
}

// ===== BUDGET =====
function updateBudget() {
    const totalInput = document.getElementById('totalBudget');
    const total = parseFloat(totalInput?.value || '0') || 0;

    if (total < 0) {
        showMessage('error', 'Please enter a valid budget');
        return;
    }

    budget = { ...budget, total };
    localStorage.setItem('wedding_budget', JSON.stringify(budget));
    displayBudget();
    showMessage('success', 'Budget total updated!');
}

function getBudgetItemsKey() {
    return `wedding_budget_items_${currentUser ? currentUser.id : 'guest'}`;
}

function loadBudgetItems() {
    const saved = localStorage.getItem(getBudgetItemsKey());
    return saved ? JSON.parse(saved) : [];
}

function saveBudgetItems(items) {
    localStorage.setItem(getBudgetItemsKey(), JSON.stringify(items));
}

function addBudgetItem(event) {
    event.preventDefault();
    const category = document.getElementById('budgetCategory')?.value || 'Other';
    const description = document.getElementById('budgetDescription')?.value || '';
    const amount = parseFloat(document.getElementById('budgetAmount')?.value || '0');

    if (!Number.isFinite(amount) || amount <= 0) {
        showMessage('error', 'Enter a valid expense amount');
        return;
    }

    const items = loadBudgetItems();
    items.push({
        item_id: Date.now(),
        category,
        description,
        amount
    });
    saveBudgetItems(items);
    const form = document.getElementById('budgetItemForm');
    if (form) form.reset();
    displayBudget();
    showMessage('success', 'Expense added');
}

function deleteBudgetItem(itemId) {
    const items = loadBudgetItems().filter(item => item.item_id !== itemId);
    saveBudgetItems(items);
    displayBudget();
    showMessage('success', 'Expense removed');
}

function displayBudget() {
    const container = document.getElementById('budgetDisplay');
    if (!container) return;

    loadPayments();
    const budgetItems = loadBudgetItems();
    const paymentSpent = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0);
    const manualSpent = budgetItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const spent = paymentSpent + manualSpent;

    budget = { ...budget, spent };
    localStorage.setItem('wedding_budget', JSON.stringify(budget));

    const remaining = budget.total - spent;
    const percentage = budget.total > 0 ? (spent / budget.total) * 100 : 0;

    container.innerHTML = `
        <div id="budget-shell" class="budget-container budget-shell">
            <div id="budget-form-main" class="budget-form budget-form-main">
                <h3 id="budget-goal-title">Set Budget Goal</h3>
                <input type="number" placeholder="Total Budget" id="totalBudget" value="${budget.total}">
                <button id="btn-update-budget" onclick="updateBudget()">Update Total Budget</button>

                <h3 id="budget-expense-title">Add Expense</h3>
                <form id="budgetItemForm" onsubmit="addBudgetItem(event)">
                    <select id="budgetCategory">
                        <option value="Venue">Venue</option>
                        <option value="Catering">Catering</option>
                        <option value="Photography">Photography</option>
                        <option value="Decoration">Decoration</option>
                        <option value="Makeup">Makeup</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                    </select>
                    <input type="text" id="budgetDescription" placeholder="Description (optional)">
                    <input type="number" id="budgetAmount" placeholder="Amount" required>
                    <button id="btn-add-expense" type="submit">Add Expense</button>
                </form>
            </div>

            <div id="budget-stats-wrap" class="budget-stats-wrap">
                <div id="budget-stat-total" class="budget-stat">
                    <h3>Total Budget</h3>
                    <div id="budget-total-value" class="budget-value">₹${budget.total.toLocaleString()}</div>
                </div>
                <div id="budget-stat-spent" class="budget-stat">
                    <h3>Spent (Payments + Expenses)</h3>
                    <div id="budget-spent-value" class="budget-value">₹${spent.toLocaleString()}</div>
                </div>
                <div id="budget-progress-bar" class="progress-bar">
                    <div id="budget-progress-fill" class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
                <div id="budget-stat-remaining" class="budget-stat">
                    <h3>Remaining</h3>
                    <div id="budget-remaining-value" class="budget-value" style="color: ${remaining < 0 ? '#ef4444' : '#ec4899'}">
                        ₹${Math.abs(remaining).toLocaleString()}
                    </div>
                </div>
                <p id="budget-breakdown" class="budget-breakdown">Payments: ₹${paymentSpent.toLocaleString()} | Manual Expenses: ₹${manualSpent.toLocaleString()}</p>

                <div id="budget-items-list" class="budget-items-list">
                    <h3 id="budget-items-title">Manual Expense Items</h3>
                    ${budgetItems.length === 0
                        ? '<p id="budget-items-empty" class="empty-message">No manual expenses added yet.</p>'
                        : budgetItems.map(item => `
                            <div id="budget-item-row-${item.item_id}" class="budget-item-row">
                                <div id="budget-item-info-${item.item_id}">
                                    <strong id="budget-item-name-${item.item_id}">${item.description || item.category}</strong>
                                    <p id="budget-item-category-${item.item_id}">${item.category}</p>
                                </div>
                                <div id="budget-item-actions-${item.item_id}">
                                    <span id="budget-item-amount-${item.item_id}">₹${Number(item.amount).toLocaleString()}</span>
                                    <button id="btn-remove-expense-${item.item_id}" class="delete-btn" onclick="deleteBudgetItem(${item.item_id})">Remove</button>
                                </div>
                            </div>
                        `).join('')}
                </div>
            </div>
        </div>
    `;
}

function showMessage(type, message) {
    // Reuse a single stable flash-message element to avoid dynamic IDs
    let messageDiv = document.getElementById('flash-message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'flash-message';
        document.body.appendChild(messageDiv);
    }

    // Clear any pending hide timer so a new message always shows fully
    if (messageDiv._hideTimer) {
        clearTimeout(messageDiv._hideTimer);
        clearTimeout(messageDiv._removeTimer);
    }

    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    messageDiv.style.opacity = '1';
    messageDiv.style.transition = '';

    messageDiv._hideTimer = setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.3s';
        messageDiv._removeTimer = setTimeout(() => {
            messageDiv.style.opacity = '';
            messageDiv.style.transition = '';
        }, 300);
    }, 3000);
}

// ===== VENDOR DASHBOARD FUNCTIONS =====
function goToVendorDashboard() {
    if (!currentUser) {
        showMessage('error', 'Please login first');
        return;
    }
    if (currentUser.role !== 'vendor') {
        showMessage('error', 'Only vendors can access the dashboard');
        return;
    }
    window.location.href = 'vendor-dashboard.html';
}

// ===== UPDATED LOAD VENDOR PROFILE WITH NEW FEATURES =====
async function loadVendorProfile() {
    try {
        const token = localStorage.getItem('wedding_token');
        if (!token) {
            showMessage('error', 'Please login to access vendor dashboard');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('/api/vendor/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Failed to load vendor profile:', data.message);
            showMessage('error', data.message || 'Failed to load vendor profile');
            return;
        }

        const vendor = data.vendor;

        // Update top bar user info
        document.getElementById('vendorUserInfo').textContent = vendor.name || 'Vendor';

        // Populate profile form fields
        document.getElementById('vendorName').value = vendor.name || '';
        document.getElementById('vendorCategory').value = vendor.category || '';
        document.getElementById('vendorPrice').value = vendor.price || 0;
        document.getElementById('vendorLocation').value = vendor.location || '';
        document.getElementById('vendorDesc').value = vendor.desc || '';

        // Display analytics data
        document.getElementById('vendorRating').textContent = vendor.rating ? vendor.rating.toFixed(1) : '4.9';
        document.getElementById('reviewCount').textContent = `(${vendor.reviews ? vendor.reviews.length : 0} reviews)`;

        // Load bookings and analytics
        await loadVendorAnalytics();

        // Display vendor services
        displayVendorServices();

    } catch (error) {
        console.error('Error loading vendor profile:', error);
        showMessage('error', 'Failed to load vendor profile');
    }
}

async function updateVendorProfile(event) {
    event.preventDefault();

    const token = localStorage.getItem('wedding_token');
    if (!token) {
        showMessage('error', 'Please login to update profile');
        return;
    }

    const vendorData = {
        name: document.getElementById('vendorName').value,
        category: document.getElementById('vendorCategory').value,
        price: Number(document.getElementById('vendorPrice').value),
        location: document.getElementById('vendorLocation').value,
        desc: document.getElementById('vendorDesc').value
    };

    try {
        const response = await fetch('/api/vendor/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vendorData)
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage('error', data.message || 'Failed to update profile');
            return;
        }

        showMessage('success', 'Profile updated successfully!');
        // Reload profile data to refresh stats
        setTimeout(() => loadVendorProfile(), 500);

    } catch (error) {
        console.error('Error updating vendor profile:', error);
        showMessage('error', 'Failed to update profile');
    }
}

function resetVendorForm() {
    loadVendorProfile();
    showMessage('info', 'Form reset');
}

// ===== VENDOR DASHBOARD TAB SWITCHING =====
function switchVendorTab(tabName, event) {
    event.preventDefault();

    // Hide all tabs
    const tabs = document.querySelectorAll('.vendor-tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.vendor-nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked nav item
    event.target.closest('.vendor-nav-item')?.classList.add('active');
}

// ===== ADD NEW BUSINESS SERVICE =====
async function addNewBusiness(event) {
    event.preventDefault();

    const token = localStorage.getItem('wedding_token');
    if (!token) {
        showMessage('error', 'Please login to add services');
        return;
    }

    const serviceData = {
        name: document.getElementById('serviceName').value,
        category: document.getElementById('serviceCategory').value,
        price: Number(document.getElementById('servicePrice').value),
        duration: Number(document.getElementById('serviceDuration').value),
        desc: document.getElementById('serviceDesc').value,
        includes: document.getElementById('serviceIncludes').value
            .split('\n')
            .filter(item => item.trim())
            .map(item => item.trim())
    };

    try {
        // For now, store in localStorage (later can be moved to backend)
        let services = JSON.parse(localStorage.getItem('vendor_services') || '[]');
        services.push({
            ...serviceData,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('vendor_services', JSON.stringify(services));

        showMessage('success', 'Service package added successfully!');
        document.getElementById('newBusinessForm').reset();
        displayVendorServices();

    } catch (error) {
        console.error('Error adding service:', error);
        showMessage('error', 'Failed to add service');
    }
}

function resetNewBusinessForm() {
    document.getElementById('newBusinessForm').reset();
    showMessage('info', 'Form cleared');
}

// ===== DISPLAY VENDOR SERVICES =====
function displayVendorServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid) return;

    const services = JSON.parse(localStorage.getItem('vendor_services') || '[]');

    if (services.length === 0) {
        servicesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #888;">No services added yet</p>';
        return;
    }

    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <h4>${service.name}</h4>
            <p class="service-duration">⏱️ ${service.duration} hours</p>
            <p class="service-price">₹${service.price.toLocaleString('en-IN')}</p>
            <p class="service-desc">${service.desc}</p>
            <div class="service-includes">
                <strong>Includes:</strong>
                <ul style="margin: 0.5rem 0 0 1.5rem;">
                    ${service.includes.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <button class="vendor-btn-secondary" onclick="deleteVendorService(${service.id})" style="width: 100%;">Delete</button>
        </div>
    `).join('');
}

function deleteVendorService(serviceId) {
    if (!confirm('Delete this service?')) return;

    let services = JSON.parse(localStorage.getItem('vendor_services') || '[]');
    services = services.filter(s => s.id !== serviceId);
    localStorage.setItem('vendor_services', JSON.stringify(services));

    displayVendorServices();
    showMessage('success', 'Service deleted');
}

// ===== LOAD VENDOR ANALYTICS AND BOOKINGS =====
async function loadVendorAnalytics() {
    try {
        // Mock booking data - in production, fetch from API
        const mockBookings = [
            {
                userName: 'Raj Kumar',
                email: 'raj.kumar@example.com',
                eventDate: '2026-05-15',
                amount: 75000,
                status: 'confirmed',
                payment: 'completed'
            },
            {
                userName: 'Priya Sharma',
                email: 'priya.sharma@example.com',
                eventDate: '2026-06-20',
                amount: 85000,
                status: 'pending',
                payment: 'pending'
            },
            {
                userName: 'Amit Singh',
                email: 'amit.singh@example.com',
                eventDate: '2026-04-10',
                amount: 65000,
                status: 'completed',
                payment: 'completed'
            }
        ];

        // Update stats
        const totalBookings = mockBookings.length;
        const totalRevenue = mockBookings.reduce((sum, b) => sum + b.amount, 0);
        const completedBookings = mockBookings.filter(b => b.status === 'completed').length;
        const pendingBookings = mockBookings.filter(b => b.status === 'pending').length;

        document.getElementById('totalBookings').textContent = totalBookings;
        document.getElementById('totalRevenue').textContent = '₹' + totalRevenue.toLocaleString('en-IN');
        document.getElementById('completedBookings').textContent = completedBookings;
        document.getElementById('pendingBookings').textContent = pendingBookings;

        // Update bookings table
        const tableBody = document.getElementById('bookingsTableBody');
        if (tableBody && mockBookings.length > 0) {
            tableBody.innerHTML = mockBookings.map(booking => `
                <tr>
                    <td>${booking.userName}</td>
                    <td>${booking.email}</td>
                    <td>${new Date(booking.eventDate).toLocaleDateString('en-IN')}</td>
                    <td>₹${booking.amount.toLocaleString('en-IN')}</td>
                    <td><span style="background: ${booking.status === 'completed' ? '#dffcf0' : '#fff3cd'}; color: ${booking.status === 'completed' ? '#0f766e' : '#664d03'}; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.85rem;">${booking.status}</span></td>
                    <td><span style="background: ${booking.payment === 'completed' ? '#c6f6d5' : '#fed7d7'}; color: ${booking.payment === 'completed' ? '#22543d' : '#742a2a'}; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.85rem;">${booking.payment}</span></td>
                </tr>
            `).join('');
        }

    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// ===== UPDATED LOAD VENDOR PROFILE WITH NEW FEATURES =====

function sendContact(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    // Keep a light audit trail for demo parity with app behavior.
    console.log('Contact request:', { name, email, subject, message });
    
    showMessage('success', 'Thank you for contacting us! We will get back to you soon.');
    document.getElementById('contactForm').reset();
}

function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
    });
}

function animatePageReveal() {
    const animatedNodes = document.querySelectorAll('.reveal-up');
    animatedNodes.forEach((node, index) => {
        node.style.animationDelay = `${index * 80}ms`;
        node.classList.remove('reveal-up');
        void node.offsetWidth;
        node.classList.add('reveal-up');
    });
}

function getCurrentPageName() {
    const page = window.location.pathname.split('/').pop();
    return page && page.length ? page : 'index.html';
}

function guardProtectedPage() {
    const page = getCurrentPageName();
    if (!currentUser && protectedPages.has(page)) {
        localStorage.setItem('after_login_page', page);
        window.location.href = 'login.html';
        return;
    }

    if (page === 'admin.html' && currentUser?.role !== 'admin') {
        showMessage('error', 'Admin access required');
        setTimeout(() => { window.location.href = 'index.html'; }, 600);
    }

    if (page === 'vendor-dashboard.html' && currentUser?.role !== 'vendor') {
        showMessage('error', 'Vendor access required');
        setTimeout(() => { window.location.href = 'index.html'; }, 600);
    }
}

function renderAdminPaginationControls() {
    const prevBtn = document.getElementById('adminPrevBtn');
    const nextBtn = document.getElementById('adminNextBtn');

    if (!prevBtn || !nextBtn) return;

    prevBtn.disabled = adminPagination.page <= 1;
    nextBtn.disabled = adminPagination.page >= adminPagination.totalPages;
}

function changeAdminPage(delta) {
    const pageInput = document.getElementById('adminPage');
    if (!pageInput) return;

    const nextPage = Math.min(
        Math.max(adminPagination.page + delta, 1),
        Math.max(adminPagination.totalPages, 1)
    );

    if (nextPage === adminPagination.page) return;

    pageInput.value = String(nextPage);
    loadAdminUsers();
}

function goToAdminDashboard() {
    if (currentUser?.role !== 'admin') {
        showMessage('error', 'Admin access required');
        return;
    }
    window.location.href = 'admin.html';
}

async function loadAdminUsers(event) {
    if (event) event.preventDefault();

    const pageInput = document.getElementById('adminPage');
    const limitInput = document.getElementById('adminLimit');
    const roleInput = document.getElementById('adminRole');
    const searchInput = document.getElementById('adminSearch');
    const tableBody = document.getElementById('adminUsersBody');
    const pager = document.getElementById('adminPager');

    if (!tableBody || !pager) return;

    const token = localStorage.getItem('wedding_token');
    if (!token) {
        tableBody.innerHTML = '<tr><td colspan="6">Missing JWT token. Please login again as admin.</td></tr>';
        pager.textContent = '';
        return;
    }

    const page = Math.max(Number(pageInput?.value || 1), 1);
    const limit = Math.min(Math.max(Number(limitInput?.value || 20), 1), 100);

    if (pageInput) pageInput.value = String(page);
    if (limitInput) limitInput.value = String(limit);
    const role = roleInput?.value || '';
    const search = searchInput?.value?.trim() || '';

    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit)
    });

    if (role) params.set('role', role);
    if (search) params.set('search', search);

    try {
        tableBody.innerHTML = '<tr><td colspan="6">Loading users...</td></tr>';
        const response = await fetch(`/api/admin/users?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to load users');
        }

        if (!result.users || result.users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">No users found.</td></tr>';
            adminPagination = {
                page: result.pagination.page,
                totalPages: result.pagination.totalPages,
                limit: result.pagination.limit,
                total: result.pagination.total
            };
            pager.textContent = `Page ${result.pagination.page} of ${result.pagination.totalPages}`;
            renderAdminPaginationControls();
            return;
        }

        tableBody.innerHTML = result.users.map((u) => `
            <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.phone || '-'}</td>
                <td>${u.role}</td>
                <td>${new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                <td>${u.id}</td>
            </tr>
        `).join('');

        adminPagination = {
            page: result.pagination.page,
            totalPages: result.pagination.totalPages,
            limit: result.pagination.limit,
            total: result.pagination.total
        };

        pager.textContent = `Page ${result.pagination.page} of ${result.pagination.totalPages} | Total: ${result.pagination.total}`;
        renderAdminPaginationControls();
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="6">${error.message || 'Failed to load users'}</td></tr>`;
        pager.textContent = '';
        renderAdminPaginationControls();
    }
}

function loadFavorites() {
    const saved = localStorage.getItem('wedding_favorites');
    favorites = saved ? JSON.parse(saved) : [];
}

async function hydratePageData() {
    const page = getCurrentPageName();

    await loadVendorsFromApi();

    if (document.getElementById('vendorsList')) {
        displayVendors(vendorCatalog, 'vendorsList');
    }

    if (document.getElementById('vendorDetailsMount')) {
        displayVendorDetails();
    }

    if (document.getElementById('favoritesList')) {
        displayFavorites();
    }

    if (document.getElementById('bookingsList')) {
        loadBookings();
        displayBookings();
    }

    if (document.getElementById('paymentsList')) {
        loadBookings();
        loadPayments();
        displayPayments();
    }

    if (document.getElementById('paymentGatewayMount')) {
        displayPaymentGateway();
    }

    if (document.getElementById('galleryList')) {
        displayGallery();
    }

    if (document.getElementById('budgetDisplay')) {
        loadPayments();
        displayBudget();
    }

    if (page === 'profile.html' && currentUser) {
        const nameInput = document.getElementById('profileName');
        const emailInput = document.getElementById('profileEmail');
        const phoneInput = document.getElementById('profilePhone');
        const adminCta = document.getElementById('profile-admin-cta');
        const vendorCta = document.getElementById('profile-vendor-cta');
        if (nameInput) nameInput.value = currentUser.name;
        if (emailInput) emailInput.value = currentUser.email;
        if (phoneInput) phoneInput.value = currentUser.phone;
        if (adminCta) adminCta.style.display = currentUser.role === 'admin' ? 'block' : 'none';
        if (vendorCta) vendorCta.style.display = currentUser.role === 'vendor' ? 'block' : 'none';
    }

    if (page === 'vendor-dashboard.html' && currentUser) {
        if (currentUser.role !== 'vendor') {
            showMessage('error', 'Only vendors can access this page');
            window.location.href = 'profile.html';
            return;
        }
        loadVendorProfile();
    }

    if (page === 'admin.html') {
        await loadAdminUsers();
    }

    // No booking form in parity layout: bookings are created from vendor action.
}

