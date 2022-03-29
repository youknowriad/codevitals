import { PSDB } from 'planetscale-node'
import { getSession } from 'next-auth/react'

const conn = new PSDB('main')

export default async (req, res) => {
  const session = await getSession({ req })

  if (!session) {
    res.statusCode = 403
    res.send({
      error: 'You must be sign in to view the protected api.'
    })
  }

  const [projects] = await conn.query(
    'select project.name as name, count( DISTINCT metric.id ) as countMetrics from project join metric on metric.project_id = project.id where project.user_id = ? group by project.id',
    [session.userId]
  )
  res.statusCode = 200
  res.json(projects)
}
