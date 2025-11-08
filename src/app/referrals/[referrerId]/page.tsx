"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';

const IconSpinner = ({ className = "w-5 h-5" }) => <svg className={`${className} animate-spin`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const IconCheck = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>;
const IconCopy = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7.75 4.5a.75.75 0 00-1.5 0v1h1.5v-1zm1.75 1.5H16.5A1.5 1.5 0 0118 7.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 16.5V9.25a.75.75 0 011.5 0v7.25c0 .138.112.25.25.25h9a.25.25 0 00.25-.25v-9c0-.138-.112-.25-.25-.25H9.5a.75.75 0 010-1.5z" /><path d="M4.75 6.5A1.5 1.5 0 016.25 5h3.5a.75.75 0 000-1.5h-3.5A3 3 0 003.25 6.5v8.5a.75.75 0 001.5 0V6.5z" /></svg>;
const IconExclamationTriangle = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M9.401 3.003c1.155-2.074 4.04-2.074 5.195 0l3.58 6.44c1.14 2.052-.323 4.674-2.585 4.674H7.806c-2.262 0-3.725-2.622-2.585-4.674l3.58-6.44zm-.742 12.004a.75.75 0 01.75-.75h6.202a.75.75 0 01.75.75v3.195a.75.75 0 01-.75.75H9.412a.75.75 0 01-.75-.75v-3.195z" clipRule="evenodd" /></svg>;
const IconGlobe = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 5.5a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zm-1.5 4.5v5.5a.75.75 0 001.5 0V10.75a.75.75 0 00-1.5 0z" clipRule="evenodd" /></svg>;
const IconApple = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.01c.732 0 1.464 0 2.197-.001.782-.001 1.564-.002 2.345-.002 1.396 0 2.44 1.146 2.361 2.538-.063 1.096-.28 2.18-.636 3.228-.67 1.956-2.083 3.568-3.95 4.476-.046.023-.092.046-.14.072-.058.031-.118.064-.175.106-.11.082-.2.18-.283.284-.287.354-.53.743-.733 1.157-.04.084-.078.17-.113.255-.262.673-.424 1.39-.475 2.133-.047.674-.029 1.353.053 2.023.085.698.243 1.38.455 2.04.148.459.324.912.53 1.356.402.883.83 1.764 1.258 2.645.228.473.473.94.73 1.4.082.144.17.287.257.43.084.14.17.279.255.417.156.258.33.513.518.76.126.166.26.326.404.48.248.267.514.526.797.772.07.06.14.12.21.179.055.048.11.096.164.143.277.245.57.48.877.697.108.077.21.15.318.219.08.052.16.104.24.156.255.17.525.33.81.478.077.04.15.077.224.113.19.09.387.17.59.243.102.036.202.067.303.097.13.038.26.07.39.098.156.033.313.06.47.085.068.01.135.02.204.03.07.01.14.02.21.028.164.019.33.03.498.033.407.009.814-.012 1.218-.063.424-.053.847-.133 1.26-.247.53-.146 1.05-.33 1.554-.57.088-.041.174-.084.26-.126.353-.173.7-.367 1.037-.582.046-.029.092-.058.138-.088.225-.145.44-.303.635-.47.168-.146.32-.303.456-.47.08-.098.15-.195.22-.295.12-.17.228-.35.32-.533.093-.186.17-.37.23-.556.12-.37.21-.747.28-1.127.067-.364.11-.734.11-1.107.001-.418-.035-.836-.108-1.246-.073-.41-.186-.813-.33-1.204-.047-.128-.098-.256-.15-.383-.16-.39-.36-.775-.6-1.14-.112-.17-.23-.338-.358-.506-.213-.284-.447-.557-.698-.816-.142-.146-.28-.3-.432-.444-.336-.316-.693-.615-1.072-.893-.114-.084-.23-.166-.347-.245-.27-.18-.546-.353-.83-.51-.18-.097-.36-.19-.54-.277-.28-.135-.57-.26-1.13-.518-.328-.15-.658-.3-1-.444-.22-.097-.442-.19-.666-.277-1.168-.458-2.35-.765-3.56-.91-.703-.086-1.41-.128-2.115-.128-.278 0-.557.005-.835.014z" /></svg>;
const IconBolt = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M11.54 22.351A2.43 2.43 0 0014.053 21h-2.585a2.43 2.43 0 01-2.585-1.351l-1.03-1.895a2.43 2.43 0 00-2.196-1.196L3.92 17.5a2.43 2.43 0 01-1.031-4.045l1.03-1.895A2.43 2.43 0 004.91 9.366l1.03-1.895a2.43 2.43 0 012.196-1.196L10.38 5.5a2.43 2.43 0 00-2.196-1.196L7.154 2.41a2.43 2.43 0 00-2.196 1.196L3.92 5.5a2.43 2.43 0 01-1.031 4.045l1.03 1.895A2.43 2.43 0 004.91 13.366l1.03 1.895a2.43 2.43 0 012.196 1.196l1.03 1.895a2.43 2.43 0 002.585 1.351z" clipRule="evenodd" /></svg>;
const IconFingerprint = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M3.75 3.75c1.137 0 2.194.27 3.149.752a1.5 1.5 0 00.74 1.285 34.03 34.03 0 003.541 2.228 12.057 12.057 0 013.267-3.267c3.85-3.85 10.274-1.636 10.274-1.636s-2.096 6.425-5.946 10.274a12.057 12.057 0 01-3.267 3.267 34.029 34.029 0 00-2.228 3.541 1.5 1.5 0 00-1.285.74c-.482.955-.752 2.012-.752 3.149V21.5a.75.75 0 01-1.5 0v-.75c0-1.137-.27-2.194-.752-3.149a1.5 1.5 0 00-.74-1.285 34.029 34.029 0 00-3.541-2.228 12.057 12.057 0 01-3.267-3.267c-3.85-3.85-1.636-10.274-1.636-10.274s6.425-2.096 10.274 1.636zm2.25 1.854c1.11 0 2.164.24 3.111.69.24.116.444.27.608.468a32.555 32.555 0 002.091 1.944c.48.243.987.458 1.517.643a10.557 10.557 0 003.181 3.181c3.084 3.083 4.417 7.025 4.877 8.356a.75.75 0 01-.703.955c-1.332-.46-5.274-1.802-8.357-4.886a10.557 10.557 0 00-3.18-3.181c-.185-.53-.4-1.037-.643-1.517a32.555 32.555 0 00-1.944-2.091c-.198-.164-.352-.368-.468-.608-.45-.947-.69-1.996-.69-3.111v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" /></svg>;

const API_URL = 'http://216.246.113.71:8080/app-settings/referral_reward_amount';
const MAX_RETRIES = 5;
const APP_SCHEME = 'myapp://';
const FALLBACK_TIMEOUT = 3000;
const APP_STORE_URL = 'https://apps.apple.com/us/app/yourappname/id1234567890';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.yourapp.bundle';
const OFFICIAL_WEB_URL = 'https://thenationalbuilders.com/';

const MAIN_COLOR = '#b22222'; 
const HOVER_COLOR = '#991d1d';
const TEXT_COLOR = '#8a1a1a'; 

const getOS = () => {
    if (typeof window === 'undefined') return 'web';
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) return 'android';
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
    return 'web';
};

export default function ReferralLandingPage() {
    const [referrerId, setReferrerId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showFallback, setShowFallback] = useState(false);
    const [copyStatus, setCopyStatus] = useState('idle');
    const [rewardAmount, setRewardAmount] = useState('15.00'); 
    
    const osType = useMemo(() => getOS(), []);
    const isMobile = osType === 'ios' || osType === 'android';

    const fetchRewardAmount = useCallback(async (retryCount = 0) => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (data && data.value) {
                setRewardAmount(parseFloat(data.value).toFixed(2));
            } else {
                console.warn('API returned unexpected data structure, using default amount.');
            }
        } catch (error) {
            if (retryCount < MAX_RETRIES) {
                const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s, 8s, 16s
                setTimeout(() => fetchRewardAmount(retryCount + 1), delay);
            } 
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            const segments = path.split('/').filter(s => s.length > 0);
            const lastSegment = segments.pop();

            if (lastSegment) {
                setReferrerId(lastSegment);
            }
        }
        
        fetchRewardAmount();

        setIsLoading(false);
    }, [fetchRewardAmount]);

    useEffect(() => {
        if (isLoading || !referrerId) return;

        const deepLinkUrl = `${APP_SCHEME}register?referrerId=${referrerId}`;
        let redirectAttempt, fallbackTimer;

        if (isMobile) {
            redirectAttempt = setTimeout(() => {
                window.location.href = deepLinkUrl;
            }, 100);

            fallbackTimer = setTimeout(() => {
                setShowFallback(true);
            }, FALLBACK_TIMEOUT);
        } else {
            setShowFallback(true);
        }

        return () => {
            clearTimeout(redirectAttempt);
            clearTimeout(fallbackTimer);
        };
    }, [referrerId, isMobile, isLoading]);

    const handleCopy = useCallback(() => {
        if (referrerId) {
            navigator.clipboard.writeText(referrerId).then(() => {
                setCopyStatus('copied');
                setTimeout(() => setCopyStatus('idle'), 2000);
            }).catch(() => {
                try {
                    const tempInput = document.createElement('textarea');
                    tempInput.value = referrerId;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    setCopyStatus('copied');
                    setTimeout(() => setCopyStatus('idle'), 2000);
                } catch (err) {
                    setCopyStatus('error');
                    setTimeout(() => setCopyStatus('idle'), 2000);
                }
            });
        }
    }, [referrerId]);


    const MobileFallbackButtons = () => {
        const isAndroid = osType === 'android';

        const buttonClass = `w-full inline-flex items-center justify-center px-6 py-3 text-lg font-bold rounded-xl text-white shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition duration-300`;
        const redBgStyle = { backgroundColor: MAIN_COLOR };
        const redHoverStyle = { backgroundColor: HOVER_COLOR };
        
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white border-b border-white/40 pb-3 mb-3 drop-shadow-sm">
                    {isAndroid ? 'Get it on Google Play!' : 'Download on the App Store'}
                </h3>
                
                {osType === 'ios' && (
                    <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"
                        className={`${buttonClass}`}
                        style={redBgStyle}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = HOVER_COLOR}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = MAIN_COLOR}
                    >
                        <IconApple className="w-5 h-5 mr-3" />
                        App Store
                    </a>
                )}
                
                {isAndroid && (
                    <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"
                        className={`${buttonClass}`}
                        style={redBgStyle}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = HOVER_COLOR}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = MAIN_COLOR}
                    >
                        <IconBolt className="w-5 h-5 mr-3" />
                        Google Play
                    </a>
                )}
            </div>
        );
    };

    const DesktopFallbackButton = () => {
        const buttonClass = `w-full inline-flex items-center justify-center px-6 py-3 text-lg font-bold rounded-xl text-white shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition duration-300`;
        const redBgStyle = { backgroundColor: MAIN_COLOR };
        const redHoverStyle = { backgroundColor: HOVER_COLOR };
        
        return (
            <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white mt-6 drop-shadow-sm">
                    Access your referral bonus on our official website.
                </h3>
                <a href={OFFICIAL_WEB_URL} target="_blank" rel="noopener noreferrer"
                    className={`${buttonClass}`}
                    style={redBgStyle}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = HOVER_COLOR}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = MAIN_COLOR}
                >
                    <IconGlobe className="w-5 h-5 mr-3" />
                    Go to Official Website
                </a>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4"
                style={{ backgroundColor: '#0f172a' }}>
                <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 sm:p-12 text-center">
                    {/* Color principal en el spinner */}
                    <IconSpinner className="w-8 h-8 mx-auto animate-spin mb-4" style={{ color: MAIN_COLOR }} />
                    <h1 className="text-3xl font-extrabold text-gray-900">Loading Invitation...</h1>
                </div>
            </div>
        );
    }

    if (!referrerId) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4"
                style={{ backgroundColor: '#0f172a' }}>
                <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 sm:p-12 text-center">
                    {/* Color principal en el ícono de error */}
                    <IconExclamationTriangle className="w-10 h-10 mx-auto mb-4" style={{ color: MAIN_COLOR }} />
                    <h1 className="text-3xl font-extrabold" style={{ color: MAIN_COLOR }}>Invalid Link</h1>
                    <p className="text-gray-700 mt-4">Referral code not found. Please contact the person who invited you.</p>
                    <div className="mt-6">
                        <DesktopFallbackButton />
                    </div>
                </div>
            </div>
        );
    }
    
    
    const message = isMobile && !showFallback
        ? "We're attempting to open your mobile app to apply the bonus."
        : isMobile && showFallback
        ? "The app didn't open automatically! Use the download button below to secure your bonus."
        : "You are on a desktop device. Please visit our official website or access this link from a mobile device.";
    
    const CardIcon = isMobile && !showFallback ? IconSpinner : IconFingerprint;
    const iconColor = isMobile && !showFallback ? 'text-white animate-spin' : 'text-white';

    return (
        <div className="min-h-screen flex items-center justify-center p-4 transition-all duration-500 ease-in-out"
            style={{ 
                backgroundImage: 'url(../images/fondo.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#0f172a' // Color de reserva
            }}>
            
            <div className="max-w-md lg:max-w-3xl w-full rounded-3xl p-6 sm:p-8 text-center shadow-2xl transition-all duration-500 ease-in-out frosted-glass"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '4px solid rgba(255, 255, 255, 0.2)',
                }}>
                
                <div className="flex flex-col items-center space-y-4">
                    
                    <div className="flex flex-col items-center">
                        <img 
                            src="../images/icon-tnb.png" 
                            alt="The National Builders Icon"
                            className="w-16 h-16 mb-2 rounded-xl shadow-lg"
                            // Reserva si la imagen falla al cargar
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/64x64/2e3a87/ffffff?text=TNB'; }}
                        />
                        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Exclusive Invitation!</h1>
                    </div>

                    <p className="text-base text-white font-medium drop-shadow-sm p-2 rounded-lg bg-black/10">
                        {message}
                    </p>
                    
                    <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 w-full shadow-lg">
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                            Your Referral Code:
                        </p>
                        <div className="flex items-center space-x-2"> 
                            <p className="font-extrabold text-xl tracking-wider select-all truncate flex-grow text-center" style={{ color: TEXT_COLOR }}>
                                {referrerId}
                            </p>
                            <button 
                                onClick={handleCopy}
                                className={`p-3 rounded-xl transition-all duration-300 flex items-center text-white shadow-md ${
                                    copyStatus === 'copied' ? 'bg-green-500' : 
                                    copyStatus === 'error' ? 'bg-red-500' :
                                    ''
                                }`}
                                style={copyStatus === 'idle' ? { backgroundColor: MAIN_COLOR } : {}}
                                onMouseEnter={(e) => { if (copyStatus === 'idle') e.currentTarget.style.backgroundColor = HOVER_COLOR; }}
                                onMouseLeave={(e) => { if (copyStatus === 'idle') e.currentTarget.style.backgroundColor = MAIN_COLOR; }}
                                title="Copy Referral Code"
                            >
                                {copyStatus === 'copied' ? <IconCheck className="w-5 h-5" /> : 
                                 copyStatus === 'error' ? <IconExclamationTriangle className="w-5 h-5" /> : 
                                 <IconCopy className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className={`text-xs mt-2 ${copyStatus === 'copied' ? 'text-green-700 font-bold' : 'text-gray-500'}`}>
                            {copyStatus === 'copied' ? 'Code Copied to Clipboard!' : `This code secures your $${rewardAmount} USD bonus.`}
                        </p>
                    </div>

                    {showFallback && (
                        <div className="mt-4 pt-6 border-t border-white/40 w-full">
                            {isMobile ? <MobileFallbackButtons /> : <DesktopFallbackButton />}
                        </div>
                    )}
                    
                    {isMobile && !showFallback && (
                        <div className="flex items-center space-x-2 text-white font-semibold mt-4">
                            <CardIcon className={`w-6 h-6 ${iconColor}`} />
                            <span>Processing Deep Link...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}