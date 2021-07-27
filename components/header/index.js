const navigation = [
  { name: 'Solutions', href: '#' },
  { name: 'Pricing', href: '#' },
  { name: 'Docs', href: '#' },
  { name: 'Company', href: '#' }
]

export default function Header({ children }) {
  return (
    <header className='bg-indigo-600'>
      <nav className='mx-auto' aria-label='Top'>
        <div className='w-full flex items-center justify-between border-b border-indigo-500 lg:border-none'>
          <div className='flex items-center'>
            <a className='flex items-center text-base font-medium text-white hover:text-indigo-50' href='#'>
              <img
                className='h-20 w-auto'
                src='https://ps.w.org/gutenberg/assets/icon-256x256.jpg?rev=1776042'
                alt=''
              />
              <span className='ml-5'>Is Gutenberg Fast Yest?</span>
            </a>

            <div className='ml-10 p6'>{children}</div>
          </div>
        </div>
      </nav>
    </header>
  )
}
