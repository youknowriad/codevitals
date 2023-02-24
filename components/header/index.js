import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu, Transition } from '@headlessui/react'
import useSWR from 'swr'
import { Fragment } from 'react'
import { useRouter } from 'next/router'

const fetcher = (url) => fetch(url).then((res) => res.json())

function UserMenu() {
  const { data: session } = useSession()

  if (session === undefined) {
    return null
  }

  if (session) {
    return (
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button className='inline-flex justify-center w-full py-2 text-sm font-medium text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
            <span className='sr-only'>Open user menu</span>
            <img className='h-8 w-8 rounded-full' src={session.user.image} alt='' />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='px-1 py-1'>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    onClick={() => signOut()}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    )
  }

  return (
    <button
      onClick={() => signIn('github')}
      className='ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
    >
      Sign in with GitHub
    </button>
  )
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
