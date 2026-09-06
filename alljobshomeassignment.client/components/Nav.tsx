import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/authSlice'

export default function Nav() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const auth = useAppSelector(s => s.auth)

  const onLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  return (
    <header style={{background:'transparent',padding:12,display:'flex',justifyContent:'center',borderBottom:'1px solid rgba(15,23,42,0.04)'}}>
      <nav style={{width:'100%',maxWidth:1100,display:'flex',alignItems:'center',gap:12}}>
        <div style={{fontWeight:800,color:'#0b1220',marginRight:8}}>AllJobs</div>
        {auth.token && (
          <>
            <Link href="/products"><a style={{color:'#0b1220'}}>Products</a></Link>
            <Link href="/orders"><a style={{color:'#0b1220'}}>Orders</a></Link>
            {auth.role === 'ADMIN' && <Link href="/orders/create"><a style={{color:'#0b1220'}}>Create Order</a></Link>}
          </>
        )}

        <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
          {auth.token ? (
            <>
              {auth.email && <div style={{color:'#334155',fontSize:13}}>{auth.email} {auth.role ? `(${auth.role})` : ''}</div>}
              <button onClick={onLogout} style={{borderRadius:8,border:'none',padding:'8px 10px',background:'#ef4444',color:'#fff',fontWeight:700,cursor:'pointer'}}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login"><a style={{color:'#0b1220'}}>Login</a></Link>
              <Link href="/register"><a style={{color:'#0b1220'}}>Register</a></Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
