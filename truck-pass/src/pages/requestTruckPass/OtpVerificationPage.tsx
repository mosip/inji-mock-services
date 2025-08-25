import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mailIcon from '../../assets/mailbutton.png';
import arrowLeft from '../../assets/arrow-left.png';

const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string }).email || '';

  // OTP state for 6 digits
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(5);           // Changed initial timer to 30s
  const [canResend, setCanResend] = useState(false);
  const [hoverResend, setHoverResend] = useState(false);
  const [hoverBack, setHoverBack] = useState(false);

  // Refs array for inputs
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Dummy OTP for illustration
  const DUMMY_OTP = '111111';

  // Start countdown on mount and on resend
  useEffect(() => {
    if (!canResend) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [canResend]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle digit input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    setError('');

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the complete OTP');
      return;
    }
    if (code !== DUMMY_OTP) {
      setError('Invalid OTP. Please try again.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/request-truck-pass/dashboard');
    }, 1000);
  };

  // Resend OTP
  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(6).fill(''));
    setTimer(5);
    setCanResend(false);
    setError('');
    inputRefs.current[0]?.focus();
  };

  // Back to login
  const handleBack = () => navigate('/truckpasslogin');

  const isFormValid = otp.every(digit => digit !== '');

  return (
    <div className="font-inter flex flex-col min-h-screen px-4 py-8 bg-[#ECF5FF]">
      <div className="flex-grow flex justify-center items-center">
        <div className="bg-white rounded-2xl flex items-center justify-center shadow-md" style={{ width: '550px', height: '550px' }}>
          <div className="rounded-xl p-8 w-[90%] bg-white">
            <div className="flex justify-center mb-3">
              <img src={mailIcon} alt="Mail Icon" className="w-15 h-15 object-contain" />
            </div>
            <h1 className="text-2xl font-semibold mb-4 text-center" style={{ color: '#181D27' }}>
              Check your email
            </h1>
            <p className="text-sm text-center mb-2" style={{ color: '#181D27', opacity: 0.7 }}>
              We sent an OTP to your email ID
            </p>
            <p className="text-sm font-medium text-center mb-8" style={{ color: '#006DE7' }}>
              {email}
            </p>
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-center space-x-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                    maxLength={1}
                    disabled={isLoading}
                    className={`font-mono w-14 h-14 text-center text-4xl font-semibold rounded-lg focus:outline-none transition border-2 bg-white text-[#006DE7] ${digit ? 'border-[#7CB3F1]' : 'border-[#D3D3D3]'
                      } focus:border-[#006DE7]`}
                  />
                ))}
              </div>
              {error && (
                <p className="text-sm text-center" style={{ color: '#FF4D4F' }}>
                  {error}
                </p>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className={`w-72 h-14 rounded-lg font-medium text-white transition ${!isFormValid || isLoading
                    ? 'bg-[#A0C3FF]'
                    : 'bg-[#006DE7] hover:bg-[#0050B3] cursor-pointer'
                    }`}
                >
                  {isLoading ? 'Verifying...' : 'Verify email'}
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <span className="text-sm" style={{ color: '#181D27', opacity: 0.7 }}>
                Didn&apos;t receive the email?{' '}
              </span>
              <button
                onClick={handleResend}
                disabled={!canResend}
                onMouseEnter={() => setHoverResend(true)}
                onMouseLeave={() => setHoverResend(false)}
                className="text-sm font-semibold bg-transparent border-none"
                style={{
                  color: canResend ? (hoverResend ? '#8A2BE2' : '#006DE7') : '#A0A0A0',
                  cursor: canResend ? 'pointer' : 'not-allowed',
                  textDecoration: 'none',
                }}
              >
                {canResend ? 'Click to resend' : `Resend in ${timer}s`}
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleBack}
                onMouseEnter={() => setHoverBack(true)}
                onMouseLeave={() => setHoverBack(false)}
                className="text-sm flex items-center font-semibold justify-center bg-transparent border-none transition"
                style={{
                  color: hoverBack ? '#006DE7' : '#535862',
                  cursor: 'pointer',
                  gap: '6px',
                }}
              >
                <img src={arrowLeft} alt="Back Arrow" className=" justify-center w-5 h-5" />
                 Back to log in
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-sm text-center pt-6 pb-4 font-inter" style={{ color: '#717171' }}>
        © 2025 TruckPass. All rights reserved.
      </footer>
    </div>
  );
};

export default OtpVerificationPage;
