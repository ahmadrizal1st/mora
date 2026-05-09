import { Button } from '@/shared/components/ui/Button'

export default function Welcome() {
  return (
    <div className="page page-center bg-white d-flex flex-column" style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
      <div className="welcome-bg-premium">
        <div className="welcome-blob blob-top"></div>
        <div className="welcome-blob blob-center"></div>
        <div className="welcome-blob blob-top-left"></div>
        <div className="welcome-pattern"></div>
      </div>

      <div className="container-tight d-flex flex-column align-items-center justify-content-between py-6 px-4 welcome-page-content" style={{ position: 'relative', zIndex: 2, flex: 1 }}>
        <div className="text-center mt-6">
          <div className="mb-3 d-flex flex-column align-items-center">
            <div 
              style={{
                height: '80px',
                width: '120px',
                backgroundColor: 'white',
                WebkitMaskImage: 'url("/logo/logo-nobg-fill.png")',
                maskImage: 'url("/logo/logo-nobg-fill.png")',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
              }}
            />
            <div 
              className="mb-0 text-white brand-text-welcome" 
              style={{ 
                fontFamily: "'Slackey', cursive",
                fontSize: '2.5rem',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                marginTop: '-20px',
                textShadow: '0 10px 40px rgba(0,0,0,0.2)',
                position: 'relative',
                zIndex: 10
              }}
            >
              mora
            </div>
          </div>
        </div>

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
              to="/sign-in"
            />
            
            <Button 
              text="Create Account"
              outline
              block
              className="text-dark"
              to="/sign-up"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
