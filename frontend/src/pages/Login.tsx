import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { BsMicrosoftTeams } from "react-icons/bs";
import { FaApple } from "react-icons/fa";
import { loginUser } from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Start loading

    try {
      const response = await loginUser(email, password);
      console.log("Login successful:", response);

      if (response.key) {
        localStorage.setItem("authToken", response.key);
      }

      navigate("/dashboard"); // Redirect after successful login
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        setError(error.response.data.message || "Login failed. Please check your credentials.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-white to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-xl relative">
        {/* Top-right "Create an account" link */}
        <div className="absolute top-0 -right-20">
          <span className="text-gray-600">New to AskAnalytIQ? </span>
          <Link to="/signup" className="text-primary hover:underline font-medium">
            Create an account
          </Link>
        </div>

        {/* Back to Home link */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-8 group">
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
            <h1 className="text-3xl font-bold text-gray-900">Sign in to AskAnalytIQ</h1>
            <p className="text-gray-600 mt-2">Please sign in to your account</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-6">
            {/* Google Button */}
            <div
              className="relative group"
              title="Feature coming soon"
            >
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
                disabled
              >
                <FcGoogle className="w-5 h-5" />
                <span>Sign in with Google</span>
              </Button>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-gray-800 text-white text-sm px-2 py-1 rounded">
                   under maintenance
                </span>
              </div>
            </div>

            {/* Microsoft Button */}
            <div
              className="relative group"
              title="Feature coming soon"
            >
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
                disabled
              >
                <BsMicrosoftTeams className="w-5 h-5 text-blue-500" />
                <span>Sign in with Microsoft</span>
              </Button>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-gray-800 text-white text-sm px-2 py-1 rounded">
                  under maintenance
                </span>
              </div>
            </div>

            {/* Apple Button */}
            <div
              className="relative group"
              title="Feature coming soon"
            >
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
                disabled
              >
                <FaApple className="w-5 h-5 text-gray-900" />
                <span>Sign in with Apple</span>
              </Button>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-gray-800 text-white text-sm px-2 py-1 rounded">
                  under maintenance
                </span>
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
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* Eye icon to toggle password visibility */}
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-primary hover:underline text-sm">
                Forgot password?
              </Link>
            </div>

            {/* Login Button with Loading Spinner */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 flex justify-center items-center"
              disabled={isLoading}
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
                "Log In"
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account?</span>{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;