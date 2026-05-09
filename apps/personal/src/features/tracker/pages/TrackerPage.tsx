import BaseLayout from '@/shared/layouts/BaseLayout';
import { Illustration } from '@/shared/components/ui/Illustration';
import { TrackerMethodCard } from '../components/TrackerMethodCard';

const TRACKER_METHODS = [
  {
    id: 'manual',
    label: 'Manual Entry',
    description: 'Quickly type in your transaction details manually',
    path: '/tracker/input',
    colorName: 'orange',
    icon: 'pencil',
  },
  {
    id: 'text',
    label: 'Text Message',
    description: 'Paste text or SMS for automatic extraction',
    path: '/tracker/text',
    colorName: 'blue',
    icon: 'message-2',
  },
  {
    id: 'scan',
    label: 'Scan Receipt',
    description: 'Use AI to scan physical receipts from camera',
    path: '/tracker/photo',
    colorName: 'primary',
    icon: 'scan',
    isSolid: true,
  },
  {
    id: 'image',
    label: 'Upload Image',
    description: 'Pick a receipt photo from your gallery',
    path: '/tracker/image',
    colorName: 'success',
    icon: 'photo',
  },
  {
    id: 'file',
    label: 'Document',
    description: 'Import PDF invoices or bank statements',
    path: '/tracker/file',
    colorName: 'danger',
    icon: 'file-description',
  },
  {
    id: 'audio',
    label: 'Voice Note',
    description: 'Record your expense details with your voice',
    path: '/tracker/audio',
    colorName: 'warning',
    icon: 'microphone',
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
            <TrackerMethodCard key={method.id} method={method} index={index} />
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
