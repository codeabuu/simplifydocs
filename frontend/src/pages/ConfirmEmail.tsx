import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const ConfirmEmail = () => {
  const { key } = useParams<{ key: string }>(); // Extract the key from the URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const confirmEmail = async () => {
      if (!key) {
        setMessage("Invalid confirmation link.");
        setIsLoading(false);
        return;
      }

      try {
        // Send the key to the backend for verification
        const response = await axios.post(
          "http://127.0.0.1:8000/api/confirm-email/",
          { key },
        );

        if (response.status === 200) {
          setMessage("Email confirmed successfully! Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 3000); // Redirect to login after 3 seconds
        }
      } catch (error) {
        console.error("Error confirming email:", error);
        setMessage(
          error.response?.data?.message ||
            "Failed to confirm email. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    confirmEmail();
  }, [key, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <Link to="/" className="inline-flex items-center">
          <img
            src="/homelogo-preview.png"
            alt="AskAnalytIQ Logo"
            className="h-auto w-52"
          />
        </Link>
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-gray-600">Confirming your email...</p>
          </div>
        ) : (
          <>
            <img src="/success-icon.png" alt="Success" className="mx-auto w-16" />
            <h1
              className={`text-2xl font-bold mt-4 ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message.includes("successfully") ? "Email Confirmed!" : "Error"}
            </h1>
            <p className="text-gray-600 mt-2">{message}</p>
            {!message.includes("successfully") && (
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;