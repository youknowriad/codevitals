import classnames from 'classnames'
import useSWR from 'swr'
import { Line } from 'react-chartjs-2'
import { useState, useEffect, useRef } from 'react'
import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/react/solid'
import Spinner from '../components/spinner'
import Layout from '../components/layout'
import { Chart, Tooltip } from 'chart.js'
import dynamic from 'next/dynamic'

// TODO: Is there a way to add it in next.config.js webpack options(https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config) and then just:
// import zoomPlugin from 'chartjs-plugin-zoom';
// Chart.register(zoomPlugin);
const ZoomPlugin = dynamic(() => import('chartjs-plugin-zoom').then((mod) => Chart.register(mod.default)), {
  ssr: false
})

const formatNumber = (number) => number.toLocaleString(undefined, { maximumFractionDigits: 2 })
const fetcher = (url) => fetch(url).then((res) => res.json())
const limits = [
  { label: '200 latest commits', value: 200 },
  { label: 'All time', value: 0 }
]

function Metric({ metric }) {
  const chartRef = useRef(null)
  const [currentLimit, setLimit] = useState(200)
  const { data: perf } = useSWR('/api/evolution/' + metric.id + '?limit=' + currentLimit, fetcher)

  return (
    <div>
      <div>
        <div className='sm:hidden'>
          <label htmlFor='tabs' className='sr-only'>
            Select a limit
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id='tabs'
            name='tabs'
            className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
            defaultValue={200}
            onChange={(event) => setLimit(parseInt(event.target.value))}
          >
            {limits.map((limit) => (
              <option key={limit.value}>{limit.label}</option>
            ))}
          </select>
        </div>
        <div className='hidden sm:block'>
          <div className='border-b border-gray-200'>
            <div className='flex justify-between'>
              <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
                {limits.map((limit) => (
                  <button
                    key={limit.value}
                    className={classnames(
                      limit.value === currentLimit
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'flex gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                    )}
                    aria-current={limit.value === currentLimit ? 'page' : undefined}
                    onClick={() => setLimit(limit.value)}
                  >
                    {limit.label}
                    {!perf?.length && limit.value === currentLimit && <Spinner />}
                  </button>
                ))}
              </nav>
              <button
                className='py-2 px-4 border border-blue-500 text-gray-900 rounded-md text-sm'
                onClick={() => {
                  if (chartRef.current?.isZoomedOrPanned()) {
                    chartRef.current.resetZoom()
                  }
                }}
              >
                Reset Zoom
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='m-8'>
        {!!perf?.length && (
          <Line
            ref={chartRef}
            plugins={[Tooltip]}
            data={{
              labels: perf.map((p) => p.hash),
              datasets: [
                {
                  label: metric.name,
                  data: perf.map((p) => p.value)
                }
              ]
            }}
            options={{
              responsive: true,
              scales: {
                x: {
                  display: false
                },
                y: {
                  min: 0
                }
              },
              plugins: {
                tooltip: {
                  events: ['click'],
                  enabled: false, // Disable the on-canvas tooltip.
                  external: externalTooltipHandler
                },
                zoom: {
                  pan: {
                    enabled: true,
                    mode: 'xy',
                    modifierKey: 'shift'
                  },
                  zoom: {
                    drag: {
                      enabled: true,
                      backgroundColor: 'rgba(59, 130, 246, 0.1)'
                    },
                    mode: 'x'
                  }
                }
              }
            }}
          />
        )}
      </div>
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
      {!data && (
        <div className='mt-5 mb-2 animate-pulse grid grid-cols-6 gap-3'>
          <div className='col-span-1'>
            <div className='h-2 bg-gray-500 rounded' />
          </div>
          <div className='col-span-1'>
            <div className='h-2 bg-gray-500 rounded' />
          </div>
          <div className='col-span-3'></div>
          <div className='col-span-1'>
            <div className='h-2 bg-gray-500 rounded' />
          </div>
        </div>
      )}
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

  useEffect(() => {
    // Add a listener to hide the tooltip when the user clicks outside of the tooltip contents.
    const onClick = (event) => {
      const tooltipEl = document.querySelector('#chart-tooltip')
      if (tooltipEl && !tooltipEl?.contains(event.target)) {
        tooltipEl.style.visibility = 'hidden'
      }
    }
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <>
      <ZoomPlugin />
      <Layout>
        {!metrics && <div className='w-full h-full flex flex-col items-center justify-center text-lg'>Loading...</div>}
        {metrics && !metrics.length && (
          <div className='w-full flex flex-col items-center justify-center text-lg'>No data available.</div>
        )}
        {!!metrics?.length && (
          <dl className='mb-4 grid grid-cols-1 gap-5 sm:grid-cols-3'>
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} onSelect={() => setSelectedMetric(metric)} />
            ))}
          </dl>
        )}
        {displayedMetric && <Metric metric={displayedMetric || metrics?.[0]} />}
      </Layout>
    </>
  )
}

// We only create once the tooltip and update it when needed.
const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('#chart-tooltip')
  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.id = 'chart-tooltip'
    tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)'
    tooltipEl.style.borderRadius = '3px'
    // tooltipEl.style.opacity = '1'
    tooltipEl.style.position = 'absolute'
    tooltipEl.style.transform = 'translate(-50%, 0)'
    tooltipEl.style.transition = 'all .1s ease'

    const tooltipContainer = document.createElement('div')
    tooltipContainer.className = 'tooltip-container'
    tooltipContainer.style.color = 'white'
    tooltipContainer.style.fontSize = '12px'

    tooltipEl.appendChild(tooltipContainer)
    chart.canvas.parentNode.appendChild(tooltipEl)
  }
  return tooltipEl
}

const externalTooltipHandler = (context) => {
  const { chart, tooltip } = context
  const tooltipEl = getOrCreateTooltip(chart)
  // Hide if no tooltip.
  if (tooltip.opacity === 0) {
    tooltipEl.style.visibility = 'hidden'
    return
  }
  tooltipEl.style.visibility = 'visible'
  let innerHtml = ''
  if (tooltip.body) {
    const titleLines = tooltip.title || []
    titleLines.forEach((title) => {
      innerHtml += `<a href="https://github.com/WordPress/gutenberg/commit/${title}" target="blank" style="display:inline-block;cursor:pointer;">${title.slice(
        0,
        7
      )}</a>`
    })
    const bodyLines = tooltip.body.map(({ lines }) => lines)
    bodyLines.forEach((body, i) => {
      innerHtml += `<div style="display:flex;align-items:center;">
        <span style="background:white;width:10px;height:10px;"></span>
        <span style="margin-left:5px;">${body}</span>
      </div>`
    })
    const tooltipRoot = tooltipEl.querySelector('.tooltip-container')
    tooltipRoot.innerHTML = innerHtml
  }
  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas
  // Display, position, and set styles for font.
  tooltipEl.style.opacity = 1
  tooltipEl.style.left = positionX + tooltip.caretX + 'px'
  tooltipEl.style.top = positionY + tooltip.caretY + 'px'
  tooltipEl.style.font = tooltip.options.bodyFont.string
  tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px'
}
