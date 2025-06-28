"use client";
import { useState } from "react";

export default function KycPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    passportUrl: "",
    selfieUrl: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("pending");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };
  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">KYC Verification</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          className="w-full border p-2"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        {/* Placeholder URLs for now */}
        <input
          className="w-full border p-2"
          name="passportUrl"
          placeholder="Passport image URL"
          value={form.passportUrl}
          onChange={handleChange}
        />
        <input
          className="w-full border p-2"
          name="selfieUrl"
          placeholder="Selfie image URL"
          value={form.selfieUrl}
          onChange={handleChange}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit for Verification
        </button>
      </form>
      {status === "pending" && <p className="mt-4 text-yellow-600">Status: Pending</p>}
      {status === "error" && <p className="mt-4 text-red-600">Something went wrong.</p>}
    </main>
  );
}
