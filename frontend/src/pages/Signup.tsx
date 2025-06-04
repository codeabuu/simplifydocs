import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowLeft, Eye, EyeOff, User } from "lucide-react"; // Import User icon
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { BsMicrosoftTeams } from "react-icons/bs"; // Microsoft icon
import { FaApple } from "react-icons/fa"; // Apple icon
import { registerUser } from "@/lib/api"; // Import the registerUser function
import axios from "axios";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const [error, setError] = useState(""); // State to handle error messages
  const [isLoading, setIsLoading] = useState(false); // State to handle loading state
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    setError("");

    // Validate email and password confirmation
    if (email !== confirmEmail) {
      setError("Emails do not match. Please check your email entries.");
      setIsLoading(false); // Reset loading state
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check your password entries.");
      setIsLoading(false); // Reset loading state
      return;
    }

    try {
      // Call the registerUser API
      const response = await registerUser(
        `${firstName} ${lastName}`, // Combine first and last name as the username
        email,
        password,
        confirmPassword
      );

      console.log("Registration successful:", response);
      // Redirect the user to the login page after successful registration
      navigate("/check-email");
    } catch (error) {
      console.error("Registration failed:", error);

      // Handle API errors (e.g., display error message to the user)
      if (error.response) {
        console.error("Error details:", error.response.data);

        if (error.response.data.email) {
          setError(error.response.data.email.join(" "));
        } else if (error.response.data.non_field_errors) {
          // Handle general errors like "User already exists"
          setError(error.response.data.non_field_errors.join(" "));
        } else if (error.response.data.password1) {
          // Display password-related errors
          setError(error.response.data.password1.join(" ")); // Join multiple errors into a single string
        } else if (error.response.data.non_field_errors) {
          // Display non-field errors (e.g., duplicate email)
          setError(error.response.data.non_field_errors.join(" "));
        } else {
          // Fallback error message
          setError("Registration failed. Please check your inputs or use a different email.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-white to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-xl relative">
        {/* Top-right "Already have an account" link */}
        <div className="absolute top-0 -right-20">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </div>

        {/* Back to Home link */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-primary mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="glass p-10 rounded-2xl">
          <div className="text-center mb-8">
              <img
              src="/homelogo-preview.png"
              alt="AskAnalytIQ Logo"
              className="mx-auto mb-4 h-auto w-52" // try w-52 or w-60
            />
            <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1> {/* Increased font size */}
            <p className="text-gray-600 mt-2">
              Please sign up to get started
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-6">
            {/* Google Button */}
  {/* Social Login Buttons */}
<div className="space-y-4 mb-6">
  {/* Notice Message */}
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-yellow-700">
          Our social login options are temporarily unavailable. Please sign up with your email address below.
        </p>
      </div>
    </div>
  </div>

  {/* Google Button */}
  <div className="relative group">
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
      disabled
    >
      <FcGoogle className="w-5 h-5" />
      <span>Sign up with Google</span>
    </Button>
  </div>

  {/* Microsoft Button */}
  <div className="relative group">
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
      disabled
    >
      <BsMicrosoftTeams className="w-5 h-5 text-blue-500" />
      <span>Sign up with Microsoft</span>
    </Button>
  </div>

  {/* Apple Button */}
  <div className="relative group">
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
      disabled
    >
      <FaApple className="w-5 h-5 text-gray-900" />
      <span>Sign up with Apple</span>
    </Button>
  </div>
</div>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name and Last Name (Side by Side) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    className="pl-10"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    className="pl-10"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email and Confirm Email (Side by Side) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-black" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmEmail">Confirm Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-black" />
                  <Input
                    id="confirmEmail"
                    type="email"
                    placeholder="Confirm your email"
                    className="pl-10"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // Toggle between text and password type
                  placeholder="Enter your password"
                  className="pl-10 pr-10" // Add padding for the eye icon
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* Eye icon to toggle password visibility */}
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" /> // Show EyeOff icon when password is visible
                  ) : (
                    <Eye className="w-5 h-5" /> // Show Eye icon when password is hidden
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"} // Toggle between text and password type
                  placeholder="Confirm your password"
                  className="pl-10 pr-10" // Add padding for the eye icon
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {/* Eye icon to toggle confirm password visibility */}
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" /> // Show EyeOff icon when password is visible
                  ) : (
                    <Eye className="w-5 h-5" /> // Show Eye icon when password is hidden
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
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
                'Sign Up'
              )}
            </Button>
          </form>

          {/* Log In Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;