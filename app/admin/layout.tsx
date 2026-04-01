import "./admin.css"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="admin-body">
        <header className="admin-header">
          <span className="admin-header-title">168 Innovative</span>
          <span className="admin-header-divider">|</span>
          <span className="admin-header-label">Admin</span>
        </header>
        <main className="admin-main">{children}</main>
      </body>
    </html>
  )
}
