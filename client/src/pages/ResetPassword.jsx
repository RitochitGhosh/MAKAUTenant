import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [form, setForm] = useState({
    email: '',
    newPassword: '',
  });

  const [enabled, setEnabled] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 minutes
  const [tokenData, setTokenData] = useState({ token: '', id: '' });
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    let timer;
    if (enabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (enabled && countdown <= 0) {
      toast.error('Verification token expired! Try again.');
      setEnabled(false);
    }
    return () => clearInterval(timer);
  }, [enabled, countdown]);

  const handleEnterEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();

      if (data.status !== 'success') {
        toast.error('Invalid email address!');
        return;
      }

      toast.success('Confirmation mail sent!');
      toast.success('Fetching token...');
      setEnabled(true);
      setCountdown(900); // Reset timer

      setTokenData({
        token: data.data.verifyUrl, // Actually just the token
        id: data.data.id,
      });
      console.log("TokenData: ", tokenData);
    } catch (error) {
      console.error('Reset password error1: ', error);
      toast.error('Something went wrong!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/auth/reset-password/${tokenData.id}/${tokenData.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: form.newPassword }),
      });

      const data = await res.json();

      if (data.status !== 'success') {
        toast.error(data.message || 'Something went wrong!!');
        return;
      }

      toast.success('Password reset successfully!');
      setForm({ email: '', newPassword: '' });
      setTimeout(() => navigate('/sign-in'), 3000);
    } catch (error) {
      console.error('Reset password error2: ', error);
      toast.error('Something went wrong!');
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(countdown / 60).toString().padStart(2, '0');
    const seconds = (countdown % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-4">
      <div className="w-full max-w-md bg-white border-2 border-black shadow-[4px_4px_0px_#000] p-6 rounded-sm">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-6">
          Reset Password
        </h2>

        {/* Email Form */}
        <form onSubmit={handleEnterEmail} className="mb-6">
          <label className="block font-bold mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter your registered email"
            className="w-full border-2 border-black rounded-sm px-3 py-2 mb-2 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#f5e9b3] hover:text-black transition"
          >
            Send Reset Link
          </button>
        </form>

        {/* Timer */}
        {enabled && (
          <p className="text-sm text-gray-700 font-semibold mb-4">
            ⏳ Token valid for: <span className="text-red-600">{formatTime()}</span>
          </p>
        )}

        {/* New Password Form */}
        <form onSubmit={handleSubmit}>
          <label className="block font-bold mb-1">New Password</label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            placeholder="Enter new password"
            className="w-full border-2 border-black rounded-sm px-3 py-2 mb-4 focus:outline-none"
            disabled={!enabled}
            required
          />

          <button
            type="submit"
            className={`w-full ${
              enabled
                ? 'bg-black text-white'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            } py-2 rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition`}
            disabled={!enabled}
          >
            Reset Password
          </button>
        </form>
      </div>
    </section>
  );
}
