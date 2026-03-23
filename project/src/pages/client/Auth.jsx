import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import { setClientSession } from "../../lib/clientSession";

const ClientAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      if (isLogin) {
        const response = await apiRequest("/client/login", {
          method: "POST",
          auth: "client",
          body: JSON.stringify({ email: form.email, password: form.password }),
        });

        if (!response?.user) {
          throw new Error("Login response was incomplete.");
        }

        setClientSession({ user: response.user });
        navigate("/client/dashboard");
        return;
      }

      const response = await apiRequest("/client/register", {
        method: "POST",
        auth: "client",
        body: JSON.stringify(form),
      });

      if (!response?.user) {
        alert("Registered successfully. Please log in.");
        setIsLogin(true);
        setForm({ name: "", email: "", password: "" });
        return;
      }

      setClientSession({ user: response.user });
      alert(
        response?.emailSent
          ? "Registration successful. A confirmation email has been sent."
          : `Registration successful.${response?.emailInfo ? ` Email notice: ${response.emailInfo}` : ""}`
      );
      navigate("/client/dashboard");
    } catch (error) {
      alert(error.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{isLogin ? "Client Login" : "Client Registration"}</h2>

      <div className="flex justify-center mb-6 gap-4">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-sm ${
            isLogin ? "bg-teal-600 text-white shadow-teal-200" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-sm ${
            !isLogin ? "bg-teal-600 text-white shadow-teal-200" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Register
        </button>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 active:bg-teal-800 transition-all duration-200 shadow-md disabled:bg-gray-400"
        >
          {submitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default ClientAuth;
