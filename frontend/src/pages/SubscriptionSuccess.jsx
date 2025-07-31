import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Mail, Rocket, Clock } from "lucide-react";

function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type");
  
  useEffect(() => {
    localStorage.removeItem("authToken");
    
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header with icon */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm">
              <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Subscription Activated
            </h2>
            
            <div className="flex items-center justify-center py-3 px-5 bg-indigo-50 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="font-medium text-indigo-700">
                {type === "monthly" ? "Monthly Plan" : "Annual Plan"}
              </span>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <Rocket className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                <p>Your premium features are now unlocked and ready to use!</p>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                <p>We've sent a confirmation email with all the details.</p>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                <p>You'll be redirected to login in 5 seconds...</p>
              </div>
            </div>
            
            <div className="pt-4">
              <button 
                onClick={() => navigate("/login")} 
                className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Go to Login Now
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          Need help? <a href="mailto:support@askanalytiq.com" className="text-indigo-600 hover:underline">Contact support</a>
        </div>
      </motion.div>
    </div>
  );
}

export default SubscriptionSuccess;