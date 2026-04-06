import { useNavigate, Link } from 'react-router-dom'
import welcomeImg from '../assets/illustrations/welcome.png'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="page page-center bg-white" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem 0' }}>
      <div className="container-tight">
        <div className="text-center mb-5">
           <div className="d-flex align-items-center justify-content-center mb-2">
             <img src="/logo/mora-nobg.png" style={{ height: '40px', width: 'auto' }} alt="Mora" />
             <h1 className="h1 text-primary fw-bolder mb-0 ms-2" style={{ letterSpacing: '-0.5px' }}>Mora</h1>
           </div>
        </div>
        
        <div className="text-center px-4 mb-5">
          <div className="mb-5 animate__animated animate__fadeIn" style={{ animationDuration: '1s' }}>
            <img 
              src={welcomeImg} 
              alt="Welcome" 
              className="img-fluid" 
              style={{ 
                maxHeight: '340px', 
                width: 'auto', 
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.12))' 
              }} 
            />
          </div>
          
          <h2 className="display-5 fw-bold mb-3" style={{ letterSpacing: '-1px' }}>
            Welcome To The Ultimate <span className="text-primary">Mora</span>
          </h2>
          <p className="text-secondary fs-3 mb-0 px-md-5 leading-relaxed">
            Empower Your Business Relationships and Financial Success with Intelligence.
          </p>
        </div>
      </div>

      <div className="container-tight px-4 w-100">
        <div className="d-grid gap-3 mb-4">
          <button 
            type="button"
            className="btn btn-primary btn-lg py-3 rounded-pill fs-2 fw-bold shadow-lg"
            style={{ 
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 8px 25px rgba(var(--tblr-primary-rgb), 0.3)'
            }}
            onClick={() => navigate('/sign-up')}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Get Started
          </button>
        </div>
        
        <div className="text-center text-secondary fs-4">
          Already have an account? <Link to="/sign-in" className="fw-bold text-primary text-decoration-none">Sign In</Link>
        </div>
      </div>
    </div>
  )
}
