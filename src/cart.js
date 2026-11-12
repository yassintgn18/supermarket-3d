// The cart is a simple list. Each item: { name, price, quantity }
const items = []

export function addToCart(product) {
  const existing = items.find((item) => item.name === product.name)
  if (existing) {
    existing.quantity += 1
  } else {
    items.push({ name: product.name, price: product.price, quantity: 1 })
  }
  render()
}

export function getTotal() {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function clearCart() {
  items.length = 0
  render()
}

// ---------- Screen panel showing the cart ----------
const panel = document.createElement('div')
panel.style.cssText = `
  position: fixed; top: 16px; right: 16px; width: 240px;
  background: rgba(255,255,255,0.95); padding: 14px; border-radius: 8px;
  font-family: Arial, sans-serif; font-size: 14px; color: #222;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
`
document.body.appendChild(panel)

function render() {
  const lines = items.map(
    (i) => `<div>${i.name} x${i.quantity} = ${(i.price * i.quantity).toFixed(2)} €</div>`
  ).join('')

  panel.innerHTML = `
    <h3 style="margin:0 0 8px 0;">Cart</h3>
    ${lines || '<div>Empty. Look at a product and press E.</div>'}
    <hr>
    <div><b>Total: ${getTotal().toFixed(2)} €</b></div>
    <button id="deliver" style="margin-top:10px; width:100%; padding:8px; cursor:pointer;">Deliver</button>
  `

  document.getElementById('deliver').addEventListener('click', () => {
    if (items.length === 0) return
    alert('Delivery simulated! Total paid: ' + getTotal().toFixed(2) + ' €')
    clearCart()
  })
}

render()