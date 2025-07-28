import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { Eye, EyeOff } from 'lucide-react'; // Import Eye and EyeOff icons

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}api/password-reset/reset/${token}/`,
        { new_password: newPassword }
      );
      setMessage('Password reset successfully.');

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login'); // Redirect to the login page
      }, 2000); // 2-second delay
    } catch (error) {
      setMessage('Error: Password link has already been used or expired. Please request a new reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Rectangular Box (Card) */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="space-y-6">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              SimpAI
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Change My Password
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* New Password Field */}
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  name="new-password"
                  type={showPassword ? 'text' : 'password'} // Toggle between text and password
                  autoComplete="new-password"
                  required
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pr-10" // Added pr-10 for padding
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {/* Eye icon to toggle password visibility */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" /> // Show EyeOff icon when password is visible
                  ) : (
                    <Eye className="h-5 w-5" /> // Show Eye icon when password is hidden
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Your password should be at least 8 characters long with at least 1 uppercase letter and 1 special character.
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Password Confirmation
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'} // Toggle between text and password
                  autoComplete="new-password"
                  required
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pr-10" // Added pr-10 for padding
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {/* Eye icon to toggle confirm password visibility */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle confirm password visibility
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" /> // Show EyeOff icon when password is visible
                  ) : (
                    <Eye className="h-5 w-5" /> // Show Eye icon when password is hidden
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                ) : (
                  'Change My Password'
                )}
              </button>
            </div>
          </form>

          {message && (
            <div
              className={`mt-4 text-center text-sm ${
                message.includes('Error') || message.includes('expired') || message.includes('Passwords do not match')
                  ? 'text-red-600' // Red for errors
                  : 'text-green-600' // Green for success
              }`}
            >
              {message}
            </div>
          )}

          {/* Resend Email Confirmation Link */}
          <div className="text-center">
            <Link
              to="/forgot-password" // Replace with your resend confirmation route
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Resend email confirmation instructions
            </Link>
          </div>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              to="/login" // Replace with your login route
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;