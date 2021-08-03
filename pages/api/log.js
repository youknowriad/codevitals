// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PSDB } from 'planetscale-node'

const conn = new PSDB('main')

export default async (req, res) => {
  const {
    method,
    query: { token }
  } = req
  console.log('token', token);
  switch (method) {
    case 'POST':
      try {
        const { metrics, hash, timestamp, branch, baseMetrics, baseHash } = req.body
        const [[project]] = await conn.query('select id from project where token = ?', token)
        if (!project) {
          throw 'Invalid token'
        }
        const [availableMetrics] = await conn.query('select * from metric where where project_id = ?', project.id)
        const [[{ c: count }]] = await conn.query('select count(*) as c from perf where project_id = ?', project.id)

        // No base yet, fill base values.
        if (count === 0) {
          const baseTuples = []
          Object.entries(baseMetrics).forEach(([metricKey, metricValue]) => {
            const availableMetric = availableMetrics.find((m) => m.key === metricKey)
            if (availableMetric) {
              baseTuples.push([project.id, baseHash, baseHash, availableMetric.id, metricValue, new Date(timestamp)])
            }
          })

          for (const tuple of baseTuples) {
            await conn.query(
              'insert into perf (project_id, branch, hash, metric_id, value, measured_at) values (?, ?,?,?,?,?)',
              tuple
            )
          }
        }

        // Insert and normalize metrics
        const [basePerfs] = await conn.query('select * from perf where hash = ? and project_id = ?', [
          baseHash,
          project.id
        ])
        const tuples = []
        Object.entries(metrics).forEach(([metricKey, metricValue]) => {
          const availableMetric = availableMetrics.find((m) => m.key === metricKey)
          const baseValue = availableMetric ? basePerfs.find((p) => p.metric_id === availableMetric.id) : null

          if (availableMetric && baseValue) {
            tuples.push([
              project.id,
              branch,
              hash,
              availableMetric.id,
              (metricValue * baseValue.value) / baseMetrics[availableMetric.key],
              new Date(timestamp)
            ])
          }
        })

        for (const tuple of tuples) {
          await conn.query(
            'insert into perf (project_id, branch, hash, metric_id, value, measured_at) values (?, ?,?,?,?,?)',
            tuple
          )
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
