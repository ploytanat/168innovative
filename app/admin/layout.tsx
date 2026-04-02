import "./admin.css"
import Sidebar from "./Sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="admin-body">
        <header className="admin-header">
          <span className="admin-header-title">168 Innovative</span>
          <span className="admin-header-divider">|</span>
          <span className="admin-header-label">Admin</span>
        </header>
        <div className="a-app">
          <Sidebar />
          <main className="a-content">{children}</main>
        </div>
      </body>
    </html>
  )
}
