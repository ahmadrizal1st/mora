import { Icon } from '@/shared/components/ui/Icon';

export function VisualTransactionsCard() {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-header border-0 pb-0 pt-4 px-4">
        <h3 className="card-title fw-bold">Transaksi Terkini</h3>
        <div className="card-actions d-flex gap-2">
           <div className="dropdown">
             <a
               href="#"
               className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
               data-bs-toggle="dropdown"
             >
               <span className="text-decoration-underline-hover">This Month</span>
               <Icon icon="chevron-down" size="xs" />
             </a>
             <div className="dropdown-menu dropdown-menu-end">
               <button className="dropdown-item">This Month</button>
               <button className="dropdown-item">Last Month</button>
             </div>
           </div>
           <a
             href="#"
             className="text-secondary small d-flex align-items-center gap-1 text-decoration-none ms-2"
           >
             <span className="text-decoration-underline-hover">Filter</span>
             <Icon icon="adjustments-horizontal" size="xs" />
           </a>
        </div>
      </div>

      <div className="card-body p-4 pt-3 p-0">
        <div className="table-responsive">
          <table className="table table-vcenter table-borderless text-nowrap mb-0">
            <thead>
              <tr className="border-bottom">
                <th className="text-muted small fw-medium">Keterangan <Icon icon="selector" size="xxs" className="ms-1" /></th>
                <th className="text-muted small fw-medium">Kategori <Icon icon="selector" size="xxs" className="ms-1" /></th>
                <th className="text-muted small fw-medium">Tanggal <Icon icon="selector" size="xxs" className="ms-1" /></th>
                <th className="text-muted small fw-medium">Jumlah <Icon icon="selector" size="xxs" className="ms-1" /></th>
                <th className="text-muted small fw-medium">Status <Icon icon="selector" size="xxs" className="ms-1" /></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-bottom">
                <td className="py-2">
                  <div className="fw-bold mb-1">Gaji Bulanan</div>
                  <div className="text-muted small">Pemasukan</div>
                </td>
                <td className="py-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary text-white rounded-1 px-1 fw-bold align-items-center justify-content-center d-flex" style={{ fontSize: '0.6rem', width: '32px', height: '20px' }}>BNI</div>
                    <span className="text-muted small">Rek. BNI Utama</span>
                  </div>
                </td>
                <td className="py-2">
                   <div className="fw-medium text-dark mb-1">2025-05-01</div>
                   <div className="text-muted small">09:00</div>
                </td>
                <td className="py-2 text-success fw-bold">+Rp 8.500.000</td>
                <td className="py-2">
                   <span className="badge bg-primary text-white rounded-pill px-2">Masuk</span>
                </td>
              </tr>

              <tr className="border-bottom">
                <td className="py-2">
                  <div className="fw-bold mb-1">Bayar Listrik PLN</div>
                  <div className="text-muted small">Tagihan</div>
                </td>
                <td className="py-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary text-white rounded-1 px-1 fw-bold align-items-center justify-content-center d-flex" style={{ fontSize: '0.6rem', width: '32px', height: '20px' }}>PLN</div>
                    <span className="text-muted small">m-BCA</span>
                  </div>
                </td>
                <td className="py-2">
                   <div className="fw-medium text-dark mb-1">2025-05-05</div>
                   <div className="text-muted small">10:30</div>
                </td>
                <td className="py-2 fw-bold text-danger">-Rp 450.000</td>
                <td className="py-2">
                   <span className="badge bg-primary text-white rounded-pill px-2">Lunas</span>
                </td>
              </tr>

              <tr className="border-bottom">
                <td className="py-2">
                  <div className="fw-bold mb-1">Transfer Tabungan</div>
                  <div className="text-muted small">Tabungan</div>
                </td>
                <td className="py-2">
                  <div className="d-flex align-items-center gap-2">
                     <div className="bg-primary text-white rounded-1 px-1 fw-bold align-items-center justify-content-center d-flex" style={{ fontSize: '0.6rem', width: '32px', height: '20px' }}>TAB</div>
                     <span className="text-muted small">Rek. Tabungan BRI</span>
                  </div>
                </td>
                <td className="py-2">
                   <div className="fw-medium text-dark mb-1">2025-05-05</div>
                   <div className="text-muted small">11:00</div>
                </td>
                <td className="py-2 text-success fw-bold">+Rp 1.000.000</td>
                <td className="py-2">
                   <span className="badge bg-primary text-white rounded-pill px-2">Berhasil</span>
                </td>
              </tr>

              <tr className="border-bottom">
                <td className="py-2">
                  <div className="fw-bold mb-1">Belanja Bulanan</div>
                  <div className="text-muted small">Kebutuhan</div>
                </td>
                <td className="py-2">
                  <div className="d-flex align-items-center gap-2">
                     <div className="bg-primary text-white rounded-1 px-1 fw-bold align-items-center justify-content-center d-flex" style={{ fontSize: '0.6rem', width: '32px', height: '20px' }}>BLJ</div>
                     <span className="text-muted small">GoPay</span>
                  </div>
                </td>
                <td className="py-2">
                   <div className="fw-medium text-dark mb-1">2025-05-07</div>
                   <div className="text-muted small">14:20</div>
                </td>
                <td className="py-2 fw-bold text-success">-Rp 850.000</td>
                <td className="py-2">
                   <span className="badge bg-primary text-white rounded-pill px-2">Selesai</span>
                </td>
              </tr>

              <tr>
                <td className="py-2">
                  <div className="fw-bold mb-1">Cicilan KPR</div>
                  <div className="text-muted small">Cicilan</div>
                </td>
                <td className="py-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary text-white rounded-1 px-1 fw-bold align-items-center justify-content-center d-flex" style={{ fontSize: '0.6rem', width: '32px', height: '20px' }}>KPR</div>
                    <span className="text-muted small">Rek. BCA Utama</span>
                  </div>
                </td>
                <td className="py-2">
                   <div className="fw-medium text-dark mb-1">2025-05-10</div>
                   <div className="text-muted small">08:00</div>
                </td>
                <td className="py-2 text-danger fw-bold">-Rp 2.300.000</td>
                <td className="py-2">
                   <span className="badge bg-primary-lt text-primary rounded-pill px-2">Terjadwal</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
