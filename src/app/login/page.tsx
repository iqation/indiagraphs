"use client";

import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<any>({});

  async function handleSubmit() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors(data.errors);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl mb-4">Login</h1>

      <input
        placeholder="Email"
        className="border p-2 mb-2 w-full"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      {errors?.email && <p className="text-red-500">{errors.email}</p>}

      <input
        placeholder="Password"
        type="password"
        className="border p-2 mb-2 w-full"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      {errors?.password && <p className="text-red-500">{errors.password}</p>}

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white p-2 w-full"
      >
        Login
      </button>
    </div>
  );
}
