// src/app/account/components/FullScreenLoader.tsx
"use client";

import React from "react";

const FullScreenLoader = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(255,255,255,0.85)",
        zIndex: 9999,
      }}
      aria-hidden="true"
    >
      <div style={{ textAlign: "center" }}>
        <div
          className="spinner-border"
          role="status"
          style={{ width: 64, height: 64 }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
