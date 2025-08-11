import { useState } from 'react';
import QRCode from 'react-qr-code';
import { FaWhatsapp, FaQrcode, FaLink, FaRupeeSign, FaSpinner } from 'react-icons/fa';

export default function PaymentApp() {
  const [amount, setAmount] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'whatsapp'>('link');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const upiId = "9981171354@ybl";
  const recipientName = "Payment Receiver";
  const paymentLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(recipientName)}&am=${amount}&tn=Payment`;
  const isMobile = typeof window !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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

  const sendWhatsAppRequest = () => {
    setIsLoading(true);
    setError(null);
    setInfo(null);

    try {
      // WhatsApp will show the UPI link as clickable on mobile
      const message = `Please pay ₹${amount} to ${recipientName} (UPI ID: ${upiId})\nClick to pay: ${paymentLink}`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
      if (!isMobile) {
        setInfo("WhatsApp Web will open. Make sure you're logged in.");
      }
    } catch (err) {
      setError('Failed to open WhatsApp. Please try manually.');
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 flex flex-col">
      <header className="bg-white border-b border-blue-100 p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-center text-blue-700">UPI Payment Gateway</h1>
        <p className="text-center mt-2 text-gray-500 text-base">Simple, Secure & Fast Payments</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg max-w-lg w-full border border-gray-200">
          {/* Amount Input */}
          <div className="p-6 border-b border-gray-100">
            <label htmlFor="amount" className="block text-blue-700 font-medium mb-2">
              Enter Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                <FaRupeeSign />
              </span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(Math.abs(Number(e.target.value)))}
                min="1"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg transition"
                placeholder="100"
              />
            </div>
          </div>

          {/* Payment Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50">
            <button
              onClick={() => { setActiveTab('link'); setInfo(null); setError(null); }}
              className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 transition ${activeTab === 'link' ? 'text-blue-700 border-b-2 border-blue-500 bg-white' : 'text-gray-500'}`}
            >
              <FaLink /> Direct Link
            </button>
            <button
              onClick={() => { setActiveTab('qr'); setInfo(null); setError(null); }}
              className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 transition ${activeTab === 'qr' ? 'text-blue-700 border-b-2 border-blue-500 bg-white' : 'text-gray-500'}`}
            >
              <FaQrcode /> QR Code
            </button>
            <button
              onClick={() => { setActiveTab('whatsapp'); setInfo(null); setError(null); }}
              className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 transition ${activeTab === 'whatsapp' ? 'text-blue-700 border-b-2 border-blue-500 bg-white' : 'text-gray-500'}`}
            >
              <FaWhatsapp /> WhatsApp
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'link' && (
              <div className="text-center">
                <button
                  onClick={initiateUPIPayment}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition w-full flex items-center justify-center gap-2 text-base"
                >
                  {isLoading ? <FaSpinner className="animate-spin" /> : null}
                  Pay ₹{amount} via UPI
                </button>
                <p className="mt-4 text-gray-600 text-sm">
                  {isMobile
                    ? "Will open PhonePe, GPay, or any UPI app"
                    : (
                      <>
                        UPI payment links work only on mobile.<br />
                        <span className="text-blue-700 break-all">{paymentLink}</span>
                        <button
                          onClick={() => copyToClipboard(paymentLink)}
                          className="ml-2 px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm"
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
                <div className="bg-gray-50 p-4 rounded-lg inline-block border border-blue-100 shadow">
                  <QRCode
                    value={paymentLink}
                    size={180}
                    fgColor="#2563eb"
                  />
                </div>
                <p className="mt-4 text-gray-700 text-base">
                  Scan with any UPI app to pay <span className="font-bold text-blue-700">₹{amount}</span>
                </p>
                <p className="text-sm text-blue-700 mt-2">UPI ID: {upiId}</p>
              </div>
            )}

            {activeTab === 'whatsapp' && (
              <div className="text-center">
                <button
                  onClick={sendWhatsAppRequest}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow transition w-full flex items-center justify-center gap-2 text-base"
                >
                  {isLoading ? <FaSpinner className="animate-spin" /> : null}
                  <FaWhatsapp /> Request ₹{amount} via WhatsApp
                </button>
                <p className="mt-4 text-gray-600 text-sm">
                  Send payment request directly to WhatsApp
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 bg-white rounded-xl shadow p-6 max-w-lg w-full border border-gray-200">
          <h2 className="text-blue-700 font-bold text-lg mb-4 text-center">We Accept</h2>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="bg-blue-50 p-3 rounded-full inline-block">
                <FaWhatsapp className="text-green-500 text-2xl" />
              </div>
              <p className="mt-2 text-sm text-gray-600">WhatsApp</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 p-3 rounded-full inline-block">
                <FaQrcode className="text-blue-600 text-2xl" />
              </div>
              <p className="mt-2 text-sm text-gray-600">QR Code</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 p-3 rounded-full inline-block">
                <FaLink className="text-blue-700 text-2xl" />
              </div>
              <p className="mt-2 text-sm text-gray-600">Direct Link</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-blue-100 text-center p-4 mt-12 shadow-sm">
        <p className="text-blue-700 font-semibold">© {new Date().getFullYear()} UPI Payment App</p>
        <p className="text-gray-400 text-sm mt-1">Secure & Encrypted Payments</p>
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
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3 border border-blue-100">
            <FaSpinner className="animate-spin text-blue-600" />
            <p className="text-blue-700 font-bold">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}