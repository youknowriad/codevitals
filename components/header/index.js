import { useSession, signIn, signOut } from 'next-auth/react'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

const fetcher = (url) => fetch(url).then((res) => res.json())

function UserMenu() {
  const { data: session } = useSession()

  if (session === undefined) {
    return null
  }

  if (session) {
    return (
      <DropdownMenu className='mr-6'>
        <DropdownMenuTrigger>
          <span className='sr-only'>Open user menu</span>
          <img className='h-8 w-8 rounded-full' src={session.user.image} alt='' />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' sideOffset='1'>
          <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return <Button onClick={() => signIn('github')}>Sign in with GitHub</Button>
}

function ProjectName({ slug }) {
  const { data: project } = useSWR('/api/project/' + slug, fetcher)
  return project?.name ?? null
}

export default function Header() {
  const router = useRouter()
  const { project_slug } = router.query

  return (
    <header className='bg-wordpress'>
      <nav className='mx-auto' aria-label='Top'>
        <div className='h-16 w-full flex items-center justify-between border-b border-wordpress lg:border-none py-2 px-4'>
          <a className='flex items-center text-base font-medium text-white hover:text-indigo-50' href='#'>
            <span>
              {project_slug && (
                <strong>
                  <ProjectName slug={project_slug} />{' '}
                </strong>
              )}
              Code Vitals
            </span>
          </a>

          <UserMenu />
        </div>
      </nav>
    </header>
  )
}
