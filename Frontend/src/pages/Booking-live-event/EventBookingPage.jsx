import { useState } from "react";
import { motion } from "framer-motion";

export default function EventBooking() {
  const [step, setStep] = useState(1);
  const [ticketType, setTicketType] = useState("general");
  const [tickets, setTickets] = useState(1);

  // All form details
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    city: "",
    emergency: "",
    idType: "",
    special: "",
    promo: "",
  });

  const [success, setSuccess] = useState(false);

  const ticketOptions = {
    general: {
      label: "General Admission – ₹599",
      price: 599,
      desc: "Festival entry + open area experience",
    },
    vip: {
      label: "VIP – ₹1199",
      price: 1199,
      desc: "Priority entry + VIP lounge + drinks",
    },
    platinum: {
      label: "Platinum – ₹1999",
      price: 1999,
      desc: "Front row + backstage access",
    },
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const confirmBooking = () => {
    if (form.name && form.email && form.phone) {
      setSuccess(true);
    } else {
      alert("Please fill all required fields.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 md:p-10 flex justify-center">
      <div className="w-full max-w-2xl">

        {/* HEADER CARD */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden border"
        >
          <img
            src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
            className="w-full h-56 md:h-64 object-cover"
          />
          <div className="p-6">
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Food & Wine Festival
            </h1>
            <p className="text-gray-600 mt-1">
              September 5–7, 2025 • 12:00 PM – 10:00 PM
            </p>
          </div>
        </motion.div>

        {/* BOOKING STEPS */}
        {!success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white mt-6 p-6 rounded-2xl shadow-xl border"
          >
            {/* Step Indicator */}
            <div className="flex justify-between mb-6">
              {["Tickets", "Details", "Review"].map((label, i) => (
                <div
                  key={i}
                  className={`flex-1 text-center py-2 rounded-xl font-semibold text-sm ${
                    step === i + 1
                      ? "bg-black text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* ---------------- STEP 1 ---------------- */}
            {step === 1 && (
              <>
                <h2 className="text-xl font-bold mb-4">Select Ticket Type</h2>

                {/* Ticket Cards */}
                <div className="space-y-3">
                  {Object.entries(ticketOptions).map(([key, opt]) => (
                    <div
                      key={key}
                      onClick={() => setTicketType(key)}
                      className={`p-4 rounded-xl cursor-pointer border transition ${
                        ticketType === key
                          ? "border-blue-600 bg-blue-50 shadow-md"
                          : "border-gray-300 bg-gray-100"
                      }`}
                    >
                      <div className="font-semibold">{opt.label}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {opt.desc}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ticket Count */}
                <div className="mt-6">
                  <h3 className="font-semibold">Number of Tickets</h3>
                  <div className="flex items-center bg-gray-100 border rounded-xl w-40 mt-2">
                    <button
                      onClick={() =>
                        setTickets((t) => Math.max(1, t - 1))
                      }
                      className="px-4 py-2 text-xl"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center font-bold">
                      {tickets}
                    </div>
                    <button
                      onClick={() => setTickets((t) => t + 1)}
                      className="px-4 py-2 text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={next}
                  className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold"
                >
                  Next
                </button>
              </>
            )}

            {/* ---------------- STEP 2 ---------------- */}
            {step === 2 && (
              <>
                <h2 className="text-xl font-bold mb-4">Your Details</h2>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-semibold">Full Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full p-3 border mt-1 rounded-xl bg-gray-100"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-semibold">Email</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full p-3 border mt-1 rounded-xl bg-gray-100"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-semibold">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full p-3 border mt-1 rounded-xl bg-gray-100"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-sm font-semibold">Gender</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full p-3 border mt-1 rounded-xl bg-gray-100"
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="text-sm font-semibold">Age</label>
                    <input
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      className="w-full p-3 border mt-1 rounded-xl bg-gray-100"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="text-sm font-semibold">
                      City / Location
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full p-3 border mt-1 rounded-xl bg-gray-100"
                    />
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label className="text-sm font-semibold">
                      Emergency Contact
                    </label>
                    <input
                      name="emergency"
                      value={form.emergency}
                      onChange={handleChange}
                      className="w-full p-3 border mt-1 rounded-xl bg-gray-100"
                    />
                  </div>

                  {/* ID Proof */}
                  <div>
                    <label className="text-sm font-semibold">
                      ID Proof Type
                    </label>
                    <select
                      name="idType"
                      value={form.idType}
                      onChange={handleChange}
                      className="w-full p-3 border mt-1 rounded-xl bg-gray-100"
                    >
                      <option value="">Select</option>
                      <option>Aadhar Card</option>
                      <option>PAN Card</option>
                      <option>Driving License</option>
                      <option>Passport</option>
                    </select>
                  </div>

                  {/* Special Request */}
                  <div>
                    <label className="text-sm font-semibold">
                      Special Requests
                    </label>
                    <textarea
                      name="special"
                      value={form.special}
                      onChange={handleChange}
                      className="w-full p-3 border mt-1 rounded-xl bg-gray-100"
                    />
                  </div>

                  {/* Promo */}
                  <div>
                    <label className="text-sm font-semibold">Promo Code</label>
                    <input
                      name="promo"
                      value={form.promo}
                      onChange={handleChange}
                      className="w-full p-3 border mt-1 rounded-xl bg-gray-100"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={prev}
                    className="px-6 py-3 rounded-xl bg-gray-300 font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={next}
                    className="px-6 py-3 rounded-xl bg-black text-white font-semibold"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* ---------------- STEP 3 ---------------- */}
            {step === 3 && (
              <>
                <h2 className="text-xl font-bold mb-4">Review & Confirm</h2>

                <div className="bg-gray-100 p-4 rounded-xl border">
                  <p className="font-semibold text-lg">
                    {ticketOptions[ticketType].label}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Tickets: {tickets}
                  </p>
                  <p className="font-bold text-lg mt-2">
                    Total: ₹{ticketOptions[ticketType].price * tickets}
                  </p>
                </div>

                <div className="mt-4 bg-gray-100 p-4 rounded-xl border">
                  <p className="font-semibold">{form.name}</p>
                  <p className="text-gray-600 text-sm">{form.email}</p>
                  <p className="text-gray-600 text-sm">{form.phone}</p>
                  <p className="text-gray-600 text-sm">
                    {form.age} • {form.gender}
                  </p>
                  <p className="text-gray-600 text-sm">{form.city}</p>
                  <p className="text-gray-600 text-sm">
                    Emergency: {form.emergency}
                  </p>
                  <p className="text-gray-600 text-sm">
                    ID: {form.idType}
                  </p>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={prev}
                    className="px-6 py-3 rounded-xl bg-gray-300 font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={confirmBooking}
                    className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold"
                  >
                    Confirm Booking
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          /* -------------- SUCCESS SCREEN ---------------- */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white mt-6 p-6 rounded-2xl shadow-xl border text-center"
          >
            <h2 className="text-3xl font-bold mb-2">Booking Confirmed 🎉</h2>
            <p className="text-gray-700">Thank you, {form.name}</p>
            <p className="text-gray-600 mt-1">
              A confirmation email has been sent to {form.email}
            </p>

            <p className="mt-4 text-lg font-semibold">
              Ticket Type: {ticketOptions[ticketType].label}
            </p>

            <button
              onClick={() => {
                setSuccess(false);
                setStep(1);
              }}
              className="mt-6 bg-black text-white px-6 py-3 rounded-xl"
            >
              Book Another Ticket
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
