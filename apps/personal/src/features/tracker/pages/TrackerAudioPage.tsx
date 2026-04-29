import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, Icon } from '@/shared/components/ui';

export default function TrackerAudioPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopAndProcess();
    } else {
      setTimer(0);
      setIsRecording(true);
    }
  };

  const stopAndProcess = async () => {
    setIsRecording(false);
    setIsProcessing(true);
    // Simulate Speech-to-Text delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    navigate({ to: '/tracker/input' });
  };

  return (
    <BaseLayout pageTitle="Voice Note Tracker">
      <div className="container-xl py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm border-0 overflow-hidden">
              <div className="card-header bg-transparent border-0 pt-4 px-4 px-md-5 d-block">
                <h2 className="card-title h2 fw-bold text-dark mb-0">Record Voice Note</h2>
                <div className="text-secondary small mt-1">
                  Tell us about your transaction and we'll extract the details
                </div>
              </div>
              
              <div className="card-body p-4 p-md-5 text-center">
                <div 
                  className={`recording-circle mx-auto mb-4 d-flex align-items-center justify-content-center ${isRecording ? 'pulse' : ''}`}
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    backgroundColor: isRecording ? '#fff1f0' : '#f8f9fa',
                    border: `4px solid ${isRecording ? '#d63939' : '#e9ecef'}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={handleToggleRecording}
                >
                  <Icon 
                    icon={isRecording ? 'player-stop' : 'microphone'} 
                    size={64} 
                    color={isRecording ? '#d63939' : '#6c757d'}
                  />
                </div>
                
                <div className="mb-4">
                  <h1 className={`display-4 fw-bold ${isRecording ? 'text-danger' : 'text-dark'}`}>
                    {formatTime(timer)}
                  </h1>
                  <p className="text-secondary">
                    {isRecording ? 'Recording... Click circle to stop' : 'Click the microphone to start'}
                  </p>
                </div>
                
                <div className="d-grid gap-2">
                  {!isRecording && !isProcessing && (
                    <Button
                      text="Start Recording"
                      color="warning"
                      size="lg"
                      onClick={() => setIsRecording(true)}
                    />
                  )}
                  {isRecording && (
                    <Button
                      text="Stop & Process"
                      color="danger"
                      size="lg"
                      onClick={stopAndProcess}
                    />
                  )}
                  {isProcessing && (
                    <Button
                      text="Transcribing Audio..."
                      color="warning"
                      size="lg"
                      loading={true}
                      disabled={true}
                    />
                  )}
                </div>
                
                <div className="mt-4 p-3 bg-light rounded-2 text-start small text-secondary">
                  <div className="fw-bold mb-1">How to say it:</div>
                  <em className="d-block mb-1">"Beli kopi latte 35 ribu di Starbucks tadi siang"</em>
                  <em className="d-block">"Bayar listrik rumah 500 ribu lewat Tokopedia"</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .pulse {
          animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(214, 57, 57, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(214, 57, 57, 0); }
          100% { box-shadow: 0 0 0 0 rgba(214, 57, 57, 0); }
        }
      `}</style>
    </BaseLayout>
  );
}
