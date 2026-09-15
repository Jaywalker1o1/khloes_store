const orderNumber = new URLSearchParams(window.location.search).get('order');
const money = value => 'K' + Number(value || 0).toFixed(2);
const content = document.getElementById('orderContent');

async function loadOrder() {
  if (!orderNumber) {
    showError('No order number was provided.');
    return;
  }
  try {
    const response = await fetch(`${window.SUPABASE_URL}/rest/v1/orders?number=eq.${encodeURIComponent(orderNumber)}&select=number,items,total,created_at,status`, {
      cache: 'no-store',
      headers: { apikey: window.SUPABASE_ANON_KEY, Authorization: `Bearer ${window.SUPABASE_ANON_KEY}` }
    });
    if (!response.ok) throw new Error('Unable to load order');
    const orders = await response.json();
    if (!orders.length) {
      showError('This order could not be found. It may still be syncing, so please try the link again shortly.');
      return;
    }
    renderOrder(orders[0]);
  } catch (error) {
    showError('We could not load this order right now. Please try again shortly.');
  }
}

function renderOrder(order) {
  const items = Array.isArray(order.items) ? order.items : [];
  content.innerHTML = `<div class="eyebrow">Order ${order.number}</div><h1>Your sweet selection</h1><p class="order-intro">Here is a quick look at the items requested from khloe.s_sweet_treats.</p><span class="order-status">${order.status}</span><div class="order-details">${items.map(item => `<div class="order-line"><div><strong>${item.product.name}</strong><small>${money(item.price)} each</small></div><span>Qty ${item.quantity}</span><b>${money(item.price * item.quantity)}</b></div>`).join('')}</div><div class="order-total"><span>Total</span><strong>${money(order.total)}</strong></div><div class="order-date">Placed ${new Date(order.created_at).toLocaleString()}</div><a class="order-back" href="index.html">&larr; Back to the bakery</a>`;
}

function showError(message) {
  content.innerHTML = `<div class="eyebrow">Order details</div><h1>We’re sorry</h1><p class="order-empty">${message}</p><a class="order-back" href="index.html">&larr; Back to the bakery</a>`;
}

loadOrder();
