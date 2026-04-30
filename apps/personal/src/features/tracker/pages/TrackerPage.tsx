import { Link } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Icon } from '@/shared/components/ui/Icon';
import { Illustration } from '@/shared/components/ui/Illustration';

const TRACKER_METHODS = [
  {
    id: 'manual',
    label: 'Manual Entry',
    description: 'Quickly type in your transaction details manually',
    path: '/tracker/input',
    bgColor: '#ffffff',
    iconColor: '#f97316', // orange
    icon: 'pencil',
    textColor: 'dark',
  },
  {
    id: 'text',
    label: 'Text Message',
    description: 'Paste text or SMS for automatic extraction',
    path: '/tracker/text',
    bgColor: '#e8f4ff', // light blue
    iconColor: '#206bc4', // primary
    icon: 'message-2',
    textColor: 'primary',
  },
  {
    id: 'scan',
    label: 'Scan Receipt',
    description: 'Use AI to scan physical receipts from camera',
    path: '/tracker/photo',
    bgColor: '#206bc4', // solid blue
    iconColor: '#ffffff',
    icon: 'scan',
    textColor: 'white',
  },
  {
    id: 'image',
    label: 'Upload Image',
    description: 'Pick a receipt photo from your gallery',
    path: '/tracker/image',
    bgColor: '#f6ffed', // light green
    iconColor: '#2fb344', // success
    icon: 'photo',
    textColor: 'success',
  },
  {
    id: 'file',
    label: 'Document',
    description: 'Import PDF invoices or bank statements',
    path: '/tracker/file',
    bgColor: '#fff1f0', // light red
    iconColor: '#d63939', // danger
    icon: 'file-description',
    textColor: 'danger',
  },
  {
    id: 'audio',
    label: 'Voice Note',
    description: 'Record your expense details with your voice',
    path: '/tracker/audio',
    bgColor: '#fffbe6', // light yellow
    iconColor: '#f59f00', // warning
    icon: 'microphone',
    textColor: 'warning',
  },
];

export default function TrackerPage() {
  return (
    <BaseLayout 
      pageTitle="Tracker" 
      pageHeaderClass="d-md-none"
      showBackButton={true}
    >
      <div className="container-xl py-4">
        {/* Header Illustration & Text Section */}
        <div className="row align-items-center mb-5 g-4 tracker-animate-fade-in-up">
          <div className="col-12 col-md-7 text-center text-md-start">
            <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>Track Your Finance</h1>
            <p className="text-muted fs-3 mb-0">
              Easily record your daily expenses using various methods. 
              Choose the one that fits your workflow best.
            </p>
          </div>
          <div className="col-12 col-md-5 text-center">
            <Illustration 
              image="payment" 
              height={220} 
              alt="Track finance illustration" 
            />
          </div>
        </div>


        <div className="row g-3 g-md-4">
          {TRACKER_METHODS.map((method, index) => (
            <div 
              key={method.id} 
              className="col-6 col-md-4 tracker-animate-fade-in-up"
              style={{ animationDelay: `${0.2 + index * 0.08}s` }}
            >
              <Link
                to={method.path}
                className="card border shadow-sm h-100 text-decoration-none overflow-hidden position-relative"
                style={{ 
                  backgroundColor: method.bgColor,
                  borderRadius: '12px',
                  minHeight: '140px'
                }}
              >
                {/* Background Decoration Icon */}
                <div 
                  className="position-absolute"
                  style={{ 
                    top: '-15px', 
                    right: '-15px', 
                    width: '120px', 
                    height: '120px', 
                    backgroundColor: method.textColor === 'white' ? 'rgba(255,255,255,0.15)' : `${method.iconColor}15`,
                    borderRadius: '50%',
                    zIndex: 0
                  }}
                />
                <div 
                  className="position-absolute"
                  style={{ 
                    top: '10px', 
                    right: '10px', 
                    zIndex: 1,
                    opacity: 0.2,
                    transform: 'rotate(-15deg)',
                    color: method.textColor === 'white' ? '#ffffff' : method.iconColor
                  }}
                >
                  <Icon icon={method.icon} size={80} stroke={1.5} />
                </div>

                <div className="card-body p-4 position-relative" style={{ zIndex: 2 }}>
                  <h3 className={`fw-bold mb-2 text-${method.textColor}`} style={{ fontSize: '1.25rem' }}>
                    {method.label}
                  </h3>
                  <p className={`text-${method.textColor} opacity-75 mb-0`} style={{ maxWidth: '80%' }}>
                    {method.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Footer info/help */}
        <div 
          className="mt-5 text-center tracker-animate-fade-in-up" 
          style={{ animationDelay: '0.8s' }}
        >
          <p className="text-muted small">
            Choose a method to start tracking your expenses automatically.
          </p>
        </div>
      </div>
    </BaseLayout>
  );
}



