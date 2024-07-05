import mysql from 'mysql2/promise'

export default async (req, res) => {
  const { project_id } = req.query
  const conn = await mysql.createConnection(process.env.DATABASE_URL)
  const [measures] = await conn.query(
    'select * from metric where project_id = ? order by priority ASC, id ASC',
    project_id
  )
  res.statusCode = 200
  res.json(measures)
}
