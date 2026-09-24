import {
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    Lock,
    LogIn,
    User,
} from "lucide-react";

import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";

export default function Login() {

    const navigate = useNavigate();

    const {
        login,
    } = useAuth();


    const [form, setForm] = useState({
        username: "",
        password: "",
    });


    const [loading, setLoading] =
        useState(false);


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            await login(form);

            toast.success(
                "Welcome back!"
            );

            navigate("/dashboard");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Invalid username or password"
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="auth-card">

            <div className="auth-card-header">

                <div className="auth-icon">
                    <LogIn size={25} />
                </div>

                <h2>
                    Welcome back
                </h2>

                <p>
                    Sign in to continue
                    your preparation.
                </p>

            </div>


            <form
                onSubmit={handleSubmit}
                className="auth-form"
            >

                <label>
                    Username
                </label>

                <div className="input-wrapper">

                    <User size={18} />

                    <input
                        name="username"
                        type="text"
                        placeholder="Enter username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                </div>


                <label>
                    Password
                </label>

                <div className="input-wrapper">

                    <Lock size={18} />

                    <input
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                </div>


                <button
                    className="primary-button full-width"
                    disabled={loading}
                >
                    {loading
                        ? "Signing in..."
                        : "Sign In"}
                </button>

            </form>


            <p className="auth-footer">
                Don't have an account?{" "}
                <Link to="/register">
                    Create one
                </Link>
            </p>

        </div>
    );
}