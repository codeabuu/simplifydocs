import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "@/components/ProfilePopup";
import Dashboard from "@/pages/dashboard";
import { fetchUserProfile } from "@/lib/api";

interface UserData {
  firstName: string;
  email: string;
  plan: string;
  expiryDate: string | null;
  lastUpdated?: number; // Add timestamp for cache control
}

const CACHE_KEY = "userProfileCache";
const CACHE_DURATION = 14 * 24 * 60 * 60 * 1000; // 2 weeks in milliseconds

const Profile = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    email: "",
    plan: "Trial",
    expiryDate: null,
  });
  const navigate = useNavigate();

  // Check if cached data is still valid
  const isCacheValid = (cachedData: UserData): boolean => {
    if (!cachedData.lastUpdated) return false;
    
    // Check if cache is expired (older than 2 weeks)
    const isExpired = Date.now() - cachedData.lastUpdated > CACHE_DURATION;
    
    // Check if subscription/plan has changed (we'll compare with fresh data)
    // This will be handled in the fetch logic
    
    return !isExpired;
  };

  // Fetch user profile data with caching logic
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Try to get cached data
        const cachedDataString = localStorage.getItem(CACHE_KEY);
        let cachedData: UserData | null = null;
        
        if (cachedDataString) {
          cachedData = JSON.parse(cachedDataString);
          
          // If cache is valid, use it temporarily while we check for updates
          if (cachedData && isCacheValid(cachedData)) {
            setUserData(cachedData);
          }
        }

        // Always fetch fresh data in the background
        const profileData = await fetchUserProfile();
        const freshData: UserData = {
          firstName: profileData.first_name,
          email: profileData.email,
          plan: profileData.plan || "Trial",
          expiryDate: profileData.current_period_end || null,
          lastUpdated: Date.now(),
        };

        // Check if subscription/plan has changed
        const subscriptionChanged = cachedData && 
          (cachedData.plan !== freshData.plan || 
           cachedData.expiryDate !== freshData.expiryDate);

        // Update cache and UI if:
        // 1. There's no cached data
        // 2. Cache is expired
        // 3. Subscription/plan has changed
        if (!cachedData || !isCacheValid(cachedData) || subscriptionChanged) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
          setUserData(freshData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // If fetch fails but we have cached data, use it
        const cachedDataString = localStorage.getItem(CACHE_KEY);
        if (cachedDataString) {
          const cachedData = JSON.parse(cachedDataString);
          setUserData(cachedData);
        }
      }
    };

    fetchProfileData();
  }, []);

  // Clear cache when subscription changes (call this after plan changes)
  const clearProfileCache = () => {
    localStorage.removeItem(CACHE_KEY);
  };

  // Close profile popup and navigate back
  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    window.history.back();
  };

  // Redirect to the upgrade plan section
  const handleUpgradePlan = () => {
    navigate("/pricinglog?loggedIn=true");
  };

  // Handle cancel subscription
  const handleCancelSubscription = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your subscription?"
    );
    if (confirmCancel) {
      // Perform cancellation logic (e.g., API call to cancel subscription)
      alert("Your subscription has been canceled.");
      // Update the user's plan to "Free" and clear cache
      setUserData((prev) => ({ ...prev, plan: "Free", expiryDate: null }));
      clearProfileCache();
    }
  };

  return (
    <div>
      <Dashboard />
      <ProfilePopup
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
        userData={userData}
        onUpgradePlan={handleUpgradePlan}
        onCancelSubscription={handleCancelSubscription}
      />
    </div>
  );
};

export default Profile;