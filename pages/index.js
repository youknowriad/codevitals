import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Home() {
  const { data: perf, error } = useSWR('/api/perf', fetcher)

  if (error)
    return <div className='w-full h-full flex flex-col items-center justify-center text-lg'>Error Fetching Data.</div>

  return (
    <div className='min-h-screen px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full'>
        {perf?.length > 0 && (
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
        )}
      </div>
    </div>
  )
}
