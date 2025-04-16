import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import queryString from "query-string";
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/features/cart/cartSlice';

const CheckoutPage = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice * item.quantity, 0).toFixed(2);
  const { currentUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // Payment method (cash or card)
  const dispatch = useDispatch();


  // Handle Stripe Payment
  const handleStripePayment = async (data) => {
    try {
      const stripePayload = {
        items: cartItems.map(item => ({
          _id: item._id,  // Include product _id
          name: item.title || item.name,
          newPrice: item.newPrice,
          quantity: item.quantity || 1,
        })),
        userEmail: currentUser?.email,
        paymentMethod: 'card',
        shippingAddress: {
          name: data.name,
          line1: data.address,
          city: data.city,
          state: data.state,
          postal_code: data.zipcode,
          country: data.country,
          phone: data.phone,  // Add the phone number here
        },
      };
      
      console.log("📤 Sending Stripe payload:", stripePayload);
  
      const response = await fetch("http://localhost:5000/api/orders/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stripePayload),
      });
  
      const session = await response.json();
  
      if (!session.id) {
        throw new Error("Stripe session ID is missing");
      }
  
      const stripe = await loadStripe("Publish_key");
      await stripe.redirectToCheckout({ sessionId: session.id });
  
    } catch (error) {
      console.error("❌ Error in Stripe Payment Integration", error);
      alert("Failed to initiate payment. Check console for details.");
    }
  };
  
  


  // Form Submission (for Cash on Delivery)
  const onSubmit = async (data) => {
    const newOrder = {
      name: data.name,
      email: currentUser?.email,
      address: {
        city: data.city,
        country: data.country,
        state: data.state,
        zipcode: data.zipcode,
      },
      phone: data.phone,
      productIds: cartItems.map(item => item?._id),
      totalPrice: totalPrice,
      paymentMethod: paymentMethod === 'cash' ? 'cash_on_delivery' : 'card', // Determine payment method
    };
  
    try {
      if (paymentMethod === 'cash') {
        // If Cash on Delivery, create the order directly without Stripe
        await createOrder(newOrder).unwrap();
        Swal.fire({
          title: "Confirmed Order",
          text: "Your order placed successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        dispatch(clearCart());
        navigate("/orders");
      } else {
        await createOrder(newOrder).unwrap();
        // If Stripe payment, pass data to handleStripePayment
        await handleStripePayment(data);  // Pass `data` to the Stripe payment handler
      }
    } catch (error) {
      console.error("Error placing an order", error);
      alert("Failed to place an order");
    }
  };
  
  if (isLoading) return <div>Loading....</div>;

  return (
    <section>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <h2 className="font-semibold text-xl text-gray-600 mb-2">Happy Checkout</h2>
            <p className="text-gray-500 mb-2">Total Price: ${totalPrice}</p>
            <p className="text-gray-500 mb-6">Items: {cartItems.length > 0 ? cartItems.length : 0}</p>
          </div>

          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8">
              <div className="text-gray-600">
                <p className="font-medium text-lg">Personal Details</p>
                <p>Please fill out all the fields.</p>
              </div>

              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                  {/* Form Inputs */}
                  <div className="md:col-span-5">
                    <label htmlFor="full_name">Full Name</label>
                    <input
                      {...register("name", { required: true })}
                      type="text" name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                  </div>

                  <div className="md:col-span-5">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="text" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      disabled
                      defaultValue={currentUser?.email}
                      placeholder="email@domain.com" />
                  </div>

                  <div className="md:col-span-5">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      {...register("phone", { required: true })}
                      type="tel"
                      name="phone"
                      id="phone"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      placeholder="+123 456 7890"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label htmlFor="address">Address / Street</label>
                    <input
                      {...register("address", { required: true })}
                      type="text" name="address" id="address" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="city">City</label>
                    <input
                      {...register("city", { required: true })}
                      type="text" name="city" id="city" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="country">Country / region</label>
                    <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                      <input
                        {...register("country", { required: true })}
                        name="country" id="country" placeholder="Country" className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="state">State / province</label>
                    <input
                      {...register("state", { required: true })}
                      name="state" id="state" placeholder="State" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                  </div>

                  <div className="md:col-span-1">
                    <label htmlFor="zipcode">Zipcode</label>
                    <input
                      {...register("zipcode", { required: true })}
                      type="text" name="zipcode" id="zipcode" className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" />
                  </div>

                  {/* Payment Option */}
                  <div className="md:col-span-5 mt-3">
                    <div className="inline-flex items-center">
                      <input
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        type="radio" name="payment" id="cash" value="cash" className="form-radio" />
                      <label htmlFor="cash" className="ml-2">Cash on Delivery</label>
                    </div>
                    <div className="inline-flex items-center ml-6">
                      <input
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        type="radio" name="payment" id="card" value="card" className="form-radio" />
                      <label htmlFor="card" className="ml-2">Pay with Card</label>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="md:col-span-5 mt-3">
                    <div className="inline-flex items-center">
                      <input
                        onChange={(e) => setIsChecked(e.target.checked)}
                        type="checkbox" name="billing_same" id="billing_same" className="form-checkbox" />
                      <label htmlFor="billing_same" className="ml-2 ">I agree to the <Link className='underline underline-offset-2 text-blue-600'>Terms & Conditions</Link> and <Link className='underline underline-offset-2 text-blue-600'>Shopping Policy.</Link></label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-5 text-right">
                    <div className="inline-flex items-end">
                      {paymentMethod === 'cash' && (
                        <button
                          disabled={!isChecked}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          type="submit">Place an Order</button>
                      )}
                      {paymentMethod === 'card' && (
                        <button
                          disabled={!isChecked}
                          onClick={handleStripePayment}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          type="button">Pay with Stripe</button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CheckoutPage;
