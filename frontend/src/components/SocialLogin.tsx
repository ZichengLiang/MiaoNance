import Image from 'next/image';
import { signIn } from 'next-auth/react';

export default function SocialLogin() {
  return (
    <div className="flex justify-center gap-4 mt-6">
      {/* Google */}
      <button
        onClick={() => signIn('google')}
        className="w-12 h-12 p-2 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-105 transition"
        title="Continue with Google"
      >
        <Image src="/google.svg" alt="Google login" width={24} height={24} />
      </button>

      {/* Apple */}
      <button
        onClick={() => signIn('apple')}
        className="w-12 h-12 p-2 bg-black rounded-full flex items-center justify-center hover:scale-105 transition"
        title="Continue with Apple"
      >
        <Image src="/apple.svg" alt="Apple login" width={24} height={24} />
      </button>

      {/* WeChat */}
      <button
        onClick={() => signIn('wechat')}
        className="w-12 h-12 p-2 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition"
        title="Continue with WeChat"
      >
        <Image src="/wechat.svg" alt="WeChat login" width={24} height={24} />
      </button>
    </div>
  );
}
