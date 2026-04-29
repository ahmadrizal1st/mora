import { useRef, useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, Icon } from '@/shared/components/ui';
import { useUploadDocument } from '../hooks/useTracker';

type RecordingState = 'idle' | 'recording' | 'stopped';

export default function TrackerAudioPage() {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [timer, setTimer] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();
  const uploadMutation = useUploadDocument();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recordingState === 'recording') {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [recordingState]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const startRecording = async () => {
    setError(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setTimer(0);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(250);
      setRecordingState('recording');
    } catch {
      setError('Tidak dapat mengakses mikrofon. Pastikan izin mikrofon diberikan.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecordingState('stopped');
  };

  const handleProcess = async () => {
    if (!audioBlob) return;
    setError(null);

    const ext = audioBlob.type.includes('webm') ? 'webm' : 'ogg';
    const audioFile = new File([audioBlob], `voice_note_${Date.now()}.${ext}`, {
      type: audioBlob.type,
    });

    try {
      await uploadMutation.mutateAsync({ file: audioFile, docType: 'expense' });
      navigate({ to: '/transactions' });
    } catch {
      setError('Gagal mengirim rekaman. Silakan coba lagi.');
    }
  };

  const handleReset = () => {
    setRecordingState('idle');
    setAudioBlob(null);
    setAudioUrl(null);
    setTimer(0);
    setError(null);
    uploadMutation.reset?.();
  };

  return (
    <BaseLayout
      pageTitle="Voice Note"
      pagePretitle="Audio Tracking"
      pageDescription="Ucapkan rincian transaksi Anda. AI akan mengubah suara Anda menjadi data transaksi."
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h3 className="card-title">Record Voice Note</h3>
            </div>
            <div className="card-body text-center py-5">
              {/* Recording circle */}
              <div
                className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: recordingState === 'recording' ? 'rgba(214, 57, 57, 0.1)' : recordingState === 'stopped' ? 'rgba(47, 179, 68, 0.1)' : '#f8f9fa',
                  border: `2px solid ${recordingState === 'recording' ? '#d63939' : recordingState === 'stopped' ? '#2fb344' : '#e9ecef'}`,
                  transition: 'all 0.3s ease',
                  cursor: recordingState === 'recording' ? 'pointer' : 'default',
                  animation: recordingState === 'recording' ? 'pulse-red 2s infinite' : 'none',
                }}
                onClick={recordingState === 'recording' ? stopRecording : undefined}
              >
                <Icon
                  icon={
                    recordingState === 'recording' ? 'player-stop' :
                    recordingState === 'stopped' ? 'check' :
                    'microphone'
                  }
                  size={48}
                  color={
                    recordingState === 'recording' ? '#d63939' :
                    recordingState === 'stopped' ? '#2fb344' :
                    '#6c757d'
                  }
                />
              </div>

              {/* Timer */}
              <div className={recordingState === 'recording' ? 'text-danger' : recordingState === 'stopped' ? 'text-success' : 'text-dark'}>
                <span className="display-5 fw-bold">{formatTime(timer)}</span>
              </div>
              <p className="text-secondary mt-2">
                {recordingState === 'idle' && 'Tekan tombol di bawah untuk mulai merekam'}
                {recordingState === 'recording' && 'Merekam suara Anda...'}
                {recordingState === 'stopped' && 'Rekaman selesai — siap diproses'}
              </p>

              {/* Audio preview */}
              {audioUrl && (
                <div className="my-4 px-md-5">
                  <div className="bg-light p-3 rounded-3 border">
                    <audio controls src={audioUrl} className="w-100" />
                  </div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger text-start mt-3" role="alert">
                  <div className="d-flex">
                    <div><Icon icon="alert-circle" className="alert-icon me-2" /></div>
                    <div>{error}</div>
                  </div>
                </div>
              )}

              {uploadMutation.isSuccess && (
                <div className="alert alert-success text-start mt-3" role="alert">
                  <div className="d-flex">
                    <div><Icon icon="check" className="alert-icon me-2" /></div>
                    <div>Berhasil! Suara Anda sedang diproses AI.</div>
                  </div>
                </div>
              )}
            </div>
            <div className="card-footer">
              <div className="d-grid gap-2">
                {recordingState === 'idle' && (
                  <Button
                    text="Mulai Rekam"
                    color="primary"
                    icon="microphone"
                    onClick={startRecording}
                  />
                )}

                {recordingState === 'recording' && (
                  <Button
                    text="Stop & Selesai"
                    color="danger"
                    icon="player-stop"
                    onClick={stopRecording}
                  />
                )}

                {recordingState === 'stopped' && (
                  <div className="row g-2">
                    <div className="col-8">
                      <Button
                        text={uploadMutation.isPending ? 'Mengirim...' : 'Kirim & Proses'}
                        color="success"
                        block
                        loading={uploadMutation.isPending}
                        disabled={uploadMutation.isPending}
                        onClick={handleProcess}
                      />
                    </div>
                    <div className="col-4">
                      <Button
                        text="Ulang"
                        variant="outline"
                        color="secondary"
                        block
                        disabled={uploadMutation.isPending}
                        onClick={handleReset}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card mt-4 border-0 shadow-sm bg-primary-lt">
            <div className="card-body">
              <h4 className="card-title text-primary">Tips Rekaman</h4>
              <div className="text-secondary small">
                <div className="mb-2">
                  <Icon icon="quote" size={14} className="me-2 text-primary" />
                  "Tadi siang beli makan nasi goreng 25 ribu di warung Pak Slamet"
                </div>
                <div>
                  <Icon icon="quote" size={14} className="me-2 text-primary" />
                  "Bayar tagihan listrik 450 ribu rupiah lewat aplikasi bank"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-red {
          0%   { box-shadow: 0 0 0 0 rgba(214, 57, 57, 0.4); }
          70%  { box-shadow: 0 0 0 20px rgba(214, 57, 57, 0); }
          100% { box-shadow: 0 0 0 0 rgba(214, 57, 57, 0); }
        }
      `}</style>
    </BaseLayout>
  );
}
