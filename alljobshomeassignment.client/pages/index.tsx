import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppSelector } from '../store/hooks'

const Home: NextPage = () => {
  const router = useRouter()
  const auth = useAppSelector(s => s.auth)

  useEffect(() => {
    // Only redirect to login when not authenticated; otherwise go to the main app page
    if (auth.token) router.replace('/products')
    else router.replace('/login')
  }, [auth.token, router])

  return null
}

export default Home
