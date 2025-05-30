"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const OnLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login Success", response.data);
      toast.success("Login Success");
      {
        loading ? "Processing" : "Login";
      }
      router.push("/profile");
    } catch (error: any) {
      console.log("Login Failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-cyan-900  rounded-3xl">
        <h1 className="text-2xl">{loading ? "Processing" : "Login"}</h1>
        <hr />

        <label className="text-1xl mr-2" htmlFor="email">
          Email
        </label>
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-grey-600"
          type="text"
          id="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="email"
          suppressHydrationWarning
        />
        <label htmlFor="password">Password</label>
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
          onClick={OnLogin}
          className="p-2 border bg-white text-black border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
          suppressHydrationWarning
        >
          Login
        </button>

        <hr />
        <Link
          href="/forgotpassword"
          className="text-blue-300 hover:underline mb-2"
        >
          Forgot Password?
        </Link>
        <Link href="/signup">Signup</Link>
      </div>
    </div>
  );
}
