import { useState } from 'react'

export default function App () {
  const whatsappNumber = '923001234567'

  const products = {
    premium: [
      { name: 'Dior Sauvage', price: 12000 },
      { name: 'Creed Aventus', price: 18000 },
      { name: 'Bleu De Chanel', price: 15000 }
    ],

    regular: [
      { name: 'Fogg', price: 3000 },
      { name: 'Axe', price: 2500 },
      { name: 'Wild Stone', price: 2800 }
    ]
  }

  const promoCodes = {
    SALE10: 10,
    SALE20: 20
  }

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')

  const [type, setType] = useState('premium')

  const [promoEnabled, setPromoEnabled] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [appliedPromo, setAppliedPromo] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])

  const toggleProduct = product => {
    const exists = selectedProducts.find(item => item.name === product.name)

    if (exists) {
      setSelectedProducts(
        selectedProducts.filter(item => item.name !== product.name)
      )
    } else {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  const subtotal = selectedProducts.reduce((acc, item) => acc + item.price, 0)

  const validPromo = promoEnabled && promoCodes[appliedPromo]
  const discountPercent = validPromo ? promoCodes[promoCode.toUpperCase()] : 0

  const discountAmount = (subtotal * discountPercent) / 100

  const finalTotal = subtotal - discountAmount

  const handleSubmit = () => {
    if (!firstName || !lastName || !phone) {
      alert('Please fill all fields')
      return
    }

    if (selectedProducts.length === 0) {
      alert('Please select at least one product')
      return
    }

    const productList = selectedProducts
      .map(item => `• ${item.name} — Rs.${item.price}`)
      .join('\n')

    const message = `
🛒 New Perfume Order

👤 Customer:
${firstName} ${lastName}

📱 Phone:
${phone}

⭐ Type:
${type}

🧴 Products:
${productList}

🎟 Promo:
${appliedPromo || 'No Promo'}
💸 Discount:
${discountPercent}%

💰 Total:
Rs.${finalTotal}
`

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`

    window.location.href = url
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-5'>
      <div className='max-w-xl mx-auto bg-white text-black rounded-3xl shadow-2xl p-6 md:p-8'>
        <h1 className='text-4xl font-bold text-center mb-2'>Perfume Order</h1>

        <p className='text-center text-gray-500 mb-8'>
          Premium Fragrance Collection
        </p>

        <div className='space-y-5'>
          <input
            type='text'
            placeholder='First Name'
            className='w-full border border-gray-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />

          <input
            type='text'
            placeholder='Last Name'
            className='w-full border border-gray-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />

          <input
            type='tel'
            placeholder='Phone Number'
            className='w-full border border-gray-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black'
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          <div>
            <label className='font-semibold text-lg'>Customer Type</label>

            <div className='grid grid-cols-2 gap-4 mt-3'>
              <button
                onClick={() => {
                  setType('premium')
                  // setSelectedProducts([]);
                }}
                className={`p-4 rounded-2xl font-semibold transition ${
                  type === 'premium' ? 'bg-black text-white' : 'bg-gray-100'
                }`}
              >
                Premium
              </button>

              <button
                onClick={() => {
                  setType('regular')
                  // setSelectedProducts([]);
                }}
                className={`p-4 rounded-2xl font-semibold transition ${
                  type === 'regular' ? 'bg-black text-white' : 'bg-gray-100'
                }`}
              >
                Regular
              </button>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              checked={promoEnabled}
              onChange={() => setPromoEnabled(!promoEnabled)}
              className='w-5 h-5'
            />

            <label className='font-medium'>Have Promo Code?</label>
          </div>

          {promoEnabled && (
            <div className='space-y-3'>
              <div className='flex gap-3'>
                <input
                  type='text'
                  placeholder='Enter Promo Code'
                  className={`flex-1 border p-4 rounded-2xl outline-none ${
                    promoError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={promoCode}
                  onChange={e => {
                    setPromoCode(e.target.value)
                    setPromoError('')
                  }}
                />

                <button
                  onClick={() => {
                    const code = promoCode.toUpperCase()

                    if (promoCodes[code]) {
                      setAppliedPromo(code)
                      setPromoError('')

                      alert('Promo Applied ✅')
                    } else {
                      setAppliedPromo('')
                      setPromoError('Invalid promo code')
                    }
                  }}
                  className='bg-black text-white px-5 rounded-2xl font-semibold'
                >
                  Apply
                </button>
              </div>

              {promoError && (
                <p className='text-red-500 text-sm'>{promoError}</p>
              )}

              {appliedPromo && (
                <p className='text-green-600 text-sm font-medium'>
                  Promo Applied Successfully ✅
                </p>
              )}
            </div>
          )}
          <div>
            <label className='font-semibold text-lg'>Select Products</label>

            <div className='space-y-4 mt-4'>
              {products[type].map((product, index) => {
                const selected = selectedProducts.find(
                  item => item.name === product.name
                )

                return (
                  <div
                    key={index}
                    onClick={() => toggleProduct(product)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      selected
                        ? 'bg-black text-white border-black scale-[1.02]'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className='flex justify-between items-center'>
                      <div>
                        <h3 className='font-bold text-lg'>{product.name}</h3>

                        <p className='text-sm opacity-80'>Rs.{product.price}</p>
                      </div>

                      <input
                        type='checkbox'
                        checked={selected ? true : false}
                        readOnly
                        className='w-5 h-5'
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className='bg-gray-100 rounded-2xl p-5 space-y-3'>
            <div className='flex justify-between'>
              <span>Subtotal</span>
              <span>Rs.{subtotal}</span>
            </div>

            <div className='flex justify-between'>
              <span>Discount</span>
              <span>{discountPercent}%</span>
            </div>

            <div className='border-t pt-3 flex justify-between text-xl font-bold'>
              <span>Total</span>
              <span>Rs.{finalTotal}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className='w-full bg-green-500 hover:bg-green-600 transition text-white p-5 rounded-2xl text-lg font-bold shadow-lg'
          >
            Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
