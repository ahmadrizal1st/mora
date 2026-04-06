// src/pages/OffcanvasPage.tsx
import DefaultLayout from '../layouts/DefaultLayout'

const directions = ['start', 'end', 'top', 'bottom']

export default function OffcanvasPage() {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <DefaultLayout pageTitle="Offcanvas">
      <div className="card">
        <div className="card-body">
          <div className="btn-list">
            {directions.map((direction) => (
              <a
                key={direction}
                className="btn"
                data-bs-toggle="offcanvas"
                href={`#offcanvas${capitalize(direction)}`}
                role="button"
                aria-controls={`offcanvas${capitalize(direction)}`}
              >
                Toggle {direction} offcanvas
              </a>
            ))}
          </div>
        </div>
      </div>

      {directions.map((direction) => (
        <div
          key={direction}
          className={`offcanvas offcanvas-${direction}`}
          tabIndex={-1}
          id={`offcanvas${capitalize(direction)}`}
          aria-labelledby={`offcanvas${capitalize(direction)}Label`}
        >
          <div className="offcanvas-header">
            <h2 className="offcanvas-title" id={`offcanvas${capitalize(direction)}Label`}>
              {capitalize(direction)} offcanvas
            </h2>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab assumenda ea est, eum exercitationem fugiat
              illum itaque laboriosam magni necessitatibus, nemo nisi numquam quae reiciendis repellat sit soluta unde.
              Aut!
            </div>
            <div className="mt-3">
              <button className="btn btn-primary" type="button" data-bs-dismiss="offcanvas">
                Close offcanvas
              </button>
            </div>
          </div>
        </div>
      ))}
    </DefaultLayout>
  )
}
