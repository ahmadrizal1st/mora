// src/pages/DashboardCrypto.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Avatar } from '../components/ui/Avatar'
import { Trending } from '../components/ui/Trending'
import { SwitchIcon } from '../components/ui/SwitchIcon'
import { NavSegmented } from '../components/ui/NavSegmented'
import { Chart } from '../components/ui/Chart'
import { CardDropdown } from '../components/ui/CardDropdown'

// Data
import cryptoCurrencies from '../data/crypto-currencies.json'
import cryptoMarkets from '../data/crypto-markets.json'
import cryptoOrders from '../data/crypto-orders.json'
import chartsData from '../data/charts.json'

interface StatCardProps {
  title: string
  icon: string
  main: string
  sub: string
  extra?: React.ReactNode
}

function StatCard({ title, icon, main, sub, extra }: StatCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row">
          <div className="col mt-0">
            <h5 className="card-title">{title}</h5>
          </div>
          <div className="col-auto">
            <Avatar icon={icon} color="primary-lt" />
          </div>
        </div>
        <div className="mb-1">
          <span className="h3">{main}</span>
          <span className="text-muted"> {sub}</span>
        </div>
        {extra && <div className="mb-0">{extra}</div>}
      </div>
    </div>
  )
}

export default function DashboardCrypto() {
  const btc = cryptoCurrencies.find(c => c.symbol === 'BTC')!
  const ltc = cryptoCurrencies.find(c => c.symbol === 'LTC')!
  const eth = cryptoCurrencies.find(c => c.symbol === 'ETH')!
  const xmr = cryptoCurrencies.find(c => c.symbol === 'XMR')!

  const btcBalance = 2.30
  const btcPriceNum = parseFloat(btc.price.replace(/[$,]/g, ''))
  const totalUsdRaw = btcPriceNum * btcBalance
  
  const ltcPriceNum = parseFloat(ltc.price.replace(/[$,]/g, ''))
  const ethPriceNum = parseFloat(eth.price.replace(/[$,]/g, ''))
  const xmrPriceNum = parseFloat(xmr.price.replace(/[$,]/g, ''))

  const ltcBtc = (ltcPriceNum / btcPriceNum).toFixed(8)
  const ethBtc = (ethPriceNum / btcPriceNum).toFixed(8)
  const xmrBtc = (xmrPriceNum / btcPriceNum).toFixed(8)

  const candlestickData = (chartsData as any)['dashboard-crypto-candlestick']

  return (
    <BaseLayout pageTitle="Crypto Dashboard" pagePretitle="Dashboards">
      <div className="row row-cards">
        <div className="col-12">
          <div className="row row-cards">
            <div className="col-12 col-md-6 col-xxl">
              <StatCard
                title="Total balance"
                icon="currency-dollar"
                main={`$${Math.round(totalUsdRaw).toLocaleString()}`}
                sub={`${btcBalance} ${btc.symbol}`}
                extra={
                  <>
                    <Trending value={btc.p24h} />
                    <span className="text-muted">Since last week</span>
                  </>
                }
              />
            </div>

            <div className="col-12 col-md-6 col-xxl">
              <StatCard
                title="USD/BTC"
                icon="currency-bitcoin"
                main={btc.price}
                sub={btc.price}
                extra={<span className="text-muted">Volume: {btc['volume-24h']}</span>}
              />
            </div>

            <div className="col-12 col-md-6 col-xxl">
              <StatCard
                title="LTC/BTC"
                icon="currency-litecoin"
                main={ltcBtc}
                sub={ltc.price}
                extra={<span className="text-muted">Volume: {ltc['volume-24h'].replace('$', '')}</span>}
              />
            </div>

            <div className="col-12 col-md-6 col-xxl">
              <StatCard
                title="ETH/BTC"
                icon="currency-ethereum"
                main={ethBtc}
                sub={eth.price}
                extra={<span className="text-muted">Volume: {eth['volume-24h'].replace('$', '')}</span>}
              />
            </div>

            <div className="col-12 col-md-6 col-xxl">
              <StatCard
                title="XMR/BTC"
                icon="currency-monero"
                main={xmrBtc}
                sub={xmr.price}
                extra={<span className="text-muted">Volume: {xmr['volume-24h'].replace('$', '')}</span>}
              />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="row row-cards">
            <div className="col-12 col-lg-5">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="card-title mb-0">Markets</h5>
                  <div className="card-actions">
                    <CardDropdown />
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table card-table table-vcenter table-striped">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Coin</th>
                        <th>Price</th>
                        <th className="d-none d-xl-table-cell">Volume</th>
                        <th className="d-none d-xl-table-cell text-end">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cryptoMarkets.slice(0, 10).map((market, i) => (
                        <tr key={i}>
                          <td>
                            <SwitchIcon icon="star" colorB="yellow" variant="slide-up" active={market.favorite} />
                          </td>
                          <td>{market.coin}</td>
                          <td>{market.price}</td>
                          <td className="d-none d-xl-table-cell">{market.volume}</td>
                          <td className="d-none d-xl-table-cell text-end">
                            <Trending value={parseFloat(market.change)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-7">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="card-title mb-0">LTC/BTC</h5>
                  <div className="card-actions">
                    <NavSegmented
                      items={['1m', '5m', '30m', '1h', '1d']}
                      name="timeframe"
                      size="sm"
                      defaultActive={2}
                    />
                  </div>
                </div>
                <div className="card-body">
                  <Chart
                    chartId="dashboard-crypto-candlestick"
                    chartData={candlestickData}
                    height={28}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="row row-cards">
            <div className="col-12 col-lg-12 col-xxl-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Operations</h3>
                  <div className="card-actions">
                    <NavSegmented
                      items={['Buy', 'Sell', 'Send']}
                      name="operations"
                      size="sm"
                      defaultActive={1}
                    />
                  </div>
                </div>
                <div className="card-body">
                  <p>Place new order:</p>
                  <div className="input-group mb-3">
                    <label className="input-group-text">Amount</label>
                    <select className="form-select">
                      {cryptoCurrencies.slice(0, 20).map((currency) => (
                        <option key={currency.symbol} value={currency.symbol}>
                          {currency.symbol}
                        </option>
                      ))}
                    </select>
                    <input type="text" className="form-control" defaultValue="0.25" />
                  </div>

                  <div className="input-group mb-3">
                    <label className="input-group-text">Price</label>
                    <input type="text" className="form-control" readOnly defaultValue="23,077.05" />
                    <label className="input-group-text">$</label>
                  </div>

                  <div className="input-group mb-3">
                    <label className="input-group-text">Total</label>
                    <input type="text" className="form-control" readOnly defaultValue="5,769.27" />
                    <label className="input-group-text">$</label>
                  </div>

                  <div className="d-grid">
                    <button type="button" className="btn btn-primary mb-3">
                      Process to wallet
                    </button>
                  </div>

                  <p className="text-muted mb-0 small">
                    The final amount could change depending on current market conditions.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6 col-xxl">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Sell Orders</h3>
                  <div className="card-actions">
                    <button className="btn btn-sm">View all</button>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table card-table table-vcenter table-striped">
                    <thead>
                      <tr>
                        <th>Price</th>
                        <th className="d-none d-xl-table-cell">BTC</th>
                        <th>Sum(BTC)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cryptoOrders.sell_orders.map((order, i) => (
                        <tr key={i}>
                          <td>{order.price}</td>
                          <td className="d-none d-xl-table-cell">{order.btc}</td>
                          <td>{order.sum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6 col-xxl">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Buy Orders</h3>
                  <div className="card-actions">
                    <button className="btn btn-sm">View all</button>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table card-table table-vcenter table-striped">
                    <thead>
                      <tr>
                        <th>Price</th>
                        <th className="d-none d-xl-table-cell">BTC</th>
                        <th>Sum(BTC)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cryptoOrders.buy_orders.map((order, i) => (
                        <tr key={i}>
                          <td>{order.price}</td>
                          <td className="d-none d-xl-table-cell">{order.btc}</td>
                          <td>{order.sum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}