import './globals.css'
import './font.css'
import Link from 'next/link'

export const metadata = {
  title: 'Store Management Dashboard',
  description: 'Manage your stores and view statistics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-mundial">
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Dashboard</Link>
            <div>
              <Link href="/stores" className="mr-4">Lojas</Link>
              <Link href="/">Sair</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

