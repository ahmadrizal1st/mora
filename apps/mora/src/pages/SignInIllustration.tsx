// src/pages/SignInIllustration.tsx
import SingleLayout from '../layouts/SingleLayout';
import { NavbarLogo } from '../components/layout/NavbarLogo';
import { SignInCard } from '../components/cards';
import { Illustration } from '../components/ui/Illustration';

export default function SignInIllustration() {
  return (
    <SingleLayout containerSize="lg" hideLogo>
      <div className="row align-items-center g-4">
        <div className="col-lg">
          <div className="container-tight">
            <div className="text-center mb-4">
              <NavbarLogo />
            </div>
            <SignInCard showHeader={true} />
          </div>
        </div>
        <div className="col-lg d-none d-lg-block">
          <Illustration
            image="boy-with-key.svg"
            className="d-block mx-auto"
            height={400}
            alt="Sign in illustration"
          />
        </div>
      </div>
    </SingleLayout>
  );
}
