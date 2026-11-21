import { CalendarDays, Check, FolderDown, Mail, ReceiptText, ShieldCheck, UsersRound, Webhook, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type WorkflowNode = { x: number, y: number, icon: LucideIcon, label: string, shortLabel?: string, tone: string, step: number }

const nodes: WorkflowNode[] = [
  { x: 85, y: 91, icon: CalendarDays, label: 'Regla mensual', shortLabel: 'Calendario', tone: 'var(--success)', step: 0 },
  { x: 85, y: 253, icon: UsersRound, label: 'Clientes', tone: 'var(--primary)', step: 0 },
  { x: 246, y: 172, icon: Zap, label: 'Automatización', shortLabel: 'Regla', tone: 'var(--primary)', step: 1 },
  { x: 392, y: 172, icon: ShieldCheck, label: 'ARCA', tone: 'var(--success)', step: 2 },
  { x: 534, y: 172, icon: ReceiptText, label: 'Emitir factura C', shortLabel: 'Factura C', tone: 'var(--chart-5)', step: 3 },
  { x: 755, y: 52, icon: Mail, label: 'Enviar por mail', shortLabel: 'Mail', tone: 'var(--chart-4)', step: 4 },
  { x: 755, y: 172, icon: FolderDown, label: 'Guardar PDF', shortLabel: 'PDF', tone: 'var(--primary)', step: 4 },
  { x: 755, y: 292, icon: Webhook, label: 'Webhook', tone: 'var(--chart-5)', step: 4 },
]

const connections = [
  { d: 'M115 91h28q16 0 16 16v49q0 16 16 16h31', tone: 'var(--success)', step: 0 },
  { d: 'M115 253h28q16 0 16-16v-49q0-16 16-16h31', tone: 'var(--primary)', step: 0 },
  { d: 'M286 172h76', tone: 'var(--success)', step: 1 },
  { d: 'M422 172h82', tone: 'var(--chart-5)', step: 2 },
  { d: 'M564 172h63q16 0 16-16V68q0-16 16-16h66', tone: 'var(--chart-4)', step: 3 },
  { d: 'M564 172h161', tone: 'var(--primary)', step: 3 },
  { d: 'M564 172h63q16 0 16 16v88q0 16 16 16h66', tone: 'var(--chart-5)', step: 3 },
]

const cycle = 6800
const stageDuration = 1250

export function BillingWorkflowIllustration() {
  return (
    <svg className="auth-workflow" viewBox="0 0 840 390" fill="none" role="img"
      aria-label="Una regla mensual usa los datos del cliente para solicitar autorización a ARCA y emitir una factura C. Se envía por mail, se guarda el PDF y un webhook confirma la recepción del evento.">
      {connections.map(({ d, tone, step }) => (
        <g key={d} strokeLinecap="round">
          <path d={d} stroke="#424449" strokeWidth="1.5" />
          <path className="workflow-pulse" d={d} pathLength="100" stroke={tone} strokeWidth="2.5"
            style={{ animationDuration: `${cycle}ms`, animationDelay: `${step * stageDuration}ms` }} />
        </g>
      ))}
      {nodes.map(({ x, y, icon: Icon, label, shortLabel, tone, step }) => {
        const core = step === 1
        const radius = core ? 40 : 30
        const iconSize = core ? 38 : 27
        return (
          <g key={label} transform={`translate(${x} ${y})`} color={tone}>
            <rect x={-radius - 5} y={-radius - 5} width={2 * radius + 10} height={2 * radius + 10}
              rx={core ? 19 : 14} className={core ? 'workflow-core-ring' : 'workflow-node-ring'} />
            <rect className="workflow-node" x={-radius} y={-radius} width={2 * radius} height={2 * radius}
              rx={core ? 14 : 10} />
            <rect className="workflow-activation" x={-radius} y={-radius} width={2 * radius} height={2 * radius}
              rx={core ? 14 : 10} stroke="currentColor"
              style={{ animationDuration: `${cycle}ms`, animationDelay: `${step * stageDuration}ms` }} />
            <Icon width={iconSize} height={iconSize} x={-iconSize / 2} y={-iconSize / 2}
              strokeWidth={1.55} fill={core ? 'currentColor' : 'none'} />
            <g fill="#181819" stroke="currentColor">
              {step > 0 && <circle cx={-radius} r="3" />}
              {step < 4 && <circle cx={radius} r="3" />}
            </g>
            <text className="workflow-label" textAnchor="middle" y={radius + 25}>
              <tspan className={shortLabel ? 'workflow-full-label' : undefined}>{label}</tspan>
              {shortLabel && <tspan className="workflow-short-label">{shortLabel}</tspan>}
            </text>
          </g>
        )
      })}
      <text className="workflow-method" x="685" y="281" textAnchor="middle">POST</text>
      <g transform="translate(755 368)">
        <g className="workflow-response" style={{ animationDuration: `${cycle}ms` }}>
          <rect x="-40" y="-11" width="80" height="22" rx="11" />
          <Check x="-30" y="-6" width="13" height="13" strokeWidth="2" />
          <text x="7" y="4" textAnchor="middle">200 OK</text>
        </g>
      </g>
    </svg>
  )
}
