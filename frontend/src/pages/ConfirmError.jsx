import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmEmailError = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleResendConfirmation = async () => {
        try {
            const response = await axios.get(
                "https://simpai.fly.dev/api/auth/resend-confirmation-email/",
                { params: { email } }
            );

            if (response.status === 200) {
                setMessage("Confirmation email resent successfully. Please check your inbox.");
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Failed to resend confirmation email.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <img src="/error-icon.png" alt="Error" className="mx-auto w-16" />
                <h1 className="text-2xl font-bold text-red-600 mt-4">Email Confirmation Failed</h1>
                <p className="text-gray-600 mt-2">
                    The confirmation link is invalid or has expired.
                </p>
                <div className="mt-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="px-4 py-2 border rounded-lg w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleResendConfirmation}
                    >
                        Resend Confirmation Email
                    </button>
                </div>
                {message && <p className="text-gray-600 mt-2">{message}</p>}
                <button
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={() => navigate("/login")}
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
};

export default ConfirmEmailError;