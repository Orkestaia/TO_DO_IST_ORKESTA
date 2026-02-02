import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { getProjectsConfig } from '@/actions/projects'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Orkesta To Do',
  description: 'Personal Management System',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const projects = await getProjectsConfig()

  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-background text-foreground flex h-screen overflow-hidden`}>
        <Sidebar projects={projects} />
        <main className="flex-1 ml-[280px] overflow-y-auto">
          {/* Centered container typical of Todoist */}
          <div className="max-w-[800px] mx-auto px-8 pt-[50px] pb-20">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
