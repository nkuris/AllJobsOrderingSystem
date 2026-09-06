import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useRequireAuth from '../../../hooks/useRequireAuth'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { fetchProducts, updateProduct } from '../../../store/productsSlice'
import FormField from '../../../components/FormField'
import api from '../../../lib/api'

export default function EditProductPage() {
  useRequireAuth()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { id } = router.query
  const auth = useAppSelector(s => s.auth)

  const [product, setProduct] = useState<any>(null)
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [stockQuantity, setStockQuantity] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { dispatch(fetchProducts()) }, [dispatch])

  useEffect(() => {
    if (!router.isReady || !id) return
    const load = async () => {
      try {
        const res = await api.get(`/api/products/${id}`)
        setProduct(res.data)
        setName(res.data.name)
        setSku(res.data.sku)
        setPrice(res.data.price)
        setStockQuantity(res.data.stockQuantity)
        setDescription(res.data.description ?? '')
      } catch (err) {
        setError('Failed to load product')
      }
    }
    load()
  }, [id, router.isReady])

  if (auth.role !== 'ADMIN') {
    return <section style={{width:'100%',maxWidth:1100}}><h1>Edit Product</h1><div>You are not authorized.</div></section>
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    if (!product) return
    try {
      await dispatch(updateProduct({ id: Number(id), body: { name, sku, price: Number(price), stockQuantity: Number(stockQuantity), description } })).unwrap()
      await router.push('/products')
    } catch (err: any) {
      setError(err ?? 'Failed')
    }
  }

  return (
    <section style={{width:'100%',maxWidth:720}}>
      <h1>Edit Product</h1>
      {error && <div className="error">{error}</div>}
      {!product && <div>Loading...</div>}
      {product && (
        <form onSubmit={submit}>
          <FormField label="Name" value={name} onChange={e => setName(e.target.value)} required />
          <FormField label="SKU" value={sku} onChange={e => setSku(e.target.value)} required />
          <FormField label="Price" value={price === '' ? '' : String(price)} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} type="number" step="0.01" required />
          <FormField label="Stock quantity" value={stockQuantity === '' ? '' : String(stockQuantity)} onChange={e => setStockQuantity(e.target.value === '' ? '' : Number(e.target.value))} type="number" required />
          <div>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} style={{width:'100%',minHeight:100,padding:10,borderRadius:10,border:'1px solid #e2e8f0'}} />
          </div>
          <div style={{marginTop:12}}>
            <button type="submit">Save</button>
          </div>
        </form>
      )}
    </section>
  )
}
