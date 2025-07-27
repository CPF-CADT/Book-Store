import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Ensure your API functions are imported correctly from your services/api.js file
import { loginUser as apiLoginUser, fetchUserProfile } from '../services/api.js';

// Create the context for the application
const AuthContext = createContext(null);

// A helper function to safely decode the JWT payload on the frontend.
// This is ONLY necessary because your backend routes require the ID and role in the URL.
function parseJwt(token) {
    if (!token) { return null; }
    try {
        // The middle part of the token is the payload, Base64 encoded.
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        // If the token is malformed, return null.
        console.error("Failed to parse JWT:", e);
        return null;
    }
}

// The AuthProvider component that will wrap your application
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // Manages initial load state
    const navigate = useNavigate();

    // This hook runs on app load or when the token changes to validate the session.
    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    // 1. Decode the token to get the user's ID and role, as required by your backend.
                    const decoded = parseJwt(token);
                    if (!decoded || !decoded.id || !decoded.role) {
                        throw new Error("Invalid token: Missing ID or role in payload.");
                    }
                    const { id, role } = decoded;

                    // 2. Call the API with the ID and role to fetch the user's profile.
                    //    This now correctly matches your api.js function.
                    const response = await fetchUserProfile(id, role);
                    
                    // 3. Set the user state with the fresh data from the server.
                    setUser(response.data);

                } catch (error) {
                    console.error("AuthContext: Session expired or token is invalid.", error);
                    // If validation fails, log the user out to clear the bad token.
                    logout();
                }
            }
            // Always set loading to false after the check is complete.
            setLoading(false);
        };

        validateToken();
    }, [token]); // The dependency array ensures this runs only when the token changes.

    // The login function to be called from the Login page.
    const login = async (credentials) => {
        try {
            const response = await apiLoginUser(credentials);
            const userData = response.data;
            const receivedToken = userData.token;

            // Defensive check for a valid response from the server.
            if (!userData || !receivedToken) {
                throw new Error("Invalid response from server during login.");
            }

            // Update the state, which triggers the app to re-render as "logged in".
            setUser(userData);
            setToken(receivedToken);
            localStorage.setItem('token', receivedToken);

            // Perform role-based redirection after successful login.
            const { role, id } = userData;
            if (role === 'admin' || role === 'vendor') {
                navigate(`/dashboard`);
            } else if (role === 'customer') {
                navigate(`/${role}/${id}/profile`);
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Login failed in AuthContext", error);
            // Re-throw the error so the Login component can display it.
            throw error;
        }
    };

    // The logout function to clear the session.
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        navigate("/login");
    };

    // The value object holds all the state and functions to be shared.
    // CRITICAL FIX: Ensure `setUser` is included so the profile page can update the state.
    const value = { user, token, loading, login, logout, setUser };

    // Prevents UI flicker by showing a loading indicator until the token check is done.
    if (loading) {
        return <div>Loading Application...</div>;
    }

    // Provide the value to all children components.
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// A custom hook to make consuming the context easier and cleaner.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};