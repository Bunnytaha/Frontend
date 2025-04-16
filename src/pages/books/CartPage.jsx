import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getImgUrl } from '../../utils/getImgUrl';
import {
  clearCart,
  removeFromCart,
  incrementQty,
  decrementQty
} from '../../redux/features/cart/cartSlice';
import { FaTrashAlt, FaShoppingCart } from 'react-icons/fa';

const CartPage = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.newPrice * item.quantity,
    0
  ).toFixed(2);

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleQtyChange = (id, type) => {
    if (type === "inc") {
      dispatch(incrementQty(id));
    } else {
      dispatch(decrementQty(id));
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">🛒 Shopping Cart</h2>
        <button
          type="button"
          onClick={handleClearCart}
          className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
        >
          <FaTrashAlt className="inline-block mr-2" /> Clear Cart
        </button>
      </div>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">No items in your cart</div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((product) => (
            <div key={product._id} className="flex items-center justify-between bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
              {/* Product Image */}
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  alt={product.title}
                  src={getImgUrl(product.coverImage)}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* Product Info */}
              <div className="ml-4 flex-1 flex flex-col">
                <div className="flex justify-between text-lg font-medium text-gray-900">
                  <h3 className="text-base">{product.title}</h3>
                  <p className="text-gray-700">${(product.newPrice * product.quantity).toFixed(2)}</p>
                </div>
                <p className="mt-2 text-sm text-gray-500"><strong>Category:</strong> {product.category}</p>

                {/* Quantity and Remove */}
                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQtyChange(product._id, "dec")}
                      className="px-3 py-1 text-xl font-bold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-all"
                    >
                      −
                    </button>
                    <span className="font-medium">{product.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(product._id, "inc")}
                      className="px-3 py-1 text-xl font-bold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-all"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveFromCart(product)}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    <FaTrashAlt className="inline-block mr-1" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <div className="mt-8 border-t border-gray-300 pt-6">
          <div className="flex justify-between text-xl font-medium text-gray-900">
            <p>Total Price:</p>
            <p className="font-bold">${totalPrice}</p>
          </div>
          <p className="mt-2 text-sm text-gray-500">Shipping and taxes are calculated at checkout.</p>

          {/* Checkout Button */}
          <div className="mt-6">
            <Link
              to="/checkout"
              className="w-full block text-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Proceed to Checkout
            </Link>
          </div>

          {/* Continue Shopping Button */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-indigo-600 hover:text-indigo-500">
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Continue Shopping
                <span aria-hidden="true"> →</span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
