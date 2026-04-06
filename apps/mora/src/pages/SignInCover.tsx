// src/pages/SignInCover.tsx
import { NavbarLogo } from '../components/layout/NavbarLogo';
import { SignInForm } from '../components/forms/SignInForm';
import { Photo } from '../components/ui/Photo';

export default function SignInCover() {
  return (
    <div className="page page-center bg-white" style={{ minHeight: '100vh' }}>
      <div className="row g-0 flex-fill">
        <div className="col-12 col-lg-6 col-xl-4 border-top-wide border-primary d-flex flex-column justify-content-center">
          <div className="container container-tight my-5 px-lg-5">
            <div className="text-center mb-4">
              <NavbarLogo />
            </div>
            <h2 className="h3 text-center mb-3">Login to your account</h2>

            <SignInForm />

            <div className="text-center text-secondary mt-3">
              Don't have account yet? <a href="/sign-up" tabIndex={-1}>Sign up</a>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 col-xl-8 d-none d-lg-block">
          <Photo
            id={11}
            background={true}
            className="bg-cover h-100 min-vh-100"
          />
        </div>
      </div>
    </div>
  );
}
