import useSWR from 'swr'
import { Line } from 'react-chartjs-2'
import { useState } from 'react'
import Header from '../components/header'
import MetricSwitcher from '../components/metric-switcher'

const fetcher = (url) => fetch(url).then((res) => res.json())

function Metric({ metric }) {
  const { data: perf } = useSWR('/api/perf/' + metric.id, fetcher)

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

export default function Home() {
  const { data: metrics } = useSWR('/api/metrics', fetcher)
  const [selectedMetric, setSelectedMetric] = useState()
  const displayedMetric = selectedMetric || metrics?.[0]

  return (
    <>
      <Header>
        {metrics && metrics.length && (
          <MetricSwitcher metrics={metrics} value={displayedMetric} onChange={setSelectedMetric} />
        )}
      </Header>
      <div>
        {!metrics && <div className='w-full h-full flex flex-col items-center justify-center text-lg'>Loading...</div>}
        {metrics && !metrics.length && (
          <div className='w-full h-full flex flex-col items-center justify-center text-lg'>No data available.</div>
        )}
        {displayedMetric && <Metric metric={displayedMetric || metrics?.[0]} />}
      </div>
    </>
  )
}
