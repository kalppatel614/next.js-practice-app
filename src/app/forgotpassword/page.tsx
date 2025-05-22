"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmitRequest = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/users/forgotpassword", { email });
      toast.success("Password reset request sent!");
      setEmail("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900 text-white">
      <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-cyan-400">
          Forgot Password
        </h1>
        <hr className="w-full border-t border-gray-600 mb-6" />

        {/* Email Input Field */}
        <label htmlFor="email" className="text-lg font-medium mb-2 self-start">
          Email Address
        </label>
        <input
          className="p-3 border border-gray-600 rounded-lg mb-6 focus:outline-none focus:border-cyan-500 bg-gray-700 text-white w-full"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@example.com"
          required
          disabled={loading} // Disable input while loading
          suppressHydrationWarning
        />

        {/* Submit Button */}
        <button
          onClick={onSubmitRequest}
          className="p-3 bg-cyan-600 text-white font-semibold rounded-lg mb-4 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !email} // Disable if loading or email is empty
          suppressHydrationWarning
        >
          {loading ? "Sending Request..." : "Send Reset Link"}
        </button>

        {/* Message Display Area */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("success") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
