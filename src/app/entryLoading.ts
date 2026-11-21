import { useIsFetching, useQueryClient, type QueryFilters } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useLocation, useNavigation } from 'react-router'

const screen = document.querySelector<HTMLDialogElement>('#app-loading')!
const arrival = screen.querySelector<HTMLElement>('.loading-arrival')!
const continueForm = screen.querySelector<HTMLFormElement>('form')!
const initialReads: QueryFilters = {
  type: 'active',
  predicate: query => query.state.status === 'pending',
}

screen.addEventListener('cancel', event => event.preventDefault())

type Point = { x: number; y: number }

function insetAlongEdge(corner: Point, neighbor: Point): Point {
  const dx = neighbor.x - corner.x
  const dy = neighbor.y - corner.y
  const fraction = Math.min(0.95 / Math.hypot(dx, dy), 0.35)
  return { x: corner.x + dx * fraction, y: corner.y + dy * fraction }
}

// Sample a small quadratic fillet at each corner. The face and the extrusion
// use the same samples so their outlines meet as the solid turns.
function roundedOutline(vertices: Point[]): Point[] {
  return vertices.flatMap((corner, index) => {
    const count = vertices.length
    const from = insetAlongEdge(corner, vertices[(index + count - 1) % count])
    const to = insetAlongEdge(corner, vertices[(index + 1) % count])
    return [0, 0.25, 0.5, 0.75, 1].map(t => {
      const u = 1 - t
      return {
        x: u * u * from.x + 2 * u * t * corner.x + t * t * to.x,
        y: u * u * from.y + 2 * u * t * corner.y + t * t * to.y,
      }
    })
  })
}

function buildLogoSides() {
  const mark = arrival.querySelector<HTMLElement>('.loading-mark')!
  if (mark.querySelector('.loading-facet')) return
  const face = mark.querySelector<SVGSVGElement>('.loading-face')!
  const size = face.viewBox.baseVal.width
  const sides = document.createDocumentFragment()
  for (const polygon of face.querySelectorAll('polygon')) {
    const points = roundedOutline(Array.from(polygon.points))
    polygon.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' '))
    points.forEach((start, index) => {
      const end = points[(index + 1) % points.length]
      const dx = end.x - start.x
      const dy = end.y - start.y
      const length = Math.hypot(dx, dy)
      const light = (-0.65 * dy + 0.76 * dx) / length
      const side = document.createElement('span')
      side.className = 'loading-facet'
      side.style.left = `${100 * start.x / size}%`
      side.style.top = `${100 * start.y / size}%`
      // A subpixel overlap keeps adjacent rounded facets watertight at fractional zoom.
      side.style.width = `calc(${100 * length / size}% + 0.2px)`
      side.style.transform = `rotateZ(${Math.atan2(dy, dx)}rad) rotateX(-90deg)`
      const hue = 221 + 47 * (start.x + end.x) / (2 * size)
      side.style.setProperty('--facet-hue', String(hue))
      side.style.setProperty('--facet-lightness', `${43 + 17 * light}%`)
      sides.append(side)
    })
  }
  mark.prepend(sides)
}

buildLogoSides()

export function beginEntryLoading() {
  if (screen.open) return
  continueForm.hidden = true
  screen.showModal()
  screen.removeAttribute('data-boot')
}

// The route mounts normally behind the modal, so new useQuery calls participate
// in startup with their own cache keys, retries and cancellation.
export function useFinishEntryLoading() {
  const client = useQueryClient()
  const fetching = useIsFetching(initialReads)
  const { key } = useLocation()
  const navigation = useNavigation()

  useEffect(() => {
    if (!screen.open || navigation.state !== 'idle') return
    const timer = window.setTimeout(() => { continueForm.hidden = false }, 8000)
    return () => window.clearTimeout(timer)
  }, [key, navigation.state])

  useEffect(() => {
    if (!screen.open || navigation.state !== 'idle' || fetching > 0) return
    let cancelled = false
    let fade: Animation | undefined

    async function revealPage() {
      // animation.finished also resolves immediately when the intro has ended.
      await Promise.allSettled(arrival.getAnimations().map(animation => animation.finished))
      if (cancelled || !screen.open || client.isFetching(initialReads) > 0) return
      fade = screen.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180,
        easing: 'ease-out',
        fill: 'forwards',
      })
      await fade.finished.catch(() => undefined)
      if (cancelled || !screen.open || client.isFetching(initialReads) > 0) {
        fade.cancel()
        return
      }
      screen.close()
      fade.cancel()
    }

    const frame = requestAnimationFrame(() => void revealPage())
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      fade?.cancel()
    }
  }, [client, fetching, key, navigation.state])
}
