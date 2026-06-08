"use client";

import { useAdminOrders, useUpdateOrderStatus } from "@/lib/hooks/use-orders";

export default function AdminOrdersPage() {
  const { data: orders = [] } = useAdminOrders();

  const { mutate: updateStatus } = useUpdateOrderStatus();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-600">
          <thead>
            <tr className="border-b border-gray-600 text-white bg-black-100">
              <th className="p-3 text-left">Customer</th>

              <th className="p-3 text-left">Email</th>

              <th className="p-3 text-left">Products</th>

              <th className="p-3 text-left">Status</th>

              <th className="p-3 text-left">Total</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b text-white border-gray-600">
                <td className="p-3">{order.customer_name}</td>

                <td className="p-3">{order.customer_email}</td>

                <td className="p-3">
                  {order.order_items.map((item) => (
                    <div key={item.id}>
                      {item.product_name}
                      {" x "}
                      {item.quantity}
                    </div>
                  ))}
                </td>

                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus({
                        id: order.id,
                        status: e.target.value,
                      })
                    }
                    className="border text-black rounded px-3 py-2"
                  >
                    <option value="pending">Pending</option>

                    <option value="processing">Processing</option>

                    <option value="shipped">Shipped</option>

                    <option value="delivered">Delivered</option>

                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                <td className="p-3">${order.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
