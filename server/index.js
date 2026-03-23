import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIST_DIR = path.resolve(__dirname, "../project/dist");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Do not restrict camera/microphone here; Jitsi runs in a cross-origin iframe.
  res.setHeader("Permissions-Policy", "geolocation=()");
  next();
});

const PORT = Number(process.env.PORT || 4000);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/growth-architect";
const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";
const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || "admin@test.com").trim().toLowerCase();
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || "123456");
const MEETING_TOKEN_TTL = process.env.MEETING_TOKEN_TTL || "30d";
const APP_BASE_URL = String(process.env.APP_BASE_URL || "http://localhost:5173").replace(/\/+$/, "");
const MAIL_FROM = String(process.env.MAIL_FROM || "no-reply@growtharchitect.local");
const SMTP_HOST = String(process.env.SMTP_HOST || "").trim();
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const SMTP_USER = String(process.env.SMTP_USER || "").trim();
const SMTP_PASS = String(process.env.SMTP_PASS || "").trim();
const CONTACT_EMAIL = String(process.env.CONTACT_EMAIL || MAIL_FROM || "support@growtharchitect.com").trim();
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 80);
const STRICT_RATE_LIMIT_MAX_REQUESTS = Number(process.env.STRICT_RATE_LIMIT_MAX_REQUESTS || 12);
const PAYSTACK_SECRET_KEY = String(process.env.PAYSTACK_SECRET_KEY || "").trim();
const PAYSTACK_PUBLIC_KEY = String(process.env.PAYSTACK_PUBLIC_KEY || "").trim();
const REMINDER_CRON_ENABLED = String(process.env.REMINDER_CRON_ENABLED || "true").toLowerCase() === "true";
const REMINDER_INTERVAL_MS = Number(process.env.REMINDER_INTERVAL_MS || 5 * 60 * 1000);
const COOKIE_SECURE = String(process.env.COOKIE_SECURE || "false").toLowerCase() === "true";
const ADMIN_AUTH_COOKIE = "ga_admin_auth";
const CLIENT_AUTH_COOKIE = "ga_client_auth";

const DEFAULT_SETTINGS = {
  businessName: "The Growth Architect",
  supportEmail: "support@growtharchitect.com",
  timezone: "America/New_York",
  notifications: {
    email: true,
    bookings: true,
    messages: true,
    reminders: false,
  },
  branding: {
    primaryColor: "#4f46e5",
    accentColor: "#14b8a6",
  },
};

const DEFAULT_PROGRAMS = [
  { id: 1, name: "Executive Leadership", type: "Coaching", price: 500000 },
  { id: 2, name: "Business Scale", type: "Consulting", price: 1200000 },
  { id: 3, name: "Strategic Planning", type: "Workshop", price: 35000 },
];

const DEFAULT_SITE_CONTENT = {
  home: {
    heroTitle: "Growth is not accidental. It is architected.",
    heroSubtitle:
      "The Growth Architect partners with business leaders to design clear strategy, disciplined execution, and sustainable growth systems.",
    primaryCta: "Start a Conversation",
  },
  testimonials: [
    { id: "t-1", name: "Alex Okoh", role: "Founder, SaaS Company", quote: "Clarity and execution changed everything for us." },
    { id: "t-2", name: "Omolara Davies", role: "COO, Growth Agency", quote: "Direct strategy, no fluff, and measurable outcomes." },
  ],
};

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const AppDataSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, required: true, unique: true, default: "main" },
    settings: {
      businessName: String,
      supportEmail: String,
      timezone: String,
      notifications: {
        email: Boolean,
        bookings: Boolean,
        messages: Boolean,
        reminders: Boolean,
      },
      branding: {
        primaryColor: String,
        accentColor: String,
      },
    },
    programs: [mongoose.Schema.Types.Mixed],
    users: [mongoose.Schema.Types.Mixed],
    bookings: [mongoose.Schema.Types.Mixed],
    client_bookings: [mongoose.Schema.Types.Mixed],
    sessions: [mongoose.Schema.Types.Mixed],
    allMessages: [mongoose.Schema.Types.Mixed],
    subscribers: [mongoose.Schema.Types.Mixed],
    newsletters: [mongoose.Schema.Types.Mixed],
    leads: [mongoose.Schema.Types.Mixed],
    siteContent: mongoose.Schema.Types.Mixed,
    reminderLog: [mongoose.Schema.Types.Mixed],
    payments: [mongoose.Schema.Types.Mixed],
    clientGoals: [mongoose.Schema.Types.Mixed],
    clientActions: [mongoose.Schema.Types.Mixed],
    clientActivity: [mongoose.Schema.Types.Mixed],
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);
const AppData = mongoose.model("AppData", AppDataSchema);

const toLower = (v) => String(v || "").trim().toLowerCase();
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
const normalizeMeetingId = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
const buildMeetingIdFromRecord = (record) => {
  const derived = record?.meetingId || record?.id || `${record?.email || record?.clientEmail}-${record?.date}-${record?.time || record?.timeSlot || ""}`;
  return normalizeMeetingId(derived);
};
const issueMeetingToken = ({ meetingId, email, role = "client", expiresIn = MEETING_TOKEN_TTL }) => {
  return jwt.sign(
    {
      kind: "meeting-access",
      meetingId: normalizeMeetingId(meetingId),
      email: toLower(email),
      role,
    },
    JWT_SECRET,
    { expiresIn }
  );
};

const isEmailEnabled = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
let smtpTransport = null;

const getSmtpTransport = () => {
  if (!isEmailEnabled) return null;
  if (smtpTransport) return smtpTransport;
  smtpTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
  return smtpTransport;
};

const sendEmail = async ({ to, subject, html, text, attachments }) => {
  const transporter = getSmtpTransport();
  if (!transporter) {
    return { sent: false, reason: "Email is disabled. Configure SMTP env vars." };
  }
  await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    text,
    html,
    attachments: Array.isArray(attachments) ? attachments : undefined,
  });
  return { sent: true };
};

const buildBookingEmail = ({ name, service, duration, date, timeSlot, meetingLink, supportEmail }) => {
  const safeMeetingLink = String(meetingLink || "").trim();
  const details = [
    `Service: ${service || "Consultation"}`,
    `Duration: ${duration || "Not specified"}`,
    `Date: ${date || "Not set"}`,
    `Time: ${timeSlot || "Not set"}`,
    `Meeting link: ${safeMeetingLink || "Unavailable"}`,
  ].join("\n");

  return {
    subject: "Booking Confirmed: Your Growth Architect Session",
    text: `Hi ${name || "there"},\n\nYour session is confirmed.\n\n${details}\n\nJoin meeting link:\n${safeMeetingLink || "Unavailable"}\n\nIf you need help, reply to ${supportEmail || "support@growtharchitect.com"}.`,
    html: `
      <p>Hi ${name || "there"},</p>
      <p>Your session is confirmed.</p>
      <ul>
        <li><strong>Service:</strong> ${service || "Consultation"}</li>
        <li><strong>Duration:</strong> ${duration || "Not specified"}</li>
        <li><strong>Date:</strong> ${date || "Not set"}</li>
        <li><strong>Time:</strong> ${timeSlot || "Not set"}</li>
      </ul>
      <p><strong>Join meeting link:</strong><br />${safeMeetingLink || "Unavailable"}</p>
      <p><a href="${safeMeetingLink}" style="display:inline-block;padding:10px 16px;background:#0d9488;color:#fff;text-decoration:none;border-radius:8px;">Join Your Meeting</a></p>
      <p>If you need help, reply to ${supportEmail || "support@growtharchitect.com"}.</p>
    `,
  };
};

const buildRegistrationEmail = ({ name, dashboardLink, supportEmail }) => {
  return {
    subject: "Welcome to The Growth Architect",
    text: `Hi ${name || "there"},\n\nYour account has been created successfully.\n\nOpen your dashboard: ${dashboardLink}\n\nNeed help? ${supportEmail || "support@growtharchitect.com"}`,
    html: `
      <p>Hi ${name || "there"},</p>
      <p>Your account has been created successfully.</p>
      <p><a href="${dashboardLink}">Open your dashboard</a></p>
      <p>Need help? ${supportEmail || "support@growtharchitect.com"}</p>
    `,
  };
};

const buildSubscriberWelcomeEmail = ({ email }) => {
  return {
    subject: "You are subscribed to Growth Insights",
    text: `Hi,\n\nThanks for subscribing with ${email}.\n\nYou will receive growth strategy updates from The Growth Architect.`,
    html: `
      <p>Hi,</p>
      <p>Thanks for subscribing with <strong>${email}</strong>.</p>
      <p>You will receive growth strategy updates from The Growth Architect.</p>
    `,
  };
};

const buildContactNotificationEmail = ({ name, email, message }) => {
  return {
    subject: `New Contact Message from ${name || "Website Visitor"}`,
    text: `Name: ${name || "Unknown"}\nEmail: ${email || "Unknown"}\n\nMessage:\n${message || ""}`,
    html: `
      <p><strong>Name:</strong> ${name || "Unknown"}</p>
      <p><strong>Email:</strong> ${email || "Unknown"}</p>
      <p><strong>Message:</strong></p>
      <p>${String(message || "").replace(/\n/g, "<br />")}</p>
    `,
  };
};

const getEstimate = (booking) => {
  const service = toLower(booking.service);
  if (service.includes("strategy") || service.includes("advisory")) return 10000;
  if (service.includes("coaching")) return 5000;
  return 2500;
};

const getAppData = async () => {
  let doc = await AppData.findOne({ singletonKey: "main" });
  if (!doc) {
    doc = await AppData.create({
      singletonKey: "main",
      settings: DEFAULT_SETTINGS,
      programs: DEFAULT_PROGRAMS,
      users: [],
      bookings: [],
      client_bookings: [],
      sessions: [],
      allMessages: [],
      subscribers: [],
      newsletters: [],
      leads: [],
      siteContent: DEFAULT_SITE_CONTENT,
      reminderLog: [],
      payments: [],
      clientGoals: [],
      clientActions: [],
      clientActivity: [],
    });
  }
  let shouldSave = false;
  if (!Array.isArray(doc.leads)) {
    doc.leads = [];
    shouldSave = true;
  }
  if (!doc.siteContent || typeof doc.siteContent !== "object") {
    doc.siteContent = DEFAULT_SITE_CONTENT;
    shouldSave = true;
  }
  if (!Array.isArray(doc.reminderLog)) {
    doc.reminderLog = [];
    shouldSave = true;
  }
  if (!Array.isArray(doc.payments)) {
    doc.payments = [];
    shouldSave = true;
  }
  if (shouldSave) await doc.save();
  return doc;
};

const sanitizeClientUser = (user = {}) => ({
  id: String(user.id || ""),
  name: String(user.name || ""),
  email: toLower(user.email),
  isAdmin: false,
  createdAt: user.createdAt || null,
});

const issueClientToken = (user) =>
  jwt.sign(
    {
      sub: String(user?.id || ""),
      email: toLower(user?.email),
      role: "client",
    },
    JWT_SECRET,
    { expiresIn: "12h" }
  );

const issueAdminToken = (admin) =>
  jwt.sign({ sub: String(admin?._id || admin?.id || ""), email: toLower(admin?.email), role: "admin" }, JWT_SECRET, {
    expiresIn: "12h",
  });

const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: COOKIE_SECURE,
  path: "/",
  maxAge: 12 * 60 * 60 * 1000,
};

const readCookies = (req) => {
  const raw = String(req.headers.cookie || "");
  if (!raw) return {};
  return raw.split(";").reduce((acc, pair) => {
    const idx = pair.indexOf("=");
    if (idx < 0) return acc;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    if (key) acc[key] = decodeURIComponent(val);
    return acc;
  }, {});
};

const verifyTokenSafe = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

const findClientByEmail = (db, email) =>
  (db.users || []).find((u) => !u.isAdmin && toLower(u.email) === toLower(email));

const findClientById = (db, id) => (db.users || []).find((u) => !u.isAdmin && String(u.id || "") === String(id || ""));

const appendClientActivity = (db, { email, text, type = "general" }) => {
  const safeEmail = toLower(email);
  const safeText = String(text || "").trim();
  if (!isValidEmail(safeEmail) || !safeText) return;
  const now = new Date();
  const entry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email: safeEmail,
    text: safeText,
    type,
    timestamp: now.toISOString(),
    date: now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };
  db.clientActivity = [...(db.clientActivity || []), entry].slice(-5000);
};

const remapClientEmailAcrossDb = (db, oldEmail, nextEmail) => {
  const prev = toLower(oldEmail);
  const next = toLower(nextEmail);
  if (!prev || !next || prev === next) return;

  const replaceEmail = (list = [], fields = []) =>
    list.map((item) => {
      const updated = { ...item };
      fields.forEach((field) => {
        if (toLower(updated[field]) === prev) {
          updated[field] = next;
        }
      });
      return updated;
    });

  db.bookings = replaceEmail(db.bookings, ["email", "clientEmail"]);
  db.client_bookings = replaceEmail(db.client_bookings, ["email", "clientEmail"]);
  db.sessions = replaceEmail(db.sessions, ["email", "clientEmail"]);
  db.allMessages = replaceEmail(db.allMessages, ["email", "clientEmail"]);
  db.clientGoals = replaceEmail(db.clientGoals, ["email"]);
  db.clientActions = replaceEmail(db.clientActions, ["email"]);
  db.clientActivity = replaceEmail(db.clientActivity, ["email"]);
  db.payments = replaceEmail(db.payments, ["email"]);
};

const getClientScopedSessions = (db, email) => {
  const safeEmail = toLower(email);
  const own = [...(db.sessions || []), ...(db.client_bookings || [])].filter(
    (entry) => toLower(entry.email || entry.clientEmail) === safeEmail
  );
  const deduped = new Map();
  own.forEach((entry) => {
    const meetingId = buildMeetingIdFromRecord(entry);
    if (!meetingId) return;
    const existing = deduped.get(meetingId) || {};
    deduped.set(meetingId, {
      ...existing,
      ...entry,
      id: meetingId,
      meetingId,
      email: safeEmail,
      clientEmail: safeEmail,
      type: entry.type || entry.service || existing.type || "Session",
      time: entry.time || entry.timeSlot || existing.time || "",
      timeSlot: entry.timeSlot || entry.time || existing.timeSlot || "",
    });
  });
  return Array.from(deduped.values()).sort((a, b) => {
    const aDate = new Date(`${a.date || ""}T${a.time || a.timeSlot || "00:00"}`);
    const bDate = new Date(`${b.date || ""}T${b.time || b.timeSlot || "00:00"}`);
    return bDate - aDate;
  });
};

const ipRateState = new Map();

const getClientIp = (req) => {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.ip || req.socket?.remoteAddress || "unknown";
};

const createRateLimiter = (maxRequests = RATE_LIMIT_MAX_REQUESTS) => {
  return (req, res, next) => {
    const ip = getClientIp(req);
    const now = Date.now();
    const key = `${req.path}:${ip}`;
    const existing = ipRateState.get(key);

    if (!existing || now - existing.windowStart > RATE_LIMIT_WINDOW_MS) {
      ipRateState.set(key, { windowStart: now, count: 1 });
      return next();
    }

    if (existing.count >= maxRequests) {
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    }

    existing.count += 1;
    ipRateState.set(key, existing);
    return next();
  };
};

const paystackEnabled = Boolean(PAYSTACK_SECRET_KEY && PAYSTACK_PUBLIC_KEY);

const upsertLead = (db, payload = {}) => {
  const email = toLower(payload.email);
  if (!email || !isValidEmail(email)) return null;
  const existing = (db.leads || []).find((lead) => toLower(lead.email) === email);
  const nowIso = new Date().toISOString();

  if (existing) {
    existing.name = payload.name || existing.name || email;
    existing.source = payload.source || existing.source || "website";
    existing.lastActivityAt = nowIso;
    existing.notes = payload.note ? [...(existing.notes || []), { text: payload.note, at: nowIso }] : existing.notes;
    return existing;
  }

  const lead = {
    id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: payload.name || email,
    email,
    source: payload.source || "website",
    stage: "new",
    createdAt: nowIso,
    lastActivityAt: nowIso,
    notes: payload.note ? [{ text: payload.note, at: nowIso }] : [],
  };
  db.leads = [...(db.leads || []), lead];
  return lead;
};

const parseSlotToDate = (dateIso, slot) => {
  if (!dateIso) return null;
  const base = new Date(`${String(dateIso).trim()}T00:00:00`);
  if (Number.isNaN(base.getTime())) return null;
  const raw = String(slot || "").trim();
  if (!raw) return null;

  const amPmMatch = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (amPmMatch) {
    let hour = Number(amPmMatch[1]);
    const minute = Number(amPmMatch[2]);
    const meridiem = amPmMatch[3].toUpperCase();
    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;
    base.setHours(hour, minute, 0, 0);
    return base;
  }

  const h24Match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!h24Match) return null;
  const hour = Number(h24Match[1]);
  const minute = Number(h24Match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  base.setHours(hour, minute, 0, 0);
  return base;
};

const toIcsUtc = (dateObj) => {
  const y = dateObj.getUTCFullYear();
  const m = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getUTCDate()).padStart(2, "0");
  const hh = String(dateObj.getUTCHours()).padStart(2, "0");
  const mm = String(dateObj.getUTCMinutes()).padStart(2, "0");
  const ss = String(dateObj.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${d}T${hh}${mm}${ss}Z`;
};

const buildIcsAttachment = ({ booking, meetingLink }) => {
  const start = parseSlotToDate(booking?.date, booking?.timeSlot || booking?.time);
  if (!start) return null;
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const uid = `${booking?.meetingId || booking?.id || Date.now()}@growtharchitect`;
  const summary = `${booking?.service || "Consultation"} - The Growth Architect`;
  const description = `Join link: ${meetingLink || ""}`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Growth Architect//Session//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `LOCATION:${meetingLink || "Online"}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return {
    filename: "growth-architect-session.ics",
    content: ics,
    contentType: "text/calendar; charset=utf-8; method=REQUEST",
  };
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const cookies = readCookies(req);
  const adminCookieToken = String(cookies[ADMIN_AUTH_COOKIE] || "");
  const clientCookieToken = String(cookies[CLIENT_AUTH_COOKIE] || "");

  const candidates = {};
  const bearerPayload = bearer ? verifyTokenSafe(bearer) : null;
  if (bearerPayload?.role) {
    candidates[toLower(bearerPayload.role)] = bearerPayload;
  }

  const adminPayload = adminCookieToken ? verifyTokenSafe(adminCookieToken) : null;
  if (adminPayload?.role === "admin") {
    candidates.admin = adminPayload;
  }

  const clientPayload = clientCookieToken ? verifyTokenSafe(clientCookieToken) : null;
  if (clientPayload?.role === "client") {
    candidates.client = clientPayload;
  }

  if (!candidates.admin && !candidates.client) {
    return res.status(401).json({ message: "Missing or invalid auth token" });
  }

  req.authCandidates = candidates;
  req.auth = candidates.admin || candidates.client;
  return next();
};

const requireRole = (role) => (req, res, next) => {
  const required = toLower(role);
  const candidate = req.authCandidates?.[required];
  if (!candidate) {
    return res.status(403).json({ message: `${role} role required` });
  }
  req.auth = candidate;
  return next();
};

const buildOverview = (db) => {
  const emailSet = new Set();
  db.users.filter((u) => !u.isAdmin).forEach((u) => emailSet.add(toLower(u.email)));
  [...db.bookings, ...db.client_bookings].forEach((b) => emailSet.add(toLower(b.email)));
  db.sessions.forEach((s) => emailSet.add(toLower(s.email)));
  db.allMessages.forEach((m) => emailSet.add(toLower(m.clientEmail || m.email)));
  db.clientGoals.forEach((g) => emailSet.add(toLower(g.email)));
  db.clientActions.forEach((a) => emailSet.add(toLower(a.email)));

  const revenue = [...db.bookings, ...db.client_bookings].reduce((sum, b) => sum + getEstimate(b), 0);
  const meetings =
    db.sessions.filter((s) => toLower(s.status) === "upcoming").length +
    db.client_bookings.filter((b) => toLower(b.status) === "upcoming").length;
  const unreadMessages = db.allMessages.filter((m) => (m.status || "New") === "New" && m.sender !== "admin").length;

  const recent = [
    ...db.clientActivity.map((x) => ({
      id: x.id || `${x.email}-${x.timestamp}`,
      text: x.text || "Client activity",
      timestamp: x.timestamp || x.createdAt,
    })),
    ...[...db.bookings, ...db.client_bookings].map((b) => ({
      id: `booking-${b.id}`,
      text: `New booking from ${b.fullName || b.email || "Unknown client"}`,
      timestamp: b.createdAt || b.date,
    })),
    ...db.allMessages.map((m) => ({
      id: `msg-${m.id}`,
      text: `New ${m.sender || "client"} message`,
      timestamp: m.createdAt || m.timestamp,
    })),
  ]
    .filter((x) => x.timestamp)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);

  return {
    clients: [...emailSet].filter(Boolean).length,
    revenue,
    meetings,
    programs: db.programs.length,
    unreadMessages,
    bookings: db.bookings.length + db.client_bookings.length,
    recentActivity: recent,
  };
};

const buildClients = (db) => {
  const map = new Map();

  const ensure = (email, name = "Unknown Client") => {
    const key = toLower(email);
    if (!key) return null;
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name,
        email: key,
        bookings: 0,
        sessions: 0,
        messages: 0,
        hasUpcoming: false,
        lastActivityAt: null,
      });
    }
    return map.get(key);
  };

  const bump = (client, dateVal) => {
    if (!client || !dateVal) return;
    const ts = new Date(dateVal).getTime();
    if (!Number.isNaN(ts) && (!client.lastActivityAt || ts > client.lastActivityAt)) {
      client.lastActivityAt = ts;
    }
  };

  db.users.filter((u) => !u.isAdmin).forEach((u) => {
    const client = ensure(u.email, u.name || "Client");
    if (client && u.name) client.name = u.name;
  });

  [...db.bookings, ...db.client_bookings].forEach((b) => {
    const client = ensure(b.email, b.fullName || b.name || "Client");
    if (!client) return;
    client.bookings += 1;
    if (toLower(b.status) === "upcoming") client.hasUpcoming = true;
    bump(client, b.createdAt || b.date);
  });

  db.sessions.forEach((s) => {
    const client = ensure(s.email, s.name || "Client");
    if (!client) return;
    client.sessions += 1;
    if (toLower(s.status) === "upcoming") client.hasUpcoming = true;
    bump(client, s.createdAt || s.date);
  });

  db.allMessages.forEach((m) => {
    const client = ensure(m.clientEmail || m.email, m.clientName || "Client");
    if (!client) return;
    client.messages += 1;
    bump(client, m.createdAt || m.timestamp);
  });

  return Array.from(map.values()).sort((a, b) => {
    if (!a.lastActivityAt && !b.lastActivityAt) return a.name.localeCompare(b.name);
    if (!a.lastActivityAt) return 1;
    if (!b.lastActivityAt) return -1;
    return b.lastActivityAt - a.lastActivityAt;
  });
};

app.get("/api/health", async (_req, res) => {
  return res.json({ ok: true });
});

app.get("/api/content/public", async (_req, res) => {
  const db = await getAppData();
  return res.json(db.siteContent || DEFAULT_SITE_CONTENT);
});

app.get("/api/content", authMiddleware, requireRole("admin"), async (_req, res) => {
  const db = await getAppData();
  return res.json(db.siteContent || DEFAULT_SITE_CONTENT);
});

app.post("/api/content", authMiddleware, requireRole("admin"), async (req, res) => {
  const db = await getAppData();
  const incoming = req.body || {};
  db.siteContent = {
    ...(db.siteContent || DEFAULT_SITE_CONTENT),
    ...incoming,
    home: {
      ...((db.siteContent || DEFAULT_SITE_CONTENT).home || {}),
      ...(incoming.home || {}),
    },
  };
  await db.save();
  return res.json(db.siteContent);
});

app.get("/api/leads", authMiddleware, requireRole("admin"), async (_req, res) => {
  const db = await getAppData();
  const leads = (db.leads || []).sort((a, b) => new Date(b.lastActivityAt || b.createdAt) - new Date(a.lastActivityAt || a.createdAt));
  return res.json(leads);
});

app.patch("/api/leads/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  const db = await getAppData();
  const id = String(req.params.id || "");
  const lead = (db.leads || []).find((item) => String(item.id) === id);
  if (!lead) return res.status(404).json({ message: "Lead not found" });

  const stage = String(req.body?.stage || "").trim().toLowerCase();
  const note = String(req.body?.note || "").trim();
  if (stage) lead.stage = stage;
  if (note) lead.notes = [...(lead.notes || []), { text: note, at: new Date().toISOString() }];
  lead.lastActivityAt = new Date().toISOString();
  await db.save();
  return res.json(lead);
});

app.get("/api/payments/config", async (_req, res) => {
  return res.json({ enabled: paystackEnabled, publicKey: paystackEnabled ? PAYSTACK_PUBLIC_KEY : "" });
});

app.post("/api/payments/initialize", createRateLimiter(STRICT_RATE_LIMIT_MAX_REQUESTS), async (req, res) => {
  if (!paystackEnabled) {
    return res.status(503).json({ message: "Payment provider is not configured" });
  }
  const email = toLower(req.body?.email);
  const amountKobo = Number(req.body?.amountKobo || 0);
  const metadata = req.body?.metadata || {};
  if (!isValidEmail(email) || !Number.isFinite(amountKobo) || amountKobo <= 0) {
    return res.status(400).json({ message: "Valid email and amount are required" });
  }

  const callbackUrl = `${APP_BASE_URL}/client/payment-callback`;
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amountKobo),
      callback_url: callbackUrl,
      metadata,
      currency: "NGN",
    }),
  });
  const data = await response.json();
  if (!response.ok || !data?.status) {
    return res.status(502).json({ message: data?.message || "Unable to initialize payment" });
  }
  return res.json({
    status: true,
    authorization_url: data.data?.authorization_url,
    reference: data.data?.reference,
    access_code: data.data?.access_code,
  });
});

app.post("/api/payments/verify", createRateLimiter(STRICT_RATE_LIMIT_MAX_REQUESTS), async (req, res) => {
  if (!paystackEnabled) {
    return res.status(503).json({ message: "Payment provider is not configured" });
  }
  const reference = String(req.body?.reference || "").trim();
  if (!reference) return res.status(400).json({ message: "Payment reference is required" });

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
  });
  const data = await response.json();
  if (!response.ok || !data?.status) {
    return res.status(502).json({ message: data?.message || "Payment verification failed" });
  }

  const db = await getAppData();
  const paymentRecord = {
    id: `pay-${Date.now()}`,
    reference,
    status: data?.data?.status || "unknown",
    amount: data?.data?.amount || 0,
    email: toLower(data?.data?.customer?.email),
    paidAt: data?.data?.paid_at || null,
    createdAt: new Date().toISOString(),
  };
  db.payments = [...(db.payments || []), paymentRecord];
  await db.save();

  return res.json({ success: true, payment: paymentRecord, gateway: data?.data || null });
});

app.post("/api/contact", createRateLimiter(STRICT_RATE_LIMIT_MAX_REQUESTS), async (req, res) => {
  const db = await getAppData();
  const name = String(req.body?.name || "").trim();
  const email = toLower(req.body?.email);
  const message = String(req.body?.message || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  const contactMessage = {
    id: req.body?.id || Date.now(),
    name,
    email,
    message,
    status: "New",
    sender: "visitor",
    clientEmail: email,
    createdAt: new Date().toISOString(),
  };

  db.allMessages = [...(db.allMessages || []), contactMessage];
  upsertLead(db, {
    email,
    name,
    source: "contact_form",
    note: `Contact message received: ${message.slice(0, 120)}`,
  });
  await db.save();

  let emailResult = { sent: false };
  try {
    const mail = buildContactNotificationEmail({ name, email, message });
    emailResult = await sendEmail({
      to: CONTACT_EMAIL,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
  } catch (error) {
    emailResult = { sent: false, reason: error.message };
  }

  return res.status(201).json({
    success: true,
    messageId: contactMessage.id,
    emailSent: emailResult.sent,
    emailInfo: emailResult.reason || null,
  });
});

app.post("/api/client/register", createRateLimiter(STRICT_RATE_LIMIT_MAX_REQUESTS), async (req, res) => {
  const db = await getAppData();
  const name = String(req.body?.name || "").trim();
  const email = toLower(req.body?.email);
  const password = String(req.body?.password || "").trim();

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  const exists = (db.users || []).some((u) => toLower(u.email) === email);
  if (exists) {
    return res.status(409).json({ message: "This email is already registered" });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    isAdmin: false,
    createdAt: new Date().toISOString(),
  };

  db.users = [...(db.users || []), newUser];
  upsertLead(db, {
    email,
    name,
    source: "registration",
    note: "User registered on website",
  });
  await db.save();

  let emailResult = { sent: false };
  try {
    const dashboardLink = `${APP_BASE_URL}/client/auth`;
    const mail = buildRegistrationEmail({
      name,
      dashboardLink,
      supportEmail: db.settings?.supportEmail,
    });
    emailResult = await sendEmail({
      to: email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
  } catch (error) {
    emailResult = { sent: false, reason: error.message };
  }

  const token = issueClientToken(newUser);
  res.cookie(CLIENT_AUTH_COOKIE, token, authCookieOptions);
  return res.status(201).json({
    success: true,
    user: sanitizeClientUser(newUser),
    emailSent: emailResult.sent,
    emailInfo: emailResult.reason || null,
  });
});

app.post("/api/client/login", createRateLimiter(STRICT_RATE_LIMIT_MAX_REQUESTS), async (req, res) => {
  const db = await getAppData();
  const email = toLower(req.body?.email);
  const password = String(req.body?.password || "");

  if (!isValidEmail(email) || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = findClientByEmail(db, email);
  if (!user) {
    return res.status(401).json({ message: "Invalid login" });
  }

  let valid = false;
  if (user.passwordHash && String(user.passwordHash).startsWith("$2")) {
    valid = await bcrypt.compare(password, user.passwordHash);
  } else {
    valid = String(user.password || "") === password;
    if (valid) {
      user.passwordHash = await bcrypt.hash(password, 10);
      delete user.password;
      db.markModified("users");
      await db.save();
    }
  }

  if (!valid) {
    return res.status(401).json({ message: "Invalid login" });
  }

  const token = issueClientToken(user);
  res.cookie(CLIENT_AUTH_COOKIE, token, authCookieOptions);
  return res.json({
    user: sanitizeClientUser(user),
  });
});

app.get("/api/client/me", authMiddleware, requireRole("client"), async (req, res) => {
  const db = await getAppData();
  const user = findClientById(db, req.auth.sub) || findClientByEmail(db, req.auth.email);
  if (!user) {
    return res.status(404).json({ message: "Client account not found" });
  }
  return res.json({ user: sanitizeClientUser(user) });
});

app.post("/api/client/profile", authMiddleware, requireRole("client"), async (req, res) => {
  const db = await getAppData();
  const user = findClientById(db, req.auth.sub) || findClientByEmail(db, req.auth.email);
  if (!user) {
    return res.status(404).json({ message: "Client account not found" });
  }

  const name = String(req.body?.name || "").trim();
  const email = toLower(req.body?.email);
  if (!name || !isValidEmail(email)) {
    return res.status(400).json({ message: "Valid name and email are required" });
  }

  const existing = findClientByEmail(db, email);
  if (existing && String(existing.id) !== String(user.id)) {
    return res.status(409).json({ message: "This email is already used by another client" });
  }

  const oldEmail = user.email;
  user.name = name;
  user.email = email;
  remapClientEmailAcrossDb(db, oldEmail, email);
  db.markModified("users");
  await db.save();

  const token = issueClientToken(user);
  res.cookie(CLIENT_AUTH_COOKIE, token, authCookieOptions);
  return res.json({ user: sanitizeClientUser(user) });
});

app.get("/api/client/sessions", authMiddleware, requireRole("client"), async (req, res) => {
  const db = await getAppData();
  const sessions = getClientScopedSessions(db, req.auth.email);
  return res.json(sessions);
});

app.post("/api/client/sessions/clear-past", authMiddleware, requireRole("client"), async (req, res) => {
  const safeEmail = toLower(req.auth.email);
  const db = await getAppData();
  const isPreviousMeeting = (record) => {
    const status = toLower(record?.status || "");
    if (status === "completed" || status === "cancelled") return true;
    const start = parseSlotToDate(record?.date, record?.time || record?.timeSlot);
    if (!start) return false;
    return start < new Date();
  };
  const filterList = (list = []) =>
    list.filter((entry) => {
      const entryEmail = toLower(entry.email || entry.clientEmail);
      if (entryEmail !== safeEmail) return true;
      return !isPreviousMeeting(entry);
    });

  db.sessions = filterList(db.sessions);
  db.client_bookings = filterList(db.client_bookings);
  await db.save();

  return res.json({ success: true });
});

app.get("/api/client/messages", authMiddleware, requireRole("client"), async (req, res) => {
  const safeEmail = toLower(req.auth.email);
  const db = await getAppData();
  const messages = (db.allMessages || [])
    .filter((msg) => toLower(msg.clientEmail || msg.email) === safeEmail)
    .sort((a, b) => new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp));
  return res.json(messages);
});

app.post("/api/client/messages", authMiddleware, requireRole("client"), async (req, res) => {
  const safeEmail = toLower(req.auth.email);
  const text = String(req.body?.text || "").trim();
  if (!text) {
    return res.status(400).json({ message: "Message text is required" });
  }
  const db = await getAppData();
  const now = new Date();
  const message = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    clientEmail: safeEmail,
    sender: "client",
    text,
    status: "New",
    timestamp: now.toISOString(),
    createdAt: now.toISOString(),
    dateDisplay: now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  };
  db.allMessages = [...(db.allMessages || []), message];
  appendClientActivity(db, { email: safeEmail, text: `Sent message: ${text.slice(0, 80)}`, type: "message" });
  await db.save();
  return res.status(201).json({ success: true, message });
});

app.get("/api/client/goals", authMiddleware, requireRole("client"), async (req, res) => {
  const safeEmail = toLower(req.auth.email);
  const db = await getAppData();
  const goals = (db.clientGoals || []).filter((goal) => toLower(goal.email) === safeEmail);
  return res.json(goals);
});

app.post("/api/client/goals", authMiddleware, requireRole("client"), async (req, res) => {
  const safeEmail = toLower(req.auth.email);
  const title = String(req.body?.title || "").trim();
  const status = String(req.body?.status || "in-progress").trim();
  if (!title) {
    return res.status(400).json({ message: "Goal title is required" });
  }
  const db = await getAppData();
  const goal = {
    id: `goal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email: safeEmail,
    title,
    status,
    milestones: [],
    createdAt: new Date().toISOString(),
  };
  db.clientGoals = [...(db.clientGoals || []), goal];
  appendClientActivity(db, { email: safeEmail, text: `Added new goal: ${goal.title}`, type: "goal" });
  await db.save();
  return res.status(201).json(goal);
});

app.patch("/api/client/goals/:id", authMiddleware, requireRole("client"), async (req, res) => {
  const safeEmail = toLower(req.auth.email);
  const goalId = String(req.params.id || "");
  const db = await getAppData();
  const index = (db.clientGoals || []).findIndex((goal) => goal.id === goalId && toLower(goal.email) === safeEmail);
  if (index < 0) {
    return res.status(404).json({ message: "Goal not found" });
  }

  const current = db.clientGoals[index];
  const next = {
    ...current,
    ...(req.body || {}),
    id: current.id,
    email: current.email,
  };
  db.clientGoals[index] = next;
  db.markModified("clientGoals");
  await db.save();
  return res.json(next);
});

app.delete("/api/client/goals/:id", authMiddleware, requireRole("client"), async (req, res) => {
  const safeEmail = toLower(req.auth.email);
  const goalId = String(req.params.id || "");
  const db = await getAppData();
  db.clientGoals = (db.clientGoals || []).filter((goal) => !(goal.id === goalId && toLower(goal.email) === safeEmail));
  await db.save();
  return res.json({ success: true });
});

app.get("/api/client/actions", authMiddleware, requireRole("client"), async (req, res) => {
  const safeEmail = toLower(req.auth.email);
  const db = await getAppData();
  const actions = (db.clientActions || []).filter((action) => toLower(action.email) === safeEmail);
  return res.json(actions);
});

app.post("/api/client/actions", authMiddleware, requireRole("client"), async (req, res) => {
  const safeEmail = toLower(req.auth.email);
  const text = String(req.body?.text || "").trim();
  if (!text) {
    return res.status(400).json({ message: "Action text is required" });
  }
  const db = await getAppData();
  const action = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email: safeEmail,
    text,
    dueDate: req.body?.dueDate || null,
    priority: String(req.body?.priority || "medium"),
    status: String(req.body?.status || "pending"),
    createdAt: new Date().toISOString(),
  };
  db.clientActions = [...(db.clientActions || []), action];
  appendClientActivity(db, { email: safeEmail, text: `Added action: ${action.text}`, type: "action" });
  await db.save();
  return res.status(201).json(action);
});

app.patch("/api/client/actions/:id", authMiddleware, requireRole("client"), async (req, res) => {
  const safeEmail = toLower(req.auth.email);
  const actionId = String(req.params.id || "");
  const db = await getAppData();
  const index = (db.clientActions || []).findIndex((action) => action.id === actionId && toLower(action.email) === safeEmail);
  if (index < 0) {
    return res.status(404).json({ message: "Action not found" });
  }
  const current = db.clientActions[index];
  const next = {
    ...current,
    ...(req.body || {}),
    id: current.id,
    email: current.email,
  };
  db.clientActions[index] = next;
  db.markModified("clientActions");
  await db.save();
  return res.json(next);
});

app.delete("/api/client/actions/:id", authMiddleware, requireRole("client"), async (req, res) => {
  const safeEmail = toLower(req.auth.email);
  const actionId = String(req.params.id || "");
  const db = await getAppData();
  db.clientActions = (db.clientActions || []).filter((action) => !(action.id === actionId && toLower(action.email) === safeEmail));
  await db.save();
  return res.json({ success: true });
});

app.get("/api/client/activity", authMiddleware, requireRole("client"), async (req, res) => {
  const safeEmail = toLower(req.auth.email);
  const db = await getAppData();
  const recent = (db.clientActivity || [])
    .filter((item) => toLower(item.email) === safeEmail)
    .sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt))
    .slice(0, 20);
  return res.json(recent);
});

app.post("/api/client/activity", authMiddleware, requireRole("client"), async (req, res) => {
  const db = await getAppData();
  const text = String(req.body?.text || "").trim();
  const type = String(req.body?.type || "general");
  if (!text) {
    return res.status(400).json({ message: "Activity text is required" });
  }
  appendClientActivity(db, { email: req.auth.email, text, type });
  await db.save();
  return res.status(201).json({ success: true });
});

app.get("/api/client/dashboard", authMiddleware, requireRole("client"), async (req, res) => {
  const safeEmail = toLower(req.auth.email);
  const db = await getAppData();
  const sessions = getClientScopedSessions(db, safeEmail);
  const goals = (db.clientGoals || []).filter((goal) => toLower(goal.email) === safeEmail);
  const actions = (db.clientActions || [])
    .filter((action) => toLower(action.email) === safeEmail)
    .sort((a, b) => new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31"));
  const recentActivity = (db.clientActivity || [])
    .filter((item) => toLower(item.email) === safeEmail)
    .sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt))
    .slice(0, 8);

  return res.json({
    sessions,
    goals,
    actions,
    recentActivity,
  });
});

app.post("/api/subscribers/public", createRateLimiter(STRICT_RATE_LIMIT_MAX_REQUESTS), async (req, res) => {
  const db = await getAppData();
  const email = toLower(req.body?.email);

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  const existing = (db.subscribers || []).find((s) => toLower(s.email) === email);
  if (existing) {
    return res.json({ success: true, alreadySubscribed: true, subscriber: existing });
  }

  const subscriber = {
    id: `sub-${Date.now()}`,
    email,
    status: "active",
    source: "home-form",
    subscribedAt: new Date().toISOString(),
  };

  db.subscribers = [...(db.subscribers || []), subscriber];
  upsertLead(db, {
    email,
    name: email,
    source: "newsletter_subscribe",
    note: "Subscribed to newsletter",
  });
  await db.save();

  let emailResult = { sent: false };
  try {
    const mail = buildSubscriberWelcomeEmail({ email });
    emailResult = await sendEmail({
      to: email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
  } catch (error) {
    emailResult = { sent: false, reason: error.message };
  }

  return res.status(201).json({
    success: true,
    subscriber,
    emailSent: emailResult.sent,
    emailInfo: emailResult.reason || null,
  });
});

app.post("/api/admin/login", createRateLimiter(STRICT_RATE_LIMIT_MAX_REQUESTS), async (req, res) => {
  try {
    const email = toLower(req.body?.email);
    const password = String(req.body?.password || "");

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid login" });
    if (!admin.passwordHash || typeof admin.passwordHash !== "string") {
      return res.status(500).json({ message: "Admin account is misconfigured. Reset admin password from env." });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid login" });

    const token = issueAdminToken(admin);
    res.cookie(ADMIN_AUTH_COOKIE, token, authCookieOptions);
    return res.json({ admin: { email: admin.email, role: admin.role } });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", detail: error.message });
  }
});

app.post("/api/admin/logout", authMiddleware, requireRole("admin"), async (_req, res) => {
  res.clearCookie(ADMIN_AUTH_COOKIE, {
    httpOnly: authCookieOptions.httpOnly,
    sameSite: authCookieOptions.sameSite,
    secure: authCookieOptions.secure,
    path: authCookieOptions.path,
  });
  return res.json({ success: true });
});

app.get("/api/admin/me", authMiddleware, requireRole("admin"), async (req, res) => {
  const admin = await Admin.findById(req.auth.sub);
  if (!admin) return res.status(404).json({ message: "Admin not found" });
  return res.json({ admin: { email: admin.email, role: admin.role } });
});

app.post("/api/client/logout", authMiddleware, requireRole("client"), async (_req, res) => {
  res.clearCookie(CLIENT_AUTH_COOKIE, {
    httpOnly: authCookieOptions.httpOnly,
    sameSite: authCookieOptions.sameSite,
    secure: authCookieOptions.secure,
    path: authCookieOptions.path,
  });
  return res.json({ success: true });
});

app.post("/api/admin/change-password", authMiddleware, requireRole("admin"), async (req, res) => {
  const admin = await Admin.findById(req.auth.sub);
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const currentPassword = String(req.body?.currentPassword || "");
  const newPassword = String(req.body?.newPassword || "");

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new password are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!valid) return res.status(400).json({ message: "Current password is incorrect" });

  admin.passwordHash = await bcrypt.hash(newPassword, 10);
  await admin.save();

  return res.json({ success: true });
});

app.get("/api/settings", authMiddleware, requireRole("admin"), async (_req, res) => {
  const db = await getAppData();
  const admin = await Admin.findOne({ role: "admin" }).sort({ createdAt: 1 });
  return res.json({
    ...db.settings,
    adminEmail: admin?.email || ADMIN_EMAIL,
  });
});

app.post("/api/settings", authMiddleware, requireRole("admin"), async (req, res) => {
  const db = await getAppData();
  const body = req.body || {};

  db.settings = {
    ...db.settings,
    businessName: body.businessName ?? db.settings.businessName,
    supportEmail: body.supportEmail ?? db.settings.supportEmail,
    timezone: body.timezone ?? db.settings.timezone,
    notifications: {
      ...db.settings.notifications,
      ...(body.notifications || {}),
    },
    branding: {
      ...db.settings.branding,
      ...(body.branding || {}),
    },
  };
  await db.save();

  if (body.adminEmail && toLower(body.adminEmail) !== toLower(req.auth.email)) {
    const exists = await Admin.findOne({ email: toLower(body.adminEmail) });
    if (!exists) {
      await Admin.findByIdAndUpdate(req.auth.sub, { email: toLower(body.adminEmail) });
    } else if (String(exists._id) !== String(req.auth.sub)) {
      return res.status(409).json({ message: "Admin email already in use" });
    }
  }

  const admin = await Admin.findById(req.auth.sub);
  return res.json({ ...db.settings, adminEmail: admin?.email || req.auth.email });
});

app.get("/api/dashboard/overview", authMiddleware, requireRole("admin"), async (_req, res) => {
  const db = await getAppData();
  return res.json(buildOverview(db));
});

app.get("/api/subscribers", authMiddleware, requireRole("admin"), async (_req, res) => {
  const db = await getAppData();
  const subscribers = (db.subscribers || []).sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt));
  return res.json(subscribers);
});

app.post("/api/subscribers/send", authMiddleware, requireRole("admin"), async (req, res) => {
  const db = await getAppData();
  const subject = String(req.body?.subject || "").trim();
  const content = String(req.body?.content || "").trim();

  if (!subject || !content) {
    return res.status(400).json({ message: "Subject and content are required" });
  }

  const activeSubscribers = (db.subscribers || []).filter((s) => toLower(s.status || "active") === "active");
  if (activeSubscribers.length === 0) {
    return res.status(400).json({ message: "No active subscribers found" });
  }

  const html = `<p>${content.replace(/\n/g, "<br />")}</p>`;
  const sendResults = await Promise.allSettled(
    activeSubscribers.map((subscriber) =>
      sendEmail({
        to: subscriber.email,
        subject,
        text: content,
        html,
      })
    )
  );

  const failed = sendResults
    .map((result, index) => ({ result, email: activeSubscribers[index].email }))
    .filter((x) => x.result.status === "rejected")
    .map((x) => ({ email: x.email, reason: x.result.reason?.message || "Send failed" }));

  const campaign = {
    id: `campaign-${Date.now()}`,
    subject,
    content,
    sentAt: new Date().toISOString(),
    attempted: activeSubscribers.length,
    sent: activeSubscribers.length - failed.length,
    failed,
  };

  db.newsletters = [...(db.newsletters || []), campaign];
  await db.save();

  return res.json({
    success: true,
    campaign,
  });
});

app.get("/api/messages", authMiddleware, requireRole("admin"), async (_req, res) => {
  const db = await getAppData();
  const messages = [...(db.allMessages || [])].sort(
    (a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)
  );
  return res.json(messages);
});

app.patch("/api/messages/:id/read", authMiddleware, requireRole("admin"), async (req, res) => {
  const db = await getAppData();
  const messageId = String(req.params.id || "");
  db.allMessages = (db.allMessages || []).map((msg) =>
    String(msg.id) === messageId
      ? {
          ...msg,
          status: "Read",
        }
      : msg
  );
  await db.save();
  return res.json({ success: true });
});

app.delete("/api/messages/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  const db = await getAppData();
  const messageId = String(req.params.id || "");
  db.allMessages = (db.allMessages || []).filter((msg) => String(msg.id) !== messageId);
  await db.save();
  return res.json({ success: true });
});

app.get("/api/clients", authMiddleware, requireRole("admin"), async (_req, res) => {
  const db = await getAppData();
  return res.json(buildClients(db));
});

app.get("/api/programs", authMiddleware, requireRole("admin"), async (_req, res) => {
  const db = await getAppData();
  return res.json(db.programs || []);
});

app.post("/api/programs", authMiddleware, requireRole("admin"), async (req, res) => {
  const db = await getAppData();
  const newProgram = {
    id: Date.now(),
    name: String(req.body?.name || "").trim(),
    type: String(req.body?.type || "").trim(),
    price: Number(req.body?.price || 0),
  };

  if (!newProgram.name || !newProgram.type || Number.isNaN(newProgram.price) || newProgram.price < 0) {
    return res.status(400).json({ message: "Invalid program payload" });
  }

  db.programs = [...(db.programs || []), newProgram];
  await db.save();
  return res.status(201).json(newProgram);
});

app.delete("/api/programs/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  const db = await getAppData();
  const id = Number(req.params.id);
  db.programs = (db.programs || []).filter((p) => Number(p.id) !== id);
  await db.save();
  return res.json({ success: true });
});

app.get("/api/bookings", authMiddleware, requireRole("admin"), async (_req, res) => {
  const db = await getAppData();
  const combined = [
    ...(db.bookings || []).map((b) => ({ ...b, source: "Visitor" })),
    ...(db.client_bookings || []).map((b) => ({ ...b, source: "Client" })),
  ].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

  return res.json(combined);
});

app.get("/api/bookings/slots", async (_req, res) => {
  const db = await getAppData();
  const all = [...(db.bookings || []), ...(db.client_bookings || []), ...(db.sessions || [])];
  const slots = all
    .filter((record) => {
      const status = toLower(record?.status || "");
      return !status || status === "upcoming" || status === "pending" || status === "rescheduled";
    })
    .map((record) => ({
      date: String(record?.date || "").split("T")[0],
      timeSlot: String(record?.timeSlot || record?.time || "").trim(),
    }))
    .filter((record) => record.date && record.timeSlot);

  return res.json(slots);
});

app.post("/api/bookings/public", createRateLimiter(STRICT_RATE_LIMIT_MAX_REQUESTS), async (req, res) => {
  const db = await getAppData();
  const incoming = req.body || {};
  const email = toLower(incoming.email);
  if (!isValidEmail(email)) return res.status(400).json({ message: "Valid booking email is required" });

  const meetingId = buildMeetingIdFromRecord({ ...incoming, email });
  const meetingToken = issueMeetingToken({ meetingId, email, role: "client" });
  const decoded = jwt.decode(meetingToken);

  const booking = {
    ...incoming,
    email,
    meetingId,
    meetingToken,
    meetingTokenExpiresAt: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null,
    status: incoming.status || "upcoming",
  };

  db.bookings = [...(db.bookings || []), booking];
  upsertLead(db, {
    email,
    name: booking.fullName || booking.name || email,
    source: "public_booking",
    note: `Booked ${booking.service || "Consultation"}`,
  });
  await db.save();

  let emailResult = { sent: false };
  try {
    const meetingLink = `${APP_BASE_URL}/client/meeting/${meetingId}?t=${encodeURIComponent(meetingToken)}`;
    const mail = buildBookingEmail({
      name: booking.fullName || booking.name,
      service: booking.service,
      duration: booking.duration,
      date: booking.date,
      timeSlot: booking.timeSlot,
      meetingLink,
      supportEmail: db.settings?.supportEmail,
    });
    const ics = buildIcsAttachment({ booking, meetingLink });
    emailResult = await sendEmail({
      to: email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      attachments: ics ? [ics] : [],
    });
  } catch (error) {
    emailResult = { sent: false, reason: error.message };
  }

  return res.status(201).json({ success: true, booking, emailSent: emailResult.sent, emailInfo: emailResult.reason || null });
});

app.post("/api/bookings/client", authMiddleware, requireRole("client"), createRateLimiter(STRICT_RATE_LIMIT_MAX_REQUESTS), async (req, res) => {
  const db = await getAppData();
  const incoming = req.body || {};
  const email = toLower(req.auth?.email || incoming.email || incoming.clientEmail);
  if (!isValidEmail(email)) return res.status(400).json({ message: "Valid client email is required" });

  const meetingId = buildMeetingIdFromRecord({ ...incoming, email });
  const meetingToken = issueMeetingToken({ meetingId, email, role: "client" });
  const decoded = jwt.decode(meetingToken);

  const booking = {
    ...incoming,
    email,
    clientEmail: email,
    meetingId,
    meetingToken,
    meetingTokenExpiresAt: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null,
  };

  db.client_bookings = [...(db.client_bookings || []), booking];
  upsertLead(db, {
    email,
    name: booking.fullName || booking.name || email,
    source: "client_booking",
    note: `Booked ${booking.service || "Session"}`,
  });
  await db.save();

  let emailResult = { sent: false };
  try {
    const meetingLink = `${APP_BASE_URL}/client/meeting/${meetingId}?t=${encodeURIComponent(meetingToken)}`;
    const mail = buildBookingEmail({
      name: booking.fullName || booking.name,
      service: booking.service,
      duration: booking.duration,
      date: booking.date,
      timeSlot: booking.timeSlot,
      meetingLink,
      supportEmail: db.settings?.supportEmail,
    });
    const ics = buildIcsAttachment({ booking, meetingLink });
    emailResult = await sendEmail({
      to: email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      attachments: ics ? [ics] : [],
    });
  } catch (error) {
    emailResult = { sent: false, reason: error.message };
  }

  return res.status(201).json({ success: true, booking, emailSent: emailResult.sent, emailInfo: emailResult.reason || null });
});

app.post("/api/meetings/verify", async (req, res) => {
  const meetingToken = String(req.body?.meetingToken || "");
  const meetingId = normalizeMeetingId(req.body?.meetingId);
  const email = toLower(req.body?.email);

  if (!meetingToken || !meetingId || !email) {
    return res.status(400).json({ message: "meetingToken, meetingId, and email are required" });
  }

  let payload;
  try {
    payload = jwt.verify(meetingToken, JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid or expired meeting token" });
  }

  if (payload?.kind !== "meeting-access" || payload?.role !== "client") {
    return res.status(401).json({ message: "Invalid meeting token payload" });
  }

  if (normalizeMeetingId(payload.meetingId) !== meetingId || toLower(payload.email) !== email) {
    return res.status(401).json({ message: "Meeting token does not match this request" });
  }

  const db = await getAppData();
  const allRecords = [...(db.client_bookings || []), ...(db.sessions || [])];
  const exists = allRecords.some((record) => {
    return toLower(record.email || record.clientEmail) === email && buildMeetingIdFromRecord(record) === meetingId;
  });

  if (!exists) {
    return res.status(404).json({ message: "No matching meeting found for this client" });
  }

  return res.json({
    valid: true,
    meetingId,
    email,
    expiresAt: payload?.exp ? new Date(payload.exp * 1000).toISOString() : null,
  });
});

app.post("/api/meetings/client-token", authMiddleware, requireRole("client"), async (req, res) => {
  const meetingId = normalizeMeetingId(req.body?.meetingId);
  const email = toLower(req.auth?.email);

  if (!meetingId || !email) {
    return res.status(400).json({ message: "meetingId and email are required" });
  }

  const db = await getAppData();
  const isMatch = (record) =>
    toLower(record?.email || record?.clientEmail) === email && buildMeetingIdFromRecord(record) === meetingId;

  const allRecords = [...(db.client_bookings || []), ...(db.sessions || []), ...(db.bookings || [])];
  const matchedRecord = allRecords.find(isMatch);
  if (!matchedRecord) {
    return res.status(404).json({ message: "No matching meeting found for this client" });
  }

  let meetingToken = String(matchedRecord?.meetingToken || "");
  let expiresAt = null;

  if (meetingToken) {
    try {
      const payload = jwt.verify(meetingToken, JWT_SECRET);
      const tokenMatches =
        payload?.kind === "meeting-access" &&
        payload?.role === "client" &&
        normalizeMeetingId(payload?.meetingId) === meetingId &&
        toLower(payload?.email) === email;
      if (tokenMatches) {
        expiresAt = payload?.exp ? new Date(payload.exp * 1000).toISOString() : null;
      } else {
        meetingToken = "";
      }
    } catch {
      meetingToken = "";
    }
  }

  if (!meetingToken) {
    meetingToken = issueMeetingToken({ meetingId, email, role: "client" });
    const decoded = jwt.decode(meetingToken);
    expiresAt = decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null;

    const updateList = (list) =>
      (list || []).map((record) =>
        isMatch(record)
          ? {
              ...record,
              meetingToken,
              meetingTokenExpiresAt: expiresAt,
            }
          : record
      );

    db.client_bookings = updateList(db.client_bookings);
    db.sessions = updateList(db.sessions);
    db.bookings = updateList(db.bookings);
    await db.save();
  }

  return res.json({
    meetingId,
    email,
    meetingToken,
    expiresAt,
  });
});

app.get("/api/meetings/admin-token/:meetingId", authMiddleware, requireRole("admin"), async (req, res) => {

  const meetingId = normalizeMeetingId(req.params?.meetingId);
  if (!meetingId) {
    return res.status(400).json({ message: "Valid meetingId is required" });
  }

  const meetingToken = issueMeetingToken({
    meetingId,
    email: req.auth.email,
    role: "admin",
    expiresIn: "12h",
  });

  return res.json({ meetingId, meetingToken });
});

const sendReminderEmail = async ({ booking, reminderType, supportEmail }) => {
  const email = toLower(booking?.email || booking?.clientEmail);
  if (!isValidEmail(email)) return { sent: false, reason: "invalid-email" };
  const meetingId = buildMeetingIdFromRecord(booking);
  const meetingToken = booking?.meetingToken || issueMeetingToken({ meetingId, email, role: "client" });
  const meetingLink = `${APP_BASE_URL}/client/meeting/${meetingId}?t=${encodeURIComponent(meetingToken)}`;
  const subject = reminderType === "24h"
    ? "Reminder: Your session is tomorrow"
    : "Reminder: Your session starts in about 1 hour";
  const text = `Hi ${booking?.fullName || "there"},\n\nThis is a reminder for your upcoming session.\nDate: ${booking?.date}\nTime: ${booking?.timeSlot || booking?.time}\nJoin link: ${meetingLink}\n\nNeed help? ${supportEmail || "support@growtharchitect.com"}`;
  const html = `<p>Hi ${booking?.fullName || "there"},</p><p>This is a reminder for your upcoming session.</p><p><strong>Date:</strong> ${booking?.date}<br /><strong>Time:</strong> ${booking?.timeSlot || booking?.time}</p><p><a href="${meetingLink}">Join session</a></p><p>Need help? ${supportEmail || "support@growtharchitect.com"}</p>`;
  const ics = buildIcsAttachment({ booking, meetingLink });
  return sendEmail({ to: email, subject, text, html, attachments: ics ? [ics] : [] });
};

const sendAdminReminderEmail = async ({ booking, reminderType, supportEmail }) => {
  const db = await getAppData();
  const admin = await Admin.findOne({ role: "admin" }).sort({ createdAt: 1 });
  const adminEmail = toLower(admin?.email || ADMIN_EMAIL);
  if (!isValidEmail(adminEmail)) return { sent: false, reason: "invalid-admin-email" };

  const meetingId = buildMeetingIdFromRecord(booking);
  const clientEmail = toLower(booking?.email || booking?.clientEmail);
  const clientName = String(booking?.fullName || booking?.name || "Client");
  const meetingToken = booking?.meetingToken || issueMeetingToken({ meetingId, email: clientEmail, role: "client" });
  const meetingLink = `${APP_BASE_URL}/client/meeting/${meetingId}?t=${encodeURIComponent(meetingToken)}`;

  const subject = reminderType === "24h"
    ? "Admin Reminder: Client session tomorrow"
    : "Admin Reminder: Client session in about 1 hour";
  const text = `Session reminder (${reminderType}).\n\nClient: ${clientName}\nClient Email: ${clientEmail}\nService: ${booking?.service || "Consultation"}\nDate: ${booking?.date}\nTime: ${booking?.timeSlot || booking?.time}\nConsultant: ${booking?.consultant || "Assigned coach"}\nJoin link: ${meetingLink}\n\nSupport: ${supportEmail || db.settings?.supportEmail || "support@growtharchitect.com"}`;
  const html = `<p>Session reminder (${reminderType}).</p><p><strong>Client:</strong> ${clientName}<br /><strong>Client Email:</strong> ${clientEmail}<br /><strong>Service:</strong> ${booking?.service || "Consultation"}<br /><strong>Date:</strong> ${booking?.date}<br /><strong>Time:</strong> ${booking?.timeSlot || booking?.time}<br /><strong>Consultant:</strong> ${booking?.consultant || "Assigned coach"}</p><p><a href="${meetingLink}">Client Join Link</a></p><p>Support: ${supportEmail || db.settings?.supportEmail || "support@growtharchitect.com"}</p>`;
  return sendEmail({ to: adminEmail, subject, text, html });
};

async function runReminderCycle() {
  const db = await getAppData();
  const bookings = [...(db.bookings || []), ...(db.client_bookings || [])];
  const now = new Date();
  const reminderLog = db.reminderLog || [];
  const summary = {
    inspected: 0,
    sent24h: 0,
    sent1h: 0,
    adminSent24h: 0,
    adminSent1h: 0,
    skipped: 0,
    failed: 0,
    adminFailed: 0,
    at: new Date().toISOString(),
  };

  for (const booking of bookings) {
    summary.inspected += 1;
    const status = toLower(booking?.status || "upcoming");
    if (status === "completed" || status === "cancelled") {
      summary.skipped += 1;
      continue;
    }

    const start = parseSlotToDate(booking?.date, booking?.timeSlot || booking?.time);
    if (!start) {
      summary.skipped += 1;
      continue;
    }

    const diffMinutes = Math.round((start.getTime() - now.getTime()) / 60000);
    if (diffMinutes <= 0) {
      summary.skipped += 1;
      continue;
    }

    const bookingKey = String(booking?.meetingId || booking?.id || `${booking?.email}-${booking?.date}-${booking?.timeSlot || booking?.time}`);
    const alreadySent24h = reminderLog.some((r) => r.key === bookingKey && r.type === "24h");
    const alreadySent1h = reminderLog.some((r) => r.key === bookingKey && r.type === "1h");
    const alreadySent24hAdmin = reminderLog.some((r) => r.key === bookingKey && r.type === "24h-admin");
    const alreadySent1hAdmin = reminderLog.some((r) => r.key === bookingKey && r.type === "1h-admin");

    // 24h reminder: send once any time between 24h and 1h before start.
    if (!alreadySent24h && diffMinutes <= 24 * 60 && diffMinutes > 60) {
      const result = await sendReminderEmail({ booking, reminderType: "24h", supportEmail: db.settings?.supportEmail });
      if (result?.sent) {
        summary.sent24h += 1;
        reminderLog.push({ key: bookingKey, type: "24h", at: new Date().toISOString() });
      } else {
        summary.failed += 1;
      }
    }
    if (!alreadySent24hAdmin && diffMinutes <= 24 * 60 && diffMinutes > 60) {
      const result = await sendAdminReminderEmail({ booking, reminderType: "24h", supportEmail: db.settings?.supportEmail });
      if (result?.sent) {
        summary.adminSent24h += 1;
        reminderLog.push({ key: bookingKey, type: "24h-admin", at: new Date().toISOString() });
      } else {
        summary.adminFailed += 1;
      }
    }

    // 1h reminder: send once in the hour before start.
    if (!alreadySent1h && diffMinutes <= 60) {
      const result = await sendReminderEmail({ booking, reminderType: "1h", supportEmail: db.settings?.supportEmail });
      if (result?.sent) {
        summary.sent1h += 1;
        reminderLog.push({ key: bookingKey, type: "1h", at: new Date().toISOString() });
      } else {
        summary.failed += 1;
      }
    }
    if (!alreadySent1hAdmin && diffMinutes <= 60) {
      const result = await sendAdminReminderEmail({ booking, reminderType: "1h", supportEmail: db.settings?.supportEmail });
      if (result?.sent) {
        summary.adminSent1h += 1;
        reminderLog.push({ key: bookingKey, type: "1h-admin", at: new Date().toISOString() });
      } else {
        summary.adminFailed += 1;
      }
    }
  }

  db.reminderLog = reminderLog.slice(-2000);
  await db.save();
  return summary;
}

app.post("/api/reminders/run", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const summary = await runReminderCycle();
    return res.json({ success: true, summary });
  } catch (error) {
    return res.status(500).json({ message: "Reminder run failed", detail: error.message });
  }
});

if (fs.existsSync(FRONTEND_DIST_DIR)) {
  app.use(express.static(FRONTEND_DIST_DIR));

  app.get(/^\/(?!api).*/, (req, res, next) => {
    if (req.method !== "GET") return next();
    return res.sendFile(path.join(FRONTEND_DIST_DIR, "index.html"));
  });
}

const bootstrap = async () => {
  await mongoose.connect(MONGODB_URI);

  let existingAdmin = await Admin.findOne({ role: "admin" }).sort({ createdAt: 1 });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    existingAdmin = await Admin.create({
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    });
  } else if (!existingAdmin.passwordHash || typeof existingAdmin.passwordHash !== "string" || !existingAdmin.passwordHash.startsWith("$2")) {
    existingAdmin.passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await existingAdmin.save();
  }

  await getAppData();

  if (REMINDER_CRON_ENABLED) {
    setInterval(() => {
      runReminderCycle().catch((error) => {
        console.error("Reminder cycle failed:", error.message);
      });
    }, REMINDER_INTERVAL_MS);
    runReminderCycle().catch((error) => {
      console.error("Initial reminder cycle failed:", error.message);
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
};

bootstrap().catch((err) => {
  console.error("Failed to start API server:", err);
  process.exit(1);
});
