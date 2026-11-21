import { Outlet } from 'react-router'
import { InvoiceIllustration } from '@/components/app/InvoiceIllustration'
import { ThemeToggle } from '@/components/app/ThemeToggle'

export function AuthLayout() {
  return (
    <main className="auth-layout">
      <aside className="auth-art">
        <div className="auth-brand">
          <img src="/favicon.svg" alt="" />
          Auto Factura
        </div>
        <InvoiceIllustration />
        <div className="auth-art-caption">
          <p>ARCA / Monotributo</p>
          <h2>
            Facturación
            <br />
            electrónica.
          </h2>
        </div>
      </aside>
      <section className="auth-form">
        <div className="auth-tools">
          <ThemeToggle />
        </div>
        <div className="auth-form-content">
          <Outlet />
        </div>
      </section>
    </main>
  )
}
