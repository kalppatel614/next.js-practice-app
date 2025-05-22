"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function Signup() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const OnSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup Success", response.data);
      toast.success("Signup successful! Redirecting to login...");
      router.push("/login");
    } catch (error: any) {
      console.log("Signup Failed", error.message);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An unknown error occurred during signup."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-cyan-900  rounded-3xl">
        <h1 className="text-2xl">{loading ? "Processing" : "Signup"}</h1>
        <hr />
        <label className="text-1xl " htmlFor="username">
          username
        </label>
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-grey-600"
          type="text"
          id="username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="username"
          suppressHydrationWarning
        />
        <label htmlFor="email">email</label>
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-grey-600"
          type="text"
          id="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="email"
          suppressHydrationWarning
        />
        <label htmlFor="password">password</label>
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-grey-600"
          type="password"
          id="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="password"
          suppressHydrationWarning
        />
        <button
          onClick={OnSignup}
          className="p-2 border bg-white text-black border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 "
          suppressHydrationWarning
        >
          {buttonDisabled ? "No signup" : "Signup"}
        </button>
        <Link href="/login">Login</Link>
      </div>
    </div>
  );
}
