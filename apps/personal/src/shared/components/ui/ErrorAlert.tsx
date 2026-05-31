import { useState } from 'react'

interface ErrorAlertProps {
  message: string
  fieldErrors?: Record<string, string[]> | null
}

export function ErrorAlert({ message, fieldErrors }: ErrorAlertProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false)

  const allFieldMessages = fieldErrors
    ? Object.values(fieldErrors)
        .flat()
        .filter((msg) => msg !== message)
    : []

  const extraCount = allFieldMessages.length

  return (
    <div className="error-alert-wrapper" role="alert" aria-live="polite">
      <div className="error-alert">
        <span className="error-alert__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </span>

        <span className="error-alert__message">{message}</span>

        {extraCount > 0 && (
          <span
            className={`error-alert__badge ${tooltipVisible ? 'error-alert__badge--active' : ''}`}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            onFocus={() => setTooltipVisible(true)}
            onBlur={() => setTooltipVisible(false)}
            tabIndex={0}
            role="button"
            aria-label={`${extraCount} more error${extraCount > 1 ? 's' : ''}`}
            aria-expanded={tooltipVisible}
          >
            +{extraCount} more
            {tooltipVisible && (
              <div className="error-alert__tooltip" role="tooltip">
                <div className="error-alert__tooltip-arrow" />
                <ul className="error-alert__tooltip-list">
                  {allFieldMessages.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
          </span>
        )}
      </div>
    </div>
  )
}
