import mysql from 'mysql2/promise'

export default async (req, res) => {
  const { slug } = req.query
  const conn = await mysql.createConnection(process.env.DATABASE_URL)
  const [projects] = await conn.query(
    'select project.id as id, project.name as name, project.slug as slug, project.repository as repository, count( DISTINCT metric.id ) as countMetrics from project join metric on metric.project_id = project.id where project.slug = ? GROUP BY project.id',
    slug
  )
  if (!projects.length) {
    res.statusCode = 404
    res.json({ error: 'Not found' })
    return
  }
  res.statusCode = 200
  res.json(projects[0])
}
