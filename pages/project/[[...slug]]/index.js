import classnames from 'classnames'
import useSWR from 'swr'
import { Line } from 'react-chartjs-2'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { CheckIcon } from '@heroicons/react/20/solid'
import Layout from '../../../components/layout'
import { Chart as ChartJS, Tooltip, registerables } from 'chart.js'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

ChartJS.register(...registerables)

const ZoomPlugin = dynamic(() => import('chartjs-plugin-zoom').then((mod) => ChartJS.register(mod.default)), {
  ssr: false
})
const plugins = [Tooltip]

const formatNumber = (number) => number.toLocaleString(undefined, { maximumFractionDigits: 2 })
const fetcher = (url) => fetch(url).then((res) => res.json())
const limits = [
  { label: '200 commits', value: 200 },
  { label: '1000 commits', value: 1000 }
]
function LimitPicker({ limit: currentLimit, onChange }) {
  return (
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
          onChange={(event) => onChange(parseInt(event.target.value))}
        >
          {limits.map((limit) => (
            <option key={limit.value}>{limit.label}</option>
          ))}
        </select>
      </div>
      <div className='hidden sm:block'>
        <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
          {limits.map((limit) => (
            <button
              key={limit.value}
              className={classnames(
                limit.value === currentLimit
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'flex gap-2 whitespace-nowrap py-5 px-1 border-b-2 font-medium text-sm'
              )}
              aria-current={limit.value === currentLimit ? 'page' : undefined}
              onClick={() => onChange(limit.value)}
            >
              {limit.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

function ZoomReset({ isActive, onReset }) {
  return (
    <button
      className={classnames('py-2 px-4 border border-blue-500 text-gray-900 rounded-md text-sm', {
        'opacity-25': !isActive,
        'cursor-not-allowed': !isActive
      })}
      disabled={!isActive}
      onClick={() => {
        onReset()
      }}
    >
      Reset Zoom
    </button>
  )
}

function Metric({ metric, repository }) {
  const chartRef = useRef(null)
  const [chartIsZoomed, setChartIsZoomed] = useState(false)
  const [limit, setLimit] = useState(200)
  const { data: perf } = useSWR('/api/evolution/' + metric.id + '?limit=' + limit, fetcher)
  const [tooltipData, setTooltipData] = useState({
    isVisible: false
  })
  useEffect(() => {
    if (tooltipData.isVisible) {
      setTooltipData({ isVisible: false })
    }
  }, [metric, limit, chartIsZoomed])
  useEffect(() => {
    if (chartIsZoomed) {
      setChartIsZoomed(false)
    }
  }, [metric, limit])
  const customTooltip = useCallback((context) => {
    const { chart, tooltip } = context
    if (tooltip.opacity === 0) {
      setTooltipData({ isVisible: false })
      return
    }

    const { offsetLeft, offsetTop } = chart.canvas

    setTooltipData({
      isVisible: true,
      left: offsetLeft + tooltip.caretX,
      top: offsetTop + tooltip.caretY,
      titleLines: tooltip.title || [],
      bodyLines: tooltip.body.map(({ lines }) => lines)
    })
  }, [])
  const options = useMemo(
    () => ({
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
          external: customTooltip
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
            mode: 'x',
            onZoomComplete: () => setChartIsZoomed(true)
          }
        }
      }
    }),
    [customTooltip]
  )
  const data = useMemo(
    () => ({
      labels: perf?.map((p) => p.hash),
      datasets: [
        {
          label: metric.name,
          data: perf?.map((p) => p.value)
        }
      ]
    }),
    [perf]
  )
  return (
    <div>
      <div className='flex justify-between border-b border-gray-200 mt-1'>
        <div className='px-4'>
          <LimitPicker limit={limit} onChange={setLimit} />
        </div>
        <div className='py-3 px-4'>
          <ZoomReset
            isActive={chartIsZoomed}
            onReset={() => {
              setChartIsZoomed(false)
              chartRef.current.resetZoom()
            }}
          />
        </div>
      </div>
      <div className='p-4 m-8'>
        <>
          <Line ref={chartRef} plugins={plugins} data={data} options={options} />
          <GraphTooltip repository={repository} tooltipData={tooltipData} />
        </>
      </div>
    </div>
  )
}

function MetricCard({ metric, onSelect, isActive }) {
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
      className={classnames(
        'px-4 py-5 overflow-hidden sm:p-6 pointer hover:bg-gray-100 border-b border-r border-gray-200 border-t',
        isActive ? 'bg-gray-100' : 'bg-gray-50'
      )}
      style={{ marginBottom: -1 }}
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
                  <ArrowUpIcon
                    className={classnames('-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5', {
                      'text-green-500': sentiment === 'positive',
                      'text-red-500': sentiment === 'negative'
                    })}
                    aria-hidden='true'
                  />
                ) : (
                  <ArrowDownIcon
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

function GraphTooltip({ repository, tooltipData }) {
  return (
    Number.isFinite(tooltipData.top) && (
      <div
        id='chart-tooltip'
        className='px-2 py-1'
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '3px',
          position: 'absolute',
          transform: 'translate(-50%, 0)',
          transition: 'all .1s ease',
          top: tooltipData.top,
          left: tooltipData.left,
          opacity: tooltipData.isVisible ? 1 : 0,
          visibility: tooltipData.isVisible ? 'visible' : 'hidden'
        }}
      >
        <div style={{ color: '#fff', fontSize: '12px' }}>
          {tooltipData.titleLines.map((title, i) => (
            <a
              key={i}
              href={`https://github.com/${repository}/commit/${title}`}
              target='blank'
              style={{ display: 'inline-block' }}
            >
              {title.slice(0, 7)}
            </a>
          ))}
          {tooltipData.bodyLines.map((line, i) => (
            <div className='flex items-center' key={i}>
              <span style={{ background: 'white', width: '10px', height: '10px' }}></span>
              <span style={{ marginLeft: '5px' }}>{line}</span>
            </div>
          ))}
        </div>
      </div>
    )
  )
}

function Metrics({ id, repository }) {
  const router = useRouter()
  const [projectSlug, metricSlug] = router.query.slug
  const { data: metrics } = useSWR('/api/metrics/' + id, fetcher)
  const defaultMetrics = metrics?.filter((metric) => metric.default_visible !== 0)
  const metricFromParam = metrics?.find((metric) => metric.key === metricSlug)
  const [selectedMetrics, setSelectedMetrics] = useState(defaultMetrics)

  const _selectedMetrics = selectedMetrics || defaultMetrics
  const displayedMetric = metricFromParam || _selectedMetrics?.[0]

  useEffect(() => {
    // Set the metric slug in the URL if it's not already set.
    if (displayedMetric && !metricSlug) {
      router.push(`/project/${projectSlug}/${displayedMetric.key}`)
    }
  }, [metricSlug, displayedMetric])

  return (
    <>
      <ZoomPlugin />
      <Layout>
        {!metrics && <div className='w-full h-full flex flex-col items-center justify-center text-lg'>Loading...</div>}
        {metrics && !metrics.length && (
          <div className='w-full h-full flex flex-col items-center justify-center text-lg'>No data available.</div>
        )}
        {!!metrics?.length && (
          <>
            <dl className='grid grid-cols-1 sm:grid-cols-5 bg-gray-50 border-b border-gray-200'>
              <Listbox value={_selectedMetrics} onChange={setSelectedMetrics} multiple>
                <ListboxButton
                  className='px-4 py-5 overflow-hidden sm:p-6 pointer hover:bg-blue-200 border-b border-r border-gray-200 border-t bg-blue-100'
                  style={{ marginBottom: -1 }}
                >
                  Visible Metrics <strong>({(selectedMetrics || defaultMetrics).length})</strong>
                </ListboxButton>
                <ListboxOptions
                  anchor='bottom start'
                  className='absolute right-0 z-10 w-80 h-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
                >
                  {metrics.map((metric) => (
                    <ListboxOption
                      key={metric.id}
                      value={metric}
                      className='group flex gap-2 px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
                    >
                      <CheckIcon className='invisible size-5 group-data-[selected]:visible' />
                      {metric.name}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
              {(selectedMetrics || defaultMetrics).map((metric) => (
                <MetricCard
                  key={metric.id}
                  metric={metric}
                  onSelect={() => router.push(`/project/${projectSlug}/${metric.key}`, undefined, { scroll: false })}
                  isActive={displayedMetric === metric}
                />
              ))}
            </dl>
          </>
        )}
        {displayedMetric && <Metric metric={displayedMetric} repository={repository} />}
      </Layout>
    </>
  )
}

function ProjectMetrics() {
  const router = useRouter()
  const [projectSlug] = router.query.slug
  const { data: project } = useSWR('/api/project/' + projectSlug, fetcher)

  if (!project) {
    return null
  }

  return <Metrics id={project.id} repository={project.repository} />
}

export default function Home() {
  const router = useRouter()
  return router.isReady ? <ProjectMetrics /> : null
}
