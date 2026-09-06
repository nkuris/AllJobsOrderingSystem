import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import useRequireAuth from '../hooks/useRequireAuth'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchOrders } from '../store/ordersSlice'
import api from '../lib/api'

export default function OrdersPage() {
  useRequireAuth()
  const dispatch = useAppDispatch()
  const ordersState = useAppSelector(s => s.orders)
  const auth = useAppSelector(s => s.auth)
  const router = useRouter()

  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)

  useEffect(() => { dispatch(fetchOrders(statusFilter)) }, [dispatch, statusFilter])

  const changeStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/api/orders/${id}/status`, { status })
      dispatch(fetchOrders(statusFilter))
    } catch (err: any) {
      alert(err?.response?.data?.message ?? err.message ?? 'Failed to change status')
    }
  }

  return (
    <section style={{width:'100%',maxWidth:1100}}>
      <h1>Orders</h1>

      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <select value={statusFilter ?? ''} onChange={e => setStatusFilter(e.target.value || undefined)}>
          <option value="">All</option>
          <option value="NEW">NEW</option>
          <option value="PAID">PAID</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {ordersState.loading && <div>Loading...</div>}
      {ordersState.error && <div className="error">{ordersState.error}</div>}

      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{textAlign:'left',borderBottom:'1px solid #e6eef8'}}>
            <th>ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ordersState.items.map(o => (
            <tr key={o.id} style={{borderBottom:'1px solid #f1f5f9'}}>
              <td style={{padding:10}}>{o.id}</td>
              <td>{o.customerName}<br/><small>{o.customerEmail}</small></td>
              <td>{o.totalAmount.toFixed(2)}</td>
              <td>{o.status}</td>
              <td style={{textAlign:'right'}}>
                <button style={{marginRight:8}} onClick={() => router.push(`/orders/${o.id}`)}>View</button>
                {auth.role !== 'VIEWER' && (
                  <select onChange={e => changeStatus(o.id, e.target.value)} defaultValue="">
                    <option value="">Change status</option>
                    <option value="NEW">NEW</option>
                    <option value="PAID">PAID</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
