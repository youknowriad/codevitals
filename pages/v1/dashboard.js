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
            <div className='md:flex md:items-center md:justify-between'>
              <div className='flex-1 min-w-0'>
                <h1 className='text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate'>Gutenberg</h1>
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
                  className='ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  Add Metric
                </button>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
            {/* Replace with your content */}
            <div className='px-4 py-8 sm:px-0'>
              <dl className='mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3'>
                {stats.map((item) => (
                  <div key={item.name} className='px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6'>
                    <dt className='text-base font-normal text-gray-900'>{item.name}</dt>
                    <dd className='mt-1 flex justify-between items-baseline md:block lg:flex'>
                      <div className='flex items-baseline text-2xl font-semibold text-indigo-600'>
                        {item.stat}
                        <span className='ml-2 text-sm font-medium text-gray-500'>from {item.previousStat}</span>
                      </div>

                      <div
                        className={classNames(
                          item.changeSentiment === 'positive'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800',
                          'inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0'
                        )}
                      >
                        {item.changeType === 'increase' ? (
                          <ArrowSmUpIcon
                            className={classNames(
                              '-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5',
                              item.changeSentiment === 'positive' ? 'text-green-500' : 'text-red-500'
                            )}
                            aria-hidden='true'
                          />
                        ) : (
                          <ArrowSmDownIcon
                            className={classNames(
                              '-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5',
                              item.changeSentiment === 'positive' ? 'text-green-500' : 'text-red-500'
                            )}
                            aria-hidden='true'
                          />
                        )}

                        <span className='sr-only'>{item.changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                        {item.change}
                      </div>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className='px-4 py-8 sm:px-0'>
              <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:text-1xl sm:truncate py-2 sm:py-4'>
                All metrics
              </h2>
              <div className='flex flex-col'>
                <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
                    <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                          <tr>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              Name
                            </th>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              Recent Value
                            </th>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              Graph
                            </th>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              Last update
                            </th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {stats.map((stat) => (
                            <tr key={stat.id}>
                              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                {stat.name}
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{stat.stat}</td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                <div className='flex-shrink-0 h-10'>
                                  <img className='h-10 rounded-full' src={stat.graph} alt='' />
                                </div>
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                {formatDistanceToNowStrict(parseISO(stat.updatedAt), { addSuffix: true })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </div>
  )
}
