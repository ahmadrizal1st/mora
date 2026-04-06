import BaseLayout from '../layouts/BaseLayout'

export default function TextFeaturesPage() {
  return (
    <BaseLayout pageTitle="Text features">
      <div className="row">
        <div className="col-7">
          <div className="card card-lg">
            <div className="card-body">
              <div className="prose">
                <h3>Text features</h3>

                <p>
                  HTML provides various tags to format text and add meaning. For
                  example, <strong>important words</strong> can be highlighted, and{' '}
                  <em>emphasized text</em> can be italicized.
                </p>

                <p>
                  If you want to visit an interesting website, check out{' '}
                  <a href="#" target="_blank">
                    this page
                  </a>
                  .
                </p>

                <p>
                  The term{' '}
                  <abbr
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Hypertext Markup Language"
                  >
                    HTML
                  </abbr>{' '}
                  is widely used in web development.
                </p>

                <p>
                  Previously, the instruction said <del>"Do not include images."</del>{' '}
                  However, <ins>"You may now add images."</ins>
                </p>

                <blockquote cite="#">
                  "The best way to predict the future is to create it." – Peter Drucker
                </blockquote>

                <p>
                  Sometimes, <mark>highlighting important text</mark> can improve
                  readability.
                </p>

                <p>
                  In JavaScript, you can log messages using the following code:{' '}
                  <code>console.log('Hello, world!');</code>
                </p>

                <p>
                  To copy text on Windows, use <kbd>Ctrl + C</kbd>. On macOS, use{' '}
                  <kbd>Cmd + C</kbd>.
                </p>

                <p>
                  Water is written chemically as H<sub>2</sub>O, while Einstein’s famous
                  equation is E = mc<sup>2</sup>.
                </p>

                <p>
                  Many people mistakenly spell <span className="text-incorrect">"recieve"</span>{' '}
                  instead of <span className="text-correct">"receive"</span>.
                </p>

                <p>
                  The correct way to write the date format is{' '}
                  <span className="text-correct">"February 12, 2026"</span>, not{' '}
                  <span className="text-incorrect">"12th February, 2026"</span> in
                  American English.
                </p>

                <p>
                  If you need select text, you can use your mouse or keyboard. To select
                  text using your mouse, click and drag the cursor over the text{' '}
                  <span className="text-selected">you want to highlight</span>.
                </p>

                <p>
                  <small>Disclaimer: This text is for demonstration purposes only.</small>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-lg">
            <div className="card-body">
              <div className="prose">
                {[1, 2, 3, 4, 5, 6].map((i) => {
                  const content = (
                    <>
                      Heading {i} by{' '}
                      <a className="mention" href="#">
                        <span
                          className="mention-avatar"
                          style={{ backgroundImage: 'url(/static/avatars/035f.jpg)' }}
                        ></span>
                        <span className="visually-hidden">@</span>JohnDoe
                      </a>
                    </>
                  )

                  switch (i) {
                    case 1:
                      return <h1 key={i}>{content}</h1>
                    case 2:
                      return <h2 key={i}>{content}</h2>
                    case 3:
                      return <h3 key={i}>{content}</h3>
                    case 4:
                      return <h4 key={i}>{content}</h4>
                    case 5:
                      return <h5 key={i}>{content}</h5>
                    default:
                      return <h6 key={i}>{content}</h6>
                  }
                })}

                <p>
                  Tabler is a modern UI framework which{' '}
                  <span
                    className="text-incorrect"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Tooltip on top"
                  >
                    provide
                  </span>{' '}
                  developers with a lot of{' '}
                  <span className="text-incorrect">pre-build</span> components and
                  customizable options. It is{' '}
                  <span className="text-incorrect">build</span> on Bootstrap, making it
                  easy to integrate into existing projects. The design is clean, responsive,
                  and accessible, ensuring that{' '}
                  <span className="text-incorrect">user</span> can navigate through{' '}
                  <span className="text-incorrect">interface</span> easily. Tabler also{' '}
                  <span className="text-incorrect">support</span> all modern browsers, but
                  some features may not work properly on Internet Explorer. With{' '}
                  <span className="text-incorrect">it's</span> lightweight structure and
                  optimized performance, Tabler helps developers create stunning web
                  applications faster.
                </p>

                <p>
                  Hey{' '}
                  <a className="mention" href="#">
                    <span
                      className="mention-avatar"
                      style={{ backgroundImage: 'url(/static/avatars/035f.jpg)' }}
                    ></span>
                    <span className="visually-hidden">@</span>JohnDoe
                  </a>
                  , have you seen the latest updates on{' '}
                  <a className="mention" href="#">
                    #WebDevelopment<span className="mention-count">16</span>
                  </a>
                  ?{' '}
                  <a className="mention" href="#">
                    <span
                      className="mention-avatar"
                      style={{ backgroundImage: 'url(/static/avatars/035f.jpg)' }}
                    ></span>
                    <span className="visually-hidden">@</span>JaneSmith
                  </a>{' '}
                  just shared an interesting article about{' '}
                  <a className="mention" href="#">
                    <span
                      className="mention-app"
                      style={{ backgroundImage: 'url(/static/brands/messenger.svg)' }}
                    ></span>
                    Messenger
                  </a>{' '}
                  and{' '}
                  <a className="mention" href="#">
                    <span
                      className="mention-app"
                      style={{ backgroundImage: 'url(/static/brands/netflix.svg)' }}
                    ></span>
                    Netflix
                  </a>
                  !
                </p>

                <p>
                  The sky is{' '}
                  <span className="mention">
                    <span className="mention-color bg-blue"></span>#066fd1
                  </span>
                  , the grass is{' '}
                  <span className="mention">
                    <span className="mention-color bg-green"></span>rgb(47, 179, 68)
                  </span>
                  , fire trucks are often{' '}
                  <span className="mention">
                    <span className="mention-color bg-red"></span>red
                  </span>
                  , oranges are{' '}
                  <span className="mention">
                    <span className="mention-color bg-orange"></span>hsl(24deg, 94.49%,
                    49.8%)
                  </span>
                  . Some flowers are{' '}
                  <span className="mention">
                    <span className="mention-color bg-purple"></span>hwb(288.35deg, 24.31%,
                    21.18%)
                  </span>
                  .
                </p>

                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
