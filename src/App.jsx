import { useState } from 'react'

export default function App () {
  const whatsappNumber = '923233348670'

  // ================= PRODUCTS =================

  const regularProducts = [
    {
      name: 'Chanel',
      price: 1199,
      size: '50ml',
      type: 'regular',
      fragrance: 'Floral & Powdery',
      note: 'Top: Bergamot • Base: Vanilla'
    },
    {
      name: 'Bomb Shell',
      price: 1199,
      size: '50ml',
      type: 'regular',
      fragrance: 'Fresh & Aquatic',
      note: 'Top: Citrus • Base: Musk'
    },
    {
      name: 'Gucci Flora',
      price: 1199,
      size: '50ml',
      type: 'regular',
      fragrance: 'White Floral',
      note: 'Top: Peony • Base: Sandalwood'
    },
    {
      name: 'Al-Dela',
      price: 1199,
      size: '50ml',
      type: 'regular',
      fragrance: 'Oriental Spice',
      note: 'Top: Saffron • Base: Amber'
    }
  ]

  const premiumProducts = [
    {
      name: 'Oud-ul-Arba',
      price: 1699,
      size: '50ml',
      type: 'premium',
      fragrance: 'Rich Oud',
      note: 'Top: Agarwood • Base: Patchouli'
    },
    {
      name: 'Lavoria',
      price: 1699,
      size: '50ml',
      type: 'premium',
      fragrance: 'Velvet Rose',
      note: 'Top: Rose • Base: Oud'
    },
    {
      name: 'Janan',
      price: 1699,
      size: '50ml',
      type: 'premium',
      fragrance: 'Heavenly Blend',
      note: 'Top: Saffron • Base: Musk'
    },
    {
      name: 'Rismin',
      price: 1699,
      size: '50ml',
      type: 'premium',
      fragrance: 'Royal Amber',
      note: 'Top: Amber • Base: Cedar'
    }
  ]

  // ================= STATES =================

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')

  const [selectedProducts, setSelectedProducts] = useState([])

  const [eidDeal, setEidDeal] = useState(false)

  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }
  // ================= PRODUCT SELECT =================

  const toggleProduct = product => {
    // EID DEAL MODE
    if (eidDeal) {
      const regularSelected = selectedProducts.find(
        item => item.type === 'regular'
      )

      const premiumSelected = selectedProducts.find(
        item => item.type === 'premium'
      )

      const exists = selectedProducts.find(item => item.name === product.name)

      // REMOVE
      if (exists) {
        setSelectedProducts(
          selectedProducts.filter(item => item.name !== product.name)
        )
        return
      }

      // ONLY 1 REGULAR
      if (product.type === 'regular' && regularSelected) {
        showToast('Only 1 Regular perfume allowed')
        return
      }

      // ONLY 1 PREMIUM
      if (product.type === 'premium' && premiumSelected) {
        showToast('Only 1 Premium perfume allowed')
        return
      }

      setSelectedProducts([...selectedProducts, product])
    }

    // NORMAL MODE
    else {
      const exists = selectedProducts.find(item => item.name === product.name)

      if (exists) {
        setSelectedProducts(
          selectedProducts.filter(item => item.name !== product.name)
        )
      } else {
        setSelectedProducts([...selectedProducts, product])
      }
    }
  }

  // ================= TOTAL =================

  const regularCount = selectedProducts.filter(
    item => item.type === 'regular'
  ).length

  const premiumCount = selectedProducts.filter(
    item => item.type === 'premium'
  ).length

  // DEAL AUTO APPLY
  const dealApplied = eidDeal && regularCount === 1 && premiumCount === 1

  let subtotal = 0

  if (dealApplied) {
    subtotal = 2498
  } else {
    subtotal = selectedProducts.reduce((acc, item) => acc + item.price, 0)
  }

  // PROMO
  const promoDiscount = promoApplied ? 300 : 0

  const finalTotal = subtotal - promoDiscount

  // ================= SUBMIT =================

  const handleSubmit = () => {
    if (!firstName || !lastName || !phone) {
      showToast('Please fill all fields')
      return
    }

    if (selectedProducts.length === 0) {
      showToast('Please select perfumes')
      return
    }

    if (eidDeal && !(regularCount === 1 && premiumCount === 1)) {
      showToast('Select 1 Regular and 1 Premium perfume for Eid Deal')
      return
    }

    const regularList = selectedProducts
      .filter(item => item.type === 'regular')
      .map(item => `• ${item.name} (${item.size}) — Rs.${item.price}`)
      .join('\n')

    const premiumList = selectedProducts
      .filter(item => item.type === 'premium')
      .map(item => `• ${item.name} (${item.size}) — Rs.${item.price}`)
      .join('\n')

    const message = `
🛍 SILAWAT SCENT ORDER

👤 Customer:
${firstName} ${lastName}

📱 Phone:
${phone}

🧴 Regular Perfumes:
${regularList || 'None'}

💎 Premium Perfumes:
${premiumList || 'None'}

🎁 Eid Deal:
${dealApplied ? 'Applied' : 'No'}

🎟 Promo:
${promoApplied ? 'Applied (-Rs.300)' : 'No Promo'}

💰 Total:
Rs.${finalTotal}
`

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`

    window.location.href = url
  }

  // Product Card Component for cleaner code
  const ProductCard = ({ product, type }) => {
    const selected = selectedProducts.find(item => item.name === product.name)
    const isPremium = type === 'premium'

    return (
      <div
        onClick={() => toggleProduct(product)}
        className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
          selected
            ? 'scale-[1.02] shadow-2xl'
            : 'active:scale-[0.98] hover:scale-[1.01]'
        }`}
      >
        {/* Main Card */}
        <div
          className={`relative p-5 rounded-2xl border-2 transition-all ${
            selected
              ? isPremium
                ? 'bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 border-amber-300 text-black'
                : 'bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 border-yellow-300 text-black'
              : 'bg-[#0a0a0a] border-yellow-800/60 hover:border-yellow-500/80'
          }`}
        >
          {/* Selected Glow Effect */}
          {selected && (
            <div className='absolute inset-0 bg-white/20 rounded-2xl pointer-events-none animate-pulse'></div>
          )}

          {/* Checkmark Badge */}
          <div className='absolute top-3 right-3 z-10'>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                selected
                  ? 'bg-black text-yellow-400 shadow-lg'
                  : 'bg-black/50 border-2 border-yellow-600/50 text-transparent'
              }`}
            >
              {selected && '✓'}
            </div>
          </div>

          {/* Premium Crown Icon */}
          {isPremium && !selected && (
            <div className='absolute top-3 left-3 text-amber-500/40'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M10 2L12 7H18L13 10L15 16L10 13L5 16L7 10L2 7H8L10 2Z' />
              </svg>
            </div>
          )}

          {/* Type Badge */}
          <div className='flex items-center gap-2 mb-3'>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider ${
                selected
                  ? 'bg-black/30 text-black'
                  : isPremium
                  ? 'bg-amber-900/50 text-amber-400 border border-amber-700/50'
                  : 'bg-yellow-900/40 text-yellow-500 border border-yellow-800/50'
              }`}
            >
              {isPremium ? '👑 PREMIUM' : '✨ REGULAR'}
            </div>
            {isPremium && !selected && (
              <div className='text-[10px] text-amber-600/70'>Best Seller</div>
            )}
          </div>

          {/* Product Name */}
          <h3
            className={`text-2xl font-black tracking-tight mb-1 ${
              selected ? 'text-black' : 'text-white'
            }`}
          >
            {product.name}
          </h3>

          {/* Fragrance Note */}
          <p
            className={`text-xs mb-2 ${
              selected ? 'text-black/70' : 'text-gray-400'
            }`}
          >
            {product.fragrance}
          </p>

          {/* Fragrance Details */}
          <p
            className={`text-[10px] mb-4 ${
              selected ? 'text-black/60' : 'text-gray-500'
            }`}
          >
            {product.note}
          </p>

          {/* Divider */}
          <div
            className={`h-px my-3 ${
              selected ? 'bg-black/20' : 'bg-yellow-800/30'
            }`}
          ></div>

          {/* Price & Size Row */}
          <div className='flex justify-between items-end'>
            <div>
              <p
                className={`text-[10px] uppercase tracking-wide ${
                  selected ? 'text-black/60' : 'text-gray-500'
                }`}
              >
                Size
              </p>
              <p
                className={`text-base font-bold ${
                  selected ? 'text-black' : 'text-white'
                }`}
              >
                {product.size}
              </p>
            </div>
            <div className='text-right'>
              <p
                className={`text-[10px] uppercase tracking-wide ${
                  selected ? 'text-black/60' : 'text-gray-500'
                }`}
              >
                Price
              </p>
              <p
                className={`text-2xl font-black ${
                  selected ? 'text-black' : 'text-yellow-400'
                }`}
              >
                Rs.{product.price}
              </p>
            </div>
          </div>

          {/* Buy Button Overlay Effect */}
          {!selected && (
            <div className='absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300'></div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white py-6 px-3 sm:py-10 sm:px-4'>
      {toast && (
        <div className='fixed top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-bold shadow-2xl z-50 border border-yellow-200 animate-pulse text-sm sm:text-base whitespace-nowrap z-[100]'>
          {toast}
        </div>
      )}
      <div className='max-w-4xl mx-auto bg-[#0a0a0a] border border-yellow-700/50 rounded-3xl sm:rounded-[35px] overflow-hidden shadow-2xl shadow-yellow-900/20'>
        {/* HEADER with Sparkle Effect */}
        <div className='relative bg-gradient-to-br from-black via-[#1f1402] to-black p-6 sm:p-8 text-center border-b border-yellow-700/50 overflow-hidden'>
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-0 left-0 w-72 h-72 bg-yellow-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2'></div>
            <div className='absolute bottom-0 right-0 w-72 h-72 bg-amber-600 rounded-full blur-3xl translate-x-1/2 translate-y-1/2'></div>
          </div>
          <div className='relative z-10'>
            <div className='text-5xl mb-2'>🕌</div>
            <h1 className='text-4xl sm:text-6xl font-black bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent tracking-wider'>
              SILAWAT SCENT
            </h1>
            <p className='text-amber-400/80 mt-2 text-sm sm:text-base font-medium'>
              🌙 Eid Special Collection 2025
            </p>
            <div className='mt-4 sm:mt-5 inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-xl shadow-lg'>
              <span>🔥</span> 1 Regular + 1 Premium = Rs.2498 <span>🎁</span>
            </div>
          </div>
        </div>

        <div className='p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8'>
          {/* CUSTOMER INFO with Icons */}
          <div className='space-y-3 sm:space-y-4'>
            <div className='relative'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500'>
                👤
              </div>
              <input
                type='text'
                placeholder='First Name'
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className='w-full bg-black/80 border border-yellow-700/60 pl-12 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-base transition-all'
              />
            </div>

            <div className='relative'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500'>
                📝
              </div>
              <input
                type='text'
                placeholder='Last Name'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className='w-full bg-black/80 border border-yellow-700/60 pl-12 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-base transition-all'
              />
            </div>

            <div className='relative'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500'>
                📱
              </div>
              <input
                type='tel'
                placeholder='Phone Number (WhatsApp)'
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className='w-full bg-black/80 border border-yellow-700/60 pl-12 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-base transition-all'
              />
            </div>
          </div>

          {/* EID DEAL Card */}
          <div className='bg-gradient-to-r from-black to-amber-950/30 border border-yellow-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex justify-between items-center backdrop-blur-sm'>
            <div className='flex items-center gap-3'>
              <div className='text-3xl'>🌙</div>
              <div>
                <h2 className='text-lg sm:text-xl font-bold text-yellow-400'>
                  Eid Bundle Deal
                </h2>
                <p className='text-gray-400 text-xs sm:text-sm'>
                  Select 1 Regular + 1 Premium & Save Rs.{1199 + 1699 - 2498}
                </p>
              </div>
            </div>
            <input
              type='checkbox'
              checked={eidDeal}
              onChange={() => {
                setEidDeal(!eidDeal)
                setSelectedProducts([])
              }}
              className='w-5 h-5 sm:w-6 sm:h-6 accent-yellow-500 scale-110'
            />
          </div>

          {/* REGULAR PRODUCTS */}
          <div>
            <div className='flex items-center gap-2 mb-4 sm:mb-5'>
              <div className='w-1 h-6 sm:h-8 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full'></div>
              <h2 className='text-2xl sm:text-3xl font-black text-yellow-400'>
                Regular Collection
              </h2>
              <span className='text-xs text-gray-500 ml-2'>(4 fragrances)</span>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5'>
              {regularProducts.map((product, index) => (
                <ProductCard key={index} product={product} type='regular' />
              ))}
            </div>
          </div>

          {/* PREMIUM PRODUCTS */}
          <div className='mt-2 sm:mt-4'>
            <div className='flex items-center gap-2 mb-4 sm:mb-5'>
              <div className='w-1 h-6 sm:h-8 bg-gradient-to-b from-amber-500 to-yellow-600 rounded-full'></div>
              <h2 className='text-2xl sm:text-3xl font-black text-yellow-400'>
                Premium Line
              </h2>
              <span className='text-xs text-gray-500 ml-2'>
                (4 luxury scents)
              </span>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5'>
              {premiumProducts.map((product, index) => (
                <ProductCard key={index} product={product} type='premium' />
              ))}
            </div>
          </div>

          {/* PROMO CODE */}
          <div className='bg-gradient-to-r from-black to-amber-950/20 border border-yellow-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5'>
            <div className='flex items-center gap-2 mb-3 sm:mb-4'>
              <span className='text-xl'>🎟️</span>
              <h2 className='text-lg sm:text-xl font-bold text-yellow-400'>
                Promo Code
              </h2>
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
              <input
                type='text'
                placeholder='Enter EID300'
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                className='flex-1 bg-black/60 border border-yellow-700/60 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl outline-none focus:border-yellow-400 text-base uppercase placeholder:normal-case'
              />

              <button
                onClick={() => {
                  if (promoCode.trim().toLowerCase() === 'eid300') {
                    setPromoApplied(true)
                    showToast('🎁 SILAWAT SCENT: Rs.300 Eid Gift Activated')
                  } else {
                    setPromoApplied(false)
                    showToast('❌ Invalid Code — Try EID300')
                  }
                }}
                className='bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-6 py-3.5 rounded-xl sm:rounded-2xl font-bold hover:from-yellow-400 hover:to-amber-400 transition-all shadow-lg'
              >
                Apply Gift 🎁
              </button>
            </div>

            {promoApplied && (
              <div className='mt-3 flex items-center gap-2 text-green-400 bg-green-950/30 p-2.5 rounded-xl font-semibold text-sm sm:text-base'>
                <span>✅</span> Rs.300 Discount Applied Successfully!
              </div>
            )}
          </div>

          {/* BILL SECTION */}
          <div className='bg-gradient-to-br from-black to-neutral-900 border border-yellow-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4'>
            <div className='flex items-center gap-2 pb-2 border-b border-yellow-800/50'>
              <span className='text-xl'>💰</span>
              <h3 className='font-bold text-yellow-400'>Order Summary</h3>
            </div>

            <div className='flex justify-between text-base sm:text-lg text-gray-300'>
              <span>Subtotal</span>
              <span>
                Rs.{selectedProducts.reduce((acc, item) => acc + item.price, 0)}
              </span>
            </div>

            {dealApplied && (
              <div className='flex justify-between text-base sm:text-lg text-green-400 bg-green-950/20 p-2 rounded-lg'>
                <span>🎁 Eid Bundle Discount</span>
                <span>
                  - Rs.
                  {selectedProducts.reduce((acc, item) => acc + item.price, 0) -
                    2498}
                </span>
              </div>
            )}

            {promoApplied && (
              <div className='flex justify-between text-base sm:text-lg text-green-400'>
                <span>🎟️ Promo Discount</span>
                <span>- Rs.300</span>
              </div>
            )}

            <div className='border-t border-yellow-700/50 pt-3 sm:pt-4 flex justify-between text-2xl sm:text-3xl font-black'>
              <span className='text-yellow-400'>Total</span>
              <span className='bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent'>
                Rs.{finalTotal}
              </span>
            </div>
          </div>

          {/* ORDER BUTTON */}
          <button
            onClick={handleSubmit}
            className='w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 active:scale-[0.98] transition-all p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-xl sm:text-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-green-900/30'
          >
            <span>💬</span> Order via WhatsApp <span>🚀</span>
          </button>

          {/* Footer Note */}
          <p className='text-center text-gray-500 text-xs flex items-center justify-center gap-1'>
            <span>🛡️</span> Secure Checkout • Free Shipping • 24/7 Support
          </p>
        </div>
      </div>
    </div>
  )
}
