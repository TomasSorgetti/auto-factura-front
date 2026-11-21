import { LockKeyhole } from 'lucide-react'

const providers = [
  {
    name: 'Google',
    path: 'M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.01v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.36z M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.61 0-4.83-1.76-5.62-4.12H3.04v2.59A10 10 0 0 0 12 22z M6.38 13.92a6.02 6.02 0 0 1 0-3.84V7.49H3.04a10 10 0 0 0 0 9.02l3.34-2.59z M12 5.96c1.47 0 2.79.5 3.82 1.5l2.86-2.86A9.61 9.61 0 0 0 12 2a10 10 0 0 0-8.96 5.49l3.34 2.59A5.92 5.92 0 0 1 12 5.96z',
  },
  {
    name: 'GitHub',
    path: 'M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.07c-3.1.67-3.76-1.31-3.76-1.31-.5-1.28-1.24-1.62-1.24-1.62-1.01-.7.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.24.93.1-.72.39-1.21.71-1.49-2.47-.28-5.07-1.24-5.07-5.5 0-1.21.43-2.2 1.15-2.98-.11-.28-.5-1.41.11-2.94 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.56 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.66.12 2.94.71.78 1.14 1.77 1.14 2.98 0 4.27-2.6 5.22-5.09 5.5.4.35.76 1.03.76 2.08v3.01c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9z',
  },
]

export function LoginProviders() {
  return (
    <div className="auth-providers">
      {providers.map(({ name, path }) => (
        <button key={name} type="button" disabled title={`Acceso con ${name} no disponible`}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={path} /></svg>
          Continuar con {name}
          <LockKeyhole className="provider-lock" aria-hidden="true" />
        </button>
      ))}
      <div className="auth-divider">o ingresá con tu email</div>
    </div>
  )
}
