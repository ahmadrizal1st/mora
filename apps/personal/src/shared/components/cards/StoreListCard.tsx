interface StoreItem {
  name: string; 
  price: string; 
  imageSrc?: string; 
  reviews?: number; 
  offers?: number; 
  isNew?: boolean;
}

interface StoreListCardProps { 
  items?: StoreItem[] 
}

export function StoreListCard({
  items = [
    { name: 'Wireless Headphones', price: '$89.99', reviews: 42, offers: 12, isNew: true },
    { name: 'Mechanical Keyboard', price: '$149.00', reviews: 87, offers: 5 },
    { name: 'USB-C Hub', price: '$39.99', reviews: 23, offers: 18, isNew: true },
    { name: 'Monitor Stand', price: '$59.00', reviews: 31, offers: 7 },
  ],
}: StoreListCardProps) {
  return (
    <div className="card">
      <table className="table card-table table-vcenter">
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>
                {item.imageSrc
                  ? <img src={item.imageSrc} alt="" className="h-16" />
                  : <div style={{ width: 40, height: 40, background: '#f0f0f0', borderRadius: 4 }} />}
              </td>
              <td>
                {item.name}
                {item.isNew && <span className="badge badge-secondary-lt ms-2">New</span>}
              </td>
              <td className="text-end text-secondary d-none d-md-table-cell text-nowrap">
                {item.reviews ?? 0} reviews
              </td>
              <td className="text-end text-secondary d-none d-md-table-cell text-nowrap">
                {item.offers ?? 0} offers
              </td>
              <td className="text-end"><strong>{item.price}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
