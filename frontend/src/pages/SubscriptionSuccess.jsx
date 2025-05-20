import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type"); // Get subscription type (monthly/yearly)
  
  useEffect(() => {
    localStorage.removeItem("authToken");
    
    const timer = setTimeout(() => {
      navigate("/login");
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          🎉 Subscription Successful! 🎉
        </h2>
        <p className="text-gray-700 mt-4">
          🚀 You have successfully subscribed to the{" "}
          <strong>{type === "monthly" ? "Monthly 📅" : "Yearly 📅"}</strong> plan.
        </p>
        <p className="text-gray-600 mt-4">
          🎊 Congratulations and thank you for choosing us! 🎊
        </p>
        <p className="text-gray-600 mt-4">
          ⏳ Redirecting you to the login page in a few seconds...
        </p>
        <p className="text-gray-500 mt-6">
          💡 Pro Tip: Check your email for a confirmation and enjoy your new benefits! 📧
        </p>
      </div>
    </div>
  );
}

export default SubscriptionSuccess;