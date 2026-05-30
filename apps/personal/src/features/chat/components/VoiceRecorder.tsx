import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/shared/components/ui/Icon';

interface VoiceRecorderProps {
  onCancel: () => void;
  onSend: (audioBlob: Blob | null) => void;
}

export function VoiceRecorder({ onCancel, onSend }: VoiceRecorderProps) {
  // 200 bars for a very dense and long history
  const [history, setHistory] = useState<number[]>(new Array(200).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const reqRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const lastUpdateRef = useRef<number>(0);
  
  useEffect(() => {
    async function startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;
        
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256; 
        analyserRef.current = analyser;
        
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceRef.current = source;
        
        const updateVisualizer = (time: number) => {
          if (!analyserRef.current) return;
          
          reqRef.current = requestAnimationFrame(updateVisualizer);
          
          // Update history every ~40ms for smoother flow
          if (time - lastUpdateRef.current < 40) return;
          lastUpdateRef.current = time;

          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          
          setHistory(prev => {
            const next = [...prev];
            next.shift(); // remove oldest
            next.push(average); // add newest at the end
            return next;
          });
        };
        
        reqRef.current = requestAnimationFrame(updateVisualizer);
      } catch (err) {
        console.error("Microphone access denied:", err);
      }
    }
    
    startRecording();
    
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      if (sourceRef.current) sourceRef.current.disconnect();
      if (audioContextRef.current) audioContextRef.current.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="d-flex align-items-center w-100 gap-2">
      <button 
        type="button" 
        className="btn btn-icon btn-sm text-muted bg-transparent border-0 flex-shrink-0" 
        disabled
        style={{ width: '32px', height: '32px' }}
      >
        <Icon icon="plus" size={20} />
      </button>
      
      <div 
        className="flex-grow-1 d-flex align-items-center justify-content-end overflow-hidden px-2" 
        style={{ height: '32px', gap: '2px' }}
      >
        {history.map((val, i) => {
          // Base height is 3px to look like a dot/dotted line when quiet
          const minH = 3;
          const maxH = 28;
          // Scale volume to height
          const h = minH + (val / 128) * (maxH - minH); 
          const clampedH = Math.min(Math.max(h, minH), maxH);
          return (
            <div 
              key={i} 
              className="bg-secondary rounded-pill flex-shrink-0" 
              style={{ 
                width: '3px', 
                height: `${clampedH}px`,
                transition: 'height 40ms linear',
                opacity: 0.7
              }}
            ></div>
          )
        })}
      </div>

      <div className="d-flex align-items-center gap-1 flex-shrink-0">
        <button 
          type="button" 
          className="btn btn-icon btn-sm text-muted bg-transparent border-0 rounded-circle hover-bg-light"
          onClick={onCancel}
          title="Cancel"
          style={{ width: '32px', height: '32px' }}
        >
          <Icon icon="x" size={20} />
        </button>
        <button 
          type="button" 
          className="btn btn-icon btn-sm bg-white dark:bg-dark-card text-body shadow-sm border-0 rounded-circle"
          onClick={() => onSend(null)}
          title="Send"
          style={{ width: '32px', height: '32px' }}
        >
          <Icon icon="check" size={18} />
        </button>
      </div>
    </div>
  );
}
