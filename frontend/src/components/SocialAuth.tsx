'use client';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

type SocialAuthProps = {
  mode: 'login' | 'register';
};

export default function SocialAuth({ mode }: SocialAuthProps) {
  const label = mode === 'register' ? 'Register' : 'Login';

  return (
    <div className="flex justify-center gap-4 mt-6">
      {/* Google */}
      <button
        onClick={() => signIn('google')}
        className="w-12 h-12 p-2 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-105 transition"
        title={`${label} with Google`}
      >
        <Image src="/google.svg" alt={`${label} with Google`} width={24} height={24} />
      </button>

      {/* Apple */}
      <button
        onClick={() => signIn('apple')}
        className="w-12 h-12 p-2 bg-black rounded-full flex items-center justify-center hover:scale-105 transition"
        title={`${label} with Apple`}
      >
        <Image src="/apple.svg" alt={`${label} with Apple`} width={24} height={24} />
      </button>

      {/* WeChat */}
      <button
        onClick={() => signIn('wechat')}
        className="w-12 h-12 p-2 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition"
        title={`${label} with WeChat`}
      >
        <Image src="/wechat.svg" alt={`${label} with WeChat`} width={24} height={24} />
      </button>
    </div>
  );
}
