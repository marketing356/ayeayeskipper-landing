'use client'
import React from 'react'

// Mobile-only toggle: shows/hides the next element (class sk-fold). Hidden on desktop by CSS.
export default function FoldBtn({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="sk-foldbtn"
      aria-expanded="false"
      onClick={e => {
        const b = e.currentTarget
        const n = b.nextElementSibling as HTMLElement | null
        if (!n) return
        const open = n.classList.toggle('sk-open')
        b.setAttribute('aria-expanded', open ? 'true' : 'false')
      }}
    >{label}</button>
  )
}
