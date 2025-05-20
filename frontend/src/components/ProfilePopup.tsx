import React from "react";

interface UserData {
  firstName: string;
  email: string;
  plan: string;
  expiryDate: string | null;
}

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  onUpgradePlan: () => void; // Handler for upgrading the plan
  onCancelSubscription: () => void; // Handler for canceling the subscription
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({
  isOpen,
  onClose,
  userData,
  onUpgradePlan,
  onCancelSubscription,
}) => {
  if (!isOpen) return null;

  // Format the expiry date
  const formatExpiryDate = (expiryDate: string | null) => {
    if (!expiryDate) return "N/A";

    // Parse the date string into a Date object
    const date = new Date(expiryDate);

    // Format the date as "YYYY-MM-DD"
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {/* User Information */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">First Name</label>
            <p className="text-lg font-semibold">{userData.firstName}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="text-lg font-semibold">{userData.email}</p>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <div>
                <label className="text-sm text-gray-600">Current Plan</label>
                <p className="text-lg font-semibold">{userData.plan}</p>
              </div>
              {userData.plan !== "Free" && ( // Only show cancel option for paid plans
                <button
                  onClick={onCancelSubscription}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Expiry Date</label>
            <p className="text-lg font-semibold">
              {formatExpiryDate(userData.expiryDate)}
            </p>
          </div>
        </div>

        {/* Upgrade Plan Button */}
        {userData.plan === "Free" && ( // Only show the button if the plan is Free
          <button
            onClick={onUpgradePlan}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upgrade Plan
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;