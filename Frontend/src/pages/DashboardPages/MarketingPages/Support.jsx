import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export const SupportMar = () => {
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'Medium',
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      alert("Please select a category.");
      return;
    }
    setLoading(true);

    // Simulate API call as per spec "System submits the request and shows confirmation"
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      console.log('Support Ticket Submitted:', formData);
    }, 1500);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      subject: '',
      category: '',
      priority: 'Medium',
      description: ''
    });
  };

  // 3.3 Wireframes: "Submission Confirmation Message"
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Received</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you! We've received your request regarding "<strong>{formData.subject}</strong>".
            <br />Our team will review it and get back to you shortly.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/dashboard/marketing/help"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition shadow-md text-center"
            >
              Return to Help Center
            </Link>
            <button
              onClick={handleReset}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg border border-gray-200 transition text-center"
            >
              Raise Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3.3 Wireframes: "Support Request Form"
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard/marketing/help" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Help Center
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-slate-900 px-8 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              Submit a Request
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl">
              Please provide as much detail as possible so we can assist you efficiently.
            </p>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-bold text-gray-700">Subject <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="subject"
                    required
                    placeholder="E.g., Issue with Email Template Editor"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                  <p className="text-xs text-gray-400">Brief summary of the problem.</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="block text-sm font-bold text-gray-700">Category <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      id="category"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none bg-white appearance-none cursor-pointer"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="" disabled>Select a category...</option>
                      <option value="General">General Inquiry</option>
                      <option value="Technical">Technical Issue</option>
                      <option value="Billing">Billing & Payments</option>
                      <option value="Marketing">Campaigns & Analytics</option>
                      <option value="Feature">Feature Request</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">Priority Level</label>
                <div className="flex flex-wrap gap-4">
                  {['Low', 'Medium', 'High'].map((p) => (
                    <label key={p} className={`
                        flex items-center gap-2 cursor-pointer border rounded-lg px-4 py-2 transition-all
                        ${formData.priority === p
                        ? (p === 'High' ? 'bg-red-50 border-red-200 ring-1 ring-red-200' : p === 'Medium' ? 'bg-orange-50 border-orange-200 ring-1 ring-orange-200' : 'bg-green-50 border-green-200 ring-1 ring-green-200')
                        : 'bg-white border-gray-200 hover:bg-gray-50'}
                    `}>
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={formData.priority === p}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="hidden" // Custom radio style
                      />
                      <span className={`w-3 h-3 rounded-full ${p === 'High' ? 'bg-red-500' : p === 'Medium' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                      <span className={`text-sm font-medium ${formData.priority === p ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                        {p} Priority
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-bold text-gray-700">Description <span className="text-red-500">*</span></label>
                <textarea
                  id="description"
                  required
                  rows="6"
                  placeholder="Please describe the issue in detail. What steps led to this? What did you expect to happen?"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none resize-y"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Please do not share sensitive passwords or credit card info here.
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                <Link
                  to="/dashboard/marketing/help"
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 font-bold rounded-lg transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-xl transition-all flex items-center gap-2 transform active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Submitting Request...' : <><Send className="w-5 h-5" /> Submit Request</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
