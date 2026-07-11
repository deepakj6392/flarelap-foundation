"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import {
  Heart,
  DollarSign,
  QrCode,
  Building2,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  GraduationCap,
  Briefcase,
  Play,
  Plus,
  Minus
} from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

const PRESET_AMOUNTS = [100, 500, 1000, 1500, 2000];

const FAQS = [
  {
    question: "How does my donation make a difference to children through the Mission Education programme?",
    answer: "Your donation directly supports the enrollment of out-of-school children, provides them with necessary learning materials, funds teachers' salaries, and ensures they have a conducive learning environment at our centers."
  },
  {
    question: "Will I receive regular updates about the child I support through my donation?",
    answer: "Yes, if you opt for our specific sponsorship programs, you will receive biannual reports on the child's academic progress, health updates, and letters from the child or teacher."
  },
  {
    question: "Can I choose the specific centre where my donation to the Mission Education programme goes?",
    answer: "While we allocate general funds to where they are needed most, large contributions or corporate CSR partnerships can be directed towards specific centers or regions. Please contact our support team for such arrangements."
  },
  {
    question: "Is there any minimum or maximum limit for online donation to Mission Education?",
    answer: "There is no minimum limit to your generosity. Every rupee counts. For transactions exceeding ₹50,000, we require a PAN card detail as per Indian government regulations."
  }
];

export default function DonateView({ galleryImages }: { galleryImages: any[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<string>("100");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(100);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");

  // New Fields
  const [dob, setDob] = useState("");
  const [pan, setPan] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Banner State
  const [currentSlide, setCurrentSlide] = useState(0);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isOtherAmount, setIsOtherAmount] = useState<boolean>(false);

  const showDetailedFields = parseFloat(amount) >= 2000;

  // Auto-slide banner
  useEffect(() => {
    if (!galleryImages || galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [galleryImages]);

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

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAmount("1500");
    setSelectedPreset(1500);
    setPaymentMethod("Razorpay");
    setTransactionId("");
    setMessage("");
    setPan("");
    setDob("");
    setAddress("");
    setCity("");
    setStateName("");
    setPincode("");
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

    if (paymentMethod === "Razorpay") {
      try {
        const orderRes = await fetch("/api/foundation/donations/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amtNum }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.message || "Failed to initiate payment.");

        const { orderId, keyId, currency } = orderData;

        if (!(window as any).Razorpay) {
          throw new Error("Razorpay SDK failed to load. Please refresh the page.");
        }

        const options = {
          key: keyId,
          amount: amtNum * 100,
          currency: currency,
          name: "Flarelap Foundation",
          description: "Donation for Education and Skill Development",
          order_id: orderId,
          handler: async function (response: any) {
            setStatus("loading");
            setStatusMessage("Verifying payment...");
            try {
              const verifyRes = await fetch("/api/foundation/donations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name,
                  email,
                  phone,
                  amount: amtNum,
                  paymentMethod: "Razorpay",
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  message: `PAN: ${pan}, DOB: ${dob}, Address: ${address}, ${city}, ${state}, ${country} - ${pincode} | Msg: ${message}`,
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) throw new Error(verifyData.message || "Failed to verify donation.");

              setStatus("success");
              resetForm();
            } catch (err: any) {
              setStatus("error");
              setStatusMessage(err.message || "Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: name,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#059669",
          },
          modal: {
            ondismiss: function () {
              setStatus("idle");
              setStatusMessage("Payment cancelled by user.");
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (err: any) {
        setStatus("error");
        setStatusMessage(err.message || "Failed to start payment process.");
      }
    } else {
      // Manual bank transfer (offline)
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
            transactionId: transactionId || "PENDING",
            message: `PAN: ${pan}, DOB: ${dob}, Address: ${address}, ${city}, ${state}, ${country} - ${pincode} | Msg: ${message}`,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to submit donation.");

        setStatus("success");
        resetForm();
      } catch (err: any) {
        setStatus("error");
        setStatusMessage(err.message || "An error occurred. Please try again later.");
      }
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const toggleFaq = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  // Fallback images if gallery is empty
  const bannerImages = galleryImages && galleryImages.length > 0
    ? galleryImages
    : [
      { id: 1, imageUrl: 'https://images.unsplash.com/photo-1610486016147-3ce94a5bd0c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', caption: 'Support Indian Education' },
      { id: 2, imageUrl: 'https://images.unsplash.com/photo-1593344697331-50e5883ef071?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', caption: 'Empower Children Across India' }
    ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Herader />

      <main>
        {/* Dynamic Top Banner Carousel */}
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group bg-slate-900">
          {bannerImages.map((img, index) => (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <Image
                src={img.imageUrl}
                alt={img.caption || 'Banner Image'}
                fill
                className="object-cover opacity-80"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          ))}

          {/* Slider Controls */}
          {bannerImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {bannerImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-12 h-1 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Section 1: Split Content & Form */}
        <div className="max-w-7xl mx-auto px-5 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900">
              Empowering the Next Generation: A Catalyst for Systemic Change
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-medium">
              <p>
                Education is the ultimate social equalizer. Yet, systemic barriers continue to exclude millions of vulnerable children from the classroom. At <strong className="text-emerald-700">Flarelap Foundation</strong>, we believe that quality education is a fundamental human right, not a privilege. Today, widespread economic disparities and institutional gaps force countless young minds out of school, trapping generations in a cycle of poverty. We refuse to accept this status quo. Through our strategic initiatives, we are dismantling these barriers to ensure that every child—regardless of socioeconomic background—gains access to transformative learning experiences.
              </p>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">Holistic Development Model</h3>
                <p>
                  We implement a holistic development model designed to cultivate future-ready individuals. Our curriculum equips students to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-emerald-700">Navigate Complex Challenges:</strong> Developing critical thinking and analytical problem-solving skills.</li>
                  <li><strong className="text-emerald-700">Drive Community Leadership:</strong> Instilling confidence to pioneer local civic and social solutions.</li>
                  <li><strong className="text-emerald-700">Cultivate Long-Term Vision:</strong> Inspiring students to break generational cycles and pursue high-impact careers.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">Your Investment: The Catalyst for Social Mobility</h3>
                <p>
                  When you partner with Flarelap Foundation, your contribution transitions from a simple donation to a high-yield social investment. Your capital directly funds:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-emerald-700">Academic Infrastructure:</strong> Provision of essential learning materials, technology access, and foundational resources.</li>
                  <li><strong className="text-emerald-700">Human Capital Development:</strong> Recruitment and continuous training of dedicated educators and mentors.</li>
                  <li><strong className="text-emerald-700">Enriched Learning Environments:</strong> Creation of safe, inclusive, and highly motivating spaces optimized for student success.</li>
                </ul>
              </div>

              <p className="border-l-4 border-emerald-600 pl-4 text-slate-800 font-semibold italic">
                “Education is the passport to the future, for tomorrow belongs to those who prepare for it today.”
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <h3 className="text-base font-bold text-slate-900">Partner With Us Today</h3>
                <p>
                  Tomorrow’s innovators, executives, and community leaders are waiting for an opportunity to learn. Your strategic support is the missing link. Partner with Flarelap Foundation today to scale our impact and build an equitable future.
                </p>
                <p className="text-emerald-700 font-bold">
                  "Invest in a Child's Future" — Join Our Foundation Circle.
                </p>
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-white border-2 border-emerald-600 p-8 relative">

              {status === "success" ? (
                <div className="text-center py-10 space-y-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase">Thank you!</h2>
                    <p className="text-sm text-slate-500 mt-2 font-semibold">
                      Your contribution has been recorded successfully. We appreciate your support.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 px-6 py-2.5 rounded bg-emerald-600 text-white text-sm font-bold shadow-md hover:bg-emerald-700 transition"
                  >
                    Make Another Donation
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-black uppercase text-black tracking-tight">Support Every Child to Learn and Dream</h2>
                    <p className="text-base font-light text-slate-500 uppercase tracking-wide mt-2"></p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Presets Grid */}
                    <div className="flex justify-center gap-6 mb-4">
                      {PRESET_AMOUNTS.map((val) => (
                        <label key={val} className="flex items-center gap-2 cursor-pointer text-slate-500 font-medium text-sm hover:text-slate-900 transition">
                          <input
                            type="radio"
                            name="amount"
                            value={val}
                            checked={selectedPreset === val}
                            onChange={() => {
                              handlePresetClick(val);
                              setIsOtherAmount(false);
                            }}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-600 border-slate-300"
                          />
                          ₹ {val}
                        </label>
                      ))}

                      <label key="more" className="flex items-center gap-2 cursor-pointer text-slate-500 font-medium text-sm hover:text-slate-900 transition">
                          <input
                            type="radio"
                            name="otherAmount"
                            value={"more"}
                            checked={isOtherAmount}
                            onChange={() => {
                              handlePresetClick(5000);
                              setIsOtherAmount(!isOtherAmount);
                            }}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-600 border-slate-300"
                          />
                           More
                        </label>
                    </div>

                    <div className="text-center mb-6">
                      <p className="text-sm font-medium text-slate-700 uppercase">
                        YOUR DONATION WILL HELP FOR THE<br />EDUCATION OF 1 CHILD FOR 3 MONTHS
                      </p>
                    </div>

                    {/* Amount Input */}
                    {isOtherAmount && (
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="Other Amount"
                        className="block w-full rounded-full border border-slate-400 px-6 py-2.5 bg-slate-100/50 text-slate-600 placeholder-slate-400 focus:border-emerald-500 focus:bg-white outline-none text-sm transition"
                        disabled={status === "loading"}
                        min="2001"
                    />)}

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Full Name"
                        className="block w-full rounded-full border border-slate-400 px-6 py-2.5 bg-slate-100/50 text-slate-600 placeholder-slate-400 focus:border-emerald-500 focus:bg-white outline-none text-sm transition"
                        maxLength={256}
                        minLength={3}
                      />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email ID"
                        className="block w-full rounded-full border border-slate-400 px-6 py-2.5 bg-slate-100/50 text-slate-600 placeholder-slate-400 focus:border-emerald-500 focus:bg-white outline-none text-sm transition"
                        maxLength={256}
                        minLength={3}
                      />
                      </div>
                      { showDetailedFields && (
                        <>
                        <div className="grid grid-cols-2 gap-4">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter Mobile No"
                        className="block w-full rounded-full border border-slate-400 px-6 py-2.5 bg-slate-100/50 text-slate-600 placeholder-slate-400 focus:border-emerald-500 focus:bg-white outline-none text-sm transition"
                        maxLength={15}
                        minLength={10}
                      />
                      <input
                        type="text"
                        value={dob}
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                        onChange={(e) => setDob(e.target.value)}
                        placeholder="Date of Birth"
                        className="block w-full rounded-full border border-slate-400 px-6 py-2.5 bg-slate-100/50 text-slate-600 placeholder-slate-400 focus:border-emerald-500 focus:bg-white outline-none text-sm transition"
                        maxLength={15}
                        minLength={8}
                      />
                      <input
                        type="text"
                        required
                        value={pan}
                        onChange={(e) => setPan(e.target.value.toUpperCase())}
                        placeholder="Pan No"
                        className="block w-full rounded-full border border-slate-400 px-6 py-2.5 bg-slate-100/50 text-slate-600 placeholder-slate-400 focus:border-emerald-500 focus:bg-white outline-none text-sm transition uppercase"
                        maxLength={10}
                        pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                        title="Please enter a valid PAN number"
                      />
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country"
                        className="block w-full rounded-full border border-slate-400 px-6 py-2.5 bg-slate-100/50 text-slate-600 placeholder-slate-400 focus:border-emerald-500 focus:bg-white outline-none text-sm transition"
                        maxLength={50}
                        minLength={3}
                      />
                      <select
                        value={state}
                        onChange={(e) => setStateName(e.target.value)}
                        className="block w-full rounded-full border border-slate-400 px-6 py-2.5 bg-slate-100/50 text-slate-650 placeholder-slate-400 focus:border-emerald-500 focus:bg-white outline-none text-sm transition appearance-none font-medium"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="block w-full rounded-full border border-slate-400 px-6 py-2.5 bg-slate-100/50 text-slate-600 placeholder-slate-400 focus:border-emerald-500 focus:bg-white outline-none text-sm transition"
                        maxLength={50}
                        minLength={3}
                      />
                    </div>

                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address"
                      maxLength={256}
                      minLength={50}
                      className="block w-full rounded-full border border-slate-400 px-6 py-2.5 bg-slate-100/50 text-slate-600 placeholder-slate-400 focus:border-emerald-500 focus:bg-white outline-none text-sm transition"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                        placeholder="Pincode"
                        className="block w-full rounded-full border border-slate-400 px-6 py-2.5 bg-slate-100/50 text-slate-600 placeholder-slate-400 focus:border-emerald-500 focus:bg-white outline-none text-sm transition"
                      />
                      <input
                        type="text"
                        value="Online Payment (UPI/Card/Netbanking)"
                        disabled
                        className="block w-full rounded-full border border-slate-400 px-6 py-2.5 bg-slate-100 text-slate-500 text-sm font-semibold outline-none cursor-not-allowed"
                      />
                    </div>
                    </>
                      )}
                    {/* 
                    <div className="text-[10px] text-slate-500 font-medium leading-relaxed px-2 mt-6 space-y-2">
                      <p>
                        *YOUR CONTRIBUTIONS ARE ELIGIBLE FOR UPTO 50% TAX BENEFIT UNDER SECTION 80G AS FLARELAP FOUNDATION IS REGISTERED AS NON PROFIT ORGANIZATION*<br />
                        PAN: AACTS7973G | 80G NUMBER: AACTS7973GF20210
                      </p>
                      <p>
                        Flarelap Foundation may get in touch with you through WhatsApp, email, SMS, or phone to share details about your donation, 80G receipt. <span className="text-emerald-600 cursor-pointer hover:underline">more..</span>
                      </p>
                    </div> */}

                    {statusMessage && (
                      <div className={`p-3 rounded-md text-xs font-bold text-center ${status === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {statusMessage}
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="px-8 py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-sm transition disabled:opacity-50"
                      >
                        {status === "loading" ? "Processing..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: What will your donation support */}
        <div className="bg-emerald-600 py-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide">WHAT WILL YOUR DONATION SUPPORT?</h2>
        </div>

        <div className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: BookOpen, title: "Primary and Secondary education to children" },
                { icon: Users, title: "Regular health checkups & nutrition support" },
                { icon: GraduationCap, title: "Training and capacity building of teachers" },
                { icon: Briefcase, title: "Vocational education & skill training" },
                { icon: Heart, title: "Psycho-social life skills education to promote socio-emotional well-being" },
                { icon: BookOpen, title: "Infrastructure development, STEM learning play at Mission Education schools" },
                { icon: BookOpen, title: "Digital literacy and learning access to marginalized children" },
                { icon: GraduationCap, title: "Merit-based scholarships to bright children flagged by Mission Education" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-4 hover:shadow-md transition">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-800">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 px-2">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Impact Map */}
        <div className="max-w-5xl mx-auto px-5 py-20 sm:px-6 lg:px-8">
          <div className="bg-slate-200 rounded-lg overflow-hidden flex flex-col md:flex-row relative">
            {/* Stats Left */}
            <div className="md:w-1/2 p-10 flex flex-col justify-center space-y-8 z-10">
              <div>
                <p className="text-4xl font-black text-emerald-600">1,85,000</p>
                <p className="text-sm font-bold text-slate-700 uppercase tracking-wider mt-1">Children Educated Last Year</p>
              </div>
              <div>
                <p className="text-4xl font-black text-emerald-600">977</p>
                <p className="text-sm font-bold text-slate-700 uppercase tracking-wider mt-1">Mission Education Centres</p>
              </div>
              <div>
                <p className="text-4xl font-black text-emerald-600">27</p>
                <p className="text-sm font-bold text-slate-700 uppercase tracking-wider mt-1">States Across India</p>
              </div>
            </div>

            {/* Map Right (Using a CSS shape or simple SVG outline since we don't have the exact image) */}
            <div className="md:w-1/2 min-h-[300px] relative bg-slate-200 flex items-center justify-center p-8">
              {/* Simple illustrative dot map representation */}
              <div className="w-full max-w-[300px] h-[400px] relative">
                {/* Fallback to text if we can't draw the map nicely */}
                <div className="absolute inset-0 border-[3px] border-dashed border-slate-300 rounded-3xl flex items-center justify-center text-slate-400 rotate-3">
                  <span className="font-black text-2xl uppercase tracking-widest text-center px-4">Pan-India<br />Presence</span>
                </div>
                {/* Decorative dots to simulate map locations */}
                <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-emerald-600 rounded-full animate-ping"></div>
                <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-emerald-600 rounded-full animate-ping delay-100"></div>
                <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-emerald-600 rounded-full animate-ping delay-300"></div>
                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-emerald-600 rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/2 w-2 h-2 bg-emerald-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Stories in Motion */}
        <div className="max-w-7xl mx-auto px-5 py-12 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 mb-10">STORIES IN MOTION</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Video Placeholder 1 */}
            <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden group cursor-pointer border-[4px] border-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1595188827986-7ce292a11b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Story 1"
                fill
                className="object-cover opacity-60 group-hover:opacity-40 transition"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white group-hover:bg-red-700 transition">
                  <Play className="h-6 w-6 fill-white" />
                </div>
              </div>
              <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent text-left">
                <p className="text-white text-sm font-bold truncate">No matter what the circumstances are...</p>
              </div>
            </div>

            {/* Video Placeholder 2 */}
            <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden group cursor-pointer border-[4px] border-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1604161547012-7065ce70e281?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Story 2"
                fill
                className="object-cover opacity-60 group-hover:opacity-40 transition"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white group-hover:bg-red-700 transition">
                  <Play className="h-6 w-6 fill-white" />
                </div>
              </div>
              <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent text-left">
                <p className="text-white text-sm font-bold truncate">STEM Labs at Mission Education Centres</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Glimpses from our Projects */}
        <div className="max-w-7xl mx-auto px-5 py-12 sm:px-6 lg:px-8 text-center border-t border-slate-100">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 mb-10">GLIMPSES FROM OUR PROJECTS</h2>

          <div className="max-w-4xl mx-auto h-[300px] relative rounded-xl overflow-hidden shadow-lg border-4 border-white">
            {bannerImages.length > 0 ? (
              <Image
                src={bannerImages[0].imageUrl}
                alt="Project Glimpse"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest">
                Project Images
              </div>
            )}
          </div>
        </div>

        {/* Section 6: FAQs */}
        <div className="max-w-4xl mx-auto px-5 py-16 sm:px-6 lg:px-8 border-t border-slate-100">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 mb-10 text-center">FREQUENTLY ASKED QUESTIONS</h2>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm md:text-base font-bold text-slate-800 bg-white hover:bg-slate-50/50 transition rounded-xl"
                >
                  <span className="pr-4">{faq.question}</span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openFaq === idx ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {openFaq === idx ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-5 pt-0 text-sm text-slate-600 font-medium leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Footer />
    </div>
  );
}
