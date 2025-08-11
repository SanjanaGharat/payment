import { useState } from 'react';
import QRCode from 'react-qr-code';
import { FaWhatsapp, FaQrcode, FaLink, FaRupeeSign } from 'react-icons/fa';

export default function PaymentApp() {
  const [amount, setAmount] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'whatsapp'>('link');
  const upiId = "yourupi@id"; // Replace with your UPI ID
  const recipientName = "Your Name";

  const initiateUPIPayment = () => {
    const paymentLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(recipientName)}&am=${amount}&tn=Payment`;
    window.location.href = paymentLink;
    
    // Fallback
    setTimeout(() => {
      window.open(`https://phonepe.com/upi-collect/${upiId}/${amount}/Payment`, '_blank');
    }, 500);
  };

  const sendWhatsAppRequest = () => {
    const message = `Please pay ₹${amount} to ${recipientName} (UPI ID: ${upiId})`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center">UPI Payment Gateway</h1>
        <p className="text-center mt-2 text-blue-100">Secure & Instant Payments</p>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Amount Input */}
          <div className="p-6 border-b border-blue-100">
            <label htmlFor="amount" className="block text-blue-800 font-medium mb-2">
              Enter Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                <FaRupeeSign />
              </span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1"
                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="100"
              />
            </div>
          </div>

          {/* Payment Tabs */}
          <div className="flex border-b border-blue-100">
            <button
              onClick={() => setActiveTab('link')}
              className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 ${activeTab === 'link' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              <FaLink /> Direct Link
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 ${activeTab === 'qr' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              <FaQrcode /> QR Code
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 ${activeTab === 'whatsapp' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 w-full"
                >
                  Pay ₹{amount} via UPI
                </button>
                <p className="mt-4 text-gray-600">
                  Will open PhonePe, GPay, or any UPI app
                </p>
              </div>
            )}

            {activeTab === 'qr' && (
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg inline-block border border-blue-200">
                  <QRCode 
                    value={`upi://pay?pa=${upiId}&pn=${recipientName}&am=${amount}&tn=Payment`}
                    size={200}
                    fgColor="#002366"
                  />
                </div>
                <p className="mt-4 text-gray-600">
                  Scan with any UPI app to pay ₹{amount}
                </p>
              </div>
            )}

            {activeTab === 'whatsapp' && (
              <div className="text-center">
                <button
                  onClick={sendWhatsAppRequest}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 w-full flex items-center justify-center gap-2"
                >
                  <FaWhatsapp /> Request ₹{amount} via WhatsApp
                </button>
                <p className="mt-4 text-gray-600">
                  Send payment request directly to WhatsApp
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-blue-800 font-bold text-lg mb-4">We Accept</h2>
          <div className="flex justify-center gap-6">
            <img src="/phonepe-logo.png" alt="PhonePe" className="h-10" />
            <img src="/gpay-logo.png" alt="Google Pay" className="h-10" />
            <img src="/paytm-logo.png" alt="Paytm" className="h-10" />
            <img src="/bhim-logo.png" alt="BHIM" className="h-10" />
          </div>
        </div>
      </main>

      <footer className="bg-blue-800 text-white text-center p-4 mt-12">
        <p>© {new Date().getFullYear()} UPI Payment App. All rights reserved.</p>
        <p className="text-blue-200 text-sm mt-1">Secure & Encrypted Payments</p>
      </footer>
    </div>
  );
}