import useSWR from 'swr'
import { Line } from 'react-chartjs-2'
import { useState } from 'react'

const fetcher = (url) => fetch(url).then((res) => res.json())

function Metric({ metric }) {
  const { data: perf } = useSWR('/api/perf/' + metric.id, fetcher)

  return (
    <div className='w-full'>
      {perf?.length > 0 && (
        <>
          <Line
            data={{
              labels: perf.map((p) => p.hash),
              datasets: [
                {
                  label: metric.name,
                  data: perf.map(p => p.value)
                }
              ]
            }}
          />
          <table className='table-auto'>
            <thead>
              <tr>
                <th className='w-3/12' scope='col'>
                  Metric ID
                </th>
                <th className='w-3/12' scope='col'>
                  Value
                </th>
                <th className='w-3/12' scope='col'>
                  Branch
                </th>
                <th className='w-3/12' scope='col'>
                  Hash
                </th>
              </tr>
            </thead>
            <tbody>
              {perf.map((perfValue) => (
                <tr key={perfValue.id}>
                  <td>{perfValue.metric_id}</td>
                  <td>{perfValue.value}</td>
                  <td>{perfValue.branch}</td>
                  <td>{perfValue.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default function Home() {
  const { data: metrics } = useSWR('/api/metrics', fetcher)
  const [selectedMetricId, setSelectedMetricId] = useState()
  const selectedMetric = selectedMetricId ? metrics.find((metric) => metric.id === selectedMetricId) : metrics?.[0]

  return (
    <div className='min-h-screen px-4 py-12 sm:px-6 lg:px-8'>
      <h1>Is Gutenberg Fast Yet?</h1>

      {!metrics && <div className='w-full h-full flex flex-col items-center justify-center text-lg'>Loading...</div>}
      {metrics && !metrics.length && (
        <div className='w-full h-full flex flex-col items-center justify-center text-lg'>No data available.</div>
      )}
      {metrics && metrics.length && (
        <>
          <label>
            Select a metric
            <select value={selectedMetricId} onChange={(e) => setSelectedMetricId(parseInt(e.target.value, 10))}>
              {metrics.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          {selectedMetric && <Metric metric={selectedMetric} />}
        </>
      )}
    </div>
  )
}
