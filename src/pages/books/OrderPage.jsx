import React from 'react'
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi'
import { useAuth } from '../../context/AuthContext';
import { FaRegCalendarAlt, FaTag, FaUser, FaPhoneAlt } from 'react-icons/fa';

const OrderPage = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser.email);

  if (isLoading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (isError) return <div className="text-center mt-10 text-red-500">Error getting orders data</div>;

  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-3xl font-bold mb-6 text-center text-indigo-600'>📦 Your Rented Books</h2>

      {orders.length === 0 ? (
        <div className="text-center text-gray-600">No orders found!</div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <div key={order._id} className="border rounded-lg shadow-md p-6 bg-white hover:shadow-xl transition duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Order #{index + 1}
                </span>
                <span className="text-sm text-gray-500"><FaRegCalendarAlt className="inline-block mr-1" />{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="mb-3 text-gray-800">
                <p><span className="font-medium">Name:</span> {order.name}</p>
                <p><span className="font-medium">Email:</span> {order.email}</p>
                <p><span className="font-medium">Phone:</span> {order.phone}</p>
                <p><span className="font-medium">Total Price:</span> ${order.totalPrice}</p>
                <p>
                  <span className="font-medium">Address:</span> {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                </p>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-gray-700">🛒 Products:</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {order.productIds.map((product) => (
                  <div key={product._id} className="border rounded-md overflow-hidden shadow-sm hover:shadow-lg transition duration-200">
                    {/* Removed image; replaced with placeholder */}
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-600">No Image</p>
                    </div>
                    <div className="p-3">
                      <h4 className="text-md font-semibold text-gray-800 truncate">{product.title}</h4>
                      <p className="text-sm text-gray-600"><FaTag className="inline-block mr-1" />${product.newPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
