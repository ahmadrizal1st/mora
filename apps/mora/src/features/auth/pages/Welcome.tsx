import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/shared/components/ui/Button'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="page page-center bg-white d-flex flex-column" style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>

      {/* Premium Background: Blue top fading into white bottom */}
      <div className="welcome-bg-premium">
        <div className="welcome-blob blob-top"></div>
        <div className="welcome-blob blob-center"></div>
        <div className="welcome-blob blob-top-left"></div>

        {/* Premium Dot Texture/Pattern */}
        <div className="welcome-pattern"></div>
      </div>

      {/* Content Area */}
      <div className="container-tight d-flex flex-column align-items-center justify-content-between py-6 px-4 welcome-page-content" style={{ position: 'relative', zIndex: 2, flex: 1 }}>

        {/* Top: Logo & Branding */}
        <div className="text-center mt-6">
          <div className="mb-4">
            <img
              src="/logo/mora-nobg.png"
              style={{
                height: '110px',
                width: 'auto',
                filter: 'brightness(0) invert(1) drop-shadow(0 15px 25px rgba(0,0,0,0.15))'
              }}
              alt="Mora Finance"
            />
          </div>
          <h1 className="display-3 fw-bolder text-white mb-0" style={{ letterSpacing: '-0.06em', textShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            Mora Finance
          </h1>
        </div>

        {/* Bottom: Tagline & Buttons */}
        <div className="w-100 text-center mb-4">
          <p className="text-dark fs-3 mb-5 fw-bold px-2" style={{ maxWidth: '340px', margin: '0 auto', opacity: 0.9 }}>
            Your Intelligent AI Assistant for Modern Financial Success.
          </p>

          <div className="d-grid gap-3">
            <Button 
              text="Sign In"
              color="primary"
              block
              className="fw-bold"
              onClick={() => navigate('/sign-in')}
              element="button"
            />
            
            <Button 
              text="Create Account"
              outline
              block
              className="text-dark"
              onClick={() => navigate('/sign-up')}
              element="button"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
