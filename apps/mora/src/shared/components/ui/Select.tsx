import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'
import { Avatar } from './Avatar'
 import selectData from '../../data/selects.json'
 import peopleData from '../../data/people.json'
 import { type Person } from '@/shared/types/common.types'

export interface SelectOption {
  value: string | number
  label: string
  selected?: boolean
  avatar?: string
  flag?: string
  badge?: string
  icon?: string
}

export interface SelectOptGroup {
  title: string
  options: (string | SelectOption)[]
}

export interface SelectProps {
  id?: string
  options?: (SelectOption | SelectOptGroup)[]
  values?: string[]
  selectKey?: string
  multiple?: boolean
  placeholder?: string
  state?: 'valid' | 'invalid'
  showSearch?: boolean
  className?: string
  defaultValue?: string | number | (string | number)[]
  value?: string | number | (string | number)[]
  onChange?: (value: any) => void
  indicator?: 'avatar' | 'flag' | 'label'
  placement?: 'start' | 'end'
  error?: string
}

function isOptGroup(item: SelectOption | SelectOptGroup): item is SelectOptGroup {
  return 'title' in item
}

export function Select({
  id,
  options = [],
  values,
  selectKey,
  multiple,
  placeholder = 'Select...',
  state,
  className,
  defaultValue,
  value,
  onChange,
  indicator,
  placement = 'start',
  error,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const resolvedOptions = useMemo(() => {
    if (selectKey) {
      const entry = (selectData as Record<string, { data?: string; options?: unknown }>)[selectKey]
      if (entry) {
        if (entry.data === 'people') {
          return (peopleData as Person[]).map((p) => ({
            value: (p.id || '').toString(),
            label: p.full_name || '',
            avatar: p.photo
          }))
        }
        if (entry.options) {
          if (Array.isArray(entry.options)) {
            return (entry.options as unknown[]).map((opt) => {
              const o = opt as { title?: string; options?: unknown[] }
              if (o && typeof o === 'object' && o.title && o.options) {
                return {
                  title: o.title,
                  options: (o.options as unknown[]).map((optChild) => typeof optChild === 'string' ? { value: optChild, label: optChild } : optChild as SelectOption)
                }
              }
              return typeof opt === 'string' ? { value: opt, label: opt } : opt as SelectOption
            })
          } else {
            return Object.entries(entry.options as Record<string, { name?: string; flag?: string; label?: string }>).map(([val, data]) => ({
              value: val,
              label: data.name || val,
              flag: data.flag,
              badge: data.label
            }))
          }
        }
      }
    }

    if (values) {
      return values.map(v => ({ value: v, label: v }))
    }

    return options
  }, [selectKey, values, options])

  const allOptions = useMemo((): SelectOption[] => {
    const flat: SelectOption[] = []
    resolvedOptions.forEach((opt: SelectOption | SelectOptGroup) => {
      if (isOptGroup(opt)) {
        opt.options.forEach((o: string | SelectOption) => {
          if (typeof o === 'string') flat.push({ value: o, label: o })
          else flat.push(o as SelectOption)
        })
      } else {
        flat.push(opt as SelectOption)
      }
    })
    return flat
  }, [resolvedOptions])

  const [selected, setSelected] = useState<(string | number)[]>(() => {
    const init = value || defaultValue
    if (init !== undefined && init !== null) return Array.isArray(init) ? init : [init]
    return []
  })

  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Synchronize internal state with value prop if it changes
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    const next = (value !== undefined && value !== null) ? (Array.isArray(value) ? value : [value]) : []
    setSelected(next)
    setPrevValue(value)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = useMemo(() => {
    if (!search) return resolvedOptions
    return (allOptions as SelectOption[]).filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
  }, [allOptions, search, resolvedOptions])

  const toggleOption = useCallback((val: string | number) => {
    let next: (string | number)[]
    if (multiple) {
      next = selected.some(s => s.toString() === val.toString()) 
        ? selected.filter(s => s.toString() !== val.toString()) 
        : [...selected, val]
      setSearch('')
      if (inputRef.current) inputRef.current.focus()
    } else {
      next = [val]
      setIsOpen(false)
      setSearch('')
    }
    setSelected(next)
    if (onChange) onChange(multiple ? next : next[0])
  }, [multiple, selected, onChange])

  const removeValue = useCallback((val: string | number, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = selected.filter(s => s.toString() !== val.toString())
    setSelected(next)
    if (onChange) onChange(multiple ? next : next[0])
    if (inputRef.current) inputRef.current.focus()
  }, [selected, multiple, onChange])

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <span key={i} className="bg-yellow-lt">{part}</span> 
            : part
        )}
      </>
    )
  }

  const renderOptionContent = (opt: SelectOption) => (
    <div className="d-flex align-items-center w-100">
      {(indicator === 'avatar' || opt.avatar) && opt.avatar && <Avatar src={`/${opt.avatar}`} size="xs" className="me-2" />}
      {(indicator === 'flag' || opt.flag) && opt.flag && <span className={clsx('flag', 'flag-xs', `flag-country-${opt.flag}`, 'me-2')}></span>}
      {(indicator === 'label' || opt.badge) && opt.badge && <span className="badge bg-blue-lt me-2">{opt.badge}</span>}
      {opt.icon && <Icon icon={opt.icon} size={14} className="me-2 text-muted" />}
      <span className="text-truncate">{highlightMatch(opt.label, search)}</span>
      {selected.some(s => s.toString() === opt.value.toString()) && !multiple && <Icon icon="check" size={12} className="ms-auto text-primary" />}
    </div>
  )

  const selectedDisplay = useMemo(() => {
    if (multiple) {
      return (
        <div className="d-flex flex-wrap gap-1 align-items-center">
          {selected.map(val => {
            const opt = allOptions.find(o => o.value.toString() === val.toString())
            return (
              <span key={val} className={clsx("badge", "bg-white", "text-dark", "border", "p-1", "rounded-1", "fw-normal", "d-flex", "align-items-center")} style={{ fontSize: '0.75rem', lineHeight: '1' }}>
                {(indicator === 'avatar' || opt?.avatar) && opt?.avatar && <Avatar src={`/${opt.avatar}`} size="xs" className="me-1" />}
                {(indicator === 'flag' || opt?.flag) && opt?.flag && <span className={clsx('flag', 'flag-xs', `flag-country-${opt.flag}`, 'me-1')}></span>}
                {(indicator === 'label' || opt?.badge) && opt?.badge && <span className="badge bg-blue-lt me-1">{opt.badge}</span>}
                {opt?.icon && <Icon icon={opt.icon} size={12} className="me-1" />}
                {opt?.label || val}
                <span className={clsx("ms-1", "cursor-pointer", "d-flex", "align-items-center", "text-muted")} onClick={(e) => removeValue(val, e)}>
                  <Icon icon="x" size={10} />
                </span>
              </span>
            )
          })}
          <input
            ref={inputRef}
            type="text"
            className={clsx("p-0", "m-0", "border-0", "bg-transparent", "active-input", "flex-fill")}
            style={{ 
              minWidth: selected.length === 0 ? '100%' : (search ? `${Math.max(search.length * 8 + 10, 30)}px` : '20px'),
              width: search ? 'auto' : '0',
              flex: '1 1 auto',
              boxShadow: 'none', 
              outline: 'none',
              height: 'auto',
              lineHeight: 'inherit'
            }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              if (!isOpen) setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !search && selected.length > 0) {
                const next = selected.slice(0, -1)
                setSelected(next)
                if (onChange) onChange(next)
              }
            }}
            placeholder={selected.length === 0 ? placeholder : ''}
          />
        </div>
      )
    }
    const opt = allOptions.find(o => o.value.toString() === selected[0]?.toString())
    if (!opt && !search) return <span className="text-muted">{placeholder}</span>
    if (!opt && search) return null
    return (
      <div className="d-flex align-items-center overflow-hidden">
        {(indicator === 'avatar' || opt?.avatar) && opt?.avatar && <Avatar src={`/${opt.avatar}`} size="xs" className="me-2" />}
        {(indicator === 'flag' || opt?.flag) && opt?.flag && <span className={clsx('flag', 'flag-xs', `flag-country-${opt.flag}`, 'me-2')}></span>}
        {(indicator === 'label' || opt?.badge) && opt?.badge && <span className="badge bg-blue-lt me-2">{opt.badge}</span>}
        {opt?.icon && <Icon icon={opt.icon} size={14} className="me-2 text-muted" />}
        <span className="text-truncate">{opt?.label}</span>
      </div>
    )
  }, [selected, multiple, allOptions, placeholder, indicator, search, isOpen, onChange, removeValue])

  const handleContainerClick = () => {
    setIsOpen(!isOpen)
    if (!isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <div 
      ref={containerRef}
      className={clsx('form-select-container', 'position-relative', className)}
      id={id}
    >
      <div 
        className={clsx(
          'form-control',
          'd-flex',
          'align-items-center',
          'cursor-pointer',
          'position-relative',
          isOpen && 'show focus',
          (state || error) && `is-${state || (error ? 'invalid' : '')}`
        )}
        onClick={handleContainerClick}
        style={{ 
          minHeight: '36px', 
          paddingRight: '2rem',
        }}
      >
        <div className="flex-fill d-flex align-items-center overflow-hidden">
          {selectedDisplay}
        </div>
        {!multiple && (
           <input
             ref={inputRef}
             type="text"
             className="position-absolute opacity-0"
             style={{ left: 0, top: 0, width: '100%', height: '100%', cursor: 'pointer' }}
             value={search}
             onChange={(e) => {
               setSearch(e.target.value)
               if (!isOpen) setIsOpen(true)
             }}
             onKeyDown={(e) => {
               if (e.key === 'Backspace' && !search && !multiple) {
                 setSelected([])
               }
             }}
           />
        )}
        <div 
          className="position-absolute" 
          style={{ right: '0.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        >
          <Icon icon="chevron-down" size={16} className={clsx('text-muted', 'transition-transform', isOpen && 'rotate-180')} />
        </div>
      </div>

      {isOpen && (
        <div 
          className={clsx(
            "dropdown-menu", 
            "show", 
            placement === 'start' && "w-100", 
            placement === 'end' && "dropdown-menu-end",
            "mt-1", 
            "shadow-sm", 
            "overflow-auto"
          )} 
          style={{ 
            maxHeight: '250px', 
            zIndex: 1050,
            left: placement === 'end' ? 'auto' : undefined,
            right: placement === 'end' ? 0 : undefined,
            minWidth: '100%'
          }}
        >
          {!multiple && allOptions.length > 5 && (
            <div className="p-2 border-bottom">
              <input 
                ref={inputRef}
                type="text" 
                className="form-control form-control-sm" 
                placeholder="Search..." 
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          
          <div className="list-group list-group-flush list-group-hoverable">
            {resolvedOptions.length > 0 && isOptGroup(resolvedOptions[0]) ? (
              (resolvedOptions as SelectOptGroup[]).map((group, gi) => (
                <div key={gi}>
                  <div className="dropdown-header">{group.title}</div>
                  {group.options.map((o, oi) => {
                    const opt: SelectOption = typeof o === 'string' ? { value: o, label: o } : o
                    return (
                      <div 
                        key={oi}
                        className={clsx('dropdown-item', 'cursor-pointer', selected.some(s => s.toString() === opt.value.toString()) && 'active')}
                        onClick={(e) => { e.stopPropagation(); toggleOption(opt.value) }}
                      >
                        {renderOptionContent(opt)}
                      </div>
                    )
                  })}
                </div>
              ))
            ) : (
              (filteredOptions as SelectOption[]).map((opt) => (
                <div 
                  key={opt.value}
                  className={clsx('dropdown-item', 'cursor-pointer', selected.includes(opt.value) && 'active')}
                  onClick={(e) => { e.stopPropagation(); toggleOption(opt.value) }}
                >
                  {renderOptionContent(opt)}
                </div>
              ))
            )}
            {filteredOptions.length === 0 && <div className="dropdown-item text-muted">No results found</div>}
          </div>
        </div>
      )}
      {error && <div className="invalid-feedback d-block mt-1">{error}</div>}
    </div>
  )
}
