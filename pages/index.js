import useSWR from 'swr'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Home() {
  const { data: projects } = useSWR('/api/projects', fetcher)
  const router = useRouter()
  useEffect(() => {
    if (! projects || projects?.length === 0) {
      return
    }
    router.push(`/project/${projects?.[0]?.id}`)
  }, [projects])

  return null
}
