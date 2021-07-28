import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/react/solid'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import parseISO from 'date-fns/parseISO'
import md5 from 'md5'

const user = {
  name: 'Nadir Seghir',
  email: 'nadir.seghir@gmail.com',
  imageUrl: `https://www.gravatar.com/avatar/${md5('nadir.seghir@gmail.com')}`
}
const navigation = [
  { name: 'Gutenberg', href: '#', current: true },
  { name: 'WooCommerce Blocks', href: '#', current: false },
  { name: 'Niwa', href: '#', current: false },
  { name: 'All dashboards', href: '#', current: false }
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' }
]

const stats = [
  {
    name: 'Load',
    id: '1',
    stat: '8,134ms',
    previousStat: '8,746ms',
    change: '7.52%',
    changeType: 'increase',
    changeSentiment: 'negative',
    graph: 'https://thursdayupdates.files.wordpress.com/2021/07/ad-rev-chart-july-21-2021.png',
    updatedAt: '2021-06-28T00:10:58.443Z'
  },
  {
    name: 'Block Select',
    id: '2',
    stat: '84ms',
    previousStat: '90ms',
    change: '7.10%',
    changeType: 'decrease',
    changeSentiment: 'positive',
    graph: 'https://thursdayupdates.files.wordpress.com/2021/07/dau-chart-july-20-2021.png',
    updatedAt: '2021-07-27T00:10:58.443Z'
  },
  {
    name: 'Inserter opening',
    id: '3',
    stat: '337ms',
    previousStat: '354ms',
    change: '4.74%',
    changeType: 'decrease',
    changeSentiment: 'positive',
    graph: 'https://thursdayupdates.files.wordpress.com/2021/02/dau-chart-feb-17-2021.png',
    updatedAt: '2021-07-28T00:10:58.443Z'
  }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Index() {
  return (
    <div className='min-h-screen bg-white'>
      <Disclosure as='nav' className='bg-white border-b border-gray-200'>
        {({ open }) => (
          <>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='flex justify-between h-16'>
                <div className='flex'>
                  <div className='flex-shrink-0 flex items-center'>
                    <img
                      className='block lg:hidden h-8 w-auto'
                      src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
                      alt='Workflow'
                    />
                    <img
                      className='hidden lg:block h-8 w-auto'
                      src='https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg'
                      alt='Workflow'
                    />
                  </div>
                  <div className='hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8'>
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
                <div className='hidden sm:ml-6 sm:flex sm:items-center'>
                  <button className='bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                    <span className='sr-only'>View notifications</span>
                    <BellIcon className='h-6 w-6' aria-hidden='true' />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as='div' className='ml-3 relative'>
                    {({ open }) => (
                      <>
                        <div>
                          <Menu.Button className='max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                            <span className='sr-only'>Open user menu</span>
                            <img className='h-8 w-8 rounded-full' src={user.imageUrl} alt='' />
                          </Menu.Button>
                        </div>
                        <Transition
                          show={open}
                          as={Fragment}
                          enter='transition ease-out duration-200'
                          enterFrom='transform opacity-0 scale-95'
                          enterTo='transform opacity-100 scale-100'
                          leave='transition ease-in duration-75'
                          leaveFrom='transform opacity-100 scale-100'
                          leaveTo='transform opacity-0 scale-95'
                        >
                          <Menu.Items
                            static
                            className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
                          >
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>
                <div className='-mr-2 flex items-center sm:hidden'>
                  {/* Mobile menu button */}
                  <Disclosure.Button className='bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                    <span className='sr-only'>Open main menu</span>
                    {open ? (
                      <XIcon className='block h-6 w-6' aria-hidden='true' />
                    ) : (
                      <MenuIcon className='block h-6 w-6' aria-hidden='true' />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className='sm:hidden'>
              <div className='pt-2 pb-3 space-y-1'>
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                      'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className='pt-4 pb-3 border-t border-gray-200'>
                <div className='flex items-center px-4'>
                  <div className='flex-shrink-0'>
                    <img className='h-10 w-10 rounded-full' src={user.imageUrl} alt='' />
                  </div>
                  <div className='ml-3'>
                    <div className='text-base font-medium text-gray-800'>{user.name}</div>
                    <div className='text-sm font-medium text-gray-500'>{user.email}</div>
                  </div>
                  <button className='ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                    <span className='sr-only'>View notifications</span>
                    <BellIcon className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>
                <div className='mt-3 space-y-1'>
                  {userNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className='py-10'>
        <header>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div>
              <nav className='sm:hidden' aria-label='Back'>
                <a href='#' className='flex items-center text-sm font-medium text-gray-500 hover:text-gray-700'>
                  <ChevronLeftIcon className='flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400' aria-hidden='true' />
                  Back
                </a>
              </nav>
              <nav className='hidden sm:flex' aria-label='Breadcrumb'>
                <ol className='flex items-center space-x-4'>
                  <li>
                    <div>
                      <a href='#' className='text-sm font-medium text-gray-500 hover:text-gray-700'>
                        Dashboard
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className='flex items-center'>
                      <ChevronRightIcon className='flex-shrink-0 h-5 w-5 text-gray-400' aria-hidden='true' />
                      <a href='#' className='ml-4 text-sm font-medium text-gray-500 hover:text-gray-700'>
                        Gutenberg
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className='flex items-center'>
                      <ChevronRightIcon className='flex-shrink-0 h-5 w-5 text-gray-400' aria-hidden='true' />
                      <a
                        href='#'
                        aria-current='page'
                        className='ml-4 text-sm font-medium text-gray-500 hover:text-gray-700'
                      >
                        Type
                      </a>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
            <div className='md:flex md:items-center md:justify-between'>
              <div className='flex-1 min-w-0'>
                <h1 className='text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate'>Type</h1>
              </div>
              <div className='mt-4 flex md:mt-0 md:ml-4'>
                <button
                  type='button'
                  className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  Edit
                </button>
                <button
                  type='button'
                  className='ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm'
                >
                  Delete metric
                </button>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'></div>
        </main>
      </div>
    </div>
  )
}
