import useSWR from 'swr'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Fragment } from 'react'
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'

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
          <MenuButton className='inline-flex justify-center w-full py-2 text-sm font-medium text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
            <span className='sr-only'>Open user menu</span>
            <img className='h-8 w-8 rounded-full' src={session.user.image} alt='' />
          </MenuButton>
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
          <MenuItems className='absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='px-1 py-1'>
              <MenuItem>
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
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    )
  }

  return (
    <button
      onClick={() => signIn('github')}
      className='ml-4 inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 font-normal shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 transition-all'
    >
      Sign in
    </button>
  )
}

function ProjectName({ slug }) {
  const { data: project } = useSWR('/api/project/' + slug, fetcher)
  return project?.name ?? null
}

function ProjectSelect() {
  const router = useRouter()
  const [querySlug] = router.query.slug
  const { data: projects } = useSWR('/api/projects', fetcher)

  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <MenuButton className='ml-6 inline-flex items-center gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm text-white font-normal shadow-sm ring-0 ring-inset ring-gray-300 hover:bg-black hover:bg-opacity-20 transition-all'>
          Projects
          <ChevronDownIcon aria-hidden='true' className='-mr-1 h-5 w-5 text-white' />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
      >
        <div className='py-1'>
          {projects?.map(({ slug, name }) => (
            <MenuItem key={slug}>
              <Link
                href={`/project/${slug}`}
                className={classNames(
                  'block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900',
                  querySlug === slug ? 'bg-gray-100 text-gray-500' : 'text-gray-700'
                )}
              >
                {name}
              </Link>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  )
}

export default function Header() {
  const router = useRouter()
  const [projectSlug] = router.query.slug

  return (
    <header className='bg-wordpress'>
      <nav className='mx-auto' aria-label='Top'>
        <div className='h-16 w-full flex items-center justify-between border-b border-wordpress lg:border-none py-2 px-4'>
          <a
            className='flex items-center text-base font-medium text-white hover:text-wordpress-50'
            href={`/project/${projectSlug}`}
          >
            <span>
              {projectSlug && (
                <strong>
                  <ProjectName slug={projectSlug} />{' '}
                </strong>
              )}
              Code Vitals
            </span>
          </a>
          <div>
            <ProjectSelect />
            <UserMenu />
          </div>
        </div>
      </nav>
    </header>
  )
}
