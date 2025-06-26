import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../auth/AuthContext.jsx'; // Adjust path if needed

const EsewaVerifyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart } = useContext(CartContext);
    const { loading: isLoadingAuth } = useContext(AuthContext);

    useEffect(() => {
        // This component must wait for the app to confirm if the user is logged in.
        if (isLoadingAuth) {
            return;
        }

        const params = new URLSearchParams(location.search);
        const status = params.get('status');
        const message = decodeURIComponent(params.get('message') || '');

        if (status === 'success') {
            toast.success(message || 'Payment successful! Your order has been placed.');
            clearCart();
            // Replace the browser history state so the user can't use the "back" button
            // to get to this verification page again.
            navigate('/dashboard/orders', { replace: true });
        } else if (status === 'failure') {
            toast.error(message || 'Payment failed. Please try again.');
            navigate('/checkout', { replace: true });
        } else {
            // If a user lands here by mistake without any status, send them home.
            toast.info("Redirecting to homepage.");
            navigate('/', { replace: true });
        }
        // This effect runs once after authentication is resolved.
    }, [isLoadingAuth, navigate, location.search, clearCart]);

    // Show a loading spinner while the useEffect logic is running.
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <Loader2 className="animate-spin text-green-500 h-16 w-16" />
            <p className="mt-6 text-xl text-gray-700">Finalizing your payment, please wait...</p>
        </div>
    );
};

export default EsewaVerifyPage;