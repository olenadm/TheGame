// src/contexts/ProfileContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';


export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadProfile = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/v1/profile`, { withCredentials: true });
            setProfile(response.data);
            setLoading(false);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // User is not logged in, so set profile to null and stop loading
                setProfile(null);
                setLoading(false);
            } else {
                setError(err);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    // Function to refresh profile after login or updates
    const refreshProfile = () => {
        loadProfile(); // Reload profile after login or any other update
    };

    return (
        <ProfileContext.Provider value={{ profile, loading, error, refreshProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};
