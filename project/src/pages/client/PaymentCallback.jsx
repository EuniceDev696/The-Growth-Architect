import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../../lib/api";

export default function PaymentCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const run = async () => {
      const reference = searchParams.get("reference") || "";
      const pendingRaw = sessionStorage.getItem("pendingBookingPayment");
      const pendingBooking = pendingRaw ? JSON.parse(pendingRaw) : null;

      if (!reference || !pendingBooking) {
        setMessage("Payment details are missing. Please try booking again.");
        return;
      }

      try {
        await apiRequest("/payments/verify", {
          method: "POST",
          body: JSON.stringify({ reference }),
        });
        await apiRequest("/bookings/client", {
          method: "POST",
          auth: "client",
          body: JSON.stringify({ ...pendingBooking, paymentReference: reference }),
        });

        sessionStorage.removeItem("pendingBookingPayment");
        setMessage("Payment confirmed. Redirecting to your dashboard...");
        setTimeout(() => navigate("/client/dashboard"), 1200);
      } catch (error) {
        setMessage(error.message || "Unable to verify payment. Please contact support.");
      }
    };

    run();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-lg w-full bg-white rounded-xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Payment Status</h1>
        <p className="text-slate-600">{message}</p>
      </div>
    </div>
  );
}
