// src/pages/SignInLink.tsx
import SingleLayout from '../layouts/SingleLayout';
import siteConfig from '../data/site.json';

export default function SignInLink() {
  return (
    <SingleLayout>
      <div className="text-center">
        <div className="my-5">
          <h2 className="h1">Check your inbox</h2>
          <p className="fs-h3 text-secondary">
            We've sent you a magic link to <strong>{siteConfig.email}</strong>.<br />
            Please click the link to confirm your address.
          </p>
        </div>
        <div className="text-center text-secondary mt-3">
          Can't see the email? Please check the spam folder.<br />
          Wrong email? Please <a href="#">re-enter your address</a>.
        </div>
      </div>
    </SingleLayout>
  );
}
