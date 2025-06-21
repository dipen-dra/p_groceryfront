
// import { useMutation } from '@tanstack/react-query';
// import { loginUserService } from '../services/authServices';
// import { toast } from 'react-toastify';
// import { useContext } from 'react';
// import { AuthContext } from '../auth/AuthContext';

// export const useLoginUser = () => {
//   const { login } = useContext(AuthContext);

//   return useMutation({
//     mutationFn: loginUserService,
//     mutationKey: ['login-key'],
//     onSuccess: (res) => {
//       console.log('Login response:', res);

//       // Assuming your backend returns { data: user, token: '...' }
//       login(res.data, res.token); // Save user & token

//       toast.success('Login successful!');
//     },
//     onError: () => {
//       toast.error('Login failed. Please try again.');
//     },
//   });
// };

// export default useLoginUser;


import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext.jsx";
import { loginUserService } from "../services/authServices.js";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const useLoginUser = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const { mutate: login, isLoading } = useMutation({
        mutationFn: (credentials) => loginUserService(credentials),
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Login successful!");
                authContext.login(response);
                navigate('/dashboard', { replace: true });
            } else {
                toast.error(response.message || "An unknown login error occurred.");
            }
        },
        onError: (error) => {
            toast.error(error.message || "Login failed. Please check your credentials.");
        }
    });

    return { login, isLoading };
};
export default useLoginUser;
export { useLoginUser };
