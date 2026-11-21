import { Outlet } from 'react-router'
import { BillingWorkflowIllustration } from '@/features/auth/components/BillingWorkflowIllustration'

export function AuthLayout() {
  return (
    <main className="auth-layout dark">
      <aside className="auth-art">
        <div className="auth-brand">
          <img src="/favicon.svg" alt="" />
          Auto Factura
        </div>
        <BillingWorkflowIllustration />
        <div className="auth-art-caption">
          <p>ARCA / Monotributo</p>
          <h2>
            Automatizá tu
            <br />
            <span>facturación.</span>
          </h2>
        </div>
      </aside>
      <section className="auth-form">
        <div className="auth-form-content">
          <Outlet />
        </div>
      </section>
    </main>
  )
}
