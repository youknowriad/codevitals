import { PSDB } from 'planetscale-node'

const conn = new PSDB('main')

export default async (req, res) => {
  const [projects] = await conn.query(
    'select project.id as id, project.name as name, count( DISTINCT metric.id ) as countMetrics from project join metric on metric.project_id = project.id group by project.id'
  )
  res.statusCode = 200
  res.json(projects)
}
