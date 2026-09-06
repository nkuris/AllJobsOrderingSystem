import { useEffect, useMemo, useState } from 'react'
import useRequireAuth from '../../hooks/useRequireAuth'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchProducts } from '../../store/productsSlice'
import { createOrder } from '../../store/ordersSlice'
import { useRouter } from 'next/router'
import { requireAdmin } from '../../lib/ssrAuth'

export default function CreateOrderPage() {
  useRequireAuth()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const auth = useAppSelector(s => s.auth)
  const products = useAppSelector(s => s.products.items)

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { dispatch(fetchProducts()) }, [dispatch])

  if (auth.role !== 'ADMIN') {
    return <section style={{width:'100%',maxWidth:1100}}><h1>Create Order</h1><div>You are not authorized to create orders.</div></section>
  }

  const setQty = (id: number, v: number) => {
    setQuantities(q => ({ ...q, [id]: v }))
  }

  const items = useMemo(() => Object.entries(quantities)
    .filter(([,q]) => q > 0)
    .map(([id,q]) => {
      const p = products.find(x => x.id === Number(id))!
      return { productId: p.id, quantity: q, unitPrice: p.price }
    }), [quantities, products])

  const total = useMemo(() => items.reduce((s, it) => s + it.unitPrice * it.quantity, 0), [items])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!customerName || !customerEmail) { setError('Customer name and email are required'); return }
    if (items.length === 0) { setError('Select at least one product with quantity'); return }
    // Validate stock
    for (const it of items) {
      const p = products.find(x => x.id === it.productId)!
      if (it.quantity > p.stockQuantity) { setError(`Not enough stock for ${p.name}`); return }
    }

    try {
      await dispatch(createOrder({ customerName, customerEmail, items: items.map(i=>({productId:i.productId,quantity:i.quantity})) })).unwrap()
      router.push('/orders')
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create order')
    }
  }

  return (
    <section style={{width:'100%',maxWidth:1100}}>
      <h1>Create Order</h1>
      <form onSubmit={submit}>
        <div>
          <label>Customer name</label>
          <input value={customerName} onChange={e => setCustomerName(e.target.value)} required />
        </div>
        <div>
          <label>Customer email</label>
          <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} required />
        </div>

        <div>
          <label>Products</label>
          <div>
            {products.map(p => (
              <div key={p.id} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <div style={{flex:1}}>{p.name} ({p.sku}) — {p.price.toFixed(2)} — stock: {p.stockQuantity}</div>
                <input type="number" min={0} max={p.stockQuantity} value={quantities[p.id] ?? 0} onChange={e => setQty(p.id, Number(e.target.value || 0))} style={{width:80}} />
              </div>
            ))}
          </div>
        </div>

        <div style={{marginTop:12}}>Total: <strong>{total.toFixed(2)}</strong></div>
        {error && <div className="error">{error}</div>}

        <div style={{marginTop:12}}>
          <button type="submit">Create order</button>
        </div>
      </form>
    </section>
  )
}

export async function getServerSideProps(ctx: any) {
  return requireAdmin(ctx)
}
