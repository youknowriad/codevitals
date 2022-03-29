import Header from '../header'

export default function Layout({ children }) {
  return (
    <div className='h-screen flex flex-col'>
      <div>
        <Header />
      </div>
      <div className='flex-1 p-4'>{children}</div>
    </div>
  )
}
