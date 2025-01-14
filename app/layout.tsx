import './globals.css'
import './font.css'

export const metadata = {
  title: 'ProStock',
  description: 'Gerencie suas lojas e veja relatórios',
}
import ReactQueryProvider from '@/lib/provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className="font-mundial">
        <ReactQueryProvider>
        {children}
          </ReactQueryProvider>
      </body>
    </html>
  )
}

