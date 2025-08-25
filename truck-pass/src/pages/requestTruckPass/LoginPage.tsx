import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../autofill-fix.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setError('Please enter a valid email address');
    } else {
      setError('');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setIsLoading(true);
    setError('');
    // Simulate an API call delay
    setTimeout(() => {
      setIsLoading(false);
      // Navigate with state containing email
      navigate('/truckpass-otp-verification', { state: { email } });
    }, 1000);
  };

  const showBorder = isHovered || isFocused;

  return (
    <div className="font-inter flex flex-col min-h-screen px-4 py-8 bg-[#ECF5FF]">
      <div className="flex-grow flex justify-center items-center">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`bg-white rounded-2xl flex items-center shadow-md justify-center transition-all duration-200 ${
            showBorder ? 'border-2 border-[#006DE7]' : 'border-2 border-transparent'
          }`}
          style={{ width: 405, height: 350 }}
        >
          <div className="bg-white rounded-xl p-8 w-[90%]">
            <h1 className="text-2xl font-semibold text-[#181D27] mb-4 text-center">
              Log in to your account
            </h1>
            <p className="text-sm text-[#181D27] opacity-70 mb-6 text-center">
              Welcome back! Please enter your company’s registered email ID
            </p>

            <form className="space-y-4" onSubmit={handleEmailSubmit} noValidate>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  aria-invalid={!!error}
                  aria-describedby="email-error"
                  className={`w-full h-10 px-4 text-gray-900 placeholder-gray-500 rounded-lg transition focus:outline-none ${
                    error
                      ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border border-gray-300 focus:ring-2 focus:ring-[#006DE7] focus:border-[#006DE7]'
                  }`}
                />
                {error && (
                  <p id="email-error" className="text-red-600 text-sm mt-1" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!email || isLoading || !!error}
                className={`w-full h-10 rounded-lg text-white font-medium transition ${
                  !email || isLoading || !!error
                    ? 'bg-[#A0C3FF]'
                    : 'bg-[#006DE7] hover:bg-[#0050B3] cursor-pointer'
                }`}
              >
                {isLoading ? 'Please wait...' : 'Continue with email'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="text-sm text-[#717171] text-center pt-6 pb-4">
      </footer>
    </div>
  );
};

export default LoginPage;
