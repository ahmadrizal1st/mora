import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useChatStore } from '../store/useChatStore'
import { Icon } from '@/shared/components/ui/Icon'
import { Button } from '@/shared/components/ui/Button'
import { ChatHistoryDrawer } from '../components/ChatHistoryDrawer'

const MOCK_TEMPLATES = [
  {
    id: 1,
    title: 'Analisis Arus Kas Bulanan',
    description: 'Menganalisis arus kas masuk dan keluar secara bulanan untuk melihat likuiditas bisnis.',
    icon: 'chart-bar',
    iconColor: '#20c997', // Green
    iconBg: '#e6f7ef',
    tags: [{ label: 'Cash Flow', color: '#20c997', bg: '#e6f7ef' }, { label: 'Analisis', color: '#6c757d', bg: '#f8f9fa' }],
    usage: '28 kali',
    updated: '2 hari lalu'
  },
  {
    id: 2,
    title: 'Ringkasan Laporan Keuangan',
    description: 'Merangkum laporan keuangan menjadi insight penting dan mudah dipahami.',
    icon: 'chart-pie',
    iconColor: '#6f42c1', // Purple
    iconBg: '#f0f0fe',
    tags: [{ label: 'Laporan', color: '#6f42c1', bg: '#f0f0fe' }, { label: 'Ringkasan', color: '#6c757d', bg: '#f8f9fa' }],
    usage: '42 kali',
    updated: '3 hari lalu'
  },
  {
    id: 3,
    title: 'Proyeksi Pendapatan',
    description: 'Membuat proyeksi pendapatan berdasarkan data historis dan asumsi pertumbuhan.',
    icon: 'target',
    iconColor: '#ff7a00', // Orange
    iconBg: '#fff3e6',
    tags: [{ label: 'Proyeksi', color: '#ff7a00', bg: '#fff3e6' }, { label: 'Perencanaan', color: '#6c757d', bg: '#f8f9fa' }],
    usage: '19 kali',
    updated: '5 hari lalu'
  },
  {
    id: 4,
    title: 'Analisis Investasi Saham',
    description: 'Menganalisis potensi investasi saham berdasarkan fundamental dan rasio keuangan.',
    icon: 'shield-check',
    iconColor: '#20c997', // Green
    iconBg: '#e6f7ef',
    tags: [{ label: 'Investasi', color: '#20c997', bg: '#e6f7ef' }, { label: 'Saham', color: '#6c757d', bg: '#f8f9fa' }],
    usage: '37 kali',
    updated: '1 minggu lalu'
  },
  {
    id: 5,
    title: 'Kalkulasi ROI',
    description: 'Menghitung Return on Investment dari suatu proyek atau investasi.',
    icon: 'calculator',
    iconColor: '#0d6efd', // Blue
    iconBg: '#e7f1ff',
    tags: [{ label: 'ROI', color: '#0d6efd', bg: '#e7f1ff' }, { label: 'Analisis', color: '#6c757d', bg: '#f8f9fa' }],
    usage: '22 kali',
    updated: '1 minggu lalu'
  },
  {
    id: 6,
    title: 'Budget Marketing Plan',
    description: 'Membuat rencana dan alokasi budget marketing yang efektif.',
    icon: 'file-invoice',
    iconColor: '#e83e8c', // Pink/Red
    iconBg: '#fce8f1',
    tags: [{ label: 'Budget', color: '#e83e8c', bg: '#fce8f1' }, { label: 'Marketing', color: '#6c757d', bg: '#f8f9fa' }],
    usage: '15 kali',
    updated: '2 minggu lalu'
  }
]

const TABS = ['Semua', 'Analisis Keuangan', 'Investasi', 'Perencanaan', 'Laporan', 'Lainnya']

export function ChatTemplatesPage() {
  const navigate = useNavigate()
  const { createNewSession } = useChatStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(window.innerWidth >= 768)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Semua')

  const handleCreateTemplate = () => {
    // In a real app, this would open a modal or navigate to a builder
    window.alert('Fitur pembuat template custom akan segera hadir!')
  }

  const handleUseTemplate = (template: typeof MOCK_TEMPLATES[0]) => {
    createNewSession()
    // Ideally we would pass the template prompt to the new session here
    navigate({ to: '/ai/chat/' })
  }

  return (
    <div
      className="d-flex w-100 bg-light dark:bg-dark text-body dark:text-white"
      style={{ height: '100dvh', paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <ChatHistoryDrawer isOpen={isDrawerOpen} onToggle={() => setIsDrawerOpen(!isDrawerOpen)} />

      <div className="flex-grow-1 d-flex flex-column h-100 position-relative" style={{ minWidth: 0 }}>
        {/* Header Bar */}
        <div className="bg-transparent px-3 py-3 d-flex align-items-center gap-3 position-absolute w-100" style={{ zIndex: 10, top: 0, left: 0, right: 0 }}>
          {!isDrawerOpen && (
            <Button
              iconOnly
              ghost
              size="md"
              icon="layout-sidebar"
              className="p-0 text-secondary d-md-none"
              onClick={() => setIsDrawerOpen(true)}
            />
          )}
          <div className="flex-grow-1"></div>
          <Button
            to="/dashboard"
            pill
            ghost
            size="md"
            icon="home"
            text="Home"
            className="fw-medium text-body bg-white"
          />
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 overflow-auto custom-scrollbar pt-5 mt-4 pb-5">
          <div className="mx-auto w-100 px-4 py-4" style={{ maxWidth: '1000px' }}>
            
            {/* Page Header */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
              <div className="d-flex align-items-start gap-3">
                <div className="d-flex align-items-center justify-content-center flex-shrink-0 mt-1" style={{ width: '40px', height: '40px' }}>
                  <Icon icon="wand" size={32} style={{ color: '#ff7a00' }} />
                </div>
                <div>
                  <h2 className="mb-1 fw-bold text-dark dark:text-white" style={{ fontSize: '28px' }}>
                    Templates
                  </h2>
                  <p className="text-muted mb-0" style={{ fontSize: '15px' }}>
                    Buat, kelola, dan gunakan template prompt untuk kebutuhan finansial Anda.
                  </p>
                </div>
              </div>
              <button
                className="btn btn-sm text-white rounded-pill px-4 py-2 fw-medium shadow-sm transition-colors align-self-md-center"
                style={{ backgroundColor: '#ff7a00', fontSize: '14px', whiteSpace: 'nowrap' }}
                onClick={handleCreateTemplate}
              >
                <Icon icon="plus" size={16} className="me-2" /> Buat template baru
              </button>
            </div>

            {/* Tabs */}
            <div className="d-flex overflow-x-auto gap-4 border-bottom border-light dark:border-dark mb-4 chat-scrollbar-thin">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`btn btn-link text-decoration-none px-0 pb-3 border-0 rounded-0 position-relative fw-medium ${activeTab === tab ? 'text-dark dark:text-white' : 'text-muted hover-text-dark transition-colors'}`}
                  style={{ fontSize: '15px' }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="position-absolute bottom-0 start-0 w-100" style={{ height: '3px', backgroundColor: '#ff7a00', borderTopLeftRadius: '3px', borderTopRightRadius: '3px' }}></div>
                  )}
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="d-flex flex-column flex-md-row gap-3 mb-4">
              <div className="flex-grow-1 bg-white dark:bg-dark-card border border-light dark:border-dark rounded-4 shadow-sm d-flex align-items-center px-3 py-2">
                <Icon icon="search" size={18} className="text-muted me-2 flex-shrink-0" />
                <input
                  type="text"
                  className="form-control bg-transparent border-0 shadow-none px-2 py-1 text-body"
                  placeholder="Cari template..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: '15px' }}
                />
              </div>
              <div className="bg-white dark:bg-dark-card border border-light dark:border-dark rounded-4 shadow-sm d-flex align-items-center px-3 py-2 cursor-pointer" style={{ minWidth: '160px' }}>
                <span className="text-body fw-medium flex-grow-1" style={{ fontSize: '14px' }}>Terbaru</span>
                <Icon icon="chevron-down" size={16} className="text-muted" />
              </div>
            </div>

            {/* Grid */}
            <div className="row g-4 mb-5">
              {MOCK_TEMPLATES.map((template) => (
                <div key={template.id} className="col-12 col-lg-6">
                  <div 
                    className="bg-white dark:bg-dark-card border border-light dark:border-dark rounded-4 shadow-sm p-4 h-100 d-flex flex-column transition-colors hover-transform-up cursor-pointer"
                    onClick={() => handleUseTemplate(template)}
                  >
                    
                    <div className="d-flex align-items-start gap-3 mb-3">
                      <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px', backgroundColor: template.iconBg }}>
                         <Icon icon={template.icon} size={24} style={{ color: template.iconColor }} />
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <h5 className="fw-bold mb-1 text-dark dark:text-white" style={{ fontSize: '16px' }}>{template.title}</h5>
                        <p className="text-muted mb-0" style={{ fontSize: '13px', lineHeight: '1.5' }}>{template.description}</p>
                      </div>
                      <button className="btn btn-icon btn-sm text-muted bg-transparent border-0 rounded-circle hover-bg-light flex-shrink-0 mt-n1 me-n2" onClick={(e) => e.stopPropagation()}>
                        <Icon icon="dots-vertical" size={18} />
                      </button>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                      {template.tags.map((tag, idx) => (
                        <span key={idx} className="badge fw-medium px-2 py-1 rounded-pill" style={{ backgroundColor: tag.bg, color: tag.color, fontSize: '11px' }}>
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-3 border-top border-light dark:border-dark d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '12px' }}>
                      <span className="d-flex align-items-center gap-1"><Icon icon="chart-bar" size={14} /> Digunakan {template.usage}</span>
                      <span>Diperbarui {template.updated}</span>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Banner */}
            <div className="bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-4 p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div className="d-flex gap-3 align-items-start">
                <Icon icon="sparkles" size={24} style={{ color: '#ff7a00' }} className="flex-shrink-0 mt-1" />
                <div>
                  <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '16px' }}>Belum menemukan template yang sesuai?</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Buat template custom sesuai kebutuhan finansial Anda.</p>
                </div>
              </div>
              <button
                className="btn btn-sm text-white rounded-pill px-4 py-2 fw-medium shadow-sm transition-colors flex-shrink-0 align-self-start align-self-md-center"
                style={{ backgroundColor: '#ff7a00', fontSize: '14px' }}
                onClick={handleCreateTemplate}
              >
                <Icon icon="plus" size={16} className="me-2" /> Buat template baru
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
