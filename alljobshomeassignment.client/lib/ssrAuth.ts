import { GetServerSidePropsContext } from 'next'
import axios from 'axios'

const base = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080'

export async function requireAdmin(ctx: GetServerSidePropsContext) {
  const cookies = ctx.req.headers.cookie
  if (!cookies) return { redirect: { destination: '/login', permanent: false } }
  const match = cookies.split(';').map(s => s.trim()).find(s => s.startsWith('accessToken='))
  const token = match ? match.split('=')[1] : null
  if (!token) return { redirect: { destination: '/login', permanent: false } }

  try {
    const res = await axios.get(`${base}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.data?.role !== 'ADMIN') return { redirect: { destination: '/', permanent: false } }
    return { props: {} }
  } catch (err) {
    return { redirect: { destination: '/login', permanent: false } }
  }
}
