import { Fragment } from 'react'
import { Listbox, Menu, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid'
import classnames from 'classnames'

export default function MetricSwitcher({ metrics, value, onChange }) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label className='sr-only'>Change Metric</Listbox.Label>
          <div className='relative'>
            <div className='inline-flex shadow-sm rounded-md divide-x divide-gray-600'>
              <div className='relative z-0 inline-flex shadow-sm rounded-md divide-x divide-gray-600'>
                <div className='relative inline-flex items-center bg-gray-500 py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-white'>
                  <CheckIcon className='h-5 w-5' aria-hidden='true' />
                  <p className='ml-2.5 text-sm font-medium'>Selected Metric: {value?.name}</p>
                </div>
                <Listbox.Button className='relative inline-flex items-center bg-gray-500 p-2 rounded-l-none rounded-r-md text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500'>
                  <span className='sr-only'>Change Metric</span>
                  <ChevronDownIcon className='h-5 w-5 text-white' aria-hidden='true' />
                </Listbox.Button>
              </div>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options
                static
                className='origin-top-right absolute left-0 mt-2 -mr-1 w-72 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none sm:left-auto sm:right-0'
              >
                {metrics.map((metric) => (
                  <Listbox.Option
                    key={metric.name}
                    className={({ active }) =>
                      classnames(
                        active ? 'text-white bg-gray-500' : 'text-gray-900',
                        'cursor-default select-none relative p-4 text-sm'
                      )
                    }
                    value={metric}
                  >
                    {({ selected, active }) => (
                      <div className='flex flex-col'>
                        <div className='flex justify-between'>
                          <p className={selected ? 'font-semibold' : 'font-normal'}>{metric.name}</p>
                          {selected ? (
                            <span className={active ? 'text-white' : 'text-gray-500'}>
                              <CheckIcon className='h-5 w-5' aria-hidden='true' />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
