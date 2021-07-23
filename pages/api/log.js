// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PSDB } from 'planetscale-node'

const conn = new PSDB('main')

export default async (req, res) => {
  const { method } = req
  switch (method) {
    case 'POST':
      try {
        const { metrics, branch } = req.body
        const [availableMetrics, _] = await conn.query('select * from metric')

        const tuples = []
        const now =  new Date();
        Object.entries(metrics).forEach(([metricKey, metricValue]) => {
          const availableMetric = availableMetrics.find((m) => m.key === metricKey)
          if (availableMetric) {
            tuples.push([branch, availableMetric.id, metricValue, now])
          }
        })

        for (const tuple of tuples) {
          await conn.query('insert into perf (branch, metric_id, value, measured_at) values (?,?,?,?)', tuple)
        }
        res.statusCode = 200
        res.json({ status: 'ok', count: tuples.length })
      } catch (e) {
        const error = new Error('An error occurred while connecting to the database')
        error.status = 500
        error.info = { message: 'An error occurred while connecting to the database' }
        throw e
      }

      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
