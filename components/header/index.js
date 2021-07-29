export default function Header({ children }) {
  return (
    <header className='bg-wordpress'>
      <nav className='mx-auto' aria-label='Top'>
        <div className='w-full flex items-center justify-between border-b border-wordpress lg:border-none'>
          <div className='flex items-center'>
            <a className='flex items-center text-base font-medium text-white hover:text-indigo-50 py-5' href='#'>
              <span className='ml-5'>Is Gutenberg Fast Yest?</span>
            </a>

            <div className='ml-10 p6'>{children}</div>
          </div>
        </div>
      </nav>
    </header>
  )
}
