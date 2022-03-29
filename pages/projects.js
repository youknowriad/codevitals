import { useSession } from 'next-auth/react'
import Layout from '../components/layout'
import { DotsVerticalIcon } from '@heroicons/react/solid'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

function ProjectList() {
  const { data: projects } = useSWR('/api/projects', fetcher)

  return (
    <div>
      <h1>Your Projects</h1>
      <ul role='list' className='mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {!!projects &&
          projects.map((project) => (
            <li key={project.name} className='col-span-1 flex shadow-sm rounded-md'>
              <div className='bg-purple-600 flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md'>
                {project.name.substring(0, 2).toUpperCase()}
              </div>
              <div className='flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate'>
                <div className='flex-1 px-4 py-2 text-sm truncate'>
                  <button className='text-gray-900 font-medium hover:text-gray-600'>{project.name}</button>
                  <p className='text-gray-500'>{project.countMetrics} Metrics</p>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}

const Projects = () => {
  // Fetch the user client-side
  const { data: session } = useSession()

  return (
    <Layout>
      {session === undefined && 'Loading'}
      {session !== undefined && (session === null || !session?.user) && 'Access Restricted'}
      {!!session?.user && <ProjectList />}
    </Layout>
  )
}

export default Projects
