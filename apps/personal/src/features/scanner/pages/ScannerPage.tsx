import React, { useRef, useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { getPerspectiveTransform, applyHomography } from '../utils/perspectiveTransform'
import { useTransactionModalStore } from '@/features/transaction/store/useTransactionModalStore'

const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

import {
  type Point,
  dist,
  clamp,
  sleep,
  autoDetectCorners,
  defaultCorners,
} from '../utils/cornerDetection'
import { ScannerStatusAlert } from '../components/ScannerStatusAlert'

interface LocationState {
  image?: string
  corners?: Point[]
}

export default function TrackerPhotoPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setScannedImage, openChatbotModal } = useTransactionModalStore()
  const locationState = location.state as LocationState
  const videoRef = useRef<HTMLVideoElement>(null)
  const capturedCanvasRef = useRef<HTMLCanvasElement>(null)
  const liveOverlayRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<'live' | 'captured' | 'result'>('live')
  const [corners, setCorners] = useState<Point[] | null>(null)
  const [capturedData, setCapturedData] = useState<ImageData | null>(null)
  const [statusMsg, setStatusMsg] = useState('Menginisialisasi kamera...')
  const [statusType, setStatusType] = useState<'ok' | 'warn' | 'error' | ''>('warn')
  const [isFlash, setIsFlash] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingLabel, setProcessingLabel] = useState('')
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment')
  const [isAutoCrop, setIsAutoCrop] = useState(true)
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg'>('png')
  const [autoCropTimeLeft, setAutoCropTimeLeft] = useState<number | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [liveDetected, setLiveDetected] = useState(false)
  const [shutterActive, setShutterActive] = useState(false)

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const dragging = useRef<number | null>(null)
  const draggingEdge = useRef<number>(-1)
  const dragEdgeStart = useRef<{ corners: Point[]; pointerX: number; pointerY: number } | null>(
    null
  )
  const cornersRef = useRef<Point[] | null>(null)
  const capturedWRef = useRef(0)
  const capturedHRef = useRef(0)
  const autoCropIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const liveDetectIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const rafId = useRef<number | null>(null)
  const cropAndWarpRef = useRef<() => void>(() => {})
  const liveCornersRef = useRef<Point[] | null>(null)

  const drawLiveOverlay = useCallback((pts: Point[] | null, vw: number, vh: number) => {
    const overlay = liveOverlayRef.current
    if (!overlay) return
    if (overlay.width !== vw || overlay.height !== vh) {
      overlay.width = vw
      overlay.height = vh
    }
    const oc = overlay.getContext('2d')
    if (!oc) return
    oc.clearRect(0, 0, vw, vh)

    if (!pts || pts.length < 4) {
      const margin = Math.min(vw, vh) * 0.07
      const x = margin,
        y = margin
      const bw = vw - margin * 2,
        bh = vh - margin * 2
      const cs = Math.min(vw, vh) * 0.06
      oc.strokeStyle = '#f76707'
      oc.lineWidth = Math.max(2, vw * 0.003)
      oc.setLineDash([8, 8])
      oc.beginPath()
      oc.rect(x, y, bw, bh)
      oc.stroke()
      oc.setLineDash([])
      oc.lineWidth = Math.max(4, vw * 0.006)
      ;[
        [x, y, 1, 1],
        [x + bw, y, -1, 1],
        [x + bw, y + bh, -1, -1],
        [x, y + bh, 1, -1],
      ].forEach(([cx, cy, dx, dy]) => {
        oc.beginPath()
        oc.moveTo(cx + dx * cs, cy)
        oc.lineTo(cx, cy)
        oc.lineTo(cx, cy + dy * cs)
        oc.stroke()
      })
      return
    }

    oc.fillStyle = 'rgba(0,0,0,0.38)'
    oc.fillRect(0, 0, vw, vh)
    oc.save()
    oc.beginPath()
    pts.forEach((c, i) => (i === 0 ? oc.moveTo(c.x, c.y) : oc.lineTo(c.x, c.y)))
    oc.closePath()
    oc.clip()
    oc.clearRect(0, 0, vw, vh)
    oc.restore()

    oc.shadowColor = 'rgba(34,197,94,0.75)'
    oc.shadowBlur = 20
    oc.strokeStyle = '#22c55e'
    oc.lineWidth = Math.max(3, vw * 0.004)
    oc.setLineDash([])
    oc.beginPath()
    pts.forEach((c, i) => (i === 0 ? oc.moveTo(c.x, c.y) : oc.lineTo(c.x, c.y)))
    oc.closePath()
    oc.stroke()
    oc.shadowBlur = 0

    const r = Math.min(vw, vh) * 0.016
    pts.forEach((c) => {
      oc.beginPath()
      oc.arc(c.x, c.y, r, 0, Math.PI * 2)
      oc.fillStyle = '#22c55e'
      oc.fill()
      oc.strokeStyle = '#ffffff'
      oc.lineWidth = Math.max(2, vw * 0.003)
      oc.stroke()
    })
  }, [])

  const stopLiveDetection = useCallback(() => {
    if (liveDetectIntervalRef.current) {
      clearInterval(liveDetectIntervalRef.current)
      liveDetectIntervalRef.current = null
    }
  }, [])

  const startLiveDetection = useCallback(() => {
    stopLiveDetection()
    liveDetectIntervalRef.current = setInterval(() => {
      const video = videoRef.current
      if (!video || video.readyState < 2) return
      const vw = video.videoWidth
      const vh = video.videoHeight
      if (!vw || !vh) return

      const SCALE = Math.min(1, 640 / Math.max(vw, vh))
      const dw = Math.round(vw * SCALE)
      const dh = Math.round(vh * SCALE)
      const tmp = document.createElement('canvas')
      tmp.width = dw
      tmp.height = dh
      const ctx = tmp.getContext('2d')
      if (!ctx) return
      ctx.drawImage(video, 0, 0, dw, dh)
      const imgData = ctx.getImageData(0, 0, dw, dh)
      const detected = autoDetectCorners(imgData, dw, dh)

      if (detected) {
        const scaled = detected.map((p) => ({ x: p.x / SCALE, y: p.y / SCALE }))
        liveCornersRef.current = scaled
        setLiveDetected(true)
        drawLiveOverlay(scaled, vw, vh)
      } else {
        liveCornersRef.current = null
        setLiveDetected(false)
        drawLiveOverlay(null, vw, vh)
      }
    }, 300)
  }, [stopLiveDetection, drawLiveOverlay])

  const startCamera = useCallback(
    async (skipIfImage = false) => {
      if (skipIfImage && locationState?.image) return
      setStatusMsg('Meminta akses kamera...')
      setStatusType('warn')
      try {
        const video = videoRef.current
        if (!video) return
        if (video.srcObject) (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop())
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: cameraFacing },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        })
        video.srcObject = stream
        video.onloadedmetadata = () => {
          video.play()
          setMode('live')
          setStatusMsg('Arahkan kamera ke dokumen')
          setStatusType('')
          startLiveDetection()
        }
      } catch {
        setStatusMsg('Kamera tidak dapat diakses — gunakan tombol Upload')
        setStatusType('error')
      }
    },
    [cameraFacing, startLiveDetection, locationState?.image]
  )

  useEffect(() => {
    const video = videoRef.current
    if (mode !== 'live' || !video || !video.srcObject) return
    const stream = video.srcObject as MediaStream
    const track = stream.getVideoTracks()[0]
    if (!track) return

    try {
      const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean }
      if (capabilities.torch) {
        track.applyConstraints({
          advanced: [{ torch: isFlash }],
        })
      }
    } catch (e) {
      console.warn('Torch not supported', e)
    }
  }, [isFlash, mode])

  useEffect(() => {
    if (locationState?.image) {
      const img = new Image()
      img.onload = async () => {
        const w = img.width,
          h = img.height
        capturedWRef.current = w
        capturedHRef.current = h
        const tmp = document.createElement('canvas')
        tmp.width = w
        tmp.height = h
        const ctx = tmp.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        const imgData = ctx.getImageData(0, 0, w, h)

        setCapturedData(imgData)
        setMode('captured')
        setStatusMsg('✓ Gambar diterima — silakan sesuaikan sudut')
        setStatusType('ok')

        const incomingCorners = locationState?.corners
        const detected = incomingCorners || autoDetectCorners(imgData, w, h)
        const initCorners = detected || defaultCorners(w, h)

        cornersRef.current = initCorners
        setCorners(initCorners)
      }
      img.src = locationState.image!
    } else {
      setTimeout(() => startCamera(), 0)
    }

    const video = videoRef.current
    const currentRafId = rafId.current
    const currentAutoCropInterval = autoCropIntervalRef.current

    return () => {
      if (currentRafId) cancelAnimationFrame(currentRafId)
      stopLiveDetection()
      if (currentAutoCropInterval) clearInterval(currentAutoCropInterval)
      if (video?.srcObject) (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop())
    }
  }, [locationState?.image, locationState?.corners, startCamera, stopLiveDetection])

  const drawCapturedOverlay = useCallback(
    (pts: Point[]) => {
      const canvas = capturedCanvasRef.current
      if (!canvas || !capturedData) return
      const w = capturedWRef.current
      const h = capturedHRef.current
      canvas.width = w
      canvas.height = h
      const oc = canvas.getContext('2d')
      if (!oc) return
      oc.clearRect(0, 0, w, h)

      const tmp = document.createElement('canvas')
      tmp.width = w
      tmp.height = h
      tmp.getContext('2d')?.putImageData(capturedData, 0, 0)
      oc.drawImage(tmp, 0, 0)

      oc.fillStyle = 'rgba(0,0,0,0.55)'
      oc.fillRect(0, 0, w, h)
      oc.save()
      oc.beginPath()
      pts.forEach((c, i) => (i === 0 ? oc.moveTo(c.x, c.y) : oc.lineTo(c.x, c.y)))
      oc.closePath()
      oc.clip()
      oc.drawImage(tmp, 0, 0)
      oc.restore()

      oc.shadowColor = 'rgba(247, 103, 7, 0.6)'
      oc.shadowBlur = 16
      oc.strokeStyle = '#f76707'
      oc.lineWidth = Math.max(2, w * 0.003)
      oc.beginPath()
      pts.forEach((c, i) => (i === 0 ? oc.moveTo(c.x, c.y) : oc.lineTo(c.x, c.y)))
      oc.closePath()
      oc.stroke()
      oc.shadowBlur = 0

      const cs = Math.min(w, h) * 0.05
      const lw = Math.max(3, w * 0.005)
      pts.forEach((c, i) => {
        const prev = pts[(i + 3) % 4]
        const next = pts[(i + 1) % 4]
        const toPrev = { x: prev.x - c.x, y: prev.y - c.y }
        const toNext = { x: next.x - c.x, y: next.y - c.y }
        const lenPrev = Math.hypot(toPrev.x, toPrev.y) || 1
        const lenNext = Math.hypot(toNext.x, toNext.y) || 1
        const dp = { x: (toPrev.x / lenPrev) * cs, y: (toPrev.y / lenPrev) * cs }
        const dn = { x: (toNext.x / lenNext) * cs, y: (toNext.y / lenNext) * cs }
        oc.strokeStyle = '#ffffff'
        oc.lineWidth = lw
        oc.lineCap = 'round'
        oc.shadowColor = 'rgba(247, 103, 7, 0.8)'
        oc.shadowBlur = 6
        oc.beginPath()
        oc.moveTo(c.x + dp.x, c.y + dp.y)
        oc.lineTo(c.x, c.y)
        oc.lineTo(c.x + dn.x, c.y + dn.y)
        oc.stroke()
        oc.shadowBlur = 0
      })
    },
    [capturedData]
  )

  useEffect(() => {
    if (mode === 'captured' && corners) drawCapturedOverlay(corners)
  }, [mode, corners, drawCapturedOverlay])

  const clearAutoCrop = useCallback(() => {
    if (autoCropIntervalRef.current) {
      clearInterval(autoCropIntervalRef.current)
      autoCropIntervalRef.current = null
    }
    setAutoCropTimeLeft(null)
  }, [])

  const resetToCamera = useCallback(() => {
    clearAutoCrop()
    cancelAnimationFrame(rafId.current!)
    setMode('live')
    setCorners(null)
    cornersRef.current = null
    setCapturedData(null)
    setResultImage(null)
    setLiveDetected(false)
    setStatusMsg('Arahkan kamera ke dokumen')
    setStatusType('')
    startLiveDetection()
  }, [clearAutoCrop, startLiveDetection])

  const startAutoCropCountdown = useCallback(() => {
    setAutoCropTimeLeft(3)
    autoCropIntervalRef.current = setInterval(() => {
      setAutoCropTimeLeft((prev) => {
        if (prev && prev <= 1) {
          clearInterval(autoCropIntervalRef.current!)
          setTimeout(() => cropAndWarpRef.current(), 0)
          return null
        }
        return prev ? prev - 1 : null
      })
    }, 1000)
  }, [])

  const captureAndDetect = useCallback(async () => {
    if (mode === 'captured') {
      resetToCamera()
      return
    }
    const lastLiveCorners = liveCornersRef.current
    stopLiveDetection()
    cancelAnimationFrame(rafId.current!)
    clearAutoCrop()

    setShutterActive(true)
    await sleep(100)
    setShutterActive(false)

    const video = videoRef.current
    if (!video) return
    const vw = video.videoWidth || 640
    const vh = video.videoHeight || 480
    const cw = video.clientWidth || window.innerWidth
    const ch = video.clientHeight || window.innerHeight

    const scale = Math.max(cw / vw, ch / vh)
    const drawW = Math.round(cw / scale)
    const drawH = Math.round(ch / scale)
    const offsetX = (vw - drawW) / 2
    const offsetY = (vh - drawH) / 2

    const tmp = document.createElement('canvas')
    tmp.width = drawW
    tmp.height = drawH
    tmp.getContext('2d')?.drawImage(video, offsetX, offsetY, drawW, drawH, 0, 0, drawW, drawH)
    const imgData = tmp.getContext('2d')?.getImageData(0, 0, drawW, drawH)
    if (!imgData) return

    capturedWRef.current = drawW
    capturedHRef.current = drawH
    setCapturedData(imgData)
    setMode('captured')
    setIsProcessing(true)
    setProcessingLabel('Mendeteksi sudut dokumen...')
    setStatusMsg('Menganalisis tepi dokumen...')
    setStatusType('warn')
    await sleep(60)

    let initCorners: Point[]

    if (lastLiveCorners) {
      initCorners = lastLiveCorners.map((p) => ({
        x: clamp(p.x - offsetX, 0, drawW),
        y: clamp(p.y - offsetY, 0, drawH),
      }))
    } else {
      const detected = autoDetectCorners(imgData, drawW, drawH)
      initCorners = detected || defaultCorners(drawW, drawH)
    }

    setIsProcessing(false)
    cornersRef.current = initCorners
    setCorners(initCorners)

    if (lastLiveCorners) {
      setStatusMsg('✓ Dokumen terdeteksi — siap di-crop')
      setStatusType('ok')
      if (isAutoCrop) startAutoCropCountdown()
    } else {
      setStatusMsg('Deteksi otomatis gagal — sesuaikan sudut manual')
      setStatusType('warn')
    }
  }, [mode, isAutoCrop, startAutoCropCountdown, clearAutoCrop, resetToCamera, stopLiveDetection])

  useEffect(() => {
    const canvas = capturedCanvasRef.current
    if (!canvas || mode !== 'captured') return

    const toCanvas = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const W = canvas.width
      const H = canvas.height

      const scale = Math.max(r.width / W, r.height / H)
      const offsetX = (r.width - W * scale) / 2
      const offsetY = (r.height - H * scale) / 2
      return {
        x: clamp((e.clientX - r.left - offsetX) / scale, 0, W),
        y: clamp((e.clientY - r.top - offsetY) / scale, 0, H),
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      if (!cornersRef.current) return
      const pts = cornersRef.current
      const r = canvas.getBoundingClientRect()
      const W = canvas.width
      const H = canvas.height
      const scale = Math.max(r.width / W, r.height / H)
      const offsetX = (r.width - W * scale) / 2
      const offsetY = (r.height - H * scale) / 2

      const hitRadiusScreen = 44

      for (let i = 0; i < 4; i++) {
        const screenX = r.left + offsetX + pts[i].x * scale
        const screenY = r.top + offsetY + pts[i].y * scale
        const distToScreen = Math.hypot(e.clientX - screenX, e.clientY - screenY)

        if (distToScreen < hitRadiusScreen) {
          e.preventDefault()
          clearAutoCrop()
          dragging.current = i
          canvas.setPointerCapture(e.pointerId)
          return
        }
      }

      for (let i = 0; i < 4; i++) {
        const a = pts[i],
          b = pts[(i + 1) % 4]
        const mx = (a.x + b.x) / 2,
          my = (a.y + b.y) / 2
        const screenX = r.left + offsetX + mx * scale
        const screenY = r.top + offsetY + my * scale
        const distToScreen = Math.hypot(e.clientX - screenX, e.clientY - screenY)

        if (distToScreen < hitRadiusScreen) {
          e.preventDefault()
          clearAutoCrop()
          draggingEdge.current = i
          const { x, y } = toCanvas(e)
          dragEdgeStart.current = { corners: pts.map((p) => ({ ...p })), pointerX: x, pointerY: y }
          canvas.setPointerCapture(e.pointerId)
          return
        }
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!cornersRef.current) return
      e.preventDefault()
      const { x, y } = toCanvas(e)

      if (dragging.current !== null) {
        const next = [...cornersRef.current]
        next[dragging.current] = {
          x: clamp(x, 0, capturedWRef.current),
          y: clamp(y, 0, capturedHRef.current),
        }
        cornersRef.current = next
        drawCapturedOverlay(next)
        return
      }

      if (draggingEdge.current >= 0 && dragEdgeStart.current) {
        const dx = x - dragEdgeStart.current.pointerX
        const dy = y - dragEdgeStart.current.pointerY
        const i = draggingEdge.current
        const base = dragEdgeStart.current.corners
        const next = base.map((p) => ({ ...p }))
        next[i] = {
          x: clamp(base[i].x + dx, 0, capturedWRef.current),
          y: clamp(base[i].y + dy, 0, capturedHRef.current),
        }
        next[(i + 1) % 4] = {
          x: clamp(base[(i + 1) % 4].x + dx, 0, capturedWRef.current),
          y: clamp(base[(i + 1) % 4].y + dy, 0, capturedHRef.current),
        }
        cornersRef.current = next
        drawCapturedOverlay(next)
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      if (dragging.current !== null || draggingEdge.current >= 0) {
        canvas.releasePointerCapture(e.pointerId)
        dragging.current = null
        draggingEdge.current = -1
        dragEdgeStart.current = null
        if (cornersRef.current) setCorners([...cornersRef.current])
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown, { passive: false })
    canvas.addEventListener('pointermove', onPointerMove, { passive: false })
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
    }
  }, [mode, drawCapturedOverlay, clearAutoCrop])

  const [downloadTimestamp] = useState(() => Date.now())
  const downloadFilename = `scan-${downloadTimestamp}.${outputFormat === 'jpeg' ? 'jpg' : 'png'}`

  const processAndNavigate = useCallback(
    async (dataUrl: string) => {
      clearAutoCrop()
      setIsProcessing(true)
      setProcessingLabel('Mengunggah struk...')

      try {
        const file = dataURLtoFile(dataUrl, downloadFilename)
        setScannedImage(file)
        
        setStatusMsg('Mengalihkan kembali ke Chatbot...')
        setStatusType('ok')

        await sleep(500)
        
        // Coba kembali ke halaman sebelumnya
        if (window.history.length > 1) {
          navigate({ to: '..' })
        } else {
          navigate({ to: '/transactions' })
        }
        
        // Pastikan modal chatbot terbuka
        setTimeout(() => {
          openChatbotModal()
        }, 100)
      } catch (err) {
        console.error(err)
        setStatusMsg('Gagal memproses gambar.')
        setStatusType('error')
      } finally {
        setIsProcessing(false)
      }
    },
    [navigate, clearAutoCrop, downloadFilename, setScannedImage, openChatbotModal]
  )

  const cropAndWarp = useCallback(async () => {
    clearAutoCrop()
    const pts = cornersRef.current
    if (!pts || !capturedData) return
    setIsProcessing(true)
    setProcessingLabel('Meluruskan perspektif...')
    setStatusMsg('Memproses perspektif dokumen...')
    setStatusType('warn')
    await sleep(200)

    const dstW = Math.round(Math.max(dist(pts[0], pts[1]), dist(pts[3], pts[2])))
    const dstH = Math.round(Math.max(dist(pts[0], pts[3]), dist(pts[1], pts[2])))
    const dst = [
      { x: 0, y: 0 },
      { x: dstW, y: 0 },
      { x: dstW, y: dstH },
      { x: 0, y: dstH },
    ]
    const output = document.createElement('canvas')
    output.width = dstW
    output.height = dstH
    const outCtx = output.getContext('2d')
    if (!outCtx) {
      setIsProcessing(false)
      return
    }
    const outData = outCtx.createImageData(dstW, dstH)
    const srcD = capturedData.data
    const invM = getPerspectiveTransform(dst, pts)

    for (let y = 0; y < dstH; y++)
      for (let x = 0; x < dstW; x++) {
        const [sx, sy] = applyHomography(invM, [x, y])
        const bx = Math.round(sx),
          by = Math.round(sy)
        if (bx >= 0 && bx < capturedWRef.current && by >= 0 && by < capturedHRef.current) {
          const si = (by * capturedWRef.current + bx) * 4
          const di = (y * dstW + x) * 4
          outData.data[di] = srcD[si]
          outData.data[di + 1] = srcD[si + 1]
          outData.data[di + 2] = srcD[si + 2]
          outData.data[di + 3] = srcD[si + 3]
        }
      }

    outCtx.putImageData(outData, 0, 0)
    const dataUrl = output.toDataURL(
      `image/${outputFormat}`,
      outputFormat === 'jpeg' ? 0.92 : undefined
    )
    setResultImage(dataUrl)
    setMode('result')
    setStatusMsg('✓ Dokumen berhasil diproses')
    setStatusType('ok')
    setIsProcessing(false)
  }, [capturedData, outputFormat, clearAutoCrop])

  useEffect(() => {
    cropAndWarpRef.current = cropAndWarp
  }, [cropAndWarp])

  const handleUploadClick = () => fileInputRef.current?.click()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    img.onload = async () => {
      stopLiveDetection()
      cancelAnimationFrame(rafId.current!)
      clearAutoCrop()
      const w = img.width,
        h = img.height
      capturedWRef.current = w
      capturedHRef.current = h
      const tmp = document.createElement('canvas')
      tmp.width = w
      tmp.height = h
      tmp.getContext('2d')?.drawImage(img, 0, 0)
      const imgData = tmp.getContext('2d')?.getImageData(0, 0, w, h)
      if (!imgData) return
      setCapturedData(imgData)
      setMode('captured')
      setIsProcessing(true)
      setProcessingLabel('Mendeteksi sudut dokumen...')
      setStatusMsg('Menganalisis gambar...')
      setStatusType('warn')
      await sleep(100)
      const detected = autoDetectCorners(imgData, w, h)
      setIsProcessing(false)
      const initCorners = detected || defaultCorners(w, h)
      cornersRef.current = initCorners
      setCorners(initCorners)
      if (detected) {
        setStatusMsg('✓ Dokumen terdeteksi — siap di-crop')
        setStatusType('ok')
        if (isAutoCrop) startAutoCropCountdown()
      } else {
        setStatusMsg('Atur 4 sudut secara manual')
        setStatusType('warn')
      }
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
    e.target.value = ''
  }

  return (
    <div className="page d-flex flex-column scanner-page-container">
      <div className="scanner-top-bar">
        <div className="d-flex align-items-center w-100 gap-3">
          <Button
            element="button"
            onClick={() => window.history.back()}
            className="p-0 text-body border-0 shadow-none bg-transparent"
            icon="arrow-left"
            size="md"
            iconOnly
          />

          <h2 className="mb-0 fw-bold h3 text-body">
            {mode === 'live' ? 'Scan' : mode === 'captured' ? 'Sesuaikan' : 'Hasil'}
          </h2>

          <div className="ms-auto d-flex gap-2">
            {mode === 'live' && (
              <>
                <div className="dropdown">
                  <Button
                    element="button"
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    white
                    roundedCircle
                    icon="settings"
                    size="md"
                    iconOnly
                  />
                  <div
                    className={`dropdown-menu dropdown-menu-end shadow-sm scanner-dropdown-menu ${isSettingsOpen ? 'show' : ''}`}
                  >
                    <div className="dropdown-header">PENGATURAN</div>
                    <label className="dropdown-item d-flex align-items-center">
                      <span className="me-2">Auto crop</span>
                      <div className="form-check form-switch ms-auto m-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={isAutoCrop}
                          onChange={(e) => {
                            setIsAutoCrop(e.target.checked)
                            setIsSettingsOpen(false)
                          }}
                        />
                      </div>
                    </label>
                    <label className="dropdown-item d-flex align-items-center">
                      <span className="me-2">Kamera</span>
                      <div className="ms-auto scanner-select-col">
                        <select
                          className="form-select form-select-sm"
                          value={cameraFacing}
                          onChange={(e) => {
                            setCameraFacing(e.target.value as 'environment' | 'user')
                            setIsSettingsOpen(false)
                          }}
                        >
                          <option value="environment">Belakang</option>
                          <option value="user">Depan</option>
                        </select>
                      </div>
                    </label>
                    <label className="dropdown-item d-flex align-items-center">
                      <span className="me-2">Format Output</span>
                      <div className="ms-auto scanner-select-col">
                        <select
                          className="form-select form-select-sm"
                          value={outputFormat}
                          onChange={(e) => {
                            setOutputFormat(e.target.value as 'png' | 'jpeg')
                            setIsSettingsOpen(false)
                          }}
                        >
                          <option value="jpeg">JPEG</option>
                          <option value="png">PNG</option>
                        </select>
                      </div>
                    </label>
                  </div>
                </div>
                <Button
                  element="button"
                  onClick={handleUploadClick}
                  white
                  roundedCircle
                  icon="photo-plus"
                  size="md"
                  iconOnly
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="d-none"
                  onChange={handleFileUpload}
                />
                <Button
                  element="button"
                  onClick={() => setIsFlash(!isFlash)}
                  white
                  roundedCircle
                  icon={isFlash ? 'bolt' : 'bolt-off'}
                  size="md"
                  iconOnly
                />
              </>
            )}
          </div>
        </div>
      </div>

      {autoCropTimeLeft !== null && (
        <div className="progress progress-xs scanner-progress-bar-container">
          <div
            className="progress-bar bg-orange"
            style={{
              width: `${(autoCropTimeLeft / 3) * 100}%`,
              transition: 'width 1s linear',
            }}
          />
        </div>
      )}

      <div className="scanner-viewport">
        <div ref={wrapperRef} className="w-100 h-100 position-relative">
          {shutterActive && (
            <div className="position-absolute top-0 start-0 w-100 h-100 scanner-shutter-overlay" />
          )}

          {isProcessing && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-3 scanner-processing-overlay">
              <div className="spinner-border text-primary" role="status" />
              <div className="text-white small fw-bold">{processingLabel}</div>
            </div>
          )}

          {mode === 'live' && (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="scanner-video-layer" />
              <canvas ref={liveOverlayRef} className="scanner-canvas-overlay" />
            </>
          )}

          {mode === 'captured' && capturedData && (
            <canvas ref={capturedCanvasRef} className="scanner-captured-canvas" />
          )}

          {mode === 'result' && resultImage && (
            <div className="scanner-result-overlay">
              <img src={resultImage} alt="Scanned Result" className="scanner-result-img" />
            </div>
          )}
        </div>
      </div>

      <div className="w-100 scanner-bottom-bar d-flex flex-column gap-3 px-3">
        <div className="mb-0">
          {mode === 'live' && liveDetected && (
            <div className="text-center mb-2">
              <Badge color="success" pill>
                ✓ Dokumen Terdeteksi
              </Badge>
            </div>
          )}
          <ScannerStatusAlert
            statusType={statusType}
            statusMsg={statusMsg}
            autoCropTimeLeft={autoCropTimeLeft}
          />
        </div>

        <div className="row g-2">
          {mode === 'live' && (
            <div className="col-12">
              <Button
                element="button"
                onClick={captureAndDetect}
                color="primary"
                block
                className="fw-bold d-flex align-items-center justify-content-center"
                icon="camera"
                size="lg"
              >
                Ambil Foto
              </Button>
            </div>
          )}

          {mode === 'captured' && (
            <>
              <div className="col-6">
                <Button
                  element="button"
                  onClick={resetToCamera}
                  block
                  className="fw-bold"
                  size="lg"
                >
                  Ulangi
                </Button>
              </div>
              <div className="col-6">
                <Button
                  element="button"
                  onClick={cropAndWarp}
                  color="primary"
                  block
                  className="fw-bold d-flex align-items-center justify-content-center"
                  size="lg"
                  icon="check"
                >
                  Lanjut
                </Button>
              </div>
            </>
          )}

          {mode === 'result' && resultImage && (
            <>
              <div className="col-6">
                <Button
                  element="button"
                  onClick={() => processAndNavigate(resultImage)}
                  color="primary"
                  block
                  className="fw-bold d-flex align-items-center justify-content-center"
                  icon="check"
                  size="lg"
                >
                  Gunakan
                </Button>
              </div>
              <div className="col-3">
                <Button
                  element="a"
                  href={resultImage}
                  download={downloadFilename}
                  block
                  className="fw-bold px-0"
                  size="lg"
                  icon="download"
                  iconOnly
                />
              </div>
              <div className="col-3">
                <Button
                  element="button"
                  onClick={resetToCamera}
                  block
                  className="fw-bold px-0"
                  size="lg"
                  icon="refresh"
                  iconOnly
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
