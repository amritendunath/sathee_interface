import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (token) {
            // Store the token securely
            localStorage.setItem('token', token);
            // Redirect to chatbox
            navigate('/chatbox');
        } else if (error) {
            // Handle error with more context
            navigate('/login', { 
                state: { 
                    error: 'Authentication failed. Please try again.' 
                } 
            });
        } else {
            // Handle case where neither token nor error is present
            navigate('/login', { 
                state: { 
                    error: 'Invalid authentication response' 
                } 
            });
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
    );
};

export default AuthCallback;