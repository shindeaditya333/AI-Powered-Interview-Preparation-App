import {
    createContext,
    useEffect,
    useState,
} from "react";

import {
    loginUser,
    registerUser,
} from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [username, setUsername] = useState(
        localStorage.getItem("username")
    );


    useEffect(() => {

        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }

    }, [token]);


    const login = async (credentials) => {

        const data =
            await loginUser(credentials);

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "username",
            data.username
        );

        setToken(data.token);
        setUsername(data.username);

        return data;
    };


    const register = async (credentials) => {

        const data =
            await registerUser(credentials);

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "username",
            data.username
        );

        setToken(data.token);
        setUsername(data.username);

        return data;
    };


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("username");

        setToken(null);
        setUsername(null);
    };


    const isAuthenticated = Boolean(token);


    return (
        <AuthContext.Provider
            value={{
                token,
                username,
                isAuthenticated,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}