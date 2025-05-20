import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "@/components/ProfilePopup";
import Dashboard from "@/pages/dashboard"; // Import the Dashboard component
import { fetchUserProfile } from "@/lib/api"; // Import the fetchUserProfile function

interface UserData {
  firstName: string;
  email: string;
  plan: string;
  expiryDate: string | null; // Use string or null for expiryDate
}

const Profile = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    email: "",
    plan: "", // Default plan (empty string)
    expiryDate: null, // Default to null
  });
  const navigate = useNavigate();

  // Fetch user profile data from the backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileData = await fetchUserProfile();
        setUserData({
          firstName: profileData.first_name,
          email: profileData.email,
          plan: profileData.plan || "Trial", // Use the plan from the backend or default to "Free"
          expiryDate: profileData.current_period_end || null, // Use the current_period_end from the backend or default to null
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfileData();
  }, []);

  // Close profile popup and navigate back
  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    window.history.back();
  };

  // Redirect to the upgrade plan section
  const handleUpgradePlan = () => {
    navigate("/pricinglog?loggedIn=true"); // Redirect to the upgrade plan page
  };

  // Handle cancel subscription
  const handleCancelSubscription = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your subscription?"
    );
    if (confirmCancel) {
      // Perform cancellation logic (e.g., API call to cancel subscription)
      alert("Your subscription has been canceled.");
      // Optionally, update the user's plan to "Free"
      setUserData((prev) => ({ ...prev, plan: "Free", expiryDate: null }));
    }
  };

  return (
    <div>
      {/* Render the Dashboard in the background */}
      <Dashboard />

      {/* Render the Profile Popup as an overlay */}
      <ProfilePopup
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
        userData={userData}
        onUpgradePlan={handleUpgradePlan} // Pass the upgrade plan handler
        onCancelSubscription={handleCancelSubscription} // Pass the cancel subscription handler
      />
    </div>
  );
};

export default Profile;