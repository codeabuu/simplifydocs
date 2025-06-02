import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard"
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Layout from "./components/Layout";
import ConfirmEmail from "./pages/ConfirmEmail";
import CheckEmail from "./pages/CheckEmail";
import ConfirmEmailError from "./pages/ConfirmError";
import CheckoutStart from './components/CheckoutStart';
import ProtectedRoute from '@/components/ProtectedRoute';
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import ForgotPassword from "./components/Forgotpass";
import ResetPassword from "./components/Resetform";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/checkout/start" element={<CheckoutStart />} />
          <Route path="/subscription-success" element={<SubscriptionSuccess />} />
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element= {<Layout><Pricing/></Layout>}/>
          {/* <Route path="/pricinglog" element= {<PricingPage />}/> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm-email/:key" element={<ConfirmEmail />} />
          <Route path="/confirm-email/error" element={<ConfirmEmailError />} />

          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
