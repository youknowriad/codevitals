import mysql from 'mysql2/promise'

export default async (req, res) => {
  const conn = await mysql.createConnection(process.env.DATABASE_URL)
  const [projects] = await conn.query(
    'select project.id as id, project.name as name, project.slug as slug, project.repository as repository, count( DISTINCT metric.id ) as countMetrics from project join metric on metric.project_id = project.id group by project.id'
  )
  res.statusCode = 200
  res.json(projects)
}
