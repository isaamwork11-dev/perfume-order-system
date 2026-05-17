import { useState } from 'react'

export default function App () {
  const whatsappNumber = '923233348670'

  // ================= PRODUCTS =================

  const regularProducts = [
    { name: 'Chanel', price: 1199, size: '50ml', type: 'regular' },
    { name: 'Bomb Shell', price: 1199, size: '50ml', type: 'regular' },
    { name: 'Gucci Flora', price: 1199, size: '50ml', type: 'regular' },
    { name: 'Al-Dela', price: 1199, size: '50ml', type: 'regular' }
  ]

  const premiumProducts = [
    { name: 'Oud-ul-Arba', price: 1699, size: '50ml', type: 'premium' },
    { name: 'Lavoria', price: 1699, size: '50ml', type: 'premium' },
    { name: 'Janan', price: 1699, size: '50ml', type: 'premium' },
    { name: 'Rismin', price: 1699, size: '50ml', type: 'premium' }
  ]

  // ================= STATES =================

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')

  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const [eidDeal, setEidDeal] = useState(false)

  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // ================= CART FUNCTIONS =================

  const addToCart = product => {
    if (eidDeal) {
      const hasRegular = cart.some(item => item.type === 'regular')
      const hasPremium = cart.some(item => item.type === 'premium')

      if (product.type === 'regular' && hasRegular) {
        showToast('✨ Only 1 Regular allowed in Eid Deal')
        return
      }
      if (product.type === 'premium' && hasPremium) {
        showToast('👑 Only 1 Premium allowed in Eid Deal')
        return
      }
      setCart([...cart, { ...product, qty: 1 }])
      showToast(`✓ ${product.name} added`)
      return
    }

    const existing = cart.find(item => item.name === product.name)
    if (existing) {
      setCart(
        cart.map(item =>
          item.name === product.name ? { ...item, qty: item.qty + 1 } : item
        )
      )
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
    showToast(`✓ ${product.name} added`)
  }

  const removeFromCart = productName => {
    setCart(cart.filter(item => item.name !== productName))
    showToast(`✗ Removed from cart`)
  }

  const updateQuantity = (productName, change) => {
    const existing = cart.find(item => item.name === productName)
    if (existing) {
      const newQty = existing.qty + change
      if (newQty <= 0) {
        removeFromCart(productName)
      } else {
        setCart(
          cart.map(item =>
            item.name === productName ? { ...item, qty: newQty } : item
          )
        )
      }
    }
  }

  const getCartItemQty = productName => {
    const item = cart.find(item => item.name === productName)
    return item ? item.qty : 0
  }

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  }

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.qty, 0)
  }

  // ================= TOTAL WITH DEALS =================

  const regularCount = cart.reduce(
    (sum, item) => (item.type === 'regular' ? sum + item.qty : sum),
    0
  )
  const premiumCount = cart.reduce(
    (sum, item) => (item.type === 'premium' ? sum + item.qty : sum),
    0
  )

  const dealApplied = eidDeal && regularCount === 1 && premiumCount === 1

  let subtotal = getCartTotal()
  if (dealApplied) {
    subtotal = 2498
  }

  const finalTotal = subtotal - (promoApplied ? 300 : 0)

  // ================= SUBMIT =================

  const handleSubmit = () => {
    if (!firstName || !lastName || !phone) {
      showToast('📋 Please fill all fields')
      return
    }
    if (cart.length === 0) {
      showToast('🛒 Cart is empty! Add some perfumes')
      return
    }
    if (eidDeal && !(regularCount === 1 && premiumCount === 1)) {
      showToast('🌙 Select 1 Regular + 1 Premium for Eid Deal')
      return
    }

    const productList = cart
      .map(
        item =>
          `• ${item.name} x${item.qty} (${item.size}) — Rs.${
            item.price * item.qty
          }`
      )
      .join('\n')

    const message = `
🛍 SILAWAT SCENT ORDER
━━━━━━━━━━━━━━━━━━

👤 CUSTOMER:
${firstName} ${lastName}

📱 PHONE:
${phone}

📦 ORDER DETAILS:
${productList}

🎁 EID DEAL: ${dealApplied ? 'ACTIVE' : 'OFF'}
🎟️ PROMO: ${promoApplied ? 'APPLIED (-Rs.300)' : 'NONE'}

━━━━━━━━━━━━━━━━━━
💰 TOTAL: Rs.${finalTotal}
━━━━━━━━━━━━━━━━━━
`

    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`
  }

  const toggleEidDeal = () => {
    if (cart.length > 0) {
      showToast('🔄 Cart cleared for Eid Deal mode')
      setCart([])
    }
    setEidDeal(!eidDeal)
    setPromoApplied(false)
    setPromoCode('')
  }

  // ================= PRODUCT CARD =================

  const ProductCard = ({ product }) => {
    const qty = getCartItemQty(product.name)
    const isPremium = product.type === 'premium'
    const isInCart = qty > 0

    return (
      <div
        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
          isInCart
            ? isPremium
              ? 'bg-amber-500/10 border-amber-500/40'
              : 'bg-yellow-500/10 border-yellow-500/40'
            : 'bg-black/40 border-white/10'
        }`}
      >
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-0.5'>
            <h3
              className={`font-semibold text-sm ${
                isInCart ? 'text-yellow-400' : 'text-white'
              }`}
            >
              {product.name}
            </h3>
            <p
              className={`font-bold text-sm ${
                isInCart ? 'text-yellow-400' : 'text-white'
              }`}
            >
              ₨{product.price}
            </p>
          </div>
          <p
            className={`text-[11px] ${
              isInCart ? 'text-white/50' : 'text-white/40'
            }`}
          >
            {product.size}
          </p>
        </div>

        {isInCart ? (
          <div className='flex items-center gap-1.5 ml-2'>
            {!eidDeal && (
              <button
                onClick={() => updateQuantity(product.name, -1)}
                className='w-6 h-6 rounded-lg bg-white/10 text-white font-bold text-sm hover:bg-white/20'
              >
                −
              </button>
            )}
            <span className='w-5 text-center font-medium text-white text-sm'>
              {qty}
            </span>
            {!eidDeal && (
              <button
                onClick={() => updateQuantity(product.name, 1)}
                className='w-6 h-6 rounded-lg bg-white/10 text-white font-bold text-sm hover:bg-white/20'
              >
                +
              </button>
            )}
            {eidDeal && (
              <button
                onClick={() => removeFromCart(product.name)}
                className='px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-[11px] font-medium'
              >
                Remove
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => addToCart(product)}
            className='ml-2 px-3 py-1.5 rounded-lg bg-yellow-500 text-black font-medium text-xs'
          >
            + Add
          </button>
        )}
      </div>
    )
  }

  // ================= MAIN RENDER =================

  return (
    <div className='min-h-screen bg-black text-white pb-20'>
      {/* Toast */}
      {toast && (
        <div className='fixed top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-4 py-2 rounded-full font-medium z-50 text-xs shadow-lg'>
          {toast}
        </div>
      )}

      {/* Sticky Header */}
      <div className='sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10'>
        <div className='max-w-md mx-auto px-4 py-3 flex justify-between items-center'>
          <div>
            <h1 className='text-lg font-bold tracking-wide text-yellow-400'>
              SILAWAT SCENT
            </h1>
            <p className='text-[10px] text-white/40'>Premium Fragrances</p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className='relative bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-1.5'
          >
            <span className='text-sm'>🛒</span>
            <span className='font-semibold text-yellow-400 text-xs'>
              {getItemCount()}
            </span>
          </button>
        </div>
      </div>

      <div className='max-w-md mx-auto px-4 space-y-4 mt-3'>
        {/* Customer Info */}
        <div className='bg-white/5 rounded-xl p-3 space-y-2'>
          <h2 className='text-xs font-semibold text-yellow-400'>
            📋 CUSTOMER DETAILS
          </h2>
          <input
            type='text'
            placeholder='First Name'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className='w-full bg-black/50 border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500/50 text-xs placeholder:text-white/30'
          />
          <input
            type='text'
            placeholder='Last Name'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className='w-full bg-black/50 border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500/50 text-xs placeholder:text-white/30'
          />
          <input
            type='tel'
            placeholder='WhatsApp Number'
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className='w-full bg-black/50 border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500/50 text-xs placeholder:text-white/30'
          />
        </div>

        {/* Eid Deal Toggle */}
        <div
          onClick={toggleEidDeal}
          className={`cursor-pointer flex justify-between items-center p-3 rounded-xl border transition-all ${
            eidDeal
              ? 'bg-amber-500/10 border-yellow-500/50'
              : 'bg-white/5 border-white/10'
          }`}
        >
          <div className='flex items-center gap-2'>
            <div className='text-xl'>🌙</div>
            <div>
              <h2 className='font-semibold text-yellow-400 text-sm'>
                Eid Bundle Deal
              </h2>
              <p className='text-white/40 text-[10px]'>
                1 Regular + 1 Premium = ₨2,498
              </p>
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
              eidDeal ? 'bg-yellow-500 border-yellow-500' : 'border-white/30'
            }`}
          >
            {eidDeal && (
              <span className='text-black text-[10px] font-bold'>✓</span>
            )}
          </div>
        </div>

        {/* Regular Products */}
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <div className='w-1 h-4 bg-yellow-400 rounded-full'></div>
            <h2 className='text-sm font-semibold text-yellow-400'>Regular</h2>
            <span className='text-[10px] text-white/30'>50ml</span>
          </div>
          <div className='space-y-2'>
            {regularProducts.map((p, i) => (
              <ProductCard key={i} product={p} />
            ))}
          </div>
        </div>

        {/* Premium Products */}
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <div className='w-1 h-4 bg-amber-500 rounded-full'></div>
            <h2 className='text-sm font-semibold text-yellow-400'>Premium</h2>
            <span className='text-[10px] text-white/30'>Luxury</span>
          </div>
          <div className='space-y-2'>
            {premiumProducts.map((p, i) => (
              <ProductCard key={i} product={p} />
            ))}
          </div>
        </div>

        {/* Promo Code */}
        <div className='bg-white/5 rounded-xl p-3'>
          <div className='flex items-center gap-1.5 mb-2'>
            <span className='text-sm'>🎟️</span>
            <h2 className='text-xs font-semibold text-yellow-400'>
              PROMO CODE
            </h2>
          </div>
          <div className='flex gap-2'>
            <input
              type='text'
              placeholder='Enter Promo Code'
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              className='flex-1 bg-black/50 border border-white/10 rounded-lg p-2.5 outline-none focus:border-yellow-500/50 text-xs placeholder:text-white/30'
            />
            <button
              onClick={() => {
                if (promoCode.trim().toLowerCase() === 'us21') {
                  setPromoApplied(true)
                  showToast('🎁 ₨300 Discount Applied!')
                } else {
                  setPromoApplied(false)
                  showToast('❌ Invalid Code')
                }
              }}
              className='bg-yellow-500 text-black px-4 rounded-lg font-medium text-xs'
            >
              Apply
            </button>
          </div>
          {promoApplied && (
            <p className='text-green-400 text-[10px] mt-2 flex items-center gap-1'>
              <span>✓</span> ₨300 discount applied
            </p>
          )}
        </div>

        {/* Cart Drawer */}
        {isCartOpen && (
          <>
            <div
              className='fixed inset-0 bg-black/80 z-50'
              onClick={() => setIsCartOpen(false)}
            />
            <div className='fixed bottom-0 left-0 right-0 bg-neutral-900 rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto'>
              <div className='p-4'>
                <div className='flex justify-between items-center mb-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xl'>🛒</span>
                    <h2 className='text-base font-bold text-yellow-400'>
                      Your Cart
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className='w-7 h-7 rounded-full bg-white/10 text-white text-sm'
                  >
                    ✕
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className='text-center py-10'>
                    <p className='text-4xl mb-3 opacity-50'>🛒</p>
                    <p className='text-white/50 text-sm'>Your cart is empty</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className='mt-4 px-5 py-2 bg-yellow-500 text-black rounded-lg font-medium text-sm'
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <div className='space-y-2 max-h-[40vh] overflow-y-auto'>
                      {cart.map((item, idx) => (
                        <div
                          key={idx}
                          className='flex justify-between items-center p-3 bg-black/40 rounded-xl'
                        >
                          <div>
                            <p className='font-semibold text-sm text-white'>
                              {item.name}
                            </p>
                            <p className='text-[10px] text-white/40'>
                              {item.size}
                            </p>
                            <p className='text-xs text-yellow-400 mt-0.5'>
                              ₨{item.price} x{item.qty}
                            </p>
                          </div>
                          <div className='flex items-center gap-2'>
                            <p className='font-bold text-yellow-400 text-sm'>
                              ₨{item.price * item.qty}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.name)}
                              className='w-7 h-7 rounded-lg bg-red-500/20 text-red-400 text-sm'
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className='border-t border-white/10 mt-4 pt-3 space-y-1.5'>
                      <div className='flex justify-between text-xs'>
                        <span className='text-white/50'>Subtotal</span>
                        <span className='text-white'>₨{getCartTotal()}</span>
                      </div>
                      {dealApplied && (
                        <div className='flex justify-between text-xs text-green-400'>
                          <span>🎁 Eid Deal</span>
                          <span>- ₨{getCartTotal() - 2498}</span>
                        </div>
                      )}
                      {promoApplied && (
                        <div className='flex justify-between text-xs text-green-400'>
                          <span>🎟️ Promo</span>
                          <span>- ₨300</span>
                        </div>
                      )}
                      <div className='flex justify-between text-base font-bold pt-2'>
                        <span className='text-yellow-400'>Total</span>
                        <span className='text-yellow-400'>₨{finalTotal}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsCartOpen(false)
                        handleSubmit()
                      }}
                      className='w-full mt-4 bg-green-600 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2'
                    >
                      💬 Place Order
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Cart Button */}
      {!isCartOpen && cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className='fixed bottom-5 right-4 bg-yellow-500 text-black rounded-full px-4 py-2 shadow-lg z-40 flex items-center gap-2'
        >
          <span className='text-sm'>🛒</span>
          <span className='font-bold text-sm'>{getItemCount()}</span>
          <span className='text-xs'>Cart</span>
        </button>
      )}
    </div>
  )
}
