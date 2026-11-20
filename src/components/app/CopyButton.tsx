import { Check, Copy } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type CopyButtonProps = {
  text: string
  label: string
  children?: ReactNode
}

export function CopyButton({ text, label, children }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      toast.error('No pudimos copiar. Copialo a mano.')
      return
    }
    setCopied(true)
    toast('Copiado')
    setTimeout(() => setCopied(false), 2000)
  }

  const Icon = copied ? Check : Copy
  return (
    <Button
      type="button"
      variant="outline"
      size={children ? 'default' : 'icon'}
      aria-label={label}
      onClick={() => void copy()}
    >
      <Icon className="size-4" aria-hidden="true" />
      {children}
    </Button>
  )
}
