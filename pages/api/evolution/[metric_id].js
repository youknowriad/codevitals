// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PSDB } from 'planetscale-node'

const conn = new PSDB('main')

export default async (req, res) => {
  const { metric_id, limit } = req.query
  const parsedLimit = parseInt(limit)
  const [perfs] = await conn.query(
    'select * from perf where branch = "trunk" and metric_id = ? order by measured_at DESC' +
      (parsedLimit && parsedLimit !== '0' ? ' limit ' + parsedLimit : ''),
    metric_id
  )
  perfs.reverse()
  res.statusCode = 200
  res.json(perfs)
}
