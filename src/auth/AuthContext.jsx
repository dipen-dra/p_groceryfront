

// import { createContext, useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext();

// const AuthContextProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         try {
//             const storedUser = localStorage.getItem("user");
//             const token = localStorage.getItem("token");

//             if (storedUser && token) {
//                 setUser(JSON.parse(storedUser));
//             }
//         } catch (error) {
//             console.error("Failed to parse user from localStorage", error);
//             localStorage.clear();
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const login = (data) => {
//         if (data && data.data && data.token) {
//             const userData = data.data;
//             const token = data.token;
            
//             localStorage.setItem("user", JSON.stringify(userData));
//             localStorage.setItem("token", token);
//             setUser(userData);
            
//             // Navigate based on role
//             if (userData.role === 'admin') {
//                 navigate('/admin/dashboard', { replace: true });
//             } else {
//                 navigate('/dashboard', { replace: true });
//             }

//         } else {
//             console.error("Login failed: Invalid data received from server.", data);
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//         setUser(null);
//         navigate("/", { replace: true });
//     };

//     const updateUser = (updatedUserData) => {
//         console.log("AuthContext: Updating user data.", updatedUserData);
//         if (updatedUserData) {
//             setUser(updatedUserData);
//             localStorage.setItem("user", JSON.stringify(updatedUserData));
//         }
//     };

//     // FIX: useMemo is used to prevent the context value from being recreated
//     // on every render, which can cause unexpected issues in child components.
//     const contextValue = useMemo(() => ({
//         user,
//         loading,
//         login,
//         logout,
//         updateUser,
//         isAuthenticated: !!user
//     }), [user, loading]);


//     return (
//         <AuthContext.Provider value={contextValue}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// };

// export default AuthContextProvider;
// src/context/AuthContext.jsx

import { createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            const token = localStorage.getItem("token");

            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (data) => {
        if (data && data.data && data.token) {
            const userData = data.data;
            const token = data.token;
            
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", token);
            setUser(userData);
            
            if (userData.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }

        } else {
            console.error("Login failed: Invalid data received from server.", data);
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/", { replace: true });
    };

    const updateUser = (updatedUserData) => {
        if (updatedUserData) {
            setUser(updatedUserData);
            localStorage.setItem("user", JSON.stringify(updatedUserData));
        }
    };

    const contextValue = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user
    }), [user, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {/* 🟢 CHANGE THIS: Remove the conditional rendering */}
            {/* FROM: {!loading && children} */}
            {/* TO: */}
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;