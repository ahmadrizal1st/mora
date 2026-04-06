import { useState, useRef, useEffect, useMemo } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'
import { Avatar } from './Avatar'
import selectsData from '../../data/selects.json'
import peopleData from '../../data/people.json'

export interface SelectOption {
  value: string
  label: string
  selected?: boolean
  avatar?: string
  flag?: string
  badge?: string
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
  defaultValue?: string | string[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  indicator?: 'avatar' | 'flag' | 'label'
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
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const resolvedOptions = useMemo(() => {
    if (selectKey) {
      const entry = (selectsData as any)[selectKey]
      if (entry) {
        if (entry.data === 'people') {
          return peopleData.map((p: any) => ({
            value: p.id.toString(),
            label: p.full_name || '',
            avatar: p.photo
          }))
        }
        if (entry.options) {
          if (Array.isArray(entry.options)) {
            return entry.options.map((opt: any) => {
              if (opt.title && opt.options) {
                return {
                  title: opt.title,
                  options: opt.options.map((o: any) => typeof o === 'string' ? { value: o, label: o } : o)
                }
              }
              return typeof opt === 'string' ? { value: opt, label: opt } : opt
            })
          } else {
            return Object.entries(entry.options).map(([val, data]: [string, any]) => ({
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
          else flat.push(o)
        })
      } else {
        flat.push(opt)
      }
    })
    return flat
  }, [resolvedOptions])

  const [selected, setSelected] = useState<string[]>(() => {
    const init = value || defaultValue
    if (init) return Array.isArray(init) ? init : [init]
    return []
  })

  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (value !== undefined) {
      const next = Array.isArray(value) ? value : [value]
      if (JSON.stringify(next) !== JSON.stringify(selected)) {
        setSelected(next)
      }
    }
  }, [value, selected])

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

  const toggleOption = (val: string) => {
    let next: string[]
    if (multiple) {
      next = selected.includes(val) ? selected.filter(s => s !== val) : [...selected, val]
      setSearch('')
      if (inputRef.current) inputRef.current.focus()
    } else {
      next = [val]
      setIsOpen(false)
      setSearch('')
    }
    setSelected(next)
    if (onChange) onChange(multiple ? next : next[0])
  }

  const removeValue = (val: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = selected.filter(s => s !== val)
    setSelected(next)
    if (onChange) onChange(multiple ? next : next[0])
    if (inputRef.current) inputRef.current.focus()
  }

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
      <span className="text-truncate">{highlightMatch(opt.label, search)}</span>
      {selected.includes(opt.value) && !multiple && <Icon icon="check" size={12} className="ms-auto text-primary" />}
    </div>
  )

  const selectedDisplay = useMemo(() => {
    if (multiple) {
      return (
        <div className="d-flex flex-wrap gap-1 align-items-center">
          {selected.map(val => {
            const opt = allOptions.find(o => o.value === val)
            return (
              <span key={val} className={clsx("badge", "bg-white", "text-dark", "border", "p-1", "rounded-1", "fw-normal", "d-flex", "align-items-center")} style={{ fontSize: '0.75rem', lineHeight: '1' }}>
                {(indicator === 'avatar' || opt?.avatar) && opt?.avatar && <Avatar src={`/${opt.avatar}`} size="xs" className="me-1" />}
                {(indicator === 'flag' || opt?.flag) && opt?.flag && <span className={clsx('flag', 'flag-xs', `flag-country-${opt.flag}`, 'me-1')}></span>}
                {(indicator === 'label' || opt?.badge) && opt?.badge && <span className="badge bg-blue-lt me-1">{opt.badge}</span>}
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
    const opt = allOptions.find(o => o.value === selected[0])
    if (!opt && !search) return <span className="text-muted">{placeholder}</span>
    if (!opt && search) return null
    return (
      <div className="d-flex align-items-center overflow-hidden">
        {(indicator === 'avatar' || opt?.avatar) && opt?.avatar && <Avatar src={`/${opt.avatar}`} size="xs" className="me-2" />}
        {(indicator === 'flag' || opt?.flag) && opt?.flag && <span className={clsx('flag', 'flag-xs', `flag-country-${opt.flag}`, 'me-2')}></span>}
        {(indicator === 'label' || opt?.badge) && opt?.badge && <span className="badge bg-blue-lt me-2">{opt.badge}</span>}
        <span className="text-truncate">{opt?.label}</span>
      </div>
    )
  }, [selected, multiple, allOptions, placeholder, indicator, search, isOpen, onChange])

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
          state && `is-${state}`
        )}
        onClick={handleContainerClick}
        style={{ 
          minHeight: '36px', 
          paddingRight: '2rem',
          borderColor: isOpen ? '#90b1e1' : undefined,
          boxShadow: isOpen ? '0 0 0 0.25rem rgba(32, 107, 196, .25)' : undefined
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
        <div className={clsx("dropdown-menu", "show", "w-100", "mt-1", "shadow-sm", "overflow-auto")} style={{ maxHeight: '250px', zIndex: 1050 }}>
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
            {isOptGroup(resolvedOptions[0]) ? (
              (resolvedOptions as SelectOptGroup[]).map((group, gi) => (
                <div key={gi}>
                  <div className="dropdown-header">{group.title}</div>
                  {group.options.map((o, oi) => {
                    const opt: SelectOption = typeof o === 'string' ? { value: o, label: o } : o
                    return (
                      <div 
                        key={oi}
                        className={clsx('dropdown-item', 'cursor-pointer', selected.includes(opt.value) && 'active')}
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
    </div>
  )
}
