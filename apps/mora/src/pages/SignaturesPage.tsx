import { useEffect, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import BaseLayout from '../layouts/BaseLayout'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'

function SignaturePadWrapper({ sigRef, penColor = '#000' }: { sigRef: React.RefObject<SignatureCanvas | null>, penColor?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 500, height: 200 })

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth
        setSize({ width: newWidth, height: 200 })
      }
    }
    
    // Initial size
    updateSize()
    
    // Resize on window changes
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <div ref={containerRef} style={{ border: '1px solid #e6e8eb', borderRadius: '4px', backgroundColor: '#fcfdfe', width: '100%', height: '200px' }}>
      <SignatureCanvas
        ref={sigRef}
        penColor={penColor}
        canvasProps={{
          width: size.width,
          height: size.height,
          className: 'signature-pad-canvas',
          style: { cursor: 'crosshair', width: size.width, height: size.height }
        }}
      />
    </div>
  )
}

export default function SignaturesPage() {
  const simpleSigRef = useRef<SignatureCanvas>(null)
  const advancedSigRef = useRef<SignatureCanvas>(null)
  const modalSigRef = useRef<SignatureCanvas>(null)

  const [penColor, setPenColor] = useState('#000000')

  const clearSignature = (ref: React.RefObject<SignatureCanvas | null>) => {
    ref.current?.clear()
  }

  const downloadSVG = () => {
    if (!advancedSigRef.current || advancedSigRef.current.isEmpty()) return
    const dataURL = advancedSigRef.current.toDataURL('image/svg+xml')
    download(dataURL, 'signature.svg')
  }

  const downloadPNG = () => {
    if (!advancedSigRef.current || advancedSigRef.current.isEmpty()) return
    const dataURL = advancedSigRef.current.toDataURL('image/png')
    download(dataURL, 'signature.png')
  }

  const download = (dataURL: string, filename: string) => {
    const a = document.createElement('a')
    a.href = dataURL
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <BaseLayout pageTitle="Signatures">
      <div className="row row-cards">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Confirm transfer</h3>
              <p className="card-subtitle">Please confirm the transfer of funds by signing below.</p>
              <form action="">
                <div className="mb-3">
                  <label className="form-label required" htmlFor="signature-first-name">First name</label>
                  <input type="text" className="form-control" id="signature-first-name" name="first_name" />
                </div>
                <div className="mb-3">
                  <label className="form-label required" htmlFor="signature-last-name">Last name</label>
                  <input type="text" className="form-control" id="signature-last-name" name="last_name" />
                </div>
                <div className="mb-3">
                  <label className="form-label required">Signature</label>
                  <div className="position-relative">
                    <SignaturePadWrapper sigRef={simpleSigRef} />
                    <button
                      type="button"
                      className="btn btn-icon position-absolute top-0 end-0 m-2"
                      onClick={() => clearSignature(simpleSigRef)}
                    >
                      <Icon icon="trash" />
                    </button>
                  </div>
                </div>
              </form>
              <div className="text-secondary fs-5">
                I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use
                them on documents, including legally binding contracts - just the same as a pen-and-paper signature or initial.
              </div>

              <div className="mt-4">
                <div className="btn-list">
                  <Button>Cancel</Button>
                  <Button color="primary" className="ms-auto">Confirm transfer</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="row row-cards">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Advanced demo</h3>
                  
                  <div className="position-relative">
                    <SignaturePadWrapper sigRef={advancedSigRef} penColor={penColor} />
                    <button
                      type="button"
                      className="btn btn-icon position-absolute top-0 end-0 m-2"
                      onClick={() => clearSignature(advancedSigRef)}
                    >
                      <Icon icon="trash" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="row">
                      <div className="col">
                        <label htmlFor="signature-advanced-color" className="form-label visually-hidden">Pen color</label>
                        <input
                          type="color"
                          id="signature-advanced-color"
                          className="w-100 form-control form-control-color"
                          value={penColor}
                          onChange={(e) => setPenColor(e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <Button className="w-100" onClick={downloadSVG}>Download SVG</Button>
                      </div>
                      <div className="col">
                        <Button className="w-100" onClick={downloadPNG}>Download PNG</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <Button data-bs-toggle="modal" data-bs-target="#modal-signature">Open signature modal</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" tabIndex={-1} id="modal-signature">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="modal-title mb-3">Save your signature</h5>
              <div className="position-relative">
                <SignaturePadWrapper sigRef={modalSigRef} />
                <button
                  type="button"
                  className="btn btn-icon position-absolute top-0 end-0 m-2"
                  onClick={() => clearSignature(modalSigRef)}
                >
                  <Icon icon="trash" />
                </button>
              </div>

              <div className="text-secondary fs-5 mt-4">
                I agree that the signature and initials will be the electronic representation of my signature and initials for all
                purposes when I (or my agent) use
                them on documents, including legally binding contracts - just the same as a pen-and-paper signature or initial.
              </div>
            </div>
            <div className="modal-footer">
              <Button data-bs-dismiss="modal">Close</Button>
              <Button color="primary" className="ms-auto" data-bs-dismiss="modal">Save my signature</Button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
