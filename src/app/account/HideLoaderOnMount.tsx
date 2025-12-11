"use client";

import { useEffect } from "react";

export default function HideLoaderOnMount() {
  useEffect(() => {
    window.dispatchEvent(new Event("hide-dashboard-loader"));
  }, []);

  return null;
}
