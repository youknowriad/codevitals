import classnames from 'classnames'
import useSWR from 'swr'
import { Line } from 'react-chartjs-2'
import { useState } from 'react'
import { ArrowSmDownIcon, ArrowSmUpIcon, InformationCircleIcon } from '@heroicons/react/solid'
import Header from '../components/header'

const formatNumber = (number) => number.toLocaleString(undefined, { maximumFractionDigits: 2 })
const fetcher = (url) => fetch(url).then((res) => res.json())

function Metric({ metric }) {
  const { data: perf } = useSWR('/api/evolution/' + metric.id, fetcher)

  return (
    <div className='m-10'>
      {perf?.length > 0 && (
        <>
          <Line
            data={{
              labels: perf.map((p) => p.hash),
              datasets: [
                {
                  label: metric.name,
                  data: perf.map((p) => p.value),
                  cubicInterpolationMode: 'monotone'
                }
              ]
            }}
            options={{
              responsive: true,
              scales: {
                x: {
                  display: false
                }
              }
            }}
          />
        </>
      )}
    </div>
  )
}

function MetricCard({ metric, onSelect }) {
  const { data } = useSWR('/api/average/' + metric.id, fetcher)
  let sentiment = 'neutral'
  const change = data && data.average && data.previous ? (data.average - data.previous) / data.previous : false
  if (change && change >= 0.05) {
    sentiment = 'negative'
  }
  if (change && change <= -0.05) {
    sentiment = 'positive'
  }
  return (
    <div
      role='button'
      onClick={onSelect}
      className='px-4 py-5 bg-gray-50 shadow rounded-sm overflow-hidden sm:p-6 pointer hover:bg-gray-100'
    >
      <dt className='text-base font-normal text-gray-900'>{metric.name}</dt>
      {!data && 'Loading...'}
      {data && (
        <dd className='mt-1 flex justify-between items-baseline md:block lg:flex'>
          {data?.average && (
            <div className='flex items-baseline text-2xl font-semibold text-wordpress'>
              {formatNumber(data.average)}
              {data.previous && (
                <span className='ml-2 text-sm font-medium text-gray-500'>from {formatNumber(data.previous)}</span>
              )}
            </div>
          )}

          <div
            className={classnames(
              {
                'bg-green-100 text-green-800': sentiment === 'positive',
                'bg-red-100 text-red-800': sentiment === 'negative'
              },
              'inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0'
            )}
          >
            {sentiment !== 'neutral' && (
              <>
                {change && change > 0 ? (
                  <ArrowSmUpIcon
                    className={classnames('-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5', {
                      'text-green-500': sentiment === 'positive',
                      'text-red-500': sentiment === 'negative'
                    })}
                    aria-hidden='true'
                  />
                ) : (
                  <ArrowSmDownIcon
                    className={classnames('-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5', {
                      'text-green-500': sentiment === 'positive',
                      'text-red-500': sentiment === 'negative'
                    })}
                    aria-hidden='true'
                  />
                )}
              </>
            )}

            {change && (
              <>
                <span className='sr-only'>{change > 0 ? 'Increased' : 'Decreased'} by</span>
                {change > 0 ? '+' : ''}
                {formatNumber(change * 100)} %
              </>
            )}
          </div>
        </dd>
      )}
    </div>
  )
}

export default function Home() {
  const { data: metrics } = useSWR('/api/metrics', fetcher)
  const [selectedMetric, setSelectedMetric] = useState()
  const displayedMetric = selectedMetric || metrics?.[0]

  return (
    <>
      <Header />
      <div>
        {!metrics && <div className='w-full h-full flex flex-col items-center justify-center text-lg'>Loading...</div>}
        {metrics && !metrics.length && (
          <div className='w-full h-full flex flex-col items-center justify-center text-lg'>No data available.</div>
        )}
        {metrics && metrics.length && (
          <div className='m-4 rounded-md bg-blue-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <InformationCircleIcon className='h-5 w-5 text-blue-400' aria-hidden='true' />
              </div>
              <div className='ml-3 flex-1 md:flex md:justify-between'>
                <p className='text-sm text-blue-700'>
                  For more stability, the following numbers compare the evolution of the metrics by computing average of
                  20 sequential values.
                </p>
              </div>
            </div>
          </div>
        )}
        {metrics && metrics.length && (
          <div className='px-4'>
            <dl className='mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3'>
              {metrics.map((metric) => (
                <MetricCard key={metric.id} metric={metric} onSelect={() => setSelectedMetric(metric)} />
              ))}
            </dl>
          </div>
        )}
        {displayedMetric && <Metric metric={displayedMetric || metrics?.[0]} />}
      </div>
    </>
  )
}
