"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function Profile() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout Success");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data._id);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Profile</h1>
      <hr />
      <p>Profile Page</p>
      <h2 className=" bg-green-500 p-3 mt-4 rounded-xl">
        {data === "nothing" ? (
          "No Data"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 rounded"
      >
        Log Out
      </button>
      <button
        onClick={getUserDetails}
        className="bg-green-800 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 rounded"
      >
        Get user details
      </button>
    </div>
  );
}
