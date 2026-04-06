import BaseLayout from '../layouts/BaseLayout'
import { Icon } from '../components/ui/Icon'

export default function License() {
  return (
    <BaseLayout pageTitle="Tabler License">
      <div className="container-xl">
        <div className="row row-cards">
          <div className="col-lg-8">
            <div className="card card-lg">
              <div className="card-body">
                <div className="prose">
                  <p>
                    This is a legal agreement between you, the Purchaser, and Tabler. Purchasing or downloading of any Tabler product (Tabler Free, Tabler PRO, Tabler Email), constitutes your acceptance of the terms of this license, <a href="https://tabler.io/terms-of-service.html">Tabler terms of service</a> and <a href="https://tabler.io/privacy-policy.html">Tabler private policy</a>.
                  </p>
                  <p>
                    A license grants you a non-exclusive and non-transferable right to use and incorporate the item in your personal or commercial projects.
                  </p>
                  
                  <h3>Tabler Free License</h3>
                  <p>Tabler Free is available under MIT License</p>
                  <p>Copyright {new Date().getFullYear()} Tabler</p>
                  <p>
                    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
                  </p>
                  <p>
                    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
                  </p>
                  <p>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                  </p>

                  <h3>Tabler PRO and Tabler Email License</h3>
                  <p>After Purchasing you are granted the use products under the conditions featured belowed.</p>
                  
                  <h4>Rights</h4>
                  <ol>
                    <li>You have rights to use our resources for any or all of your personal and commercial projects.</li>
                    <li>You may modify the resources according to your requirements.</li>
                    <li>You are not required to attribute or link to Tabler in any of your projects.</li>
                  </ol>

                  <h4>Restrictions</h4>
                  <ol>
                    <li>You do not have the rights to redistribute, resell, lease, license, sub-license or offer the file downloaded to any third party.</li>
                    <li>For any resalable web applications or software programs, you cannot include our graphic resources as an additional attachment.</li>
                    <li>You cannot redistribute any of the software, or products created with Tabler paid products.</li>
                    <li>You cannot add our source code to any open source repository.</li>
                    <li>The source code may not be placed on any website in a complete or archived downloadable format.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div className="me-3 lh-1">
                    <Icon icon="scale" size={40} stroke={1} className="text-black" />
                  </div>
                  <div>
                    <div className="text-secondary small">tabler/tabler is licensed under the</div>
                    <h2 className="lh-1 mb-0 fw-bold">MIT License</h2>
                  </div>
                </div>

                <div className="text-secondary mb-4">
                  A short and simple permissive license with conditions only requiring preservation of copyright and
                  license notices. Licensed works, modifications, and larger works may be distributed under different terms
                  and without source code.
                </div>

                <div className="mb-4">
                  <div className="fw-bold mb-2">Permissions</div>
                  <ul className="list-unstyled space-y-1">
                    <li className="d-flex align-items-center"><Icon icon="check" className="text-green me-2" size={18} stroke={2} /> Commercial use</li>
                    <li className="d-flex align-items-center"><Icon icon="check" className="text-green me-2" size={18} stroke={2} /> Modification</li>
                    <li className="d-flex align-items-center"><Icon icon="check" className="text-green me-2" size={18} stroke={2} /> Distribution</li>
                    <li className="d-flex align-items-center"><Icon icon="check" className="text-green me-2" size={18} stroke={2} /> Private use</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <div className="fw-bold mb-2">Limitations</div>
                  <ul className="list-unstyled space-y-1">
                    <li className="d-flex align-items-center"><Icon icon="x" className="text-red me-2" size={18} stroke={2} /> Liability</li>
                    <li className="d-flex align-items-center"><Icon icon="x" className="text-red me-2" size={18} stroke={2} /> Warranty</li>
                  </ul>
                </div>

                <div className="mb-0">
                  <div className="fw-bold mb-2">Conditions</div>
                  <ul className="list-unstyled space-y-1">
                    <li className="d-flex align-items-center"><Icon icon="info-circle" className="text-blue me-2" size={18} stroke={2} /> License and copyright notice</li>
                  </ul>
                </div>
              </div>
              <div className="card-footer bg-transparent border-top-0 pt-0 pb-4">
                <div className="small text-secondary">
                  This is not legal advice.{' '}
                  <a href="https://choosealicense.com/licenses/mit/" target="_blank" rel="noreferrer" className="text-decoration-none">Learn more about repository licenses.</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
