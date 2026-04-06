// src/pages/Steps.tsx
import BaseLayout from '../layouts/BaseLayout';

export default function Steps() {
  return (
    <BaseLayout pageTitle="Steps">
      <div className="row row-cards">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Steps horizontal</h3>
              <ul className="steps steps-green my-4">
                <li className="step-item">1</li>
                <li className="step-item active">2</li>
                <li className="step-item">3</li>
              </ul>
            </div>
            <div className="card-body">
              <ul className="steps steps-green steps-counter my-4">
                <li className="step-item"></li>
                <li className="step-item active"></li>
                <li className="step-item"></li>
              </ul>
            </div>
            <div className="card-body">
              <ul className="steps steps-green steps-counter my-4">
                <li className="step-item">Cart</li>
                <li className="step-item active">Billing Information</li>
                <li className="step-item">Confirmation</li>
              </ul>
            </div>
            <div className="card-body">
              <ol className="breadcrumb breadcrumb-arrows">
                <li className="breadcrumb-item"><a href="#">Step one</a></li>
                <li className="breadcrumb-item active"><a href="#">Step two</a></li>
                <li className="breadcrumb-item disabled"><a href="#">Step three</a></li>
                <li className="breadcrumb-item disabled"><a href="#">Step four</a></li>
              </ol>
            </div>
            <div className="card-body">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="#">1. Step one</a></li>
                <li className="breadcrumb-item"><a href="#">2. Step two</a></li>
                <li className="breadcrumb-item active"><a href="#">3. Step three</a></li>
                <li className="breadcrumb-item disabled"><a href="#">4. Step four</a></li>
                <li className="breadcrumb-item disabled"><a href="#">5. Step five</a></li>
              </ol>
            </div>
            <div className="card-body">
              <ol className="breadcrumb breadcrumb-muted">
                <li className="breadcrumb-item"><a href="#">1. Step one</a></li>
                <li className="breadcrumb-item"><a href="#">2. Step two</a></li>
                <li className="breadcrumb-item active"><a href="#">3. Step three</a></li>
                <li className="breadcrumb-item disabled"><a href="#">4. Step four</a></li>
                <li className="breadcrumb-item disabled"><a href="#">5. Step five</a></li>
              </ol>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Steps vertical</h3>
              <ul className="steps steps-vertical">
                <li className="step-item">
                  <div className="h4 m-0">Order received</div>
                  <div className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
                </li>
                <li className="step-item">
                  <div className="h4 m-0">Order received</div>
                  <div className="text-secondary">Lorem ipsum dolor sit amet.</div>
                </li>
                <li className="step-item active">
                  <div className="h4 m-0">Out for delivery</div>
                  <div className="text-secondary">Lorem ipsum dolor sit amet.</div>
                </li>
                <li className="step-item">
                  <div className="h4 m-0">Finalized</div>
                  <div className="text-secondary">Lorem ipsum dolor sit amet.</div>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <ul className="steps steps-counter steps-vertical">
                <li className="step-item">Step one</li>
                <li className="step-item">Step two</li>
                <li className="step-item active">Step three</li>
                <li className="step-item">Step four</li>
                <li className="step-item">Step five</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
