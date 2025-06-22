


// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext();

// const AuthContextProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     // This effect runs once when the app loads to check for a logged-in user.
//     useEffect(() => {
//         try {
//             const storedUser = localStorage.getItem("user");
//             const token = localStorage.getItem("token");

//             if (storedUser && token) {
//                 setUser(JSON.parse(storedUser));
//             }
//         } catch (error) {
//             // If there's an error, clear storage to be safe.
//             console.error("Failed to parse user from localStorage", error);
//             localStorage.clear();
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     /**
//      * FIX: The login function now accepts a single `data` object, which is the
//      * entire response from the backend API. It correctly extracts the user
//      * object (from data.data) and the token (from data.token).
//      */
//     const login = (data) => {
//         if (data && data.data && data.token) {
//             const userData = data.data;
//             const token = data.token;
            
//             localStorage.setItem("user", JSON.stringify(userData));
//             localStorage.setItem("token", token);
//             setUser(userData);
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

//     return (
//         <AuthContext.Provider
//             value={{ user, loading, login, logout, isAuthenticated: !!user }}
//         >
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// };

// export default AuthContextProvider;



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
            
            // Navigate based on role
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
        console.log("AuthContext: Updating user data.", updatedUserData);
        if (updatedUserData) {
            setUser(updatedUserData);
            localStorage.setItem("user", JSON.stringify(updatedUserData));
        }
    };

    // FIX: useMemo is used to prevent the context value from being recreated
    // on every render, which can cause unexpected issues in child components.
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
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;