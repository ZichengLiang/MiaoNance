'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Footer from '@/components/Footer';
import SocialAuth from '@/components/SocialAuth';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const isDisabled = !email || !password;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in:', { email, password });
    // TODO: hit login API and handle error/redirect
  };

  return (
    <div
      className={`${poppins.variable} font-poppins min-h-screen w-full flex justify-center items-center bg-[url('/light_mode_bg.png')] dark:bg-[url('/darker_contrasted_bg.png')] bg-cover bg-center`}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white text-black dark:bg-[#111111] dark:text-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h4 className="text-2xl">Welcome!</h4>
        <h2 className="mb-2 font-bold">Sign in</h2>

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
            className="w-full px-3 py-2 pr-10 border rounded"
          />

          <div className="absolute inset-y-0 right-3 flex items-center group">
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <div className="absolute bottom-full mb-1 right-0 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {showPassword ? 'Hide password' : 'Show password'}
            </div>
          </div>
        </div>
        {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
      </div>


        {/* Options */}
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
        </div>

        {/* Login Button */}
        <button
        type="submit"
        disabled={isDisabled}
        className={`w-full py-2 px-4 rounded transition
            ${isDisabled
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-black text-white hover:bg-gray-900 shadow-none transition-shadow duration-150 cursor-pointer hover:shadow-md hover:shadow-black'
            }`}
        >
        Login
        </button>

        {/* Social Auth */}
        <div className="mt-6 text-center text-sm text-gray-400">or continue with</div>
        <SocialAuth mode="login" />

        {/* Link to Register */}
        <div className="mt-10 text-center text-black font-thin text-sm dark:text-gray-500 dark:font-bold">
          Don’t have an Account?{' '}
          <a href="/register" className="font-bold text-black dark:text-white hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
}
