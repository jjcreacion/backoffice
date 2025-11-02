"use client";

import { useState, useEffect, useMemo } from 'react';

const APP_SCHEME = 'myapp://';
const FALLBACK_TIMEOUT = 3000; 
const APP_STORE_URL = 'https://apps.apple.com/us/app/yourappname/id1234567890'; 
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.yourapp.bundle';
const OFFICIAL_WEB_URL = 'https://thenationalbuilders.com/';

const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export default function ReferralLandingPage() {
    const [referrerId, setReferrerId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showFallback, setShowFallback] = useState(false);
    
    const isMobile = useMemo(() => isMobileDevice(), []);

    useEffect(() => {
        if (typeof window !== 'undefined' && isLoading) {
            const path = window.location.pathname;
            const segments = path.split('/').filter(s => s.length > 0);
            const lastSegment = segments.pop();

            if (lastSegment) {
                setReferrerId(lastSegment);
            }
            setIsLoading(false);
        }
    }, [isLoading]);

    useEffect(() => {
        if (isLoading || !referrerId) return;

        const deepLinkUrl = `${APP_SCHEME}register?referrerId=${referrerId}`;

        if (isMobile) {
            const redirectAttempt = setTimeout(() => {
                window.location.href = deepLinkUrl;
            }, 100);

            const fallbackTimer = setTimeout(() => {
                setShowFallback(true);
            }, FALLBACK_TIMEOUT);

            return () => {
                clearTimeout(redirectAttempt);
                clearTimeout(fallbackTimer);
            };
        } else {
            setShowFallback(true);
        }
    }, [referrerId, isMobile, isLoading]);

    const MobileFallbackButtons = () => (
        <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-700 mt-2">
                Download the App to apply your bonus
            </h3>
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"
               className="w-full inline-flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-xl text-white bg-gray-800 hover:bg-gray-900 transition duration-200 transform hover:scale-[1.02] shadow-md">
                Download on the App Store
            </a>
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"
               className="w-full inline-flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-xl text-white bg-green-600 hover:bg-green-700 transition duration-200 transform hover:scale-[1.02] shadow-md">
                Get it on Google Play
            </a>
        </div>
    );

    const DesktopFallbackButton = () => (
        <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-700 mt-6">
                Access from your mobile or visit our official website
            </h3>
            <a href={OFFICIAL_WEB_URL} target="_blank" rel="noopener noreferrer"
               className="w-full inline-flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200 transform hover:scale-[1.02] shadow-md">
                Go to Official Website
            </a>
        </div>
    );

    if (isLoading) {
         return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[#0d1222]">
                <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 sm:p-12 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 animate-pulse">Loading Invitation...</h1>
                </div>
            </div>
        );
    }

    if (!referrerId) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[#0d1222]">
                <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 sm:p-12 text-center">
                    <h1 className="text-3xl font-extrabold text-red-600">Invalid Link</h1>
                    <p className="text-gray-700 mt-4">Referral code not found. Please contact the person who invited you.</p>
                    <div className="mt-6">
                        <DesktopFallbackButton />
                    </div>
                </div>
            </div>
        );
    }
    
    const message = isMobile && !showFallback
        ? "We are attempting to open your mobile app to apply the bonus..."
        : isMobile && showFallback
        ? "The app didn't open! Use the download links to secure your bonus."
        : "You are on a desktop device. Please download the mobile app or visit the official website.";


    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0d1222]">
            <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 sm:p-12 text-center transition-all duration-500 ease-in-out">
                
                <div className="flex flex-col items-center space-y-8">
                    
                    <div className="flex flex-col items-center">
                        <svg className={`w-16 h-16 text-indigo-600 mb-4 ${!showFallback && isMobile ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zM12 8V4M12 20v-4"></path>
                        </svg>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Exclusive Invitation!</h1>
                    </div>

                    <p className="text-xl text-gray-700 font-medium">
                        {message}
                    </p>
                    
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 w-full">
                        <p className="text-sm font-semibold text-indigo-600">
                            Referral Code:
                        </p>
                        <p className="font-extrabold text-indigo-800 text-2xl tracking-wider select-text">
                            {referrerId}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            This code secures your $15 USD bonus.
                        </p>
                    </div>

                    {showFallback && (
                        <div className="mt-10 pt-6 border-t border-gray-100 w-full">
                            {isMobile ? <MobileFallbackButtons /> : <DesktopFallbackButton />}
                        </div>
                    )}
                    
                    {isMobile && !showFallback && (
                        <div className="flex items-center space-x-2 text-indigo-600 font-medium">
                            <span className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                            <span>Processing Deep Link...</span>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
