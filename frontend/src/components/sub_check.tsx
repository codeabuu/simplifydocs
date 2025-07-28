import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const SubscriptionCheck = ({ children }) => {
    const [hasSubscription, setHasSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/check-subscription-status/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                setHasSubscription(response.data.is_subscribed);
                
            } catch (error) {
                console.error('Error checking subscription:', error);
                // Handle error - maybe redirect to login or show error message
            } finally {
                setIsLoading(false);
            }
        };

        checkSubscription();
    }, []);

    if (isLoading) {
        return <div>Loading subscription status...</div>;
    }

    if (!hasSubscription) {
        return (
            <div className="subscription-required">
                <h2>Premium Content Locked</h2>
                <p>You need an active subscription to access this content.</p>
                <button onClick={() => navigate('/pricing')} className="subscribe-button">
                    Subscribe Now
                </button>
            </div>
        );
    }

    return children;
};

export default SubscriptionCheck;