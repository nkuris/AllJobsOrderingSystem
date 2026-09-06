import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useRequireAuth from '../../hooks/useRequireAuth'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchProducts, createProduct } from '../../store/productsSlice'
import FormField from '../../components/FormField'

export default function CreateProductPage() {
  useRequireAuth()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const auth = useAppSelector(s => s.auth)

  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [stockQuantity, setStockQuantity] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { dispatch(fetchProducts()) }, [dispatch])

  if (auth.role !== 'ADMIN') {
    return <section style={{width:'100%',maxWidth:1100}}><h1>Create Product</h1><div>You are not authorized.</div></section>
  }
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    if (!name || !sku || price === '' || stockQuantity === '') { setError('Please fill required fields'); return }
    try {
      await dispatch(createProduct({ name, sku, price: Number(price), stockQuantity: Number(stockQuantity), description })).unwrap()
      await router.push('/products')
    } catch (err: any) {
      setError(err ?? 'Failed')
    }
  }

  return (
    <section style={{width:'100%',maxWidth:720}}>
      <h1>Create Product</h1>
      <form onSubmit={submit}>
        <FormField label="Name" value={name} onChange={e => setName(e.target.value)} required />
        <FormField label="SKU" value={sku} onChange={e => setSku(e.target.value)} required />
        <FormField label="Price" value={price === '' ? '' : String(price)} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} type="number" step="0.01" required />
        <FormField label="Stock quantity" value={stockQuantity === '' ? '' : String(stockQuantity)} onChange={e => setStockQuantity(e.target.value === '' ? '' : Number(e.target.value))} type="number" required />
        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} style={{width:'100%',minHeight:100,padding:10,borderRadius:10,border:'1px solid #e2e8f0'}} />
        </div>
        {error && <div className="error">{error}</div>}
        <div style={{marginTop:12}}>
          <button type="submit">Create</button>
        </div>
      </form>
    </section>
  )
}
