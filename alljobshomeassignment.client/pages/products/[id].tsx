import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useRequireAuth from '../../hooks/useRequireAuth'
import api from '../../lib/api'

export default function ProductViewPage() {
  useRequireAuth()
  const router = useRouter()
  const { id } = router.query

  const [product, setProduct] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const res = await api.get(`/api/products/${id}`)
        setProduct(res.data)
      } catch (err) {
        setError('Failed to load product')
      }
    }
    load()
  }, [id])

  if (!product && !error) return <div>Loading...</div>

  return (
    <section style={{width:'100%',maxWidth:720}}>
      <h1>Product</h1>
      {error && <div className="error">{error}</div>}
      {product && (
        <div>
          <h2>{product.name}</h2>
          <p><strong>SKU:</strong> {product.sku}</p>
          <p><strong>Price:</strong> {product.price.toFixed(2)}</p>
          <p><strong>Stock:</strong> {product.stockQuantity}</p>
          <p><strong>Status:</strong> {product.status}</p>
          <div>
            <label>Description</label>
            <div style={{whiteSpace:'pre-wrap',padding:8,border:'1px solid #e2e8f0',borderRadius:6}}>{product.description}</div>
          </div>
          <div style={{marginTop:12}}>
            <button onClick={() => router.back()}>Back</button>
          </div>
        </div>
      )}
    </section>
  )
}
