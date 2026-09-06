import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useRequireAuth from '../hooks/useRequireAuth'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProducts, toggleProductStatus } from '../store/productsSlice'
import FormField from '../components/FormField'
import Confirm from '../components/Confirm'

export default function ProductsPage() {
  useRequireAuth()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const productsState = useAppSelector(s => s.products)
  const auth = useAppSelector(s => s.auth)

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL'|'ACTIVE'|'INACTIVE'>('ALL')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [targetProduct, setTargetProduct] = useState<number | null>(null)

  useEffect(() => { dispatch(fetchProducts()) }, [dispatch])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return productsState.items.filter(p => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false
      if (!q) return true
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    })
  }, [productsState.items, query, statusFilter])

  return (
    <section style={{width:'100%',maxWidth:1100}}>
      <h1>Products</h1>

      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <FormField placeholder="Search by name or SKU" value={query} onChange={e => setQuery(e.target.value)} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
          <option value="ALL">All</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        {auth.role !== 'VIEWER' && <button onClick={() => router.push('/products/create')} style={{marginLeft:'auto'}}>Create product</button>}
      </div>

      {productsState.loading && <div>Loading...</div>}
      {productsState.error && <div className="error">{productsState.error}</div>}

      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{textAlign:'left',borderBottom:'1px solid #e6eef8'}}>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.id} style={{borderBottom:'1px solid #f1f5f9'}}>
              <td style={{padding:10}}>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.price.toFixed(2)}</td>
              <td>{p.stockQuantity}</td>
              <td>{p.status}</td>
              <td style={{textAlign:'right'}}>
                <button onClick={() => router.push(`/products/${p.id}`)} style={{marginRight:8}}>View</button>
                {auth.role !== 'VIEWER' && (
                  <>
                    <button onClick={() => router.push(`/products/${p.id}/edit`)} style={{marginRight:8}}>Edit</button>
                    <button onClick={() => { setTargetProduct(p.id); setConfirmOpen(true) }}>{p.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Confirm open={confirmOpen} title="Confirm" message="Change product status?" onCancel={() => { setConfirmOpen(false); setTargetProduct(null) }} onConfirm={async () => {
        if (targetProduct) await dispatch(toggleProductStatus(targetProduct))
        setConfirmOpen(false)
        setTargetProduct(null)
      }} />
    </section>
  )
}
