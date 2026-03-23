import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import { COACHES } from "../../data/coaches";
import { trackEvent } from "../../utils/analytics";

function BookingOne() {
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
  const [bookedSlots, setBookedSlots] = useState([]);

  const timeSlots = {
    morning: ["9:00 AM", "10:00 AM", "11:00 AM"],
    afternoon: ["1:00 PM", "2:00 PM", "4:00 PM"],
  };

  useEffect(() => {
    apiRequest("/bookings/slots")
      .then((data) => setBookedSlots(Array.isArray(data) ? data : []))
      .catch(() => setBookedSlots([]));
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthLabel = new Date(viewYear, viewMonth).toLocaleString("default", { month: "long", year: "numeric" });
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const minMonthValue = today.getFullYear() * 12 + today.getMonth();
  const currentMonthValue = viewYear * 12 + viewMonth;
  const canGoPrevMonth = currentMonthValue > minMonthValue;
  const allSlots = [...timeSlots.morning, ...timeSlots.afternoon];

  const toDateOnly = (value) => String(value || "").split("T")[0].trim();
  const getTakenSlotsForDate = (dateIso) => {
    const taken = new Set();
    bookedSlots.forEach((record) => {
      if (toDateOnly(record.date) !== dateIso) return;
      const slot = String(record.timeSlot || "").trim();
      if (slot) taken.add(slot);
    });
    return taken;
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

  const isPastDate = (year, month, day) => {
    const selected = new Date(year, month, day);
    selected.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return selected < now;
  };

  const isPastTimeSlot = (dateObj, slot) => {
    if (!dateObj) return false;
    const parsed = parseTimeSlot(slot);
    if (!parsed) return false;
    const slotDate = new Date(dateObj);
    slotDate.setHours(parsed.hour, parsed.minute, 0, 0);
    return slotDate < new Date();
  };

  const isDateFullyBooked = (year, month, day) => {
    const dateObj = new Date(year, month, day);
    const dateIso = toDateOnly(dateObj.toISOString());
    const taken = getTakenSlotsForDate(dateIso);
    return !allSlots.some((slot) => !taken.has(slot) && !isPastTimeSlot(dateObj, slot));
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

  const handleConfirmBooking = async () => {
    const booking = {
      id: Date.now(),
      service,
      duration,
      consultant,
      date: selectedDate?.toISOString().split("T")[0],
      timeSlot,
      fullName,
      email,
      note,
      createdAt: new Date().toISOString(),
      status: "upcoming",
    };

    try {
      const response = await apiRequest("/bookings/public", {
        method: "POST",
        body: JSON.stringify(booking),
      });
      trackEvent("booking_public_success", {
        service: booking.service,
        duration: booking.duration,
        consultant: booking.consultant,
      });
      alert(
        response?.emailSent
          ? "Booking confirmed. A confirmation email has been sent."
          : `Booking confirmed.${response?.emailInfo ? ` Email notice: ${response.emailInfo}` : ""}`
      );
      navigate("/bookingsuccess", { state: response?.booking || booking });
    } catch (error) {
      trackEvent("booking_public_failed", { reason: error.message || "api_error" });
      alert(error.message || "Booking failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-teal-500">Book a Consultation</h1>
      {step === 1 && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Choose a Service</h2>
          {[
            { id: "Strategy Consultation", label: "Strategy Consultation" },
            { id: "Startup Advisory", label: "Startup Advisory" },
            { id: "Coaching Session", label: "Coaching Session" },
          ].map((s) => (
            <div key={s.id} onClick={() => setService(s.id)} className={`p-4 border rounded mb-3 ${service === s.id ? "border-teal-500 bg-teal-50" : ""}`}>
              {s.label}
            </div>
          ))}
          <button disabled={!service} onClick={() => setStep(2)} className="w-full mt-4 bg-teal-500 text-white py-2 rounded disabled:bg-gray-300">
            Continue
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Choose Duration</h2>
          {[
            { id: "30 minutes", label: "Discovery Call (30 mins)" },
            { id: "60 minutes", label: "Strategy Session (60 mins)" },
          ].map((d) => (
            <div key={d.id} onClick={() => setDuration(d.id)} className={`p-4 border rounded mb-3 ${duration === d.id ? "border-indigo-500 bg-indigo-50" : ""}`}>
              {d.label}
            </div>
          ))}
          <button disabled={!duration} onClick={() => setStep(3)} className="w-full bg-teal-500 text-white py-2 rounded disabled:bg-gray-300">
            Continue
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Select Date & Time</h2>
          <div className="mb-3 flex items-center justify-between">
            <button type="button" onClick={goPrevMonth} disabled={!canGoPrevMonth} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
              Prev
            </button>
            <p className="text-sm font-semibold text-gray-700">{monthLabel}</p>
            <button type="button" onClick={goNextMonth} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700">
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
            {Array(firstDayOfMonth)
              .fill(null)
              .map((_, i) => (
                <div key={i} />
              ))}
            {daysArray.map((day) => {
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
                  className={`p-2 rounded ${isSelected ? "bg-teal-500 text-white" : disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-teal-100"}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          {selectedDate &&
            Object.values(timeSlots)
              .flat()
              .map((slot) => {
                const selectedDateIso = toDateOnly(selectedDate.toISOString());
                const taken = getTakenSlotsForDate(selectedDateIso).has(slot);
                const past = isPastTimeSlot(selectedDate, slot);
                const disabled = taken || past;
                return (
                  <button
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    disabled={disabled}
                    className={`block w-full mb-2 p-2 border rounded ${
                      timeSlot === slot
                        ? "bg-indigo-500 text-white"
                        : disabled
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {slot} {taken ? "(Booked)" : past ? "(Past)" : ""}
                  </button>
                );
              })}
          <button disabled={!selectedDate || !timeSlot} onClick={() => setStep(4)} className="w-full bg-teal-500 text-white py-2 rounded disabled:bg-gray-300">
            Continue
          </button>
        </div>
      )}
      {step === 4 && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Your Details</h2>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Coach</label>
          <select value={consultant} onChange={(e) => setConsultant(e.target.value)} className="w-full mb-3 p-3 border rounded">
            {COACHES.map((coach) => (
              <option key={coach.id} value={coach.name}>
                {coach.name} - {coach.title}
              </option>
            ))}
          </select>
          <input placeholder="Full Name" className="w-full mb-3 p-3 border rounded" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input placeholder="Email" className="w-full mb-3 p-3 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
          <textarea placeholder="Notes (optional)" className="w-full mb-4 p-3 border rounded" value={note} onChange={(e) => setNote(e.target.value)} />
          <button disabled={!fullName || !email} onClick={handleConfirmBooking} className="w-full bg-teal-500 text-white py-3 rounded disabled:bg-gray-300">
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}

export default BookingOne;
