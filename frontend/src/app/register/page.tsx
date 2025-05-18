'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Poppins } from 'next/font/google';
import SocialAuth from '@/components/SocialAuth';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '', confirm: '' });
  const isDisabled = !email || !password || !confirmPassword;

  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { email: '', password: '', confirm: '' };

    if (!email.includes('@')) {
      newErrors.email = 'Invalid email';
      hasError = true;
    }

    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (password !== confirmPassword) {
      newErrors.confirm = 'Passwords do not match';
      hasError = true;
    }

    setError(newErrors);

    if (!hasError) {
      console.log('Registering:', { email, password });
      // TODO: Call register API
    }
  };

  return (
    <div
      className={`${poppins.variable} font-poppins min-h-screen w-full flex justify-center items-center bg-[url('/light_mode_bg.png')] dark:bg-[url('/darker_contrasted_bg.png')] bg-cover bg-center`}
    >
      <form
        onSubmit={handleRegister}
        className="bg-white text-black dark:bg-[#111111] dark:text-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h4 className="text-2xl">Sign Up!</h4>
         <h2 className="mb-2 font-bold">Create your account</h2>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-black dark:text-white text-sm mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError((prev) => ({ ...prev, email: '' }));
            }}
            className="w-full px-3 py-2 border rounded"
          />
          {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-black dark:text-white text-sm mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError((prev) => ({ ...prev, password: '' }));
              }}
              className="w-full px-3 py-2 border rounded pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-8">
          <label className="block text-black dark:text-white text-sm mb-2">Re-Enter Password</label>
          <div className="relative">
            <input
              type={'password'}
              placeholder="Re-enter your Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError((prev) => ({ ...prev, confirm: '' }));
              }}
              className="w-full px-3 py-2 border rounded pr-10"
            />
          </div>
          {error.confirm && <p className="text-red-500 text-xs mt-1">{error.confirm}</p>}
        </div>

        {/* Submit Button */}
        <button
        type="submit"
        disabled={isDisabled}
        className={`w-full py-2 px-4 rounded transition
            ${isDisabled
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-black text-white hover:bg-gray-900 shadow-none transition-shadow duration-150 cursor-pointer hover:shadow-md hover:shadow-black'
            }`}
        >
        Register
        </button>

        {/* Social Auth */}
        <div className="mt-6 text-center text-sm text-gray-400">or continue with</div>
        <SocialAuth mode="register" />

        {/* Link to Login */}
        <div className="mt-10 text-center text-black font-thin text-sm dark:text-gray-500 dark:font-bold">
          Already have an account?{' '}
          <a href="/login" className="font-bold text-black dark:text-white hover:underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
}
