import mysql from 'mysql2/promise'

export default async (req, res) => {
  const { metric_id, limit } = req.query
  const parsedLimit = parseInt(limit)
  const conn = await mysql.createConnection(process.env.DATABASE_URL)
  const [perfs] = await conn.query(
    'select * from perf where branch = "trunk" and metric_id = ? order by measured_at DESC LIMIT ?',
    [metric_id, parsedLimit]
  )
  perfs.reverse()
  res.statusCode = 200
  res.json(perfs)
}
