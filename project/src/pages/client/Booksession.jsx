// src/pages/client/BookSession.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { apiRequest } from "../../lib/api";
import { COACHES } from "../../data/coaches";
import { trackEvent } from "../../utils/analytics";
import { getClientUser } from "../../lib/clientSession";

function BookSession() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [duration, setDuration] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [consultant, setConsultant] = useState(COACHES[0].name);
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [paymentStep, setPaymentStep] = useState("form"); // form | paying | success
  const [pendingBooking, setPendingBooking] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState({ enabled: false, publicKey: "" });
  const [existingRecords, setExistingRecords] = useState([]);

  const timeSlots = {
    morning: ["9:00 AM", "10:00 AM", "11:00 AM"],
    afternoon: ["1:00 PM", "2:00 PM", "4:00 PM"],
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthLabel = new Date(viewYear, viewMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const minMonthValue = today.getFullYear() * 12 + today.getMonth();
  const currentMonthValue = viewYear * 12 + viewMonth;
  const canGoPrevMonth = currentMonthValue > minMonthValue;

  const allSlots = [...timeSlots.morning, ...timeSlots.afternoon];
  const allExisting = existingRecords;

  const normalizeStatus = (status) => String(status || "").toLowerCase();
  const isActiveRecord = (record) => {
    const status = normalizeStatus(record.status);
    return !status || status === "upcoming" || status === "pending" || status === "rescheduled";
  };

  const getRecordTime = (record) => String(record.timeSlot || record.time || "").trim();
  const getRecordDate = (record) => String(record.date || "").trim();

  const getTakenSlotsForDate = (dateIso) => {
    const taken = new Set();
    allExisting.forEach((record) => {
      if (!isActiveRecord(record)) return;
      if (getRecordDate(record) !== dateIso) return;
      const slot = getRecordTime(record);
      if (slot) taken.add(slot);
    });
    return taken;
  };

  const isPastDate = (year, month, day) => {
    const selected = new Date(year, month, day);
    selected.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected < today;
  };

  const parseTimeSlot = (slot) => {
    const match = String(slot).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const meridiem = match[3].toUpperCase();
    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;
    return { hour, minute };
  };

  const isPastTimeSlot = (dateObj, slot) => {
    if (!dateObj) return false;
    const parsed = parseTimeSlot(slot);
    if (!parsed) return false;
    const slotDateTime = new Date(dateObj);
    slotDateTime.setHours(parsed.hour, parsed.minute, 0, 0);
    return slotDateTime < new Date();
  };

  const isDateFullyBooked = (year, month, day) => {
    const dateObj = new Date(year, month, day);
    const dateIso = dateObj.toISOString().split("T")[0];
    const taken = getTakenSlotsForDate(dateIso);
    const hasAvailable = allSlots.some((slot) => !taken.has(slot) && !isPastTimeSlot(dateObj, slot));
    return !hasAvailable;
  };

  const goPrevMonth = () => {
    if (!canGoPrevMonth) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
      return;
    }
    setViewMonth((prev) => prev - 1);
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
      return;
    }
    setViewMonth((prev) => prev + 1);
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([apiRequest("/payments/config"), apiRequest("/client/sessions", { auth: "client" })])
      .then(([config, sessions]) => {
        if (!mounted) return;
        setPaymentConfig(config || { enabled: false, publicKey: "" });
        setExistingRecords(Array.isArray(sessions) ? sessions : []);
      })
      .catch(() => {
        if (mounted) setExistingRecords([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const estimateAmountNaira = () => {
    const serviceText = String(service || "").toLowerCase();
    if (serviceText.includes("strategy") || serviceText.includes("advisory")) return 10000;
    if (serviceText.includes("coaching")) return 5000;
    return 3000;
  };

  const handleConfirmBooking = () => {
    const user = getClientUser() || { name: "", email: "" };

    if (!user.email) {
      alert("Please log in first.");
      navigate("/client/auth");
      return;
    }

    const booking = {
      id: uuidv4(),
      service,
      duration,
      consultant,
      date: selectedDate?.toISOString().split("T")[0], // clean date
      timeSlot,
      fullName: fullName || user.name,
      email: email || user.email,
      note,
      createdAt: new Date().toISOString(),
      status: "upcoming", // this makes the Join button appear on dashboard
      clientEmail: user.email, // for filtering on dashboard
    };

    // Trigger payment for paid sessions (longer duration)
    if (duration === "60 minutes" || service.includes("Strategy") || service.includes("Advisory")) {
      setPendingBooking(booking);
      if (paymentConfig?.enabled) {
        initializePayment(booking);
      } else {
        setPaymentStep("paying");
      }
      return;
    }

    // Free session - save directly
    saveBooking(booking);
  };

  const saveBooking = async (booking) => {
    let bookingToStore = booking;
    let emailNotice = "";
    try {
      const response = await apiRequest("/bookings/client", {
        method: "POST",
        auth: "client",
        body: JSON.stringify(booking),
      });
      if (response?.booking) {
        bookingToStore = response.booking;
      }
      emailNotice = response?.emailSent
        ? "Booking confirmed. A confirmation email has been sent."
        : `Booking confirmed, but email was not sent.${response?.emailInfo ? ` Reason: ${response.emailInfo}` : ""}`;
      trackEvent("booking_client_success", {
        service: booking.service,
        duration: booking.duration,
        consultant: booking.consultant,
      });
    } catch {
      emailNotice = "Booking could not be confirmed right now. Please try again.";
      trackEvent("booking_client_failed", { reason: "api_unavailable" });
      alert(emailNotice);
      return;
    }

    if (!bookingToStore?.id && !bookingToStore?.meetingId) {
      alert("Booking could not be confirmed right now. Please try again.");
      return;
    }
    alert(emailNotice);
    navigate("/client/dashboard");
  };

  const simulatePayment = () => {
    if (!pendingBooking) {
      alert("No pending booking found. Please submit the booking form again.");
      setPaymentStep("form");
      return;
    }

    setPaymentStep("success");
    // Simulate processing
    setTimeout(async () => {
      const confirmedBooking = { ...pendingBooking, status: "upcoming" };
      let bookingToStore = confirmedBooking;
      let emailNotice = "";
      try {
        const response = await apiRequest("/bookings/client", {
          method: "POST",
          auth: "client",
          body: JSON.stringify(confirmedBooking),
        });
        if (response?.booking) {
          bookingToStore = response.booking;
        }
        emailNotice = response?.emailSent
          ? "Payment successful. A confirmation email has been sent."
          : `Payment successful, but email was not sent.${response?.emailInfo ? ` Reason: ${response.emailInfo}` : ""}`;
        trackEvent("booking_client_paid_success", {
          service: confirmedBooking.service,
          duration: confirmedBooking.duration,
          consultant: confirmedBooking.consultant,
        });
      } catch {
        emailNotice = "Payment succeeded but booking confirmation failed. Please contact support.";
        trackEvent("booking_client_paid_failed", { reason: "api_unavailable" });
        alert(emailNotice);
        return;
      }
      if (!bookingToStore?.id && !bookingToStore?.meetingId) {
        alert("Payment succeeded but booking sync failed. Please contact support.");
        return;
      }
      alert(emailNotice);
      setPendingBooking(null);
      navigate("/client/dashboard");
    }, 1800);
  };

  const initializePayment = async (booking) => {
    try {
      const amountNaira = estimateAmountNaira();
      const response = await apiRequest("/payments/initialize", {
        method: "POST",
        body: JSON.stringify({
          email: booking.email,
          amountKobo: amountNaira * 100,
          metadata: {
            service: booking.service,
            duration: booking.duration,
            consultant: booking.consultant,
          },
        }),
      });

      if (!response?.authorization_url) {
        throw new Error("Payment provider did not return a checkout URL.");
      }

      sessionStorage.setItem("pendingBookingPayment", JSON.stringify(booking));
      window.location.href = response.authorization_url;
    } catch (error) {
      alert(error.message || "Unable to start payment. Using demo fallback.");
      setPaymentStep("paying");
    }
  };

  // ------------------------------------------------
  // The UI / steps remain unchanged below
  // ------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-teal-500">
        Book a Consultation
      </h1>

      {/* Payment simulation screen */}
      {paymentStep === "paying" && (
        <div className="max-w-xl mx-auto bg-white p-10 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold mb-6">Payment (Demo Mode)</h2>
          <p className="text-lg text-gray-700 mb-8">
            This is a test. In real mode you would pay ₦5,000-₦10,000 here.
          </p>
          <button
            onClick={simulatePayment}
            className="px-10 py-4 bg-green-600 text-white rounded-xl text-lg font-medium hover:bg-green-700 shadow-md"
          >
            Simulate Successful Payment
          </button>
          <p className="mt-6 text-sm text-gray-500">
            Click above and you will be redirected to dashboard and can join the session.
          </p>
        </div>
      )}

      {paymentStep === "success" && (
        <div className="max-w-xl mx-auto bg-white p-10 rounded-xl shadow text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
          <p className="text-lg text-gray-700 mb-6">Your session is now confirmed.</p>
          <p className="text-gray-500">Redirecting to dashboard...</p>
        </div>
      )}

      {/* Original steps (only show when not in payment) */}
      {paymentStep === "form" && (
        <>
          {/* STEP 1 */}
          {step === 1 && (
            <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Choose a Service</h2>
              {[
                { id: "Strategy Consultation", label: "Strategy Consultation" },
                { id: "Startup Advisory", label: "Startup Advisory" },
                { id: "Coaching Session", label: "Coaching Session" },
              ].map((s) => (
                <div
                  key={s.id}
                  onClick={() => setService(s.id)}
                  className={`p-4 border rounded mb-3 ${
                    service === s.id ? "border-teal-500 bg-teal-50" : ""
                  }`}
                >
                  {s.label}
                </div>
              ))}
              <button
                disabled={!service}
                onClick={() => setStep(2)}
                className="w-full mt-4 bg-teal-500 text-white py-2 rounded disabled:bg-gray-300"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Choose Duration</h2>
              {[
                { id: "30 minutes", label: "Discovery Call (30 mins)" },
                { id: "60 minutes", label: "Strategy Session (60 mins)" },
              ].map((d) => (
                <div
                  key={d.id}
                  onClick={() => setDuration(d.id)}
                  className={`p-4 border rounded mb-3 ${
                    duration === d.id ? "border-indigo-500 bg-indigo-50" : ""
                  }`}
                >
                  {d.label}
                </div>
              ))}
              <button
                disabled={!duration}
                onClick={() => setStep(3)}
                className="w-full bg-teal-500 text-white py-2 rounded disabled:bg-gray-300"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 3 - Date & Time */}
          {step === 3 && (
            <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Select Date & Time</h2>

              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goPrevMonth}
                  disabled={!canGoPrevMonth}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <p className="text-sm font-semibold text-gray-700">{monthLabel}</p>
                <button
                  type="button"
                  onClick={goNextMonth}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700"
                >
                  Next
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-2 text-xs font-semibold text-gray-500">
                {weekdayLabels.map((label) => (
                  <div key={label} className="text-center py-1">
                    {label}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {Array(firstDayOfMonth).fill(null).map((_, i) => <div key={i} />)}
                {daysArray.map((day) => (
                  (() => {
                    const disabled = isPastDate(viewYear, viewMonth, day) || isDateFullyBooked(viewYear, viewMonth, day);
                    const isSelected =
                      selectedDate &&
                      selectedDate.getFullYear() === viewYear &&
                      selectedDate.getMonth() === viewMonth &&
                      selectedDate.getDate() === day;
                    return (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDate(new Date(viewYear, viewMonth, day));
                      setTimeSlot("");
                    }}
                    disabled={disabled}
                    className={`p-2 rounded ${
                      isSelected
                        ? "bg-teal-500 text-white"
                        : disabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "hover:bg-teal-100"
                    }`}
                  >
                    {day}
                  </button>
                    );
                  })()
                ))}
              </div>

              {selectedDate && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Available Times</h3>
                  {Object.entries(timeSlots).map(([period, slots]) => (
                    <div key={period} className="mb-4">
                      <p className="text-sm text-gray-600 mb-2 capitalize">{period}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {slots.map((slot) => (
                          (() => {
                            const selectedDateIso = selectedDate?.toISOString().split("T")[0];
                            const takenSlots = selectedDateIso ? getTakenSlotsForDate(selectedDateIso) : new Set();
                            const taken = takenSlots.has(slot);
                            const past = isPastTimeSlot(selectedDate, slot);
                            const disabled = taken || past;
                            return (
                          <button
                            key={slot}
                            onClick={() => setTimeSlot(slot)}
                            disabled={disabled}
                            className={`p-3 border rounded text-center ${
                              timeSlot === slot
                                ? "bg-indigo-500 text-white border-indigo-500"
                                : disabled
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {slot} {taken ? "(Booked)" : past ? "(Past)" : ""}
                          </button>
                            );
                          })()
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                disabled={!selectedDate || !timeSlot}
                onClick={() => setStep(4)}
                className="w-full mt-6 bg-teal-500 text-white py-3 rounded disabled:bg-gray-300"
              >
                Continue to Details
              </button>
            </div>
          )}

          {/* STEP 4 - Details & Confirm */}
          {step === 4 && (
            <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Your Details</h2>

              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Coach</label>
              <select
                value={consultant}
                onChange={(e) => setConsultant(e.target.value)}
                className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {COACHES.map((coach) => (
                  <option key={coach.id} value={coach.name}>
                    {coach.name} - {coach.title}
                  </option>
                ))}
              </select>

              <input
                placeholder="Full Name"
                className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <input
                placeholder="Email"
                type="email"
                className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <textarea
                placeholder="Notes / Questions (optional)"
                className="w-full mb-6 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 h-28"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <button
                disabled={!fullName || !email}
                onClick={handleConfirmBooking}
                className="w-full bg-teal-500 text-white py-3 rounded disabled:bg-gray-300 font-medium"
              >
                {duration === "60 minutes" ? "Proceed to Payment" : "Confirm Booking"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BookSession;

