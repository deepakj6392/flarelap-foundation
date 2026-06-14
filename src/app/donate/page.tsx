"use client";

import { useState } from "react";
import Image from "next/image";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { 
  Heart, 
  DollarSign, 
  QrCode, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  CreditCard,
  ChevronRight,
  Info
} from "lucide-react";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

export default function DonatePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<string>("1000");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1000);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handlePresetClick = (val: number) => {
    setSelectedPreset(val);
    setAmount(val.toString());
  };

  const handleAmountChange = (val: string) => {
    setAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && PRESET_AMOUNTS.includes(num)) {
      setSelectedPreset(num);
    } else {
      setSelectedPreset(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !amount || !paymentMethod) {
      setStatus("error");
      setStatusMessage("Please fill in all required fields.");
      return;
    }

    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) {
      setStatus("error");
      setStatusMessage("Donation amount must be a valid positive number.");
      return;
    }

    setStatus("loading");
    setStatusMessage("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/foundation/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          amount: amtNum,
          paymentMethod,
          transactionId,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit donation.");

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setAmount("1000");
      setSelectedPreset(1000);
      setPaymentMethod("UPI");
      setTransactionId("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setStatusMessage(err.message || "An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Herader />

      <main className="max-w-7xl mx-auto px-5 py-12 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Heart className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600 animate-pulse" />
            Make a Difference
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Support Our Platform & Causes
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed font-semibold">
            Every contribution directly funds our educational courses, study materials, and community impact initiatives. Thank you for your generosity.
          </p>
        </div>

        {status === "success" ? (
          <div className="max-w-md mx-auto rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl space-y-6 animate-in fade-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900">Thank you so much!</h2>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Your donation submission has been received. Our team will verify the payment reference and update the records. A receipt has been generated.
              </p>
            </div>
            <button
              onClick={() => setStatus("idle")}
              className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-600 active:scale-[0.98] transition"
            >
              Make Another Donation
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] max-w-5xl mx-auto">
            
            {/* Form Column */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b pb-4">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Donation Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Amount presets */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Select Amount (INR / ₹)
                  </label>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {PRESET_AMOUNTS.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handlePresetClick(val)}
                        className={`rounded-xl border py-3 text-xs font-black transition-all ${
                          selectedPreset === val
                            ? "border-emerald-600 bg-emerald-50/50 text-emerald-700 ring-2 ring-emerald-600/10"
                            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-600/50"
                        }`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount field */}
                <div>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="Enter custom amount"
                      className="block w-full rounded-xl border border-slate-200 px-8 py-3 bg-white text-slate-900 font-extrabold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm transition"
                      disabled={status === "loading"}
                      min="1"
                    />
                  </div>
                </div>

                <hr className="border-slate-100 my-2" />

                {/* Donor Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                      disabled={status === "loading"}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                      disabled={status === "loading"}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                      disabled={status === "loading"}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-bold"
                      disabled={status === "loading"}
                    >
                      <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                      <option value="Bank Transfer">Bank Account Transfer</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Card">Credit / Debit Card</option>
                      <option value="PayPal">PayPal</option>
                    </select>
                  </div>
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Transaction ID / Reference Number
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter Payment Ref / UTR / Transaction ID"
                    className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                    disabled={status === "loading"}
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold flex items-center gap-1">
                    <Info className="h-3 w-3 shrink-0 text-emerald-600" />
                    Enter reference ID once you complete the transfer using payment details on the right.
                  </p>
                </div>

                {/* Optional Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Message of Support (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message..."
                    rows={3}
                    className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                    disabled={status === "loading"}
                  />
                </div>

                {statusMessage && (
                  <div className={`flex items-center gap-2 rounded-xl p-3 text-xs font-bold border ${
                    status === "error" 
                      ? "bg-red-50 border-red-200 text-red-700" 
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}>
                    {status === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    <p>{statusMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] transition px-5 py-3 text-xs font-black text-white shadow-md disabled:opacity-50"
                >
                  {status === "loading" ? "Recording transaction..." : `Donate ₹${amount || "0"}`}
                </button>
              </form>
            </div>

            {/* Instruction details Column */}
            <div className="space-y-6">
              
              {/* Conditional payment guide */}
              {paymentMethod === "UPI" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Scan & Pay via UPI</h3>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">
                      Scan the QR code below or transfer directly to VPA VPA/UPI ID.
                    </p>
                  </div>

                  {/* QR Box */}
                  <div className="mx-auto border border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col items-center justify-center w-48 h-48 relative">
                    <div className="relative w-40 h-40 bg-white border rounded-xl flex items-center justify-center">
                      {/* Generates a nice SVG outline to mock a scan code */}
                      <span className="text-[10px] text-slate-400 font-extrabold text-center px-4">
                        UPI QR Code Mock Container
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-500 font-bold">UPI ID (VPA):</p>
                    <p className="text-xs font-black text-emerald-800 mt-1 select-all">flarelap@ybl</p>
                  </div>
                </div>
              )}

              {paymentMethod === "Bank Transfer" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Direct Bank Transfer Details</h3>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">
                      Initiate a bank transfer (IMPS / NEFT / RTGS) to the following account.
                    </p>
                  </div>

                  <div className="border border-slate-100 rounded-xl divide-y text-xs">
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-400 font-semibold">Bank Name:</span>
                      <span className="font-extrabold text-slate-900">HDFC Bank Ltd</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-400 font-semibold">Account Holder Name:</span>
                      <span className="font-extrabold text-slate-900">Flarelap Global Foundation</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-400 font-semibold">Account Number:</span>
                      <span className="font-extrabold text-slate-900 select-all">50200087654321</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-400 font-semibold">IFSC Code:</span>
                      <span className="font-extrabold text-slate-900 select-all">HDFC0000123</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-400 font-semibold">Account Type:</span>
                      <span className="font-extrabold text-slate-900">Current Account</span>
                    </div>
                  </div>
                </div>
              )}

              {/* General terms Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Important Guidelines
                </h4>
                <ul className="space-y-2 text-[11px] text-slate-500 font-semibold leading-relaxed list-disc list-inside">
                  <li>Contributions are tax-deductible as per regional guidelines (80G certification pending verification).</li>
                  <li>Always cross-check the transaction reference ID to ensure smooth audit matching.</li>
                  <li>For support or queries, contact us at <strong className="text-emerald-700">support@flarelap.org</strong>.</li>
                </ul>
              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
