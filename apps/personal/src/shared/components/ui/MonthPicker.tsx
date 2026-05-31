import React, { useState, useEffect, useRef } from 'react'
import { Icon } from './Icon'

interface MonthPickerProps {
  value: Date
  onChange: (date: Date) => void
  className?: string
}

export function MonthPicker({ value, onChange, className }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState(value.getFullYear())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPickerYear(value.getFullYear())
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]

  const shortMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ]

  const formatMonthYear = (date: Date) => {
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    const d = new Date(value)
    d.setMonth(d.getMonth() - 1)
    onChange(d)
  }

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    const d = new Date(value)
    d.setMonth(d.getMonth() + 1)
    onChange(d)
  }

  const handleMonthSelect = (monthIndex: number) => {
    const d = new Date(value)
    d.setFullYear(pickerYear)
    d.setMonth(monthIndex)
    onChange(d)
    setIsOpen(false)
  }

  const handlePrevYear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPickerYear((prev) => prev - 1)
  }

  const handleNextYear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPickerYear((prev) => prev + 1)
  }

  return (
    <div ref={containerRef} className={`position-relative d-inline-block ${className || ''}`}>
      <div className="d-flex align-items-center bg-body-tertiary rounded-pill p-1 px-2 border">
        <button
          type="button"
          className="btn btn-icon btn-sm border-0 bg-transparent text-secondary hover-primary py-1"
          onClick={handlePrevMonth}
          aria-label="Previous month"
        >
          <Icon icon="chevron-left" size="sm" />
        </button>
        <span
          className="px-2 small fw-bold text-body text-center cursor-pointer select-none"
          style={{ minWidth: '120px', cursor: 'pointer' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {formatMonthYear(value)}
        </span>
        <button
          type="button"
          className="btn btn-icon btn-sm border-0 bg-transparent text-secondary hover-primary py-1"
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          <Icon icon="chevron-right" size="sm" />
        </button>
      </div>

      {isOpen && (
        <div
          className="card shadow-lg border position-absolute start-50 translate-middle-x mt-2 py-2 px-3 bg-surface"
          style={{
            zIndex: 1050,
            minWidth: '240px',
            borderRadius: '12px',
            borderColor: 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <button
              type="button"
              className="btn btn-icon btn-sm border-0 bg-transparent text-secondary hover-primary"
              onClick={handlePrevYear}
            >
              <Icon icon="chevron-left" size="sm" />
            </button>
            <span className="fw-bold text-dark">{pickerYear}</span>
            <button
              type="button"
              className="btn btn-icon btn-sm border-0 bg-transparent text-secondary hover-primary"
              onClick={handleNextYear}
            >
              <Icon icon="chevron-right" size="sm" />
            </button>
          </div>

          <div className="row g-2 text-center" style={{ margin: '0 -4px' }}>
            {shortMonths.map((m, idx) => {
              const isSelected = value.getMonth() === idx && value.getFullYear() === pickerYear
              return (
                <div key={idx} className="col-4 p-1">
                  <button
                    type="button"
                    className={`btn btn-sm w-100 border-0 fw-semibold rounded-2 py-2 ${
                      isSelected
                        ? 'btn-primary text-white'
                        : 'bg-transparent text-secondary hover-bg-light'
                    }`}
                    style={{
                      fontSize: '11px',
                      transition: 'all 0.15s ease',
                    }}
                    onClick={() => handleMonthSelect(idx)}
                  >
                    {m}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
