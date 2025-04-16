import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useGetOrderByEmailQuery } from '../../../redux/features/orders/ordersApi';
import { FaCartPlus, FaRegCalendarAlt, FaTag } from 'react-icons/fa'; // Optional: Adding icons

const UserDashboard = () => {
    const { currentUser } = useAuth();
    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser?.email);

    if (isLoading) return <div className="text-center text-gray-600">Loading...</div>;
    if (isError) return <div className="text-center text-red-500">Error fetching orders data</div>;

    return (
        <div className="bg-gray-100 py-16">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
                <h1 className="text-3xl font-bold mb-4 text-center text-indigo-600">User Dashboard</h1>
                <p className="text-gray-700 text-center mb-8">Welcome, {currentUser?.name || 'User'}! Here are your recent orders:</p>

                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
                    {orders.length > 0 ? (
                        <ul className="space-y-6">
                            {orders.map((order) => (
                                <li key={order._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-xl font-medium text-gray-800">Order ID: {order._id}</p>
                                        <p className="text-sm text-gray-500"><FaRegCalendarAlt className="inline-block mr-1" />{new Date(order?.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-lg text-gray-700 mb-3"><FaTag className="inline-block mr-1" /> Total: ${order.totalPrice}</p>

                                    {/* Check if order.productIds is an array of objects */}
                                    {order.productIds && Array.isArray(order.productIds) && order.productIds.length > 0 ? (
                                        <div>
                                            <p className="font-semibold mb-2">Products:</p>
                                            <ul className="space-y-2">
                                                {order.productIds.map((product, index) => (
                                                    <li key={index} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                                                        <div className="flex flex-col">
                                                            <p className="text-sm text-gray-800 font-medium">{product.title}</p>
                                                            <p className="text-sm text-gray-500">Product ID: {product._id}</p>
                                                        </div>
                                                        <p className="text-sm text-gray-600 font-semibold">${product.newPrice}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No products found in this order.</p>
                                    )}

                                    {/* Optional: Add a button for more details or reordering */}
                                    <div className="mt-4 text-right">
                                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-all">
                                            <FaCartPlus className="inline-block mr-2" /> Reorder
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-600">You have no recent orders.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
