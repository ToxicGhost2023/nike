import React from "react";
import { Users, ShoppingCart, Box, DollarSign } from "lucide-react";

export default function DashBoardAdminPage() {
  // داده‌های تستی
  const stats = [
    {
      label: "Total Users",
      value: 1240,
      icon: <Users className="h-6 w-6 text-blue-500" />,
    },
    {
      label: "Total Orders",
      value: 532,
      icon: <ShoppingCart className="h-6 w-6 text-green-500" />,
    },
    {
      label: "Products",
      value: 128,
      icon: <Box className="h-6 w-6 text-yellow-500" />,
    },
    {
      label: "Revenue",
      value: "$12,430",
      icon: <DollarSign className="h-6 w-6 text-purple-500" />,
    },
  ];

  const recentOrders = [
    { id: "#001", user: "John Doe", total: "$120", status: "Completed" },
    { id: "#002", user: "Jane Smith", total: "$250", status: "Pending" },
    { id: "#003", user: "Alice Johnson", total: "$85", status: "Cancelled" },
    { id: "#004", user: "Bob Brown", total: "$430", status: "Completed" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold ">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-4 p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="p-3 rounded-full">{item.icon}</div>
            <div>
              <p className=" text-sm">{item.label}</p>
              <p className="text-lg font-semibold ">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold  mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th
                  className="px-4 py-2 >
                  Order ID
                </th>
                <th className="
                  px-4
                  py-2
                >
                  User
                </th>
                <th
                  className="px-4 py-2 >
                  Total
                </th>
                <th className="
                  px-4
                  py-2
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.user}</td>
                  <td className="px-4 py-2">{order.total}</td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      order.status === "Completed"
                        ? "text-green-600 dark:text-green-400"
                        : order.status === "Pending"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <button className="bg-blue-500 text-white rounded-lg p-4 hover:bg-blue-600 transition shadow flex items-center justify-center gap-2">
          Add Product
        </button>
        <button className="bg-green-500 text-white rounded-lg p-4 hover:bg-green-600 transition shadow flex items-center justify-center gap-2">
          Add User
        </button>
        <button className="bg-yellow-500 text-white rounded-lg p-4 hover:bg-yellow-600 transition shadow flex items-center justify-center gap-2">
          View Orders
        </button>
        <button className="bg-purple-500 text-white rounded-lg p-4 hover:bg-purple-600 transition shadow flex items-center justify-center gap-2">
          Reports
        </button>
      </div>
    </div>
  );
}
