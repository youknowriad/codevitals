import { PSDB } from 'planetscale-node'

const conn = new PSDB('main')

export default async (req, res) => {
  const { metric_id } = req.query
  const [[currentRow]] = await conn.query(
    'select AVG(p.value) as average from (select value from perf where branch = "trunk" and metric_id = ? order by measured_at DESC limit 20) as p',
    metric_id
  )
  const [[prevousRow]] = await conn.query(
    'select AVG(p.value) as average from (select value from perf where branch = "trunk" and metric_id = ? order by measured_at DESC limit 20,20) as p',
    metric_id
  )
  res.statusCode = 200
  res.json({
    average: currentRow?.average,
    previous: prevousRow?.average
  })
}
