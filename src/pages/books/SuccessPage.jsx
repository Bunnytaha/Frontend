import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    if (sessionId) {
      // Call backend to validate the session ID and confirm the payment
      fetch(`http://localhost:5000/api/orders/validate-session?session_id=${sessionId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            Swal.fire({
              title: 'Payment Successful!',
              text: 'Your order has been confirmed.',
              icon: 'success',
            }).then(() => {
              navigate('/orders');  // Redirect to the orders page after success
            });
          } else {
            Swal.fire({
              title: 'Payment Failed!',
              text: 'There was an issue with your payment. Please try again.',
              icon: 'error',
            }).then(() => {
              navigate('/checkout');  // Redirect to checkout if payment fails
            });
          }
        })
        .catch(error => {
          console.error('Error confirming payment:', error);
          Swal.fire({
            title: 'Payment Failed!',
            text: 'There was an error while confirming your payment. Please try again.',
            icon: 'error',
          }).then(() => {
            navigate('/checkout');
          });
        });
    } else {
      // If session_id is missing, consider this a failure
      Swal.fire({
        title: 'Payment Failed!',
        text: 'Unable to confirm payment, please try again.',
        icon: 'error',
      }).then(() => {
        navigate('/checkout');
      });
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default SuccessPage;
