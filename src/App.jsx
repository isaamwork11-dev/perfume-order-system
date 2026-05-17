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
      fragrance: 'Floral & Powdery'
    },
    {
      name: 'Bomb Shell',
      price: 1199,
      size: '50ml',
      type: 'regular',
      fragrance: 'Fresh & Aquatic'
    },
    {
      name: 'Gucci Flora',
      price: 1199,
      size: '50ml',
      type: 'regular',
      fragrance: 'White Floral'
    },
    {
      name: 'Al-Dela',
      price: 1199,
      size: '50ml',
      type: 'regular',
      fragrance: 'Oriental Spice'
    }
  ]

  const premiumProducts = [
    {
      name: 'Oud-ul-Arba',
      price: 1699,
      size: '50ml',
      type: 'premium',
      fragrance: 'Rich Oud'
    },
    {
      name: 'Lavoria',
      price: 1699,
      size: '50ml',
      type: 'premium',
      fragrance: 'Velvet Rose'
    },
    {
      name: 'Janan',
      price: 1699,
      size: '50ml',
      type: 'premium',
      fragrance: 'Heavenly Blend'
    },
    {
      name: 'Rismin',
      price: 1699,
      size: '50ml',
      type: 'premium',
      fragrance: 'Royal Amber'
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

  // Compact Product Card for Mobile
  const ProductCard = ({ product, type }) => {
    const selected = selectedProducts.find(item => item.name === product.name)
    const isPremium = type === 'premium'

    return (
      <div
        onClick={() => toggleProduct(product)}
        className={`active:scale-[0.97] transition-all duration-200 ${
          selected ? 'scale-[1.01]' : ''
        }`}
      >
        <div
          className={`relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
            selected
              ? isPremium
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-300 text-black'
                : 'bg-gradient-to-r from-yellow-400 to-amber-400 border-yellow-300 text-black'
              : 'bg-[#0a0a0a] border-yellow-800/60'
          }`}
        >
          {/* Checkmark */}
          <div
            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              selected
                ? 'bg-black text-yellow-400'
                : 'bg-black/50 border border-yellow-600/50 text-transparent'
            }`}
          >
            {selected && '✓'}
          </div>

          {/* Icon */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
              selected
                ? 'bg-black/20'
                : isPremium
                ? 'bg-amber-900/30'
                : 'bg-yellow-900/30'
            }`}
          >
            {isPremium ? '👑' : '✨'}
          </div>

          {/* Details */}
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <h3
                className={`font-bold text-base ${
                  selected ? 'text-black' : 'text-white'
                }`}
              >
                {product.name}
              </h3>
              <p
                className={`text-lg font-black ${
                  selected ? 'text-black' : 'text-yellow-400'
                }`}
              >
                Rs.{product.price}
              </p>
            </div>
            <div className='flex items-center justify-between mt-0.5'>
              <p
                className={`text-[10px] ${
                  selected ? 'text-black/70' : 'text-gray-400'
                }`}
              >
                {product.fragrance} • {product.size}
              </p>
              <div
                className={`text-[9px] px-1.5 py-0.5 rounded ${
                  selected
                    ? 'bg-black/20 text-black'
                    : isPremium
                    ? 'bg-amber-900/40 text-amber-400'
                    : 'bg-yellow-900/40 text-yellow-500'
                }`}
              >
                {isPremium ? 'PREMIUM' : 'REGULAR'}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-black text-white py-4 px-3'>
      {/* Toast */}
      {toast && (
        <div className='fixed top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-full font-bold shadow-2xl z-50 border border-yellow-200 text-sm whitespace-nowrap z-[100]'>
          {toast}
        </div>
      )}

      <div className='max-w-md mx-auto bg-[#0a0a0a] border border-yellow-700/50 rounded-2xl overflow-hidden shadow-xl'>
        {/* HEADER */}
        <div className='bg-gradient-to-br from-black via-[#1a1002] to-black p-5 text-center border-b border-yellow-700/50'>
          <div className='text-3xl mb-1'>🕌</div>
          <h1 className='text-2xl font-black bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent'>
            SILAWAT SCENT
          </h1>
          <p className='text-amber-400/80 text-xs mt-1'>🌙 Eid Special 2025</p>
          <div className='mt-3 inline-flex items-center gap-1 bg-gradient-to-r from-amber-600 to-yellow-500 text-black px-3 py-1.5 rounded-full font-bold text-xs'>
            <span>🔥</span> 1+1 Deal = Rs.2498 <span>🎁</span>
          </div>
        </div>

        <div className='p-4 space-y-5'>
          {/* CUSTOMER INFO */}
          <div className='space-y-2'>
            <div className='relative'>
              <div className='absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 text-sm'>
                👤
              </div>
              <input
                type='text'
                placeholder='First Name'
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className='w-full bg-black/80 border border-yellow-700/60 pl-9 pr-3 py-2.5 rounded-xl outline-none focus:border-yellow-400 text-sm'
              />
            </div>

            <div className='relative'>
              <div className='absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 text-sm'>
                📝
              </div>
              <input
                type='text'
                placeholder='Last Name'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className='w-full bg-black/80 border border-yellow-700/60 pl-9 pr-3 py-2.5 rounded-xl outline-none focus:border-yellow-400 text-sm'
              />
            </div>

            <div className='relative'>
              <div className='absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 text-sm'>
                📱
              </div>
              <input
                type='tel'
                placeholder='WhatsApp Number'
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className='w-full bg-black/80 border border-yellow-700/60 pl-9 pr-3 py-2.5 rounded-xl outline-none focus:border-yellow-400 text-sm'
              />
            </div>
          </div>

          {/* EID DEAL */}
          <div className='bg-gradient-to-r from-black to-amber-950/30 border border-yellow-700/50 rounded-xl p-3 flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <div className='text-xl'>🌙</div>
              <div>
                <h2 className='text-sm font-bold text-yellow-400'>
                  Eid Bundle Deal
                </h2>
                <p className='text-gray-400 text-[10px]'>
                  1 Regular + 1 Premium = Save Rs.{1199 + 1699 - 2498}
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
              className='w-5 h-5 accent-yellow-500'
            />
          </div>

          {/* REGULAR PRODUCTS */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-1 h-5 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full'></div>
              <h2 className='text-lg font-black text-yellow-400'>Regular</h2>
              <span className='text-[10px] text-gray-500'>(Pick any)</span>
            </div>

            <div className='space-y-2'>
              {regularProducts.map((product, index) => (
                <ProductCard key={index} product={product} type='regular' />
              ))}
            </div>
          </div>

          {/* PREMIUM PRODUCTS */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-1 h-5 bg-gradient-to-b from-amber-500 to-yellow-600 rounded-full'></div>
              <h2 className='text-lg font-black text-yellow-400'>Premium</h2>
              <span className='text-[10px] text-gray-500'>(Luxury)</span>
            </div>

            <div className='space-y-2'>
              {premiumProducts.map((product, index) => (
                <ProductCard key={index} product={product} type='premium' />
              ))}
            </div>
          </div>

          {/* PROMO CODE */}
          <div className='bg-black/60 border border-yellow-700/50 rounded-xl p-3'>
            <div className='flex items-center gap-1 mb-2'>
              <span className='text-sm'>🎟️</span>
              <h2 className='text-sm font-bold text-yellow-400'>Promo Code</h2>
            </div>

            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='Enter EID300'
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                className='flex-1 bg-black/60 border border-yellow-700/60 p-2.5 rounded-xl outline-none focus:border-yellow-400 text-sm'
              />

              <button
                onClick={() => {
                  if (promoCode.trim().toLowerCase() === 'eid300') {
                    setPromoApplied(true)
                    showToast('🎁 Rs.300 Eid Gift Activated!')
                  } else {
                    setPromoApplied(false)
                    showToast('❌ Invalid Code — Try EID300')
                  }
                }}
                className='bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-4 rounded-xl font-bold text-sm'
              >
                Apply
              </button>
            </div>

            {promoApplied && (
              <div className='mt-2 flex items-center gap-1 text-green-400 bg-green-950/30 p-1.5 rounded-lg text-xs'>
                <span>✅</span> Rs.300 Discount Applied!
              </div>
            )}
          </div>

          {/* BILL SECTION */}
          <div className='bg-black/60 border border-yellow-700/50 rounded-xl p-3 space-y-2'>
            <div className='flex items-center gap-1 pb-1 border-b border-yellow-800/50'>
              <span className='text-sm'>💰</span>
              <h3 className='font-bold text-yellow-400 text-sm'>
                Order Summary
              </h3>
            </div>

            <div className='flex justify-between text-sm text-gray-300'>
              <span>Subtotal</span>
              <span>
                Rs.{selectedProducts.reduce((acc, item) => acc + item.price, 0)}
              </span>
            </div>

            {dealApplied && (
              <div className='flex justify-between text-xs text-green-400 bg-green-950/20 p-1.5 rounded-lg'>
                <span>🎁 Eid Bundle Discount</span>
                <span>
                  - Rs.
                  {selectedProducts.reduce((acc, item) => acc + item.price, 0) -
                    2498}
                </span>
              </div>
            )}

            {promoApplied && (
              <div className='flex justify-between text-xs text-green-400'>
                <span>🎟️ Promo Discount</span>
                <span>- Rs.300</span>
              </div>
            )}

            <div className='border-t border-yellow-700/50 pt-2 flex justify-between text-xl font-black'>
              <span className='text-yellow-400 text-base'>Total</span>
              <span className='bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent text-lg'>
                Rs.{finalTotal}
              </span>
            </div>
          </div>

          {/* ORDER BUTTON */}
          <button
            onClick={handleSubmit}
            className='w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 active:scale-[0.98] transition-all p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-900/30 text-base'
          >
            <span>💬</span> Order on WhatsApp <span>🚀</span>
          </button>

          {/* Footer */}
          <p className='text-center text-gray-500 text-[10px] flex items-center justify-center gap-1'>
            <span>🛡️</span> Free Shipping • 24/7 Support
          </p>
        </div>
      </div>
    </div>
  )
}
