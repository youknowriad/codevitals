// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PSDB } from 'planetscale-node'

const conn = new PSDB('main')

export default async (_, res) => {
  const [measures] = await conn.query('select * from metric')
  res.statusCode = 200
  res.json(measures)
}
