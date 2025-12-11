"use client";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FullScreenLoader from "./app/account/FullScreenLoader";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const show = () => setLoading(true);
    const hide = () => setLoading(false);

    window.addEventListener("show-dashboard-loader", show);
    window.addEventListener("hide-dashboard-loader", hide);

    return () => {
      window.removeEventListener("show-dashboard-loader", show);
      window.removeEventListener("hide-dashboard-loader", hide);
    };
  }, []);

  useEffect(() => {
    console.log("test loading ==>", loading);
  }, [loading]);

  return (
    <>
      {loading && <FullScreenLoader />}
      {children}
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}
