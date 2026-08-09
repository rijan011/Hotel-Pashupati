/**
 * HOTEL PASHUPATI - LUXURY GLASSMORPHISM & UI/UX MOTION ENGINE
 * Features:
 * - Frosted Glass Navigation & Card UI
 * - Interactive Quantity Steppers (- and +)
 * - Room Number Dictionary & Live Price Calculator
 * - Dining Shopping Cart & Order Summary Drawer
 * - Touch & Keyboard Lightbox Gallery
 * - Direct Phone Call & Toast System
 */

// Room numbers dictionary by category
const ROOM_NUMBERS = {
  nonac: ['201', '202', '203', '207', '301', '302', '303', '304'],
  ac: ['102', '103', '209', '210', '211', '212', '213'],
  sweet: ['S1', 'S2', 'S3', 'S4']
};

// Hotel Contact Numbers
const HOTEL_PHONE = '+9779855085204';      // Main Hotel Number
const OWNER_PHONE = '+9779855041565';      // Surendra Bhattarai (Owner)
const MANAGER_PHONE = '+9779842621833';    // Hotel Manager
const RECEPTION_PHONE = '055-540204';      // Landline Reception
const HOTEL_EMAIL = 'hotelpashupati204@gmail.com';

// Shopping Cart State
let cart = JSON.parse(localStorage.getItem('diningCart')) || [];

// Room Price Lookup Function (NPR)
function getRoomPrice(type, roomNo) {
  if (!type || !roomNo) return null;
  if (type === 'nonac') return 1000;
  if (type === 'ac') {
    if (['101', '102', '103'].includes(roomNo)) return 1600;
    if (['209', '210', '211', '212'].includes(roomNo)) return 1800;
    if (roomNo === '213') return 1400;
    return 1600;
  }
  if (type === 'sweet') {
    if (roomNo === 'S1') return 2800;
    if (['S2', 'S3', 'S4'].includes(roomNo)) return 2000;
    return 2000;
  }
  return null;
}

// Populate Room Number Dropdown
function populateRoomNo(type) {
  const sel = document.getElementById('roomNo');
  if (!sel) return;

  sel.innerHTML = '<option value="">Select a room number</option>';
  if (!type || !ROOM_NUMBERS[type]) return;

  const list = ROOM_NUMBERS[type];
  for (const n of list) {
    const opt = document.createElement('option');
    opt.value = n;
    const price = getRoomPrice(type, n);
    opt.textContent = price ? `${n} - Rs. ${price}` : n;
    opt.dataset.price = price || '';
    sel.appendChild(opt);
  }
}

// Quantity Stepper UI/UX Control (- and + buttons)
function changeQuantity(btn, delta) {
  const stepper = btn.closest('.quantity-stepper');
  if (!stepper) return;
  const input = stepper.querySelector('input');
  if (!input) return;

  let currentVal = parseInt(input.value) || 1;
  currentVal += delta;
  if (currentVal < 1) currentVal = 1;
  input.value = currentVal;
}

// Toast Notification with Vector SVG Checkmark Icon
function showToast(msg, duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<svg class="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="#C5A059" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${msg}</span>`;
  container.appendChild(toast);

  void toast.offsetWidth;
  toast.classList.add('showing');

  setTimeout(() => {
    toast.classList.remove('showing');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// Room Filtering Functionality
function filterRooms(category) {
  const roomCards = document.querySelectorAll('.room-card');
  const tabButtons = document.querySelectorAll('.tab-btn');

  tabButtons.forEach(btn => {
    if (btn.dataset.category === category || btn.getAttribute('onclick')?.includes(category)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  roomCards.forEach(card => {
    const cardCategory = card.dataset.category;
    if (category === 'all' || cardCategory === category) {
      card.style.display = 'flex';
      card.style.animation = 'fadeIn 0.4s ease-in-out';
    } else {
      card.style.display = 'none';
    }
  });
}

// Cart Storage & Management
function saveCart() {
  localStorage.setItem('diningCart', JSON.stringify(cart));
}

function addToCart(name, price, evt) {
  const currentEvent = evt || (typeof event !== 'undefined' ? event : null);
  const targetEl = currentEvent ? (currentEvent.target || currentEvent.srcElement) : null;
  const button = targetEl ? (targetEl.closest('button') || targetEl) : null;

  let quantityInput = null;
  if (button) {
    const card = button.closest('.menu-item-card, .card');
    if (card) quantityInput = card.querySelector('input[type="number"]');
    if (!quantityInput && button.parentElement) {
      quantityInput = button.parentElement.querySelector('input[type="number"]');
    }
  }

  const quantity = quantityInput ? (parseInt(quantityInput.value) || 1) : 1;

  if (quantity <= 0) {
    showToast('Please select a quantity greater than 0');
    return;
  }

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }

  saveCart();
  updateCartDisplay();
  showToast(`Added ${quantity} x ${name} to cart`);
  if (quantityInput) quantityInput.value = 1;
}

function removeFromCart(index) {
  if (index >= 0 && index < cart.length) {
    const removed = cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
    showToast(`Removed ${removed[0]?.name || 'item'} from cart`);
  }
}

function updateCartDisplay() {
  const cartItemsEl = document.getElementById('cart-items');
  const cartCountEl = document.getElementById('cart-count');
  const orderItemsEl = document.getElementById('orderItems');
  const orderTotalEl = document.getElementById('orderTotal');

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartCountEl) cartCountEl.textContent = totalCount;

  if (cartItemsEl) {
    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p style="color:var(--text-muted);">Your dining cart is empty</p>';
    } else {
      cartItemsEl.innerHTML = cart.map((item, index) => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding:12px; background:var(--bg-secondary); border:1px solid var(--border-gold); border-radius:8px;">
          <div>
            <div style="font-weight:700; color:var(--color-black);">${item.name}</div>
            <div style="font-size:0.85rem; color:var(--text-secondary);">Rs. ${item.price} x ${item.quantity} = Rs. ${item.price * item.quantity}</div>
          </div>
          <button onclick="removeFromCart(${index})" class="btn btn-outline" style="padding:4px 10px; font-size:0.78rem; border-color:#d9534f; color:#d9534f;">Remove</button>
        </div>
      `).join('');
    }
  }

  if (orderItemsEl) {
    if (cart.length === 0) {
      orderItemsEl.innerHTML = '<p style="color:var(--text-muted);">No dining items selected</p>';
    } else {
      orderItemsEl.innerHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:6px; color:var(--color-black);">
          <span>${item.name} (x${item.quantity})</span>
          <span>Rs. ${item.price * item.quantity}</span>
        </div>
      `).join('');
    }
  }

  if (orderTotalEl) {
    orderTotalEl.textContent = `Total: Rs. ${totalPrice}`;
  }
}

function openCart() {
  let modal = document.getElementById('cart-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.className = 'cart-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="cart-header">
        <h3 class="cart-title">Your Order Summary</h3>
        <button onclick="closeCart()" class="btn btn-outline" style="padding:6px 12px;" aria-label="Close Cart">
          <svg class="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div id="cart-items" style="flex-grow:1; overflow-y:auto; padding-right:8px;"></div>
      <div id="cart-checkout-section" style="border-top: 1px solid var(--border-gold); padding-top:20px; margin-top:20px;">
        <div id="orderTotal" style="font-family:var(--font-heading); font-size:1.2rem; font-weight:800; color:var(--color-gold-dark); margin-bottom:14px;">Total: Rs. 0</div>
        <form id="cartOrderForm" onsubmit="submitFoodOrder(event)" style="display:flex; flex-direction:column; gap:10px;">
          <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-gold-dark);">Guest & Delivery Info</div>
          <input type="text" id="cart-guest-name" required placeholder="Full Name *" style="padding:10px 12px; border-radius:8px; border:1px solid var(--border-gold); background:rgba(0,0,0,0.05); font-size:0.88rem; outline:none;">
          <input type="tel" id="cart-guest-phone" required placeholder="Phone / WhatsApp *" style="padding:10px 12px; border-radius:8px; border:1px solid var(--border-gold); background:rgba(0,0,0,0.05); font-size:0.88rem; outline:none;">
          <input type="text" id="cart-table-room" placeholder="Table No / Room No / Special Notes" style="padding:10px 12px; border-radius:8px; border:1px solid var(--border-gold); background:rgba(0,0,0,0.05); font-size:0.88rem; outline:none;">
          <button type="submit" class="btn btn-primary" style="width:100%; font-weight:700; text-transform:uppercase; margin-top:4px;">Place Food Order</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  updateCartDisplay();
}

function closeCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

async function submitFoodOrder(e) {
  if (e) e.preventDefault();

  if (!cart || cart.length === 0) {
    if (typeof showToast === 'function') showToast('Your cart is empty!');
    return;
  }

  const name = document.getElementById('cart-guest-name')?.value || 'Guest';
  const phone = document.getElementById('cart-guest-phone')?.value || '';
  const tableRoom = document.getElementById('cart-table-room')?.value || 'Dine-in / Direct';

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemsBreakdown = cart.map(item => `${item.name} (x${item.quantity}) - Rs. ${item.price * item.quantity}`).join(', ');
  const refId = 'FOOD-' + Math.floor(100000 + Math.random() * 900000);

  const submitBtn = e?.target?.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Food Order...';
  }

  // 1. Submit to Formspree
  const formData = new FormData();
  formData.append('Order_Type', 'Restaurant Food Order');
  formData.append('Order_Ref_ID', refId);
  formData.append('Guest_Name', name);
  formData.append('Phone_WhatsApp', phone);
  formData.append('Table_Room_Notes', tableRoom);
  formData.append('Order_Items', itemsBreakdown);
  formData.append('Total_Amount', `Rs. ${totalPrice}`);

  try {
    const res = await fetch('https://formspree.io/f/xlgqkdqj', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      if (typeof showToast === 'function') showToast('Food order sent directly to kitchen!');
    }
  } catch (err) {
    console.error('Food order submission error:', err);
  }

  // 2. Format WhatsApp redirect text
  let itemsWhatsAppText = '';
  cart.forEach(item => {
    itemsWhatsAppText += `%0A- ${encodeURIComponent(item.name)} (x${item.quantity}) - Rs. ${item.price * item.quantity}`;
  });

  const message = `*NEW RESTAURANT FOOD ORDER - HOTEL PASHUPATI*%0A` +
    `*Order Ref:* ${refId}%0A` +
    `*Customer Name:* ${encodeURIComponent(name)}%0A` +
    `*Phone:* ${encodeURIComponent(phone)}%0A` +
    `*Table/Room/Notes:* ${encodeURIComponent(tableRoom)}%0A` +
    `*ITEMS ORDERED:*${itemsWhatsAppText}%0A%0A` +
    `*TOTAL AMOUNT:* Rs. ${totalPrice}`;

  // 3. Clear cart
  cart = [];
  updateCartDisplay();

  // 4. Update cart modal UI with order confirmation
  const checkoutSection = document.getElementById('cart-checkout-section');
  if (checkoutSection) {
    checkoutSection.innerHTML = `
      <div style="text-align:center; padding:16px 8px;">
        <h4 style="font-family:var(--font-heading); font-size:1.2rem; color:var(--color-gold-dark); margin-bottom:8px;">Food Order Submitted!</h4>
        <p style="font-size:0.88rem; color:var(--color-black); margin-bottom:12px;">Order Code: <strong>${refId}</strong></p>
        <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.5; margin-bottom:18px;">Your order has been submitted to the kitchen via Formspree. Opening WhatsApp for direct kitchen confirmation...</p>
        <a href="https://wa.me/9779855085204?text=${message}" target="_blank" class="btn btn-primary" style="width:100%; display:inline-block; text-decoration:none; margin-bottom:10px; font-weight:700;">
          Open WhatsApp Confirmation
        </a>
        <button onclick="closeCart()" class="btn btn-outline" style="width:100%;">Close Cart</button>
      </div>
    `;
  }

  // 5. Open WhatsApp redirect
  window.open(`https://wa.me/9779855085204?text=${message}`, '_blank');
}

// Lightbox Gallery Module
function initLightbox() {
  const images = Array.from(document.querySelectorAll('.gallery-item img, #hall .gallery img, #dining .gallery img'));
  if (!images.length) return;

  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML = `
      <img id="lightboxImg" class="lightbox-img" src="" alt="Gallery Preview">
      <button class="lightbox-close" aria-label="Close">
        <svg class="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <button class="lightbox-prev" aria-label="Previous">
        <svg class="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button class="lightbox-next" aria-label="Next">
        <svg class="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    `;
    document.body.appendChild(lb);
  }

  const lbImg = document.getElementById('lightboxImg');
  const btnClose = lb.querySelector('.lightbox-close');
  const btnPrev = lb.querySelector('.lightbox-prev');
  const btnNext = lb.querySelector('.lightbox-next');

  let currentIndex = 0;

  const showImage = (index) => {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentIndex = index;
    lbImg.src = images[currentIndex].src;
    lbImg.alt = images[currentIndex].alt || 'Gallery View';
  };

  images.forEach((img, i) => {
    img.addEventListener('click', () => {
      showImage(i);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    });
  });

  const closeLb = () => {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
  };

  btnClose.addEventListener('click', closeLb);
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });
  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });

  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLb();
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
  });
}

// Interactive Luxury Booking Modal System
function openBookingModal(preselectedCategory = 'ac') {
  let modalOverlay = document.getElementById('booking-modal-overlay');

  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'booking-modal-overlay';
    modalOverlay.className = 'booking-modal-overlay';

    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    modalOverlay.innerHTML = `
      <div class="booking-modal-card" role="dialog" aria-labelledby="modal-booking-title">
        <button type="button" class="booking-modal-close" onclick="closeBookingModal()" aria-label="Close Modal">&times;</button>
        <div class="booking-modal-header">
          <h3 id="modal-booking-title">Reserve <span>Hotel Pashupati</span></h3>
          <p>Chandrapur, Rautahat • Direct Reservation</p>
        </div>
        <div id="booking-modal-body">
          <form id="popupBookingForm" action="https://formspree.io/f/xlgqkdqj" method="POST" onsubmit="submitBookingModal(event)">
            <div class="booking-form-row">
              <div class="booking-field-group">
                <label for="popup-guest-name">Full Name *</label>
                <input type="text" id="popup-guest-name" name="name" required placeholder="e.g. Ram Prasad Sharma">
              </div>
              <div class="booking-field-group">
                <label for="popup-guest-phone">Phone / WhatsApp *</label>
                <input type="tel" id="popup-guest-phone" name="phone" required placeholder="e.g. 9855085204">
              </div>
            </div>

            <div class="booking-form-row">
              <div class="booking-field-group">
                <label for="popup-service-type">Service / Room Category</label>
                <select id="popup-service-type" name="service">
                  <option value="Standard Non-AC Room (Rs. 1,000 / night)">Standard Non-AC Room (Rs. 1,000 / night)</option>
                  <option value="Deluxe AC Room (Rs. 1,600 / night)" selected>Deluxe AC Room (Rs. 1,600 / night)</option>
                  <option value="VIP Executive Suite (Rs. 2,800 / night)">VIP Executive Suite (Rs. 2,800 / night)</option>
                  <option value="Banquet & Event Hall">Banquet & Event Hall</option>
                  <option value="Restaurant Dining Table">Restaurant Dining Table</option>
                </select>
              </div>
              <div class="booking-field-group">
                <label for="popup-guest-count">Guests</label>
                <select id="popup-guest-count" name="guests">
                  <option value="1 Guest">1 Guest</option>
                  <option value="2 Guests" selected>2 Guests</option>
                  <option value="3 Guests">3 Guests</option>
                  <option value="4+ Guests / Family">4+ Guests / Family</option>
                </select>
              </div>
            </div>

            <div class="booking-form-row">
              <div class="booking-field-group">
                <label for="popup-checkin">Check-in Date</label>
                <input type="date" id="popup-checkin" name="check_in" value="${today}">
              </div>
              <div class="booking-field-group">
                <label for="popup-checkout">Check-out Date</label>
                <input type="date" id="popup-checkout" name="check_out" value="${tomorrow}">
              </div>
            </div>

            <div class="booking-field-group">
              <label for="popup-notes">Special Requests / Notes</label>
              <textarea id="popup-notes" name="special_requests" rows="2" placeholder="Arrival time, extra bed, dietary requests..."></textarea>
            </div>

            <div class="booking-actions-group">
              <button type="submit" class="btn-submit-booking">
                Submit Booking Request
              </button>
              <a href="tel:+9779855085204" onclick="closeBookingModal()" class="btn-call-submit">
                Call Front Desk: +977 9855085204
              </a>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeBookingModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeBookingModal();
    });
  } else {
    // Reset body content if previously submitted
    const modalBody = document.getElementById('booking-modal-body');
    if (modalBody && !document.getElementById('popupBookingForm')) {
      const today = new Date().toISOString().split('T')[0];
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrow = tomorrowDate.toISOString().split('T')[0];
      modalBody.innerHTML = `
        <form id="popupBookingForm" action="https://formspree.io/f/xlgqkdqj" method="POST" onsubmit="submitBookingModal(event)">
          <div class="booking-form-row">
            <div class="booking-field-group">
              <label for="popup-guest-name">Full Name *</label>
              <input type="text" id="popup-guest-name" name="name" required placeholder="e.g. Ram Prasad Sharma">
            </div>
            <div class="booking-field-group">
              <label for="popup-guest-phone">Phone / WhatsApp *</label>
              <input type="tel" id="popup-guest-phone" name="phone" required placeholder="e.g. 9855085204">
            </div>
          </div>

          <div class="booking-form-row">
            <div class="booking-field-group">
              <label for="popup-service-type">Service / Room Category</label>
              <select id="popup-service-type" name="service">
                <option value="Standard Non-AC Room (Rs. 1,000 / night)">Standard Non-AC Room (Rs. 1,000 / night)</option>
                <option value="Deluxe AC Room (Rs. 1,600 / night)" selected>Deluxe AC Room (Rs. 1,600 / night)</option>
                <option value="VIP Executive Suite (Rs. 2,800 / night)">VIP Executive Suite (Rs. 2,800 / night)</option>
                <option value="Banquet & Event Hall">Banquet & Event Hall</option>
                <option value="Restaurant Dining Table">Restaurant Dining Table</option>
              </select>
            </div>
            <div class="booking-field-group">
              <label for="popup-guest-count">Guests</label>
              <select id="popup-guest-count" name="guests">
                <option value="1 Guest">1 Guest</option>
                <option value="2 Guests" selected>2 Guests</option>
                <option value="3 Guests">3 Guests</option>
                <option value="4+ Guests / Family">4+ Guests / Family</option>
              </select>
            </div>
          </div>

          <div class="booking-form-row">
            <div class="booking-field-group">
              <label for="popup-checkin">Check-in Date</label>
              <input type="date" id="popup-checkin" name="check_in" value="${today}">
            </div>
            <div class="booking-field-group">
              <label for="popup-checkout">Check-out Date</label>
              <input type="date" id="popup-checkout" name="check_out" value="${tomorrow}">
            </div>
          </div>

          <div class="booking-field-group">
            <label for="popup-notes">Special Requests / Notes</label>
            <textarea id="popup-notes" name="special_requests" rows="2" placeholder="Arrival time, extra bed, dietary requests..."></textarea>
          </div>

          <div class="booking-actions-group">
            <button type="submit" class="btn-submit-booking">
              Submit Booking Request
            </button>
            <a href="tel:+9779855085204" onclick="closeBookingModal()" class="btn-call-submit">
              Call Front Desk: +977 9855085204
            </a>
          </div>
        </form>
      `;
    }
  }

  // Preselect category if passed
  const selectEl = document.getElementById('popup-service-type');
  if (selectEl && preselectedCategory) {
    const options = Array.from(selectEl.options);
    const matchedOpt = options.find(opt => opt.value.toLowerCase().includes(preselectedCategory.toLowerCase()));
    if (matchedOpt) selectEl.value = matchedOpt.value;
  }

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
  const modalOverlay = document.getElementById('booking-modal-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

async function submitBookingModal(e) {
  if (e) e.preventDefault();

  const name = document.getElementById('popup-guest-name')?.value || 'Guest';
  const phone = document.getElementById('popup-guest-phone')?.value || '';
  const service = document.getElementById('popup-service-type')?.value || 'Deluxe Room';
  const checkin = document.getElementById('popup-checkin')?.value || 'Today';
  const checkout = document.getElementById('popup-checkout')?.value || 'Tomorrow';
  const guests = document.getElementById('popup-guest-count')?.value || '1 Guest';
  const notes = document.getElementById('popup-notes')?.value || 'None';

  const refId = 'HP-' + Math.floor(100000 + Math.random() * 900000);

  // Show loading indicator on submit button
  const submitBtn = e?.target?.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Booking...';
  }

  // Submit to Formspree AJAX endpoint
  const formData = new FormData();
  formData.append('Reference_ID', refId);
  formData.append('Guest_Name', name);
  formData.append('Phone_WhatsApp', phone);
  formData.append('Service_Category', service);
  formData.append('Check_In_Date', checkin);
  formData.append('Check_Out_Date', checkout);
  formData.append('Guests', guests);
  formData.append('Special_Requests', notes);

  try {
    const res = await fetch('https://formspree.io/f/xlgqkdqj', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      if (typeof showToast === 'function') {
        showToast('Booking request sent directly to Hotel Pashupati!');
      }
    } else {
      console.warn('Formspree response warning:', res.status);
    }
  } catch (err) {
    console.error('Formspree submission error:', err);
  }

  // Construct WhatsApp text for optional instant chat
  const message = `*NEW BOOKING REQUEST - HOTEL PASHUPATI*%0A` +
    `*Ref ID:* ${refId}%0A` +
    `*Guest Name:* ${encodeURIComponent(name)}%0A` +
    `*Phone Number:* ${encodeURIComponent(phone)}%0A` +
    `*Service/Room:* ${encodeURIComponent(service)}%0A` +
    `*Check-in Date:* ${encodeURIComponent(checkin)}%0A` +
    `*Check-out Date:* ${encodeURIComponent(checkout)}%0A` +
    `*Guests:* ${encodeURIComponent(guests)}%0A` +
    `*Notes:* ${encodeURIComponent(notes)}`;

  // Show Confirmation UI in Modal
  const modalBody = document.getElementById('booking-modal-body');
  if (modalBody) {
    modalBody.innerHTML = `
      <div class="booking-success-card">
        <div class="booking-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h4 style="font-family:var(--font-heading); font-size:1.4rem; color:#D4AF37; margin-bottom:8px;">Booking Submitted Successfully</h4>
        <p style="font-size:0.9rem; color:#d4d4d8; margin-bottom:16px;">Reference Code: <strong style="color:#FFF; background:rgba(212,175,55,0.2); padding:2px 8px; border-radius:4px;">${refId}</strong></p>
        <p style="font-size:0.86rem; color:#a1a1aa; line-height:1.5; margin-bottom:24px;">Your reservation request has been submitted directly to Hotel Pashupati management via Formspree.</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <a href="https://wa.me/9779855085204?text=${message}" target="_blank" class="btn-whatsapp-submit" style="text-decoration:none;">
            Open WhatsApp Confirmation
          </a>
          <a href="tel:+9779855085204" onclick="closeBookingModal()" class="btn-call-submit">
            Call Desk: +977 9855085204
          </a>
          <button type="button" onclick="closeBookingModal()" style="background:none; border:none; color:#a1a1aa; cursor:pointer; font-size:0.85rem; padding:8px;">Close Window</button>
        </div>
      </div>
    `;
  }

  // Open WhatsApp in new tab automatically
  window.open(`https://wa.me/9779855085204?text=${message}`, '_blank');
}

// Telephony & Popup Booking Handler
function handleBooking(event, targetNumber = HOTEL_PHONE, category = 'ac') {
  if (event) event.preventDefault();
  openBookingModal(category);
  return false;
}

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Mobile App Dock Active Tab Highlighter
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const dockTabs = document.querySelectorAll('.mobile-dock-tab[data-page]');
  dockTabs.forEach(tab => {
    const page = tab.getAttribute('data-page');
    if ((currentPath === '' || currentPath === 'index.html') && page === 'index') {
      tab.classList.add('active');
    } else if (page && currentPath.includes(page)) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Attach Popup Booking Modal triggers to all Book Now buttons & links
  const bookNavBtns = document.querySelectorAll('.btn-nav-cta, a[href="#booking"], .open-booking-trigger');
  bookNavBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });

  // Set default check-in date for quick booking strip
  const checkinInput = document.getElementById('checkinDate');
  if (checkinInput && !checkinInput.value) {
    checkinInput.value = new Date().toISOString().split('T')[0];
  }

  // Set current year safely
  const yearEls = document.querySelectorAll('#year, .year-current');
  yearEls.forEach(el => el.textContent = new Date().getFullYear());

  // Header Scroll Effect (Passive & RAF-Throttled)
  const header = document.querySelector('header');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          header?.classList.add('scrolled');
        } else {
          header?.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Service Worker Registration for Offline Cache & Fast Loading
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.warn('Service Worker registration skipped:', err);
    });
  }

  // Ultra-Responsive Mobile Menu Toggle with Backdrop Overlay & Scroll Lock
  const menuBtn = document.getElementById('menuToggle');
  const navLinks = document.getElementById('primaryNav');
  if (menuBtn && navLinks) {
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    const toggleMenu = (open) => {
      const state = open !== undefined ? open : !navLinks.classList.contains('active');
      navLinks.classList.toggle('active', state);
      menuBtn.classList.toggle('active', state);
      backdrop.classList.toggle('active', state);
      document.body.style.overflow = state ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    backdrop.addEventListener('click', () => toggleMenu(false));

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1140 && navLinks.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  }

  // Soft Clean Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal, .room-card, .stat-card, .menu-item-card, .gallery-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // Initialize Modules
  initPageCapsuleLoader();
  initLightbox();
  updateCartDisplay();
  initMenuPage();

  // Room Type Listener
  const roomTypeSel = document.getElementById('roomType');
  if (roomTypeSel) {
    populateRoomNo(roomTypeSel.value || 'nonac');
    roomTypeSel.addEventListener('change', (e) => populateRoomNo(e.target.value));
  }
});

// Minimalist Temple Full SVG + Slot Counter Hyper-Zoom Preloader (Main Page Index.html Only)
function initPageCapsuleLoader() {
  const path = window.location.pathname.toLowerCase();
  const isMainPage = path.endsWith('/') || path.endsWith('/index.html') || path === '' || path.endsWith('hotel-pashupati-main/');
  if (!isMainPage) return;

  let camouflageBackdrop = document.querySelector('.black-camouflage-backdrop');
  if (!camouflageBackdrop) {
    camouflageBackdrop = document.createElement('div');
    camouflageBackdrop.className = 'black-camouflage-backdrop';
    camouflageBackdrop.id = 'blackCamouflageBackdrop';
    document.body.prepend(camouflageBackdrop);
  }

  let loaderOverlay = document.querySelector('.page-loader-overlay');
  if (!loaderOverlay) {
    loaderOverlay = document.createElement('div');
    loaderOverlay.className = 'page-loader-overlay solid-cover';
    loaderOverlay.id = 'pageLoaderOverlay';
    loaderOverlay.setAttribute('role', 'status');
    loaderOverlay.setAttribute('aria-label', 'Loading page content...');
    loaderOverlay.innerHTML = `
      <div class="loader-stage">
        <div class="viewfinder-frame" id="viewfinderFrame">
          <div class="rect-black-overlay" id="rectBlackOverlay"></div>
          <svg class="rect-border-svg" viewBox="0 0 240 240">
            <rect class="rect-bg-border" x="0.5" y="0.5" width="239" height="239" />
            <rect class="rect-surface-tracer" id="rectTracer" x="1.2" y="1.2" width="237.6" height="237.6" />
          </svg>
          <svg class="logo-mark-svg" id="logoMarkSvg" viewBox="0 0 102.5 126">
            <path class="temple-full-svg" d="M101.5,108.797H86.686V97.916c0-0.553-0.447-1-1-1h-7.468V80.325l7.584-8.885h8.497c0.387,0,0.739-0.223,0.904-0.573  l1.57-3.323c0.019-0.039,0.027-0.081,0.04-0.122c0.01-0.03,0.022-0.059,0.029-0.09c0.02-0.092,0.031-0.185,0.025-0.278  c0-0.003-0.001-0.006-0.002-0.008c-0.007-0.092-0.029-0.182-0.061-0.27c-0.003-0.009-0.003-0.018-0.006-0.027l-1.995-5.036  c-0.083-0.209-0.233-0.384-0.427-0.497L63.41,43.22v-2.354l2.605-2.052c0.24-0.19,0.381-0.479,0.381-0.786v-3.188  c0-0.552-0.447-1-1-1h-0.743l8.664-6.877h1.513c0.24,0,0.474-0.087,0.655-0.245l3.463-3.003c0.02-0.017,0.032-0.041,0.05-0.06  c0.037-0.037,0.071-0.076,0.102-0.12c0.03-0.042,0.055-0.086,0.078-0.132c0.012-0.024,0.031-0.043,0.041-0.069  c0.007-0.017,0.004-0.034,0.01-0.051c0.032-0.092,0.049-0.187,0.053-0.285c0.001-0.024,0.008-0.047,0.007-0.07  c-0.003-0.107-0.021-0.215-0.06-0.319c-0.003-0.008-0.009-0.013-0.012-0.021c-0.011-0.029-0.031-0.052-0.045-0.08  c-0.04-0.079-0.087-0.151-0.145-0.216c-0.026-0.028-0.054-0.052-0.083-0.078c-0.067-0.059-0.141-0.107-0.222-0.146  c-0.021-0.01-0.034-0.028-0.056-0.037l-20.951-8.484c-0.119-0.048-0.246-0.073-0.375-0.073h-0.461  c-0.08-0.89-0.27-1.898-0.613-2.871c-0.002-0.004-0.003-0.009-0.005-0.013c-0.662-1.868-1.895-3.577-4.013-3.991V4.844h1.844  c0.553,0,1-0.448,1-1s-0.447-1-1-1H52.25V1c0-0.552-0.447-1-1-1s-1,0.448-1,1v1.844h-1.844c-0.553,0-1,0.448-1,1s0.447,1,1,1h1.844  v1.755c-2.118,0.414-3.352,2.124-4.013,3.991c-0.002,0.004-0.003,0.008-0.005,0.012c-0.343,0.974-0.534,1.982-0.614,2.872h-0.461  c-0.129,0-0.256,0.025-0.375,0.073l-20.951,8.484c-0.022,0.009-0.035,0.027-0.056,0.037c-0.081,0.039-0.154,0.087-0.222,0.146  c-0.029,0.026-0.057,0.05-0.083,0.078c-0.058,0.064-0.105,0.137-0.145,0.215c-0.014,0.028-0.033,0.051-0.045,0.08  c-0.003,0.008-0.009,0.013-0.012,0.021c-0.039,0.104-0.057,0.212-0.06,0.319c-0.001,0.023,0.006,0.046,0.007,0.07  c0.004,0.098,0.021,0.193,0.053,0.285c0.006,0.017,0.003,0.034,0.01,0.051c0.008,0.019,0.024,0.031,0.033,0.05  c0.038,0.08,0.087,0.152,0.146,0.221c0.023,0.026,0.041,0.055,0.066,0.078c0.01,0.01,0.016,0.022,0.027,0.031l3.463,3.003  c0.182,0.158,0.415,0.245,0.655,0.245h1.513l8.664,6.877h-0.743c-0.553,0-1,0.448-1,1v3.188c0,0.307,0.141,0.596,0.381,0.786  l2.605,2.052v2.354L8.123,61.216c-0.193,0.113-0.344,0.288-0.427,0.497l-1.995,5.036c-0.003,0.009-0.003,0.018-0.006,0.027  c-0.032,0.088-0.055,0.179-0.061,0.272c0,0.002-0.001,0.004-0.001,0.007c-0.006,0.093,0.004,0.186,0.025,0.278  c0.007,0.031,0.019,0.059,0.029,0.089c0.013,0.041,0.021,0.083,0.04,0.122l1.57,3.323c0.165,0.351,0.518,0.573,0.904,0.573h8.497  l7.584,8.885v16.591h-7.468c-0.553,0-1,0.447-1,1v10.881H1c-0.553,0-1,0.447-1,1v10.789V125c0,0.553,0.447,1,1,1h100.5  c0.553,0,1-0.447,1-1v-4.414v-10.789C102.5,109.244,102.053,108.797,101.5,108.797z M2,119.586v-5.161h39.184l-0.924,5.161H2z   M56.506,98.916l0.435,2.428H45.559l0.435-2.428H56.506z M49.091,96.68v-8.818h4.318v8.818H49.091z M45.201,103.344h12.098  l0.524,2.928H44.677L45.201,103.344z M58.182,108.271l0.375,2.096H43.943l0.375-2.096H58.182z M43.585,112.367h15.33l0.529,2.952  H43.056L43.585,112.367z M42.698,117.319h17.104l0.406,2.267H42.292L42.698,117.319z M62.24,119.586l-0.924-5.161H100.5v5.161H62.24  z M100.5,112.425H60.958l-0.292-1.628H100.5V112.425z M60.308,108.797l-1.13-6.312h25.508v6.312H60.308z M84.686,100.485H58.819  l-0.281-1.569h18.68h7.468V100.485z M26.282,84.401h15.274v8.133H26.282V84.401z M26.282,82.401v-1.445h49.936v1.445H26.282z   M32.58,71.44v7.516h-1.645V71.44H32.58z M42.335,71.44v7.516H34.58V71.44H42.335z M45.979,71.44v7.516h-1.645V71.44H45.979z   M54.521,71.44v7.516h-6.541V71.44H54.521z M58.165,71.44v7.516h-1.645V71.44H58.165z M67.92,71.44v7.516h-7.755V71.44H67.92z   M71.564,71.44v7.516H69.92V71.44H71.564z M78.518,71.44l-4.953,5.803V71.44H78.518z M28.936,77.244l-4.953-5.803h4.953V77.244z   M60.943,84.401h15.274v8.133H60.943V84.401z M76.756,78.956h-2.023l6.415-7.516h2.023L76.756,78.956z M41.09,42.795V41.38h20.32  v1.416H41.09z M55.524,44.795l36.638,21.322H10.337l36.638-21.322H55.524z M93.876,64.8L59.5,44.795h2.64l30.932,17.976L93.876,64.8  z M55.067,33.839v-6.877h2.521v6.877H55.067z M51.25,33.839h-1.817v-6.877h3.635v6.877H51.25z M44.912,33.839v-6.877h2.521v6.877  H44.912z M41.607,33.839v-6.877h1.305v6.877H41.607z M39.607,28.898l-2.515-1.936h2.515V28.898z M59.588,26.962h1.305v6.877h-1.305  V26.962z M62.893,26.962h2.515l-2.515,1.936V26.962z M62.893,32.683v-1.261l5.795-4.46H70.1L62.893,32.683z M51.25,8.494  c1.184,0,1.982,0.637,2.527,1.49h-5.061C49.26,9.13,50.061,8.494,51.25,8.494z M47.9,11.984h6.694  c0.136,0.545,0.217,1.066,0.266,1.49h-7.222C47.685,13.05,47.765,12.529,47.9,11.984z M45.352,15.474h11.797l16.013,6.484H29.339  L45.352,15.474z M26.886,23.958h48.729l-1.156,1.003H28.042L26.886,23.958z M33.813,26.962l5.795,4.46v1.261L32.4,26.962H33.813z   M38.104,35.839H51.25h13.146v1.703l-2.333,1.838H40.437l-2.333-1.838V35.839z M9.428,62.771L40.36,44.795H43L8.624,64.8  L9.428,62.771z M8.209,68.117h86.082l-0.626,1.323H8.835L8.209,68.117z M21.352,71.44l6.415,7.516h-2.023l-6.415-7.516H21.352z   M26.282,94.534h16.274c0.553,0,1-0.447,1-1v-9.133h15.387v9.133c0,0.553,0.447,1,1,1h16.274v2.382H55.409V86.861  c0-0.553-0.447-1-1-1h-6.318c-0.553,0-1,0.447-1,1v10.055H26.282V94.534z M25.282,98.916h18.68l-0.281,1.569H17.814v-1.569H25.282z   M17.814,102.485h25.508l-1.13,6.312H17.814V102.485z M41.834,110.797l-0.292,1.628H2v-1.628H41.834z M100.5,124H2v-2.414h98.5V124z"/>
          </svg>
        </div>
        <div class="loader-tagline" id="loaderTagline">HOTEL PASHUPATI</div>
        
        <!-- Slot Machine Gambling System Percentage Counter -->
        <div class="slot-counter-wrap" id="slotCounterWrap">
          <div class="slot-digit-col">
            <div class="slot-reel" id="reelHundreds">
              <span>0</span><span>1</span>
            </div>
          </div>
          <div class="slot-digit-col">
            <div class="slot-reel" id="reelTens">
              <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>0</span>
            </div>
          </div>
          <div class="slot-digit-col">
            <div class="slot-reel" id="reelUnits">
              <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>0</span>
            </div>
          </div>
          <span class="slot-percent">%</span>
        </div>

      </div>
    `;
    document.body.prepend(loaderOverlay);
  }

  const frame = document.getElementById('viewfinderFrame');
  const tagline = document.getElementById('loaderTagline');
  const counterWrap = document.getElementById('slotCounterWrap');
  const rectTracer = document.getElementById('rectTracer');

  const reelHundreds = document.getElementById('reelHundreds');
  const reelTens = document.getElementById('reelTens');
  const reelUnits = document.getElementById('reelUnits');

  const totalPerimeter = 960;

  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  // t=0.0s - Frame, tagline, counter fade in
  setTimeout(() => {
    if (frame) frame.classList.add('active');
    if (tagline) tagline.classList.add('active');
    if (counterWrap) counterWrap.classList.add('active');
  }, 50);

  // Smart session check for returning visitors
  const isRepeatVisit = sessionStorage.getItem('hp_preloader_shown') === 'true';
  sessionStorage.setItem('hp_preloader_shown', 'true');

  // Surface loading line travels around rectangle edges & slot counter rolls
  setTimeout(() => {
    let startTime = null;
    const duration = isRepeatVisit ? 600 : 2200;

    function updateCounter(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentVal = Math.floor(easedProgress * 100);

      // Rectangle Surface Line Tracer update (0% -> 100%)
      if (rectTracer) {
        const offset = totalPerimeter - (totalPerimeter * easedProgress);
        rectTracer.style.strokeDashoffset = offset;
      }

      // Slot Machine Reel Dynamics
      const hundredsDigit = currentVal >= 100 ? 1 : 0;
      const tensDigit = Math.floor((currentVal % 100) / 10);
      const unitsDigit = currentVal % 10;

      if (reelHundreds) reelHundreds.style.transform = `translateY(${-hundredsDigit * 1.6}em)`;
      if (reelTens) reelTens.style.transform = `translateY(${-tensDigit * 1.6}em)`;
      if (reelUnits) reelUnits.style.transform = `translateY(${-unitsDigit * 1.6}em)`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Lock into EXACTLY 100%
        if (reelHundreds) reelHundreds.style.transform = 'translateY(-1.6em)';
        if (reelTens) reelTens.style.transform = 'translateY(0em)';
        if (reelUnits) reelUnits.style.transform = 'translateY(0em)';
        if (rectTracer) rectTracer.style.strokeDashoffset = 0;

        // AT EXACTLY 100% -> INSIDE-OUT PORTAL REVEALS BLACK BACKDROP & GRADUALLY FADES OUT!
        if (loaderOverlay) {
          loaderOverlay.classList.remove('solid-cover');
          loaderOverlay.classList.add('inside-out-expand');
        }

        if (camouflageBackdrop) {
          setTimeout(() => {
            camouflageBackdrop.classList.add('fade-out');
          }, 100);
        }
      }
    }

    requestAnimationFrame(updateCounter);
  }, 400);
}

// Interactive Accordion FAQ Handler
function toggleFaq(button) {
  const faqItem = button.closest('.faq-item');
  if (!faqItem) return;
  const isAlreadyActive = faqItem.classList.contains('active');

  document.querySelectorAll('.faq-item.active').forEach(item => {
    item.classList.remove('active');
  });

  if (!isAlreadyActive) {
    faqItem.classList.add('active');
  }
}

// Dynamic Full Menu Catalog Loader with High-Performance Chunking (488 Items)
let fullMenuData = [];
let currentFilteredMenu = [];
let menuRenderPageIndex = 0;
const MENU_PAGE_SIZE = 24;
let menuIntersectionObserver = null;

function initMenuPage() {
  const container = document.getElementById('full-menu-grid');
  if (!container) return;

  if (typeof FULL_MENU_DATA !== 'undefined' && Array.isArray(FULL_MENU_DATA) && FULL_MENU_DATA.length > 0) {
    fullMenuData = FULL_MENU_DATA;
    renderMenuCategoryPills();
    filterMenuCategory('ALL');
    return;
  }

  fetch('menu_data.json')
    .then(res => res.json())
    .then(data => {
      fullMenuData = data;
      renderMenuCategoryPills();
      filterMenuCategory('ALL');
    })
    .catch(err => {
      console.error('Error loading menu:', err);
    });
}

function renderMenuCategoryPills() {
  const filterContainer = document.getElementById('menu-category-pills');
  if (!filterContainer) return;

  const categories = ['ALL', ...new Set(fullMenuData.map(item => item.category))];
  filterContainer.innerHTML = categories.map((cat, idx) => `
    <button class="tab-btn ${idx === 0 ? 'active' : ''}" data-cat="${cat}" onclick="filterMenuCategory('${cat}', this)">
      ${cat}
    </button>
  `).join('');
}

function filterMenuCategory(category, btn) {
  if (btn) {
    document.querySelectorAll('#menu-category-pills .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  const query = (document.getElementById('menu-search-input')?.value || '').toLowerCase().trim();
  let filtered = fullMenuData;

  if (category !== 'ALL') {
    filtered = filtered.filter(item => item.category === category);
  }

  if (query) {
    filtered = filtered.filter(item => item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
  }

  currentFilteredMenu = filtered;
  menuRenderPageIndex = 0;
  renderMenuItemsChunk(true);
}

let searchDebounceTimer = null;
function filterMenuSearch() {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    const activeBtn = document.querySelector('#menu-category-pills .tab-btn.active');
    const category = activeBtn ? activeBtn.dataset.cat : 'ALL';
    filterMenuCategory(category, activeBtn);
  }, 150);
}

function renderMenuItemsChunk(reset = false) {
  const container = document.getElementById('full-menu-grid');
  if (!container) return;

  if (reset) {
    container.innerHTML = '';
    menuRenderPageIndex = 0;
  }

  if (!currentFilteredMenu.length) {
    container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">No matching menu items found.</div>';
    return;
  }

  const start = menuRenderPageIndex * MENU_PAGE_SIZE;
  const end = Math.min(start + MENU_PAGE_SIZE, currentFilteredMenu.length);
  const chunk = currentFilteredMenu.slice(start, end);

  if (chunk.length === 0) return;

  const html = chunk.map(item => {
    const priceDisplay = item.price > 0 ? `Rs. ${item.price}` : 'Market Price';
    const escapedName = item.name.replace(/'/g, "\\'");
    return `
      <div class="menu-item-card liquid-glass in-view" data-category="${item.category.toLowerCase()}">
        <div class="menu-item-header">
          <div>
            <div class="menu-item-name">${item.name}</div>
            <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-gold-dark); font-weight:700;">${item.category}</span>
          </div>
          <div class="menu-item-price">${priceDisplay}</div>
        </div>
        <div class="menu-item-actions" style="margin-top:16px; display:flex; gap:12px; align-items:center;">
          <div class="quantity-stepper" style="display:flex; border:1px solid var(--border-gold); border-radius:6px; overflow:hidden; background:rgba(255,255,255,0.05);">
            <button onclick="changeQuantity(this, -1)" style="padding:6px 12px; background:none; border:none; cursor:pointer; color:var(--color-black); font-weight:700;">-</button>
            <input type="number" class="quantity-input" value="1" min="1" style="width:40px; text-align:center; border:none; background:none; font-weight:700; color:var(--color-black);">
            <button onclick="changeQuantity(this, 1)" style="padding:6px 12px; background:none; border:none; cursor:pointer; color:var(--color-black); font-weight:700;">+</button>
          </div>
          <button onclick="addToCart('${escapedName}', ${item.price}, event)" class="btn btn-primary" style="padding:8px 16px; font-size:0.82rem; flex-grow:1;">Add to Order</button>
        </div>
      </div>
    `;
  }).join('');

  const oldSentinel = document.getElementById('menu-sentinel');
  if (oldSentinel) oldSentinel.remove();

  const tempWrap = document.createElement('div');
  tempWrap.innerHTML = html;
  while (tempWrap.firstChild) {
    container.appendChild(tempWrap.firstChild);
  }

  menuRenderPageIndex++;

  if (end < currentFilteredMenu.length) {
    const sentinel = document.createElement('div');
    sentinel.id = 'menu-sentinel';
    sentinel.style.cssText = 'grid-column:1/-1; text-align:center; padding:20px; font-size:0.88rem; color:var(--color-gold-dark); font-weight:600; cursor:pointer;';
    sentinel.innerHTML = 'Showing ' + end + ' of ' + currentFilteredMenu.length + ' items (Scroll to load more...)';
    sentinel.onclick = () => renderMenuItemsChunk(false);
    container.appendChild(sentinel);

    if ('IntersectionObserver' in window) {
      if (menuIntersectionObserver) menuIntersectionObserver.disconnect();
      menuIntersectionObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          renderMenuItemsChunk(false);
        }
      }, { rootMargin: '200px' });
      menuIntersectionObserver.observe(sentinel);
    }
  }
}

function slideMenuTrack(direction, btn) {
  let track = null;
  if (btn) {
    const container = btn.closest('.menu-slider-container');
    if (container) track = container.querySelector('.menu-slider-track');
  }
  if (!track) track = document.querySelector('.menu-slider-track');
  if (track) {
    const scrollAmount = 344 * direction;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}