// Global State
let currentUser = null;
let bookings = [];
let vendors = [];
let favorites = [];
let payments = [];
let gallery = [];
let budget = { total: 0, spent: 0 };

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
    profile: 'profile.html'
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
    'profile.html'
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
function register(event) {
    event.preventDefault();

    const user = {
        id: Date.now(),
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        password: document.getElementById('regPassword').value
    };

    localStorage.setItem('wedding_user', JSON.stringify(user));
    currentUser = user;
    showMessage('success', 'Registration successful! Welcome!');
    setTimeout(() => showSection('home'), 800);
    updateAuthUI();
}

function login(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // For demo: accept any credentials
    const user = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        phone: '(555) 123-4567',
        password: password
    };

    localStorage.setItem('wedding_user', JSON.stringify(user));
    currentUser = user;
    showMessage('success', 'Login successful!');
    document.getElementById('loginForm').reset();
    const nextPage = localStorage.getItem('after_login_page');
    if (nextPage) {
        localStorage.removeItem('after_login_page');
        setTimeout(() => { window.location.href = nextPage; }, 600);
    } else {
        setTimeout(() => showSection('home'), 800);
    }
    updateAuthUI();
}

function logout() {
    localStorage.removeItem('wedding_user');
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
    const userProfile = document.getElementById('user-profile');

    if (currentUser) {
        authNav.forEach(el => el.style.display = 'none');
        userNav.forEach(el => el.style.display = 'block');
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
        <div class="vendor-card" onclick="openVendorDetails(${vendor.id})" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openVendorDetails(${vendor.id})}">
            <div class="vendor-image">
                <img src="${vendor.img}" alt="${vendor.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900'">
                <div class="vendor-overlay-left">
                    <div class="vendor-category">${vendor.category}</div>
                </div>
                <div class="vendor-overlay-right">
                    <div class="vendor-rating">⭐ ${vendor.rating}</div>
                </div>
            </div>
            <div class="vendor-content">
                <div class="vendor-header">
                    <div>
                        <h3 class="vendor-title">${vendor.name}</h3>
                    </div>
                </div>
                <p class="vendor-location">📍 ${vendor.location}</p>
                <p>${vendor.desc}</p>
                <div class="vendor-price">₹${vendor.price.toLocaleString()} <span>/ starting</span></div>
                <div class="vendor-actions">
                    <button class="favorite-btn ${favorites.includes(vendor.id) ? 'active' : ''}" onclick="event.stopPropagation();toggleFavorite(${vendor.id})">
                        ${favorites.includes(vendor.id) ? '❤️ Saved' : '🤍 Save'}
                    </button>
                    <button onclick="event.stopPropagation();openVendorDetails(${vendor.id})">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

function openVendorDetails(vendorId) {
    window.location.href = `vendor-details.html?id=${vendorId}`;
}

function filterVendors() {
    const search = document.getElementById('vendorSearch').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    const filtered = mockVendors.filter(v => 
        (v.name.toLowerCase().includes(search) || v.desc.toLowerCase().includes(search)) &&
        (!category || v.category === category)
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
    displayVendors(mockVendors, 'vendorsList');
    displayFavorites();
}

// ===== FAVORITES =====
function displayFavorites() {
    const favoriteVendors = mockVendors.filter(v => favorites.includes(v.id));
    const container = document.getElementById('favoritesList');
    if (!container) return;

    if (favoriteVendors.length === 0) {
        container.innerHTML = '<p class="empty-message">No favorites yet. Save some vendors!</p>';
        return;
    }

    displayVendors(favoriteVendors, 'favoritesList');
}

function displayVendorDetails() {
    const mount = document.getElementById('vendorDetailsMount');
    if (!mount) return;

    const params = new URLSearchParams(window.location.search);
    const vendorId = Number(params.get('id'));
    const vendor = mockVendors.find(v => v.id === vendorId);

    if (!vendor) {
        mount.innerHTML = `
            <div class="form-container">
                <h3>Vendor Not Found</h3>
                <p class="empty-message">The selected vendor could not be loaded.</p>
                <a class="inline-link" href="vendors.html">Back to Vendors</a>
            </div>
        `;
        return;
    }

    mount.innerHTML = `
        <div class="form-container vendor-detail-shell reveal-up">
            <a class="inline-link" href="vendors.html">← Back to Vendors</a>
            <div class="vendor-detail-grid">
                <img class="vendor-detail-image" src="${vendor.img}" alt="${vendor.name}" referrerpolicy="no-referrer">
                <div class="vendor-detail-content">
                    <div class="vendor-detail-top">
                        <div class="vendor-category">${vendor.category}</div>
                        <div class="vendor-rating">⭐ ${vendor.rating}</div>
                    </div>
                    <h2 class="vendor-detail-title">${vendor.name}</h2>
                    <p class="vendor-location">📍 ${vendor.location}</p>
                    <p class="vendor-detail-desc">${vendor.desc}</p>
                    <div class="vendor-detail-meta">
                        <p><strong>Starting Price:</strong> ₹${vendor.price.toLocaleString()}</p>
                        ${vendor.email ? `<p><strong>Email:</strong> <a href="mailto:${vendor.email}">${vendor.email}</a></p>` : ''}
                    </div>
                    <div class="vendor-actions vendor-detail-actions">
                        <button onclick="toggleFavorite(${vendor.id})" class="favorite-btn ${favorites.includes(vendor.id) ? 'active' : ''}">
                            ${favorites.includes(vendor.id) ? '❤️ Saved' : '🤍 Save'}
                        </button>
                        <button onclick="bookVendor(${vendor.id}, '${vendor.name.replace(/'/g, "\\'")}')">Book Now</button>
                    </div>
                </div>
            </div>
            <div class="vendor-reviews-block">
                <h3>Reviews</h3>
                ${vendor.reviews && vendor.reviews.length > 0
                    ? vendor.reviews.map(r => `<article class="vendor-review-item"><p class="vendor-review-head">⭐ ${r.rating}/5 by <strong>${r.user}</strong></p><p>"${r.comment}"</p></article>`).join('')
                    : '<p>No reviews yet.</p>'}
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

    const selectedVendor = mockVendors.find(v => v.id === vendorId);
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
            <article class="summary-card"><h4>Total Bookings</h4><p>${bookings.length}</p></article>
            <article class="summary-card"><h4>Total Value</h4><p>₹${total.toLocaleString()}</p></article>
            <article class="summary-card"><h4>Paid</h4><p>${paid}</p></article>
            <article class="summary-card"><h4>Pending</h4><p>${pending}</p></article>
        `;
    }

    if (bookings.length === 0) {
        container.innerHTML = '<p class="empty-message">No bookings yet. Start planning your big day!</p>';
        return;
    }

    container.innerHTML = bookings.map((booking) => `
        <div class="list-item booking-card">
            <div class="booking-left">
                <div class="booking-id">ID #${booking.booking_id}</div>
                <div>
                    <h4>${booking.vendor_name}</h4>
                    <p class="booking-service">${booking.service_type}</p>
                    <p class="booking-date">${new Date(booking.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
            </div>
            <div class="booking-right">
                <div class="booking-amount">₹${booking.budget.toLocaleString()}</div>
                <div class="booking-status ${booking.payment_status === 'paid' ? 'paid' : 'pending'}">
                    <span class="status-dot"></span>
                    ${booking.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                </div>
                <div class="booking-actions">
                    ${booking.payment_status !== 'paid' ? `<button onclick="startPayment(${booking.booking_id})">Pay Now</button>` : ''}
                    <button class="delete-btn" onclick="deleteBooking(${booking.booking_id})">Cancel</button>
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
            <div class="form-container">
                <h3>Payment Gateway Mock</h3>
                <p class="empty-message">No pending booking selected for payment.</p>
                <a class="inline-link" href="bookings.html">Back to My Bookings</a>
            </div>
        `;
        return;
    }

    mount.innerHTML = `
        <div class="form-container gateway-shell reveal-up">
            <div class="gateway-header">
                <h2>Secure Checkout (Mock)</h2>
                <p>Simulated payment gateway for ${booking.vendor_name}</p>
            </div>
            <div class="gateway-summary">
                <p><strong>Booking ID:</strong> #${booking.booking_id}</p>
                <p><strong>Vendor:</strong> ${booking.vendor_name}</p>
                <p><strong>Amount:</strong> ₹${booking.budget.toLocaleString()}</p>
            </div>
            <form id="gatewayForm" onsubmit="processGatewayPayment(event)">
                <select id="gatewayMethod" required>
                    <option value="">Select Payment Method</option>
                    <option value="Credit/Debit Card">Credit/Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Net Banking">Net Banking</option>
                </select>
                <input id="gatewayAccount" type="text" placeholder="Card/UPI/Account (mock)" required>
                <button type="submit">Pay ₹${booking.budget.toLocaleString()}</button>
                <a class="inline-link" href="bookings.html">Cancel</a>
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
        ${unpaidBookings.map(b => `<option value="${b.booking_id}">${b.vendor_name} - ₹${b.budget.toLocaleString()} (${b.booking_date})</option>`).join('')}
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
            <article class="summary-card"><h4>Total Paid</h4><p>₹${total.toLocaleString()}</p></article>
            <article class="summary-card"><h4>Transactions</h4><p>${payments.length}</p></article>
            <article class="summary-card"><h4>Successful</h4><p>${payments.length ? Math.round((successCount / payments.length) * 100) : 0}%</p></article>
        `;
    }

    if (payments.length === 0) {
        container.innerHTML = '<p class="empty-message">No payments recorded yet. Your payment history will appear here after your first vendor payment.</p>';
        return;
    }

    container.innerHTML = payments.map((payment) => `
        <div class="list-item payment-card">
            <div class="payment-left">
                <div class="payment-icon">${payment.method.includes('Card') ? '💳' : payment.method === 'UPI' ? '📱' : '🏦'}</div>
                <div>
                    <h4>${payment.vendor_name}</h4>
                    <p class="payment-method">${payment.method}</p>
                    <p class="txn">TXN: ${payment.transaction_id}</p>
                </div>
            </div>
            <div class="payment-right">
                <div class="payment-amount">₹${payment.amount.toLocaleString()}</div>
                <div class="payment-status ${payment.status === 'success' ? 'paid' : 'pending'}">
                    <span class="status-dot"></span>
                    ${payment.status === 'success' ? 'Success' : 'Pending'}
                </div>
                <p class="payment-date">${new Date(payment.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <button class="delete-btn" onclick="deletePayment(${payment.payment_id})">Delete</button>
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
        container.innerHTML = '<p class="empty-message">No gallery items yet.</p>';
        return;
    }

    container.innerHTML = gallery.map((item, index) => `
        <div class="gallery-item">
            <img src="${item.url}" alt="${item.title}" class="gallery-image" onerror="this.src='https://via.placeholder.com/250x200'">
            <div class="gallery-content">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
                <button class="delete-btn" onclick="deleteGalleryItem(${index})">Delete</button>
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
        <div class="budget-container budget-shell">
            <div class="budget-form budget-form-main">
                <h3>Set Budget Goal</h3>
                <input type="number" placeholder="Total Budget" id="totalBudget" value="${budget.total}">
                <button onclick="updateBudget()">Update Total Budget</button>

                <h3>Add Expense</h3>
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
                    <button type="submit">Add Expense</button>
                </form>
            </div>

            <div class="budget-stats-wrap">
                <div class="budget-stat">
                    <h3>Total Budget</h3>
                    <div class="budget-value">₹${budget.total.toLocaleString()}</div>
                </div>
                <div class="budget-stat">
                    <h3>Spent (Payments + Expenses)</h3>
                    <div class="budget-value">₹${spent.toLocaleString()}</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
                <div class="budget-stat">
                    <h3>Remaining</h3>
                    <div class="budget-value" style="color: ${remaining < 0 ? '#ef4444' : '#ec4899'}">
                        ₹${Math.abs(remaining).toLocaleString()}
                    </div>
                </div>
                <p class="budget-breakdown">Payments: ₹${paymentSpent.toLocaleString()} | Manual Expenses: ₹${manualSpent.toLocaleString()}</p>

                <div class="budget-items-list">
                    <h3>Manual Expense Items</h3>
                    ${budgetItems.length === 0
                        ? '<p class="empty-message">No manual expenses added yet.</p>'
                        : budgetItems.map(item => `
                            <div class="budget-item-row">
                                <div>
                                    <strong>${item.description || item.category}</strong>
                                    <p>${item.category}</p>
                                </div>
                                <div>
                                    <span>₹${Number(item.amount).toLocaleString()}</span>
                                    <button class="delete-btn" onclick="deleteBudgetItem(${item.item_id})">Remove</button>
                                </div>
                            </div>
                        `).join('')}
                </div>
            </div>
        </div>
    `;
}

function showMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.3s';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

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
    }
}

function loadFavorites() {
    const saved = localStorage.getItem('wedding_favorites');
    favorites = saved ? JSON.parse(saved) : [];
}

function hydratePageData() {
    const page = getCurrentPageName();

    if (document.getElementById('vendorsList')) {
        displayVendors(mockVendors, 'vendorsList');
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
        if (nameInput) nameInput.value = currentUser.name;
        if (emailInput) emailInput.value = currentUser.email;
        if (phoneInput) phoneInput.value = currentUser.phone;
    }

    // No booking form in parity layout: bookings are created from vendor action.
}

