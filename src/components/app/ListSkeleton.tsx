import { Skeleton } from '@/components/ui/skeleton'

type ListSkeletonProps = {
  rows?: number
}

export function ListSkeleton({ rows = 6 }: ListSkeletonProps) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Cargando">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}
