import { CheckCircle2Icon, XCircleIcon, SparklesIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import AuthContext from '@/context/AuthContext'

export default function Pricing() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      alert("Please login first to upgrade your plan.");
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order
      const token = localStorage.getItem('token');
      const orderRes = await fetch('/api/payment/orders', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.message || "Failed to create order");

      // 2. Initialize Razorpay
      const options = {
        key: "rzp_test_SdPOgzpCjIZran", // It's safe to put public Key ID here, but user must replace it
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Ai Resume Screening System",
        description: "Pro Access Upgrade (₹99)",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              alert("Payment Successful! You are now a Pro User.");
              if (setUser) setUser(verifyData.user);
              navigate('/upload');
            } else {
              alert("Payment Verification Failed: " + verifyData.message);
            }
          } catch (err) {
            alert("Error Verifying payment");
          }
        },
        prefill: {
          name: user.name ? user.name : undefined,
          email: user.email ? user.email : undefined
        },
        theme: {
          color: "#10b981"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert("Payment failed! " + response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Error initiating payment. Did you setup Razorpay keys in backend?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-24 lg:py-32 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-50 to-[#f8fafc]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 shadow-sm mb-6 animate-fade-in-up">
            <SparklesIcon className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Transparent Pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Invest in your <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">career</span> today.
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            Simple, honest pricing. Whether you just want a quick scan or full unlock, we have a plan designed exactly for your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:gap-12 max-w-5xl mx-auto gap-8 items-center">

          {/* Free Plan */}
          <div className="bg-white p-10 rounded-3xl shadow-lg border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Basic Starter</h3>
            <p className="text-slate-500 font-medium mb-6">Perfect for trying out our CV parsing</p>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-black text-slate-900">₹0</span>
              <span className="text-lg font-semibold text-slate-500">/ forever</span>
            </div>

            <div className="space-y-5 mb-10">
              <div className="flex items-center gap-4">
                <CheckCircle2Icon className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="text-slate-600 font-medium">10 Resume Parsing per month</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle2Icon className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="text-slate-600 font-medium">Basic Data Extraction</span>
              </div>
              <div className="flex items-center gap-4 opacity-50">
                <XCircleIcon className="w-6 h-6 text-slate-400 shrink-0" />
                <span className="text-slate-500 line-through">JD & ATS Score Match</span>
              </div>
              <div className="flex items-center gap-4 opacity-50">
                <XCircleIcon className="w-6 h-6 text-slate-400 shrink-0" />
                <span className="text-slate-500 line-through">Skill Gap & Suggestions</span>
              </div>
            </div>

            <Link to="/login" className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 py-4 rounded-xl font-bold transition-colors">
              Get Started for Free
            </Link>
          </div>

          {/* Premium Plan - Everything Unlocked */}
          <div className="bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-700 relative hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:-translate-y-2 transition-all duration-300 transform scale-105">
            {/* 'Most Popular' Badge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-black uppercase tracking-widest py-2 px-6 rounded-full shadow-lg">
                Full Unlock
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Pro Access</h3>
            <p className="text-slate-400 font-medium mb-6">Unlimited power to beat any ATS system</p>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-black text-white">₹99</span>
              <span className="text-lg font-semibold text-emerald-400">/ month</span>
            </div>

            <div className="space-y-5 mb-10">
              <div className="flex items-center gap-4">
                <CheckCircle2Icon className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-medium">Unlimited Resume Parsings</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle2Icon className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-medium">Advanced Job Description Matching</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle2Icon className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-medium">Deep ATS Score Analysis</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle2Icon className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-medium">Missing Skill Identification</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle2Icon className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-medium">Actionable AI Suggestions</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="block w-full text-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white py-4 rounded-xl font-bold shadow-[0_5px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Unlock Everything Now"}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
