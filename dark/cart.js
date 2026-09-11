// Sunehri — cart-to-WhatsApp
//
// No real cart/checkout backend — this just lets a visitor pick quantities
// of the three jar sizes, then composes ONE WhatsApp message listing every
// line item and the total. State lives in localStorage only (per browser,
// never sent anywhere until the visitor taps "Order on WhatsApp").
(() => {
  const STORAGE_KEY = 'sunehri:cart';
  const WHATSAPP_NUMBER = '919815980350';

  const money = (n) => '₹' + n.toLocaleString('en-IN');

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveCart(cart) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {}
  }

  let cart = loadCart(); // { [productId]: quantity }

  const productEls = [...document.querySelectorAll('[data-product-id]')];
  const products = productEls.map((el) => ({
    id: el.dataset.productId,
    name: el.dataset.name,
    price: Number(el.dataset.price),
    el,
  }));

  const orderBtns = [...document.querySelectorAll('[data-cart-order-btn]')];
  // Remember each CTA's original "generic" WhatsApp link so it can be
  // restored once the cart empties out again.
  orderBtns.forEach((el) => { el.dataset.defaultHref = el.getAttribute('href'); });

  const cartBar = document.getElementById('cartBar');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const cartOpenBtn = document.getElementById('cartOpenBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartClearBtn = document.getElementById('cartClearBtn');
  const cartList = document.getElementById('cartList');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartFooterTotal = document.getElementById('cartFooterTotal');
  const cartOrderBtn = document.getElementById('cartOrderBtn');

  function buildMessage(lines, total) {
    return [
      "Hi Sunehri, I'd like to order:",
      '',
      ...lines.map((l) => `• ${l.name} × ${l.qty} — ${money(l.price * l.qty)}`),
      '',
      `Total: ${money(total)}`,
      '',
      'Please confirm availability and share payment details.',
    ].join('\n');
  }

  function cartUrl(lines, total) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(lines, total))}`;
  }

  function render() {
    let count = 0;
    let total = 0;
    const lines = [];

    products.forEach((p) => {
      const qty = cart[p.id] || 0;
      if (qty > 0) { count += qty; total += qty * p.price; lines.push({ ...p, qty }); }
      const valueEl = p.el.querySelector('.qty__value');
      if (valueEl) valueEl.textContent = String(qty);
      p.el.classList.toggle('qty--active', qty > 0);
      const decBtn = p.el.querySelector('[data-action="dec"]');
      if (decBtn) decBtn.disabled = qty === 0;
    });

    // Cart bar
    if (cartBar) cartBar.hidden = count === 0;
    if (cartCount) cartCount.textContent = String(count);
    if (cartTotal) cartTotal.textContent = money(total);

    // Order CTAs everywhere on the page reflect the cart once it has items.
    orderBtns.forEach((el) => {
      el.setAttribute('href', count > 0 ? cartUrl(lines, total) : el.dataset.defaultHref);
    });

    // Drawer list
    if (cartList) {
      cartList.innerHTML = '';
      lines.forEach((l) => {
        const li = document.createElement('li');
        li.className = 'cart-line';
        li.innerHTML =
          '<span class="cart-line__name">' + l.name + '</span>' +
          '<span class="cart-line__qty">' +
          '<button type="button" class="qty__btn" data-action="dec" aria-label="Remove one ' + l.name + '">−</button>' +
          '<span class="qty__value">' + l.qty + '</span>' +
          '<button type="button" class="qty__btn" data-action="inc" aria-label="Add one ' + l.name + '">+</button>' +
          '</span>' +
          '<span class="cart-line__price">' + money(l.price * l.qty) + '</span>';
        li.dataset.productId = l.id;
        cartList.appendChild(li);
      });
    }
    if (cartEmpty) cartEmpty.hidden = count > 0;
    if (cartFooterTotal) cartFooterTotal.textContent = money(total);
    if (cartOrderBtn) {
      if (count > 0) {
        cartOrderBtn.removeAttribute('aria-disabled');
        cartOrderBtn.setAttribute('href', cartUrl(lines, total));
      } else {
        cartOrderBtn.setAttribute('aria-disabled', 'true');
        cartOrderBtn.removeAttribute('href');
      }
    }

    saveCart(cart);
  }

  function changeQty(id, delta) {
    const current = cart[id] || 0;
    const next = Math.max(0, Math.min(99, current + delta));
    if (next === 0) delete cart[id];
    else cart[id] = next;
    render();
  }

  // One delegated listener covers both the product-card steppers and the
  // drawer's own steppers (the drawer list is rebuilt on every render).
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const wrap = btn.closest('[data-product-id]');
    if (!wrap) return;
    e.preventDefault();
    changeQty(wrap.dataset.productId, btn.dataset.action === 'inc' ? 1 : -1);
  });

  function openDrawer() {
    if (!cartDrawer) return;
    cartDrawer.hidden = false;
    document.body.classList.add('cart-open');
    cartCloseBtn && cartCloseBtn.focus();
  }
  function closeDrawer() {
    if (!cartDrawer) return;
    cartDrawer.hidden = true;
    document.body.classList.remove('cart-open');
    cartOpenBtn && cartOpenBtn.focus();
  }

  cartOpenBtn && cartOpenBtn.addEventListener('click', openDrawer);
  cartCloseBtn && cartCloseBtn.addEventListener('click', closeDrawer);
  cartBackdrop && cartBackdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer && !cartDrawer.hidden) closeDrawer();
  });
  cartClearBtn && cartClearBtn.addEventListener('click', () => {
    cart = {};
    render();
  });
  // The order button just opens WhatsApp with the composed message — there's
  // no server to confirm receipt, so the cart is left as-is until the
  // visitor clears it themselves (matches "no cart, no account": nothing is
  // ever submitted anywhere except that one WhatsApp message).
  cartOrderBtn && cartOrderBtn.addEventListener('click', (e) => {
    if (cartOrderBtn.hasAttribute('aria-disabled')) e.preventDefault();
  });

  render();
})();
