import {
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    Lock,
    UserPlus,
    User,
} from "lucide-react";

import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";

export default function Register() {

    const navigate = useNavigate();

    const {
        register,
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

        if (form.password.length < 8) {

            toast.error(
                "Password must contain at least 8 characters"
            );

            return;
        }


        setLoading(true);

        try {

            await register(form);

            toast.success(
                "Account created successfully!"
            );

            navigate("/dashboard");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="auth-card">

            <div className="auth-card-header">

                <div className="auth-icon">
                    <UserPlus size={25} />
                </div>

                <h2>
                    Create your account
                </h2>

                <p>
                    Start preparing for your
                    next interview.
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
                        placeholder="Choose a username"
                        value={form.username}
                        onChange={handleChange}
                        minLength={3}
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
                        placeholder="Minimum 8 characters"
                        value={form.password}
                        onChange={handleChange}
                        minLength={8}
                        required
                    />

                </div>


                <button
                    className="primary-button full-width"
                    disabled={loading}
                >
                    {loading
                        ? "Creating account..."
                        : "Create Account"}
                </button>

            </form>


            <p className="auth-footer">
                Already have an account?{" "}
                <Link to="/login">
                    Sign in
                </Link>
            </p>

        </div>
    );
}