import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react"; // Import Eye and EyeOff icons
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { BsMicrosoftTeams } from "react-icons/bs"; // Microsoft icon
import { FaApple } from "react-icons/fa"; // Apple icon

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add login logic here
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-white to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        {/* Top-right "Create an account" link */}
        <div className="absolute top-0 -right-20">
          <span className="text-gray-600">New to SimpAI? </span>
          <Link to="/signup" className="text-primary hover:underline font-medium">
            Create an account
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

        <div className="glass p-8 rounded-2xl">
          <div className="text-center mb-8">
            <img
              src="/logo.png" // Replace with your logo path
              alt="SimpAI Logo"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">Sign in to SimpAI</h1>
            <p className="text-gray-600 mt-2">
              Please sign in to your account
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-6">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Sign in with Google</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <BsMicrosoftTeams className="w-5 h-5 text-blue-500" />
              <span>Sign in with Microsoft</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <FaApple className="w-5 h-5 text-gray-900" />
              <span>Sign in with Apple</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              Log In
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