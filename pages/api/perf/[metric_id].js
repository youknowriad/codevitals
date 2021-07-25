// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PSDB } from 'planetscale-node'

const conn = new PSDB('main')

export default async (req, res) => {
  const { metric_id } = req.query
  const [perfs] = await conn.query(
    'select * from perf where branch = "trunk" and metric_id = ? order by measured_at ASC',
    metric_id
  )
  res.statusCode = 200
  res.json(perfs)
}
