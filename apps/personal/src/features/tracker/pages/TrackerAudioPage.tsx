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

  // Timer saat recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recordingState === 'recording') {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [recordingState]);

  // Cleanup stream saat unmount
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

      recorder.start(250); // collect every 250ms
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
      // Gunakan schema 'expense' agar LLM ekstrak merchant + amount dari transkripsi
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
    <BaseLayout pageTitle="Voice Note Tracker">
      <div className="container-xl py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm border-0 overflow-hidden">
              <div className="card-header bg-transparent border-0 pt-4 px-4 px-md-5 d-block">
                <h2 className="card-title h2 fw-bold text-dark mb-0">Record Voice Note</h2>
                <div className="text-secondary small mt-1">
                  Ceritakan transaksi kamu, AI akan mengekstrak detailnya
                </div>
              </div>

              <div className="card-body p-4 p-md-5 text-center">
                {/* Recording circle */}
                <div
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    backgroundColor: recordingState === 'recording' ? '#fff1f0' : recordingState === 'stopped' ? '#f0fff4' : '#f8f9fa',
                    border: `4px solid ${recordingState === 'recording' ? '#d63939' : recordingState === 'stopped' ? '#2fb344' : '#e9ecef'}`,
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
                    size={64}
                    color={
                      recordingState === 'recording' ? '#d63939' :
                      recordingState === 'stopped' ? '#2fb344' :
                      '#6c757d'
                    }
                  />
                </div>

                {/* Timer */}
                <h1 className={`display-4 fw-bold mb-1 ${recordingState === 'recording' ? 'text-danger' : recordingState === 'stopped' ? 'text-success' : 'text-dark'}`}>
                  {formatTime(timer)}
                </h1>
                <p className="text-secondary mb-4">
                  {recordingState === 'idle' && 'Tekan tombol untuk mulai merekam'}
                  {recordingState === 'recording' && 'Merekam... klik lingkaran atau tombol Stop'}
                  {recordingState === 'stopped' && 'Rekaman selesai — dengarkan atau kirim langsung'}
                </p>

                {/* Audio preview */}
                {audioUrl && (
                  <div className="mb-4">
                    <audio controls src={audioUrl} className="w-100" style={{ borderRadius: '8px' }} />
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger py-2 px-3 mb-3 small text-start">{error}</div>
                )}

                {uploadMutation.isSuccess && (
                  <div className="alert alert-success py-2 px-3 mb-3 small text-start">
                    <Icon icon="check" size={14} className="me-1" />
                    Berhasil! Transaksi sedang diproses AI dan akan muncul di daftar transaksi.
                  </div>
                )}

                {/* Action buttons */}
                <div className="d-grid gap-2">
                  {recordingState === 'idle' && (
                    <Button
                      text="Mulai Rekam"
                      color="warning"
                      size="lg"
                      onClick={startRecording}
                    />
                  )}

                  {recordingState === 'recording' && (
                    <Button
                      text="Stop & Selesai"
                      color="danger"
                      size="lg"
                      onClick={stopRecording}
                    />
                  )}

                  {recordingState === 'stopped' && (
                    <>
                      <Button
                        text={uploadMutation.isPending ? 'Mengirim Rekaman...' : 'Kirim & Proses'}
                        color="primary"
                        size="lg"
                        loading={uploadMutation.isPending}
                        disabled={uploadMutation.isPending}
                        onClick={handleProcess}
                      />
                      <Button
                        text="Rekam Ulang"
                        color="secondary"
                        size="lg"
                        disabled={uploadMutation.isPending}
                        onClick={handleReset}
                      />
                    </>
                  )}
                </div>

                <div className="mt-4 p-3 bg-light rounded-2 text-start small text-secondary">
                  <div className="fw-bold mb-1">Contoh yang bisa diucapkan:</div>
                  <em className="d-block mb-1">"Beli kopi latte 35 ribu di Starbucks tadi siang"</em>
                  <em className="d-block">"Bayar listrik rumah 500 ribu lewat Tokopedia"</em>
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
