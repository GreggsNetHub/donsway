/* ================= script.js ================= */

// Smooth scroll
function scrollToBooking() {
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

/* ================= M-Pesa ================= */
const mpesaForm = document.getElementById('mpesaForm');

if (mpesaForm) {
  mpesaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const phone = document.getElementById('phone').value;
    const amount = document.getElementById('amount').value;

    try {
      const res = await fetch('http://localhost:5000/api/mpesa/stk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount })
      });

      const data = await res.json();
      alert('STK Push sent. Check your phone 📱');
    } catch (error) {
      console.error(error);
      alert('Payment failed. Try again.');
    }
  });
}

/* ================= Contact ================= */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };

    try {
      await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      alert('Message sent successfully ✅');
      contactForm.reset();

    } catch (error) {
      console.error(error);
      alert('Failed to send message.');
    }
  });
}

/* ================= SHOP / CART ================= */

let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!list || !totalEl) return;

  list.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - KES ${item.price}
      <button onclick="removeItem(${index})">❌</button>
    `;
    list.appendChild(li);
    total += item.price;
  });

  totalEl.textContent = total;
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

async function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const phone = prompt("Enter M-Pesa phone number (e.g. 2547XXXXXXXX):");

  if (!phone) return;

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  try {
    await fetch('http://localhost:5000/api/mpesa/stk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, amount: total, cart })
    });

    alert("Payment request sent 📱");
    cart = [];
    renderCart();

  } catch (error) {
    console.error(error);
    alert("Checkout failed.");
  }
}