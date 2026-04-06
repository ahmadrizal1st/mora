import SingleLayout from '../layouts/SingleLayout'
import { Icon } from '../components/ui/Icon'
import { Button } from '../components/ui/Button'

export default function TrialEndedPage() {
  return (
    <SingleLayout>
      <div className="card card-md">
        <div className="card-body">
          <h2 className="mb-3">Your free trial period has expired!</h2>

          <p className="text-secondary mb-4">
            If you want to continue to benefit from Tabler, it's time to upgrade your
            plan.
          </p>

          <ul className="list-unstyled space-y">
            <li className="row g-2">
              <span className="col-auto">
                <Icon icon="check" className="me-1 text-success" />
              </span>
              <span className="col">
                <strong className="d-block">Over 800+ productions</strong>
                <span className="d-block text-secondary">
                  Unlimited movies, TV shows and more.
                </span>
              </span>
            </li>
            <li className="row g-2">
              <span className="col-auto">
                <Icon icon="check" className="me-1 text-success" />
              </span>
              <span className="col">
                <strong className="d-block">Watch everywhere</strong>
                <span className="d-block text-secondary">
                  Watch on smart TVs, PlayStation, Xbox, Apple TV, Blu-ray players and
                  more.
                </span>
              </span>
            </li>
            <li className="row g-2">
              <span className="col-auto">
                <Icon icon="check" className="me-1 text-success" />
              </span>
              <span className="col">
                <strong className="d-block">Personalize</strong>
                <span className="d-block text-secondary">
                  Choose your own style, watch what you like.
                </span>
              </span>
            </li>
          </ul>

          <div className="my-4">
            <Button color="primary" className="w-100" href="#">
              Upgrade to a paid plan
            </Button>
          </div>

          <p className="text-secondary">
            If you need to get a trial extension please feel free to <a href="#">contact us</a>
            .
          </p>
        </div>
      </div>
    </SingleLayout>
  )
}
