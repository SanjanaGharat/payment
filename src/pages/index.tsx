import { useState } from 'react';
import QRCode from 'react-qr-code';
import { FaQrcode, FaLink, FaRupeeSign, FaSpinner, FaCreditCard } from 'react-icons/fa';
import Script from 'next/script';

export default function PaymentApp() {
  const [amount, setAmount] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'razorpay'>('link');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const upiId = "9981171354@ybl";
  const recipientName = "Payment Receiver";
  const paymentLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(recipientName)}&am=${amount}&tn=Payment`;
  const isMobile = typeof window !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const razorpayKey = "rzp_test_B4OLtt7MRHNxrW";

  const initiateUPIPayment = () => {
    setIsLoading(true);
    setError(null);
    setInfo(null);

    try {
      if (isMobile) {
        window.location.href = paymentLink;
      } else {
        setInfo("UPI payment links work only on mobile. Please scan the QR or copy the link below.");
      }
    } catch (err) {
      setError('Failed to open payment app. Please try manually.');
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setInfo("UPI link copied! Paste it in your UPI app.");
  };

  const openRazorpay = () => {
    setIsLoading(true);
    setError(null);
    setInfo(null);

    const options = {
      key: razorpayKey,
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: recipientName,
      description: "UPI Payment",
      image: "", // Optional: add your logo url
      handler: function (response: any) {
        setInfo("Payment successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "",
        email: "",
        contact: ""
      },
      theme: {
        color: "#2563eb"
      }
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />

      <header className="bg-white border-b border-blue-100 p-8 shadow-md rounded-b-3xl">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-wide">UPI Payment Gateway</h1>
        <p className="text-center mt-2 text-gray-500 text-lg">Simple, Secure & Fast Payments</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-blue-100 p-0 overflow-hidden">
          {/* Amount Input */}
          <div className="p-8 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
            <label htmlFor="amount" className="block text-blue-700 font-semibold mb-3 text-lg">
              Enter Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500 text-xl">
                <FaRupeeSign />
              </span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(Math.abs(Number(e.target.value)))}
                min="1"
                className="w-full pl-10 pr-4 py-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg bg-white transition shadow text-blue-900"
                placeholder="100"
              />
            </div>
          </div>

          {/* Payment Tabs */}
          <div className="flex border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
            <button
              onClick={() => { setActiveTab('link'); setInfo(null); setError(null); }}
              className={`flex-1 py-5 font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${activeTab === 'link' ? 'text-blue-700 border-b-4 border-blue-500 bg-white shadow' : 'text-gray-500'}`}
            >
              <FaLink /> Direct Link
            </button>
            <button
              onClick={() => { setActiveTab('qr'); setInfo(null); setError(null); }}
              className={`flex-1 py-5 font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${activeTab === 'qr' ? 'text-blue-700 border-b-4 border-blue-500 bg-white shadow' : 'text-gray-500'}`}
            >
              <FaQrcode /> QR Code
            </button>
            <button
              onClick={() => { setActiveTab('razorpay'); setInfo(null); setError(null); }}
              className={`flex-1 py-5 font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${activeTab === 'razorpay' ? 'text-blue-700 border-b-4 border-blue-500 bg-white shadow' : 'text-gray-500'}`}
            >
              <FaCreditCard /> Razorpay
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8 bg-white">
            {activeTab === 'link' && (
              <div className="text-center">
                <button
                  onClick={initiateUPIPayment}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition duration-300 w-full flex items-center justify-center gap-2 text-lg"
                >
                  {isLoading ? <FaSpinner className="animate-spin" /> : null}
                  Pay ₹{amount} via UPI
                </button>
                <p className="mt-6 text-gray-700 text-base">
                  {isMobile
                    ? "Will open PhonePe, GPay, or any UPI app"
                    : (
                      <>
                        UPI payment links work only on mobile.<br />
                        <span className="text-blue-700 break-all font-mono">{paymentLink}</span>
                        <button
                          onClick={() => copyToClipboard(paymentLink)}
                          className="ml-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 font-semibold transition"
                        >
                          Copy Link
                        </button>
                      </>
                    )
                  }
                </p>
              </div>
            )}

            {activeTab === 'qr' && (
              <div className="text-center">
                <div className="bg-blue-50 p-6 rounded-xl inline-block border border-blue-100 shadow">
                  <QRCode
                    value={paymentLink}
                    size={180}
                    fgColor="#2563eb"
                  />
                </div>
                <p className="mt-6 text-gray-700 text-base">
                  Scan with any UPI app to pay <span className="font-bold text-blue-700">₹{amount}</span>
                </p>
                <p className="text-sm text-blue-700 mt-2 font-mono">UPI ID: {upiId}</p>
              </div>
            )}

            {activeTab === 'razorpay' && (
              <div className="text-center">
                <button
                  onClick={openRazorpay}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition duration-300 w-full flex items-center justify-center gap-2 text-lg"
                >
                  {isLoading ? <FaSpinner className="animate-spin" /> : null}
                  Pay ₹{amount} with Razorpay
                </button>
                <p className="mt-6 text-gray-700 text-base">
                  Pay securely using Razorpay UPI, cards, wallets, and more.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-10 bg-white rounded-xl shadow-lg p-8 max-w-lg w-full border border-blue-100">
          <h2 className="text-blue-700 font-extrabold text-xl mb-6 text-center">We Accept</h2>
          <div className="flex justify-center gap-10">
            <div className="text-center">
              <div className="bg-blue-50 p-4 rounded-full inline-block shadow">
                <FaCreditCard className="text-blue-700 text-3xl" />
              </div>
              <p className="mt-2 text-sm font-semibold text-blue-700">Razorpay</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 p-4 rounded-full inline-block shadow">
                <FaQrcode className="text-blue-600 text-3xl" />
              </div>
              <p className="mt-2 text-sm font-semibold text-blue-700">QR Code</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 p-4 rounded-full inline-block shadow">
                <FaLink className="text-blue-700 text-3xl" />
              </div>
              <p className="mt-2 text-sm font-semibold text-blue-700">Direct Link</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-blue-100 text-center p-6 mt-16 shadow-md rounded-t-3xl">
        <p className="text-blue-700 font-semibold">© {new Date().getFullYear()} UPI Payment App</p>
        <p className="text-gray-400 text-sm mt-2">Secure & Encrypted Payments</p>
      </footer>

      {/* Info Toast */}
      {info && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-3 rounded shadow text-base font-medium">
            {info}
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center z-50">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded shadow text-base font-medium">
            {error}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3 border border-blue-100">
            <FaSpinner className="animate-spin text-blue-600" />
            <p className="text-blue-700 font-bold">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}