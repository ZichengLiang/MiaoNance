'use client';
import Footer from "@/components/Footer";
import SocialLogin from "@/components/SocialLogin";

import { Poppins } from 'next/font/google';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});


import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Logging in:', { email, password });
    //We need to hit an API here. Validify if it's correct then return an error message.

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

        <div className="mb-4">
          <label className="block text-black dark:text-white text-sm mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError((prev) => ({ ...prev, password: '' }));
            }}
            className="w-full px-3 py-2 border rounded"
          />
          {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
        </div>

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-900"
        >
          Login
        </button>


        <div className="mt-6 text-center text-sm text-gray-400">or continue with</div>
        <SocialLogin/>


        <div className="mt-10 text-center text-black font-thin text-sm dark:text-gray-500 dark:font-bold">
            Don’t have an Account?{' '}
            <a href="#" className="font-bold text-black dark:text-white hover:underline">
                Register
            </a>
        </div>


      </form>
    </div>
  );
}
