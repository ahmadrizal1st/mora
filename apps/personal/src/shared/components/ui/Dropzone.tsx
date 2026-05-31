import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import 'dropzone/dist/dropzone.css'

export interface DropzoneProps {
  id?: string
  action?: string
  multiple?: boolean
  text?: string
  description?: string
  custom?: boolean
  className?: string
  acceptedFiles?: string
  onAddedFile?: (file: File) => void
  disabled?: boolean
}

export function Dropzone({
  id,
  action = 'https://httpbin.org/post',
  multiple = false,
  text = 'Drop files here or click to upload',
  description = '(This is just a demo dropzone. Selected files are **not** actually uploaded.)',
  custom = false,
  className,
  acceptedFiles,
  onAddedFile,
  disabled,
}: DropzoneProps) {
  const dropzoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropzoneRef.current) return

    let active = true

    let dz: any = null

    import('dropzone').then(({ default: DropzoneLib }) => {
      if (!active || !dropzoneRef.current) return

      DropzoneLib.autoDiscover = false

      dz = new DropzoneLib(dropzoneRef.current, {
        url: action,
        uploadMultiple: multiple,
        acceptedFiles: acceptedFiles,
        dictDefaultMessage: custom ? '' : text,
        autoProcessQueue: false,
        clickable: !disabled,
        init: function () {
          this.on('addedfile', (file: any) => {
            if (onAddedFile) onAddedFile(file)

            setTimeout(() => {
              this.emit('uploadprogress', file, 100, 1024)
              this.emit('success', file, 'Success', null)
              this.emit('complete', file)
            }, 500)
          })

          this.on('error', (file: any, message: string) => {
            console.error('Dropzone Error:', message)

            if (message.includes("You can't upload files of this type")) {
              setTimeout(() => this.removeFile(file), 2000)
            }
          })
        },
      })
    })

    return () => {
      active = false
      if (dz) {
        dz.destroy()
      }
    }
  }, [action, multiple, custom, text, acceptedFiles, disabled])

  return (
    <div ref={dropzoneRef} id={id} className={clsx('dropzone', 'dz-clickable', className)}>
      <div className="dz-default dz-message">
        {custom ? (
          <div>
            <h3 className="mb-3">{text}</h3>
            <p className="text-secondary">{description}</p>
          </div>
        ) : (
          <button className="dz-button" type="button">
            {text}
          </button>
        )}
      </div>
    </div>
  )
}
