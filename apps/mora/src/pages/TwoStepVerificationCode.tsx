// src/pages/TwoStepVerificationCode.tsx
import { useRef } from 'react';
import SingleLayout from '../layouts/SingleLayout';

export default function TwoStepVerificationCode() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (index: number, e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (input.value.length === input.maxLength && index + 1 < inputRefs.current.length) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length === 0 && e.key === 'Backspace' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };


  return (
    <SingleLayout>
      <form
        className="card card-md"
        action="/"
        method="get"
        autoComplete="off"
        noValidate
      >
        <div className="card-body">
          <h2 className="card-title card-title-lg text-center mb-4">Authenticate Your Account</h2>

          <p className="my-4 text-center">
            Please confirm your account by entering the authorization code sent to{' '}
            <strong>+1 856-672-8552</strong>.
          </p>

          <div className="my-5">
            <div className="row g-4">
              {[0, 1].map((group) => (
                <div key={group} className="col">
                  <div className="row g-2">
                    {[0, 1, 2].map((i) => {
                      const idx = group * 3 + i;
                      return (
                        <div key={i} className="col">
                          <input
                            ref={(el) => { if (el) inputRefs.current[idx] = el }}
                            type="text"
                            className="form-control form-control-lg text-center px-3 py-3"
                            maxLength={1}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            onInput={(e) => handleInput(idx, e)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="my-4">
            <label className="form-check">
              <input type="checkbox" className="form-check-input" />
              Don't ask for codes again on this device
            </label>
          </div>

          <div className="form-footer">
            <div className="btn-list flex-nowrap">
              <a href="/2-step-verification" className="btn w-100">Cancel</a>
              <button type="submit" className="btn btn-primary w-100">Verify</button>
            </div>
          </div>
        </div>
      </form>

      <div className="text-center text-secondary mt-3">
        It may take a minute to receive your code. Haven't received it?{' '}
        <a href="/">Resend a new code.</a>
      </div>
    </SingleLayout>
  );
}
