interface SaleItem {
  quantity: number;
  unit_price: number;
  subtotal: number;
  name: string;
}

interface SaleSummaryProps {
  orgName: string;
  items: SaleItem[];
  total: number;
}

export default function SaleSummary({ orgName, items, total }: SaleSummaryProps) {
  return (
    <div className="sale-summary">
      <h3>Resumen de venta — {orgName}</h3>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant.</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${Number(item.unit_price).toFixed(2)}</td>
              <td>${Number(item.subtotal).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="sale-total">
        Total: <strong>${Number(total).toFixed(2)}</strong>
      </div>
    </div>
  );
}