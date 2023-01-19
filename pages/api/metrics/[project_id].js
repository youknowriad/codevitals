// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PSDB } from 'planetscale-node'

const conn = new PSDB('main')

export default async (req, res) => {
  const { project_id } = req.query
  const [measures] = await conn.query('select * from metric where project_id = ?', project_id)
  res.statusCode = 200
  res.json(measures)
}
