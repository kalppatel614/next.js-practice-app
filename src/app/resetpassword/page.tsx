"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if window is defined to ensure this runs only on the client
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");
      if (tokenFromUrl) {
        setToken(tokenFromUrl);
        console.log("Token extracted from URL:", tokenFromUrl);
      } else {
        setMessage("No reset token found in the URL.");
        toast.error("No reset token found.");
      }
    }
  }, []);

  const onResetPassword = async () => {
    // Client-side validation
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("/api/users/resetpassword", {
        token,
        newPassword,
      });
      toast.success("Password reset successful!");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }

    setLoading(true);
    setMessage("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900 text-white">
      <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-cyan-400">
          Reset Password
        </h1>
        <hr className="w-full border-t border-gray-600 mb-6" />

        {/* Display token status or message */}
        {token ? (
          <p className="text-lg mb-4 text-gray-400">
            Token loaded. Enter your new password.
          </p>
        ) : (
          <p className="text-lg mb-4 text-red-400">
            {message || "Waiting for token..."}
          </p>
        )}

        {/* New Password Input */}
        <label
          htmlFor="newPassword"
          className="text-lg font-medium mb-2 self-start"
        >
          New Password
        </label>
        <input
          className="p-3 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-cyan-500 bg-gray-700 text-white w-full"
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
          disabled={loading || !token} // Disable if loading or no token
        />

        {/* Confirm New Password Input */}
        <label
          htmlFor="confirmPassword"
          className="text-lg font-medium mb-2 self-start"
        >
          Confirm New Password
        </label>
        <input
          className="p-3 border border-gray-600 rounded-lg mb-6 focus:outline-none focus:border-cyan-500 bg-gray-700 text-white w-full"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
          disabled={loading || !token} // Disable if loading or no token
        />

        {/* Reset Password Button */}
        <button
          onClick={onResetPassword}
          className="p-3 bg-cyan-600 text-white font-semibold rounded-lg mb-4 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !token || !newPassword || !confirmPassword} // Disable if loading, no token, or fields empty
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>

        {/* Message Display Area */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("successful") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
