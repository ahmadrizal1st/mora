// src/pages/ToastsPage.tsx
import { useState } from 'react'
import DefaultLayout from '../layouts/DefaultLayout'
import { Toast } from '../components/ui/Toast'
import { Button } from '../components/ui/Button'
import people from '../data/people.json'

type Position =
  | 'top-center'
  | 'middle-right'
  | 'middle-left'
  | 'bottom-center'
  | 'middle'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'

interface ActiveToast {
  id: string
  position: Position
  cookies?: boolean
  text?: string
}

export default function ToastsPage() {
  const [activeToasts, setActiveToasts] = useState<ActiveToast[]>([])

  const addToast = (position: Position, options: Partial<ActiveToast> = {}) => {
    const id = Math.random().toString(36).substr(2, 9)
    setActiveToasts((prev) => [...prev, { id, position, ...options }])
  }

  const removeToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const positionClasses: Record<Position, string> = {
    'top-center': 'top-0 start-50 translate-middle-x',
    'middle-right': 'top-50 end-0 translate-middle-y',
    'middle-left': 'top-50 start-0 translate-middle-y',
    'bottom-center': 'bottom-0 start-50 translate-middle-x',
    middle: 'top-50 start-50 translate-middle',
    'bottom-right': 'bottom-0 end-0',
    'bottom-left': 'bottom-0 start-0',
    'top-right': 'top-0 end-0',
    'top-left': 'top-0 start-0',
  }

  const renderContainer = (pos: Position) => {
    const toastsInPos = activeToasts.filter((t) => t.position === pos)
    if (toastsInPos.length === 0) return null

    return (
      <div className={`toast-container position-fixed p-3 ${positionClasses[pos]}`} style={{ zIndex: 1100 }}>
        {toastsInPos.map((t) => (
          <Toast
            key={t.id}
            show
            cookies={t.cookies}
            text={t.text}
            person={people[2]}
            onDismiss={() => removeToast(t.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <DefaultLayout pageTitle="Toasts">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Toast Variants</h3>
          <div className="btn-list">
            <Button text="Simple toast" onClick={() => addToast('bottom-right')} />
            <Button text="Cookies toast" onClick={() => addToast('bottom-right', { cookies: true })} />
          </div>

          <h3 className="card-title mt-4">Toast Positions</h3>
          <div className="btn-list">
            <Button text="Top Center" onClick={() => addToast('top-center', { text: 'Top Center' })} />
            <Button text="Top Right" onClick={() => addToast('top-right', { text: 'Top Right' })} />
            <Button text="Top Left" onClick={() => addToast('top-left', { text: 'Top Left' })} />
            <Button text="Middle Right" onClick={() => addToast('middle-right', { text: 'Middle Right' })} />
            <Button text="Middle Left" onClick={() => addToast('middle-left', { text: 'Middle Left' })} />
            <Button text="Bottom Center" onClick={() => addToast('bottom-center', { text: 'Bottom Center' })} />
            <Button text="Center" onClick={() => addToast('middle', { text: 'Center' })} />
            <Button text="Bottom Right" onClick={() => addToast('bottom-right', { text: 'Bottom Right' })} />
            <Button text="Bottom Left" onClick={() => addToast('bottom-left', { text: 'Bottom Left' })} />
          </div>
        </div>
      </div>

      {(Object.keys(positionClasses) as Position[]).map((pos) => renderContainer(pos))}
    </DefaultLayout>
  )
}
