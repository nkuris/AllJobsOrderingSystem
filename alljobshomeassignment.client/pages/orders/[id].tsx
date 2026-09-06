import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useRequireAuth from '../../hooks/useRequireAuth'
import api from '../../lib/api'

export default function OrderViewPage() {
  useRequireAuth()
  const router = useRouter()
  const { id } = router.query

  const [order, setOrder] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const res = await api.get(`/api/orders/${id}`)
        setOrder(res.data)
      } catch (err) {
        setError('Failed to load order')
      }
    }
    load()
  }, [id])

  if (!order && !error) return <div>Loading...</div>

  return (
    <section style={{width:'100%',maxWidth:720}}>
      <h1>Order</h1>
      {error && <div className="error">{error}</div>}
      {order && (
        <div>
          <h2>Order #{order.id}</h2>
          <p><strong>Customer:</strong> {order.customerName} &lt;{order.customerEmail}&gt;</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> {order.totalAmount.toFixed(2)}</p>

          <h3>Items</h3>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{textAlign:'left',borderBottom:'1px solid #e6eef8'}}>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Line</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it: any) => (
                <tr key={it.id} style={{borderBottom:'1px solid #f1f5f9'}}>
                  <td>{it.product?.name ?? `#${it.productId}`}</td>
                  <td>{it.quantity}</td>
                  <td>{it.unitPrice.toFixed(2)}</td>
                  <td>{it.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{marginTop:12}}>
            <button onClick={() => router.back()}>Back</button>
          </div>
        </div>
      )}
    </section>
  )
}
