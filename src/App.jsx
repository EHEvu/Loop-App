import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import {
  Home,
  Clapperboard,
  Search,
  PlusSquare,
  CircleUserRound,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Play,
  SendHorizontal,
  Repeat2,
  Image as ImageIcon,
  Video,
  Grid3x3,
  UserSquare2,
  Settings,
  Mail,
  Link2,
  ExternalLink,
  QrCode,
  Phone,
  Cake,
  Lock,
  Ellipsis,
  Bell,
  SlidersHorizontal,
  Hash,
  Plus,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Download,
  Music2,
  Sparkles,
  Gauge,
  RefreshCw,
  X,
  UserPlus,
  UserCheck,
  ImagePlus,
  ThumbsDown,
  Trash2,
  MapPin,
  Pin,
  RotateCcw,
  RotateCw,
  Archive,
  Crop,
  Users,
  Check,
  Copy,
  Flag,
  Pencil,
  ChevronLeft,
  Star,
  Share2,
  Smile,
  CornerUpLeft,
  Forward,
  Mic,
  UserMinus,
  LogOut,
  ChevronRight,
  KeyRound,
  Globe,
  Info,
  HandHeart,
  UserX,
  Palette,
  LifeBuoy,
  Trash,
  Shield,
  Layers,
  Clock,
} from "lucide-react";
import QRCode from "qrcode";

// ---- Design tokens ----
// bg: var(--bg) (deep aubergine-black)  card: var(--surface)
// accent: var(--accent-start) (coral) -> var(--accent-end) (amber) gradient
// text: var(--text) (warm off-white)  muted: var(--text-muted)

const ACCENT = "linear-gradient(135deg, var(--accent-start) 0%, var(--accent-end) 100%)";

// Instagram-exact color system. Three themes selectable in Settings:
// dark (default), light, and "bangladesh" (flag green + red). Every component
// reads these CSS custom properties, set via a data-theme attribute on the root.
// --ring-* is the story-ring gradient, kept intentionally distinct from the
// action accent: gold in dark, blue in light (per the user's brand direction).
const THEME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Cinzel+Decorative:wght@400;700;900&display=swap');
  /* Chat fonts. Phones only download a font when a chat actually uses it. */
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Playfair+Display:wght@400;600&family=Space+Mono&family=Nunito:wght@400;700&family=Lora:wght@400;600&family=Montserrat:wght@400;600&family=Oswald:wght@400;600&family=Pacifico&family=Caveat:wght@400;700&display=swap');
  :root {
    /* ---- DARK: pure black, gold accent (premium) ---- */
    --bg: #000000;
    --bg-sunken: #000000;
    --page-bg: #000000;
    --surface: #121212;
    --surface-raised: #1A1A1A;
    --active-highlight: #363636;
    --border: #262626;
    --border-subtle: #1C1C1C;
    --text: #FFFFFF;
    --text-secondary: #A8A8A8;
    --text-muted: #8E8E8E;
    --text-disabled: #4A4A4A;
    --toggle-off: #363636;
    --accent-start: #FDDB92;
    --accent-end: #EFBF04;
    --accent-solid: #EFBF04;
    --on-accent: #1A1408;
    --heart: #ED4956;
    --wordmark: #FFFFFF;
    /* story ring — gold in dark */
    --ring-start: #FDDB92;
    --ring-end: #EFBF04;
    --tag-bg: #2A2410;
    --tag-border: #4A3E18;
    --tag-text: #E8C766;
  }
  [data-theme="light"] {
    /* ---- LIGHT (Instagram): white, blue accent ---- */
    --bg: #FFFFFF;
    --bg-sunken: #FAFAFA;
    --page-bg: #FAFAFA;
    --surface: #FFFFFF;
    --surface-raised: #FFFFFF;
    --active-highlight: #F0F0F0;
    --border: #DBDBDB;
    --border-subtle: #EFEFEF;
    --text: #262626;
    --text-secondary: #737373;
    --text-muted: #8E8E8E;
    --text-disabled: #C7C7C7;
    --toggle-off: #DBDBDB;
    --accent-start: #0095F6;
    --accent-end: #0095F6;
    --accent-solid: #0095F6;
    --on-accent: #FFFFFF;
    --heart: #ED4956;
    --wordmark: #262626;
    /* story ring — blue in light */
    --ring-start: #38BDF8;
    --ring-end: #0095F6;
    --tag-bg: #E8F4FD;
    --tag-border: #B8DCF5;
    --tag-text: #0077C2;
  }
  [data-theme="bangladesh"] {
    /* ---- BANGLADESH: deep-green background, flag-red accents ---- */
    --bg: #006747;
    --bg-sunken: #00543A;
    --page-bg: #00543A;
    --surface: #0A7551;
    --surface-raised: #0E815B;
    --active-highlight: #12946B;
    --border: #1C8A66;
    --border-subtle: #0F7D57;
    --text: #FFFFFF;
    --text-secondary: #C4E4D6;
    --text-muted: #8FBFA9;
    --text-disabled: #5A9B80;
    --toggle-off: #1C8A66;
    /* accent = flag red (buttons/links/highlights/active icons) */
    --accent-start: #F42A41;
    --accent-end: #DA291C;
    --accent-solid: #F42A41;
    --on-accent: #FFFFFF;
    --heart: #F42A41;
    --wordmark: #FFFFFF;
    /* story ring — flag red */
    --ring-start: #F42A41;
    --ring-end: #DA291C;
    --tag-bg: #7A1520;
    --tag-border: #A0202E;
    --tag-text: #FFD0D4;
  }
  /* On a phone the app fills the screen — no rounded frame or border
     around it. On a computer it stays phone-sized in the middle. */
  .loop-frame { max-height: 100dvh; }
  @media (max-width: 520px) {
    .loop-page {
      min-height: 100dvh !important;
      height: 100dvh;
      align-items: stretch !important;
      justify-content: stretch !important;
      background: var(--bg) !important;
      overflow: hidden;
    }
    .loop-frame {
      max-width: none !important;
      width: 100% !important;
      height: 100dvh !important;
      max-height: none !important;
      border: 0 !important;
      border-radius: 0 !important;
    }
  }
  @keyframes loopHeartBurst {
    0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
    15% { transform: translate(-50%, -50%) scale(1.25); opacity: 1; }
    30% { transform: translate(-50%, -50%) scale(0.95); opacity: 1; }
    45% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
    80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    100% { transform: translate(-50%, -60%) scale(0.9); opacity: 0; }
  }
  .loop-heart-burst {
    position: absolute; left: 50%; top: 50%;
    pointer-events: none;
    animation: loopHeartBurst 0.9s ease-out forwards;
    filter: drop-shadow(0 4px 14px rgba(0,0,0,0.45));
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("Loop screen crashed:", error, info);
  }
  componentDidUpdate(prevProps) {
    // Moving to another screen clears a stale error.
    if (this.state.error && prevProps.children !== this.props.children) this.setState({ error: null });
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
          <p className="text-sm mb-2" style={{ color: "var(--accent-start)", fontWeight: 700 }}>Something went wrong</p>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)", wordBreak: "break-word" }}>
            {String(this.state.error?.message || this.state.error)}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => this.setState({ error: null })}
              className="text-xs px-4 py-2 rounded-full"
              style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700 }}
            >
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-xs px-4 py-2 rounded-full"
              style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 700, border: "1px solid var(--border)" }}
            >
              Reload Loop
            </button>
          </div>
          <p className="text-[11px] mt-4 px-4" style={{ color: "var(--text-muted)" }}>
            If your browser offered to translate this page, turn that off — translating breaks the app.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---- Local device preferences (per-browser, not synced to Supabase) ----
function getCountPrefs() {
  try {
    const raw = localStorage.getItem("loop_count_prefs");
    return raw ? JSON.parse(raw) : { likes: true, comments: true, reposts: true, saves: true };
  } catch {
    return { likes: true, comments: true, reposts: true, saves: true };
  }
}
function saveCountPrefs(prefs) {
  try {
    localStorage.setItem("loop_count_prefs", JSON.stringify(prefs));
    window.dispatchEvent(new Event("loop-count-prefs-changed"));
  } catch {}
}
function useCountPrefs() {
  const [prefs, setPrefs] = useState(getCountPrefs());
  useEffect(() => {
    const handler = () => setPrefs(getCountPrefs());
    window.addEventListener("loop-count-prefs-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("loop-count-prefs-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  const toggle = (key) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    saveCountPrefs(next);
  };
  return [prefs, toggle];
}
function getAutoScrollPref() {
  try {
    return localStorage.getItem("loop_autoscroll") === "1";
  } catch {
    return false;
  }
}
function setAutoScrollPref(val) {
  try {
    localStorage.setItem("loop_autoscroll", val ? "1" : "0");
  } catch {}
}

function formatCount(n) {
  const num = n || 0;
  if (num >= 1000000) return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K";
  return String(num);
}

// The Loop brand logo. Expects /logo.png in the app's public folder.
// If the image is missing it falls back to a clean wordmark so nothing breaks.
// ---- Shrink photos before upload ----
// Phone cameras take 4000-pixel, 5 MB photos, but a phone screen shows about
// 1080 pixels. Resizing first (like Instagram does) makes uploads faster and
// saves everyone's data. GIFs (animation) and already-small files are left
// alone; if anything goes wrong the original file is used.
const MAX_UPLOAD_VIDEO_BYTES = 50 * 1024 * 1024;

async function compressImage(file, maxSide = 1440, quality = 0.82) {
  try {
    if (!file || !(file.type || "").startsWith("image/") || file.type === "image/gif") return file;
    const url = URL.createObjectURL(file);
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    URL.revokeObjectURL(url);
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    if (scale === 1 && file.size < 400 * 1024) return file;
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff"; // transparent PNGs get a white background, not black
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;
    const base = (file.name || "photo").replace(/\.[^.]+$/, "");
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } catch (e) {
    return file;
  }
}

// A post is a photo only if it really is an image file — some videos were
// saved as "photo" when they were posted through Post instead of Reel.
const VIDEO_URL_RE = /\.(mp4|mov|webm|m4v|3gp|mkv|avi)(\?|#|$)/i;
function isPhotoPost(p) {
  return !!p && p.media_type === "photo" && !VIDEO_URL_RE.test(p.media_url || "");
}

// A video URL that makes the browser paint its first frame as a thumbnail.
const videoThumb = (url) => (url ? `${url}${url.includes("#") ? "" : "#t=0.1"}` : url);

// ---- Video covers ----
// A grid that shows a black square for every video is useless, so Loop
// takes a real picture out of the video and keeps it. grabVideoFrame
// winds a hidden player to one moment and paints that frame onto a
// canvas; the result is an ordinary JPEG we can store and show as an
// <img>, which is far lighter for everyone than loading the video.
function grabVideoFrame(src, atSeconds = 0.1) {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video");
    let done = false;
    const finish = (fn, arg) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      v.removeAttribute("src");
      try {
        v.load();
      } catch {}
      fn(arg);
    };
    const timer = setTimeout(() => finish(reject, new Error("That took too long")), 15000);
    v.crossOrigin = "anonymous";
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.onerror = () => finish(reject, new Error("Loop couldn't read that video"));
    v.onloadeddata = () => {
      const want = Math.min(Math.max(atSeconds, 0), Math.max((v.duration || 1) - 0.05, 0));
      if (Math.abs(v.currentTime - want) < 0.01) v.onseeked();
      else
        try {
          v.currentTime = want;
        } catch {
          finish(reject, new Error("Loop couldn't read that video"));
        }
    };
    v.onseeked = () => {
      try {
        const c = document.createElement("canvas");
        const w = v.videoWidth || 720;
        const h = v.videoHeight || 1280;
        const scale = Math.min(1, 1080 / Math.max(w, h));
        c.width = Math.round(w * scale);
        c.height = Math.round(h * scale);
        c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
        c.toBlob(
          (b) => (b ? finish(resolve, b) : finish(reject, new Error("Loop couldn't make a picture"))),
          "image/jpeg",
          0.82
        );
      } catch {
        // Some browsers refuse to read a frame from another site's video.
        finish(reject, new Error("This browser won't let Loop read that frame"));
      }
    };
    v.src = src;
  });
}

// Put a cover picture in storage and hand back its address.
async function uploadCoverBlob(blob, userId) {
  const path = `${userId}/${Date.now()}-cover.jpg`;
  const { error } = await supabase.storage.from("posts").upload(path, blob, { contentType: "image/jpeg" });
  if (error) throw error;
  return supabase.storage.from("posts").getPublicUrl(path).data.publicUrl;
}

// One square in any grid. A saved cover is just a picture, which always
// shows; without one we fall back to the video wound to its first moment.
function MediaThumb({ src, cover, isVideo, className = "w-full h-full object-cover", alt = "" }) {
  if (!isVideo) return <img src={cover || src} alt={alt} loading="lazy" className={className} />;
  if (cover) return <img src={cover} alt={alt} loading="lazy" className={className} />;
  return <video src={videoThumb(src)} className={className} muted playsInline preload="metadata" />;
}

// Covers Loop has already made in this browser session, so a grid never
// redoes the same work twice.
const coverMemo = new Map();

// Videos posted before Loop started saving covers show as black squares.
// The first time their owner opens their own profile, Loop quietly makes
// the missing pictures and stores them, so from then on everyone sees
// them — on the profile, in Explore, under a hashtag, in Saved, anywhere.
// Only the owner ever does this work, and only a few at a time.
async function healMissingCovers(posts, userId, onFixed) {
  const todo = (posts || [])
    .filter((p) => p && p.user_id === userId && !p.cover_url && p.media_url && !isPhotoPost(p))
    .filter((p) => !coverMemo.has(p.id))
    .slice(0, 6);
  for (const post of todo) {
    coverMemo.set(post.id, "working");
    try {
      const blob = await grabVideoFrame(post.media_url, 0.1);
      const url = await uploadCoverBlob(blob, userId);
      const { error } = await supabase.from("posts").update({ cover_url: url }).eq("id", post.id).eq("user_id", userId);
      if (error) continue;
      coverMemo.set(post.id, url);
      onFixed?.(post.id, url);
    } catch {
      // Leave it as it was; the video still plays, it just stays plain.
    }
  }
}

function LoopLogo({ size = 72 }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 800,
          fontSize: size * 0.55,
          background: ACCENT,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Loop
      </span>
    );
  }
  return (
    <img
      src="/logo.png"
      alt="Loop"
      onError={() => setFailed(true)}
      style={{ height: size, width: "auto", objectFit: "contain" }}
    />
  );
}

// Shared avatar: shows the uploaded photo if present, else the first letter
// of the username on the accent ring. size is the outer diameter in px.
function Avatar({ username, avatarUrl, size = 40 }) {
  const letter = (username || "u")[0].toUpperCase();
  return (
    <div className="rounded-full shrink-0 overflow-hidden flex items-center justify-center" style={{ width: size, height: size, background: "var(--border)" }}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span style={{ color: "var(--text)", fontSize: size * 0.42, fontWeight: 600 }}>{letter}</span>
      )}
    </div>
  );
}

// Caption the way Instagram shows it: one line, cut with "… more" at the very
// end of that line; tapping it opens the whole caption with "less" at the end.
// "more" only appears when there really is more (measured, or a line break).
// `light` renders it for dark video overlays (Reels).
function CaptionText({ username, caption, onOpenProfile, onMention, onTap, light = false }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = React.useRef(null);
  const firstLine = (caption || "").split("\n")[0];
  const hasMoreLines = (caption || "").includes("\n");

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    const measure = () => setOverflows(el.scrollWidth - el.clientWidth > 1);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [caption, expanded]);

  if (!caption) return null;

  const nameColor = light ? "#FFFFFF" : "var(--text)";
  const bodyColor = light ? "rgba(255,255,255,0.92)" : "var(--text)";
  const toggleColor = light ? "rgba(255,255,255,0.72)" : "var(--text-muted)";
  const toggle = (e) => {
    e.stopPropagation();
    // Reels: a tap opens the caption and comments together, like Instagram.
    if (onTap) {
      onTap();
      return;
    }
    setExpanded((v) => !v);
  };
  const name = username ? (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onOpenProfile?.();
      }}
      style={{ color: nameColor, fontWeight: 600, marginRight: 5 }}
    >
      {username}
    </span>
  ) : null;

  if (expanded) {
    return (
      <p className="text-sm" onClick={toggle} style={{ color: bodyColor, whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.4 }}>
        {name}
        <MentionText text={caption} onMention={onMention} />{" "}
        <button onClick={toggle} style={{ color: toggleColor, fontWeight: 500 }}>
          less
        </button>
      </p>
    );
  }

  const showMore = overflows || hasMoreLines;
  return (
    <div className="flex items-baseline text-sm" style={{ lineHeight: 1.4 }} onClick={showMore || onTap ? toggle : undefined}>
      <span ref={ref} className="min-w-0" style={{ color: bodyColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {name}
        {firstLine}
        {hasMoreLines && !overflows ? "…" : ""}
      </span>
      {showMore && (
        <button onClick={toggle} className="shrink-0 ml-1" style={{ color: toggleColor, fontWeight: 500 }}>
          more
        </button>
      )}
    </div>
  );
}

// One repost icon and one share icon, used on every screen so the action
// rows and the profile's repost tab all match.
function RepostIcon({ size = 24, color = "currentColor", strokeWidth = 1.9, active = false, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={active ? strokeWidth + 0.5 : strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M4 10.2V8.4a3 3 0 0 1 3-3h10.4" />
      <path d="M14.8 2.9 17.9 5.4 14.8 7.9" />
      <path d="M20 13.8v1.8a3 3 0 0 1-3 3H6.6" />
      <path d="M9.2 21.1 6.1 18.6 9.2 16.1" />
    </svg>
  );
}

// Share: a solid "send" arrowhead with a notch line (Loop's own drawing).
// The notch is cut out with a mask so it shows whatever is behind it.
let iconMaskSeq = 0;
function ShareIcon({ size = 24, color = "currentColor", strokeWidth = 1.9, ...rest }) {
  const idRef = React.useRef(null);
  if (!idRef.current) idRef.current = `loopShareMask${++iconMaskSeq}`;
  const id = idRef.current;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <rect x="0" y="0" width="24" height="24" fill="#fff" />
          <path d="M6.6 12h6.6" stroke="#000" strokeWidth={1.9} strokeLinecap="round" />
        </mask>
      </defs>
      <path
        d="M5.2 4.2 20.4 12 5.2 19.8 8.6 12Z"
        fill={color}
        stroke={color}
        strokeWidth={2.4}
        strokeLinejoin="round"
        mask={`url(#${id})`}
      />
    </svg>
  );
}

// Messages: a filled chat bubble with three dots, a second bubble behind it.
function ChatsIcon({ size = 24, color = "currentColor", ...rest }) {
  const idRef = React.useRef(null);
  if (!idRef.current) idRef.current = `loopChatMask${++iconMaskSeq}`;
  const id = idRef.current;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <rect x="0" y="0" width="24" height="24" fill="#fff" />
          <circle cx="6.6" cy="9.6" r="1.15" fill="#000" />
          <circle cx="9.9" cy="9.6" r="1.15" fill="#000" />
          <circle cx="13.2" cy="9.6" r="1.15" fill="#000" />
        </mask>
      </defs>
      <path
        d="M17.4 9.4c2.2.9 3.7 2.8 3.7 5 0 1.3-.5 2.5-1.4 3.5l.7 2.6-2.9-1c-.9.3-1.8.4-2.8.4-2.3 0-4.3-.9-5.5-2.4"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 3.4c4 0 7.3 2.8 7.3 6.2s-3.3 6.2-7.3 6.2c-1 0-1.9-.2-2.8-.5L3.3 16.6l1.1-3.2C3.3 12.3 2.6 11 2.6 9.6c0-3.4 3.3-6.2 7.3-6.2Z"
        fill={color}
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
        mask={`url(#${id})`}
      />
    </svg>
  );
}

// Follow / Following button used in people lists (likers, suggestions…).
function FollowPill({ following, onClick, small = false }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="shrink-0 rounded-lg transition-transform active:scale-95"
      style={{
        height: small ? 30 : 34,
        minWidth: small ? 84 : 100,
        padding: "0 14px",
        fontSize: 13,
        fontWeight: 700,
        ...(following
          ? { background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }
          : { background: ACCENT, color: "var(--on-accent)" }),
      }}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}

// Long-press on a like button: "Likes" (photos) or "Likes and views"
// (videos), the numbers, then everyone who liked it with a Follow button.
// The list shows even when the creator hid the number — like Instagram.
function LikesViewsPopup({ post, isOwner, onClose, onOpenProfile }) {
  const [likers, setLikers] = useState(null);
  const [query, setQuery] = useState("");
  const [me, setMe] = useState(null);
  const [following, setFollowing] = useState(new Set());
  const isVideo = post.media_type === "reel" || post.media_type === "video";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ data: likes }, { data: { user } }] = await Promise.all([
        supabase.from("likes").select("user_id, created_at").eq("post_id", post.id).order("created_at", { ascending: false }).limit(300),
        supabase.auth.getUser(),
      ]);
      if (cancelled) return;
      setMe(user?.id || null);
      const ids = [...new Set((likes || []).map((l) => l.user_id))];
      if (ids.length === 0) {
        setLikers([]);
        return;
      }
      const [{ data: profs }, rel, { data: myFollows }] = await Promise.all([
        supabase.from("profiles").select("id, username, full_name, avatar_url").in("id", ids),
        getRelations(),
        supabase.from("follows").select("following_id").eq("follower_id", user?.id ?? "").in("following_id", ids),
      ]);
      if (cancelled) return;
      const byId = Object.fromEntries((profs || []).map((p) => [p.id, p]));
      const list = ids.map((id) => byId[id]).filter((p) => p && !isBlockedEither(rel, p.id));
      list.sort((a, b) => (a.id === user?.id ? -1 : b.id === user?.id ? 1 : 0));
      setFollowing(new Set((myFollows || []).map((f) => f.following_id)));
      setLikers(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [post.id]);

  const toggleFollow = async (p) => {
    if (!me) return;
    const was = following.has(p.id);
    setFollowing((prev) => {
      const next = new Set(prev);
      was ? next.delete(p.id) : next.add(p.id);
      return next;
    });
    if (was) {
      await supabase.from("follows").delete().eq("follower_id", me).eq("following_id", p.id);
    } else {
      const { error } = await supabase.from("follows").insert({ follower_id: me, following_id: p.id });
      if (!error) await supabase.from("notifications").insert({ user_id: p.id, actor_id: me, type: "follow" });
    }
  };

  const q = query.trim().toLowerCase();
  const shown = (likers || []).filter((p) => !q || p.username?.toLowerCase().includes(q) || p.full_name?.toLowerCase().includes(q));
  const countHidden = !isOwner && post.hide_likes;

  return (
    <>
      <div className="fixed inset-0 z-[70]" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose} />
      <div
        className="fixed left-0 right-0 bottom-0 z-[71] rounded-t-3xl flex flex-col"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", maxHeight: "82vh" }}
      >
        <div className="flex items-center justify-center pt-2.5 pb-1">
          <div className="rounded-full" style={{ width: 40, height: 4, background: "var(--toggle-off)" }} />
        </div>
        <p className="text-center text-[15px] py-2.5" style={{ color: "var(--text)", fontWeight: 700, borderBottom: "1px solid var(--border-subtle)" }}>
          {isVideo ? "Likes and views" : "Likes"}
        </p>

        <div className="flex items-center justify-center gap-8 py-3.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <span className="flex items-center gap-2 text-[17px]" style={{ color: "var(--text)", fontWeight: 600 }}>
            <Heart size={20} color="var(--text)" strokeWidth={2} />
            {countHidden ? "—" : (post.likeCount || 0).toLocaleString()}
          </span>
          {isVideo && (
            <span className="flex items-center gap-2 text-[17px]" style={{ color: "var(--text)", fontWeight: 600 }}>
              <Play size={19} color="var(--text)" strokeWidth={2} />
              {(post.views_count || 0).toLocaleString()}
            </span>
          )}
        </div>
        {countHidden && (
          <p className="text-[11px] text-center pt-2" style={{ color: "var(--text-muted)" }}>
            {post.username ? `${post.username} hid` : "The creator hid"} the like count on this post.
          </p>
        )}

        <div className="px-4 pt-3 flex-1 min-h-0 flex flex-col">
          <p className="text-[15px] mb-2.5" style={{ color: "var(--text)", fontWeight: 700 }}>Liked by</p>
          <div className="flex items-center gap-2 rounded-xl px-3 h-10 mb-2" style={{ background: "var(--surface)" }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--text)" }}
            />
          </div>
          <div className="overflow-y-auto pb-6" style={{ minHeight: 120 }}>
            {likers === null ? (
              <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Loading…</p>
            ) : likers.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <Heart size={34} color="var(--text-muted)" strokeWidth={1.5} />
                <p className="text-sm mt-2" style={{ color: "var(--text)", fontWeight: 600 }}>No likes yet</p>
              </div>
            ) : shown.length === 0 ? (
              <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>No one by that name</p>
            ) : (
              shown.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2">
                  <button
                    onClick={() => {
                      if (!onOpenProfile) return;
                      onClose();
                      onOpenProfile(p.id);
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    <Avatar username={p.username} avatarUrl={p.avatar_url} size={48} />
                    <div className="min-w-0">
                      <p className="text-sm truncate" style={{ color: "var(--text)", fontWeight: 700 }}>{p.username}</p>
                      {p.full_name && <p className="text-[13px] truncate" style={{ color: "var(--text-muted)" }}>{p.full_name}</p>}
                    </div>
                  </button>
                  {p.id !== me && <FollowPill following={following.has(p.id)} onClick={() => toggleFollow(p)} />}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Shows "with @user1, @user2" under a caption when people are tagged
function TaggedPeopleLine({ tags, onOpenProfile, light = false }) {
  if (!tags || tags.length === 0) return null;
  const color = light ? "#FFFFFF" : "var(--text)";
  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-1 mb-1">
      <CircleUserRound size={14} color={color} />
      {tags.map((t, i) => (
        <React.Fragment key={t.tagged_user_id}>
          <button onClick={(e) => { e.stopPropagation(); onOpenProfile?.(t.tagged_user_id); }} className="text-[13px]" style={{ color, fontWeight: 600 }}>
            {t.username}
          </button>
          {i < tags.length - 1 && <span style={{ color, opacity: 0.6 }}>·</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// Everyone tagged in a post, with a Follow button each — Instagram's
// "In this photo" sheet.
function InThisPostSheet({ tags, isVideo, onClose, onOpenProfile }) {
  const [me, setMe] = useState(null);
  const [people, setPeople] = useState(null);
  const [following, setFollowing] = useState(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ids = [...new Set((tags || []).map((t) => t.tagged_user_id))];
      const [{ data: { user } }, { data: profs }] = await Promise.all([
        supabase.auth.getUser(),
        ids.length ? supabase.from("profiles").select("id, username, full_name, avatar_url, is_verified").in("id", ids) : Promise.resolve({ data: [] }),
      ]);
      if (cancelled) return;
      setMe(user?.id || null);
      setPeople(profs || []);
      if (user?.id && ids.length) {
        const { data: f } = await supabase.from("follows").select("following_id").eq("follower_id", user.id).in("following_id", ids);
        if (!cancelled) setFollowing(new Set((f || []).map((x) => x.following_id)));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tags]);

  const toggle = async (pp) => {
    if (!me) return;
    const was = following.has(pp.id);
    setFollowing((prev) => {
      const next = new Set(prev);
      was ? next.delete(pp.id) : next.add(pp.id);
      return next;
    });
    if (was) {
      await supabase.from("follows").delete().eq("follower_id", me).eq("following_id", pp.id);
    } else {
      const { error } = await supabase.from("follows").insert({ follower_id: me, following_id: pp.id });
      if (!error) await supabase.from("notifications").insert({ user_id: pp.id, actor_id: me, type: "follow" });
    }
  };

  return (
    <StorySheetShell title={isVideo ? "In this video" : "In this photo"} onClose={onClose}>
      <div className="px-4 pb-6">
        {people === null ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Loading…</p>
        ) : people.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Nobody is tagged here</p>
        ) : (
          people.map((pp) => (
            <div key={pp.id} className="flex items-center gap-3 py-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenProfile?.(pp.id);
                }}
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                <Avatar username={pp.username} avatarUrl={pp.avatar_url} size={46} />
                <div className="min-w-0">
                  <p className="text-sm truncate flex items-center gap-1" style={{ color: "var(--text)", fontWeight: 700 }}>
                    {pp.username}
                    {pp.is_verified && <VerifiedBadge size={13} />}
                  </p>
                  {pp.full_name && <p className="text-[12px] truncate" style={{ color: "var(--text-muted)" }}>{pp.full_name}</p>}
                </div>
              </button>
              {pp.id !== me && <FollowPill following={following.has(pp.id)} onClick={() => toggle(pp)} />}
            </div>
          ))
        )}
      </div>
    </StorySheetShell>
  );
}

// The little person button on a photo/video: tap it for the list above.
function MediaTagOverlay({ tags, isVideo, onOpenProfile }) {
  const [open, setOpen] = useState(false);
  if (!tags || tags.length === 0) return null;
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label="Tagged people"
        className="absolute left-2.5 bottom-2.5 z-[6] w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.6)" }}
      >
        <CircleUserRound size={15} color="#FFFFFF" fill="rgba(255,255,255,0.15)" />
      </button>
      {open && (
        <InThisPostSheet tags={tags} isVideo={isVideo} onClose={() => setOpen(false)} onOpenProfile={onOpenProfile} />
      )}
    </>
  );
}

// Simple poll: shows options as bars; tapping one casts/changes your vote
function PollBlock({ postId, currentUserId }) {
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadPoll();
  }, []);

  const loadPoll = async () => {
    const { data: pollData } = await supabase.from("polls").select("id, question").eq("post_id", postId).maybeSingle();
    if (!pollData) {
      setLoaded(true);
      return;
    }
    setPoll(pollData);
    const { data: optionsData } = await supabase
      .from("poll_options")
      .select("id, option_text, position")
      .eq("poll_id", pollData.id)
      .order("position", { ascending: true });
    setOptions(optionsData || []);
    const { data: votesData } = await supabase.from("poll_votes").select("option_id, user_id").eq("poll_id", pollData.id);
    setVotes(votesData || []);
    setLoaded(true);
  };

  const vote = async (optionId) => {
    if (!currentUserId || !poll) return;
    setVotes((prev) => [...prev.filter((v) => v.user_id !== currentUserId), { option_id: optionId, user_id: currentUserId }]);
    await supabase
      .from("poll_votes")
      .upsert({ poll_id: poll.id, option_id: optionId, user_id: currentUserId }, { onConflict: "poll_id,user_id" });
  };

  if (!loaded || !poll) return null;

  const totalVotes = votes.length;
  const myVote = votes.find((v) => v.user_id === currentUserId)?.option_id;

  return (
    <div className="mx-4 mt-2 mb-1 rounded-xl p-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <p className="text-sm mb-2" style={{ color: "var(--text)", fontWeight: 600 }}>{poll.question}</p>
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => {
          const count = votes.filter((v) => v.option_id === opt.id).length;
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const isMine = myVote === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => vote(opt.id)}
              className="relative rounded-lg overflow-hidden text-left px-3 py-2"
              style={{ background: "var(--bg)", border: isMine ? "1px solid var(--accent-start)" : "1px solid var(--border)" }}
            >
              {myVote && (
                <div
                  className="absolute inset-y-0 left-0"
                  style={{ width: `${pct}%`, background: "rgba(255,93,115,0.18)" }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text)" }}>{opt.option_text}</span>
                {myVote && <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{pct}%</span>}
              </div>
            </button>
          );
        })}
      </div>
      {totalVotes > 0 && (
        <p className="text-[10px] mt-1.5" style={{ color: "var(--text-muted)" }}>{totalVotes} vote{totalVotes === 1 ? "" : "s"}</p>
      )}
    </div>
  );
}

// Bottom sheet for the post owner to change per-post visibility settings
// after publishing (opened from the Edit option in their own Profile grid)
function PostOptionsSheet({ post, onClose, onSaved, onDeleted }) {
  const [view, setView] = useState("menu"); // "menu" | "edit" | "cover"
  const [busyField, setBusyField] = useState(null);
  const [menuError, setMenuError] = useState("");
  const [editCaption, setEditCaption] = useState(post.caption || "");
  const [editLocation, setEditLocation] = useState(post.location || "");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [localCover, setLocalCover] = useState(post.cover_url || null);

  const patchPost = async (patch) => {
    const field = Object.keys(patch)[0];
    setBusyField(field);
    setMenuError("");
    const { error } = await supabase.from("posts").update(patch).eq("id", post.id);
    setBusyField(null);
    if (error) {
      setMenuError(error.message);
      return;
    }
    onSaved?.(patch);
  };

  const toggleField = (field, current) => patchPost({ [field]: !current });

  const handleDelete = async () => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) {
      setMenuError(error.message);
      return;
    }
    onDeleted?.();
    onClose();
  };

  const saveEdit = async () => {
    setSavingEdit(true);
    setEditError("");
    const { error } = await supabase
      .from("posts")
      .update({ caption: editCaption, location: editLocation.trim() || null })
      .eq("id", post.id);
    setSavingEdit(false);
    if (error) {
      setEditError(error.message);
      return;
    }
    onSaved?.({ caption: editCaption, location: editLocation.trim() || null });
    onClose();
  };

  const Toggle = ({ label, field, value, extraField }) => (
    <button
      onClick={() => (extraField ? patchPost({ [field]: !value, [extraField]: !value }) : toggleField(field, value))}
      disabled={busyField === field}
      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm"
      style={{ color: "var(--text)", textAlign: "left", opacity: busyField === field ? 0.6 : 1 }}
    >
      <span style={{ textAlign: "left" }}>{label}</span>
      <span className="rounded-full shrink-0" style={{ width: 34, height: 19, background: value ? ACCENT : "var(--toggle-off)", position: "relative" }}>
        <span className="rounded-full bg-white absolute" style={{ width: 15, height: 15, top: 2, left: value ? 17 : 2, transition: "left 0.15s" }} />
      </span>
    </button>
  );

  const MenuRow = ({ label, icon, onClick, danger, busy }) => (
    <button
      onClick={onClick}
      disabled={busy}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm"
      style={{ color: danger ? "var(--accent-start)" : "var(--text)", textAlign: "left", opacity: busy ? 0.6 : 1 }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <div
        className="fixed left-0 right-0 bottom-0 z-50 rounded-t-3xl"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", maxHeight: "80vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-center pt-2.5 pb-1">
          <div className="rounded-full" style={{ width: 36, height: 4, background: "var(--toggle-off)" }} />
        </div>
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-sm" style={{ color: "var(--text)", fontWeight: 700 }}>
            {view === "edit" ? "Edit" : view === "cover" ? "Cover" : "Post options"}
          </span>
          <button onClick={onClose}><X size={18} color="var(--text-muted)" /></button>
        </div>

        {view === "menu" ? (
          <div className="pb-6">
            {post.removed_at && (
              <div className="mx-4 mb-2 rounded-xl px-3 py-2.5" style={{ background: "var(--bg-sunken)", border: "1px solid var(--heart)" }}>
                <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--heart)", fontWeight: 700 }}>
                  <Shield size={13} /> Removed by Loop
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                  Only you can see this post. Reason: {post.removed_reason || "Community Guidelines"}.
                </p>
              </div>
            )}
            {post.created_at && new Date(post.created_at).getTime() > Date.now() && (
              <div className="mx-4 mb-2 rounded-xl px-3 py-2.5" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
                <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text)", fontWeight: 600 }}>
                  <Clock size={13} /> Scheduled for{" "}
                  {new Date(post.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => patchPost({ created_at: new Date().toISOString() })}
                    disabled={busyField === "created_at"}
                    className="flex-1 rounded-full h-9 text-xs transition-transform active:scale-95"
                    style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busyField === "created_at" ? 0.6 : 1 }}
                  >
                    Post now
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 rounded-full h-9 text-xs transition-transform active:scale-95"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--heart)", fontWeight: 700 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            {menuError && (
              <p className="text-xs px-4 pb-2" style={{ color: "var(--accent-start)" }}>{menuError}</p>
            )}
            <Toggle label="Hide Like Count For This Post" field="hide_likes" value={!!post.hide_likes} />
            <Toggle label="Hide Comment Count For This Post" field="hide_comments" value={!!post.hide_comments} />
            <Toggle
              label="Hide Repost/Share/Save Count For This Post"
              field="hide_reposts"
              value={!!post.hide_reposts}
              extraField="hide_saves"
            />
            <Toggle label="Turn Off Comments" field="comments_disabled" value={!!post.comments_disabled} />

            <div className="h-px my-1.5" style={{ background: "var(--border)" }} />

            <MenuRow
              icon={<Pin size={16} color="var(--text)" />}
              label={post.pinned ? "Unpin from your main grid" : "Pin to your main grid"}
              onClick={() => toggleField("pinned", !!post.pinned)}
              busy={busyField === "pinned"}
            />
            <MenuRow
              icon={<Archive size={16} color="var(--text)" />}
              label={post.archived ? "Unarchive" : "Archive"}
              onClick={() => toggleField("archived", !!post.archived)}
              busy={busyField === "archived"}
            />
            {!isPhotoPost(post) && (
              <MenuRow
                icon={<ImageIcon size={16} color="var(--text)" />}
                label={busyField === "cover_url" ? "Changing cover…" : "Change cover"}
                onClick={() => setView("cover")}
                busy={busyField === "cover_url"}
              />
            )}
            <MenuRow icon={<Pencil size={16} color="var(--text)" />} label="Edit" onClick={() => setView("edit")} />
            <MenuRow
              icon={<Crop size={16} color="var(--text)" />}
              label="Adjust preview"
              onClick={() => alert("Adjust preview — coming soon. This app stores one image per post, so there's no second frame to pick from yet.")}
            />

            <div className="h-px my-1.5" style={{ background: "var(--border)" }} />
            <MenuRow icon={<Trash2 size={16} color="var(--accent-start)" />} label="Delete" onClick={handleDelete} danger />
          </div>
        ) : view === "cover" ? (
          <div className="px-4 pb-6">
            <p className="text-[12px] mb-3" style={{ color: "var(--text-muted)" }}>
              This is the picture people see before the video plays — on your profile, in Explore and everywhere else.
            </p>
            <CoverPicker
              videoUrl={post.media_url}
              coverUrl={localCover}
              label="Video cover"
              onPick={async (f) => {
                setBusyField("cover_url");
                setMenuError("");
                try {
                  const {
                    data: { user },
                  } = await supabase.auth.getUser();
                  const small = await compressImage(f, 1080);
                  const url = await uploadCoverBlob(small, user.id);
                  const { error } = await supabase.from("posts").update({ cover_url: url }).eq("id", post.id);
                  if (error) throw error;
                  setLocalCover(url);
                  onSaved?.({ cover_url: url });
                  setView("menu");
                } catch (e) {
                  setMenuError(e?.message || "That cover didn't save");
                }
                setBusyField(null);
              }}
            />
            {menuError && <p className="text-xs mb-3" style={{ color: "var(--accent-start)" }}>{menuError}</p>}
            <button
              onClick={() => setView("menu")}
              className="w-full rounded-xl py-2.5 text-sm"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              Back
            </button>
          </div>
        ) : (
          <div className="px-4 pb-6">
            <textarea
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={3}
              className="w-full rounded-xl px-3 py-2.5 text-sm mb-3 outline-none resize-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <div
              className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm mb-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <MapPin size={15} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Add location"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--text)" }}
              />
            </div>
            {editError && (
              <p className="text-xs mb-3" style={{ color: "var(--accent-start)" }}>{editError}</p>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("menu")}
                className="flex-1 rounded-xl py-2.5 text-sm"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={savingEdit}
                className="flex-1 rounded-xl py-2.5 text-sm"
                style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: savingEdit ? 0.6 : 1 }}
              >
                {savingEdit ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ---- Stories ----
// Backed by the `stories` + `story_views` tables and the `stories`
// storage bucket (see stories-setup.sql). A story lives 24 hours;
// expired ones are filtered out by RLS, so the client never has to
// think about it. Stories are grouped per user: one ring per person.

const STORY_PHOTO_MS = 5000;   // how long a photo is shown
const STORY_VIDEO_CAP_MS = 30000; // longest a video story can run

// Composer: preview the picked file, optionally add a caption, publish.
function StoryComposer({ file, onCancel, onPublished }) {
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isVideo = file.type.startsWith("video");
  const previewUrl = React.useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => () => URL.revokeObjectURL(previewUrl), [previewUrl]);

  const publish = async () => {
    setBusy(true);
    setError("");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setBusy(false);
      setError("Not logged in");
      return;
    }
    if ((file.type || "").startsWith("video") && file.size > MAX_UPLOAD_VIDEO_BYTES) {
      setBusy(false);
      setError("That video is over 50 MB — pick a shorter one.");
      return;
    }
    const upFile = await compressImage(file, 1920);
    const safeName = upFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${user.id}/${Date.now()}-${safeName}`;
    const { error: upErr } = await supabase.storage.from("stories").upload(path, upFile);
    if (upErr) {
      setBusy(false);
      setError(upErr.message);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("stories").getPublicUrl(path);
    const prefs = getStoryPrefs();
    const { error: insErr } = await supabase.from("stories").insert({
      user_id: user.id,
      media_url: publicUrl,
      media_type: isVideo ? "video" : "photo",
      caption: caption.trim() || null,
      comments_disabled: !prefs.allowReplies,
    });
    setBusy(false);
    if (insErr) {
      setError(insErr.message);
      return;
    }
    onPublished();
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col" style={{ background: "#000000" }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onCancel} className="p-1 -ml-1 transition-transform active:scale-90">
          <X size={24} color="#FFFFFF" />
        </button>
        <span className="text-sm" style={{ color: "#FFFFFF", fontWeight: 700 }}>Your story</span>
        <span style={{ width: 24 }} />
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden px-3">
        {isVideo ? (
          <video src={previewUrl} className="max-w-full max-h-full rounded-2xl" controls playsInline />
        ) : (
          <img src={previewUrl} alt="" className="max-w-full max-h-full object-contain rounded-2xl" />
        )}
      </div>

      <div className="px-4 pt-3 pb-6">
        {error && (
          <p className="text-xs mb-2" style={{ color: "var(--heart)" }}>{error}</p>
        )}
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          maxLength={200}
          className="w-full rounded-full px-4 h-11 text-sm outline-none mb-3"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#FFFFFF" }}
        />
        <button
          onClick={publish}
          disabled={busy}
          className="w-full rounded-full h-12 text-sm transition-transform active:scale-95"
          style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Sharing..." : "Share to story"}
        </button>
      </div>
    </div>
  );
}

// Full-screen viewer: segmented progress bars, tap left/right to move,
// press-and-hold to pause, swipe-free and keyboard-free by design (mobile).
// ---- Story option sheets ----
// All of these sit above the viewer (z-70) and freeze its timer while open.

function StorySheetShell({ title, onClose, children }) {
  return (
    <>
      <div className="fixed inset-0 z-[70]" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose} />
      <div
        className="fixed left-0 right-0 bottom-0 z-[71] rounded-t-3xl"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", maxHeight: "80vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-center pt-2.5 pb-1">
          <div className="rounded-full" style={{ width: 40, height: 4, background: "var(--toggle-off)" }} />
        </div>
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-sm" style={{ color: "var(--text)", fontWeight: 700 }}>{title}</span>
          <button onClick={onClose}><X size={18} color="var(--text-muted)" /></button>
        </div>
        {children}
      </div>
    </>
  );
}

function StoryMenuRow({ icon, label, onClick, danger, busy, trailing }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-left transition-colors active:bg-[var(--active-highlight)]"
      style={{ color: danger ? "var(--heart)" : "var(--text)", opacity: busy ? 0.5 : 1 }}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {trailing}
    </button>
  );
}

// Send this story into a DM. Reuses the existing messaging tables:
// the media lands as an image_url message, plus a short caption line.
function StorySendSheet({ story, currentUserId, onClose }) {
  const [people, setPeople] = useState([]);
  const [query, setQuery] = useState("");
  const [sentTo, setSentTo] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .neq("id", currentUserId || "")
        .limit(50);
      if (!cancelled) {
        setPeople(data || []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  const sendTo = async (person) => {
    setBusyId(person.id);
    setError("");
    const { data: convoId, error: convoErr } = await supabase.rpc("get_or_create_conversation", {
      other_user: person.id,
    });
    if (convoErr) {
      setBusyId(null);
      setError(convoErr.message);
      return;
    }
    const { error: msgErr } = await supabase.from("messages").insert({
      conversation_id: convoId,
      sender_id: currentUserId,
      image_url: story.media_url,
      content: story.caption ? `Shared a story · ${story.caption}` : "Shared a story",
    });
    setBusyId(null);
    if (msgErr) {
      setError(msgErr.message);
      return;
    }
    setSentTo((prev) => [...prev, person.id]);
  };

  const filtered = people.filter((p) => p.username.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <StorySheetShell title="Send story to" onClose={onClose}>
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2.5 rounded-full px-4 h-11" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text)" }}
          />
        </div>
      </div>
      {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}
      <div className="pb-6">
        {loading ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>No one to send to yet</p>
        ) : (
          filtered.map((p) => {
            const done = sentTo.includes(p.id);
            return (
              <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
                <Avatar username={p.username} avatarUrl={p.avatar_url} size={44} />
                <span className="flex-1 text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{p.username}</span>
                <button
                  onClick={() => !done && sendTo(p)}
                  disabled={done || busyId === p.id}
                  className="rounded-full px-4 h-8 text-xs shrink-0 transition-transform active:scale-95"
                  style={{
                    background: done ? "var(--bg-sunken)" : ACCENT,
                    border: done ? "1px solid var(--border)" : "none",
                    color: done ? "var(--text-muted)" : "var(--on-accent)",
                    fontWeight: 700,
                    opacity: busyId === p.id ? 0.6 : 1,
                  }}
                >
                  {done ? "Sent" : busyId === p.id ? "..." : "Send"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </StorySheetShell>
  );
}

// Add the story to a highlight — pick an existing one or name a new one.
// Highlighted stories survive the 24-hour expiry (see stories-v2-setup.sql).
function StoryHighlightSheet({ story, currentUserId, onClose, onDone }) {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [addedTo, setAddedTo] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("story_highlights")
        .select("id, title, cover_url")
        .eq("user_id", currentUserId || "")
        .order("created_at", { ascending: false });
      if (!cancelled) {
        setHighlights(data || []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  const addTo = async (highlightId) => {
    setBusy(true);
    setError("");
    const { error: err } = await supabase
      .from("story_highlight_items")
      .upsert({ highlight_id: highlightId, story_id: story.id }, { onConflict: "highlight_id,story_id" });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setAddedTo((prev) => [...prev, highlightId]);
    onDone?.();
  };

  const createAndAdd = async () => {
    const title = newTitle.trim();
    if (!title) return;
    setBusy(true);
    setError("");
    const { data: created, error: err } = await supabase
      .from("story_highlights")
      .insert({ user_id: currentUserId, title, cover_url: story.media_type === "photo" ? story.media_url : null })
      .select("id, title, cover_url")
      .single();
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const { error: itemErr } = await supabase
      .from("story_highlight_items")
      .insert({ highlight_id: created.id, story_id: story.id });
    setBusy(false);
    if (itemErr) {
      setError(itemErr.message);
      return;
    }
    setHighlights((prev) => [created, ...prev]);
    setAddedTo((prev) => [...prev, created.id]);
    setNewTitle("");
    onDone?.();
  };

  return (
    <StorySheetShell title="Add to highlight" onClose={onClose}>
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New highlight name"
            maxLength={40}
            className="flex-1 rounded-full px-4 h-11 text-sm outline-none"
            style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          <button
            onClick={createAndAdd}
            disabled={busy || !newTitle.trim()}
            className="rounded-full px-4 h-11 text-xs shrink-0 transition-transform active:scale-95"
            style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busy || !newTitle.trim() ? 0.5 : 1 }}
          >
            Create
          </button>
        </div>
      </div>
      {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}
      <div className="pb-6">
        {loading ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : highlights.length === 0 ? (
          <p className="text-xs text-center py-6 px-8" style={{ color: "var(--text-muted)" }}>
            No highlights yet. Name one above to make your first.
          </p>
        ) : (
          highlights.map((h) => {
            const done = addedTo.includes(h.id);
            return (
              <button
                key={h.id}
                onClick={() => !done && addTo(h.id)}
                disabled={done || busy}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors active:bg-[var(--active-highlight)]"
              >
                <div
                  className="w-11 h-11 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  {h.cover_url ? (
                    <img src={h.cover_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Star size={17} color="var(--text-muted)" />
                  )}
                </div>
                <span className="flex-1 text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{h.title}</span>
                {done && <Check size={17} color="var(--accent-solid)" />}
              </button>
            );
          })
        )}
      </div>
    </StorySheetShell>
  );
}

// Device-level defaults applied to every NEW story you post.
function getStoryPrefs() {
  try {
    const raw = localStorage.getItem("loop_story_prefs");
    return raw ? JSON.parse(raw) : { allowReplies: true, autoHighlight: false, allowSharing: true };
  } catch {
    return { allowReplies: true, autoHighlight: false, allowSharing: true };
  }
}
function saveStoryPrefs(prefs) {
  try {
    localStorage.setItem("loop_story_prefs", JSON.stringify(prefs));
  } catch {}
}

function StorySettingsSheet({ onClose }) {
  const [prefs, setPrefs] = useState(getStoryPrefs());

  const toggle = (key) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    saveStoryPrefs(next);
  };

  const Row = ({ label, hint, k }) => (
    <button onClick={() => toggle(k)} className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left">
      <span className="flex-1">
        <span className="text-sm block" style={{ color: "var(--text)" }}>{label}</span>
        <span className="text-[11px] block mt-0.5" style={{ color: "var(--text-muted)" }}>{hint}</span>
      </span>
      <span className="rounded-full shrink-0 mt-0.5" style={{ width: 38, height: 21, background: prefs[k] ? ACCENT : "var(--toggle-off)", position: "relative" }}>
        <span className="rounded-full bg-white absolute" style={{ width: 17, height: 17, top: 2, left: prefs[k] ? 19 : 2, transition: "left 0.15s" }} />
      </span>
    </button>
  );

  return (
    <StorySheetShell title="Story settings" onClose={onClose}>
      <div className="pb-6">
        <Row k="allowReplies" label="Allow replies" hint="New stories you post will accept replies. You can still turn them off per story." />
        <Row k="allowSharing" label="Allow sharing to messages" hint="Lets people send your story to someone in a DM." />
        <Row k="autoHighlight" label="Save to archive" hint="Keep your stories after 24 hours so you can highlight them later." />
        <p className="text-[11px] px-4 pt-3" style={{ color: "var(--text-muted)" }}>
          These are defaults for stories you post from this device.
        </p>
      </div>
    </StorySheetShell>
  );
}

// Who replied to your story.
function StoryRepliesSheet({ story, onClose }) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: rows } = await supabase
        .from("story_replies")
        .select("id, user_id, body, created_at")
        .eq("story_id", story.id)
        .order("created_at", { ascending: false });
      const ids = [...new Set((rows || []).map((r) => r.user_id))];
      let profiles = [];
      if (ids.length > 0) {
        const { data } = await supabase.from("profiles").select("id, username, avatar_url").in("id", ids);
        profiles = data || [];
      }
      if (!cancelled) {
        setReplies(
          (rows || []).map((r) => ({
            ...r,
            username: profiles.find((p) => p.id === r.user_id)?.username || "unknown",
            avatarUrl: profiles.find((p) => p.id === r.user_id)?.avatar_url || null,
          }))
        );
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [story.id]);

  return (
    <StorySheetShell title="Replies" onClose={onClose}>
      <div className="pb-6">
        {loading ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : replies.length === 0 ? (
          <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>No replies yet</p>
        ) : (
          replies.map((r) => (
            <div key={r.id} className="flex items-start gap-3 px-4 py-2.5">
              <Avatar username={r.username} avatarUrl={r.avatarUrl} size={36} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px]" style={{ color: "var(--text)", fontWeight: 600 }}>
                  {r.username}
                  <span className="ml-2 text-[11px]" style={{ color: "var(--text-muted)", fontWeight: 400 }}>{timeAgo(r.created_at)}</span>
                </p>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)", wordBreak: "break-word" }}>{r.body}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </StorySheetShell>
  );
}

// ---- The viewer ----
function StoryViewer({ groups, startGroupIndex, currentUserId, onClose, onOpenProfile, onChanged, onAddStory }) {
  const [gIndex, setGIndex] = useState(startGroupIndex);
  const [sIndex, setSIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(STORY_PHOTO_MS);
  const [held, setHeld] = useState(false);
  const [sheet, setSheet] = useState(null); // options | send | highlight | settings | replies
  const [replyFocused, setReplyFocused] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [flash, setFlash] = useState("");

  // per-story live state
  const [meta, setMeta] = useState({ views: 0, likes: 0, replies: 0, liked: false });
  const [local, setLocal] = useState({}); // storyId -> { archived, comments_disabled }
  const [busyAction, setBusyAction] = useState(null);

  const videoRef = React.useRef(null);
  const pressRef = React.useRef({ t: 0 });

  // Snapshot the list for this viewing session. Archiving a story refreshes
  // the bar behind us; without this freeze the indices would shift mid-view.
  const sessionRef = React.useRef(groups);
  const groupList = sessionRef.current;

  const group = groupList[gIndex];
  const rawStory = group?.items?.[sIndex];
  const story = rawStory ? { ...rawStory, ...(local[rawStory.id] || {}) } : null;
  const isOwner = story ? story.user_id === currentUserId : false;

  // The timer is frozen while pressing, while a sheet is open, and
  // while the reply box has focus — otherwise the story would slide
  // out from under whatever you are doing.
  const frozen = held || sheet !== null || replyFocused;

  const showFlash = (msg) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 1800);
  };

  useEffect(() => {
    setElapsed(0);
    setDuration(rawStory?.media_type === "video" ? STORY_VIDEO_CAP_MS : STORY_PHOTO_MS);
    setReplyText("");
  }, [rawStory?.id]);

  useEffect(() => {
    if (frozen || !rawStory) return;
    const t = setInterval(() => setElapsed((e) => e + 50), 50);
    return () => clearInterval(t);
  }, [frozen, rawStory?.id]);

  useEffect(() => {
    if (elapsed >= duration) advance(1);
  }, [elapsed, duration]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (frozen) v.pause();
    else v.play().catch(() => {});
  }, [frozen, rawStory?.id]);

  // Record the view, then pull likes / replies / views for this story.
  useEffect(() => {
    if (!rawStory || !currentUserId) return;
    let cancelled = false;

    (async () => {
      if (rawStory.user_id !== currentUserId) {
        await supabase
          .from("story_views")
          .upsert({ story_id: rawStory.id, viewer_id: currentUserId }, { onConflict: "story_id,viewer_id" });
      }

      // RLS narrows these automatically: the owner sees every row,
      // a visitor sees only their own — so one query serves both.
      const [likesRes, viewsRes, repliesRes] = await Promise.all([
        supabase.from("story_likes").select("user_id").eq("story_id", rawStory.id),
        supabase.from("story_views").select("viewer_id", { count: "exact", head: true }).eq("story_id", rawStory.id),
        supabase.from("story_replies").select("id", { count: "exact", head: true }).eq("story_id", rawStory.id),
      ]);

      if (cancelled) return;
      const likeRows = likesRes.data || [];
      setMeta({
        views: viewsRes.count || 0,
        likes: likeRows.length,
        replies: repliesRes.count || 0,
        liked: likeRows.some((l) => l.user_id === currentUserId),
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [rawStory?.id, currentUserId]);

  const advance = (dir) => {
    const g = groupList[gIndex];
    if (!g) {
      onClose();
      return;
    }
    const nextS = sIndex + dir;
    if (nextS >= 0 && nextS < g.items.length) {
      setElapsed(0);
      setSIndex(nextS);
      return;
    }
    const nextG = gIndex + dir;
    if (nextG < 0) {
      setElapsed(0);
      setSIndex(0);
      return;
    }
    if (nextG >= groupList.length) {
      onClose();
      return;
    }
    setElapsed(0);
    setGIndex(nextG);
    setSIndex(dir > 0 ? 0 : Math.max(0, groupList[nextG].items.length - 1));
  };

  const toggleLike = async () => {
    if (!story || !currentUserId) return;
    const wasLiked = meta.liked;
    setMeta((m) => ({ ...m, liked: !wasLiked, likes: m.likes + (wasLiked ? -1 : 1) }));
    if (wasLiked) {
      await supabase.from("story_likes").delete().eq("story_id", story.id).eq("user_id", currentUserId);
    } else {
      await supabase.from("story_likes").upsert(
        { story_id: story.id, user_id: currentUserId },
        { onConflict: "story_id,user_id" }
      );
    }
  };

  const sendReply = async () => {
    const body = replyText.trim();
    if (!body || !story || !currentUserId || replySending) return;
    setReplySending(true);
    const { error } = await supabase
      .from("story_replies")
      .insert({ story_id: story.id, user_id: currentUserId, body });
    if (error) {
      setReplySending(false);
      showFlash(error.message);
      return;
    }

    // Mirror the reply into a DM with the story owner, the way Instagram
    // does. Best-effort: if the DM fails the reply itself still stands.
    try {
      const { data: convoId } = await supabase.rpc("get_or_create_conversation", { other_user: story.user_id });
      if (convoId) {
        await supabase.from("messages").insert({
          conversation_id: convoId,
          sender_id: currentUserId,
          content: body,
          image_url: story.media_type === "photo" ? story.media_url : null,
        });
        await supabase
          .from("conversations")
          .update({ last_message: `Replied to your story · ${body}`, last_message_at: new Date().toISOString() })
          .eq("id", convoId);
        await supabase.from("notifications").insert({ user_id: story.user_id, actor_id: currentUserId, type: "message" });
      }
    } catch {}

    setReplySending(false);
    setReplyText("");
    setReplyFocused(false);
    setMeta((m) => ({ ...m, replies: m.replies + 1 }));
    showFlash("Reply sent")
  };

  const patchStory = async (patch, successMsg) => {
    if (!story) return;
    const field = Object.keys(patch)[0];
    setBusyAction(field);
    const { error } = await supabase.from("stories").update(patch).eq("id", story.id);
    setBusyAction(null);
    if (error) {
      showFlash(error.message);
      return;
    }
    setLocal((prev) => ({ ...prev, [story.id]: { ...(prev[story.id] || {}), ...patch } }));
    onChanged?.();
    if (successMsg) showFlash(successMsg);
  };

  const handleDelete = async () => {
    if (!story) return;
    if (!window.confirm("Delete this story? This cannot be undone.")) return;
    setBusyAction("delete");
    const { error } = await supabase.from("stories").delete().eq("id", story.id);
    setBusyAction(null);
    if (error) {
      showFlash(error.message);
      return;
    }
    onChanged?.();
    onClose();
  };

  const handleShare = async () => {
    if (!story) return;
    const url = story.media_url;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Story on Loop", text: story.caption || "", url });
        setSheet(null);
        return;
      }
      await navigator.clipboard.writeText(url);
      setSheet(null);
      showFlash("Link copied");
    } catch {
      setSheet(null);
      showFlash("Couldn't share on this device");
    }
  };

  if (!group || !story) return null;

  const pct = Math.min(100, (elapsed / duration) * 100);
  const canReply = !isOwner && !story.comments_disabled;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col" style={{ background: "#000000" }}>
      {/* media + tap zones */}
      <div
        className="absolute inset-0"
        onPointerDown={() => {
          pressRef.current = { t: Date.now() };
          setHeld(true);
        }}
        onPointerUp={(e) => {
          setHeld(false);
          const heldFor = Date.now() - pressRef.current.t;
          if (heldFor < 250) {
            const rect = e.currentTarget.getBoundingClientRect();
            const rel = (e.clientX - rect.left) / rect.width;
            advance(rel < 0.32 ? -1 : 1);
          }
        }}
        onPointerLeave={() => setHeld(false)}
      >
        {story.media_type === "video" ? (
          <video
            key={story.id}
            ref={videoRef}
            src={story.media_url}
            className="w-full h-full object-contain"
            playsInline
            autoPlay
            onLoadedMetadata={(e) => {
              const ms = (e.currentTarget.duration || 15) * 1000;
              setDuration(Math.min(ms, STORY_VIDEO_CAP_MS));
            }}
          />
        ) : (
          <img key={story.id} src={story.media_url} alt="" className="w-full h-full object-contain" />
        )}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: 170, background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: 240, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)" }}
        />
      </div>

      {/* segmented progress */}
      <div className="relative flex gap-1 px-2.5 pt-3">
        {group.items.map((_, i) => (
          <div key={i} className="flex-1 rounded-full overflow-hidden" style={{ height: 2.5, background: "rgba(255,255,255,0.3)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: i < sIndex ? "100%" : i === sIndex ? `${pct}%` : "0%",
                background: "#FFFFFF",
                transition: i === sIndex ? "width 50ms linear" : "none",
              }}
            />
          </div>
        ))}
      </div>

      {/* header */}
      <div className="relative flex items-center gap-2.5 px-3.5 pt-3">
        <button
          onClick={() => {
            onClose();
            onOpenProfile?.(group.userId);
          }}
          className="flex items-center gap-2.5 min-w-0"
        >
          <Avatar username={group.username} avatarUrl={group.avatarUrl} size={34} />
          <span className="text-[13px] truncate" style={{ color: "#FFFFFF", fontWeight: 600 }}>
            {isOwner ? "Your story" : group.username}
          </span>
          <span className="text-[11px] shrink-0" style={{ color: "rgba(255,255,255,0.7)" }}>
            {timeAgo(story.created_at)}
          </span>
        </button>
        <div className="flex-1" />
        {story.comments_disabled && isOwner && (
          <span className="text-[10px] px-2 py-1 rounded-full shrink-0" style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}>
            Replies off
          </span>
        )}
        <button onClick={onClose} className="p-1 -mr-1 shrink-0 transition-transform active:scale-90">
          <X size={22} color="#FFFFFF" />
        </button>
      </div>

      {/* caption */}
      {story.caption && (
        <div className="absolute left-0 right-0 px-5 pointer-events-none" style={{ bottom: 92 }}>
          <p className="text-sm" style={{ color: "#FFFFFF", whiteSpace: "pre-wrap", lineHeight: 1.45 }}>
            {story.caption}
          </p>
        </div>
      )}

      {/* ---- bottom bar ---- */}
      <div className="absolute left-0 right-0 bottom-0 px-3.5 pb-5 pt-3">
        {isOwner ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSheet("replies")}
              className="flex items-center gap-4 rounded-full px-4 h-11 transition-transform active:scale-95"
              style={{ background: "rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "#FFFFFF", fontWeight: 600 }}>
                <Users size={15} /> {formatCount(meta.views)}
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "#FFFFFF", fontWeight: 600 }}>
                <Heart size={15} /> {formatCount(meta.likes)}
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "#FFFFFF", fontWeight: 600 }}>
                <MessageCircle size={15} style={{ transform: "scaleX(-1)" }} /> {formatCount(meta.replies)}
              </span>
            </button>

            <div className="flex-1" />

            {/* add another story */}
            <button
              onClick={() => {
                onClose();
                onAddStory?.();
              }}
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90"
              style={{ background: ACCENT }}
            >
              <Plus size={20} color="var(--on-accent)" strokeWidth={3} />
            </button>

            {/* options */}
            <button
              onClick={() => setSheet("options")}
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90"
              style={{ background: "rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <Ellipsis size={20} color="#FFFFFF" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            {canReply ? (
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onFocus={() => setReplyFocused(true)}
                onBlur={() => setReplyFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendReply();
                }}
                placeholder={`Reply to ${group.username}...`}
                maxLength={500}
                className="flex-1 rounded-full px-4 h-11 text-sm outline-none min-w-0"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.35)", color: "#FFFFFF" }}
              />
            ) : (
              <span className="flex-1 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                Replies are turned off
              </span>
            )}

            {canReply && replyText.trim() ? (
              <button
                onClick={sendReply}
                disabled={replySending}
                className="rounded-full px-4 h-11 text-xs shrink-0 transition-transform active:scale-95"
                style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: replySending ? 0.6 : 1 }}
              >
                {replySending ? "..." : "Send"}
              </button>
            ) : (
              <>
                <button onClick={toggleLike} className="p-1.5 shrink-0 transition-transform active:scale-90">
                  <Heart
                    size={26}
                    color={meta.liked ? "var(--heart)" : "#FFFFFF"}
                    fill={meta.liked ? "var(--heart)" : "none"}
                    strokeWidth={1.9}
                  />
                </button>
                <button onClick={() => setSheet("send")} className="p-1.5 shrink-0 transition-transform active:scale-90">
                  <ShareIcon size={25} color="#FFFFFF" strokeWidth={1.9} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {held && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
          <span
            className="px-3 py-1.5 rounded-full text-[11px]"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: "#FFFFFF", fontWeight: 600 }}
          >
            Paused
          </span>
        </div>
      )}

      {flash && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[72] pointer-events-none">
          <span
            className="px-4 py-2 rounded-full text-xs block"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", color: "#FFFFFF", fontWeight: 600, maxWidth: 300 }}
          >
            {flash}
          </span>
        </div>
      )}

      {/* ---- sheets ---- */}
      {sheet === "options" && (
        <StorySheetShell title="Story options" onClose={() => setSheet(null)}>
          <div className="pb-6">
            <StoryMenuRow
              icon={<Archive size={17} color="var(--text)" />}
              label={story.archived ? "Unarchive" : "Archive"}
              busy={busyAction === "archived"}
              onClick={() =>
                patchStory({ archived: !story.archived }, story.archived ? "Unarchived" : "Moved to archive")
              }
            />
            <StoryMenuRow
              icon={<ShareIcon size={17} color="var(--text)" />}
              label="Send"
              onClick={() => setSheet("send")}
            />
            <StoryMenuRow
              icon={<Star size={17} color="var(--text)" />}
              label="Highlight"
              onClick={() => setSheet("highlight")}
            />
            <StoryMenuRow
              icon={<Share2 size={17} color="var(--text)" />}
              label="Share"
              onClick={handleShare}
            />
            <StoryMenuRow
              icon={<MessageCircle size={17} color="var(--text)" style={{ transform: "scaleX(-1)" }} />}
              label={story.comments_disabled ? "Turn on comments" : "Turn off comments"}
              busy={busyAction === "comments_disabled"}
              onClick={() =>
                patchStory(
                  { comments_disabled: !story.comments_disabled },
                  story.comments_disabled ? "Replies turned on" : "Replies turned off"
                )
              }
              trailing={
                <span className="rounded-full shrink-0" style={{ width: 34, height: 19, background: story.comments_disabled ? "var(--toggle-off)" : ACCENT, position: "relative" }}>
                  <span className="rounded-full bg-white absolute" style={{ width: 15, height: 15, top: 2, left: story.comments_disabled ? 2 : 17, transition: "left 0.15s" }} />
                </span>
              }
            />
            <StoryMenuRow
              icon={<Settings size={17} color="var(--text)" />}
              label="Go to story settings"
              onClick={() => setSheet("settings")}
            />

            <div className="h-px my-1.5 mx-4" style={{ background: "var(--border)" }} />

            <StoryMenuRow
              icon={<Trash2 size={17} color="var(--heart)" />}
              label="Delete"
              danger
              busy={busyAction === "delete"}
              onClick={handleDelete}
            />
          </div>
        </StorySheetShell>
      )}

      {sheet === "send" && (
        <StorySendSheet story={story} currentUserId={currentUserId} onClose={() => setSheet(null)} />
      )}

      {sheet === "highlight" && (
        <StoryHighlightSheet
          story={story}
          currentUserId={currentUserId}
          onClose={() => setSheet(null)}
          onDone={() => showFlash("Added to highlight")}
        />
      )}

      {sheet === "settings" && <StorySettingsSheet onClose={() => setSheet(null)} />}

      {sheet === "replies" && isOwner && (
        <StoryRepliesSheet story={story} onClose={() => setSheet(null)} />
      )}
    </div>
  );
}

function TopBar({ title, showMessages, onMessagesClick, showNotifications, onNotificationsClick, unreadCount = 0, hasNotifications = false }) {
  return (
    <div className="relative flex items-center justify-center px-4 pt-4 pb-3">
      {showNotifications && (
        <button onClick={onNotificationsClick} className="absolute left-4 top-1/2 -translate-y-1/2">
          <Bell size={21} color="var(--text)" />
          {hasNotifications && (
            <span
              className="absolute -top-0.5 -right-0.5 rounded-full"
              style={{ width: 9, height: 9, background: "#FF3040", border: "1.5px solid var(--bg)" }}
            />
          )}
        </button>
      )}
      {title === "Loop" ? (
        <span
          style={{
            fontFamily: "'Cinzel Decorative', 'Sora', serif",
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: "0.5px",
            color: "var(--wordmark)",
            lineHeight: 1,
          }}
        >
          Loop
        </span>
      ) : (
        <h1
          className="text-xl tracking-tight"
          style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "var(--text)" }}
        >
          {title}
        </h1>
      )}
      {showMessages && (
        <button onClick={onMessagesClick} className="absolute right-4 top-1/2 -translate-y-1/2">
          <ChatsIcon size={24} color="var(--text)" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 rounded-full flex items-center justify-center text-[9px]"
              style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, minWidth: 16, height: 16, padding: "0 4px" }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

// Story ring + face are defined at module scope on purpose: nesting them
// inside StoriesBar would remount the <img> on every re-render and make
// avatars visibly flicker.
function StoryRing({ seen, children }) {
  return (
    <div
      className="rounded-full flex items-center justify-center"
      style={{
        width: 62,
        height: 62,
        background: seen
          ? "var(--toggle-off)"
          : "linear-gradient(135deg, var(--ring-start) 0%, var(--ring-end) 100%)",
        padding: 2.5,
      }}
    >
      <div
        className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
        style={{ background: "var(--surface)", border: "2.5px solid var(--bg)" }}
      >
        {children}
      </div>
    </div>
  );
}

function StoryFace({ username, avatarUrl }) {
  if (avatarUrl) return <img src={avatarUrl} alt="" className="w-full h-full object-cover" />;
  return (
    <span className="text-base" style={{ color: "var(--text)", fontWeight: 600 }}>
      {(username || "u")[0].toUpperCase()}
    </span>
  );
}

function StoriesBar({ onOpenProfile }) {
  const [groups, setGroups] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewerAt, setViewerAt] = useState(null); // index into groups, or null
  const [pickedFile, setPickedFile] = useState(null);
  const fileRef = React.useRef(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: myProfile } = await supabase
      .from("profiles")
      .select("id, username, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    setMe(myProfile || { id: user.id, username: "you", avatar_url: null });

    // RLS already hides expired stories; filtering here too keeps the bar
    // honest if one expires while the app is left open.
    const { data: rows, error } = await supabase
      .from("stories")
      .select("id, user_id, media_url, media_type, caption, created_at, archived, comments_disabled")
      .eq("archived", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: true });

    if (error || !rows) {
      setGroups([]);
      setLoading(false);
      return;
    }

    const userIds = [...new Set(rows.map((r) => r.user_id))];
    let profiles = [];
    if (userIds.length > 0) {
      const { data } = await supabase.from("profiles").select("id, username, avatar_url").in("id", userIds);
      profiles = data || [];
    }

    const { data: views } = await supabase.from("story_views").select("story_id").eq("viewer_id", user.id);
    const seen = new Set((views || []).map((v) => v.story_id));

    const byUser = new Map();
    for (const r of rows) {
      if (!byUser.has(r.user_id)) byUser.set(r.user_id, []);
      byUser.get(r.user_id).push(r);
    }

    const list = [...byUser.entries()].map(([uid, items]) => {
      const p = profiles.find((x) => x.id === uid);
      return {
        userId: uid,
        username: p?.username || "unknown",
        avatarUrl: p?.avatar_url || null,
        items,
        allSeen: items.every((st) => seen.has(st.id)),
        isSelf: uid === user.id,
      };
    });

    // You first, then anyone with something unwatched, then the rest.
    list.sort((a, b) => {
      if (a.isSelf !== b.isSelf) return a.isSelf ? -1 : 1;
      if (a.allSeen !== b.allSeen) return a.allSeen ? 1 : -1;
      return 0;
    });

    const rel = await getRelations();
    setGroups(list.filter((g) => g.isSelf || !isHiddenFromFeed(rel, g.userId)));
    setLoading(false);
  };

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) setPickedFile(f);
  };

  const myGroup = groups.find((g) => g.isSelf);
  const others = groups.filter((g) => !g.isSelf);

  return (
    <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <input ref={fileRef} type="file" accept="image/*,video/*" onChange={pickFile} className="hidden" />

      <div className="flex gap-4 px-4 pt-1 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {/* Your story — the ring opens yours, the + adds another */}
        <div className="flex flex-col items-center gap-1.5 shrink-0" style={{ width: 62 }}>
          <div className="relative">
            <button
              onClick={() => {
                if (myGroup) setViewerAt(groups.indexOf(myGroup));
                else fileRef.current?.click();
              }}
              className="block transition-transform active:scale-95"
            >
              {myGroup ? (
                <StoryRing seen={myGroup.allSeen}>
                  <StoryFace username={me?.username} avatarUrl={me?.avatar_url} />
                </StoryRing>
              ) : (
                <div
                  className="rounded-full flex items-center justify-center overflow-hidden"
                  style={{ width: 62, height: 62, background: "var(--surface)", border: "1.5px solid var(--border)" }}
                >
                  <StoryFace username={me?.username} avatarUrl={me?.avatar_url} />
                </div>
              )}
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center transition-transform active:scale-90"
              style={{ width: 19, height: 19, background: "var(--accent-solid)", border: "2px solid var(--bg)" }}
            >
              <Plus size={11} color="var(--on-accent)" strokeWidth={3.5} />
            </button>
          </div>
          <span className="text-[11px] truncate w-full text-center" style={{ color: "var(--text)" }}>
            Your story
          </span>
        </div>

        {loading
          ? Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 shrink-0" style={{ width: 62 }}>
                <div className="rounded-full" style={{ width: 62, height: 62, background: "var(--border-subtle)" }} />
                <div className="rounded-full" style={{ width: 40, height: 9, background: "var(--border-subtle)" }} />
              </div>
            ))
          : others.map((g) => (
              <button
                key={g.userId}
                onClick={() => setViewerAt(groups.indexOf(g))}
                className="flex flex-col items-center gap-1.5 shrink-0 transition-transform active:scale-95"
                style={{ width: 62 }}
              >
                <StoryRing seen={g.allSeen}>
                  <StoryFace username={g.username} avatarUrl={g.avatarUrl} />
                </StoryRing>
                <span className="text-[11px] truncate w-full text-center" style={{ color: "var(--text)" }}>
                  {g.username}
                </span>
              </button>
            ))}
      </div>

      {pickedFile && (
        <StoryComposer
          file={pickedFile}
          onCancel={() => setPickedFile(null)}
          onPublished={() => {
            setPickedFile(null);
            load();
          }}
        />
      )}

      {viewerAt !== null && groups[viewerAt] && (
        <StoryViewer
          groups={groups}
          startGroupIndex={viewerAt}
          currentUserId={me?.id}
          onOpenProfile={onOpenProfile}
          onClose={() => {
            setViewerAt(null);
            load(); // refresh the seen/unseen rings
          }}
          onChanged={load}
          onAddStory={() => fileRef.current?.click()}
        />
      )}
    </div>
  );
}

// Opens the story viewer for one person, or for one highlight, from any
// screen. Loads what it needs, then hands StoryViewer the same shape the
// stories bar gives it.
function StandaloneStoryViewer({ profileId, highlight, currentUserId, onClose, onOpenProfile }) {
  const [group, setGroup] = useState(undefined); // undefined = loading, null = nothing to show

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let rows = [];
      if (highlight) {
        const { data: links } = await supabase
          .from("story_highlight_items")
          .select("story_id")
          .eq("highlight_id", highlight.id);
        const ids = (links || []).map((l) => l.story_id);
        if (ids.length) {
          const { data } = await supabase
            .from("stories")
            .select("id, user_id, media_url, media_type, caption, created_at, archived, comments_disabled")
            .in("id", ids)
            .order("created_at", { ascending: true });
          rows = data || [];
        }
      } else {
        const { data } = await supabase
          .from("stories")
          .select("id, user_id, media_url, media_type, caption, created_at, archived, comments_disabled")
          .eq("user_id", profileId)
          .eq("archived", false)
          .gt("expires_at", new Date().toISOString())
          .order("created_at", { ascending: true });
        rows = data || [];
      }
      if (cancelled) return;
      if (rows.length === 0) {
        setGroup(null);
        return;
      }
      const ownerId = highlight ? highlight.user_id || rows[0].user_id : profileId;
      const { data: prof } = await supabase.from("profiles").select("id, username, avatar_url").eq("id", ownerId).maybeSingle();
      if (cancelled) return;
      setGroup({
        userId: ownerId,
        username: prof?.username || "unknown",
        avatarUrl: prof?.avatar_url || null,
        items: rows,
        allSeen: true,
        isSelf: ownerId === currentUserId,
        highlightTitle: highlight?.title || null,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [profileId, highlight?.id, currentUserId]);

  if (group === undefined) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center" style={{ background: "#000" }}>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Loading…</span>
      </div>
    );
  }
  if (group === null) {
    return (
      <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-3 px-8 text-center" style={{ background: "#000" }}>
        <p className="text-sm" style={{ color: "#FFFFFF", fontWeight: 600 }}>
          {highlight ? "This highlight is empty" : "No story to show"}
        </p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
          {highlight ? "Its stories were deleted. You can remove the highlight by holding it on the profile." : "Nothing here in the last 24 hours."}
        </p>
        <button onClick={onClose} className="mt-2 rounded-full px-5 h-10 text-sm" style={{ background: "rgba(255,255,255,0.16)", color: "#FFFFFF", fontWeight: 700 }}>
          Close
        </button>
      </div>
    );
  }
  return (
    <StoryViewer
      groups={[group]}
      startGroupIndex={0}
      currentUserId={currentUserId}
      onOpenProfile={onOpenProfile}
      onClose={onClose}
      onChanged={() => {}}
    />
  );
}

// ---- Carousel posts (multiple photos/videos in one post) ----
// Renders a swipeable strip. Deliberately has no double-tap-to-like of its
// own — the surrounding media box in every caller already carries that
// handler, and letting it bubble up here avoids firing the like twice.
function PostMediaCarousel({ media }) {
  const [index, setIndex] = useState(0);
  const trackRef = React.useRef(null);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="w-full h-full flex overflow-x-auto"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {media.map((m) => (
          <div key={m.id} className="w-full h-full shrink-0" style={{ scrollSnapAlign: "start" }}>
            {m.media_type === "photo" ? (
              <img src={m.media_url} alt="" className="w-full h-full object-cover" draggable={false} />
            ) : (
              <video src={m.media_url} className="w-full h-full object-cover" controls playsInline preload="metadata" />
            )}
          </div>
        ))}
      </div>

      {media.length > 1 && (
        <>
          <span
            className="absolute top-2.5 right-2.5 rounded-full px-2 py-0.5 text-[11px]"
            style={{ background: "rgba(0,0,0,0.55)", color: "#FFFFFF", fontWeight: 600 }}
          >
            {index + 1}/{media.length}
          </span>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
            {media.map((_, i) => (
              <span
                key={i}
                className="rounded-full"
                style={{
                  width: i === index ? 5 : 4,
                  height: i === index ? 5 : 4,
                  background: i === index ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// One query, shared by every screen that renders full posts (Feed,
// PostDetail, ProfileFeed). Returns a map of postId -> ordered media
// array, or {} for ids that have none (plain single-media posts).
// True totals for likes, comments, reposts and saves. Saves are private
// rows (each person only sees their own), so counting them in the app
// always gave 0 or 1 — the database counts them for us instead.
// Returns { [postId]: { likes, comments, reposts, saves } } or {} if the
// function isn't installed yet.
async function fetchPostCounts(postIds) {
  if (!postIds || postIds.length === 0) return {};
  const { data, error } = await supabase.rpc("post_counts", { p_ids: postIds });
  if (error || !data) return {};
  return Object.fromEntries(
    data.map((r) => [r.post_id, { likes: Number(r.likes), comments: Number(r.comments), reposts: Number(r.reposts), saves: Number(r.saves) }])
  );
}
// Overlay the true counts onto posts that already have their own guesses.
function applyCounts(post, c) {
  if (!c) return post;
  return { ...post, likeCount: c.likes, commentCount: c.comments, repostCount: c.reposts, saveCount: c.saves };
}

async function fetchPostMediaMap(postIds) {
  if (!postIds || postIds.length === 0) return {};
  const { data } = await supabase
    .from("post_media")
    .select("id, post_id, media_url, media_type, position")
    .in("post_id", postIds)
    .order("position", { ascending: true });
  const map = {};
  (data || []).forEach((row) => {
    if (!map[row.post_id]) map[row.post_id] = [];
    map[row.post_id].push(row);
  });
  return map;
}

// ---- Block / mute / restrict ----
// One fetch, shared by every screen, cached for the session. Lists change
// only from the profile menu or the people-list screens, and both of those
// call invalidateRelations() so the next read picks the change up.
let relationsPromise = null;

function invalidateRelations() {
  relationsPromise = null;
}

function getRelations() {
  if (!relationsPromise) {
    relationsPromise = (async () => {
      const empty = { blocked: new Set(), blockedBy: new Set(), muted: new Set(), restricted: new Set() };
      const { data, error } = await supabase.rpc("my_relations");
      // If safety-setup.sql hasn't been run yet, behave as if every list is
      // empty rather than breaking the feed.
      if (error || !data) return empty;
      data.forEach((r) => {
        if (r.kind === "blocked") empty.blocked.add(r.user_id);
        else if (r.kind === "blocked_by") empty.blockedBy.add(r.user_id);
        else if (r.kind === "muted") empty.muted.add(r.user_id);
        else if (r.kind === "restricted") empty.restricted.add(r.user_id);
      });
      return empty;
    })();
  }
  return relationsPromise;
}

// Blocked in either direction: gone everywhere.
const isBlockedEither = (rel, uid) => rel.blocked.has(uid) || rel.blockedBy.has(uid);
// Muted people are still followed, just kept out of feeds and stories.
const isHiddenFromFeed = (rel, uid) => isBlockedEither(rel, uid) || rel.muted.has(uid);

// Comments to leave out for this viewer on one post: anyone blocked either
// way, plus anyone the post owner restricted (unless you are that person or
// the owner — they still see them).
async function hiddenCommenterSet(postOwnerId) {
  const rel = await getRelations();
  const hidden = new Set([...rel.blocked, ...rel.blockedBy]);
  if (postOwnerId) {
    const { data } = await supabase.rpc("hidden_commenters", { p_owner: postOwnerId });
    (data || []).forEach((r) => hidden.add(r.user_id));
  }
  return hidden;
}

// Blue verified tick (given by the admin).
function VerifiedBadge({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0" aria-label="Verified">
      <path
        d="M12 1.8l2.4 1.9 3-.4 1.1 2.8 2.8 1.1-.4 3 1.9 2.4-1.9 2.4.4 3-2.8 1.1-1.1 2.8-3-.4L12 22.2l-2.4-1.9-3 .4-1.1-2.8-2.8-1.1.4-3L1.2 11.4l1.9-2.4-.4-3 2.8-1.1 1.1-2.8 3 .4z"
        fill="#3897F0"
      />
      <path d="M7.6 12.2l3 3 5.8-6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Accepted collaborators for a set of posts: { postId: [{ id, username }] }.
async function fetchCollabMap(postIds) {
  if (!postIds || postIds.length === 0) return {};
  const { data, error } = await supabase.from("post_collaborators").select("post_id, user_id").in("post_id", postIds).eq("status", "accepted");
  if (error || !data || data.length === 0) return {};
  const { data: profs } = await supabase.from("profiles").select("id, username").in("id", [...new Set(data.map((d) => d.user_id))]);
  const name = Object.fromEntries((profs || []).map((pp) => [pp.id, pp.username]));
  const map = {};
  data.forEach((d) => {
    (map[d.post_id] = map[d.post_id] || []).push({ id: d.user_id, username: name[d.user_id] || "unknown" });
  });
  return map;
}

// "owner and collaborator" header name.
function PostAuthorLine({ post, onOpenProfile, light = false, className = "text-[13px]" }) {
  const color = light ? "#FFFFFF" : "var(--text)";
  const collabs = post.collabs || [];
  return (
    <span className={`flex items-center gap-1 min-w-0 ${className}`} style={{ color, fontWeight: 600 }}>
      <button onClick={() => onOpenProfile?.(post.user_id)} className="truncate text-left">{post.username}</button>
      {post.verified && <VerifiedBadge size={13} />}
      {post.isFavorite && <Star size={12} color="#F5B800" fill="#F5B800" className="shrink-0" />}
      {collabs.length > 0 && (
        <>
          <span style={{ fontWeight: 400, opacity: 0.85 }}>and</span>
          {collabs.length === 1 ? (
            <button onClick={() => onOpenProfile?.(collabs[0].id)} className="truncate text-left">{collabs[0].username}</button>
          ) : (
            <span className="truncate">{collabs.length} others</span>
          )}
        </>
      )}
    </span>
  );
}

// The ⋯ sheet on a feed post.
function FeedPostMenu({ post, isOwn, onClose, onOptions, onDelete, onFeedback, onFavorite, onUnfollow, onAbout, onReport }) {
  return (
    <StorySheetShell title="" onClose={onClose}>
      <div className="pb-6">
        {isOwn ? (
          <>
            <StoryMenuRow icon={<Pencil size={17} color="var(--text)" />} label="Edit and post options" onClick={onOptions} />
            <StoryMenuRow icon={<Trash2 size={17} color="var(--heart)" />} label="Delete" danger onClick={onDelete} />
          </>
        ) : post.suggested ? (
          <>
            <StoryMenuRow icon={<Heart size={17} color="var(--text)" />} label="Interested" trailing={<span className="text-[11px]" style={{ color: "var(--text-muted)" }}>More like this</span>} onClick={() => onFeedback("interested")} />
            <StoryMenuRow icon={<X size={17} color="var(--text)" />} label="Not interested" trailing={<span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Hide this post</span>} onClick={() => onFeedback("not_interested")} />
            <StoryMenuRow icon={<Info size={17} color="var(--text)" />} label="About this account" onClick={onAbout} />
            <StoryMenuRow icon={<Flag size={17} color="var(--heart)" />} label="Report" danger onClick={onReport} />
          </>
        ) : (
          <>
            <StoryMenuRow
              icon={<Star size={17} color={post.isFavorite ? "#F5B800" : "var(--text)"} fill={post.isFavorite ? "#F5B800" : "none"} />}
              label={post.isFavorite ? "Remove from favourites" : "Add to favourites"}
              onClick={onFavorite}
            />
            <StoryMenuRow icon={<UserMinus size={17} color="var(--text)" />} label="Unfollow" onClick={onUnfollow} />
            <StoryMenuRow icon={<X size={17} color="var(--text)" />} label="Not interested" onClick={() => onFeedback("not_interested")} />
            <StoryMenuRow icon={<Info size={17} color="var(--text)" />} label="About this account" onClick={onAbout} />
            <StoryMenuRow icon={<Flag size={17} color="var(--heart)" />} label="Report" danger onClick={onReport} />
          </>
        )}
      </div>
    </StorySheetShell>
  );
}

// "About this account": when they joined and a few public numbers.
function AboutAccountSheet({ userId, onClose, onOpenProfile }) {
  const [info, setInfo] = useState(null);
  useEffect(() => {
    supabase.rpc("about_account", { p_user: userId }).then(({ data, error }) => setInfo(error ? { error: error.message } : (data || [])[0] || { error: "Not found" }));
  }, [userId]);
  return (
    <StorySheetShell title="About this account" onClose={onClose}>
      <div className="px-4 pb-6">
        {!info ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Loading…</p>
        ) : info.error ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>{info.error}</p>
        ) : (
          <>
            <button
              onClick={() => {
                onClose();
                onOpenProfile?.(userId);
              }}
              className="w-full flex flex-col items-center text-center pt-2 pb-4"
            >
              <Avatar username={info.username} avatarUrl={info.avatar_url} size={76} />
              <span className="flex items-center gap-1 mt-2 text-[16px]" style={{ color: "var(--text)", fontWeight: 700 }}>
                {info.username}
                {info.is_verified && <VerifiedBadge size={15} />}
              </span>
              {info.full_name && <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>{info.full_name}</span>}
              {info.category && <span className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>{info.category}</span>}
            </button>
            <p className="text-[12px] text-center mb-3" style={{ color: "var(--text-muted)" }}>
              To help keep Loop authentic, we show information about accounts.
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              {[
                [Clock, "Date joined", new Date(info.joined).toLocaleDateString(undefined, { month: "long", year: "numeric" })],
                [Layers, "Posts", formatCount(Number(info.posts))],
                [Users, "Followers", formatCount(Number(info.followers))],
                [UserCheck, "Following", formatCount(Number(info.following))],
                [Shield, "Verified", info.is_verified ? "Yes" : "No"],
              ].map(([Icon, label, value], i) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3" style={{ borderTop: i ? "1px solid var(--border)" : "none" }}>
                  <Icon size={18} color="var(--text)" />
                  <span className="flex-1 text-[14px]" style={{ color: "var(--text)" }}>{label}</span>
                  <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>{value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </StorySheetShell>
  );
}

// "Suggested for you" accounts on Home, ranked by how many people you follow
// already follow them — the same signal Instagram leads with.
function SuggestedAccountsStrip({ people, onOpenProfile, onFollow, onDismiss }) {
  if (!people || people.length === 0) return null;
  return (
    <div className="py-3 mb-1" style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
      <div className="flex items-center justify-between px-4 mb-2.5">
        <span className="text-sm" style={{ color: "var(--text)", fontWeight: 700 }}>Suggested for you</span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: "none" }}>
        {people.map((p) => (
          <div
            key={p.id}
            className="relative shrink-0 rounded-2xl flex flex-col items-center px-3 pt-4 pb-3"
            style={{ width: 150, background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <button onClick={() => onDismiss(p.id)} className="absolute top-2 right-2" aria-label="Remove suggestion">
              <X size={14} color="var(--text-muted)" />
            </button>
            <button onClick={() => onOpenProfile(p.id)} className="flex flex-col items-center w-full">
              <Avatar username={p.username} avatarUrl={p.avatar_url} size={74} />
              <span className="text-[13px] mt-2 truncate w-full text-center" style={{ color: "var(--text)", fontWeight: 600 }}>{p.username}</span>
              <span className="text-[11px] truncate w-full text-center" style={{ color: "var(--text-muted)", minHeight: 16 }}>
                {p.mutualName ? (p.mutualCount > 1 ? `Followed by ${p.mutualName} + ${p.mutualCount - 1}` : `Followed by ${p.mutualName}`) : p.followsYou ? "Follows you" : "Suggested for you"}
              </span>
            </button>
            <button
              onClick={() => onFollow(p)}
              className="w-full h-8 rounded-lg text-xs mt-2.5 transition-transform active:scale-95"
              style={
                p.followed
                  ? { background: "var(--bg-sunken)", color: "var(--text)", fontWeight: 700, border: "1px solid var(--border)" }
                  : { background: ACCENT, color: "var(--on-accent)", fontWeight: 700 }
              }
            >
              {p.followed ? (p.requested ? "Requested" : "Following") : p.followsYou ? "Follow back" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// "Suggested reels" row on Home; a tap opens Reels on that reel.
function SuggestedReelsStrip({ reels, onOpenReel }) {
  if (!reels || reels.length === 0) return null;
  return (
    <div className="py-3 mb-1" style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
      <div className="flex items-center gap-1.5 px-4 mb-2.5">
        <Clapperboard size={16} color="var(--text)" />
        <span className="text-sm" style={{ color: "var(--text)", fontWeight: 700 }}>Suggested reels</span>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: "none" }}>
        {reels.map((r) => (
          <button
            key={r.id}
            onClick={() => onOpenReel?.(r.id)}
            className="relative shrink-0 rounded-xl overflow-hidden"
            style={{ width: 128, aspectRatio: "9 / 16", background: "var(--bg-sunken)" }}
          >
            <video src={r.media_url + "#t=0.5"} className="w-full h-full object-cover" muted playsInline preload="metadata" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 45%)" }} />
            <div className="absolute left-2 right-2 bottom-2 flex flex-col items-start">
              <span className="flex items-center gap-1 text-[11px]" style={{ color: "#FFFFFF", fontWeight: 600 }}>
                <Play size={10} color="#FFFFFF" fill="#FFFFFF" /> {formatCount(r.views_count || 0)}
              </span>
              <span className="text-[11px] truncate w-full text-left" style={{ color: "#FFFFFF", fontWeight: 600 }}>{r.username}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Mute choice shared by every video on Home, so unmuting one keeps sound on
// as you scroll — the way Instagram's feed works.
let feedMutedPref = true;

// A video on Home: plays muted while on screen, pauses when scrolled away.
// One tap opens it in Reels (reels) or toggles play (plain videos);
// two taps like it. Mute sits in the corner.
function FeedVideo({ post, onOpenReel, onLike }) {
  const ref = React.useRef(null);
  const [muted, setMuted] = useState(feedMutedPref);
  const [burst, setBurst] = useState(0);
  const [paused, setPaused] = useState(false);

  React.useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          v.play().catch(() => {});
          setPaused(false);
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.6, 1] }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const onTap = useTapDetector(
    () => {
      if (post.media_type === "reel" && onOpenReel) {
        onOpenReel(post.id);
        return;
      }
      const v = ref.current;
      if (!v) return;
      if (v.paused) {
        v.play().catch(() => {});
        setPaused(false);
      } else {
        v.pause();
        setPaused(true);
      }
    },
    () => {
      setBurst(Date.now());
      onLike();
    }
  );

  return (
    <div className="relative w-full h-full" onClick={onTap}>
      <video ref={ref} src={post.media_url} poster={post.cover_url || undefined} className="w-full h-full object-cover" muted={muted} loop playsInline preload="metadata" />
      <HeartBurst burstKey={burst} size={84} />
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}>
            <Play size={26} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
          </div>
        </div>
      )}
      {post.media_type === "reel" && (
        <div className="absolute top-2.5 right-2.5 pointer-events-none" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
          <Clapperboard size={18} color="#FFFFFF" />
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          feedMutedPref = !muted;
          setMuted(!muted);
        }}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.55)" }}
      >
        {muted ? <VolumeX size={15} color="#fff" /> : <Volume2 size={15} color="#fff" />}
      </button>
    </div>
  );
}

// Photos on Home: two taps like (never un-like), with the heart pop.
function FeedPhotoTap({ onLike, children }) {
  const [burst, setBurst] = useState(0);
  const onTap = useTapDetector(null, () => {
    setBurst(Date.now());
    onLike();
  });
  return (
    <div className="relative w-full h-full" onClick={onTap}>
      {children}
      <HeartBurst burstKey={burst} size={84} />
    </div>
  );
}

function FeedScreen({ onOpenMessages, onOpenNotifications, onOpenComments, onOpenReport, onOpenProfile, onOpenReel }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [userId, setUserId] = useState(null);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [likesPopupFor, setLikesPopupFor] = useState(null);
  const [commentSheetFor, setCommentSheetFor] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [suggestedPeople, setSuggestedPeople] = useState([]);
  const [suggestedReels, setSuggestedReels] = useState([]);
  const followingCount = posts.filter((p) => !p.suggested).length; // posts from people you follow, at the top
  // Where the suggestion rows appear changes every time Home loads.
  const [slots, setSlots] = useState({ accounts: 2, reels: 7 });
  const [postMenuFor, setPostMenuFor] = useState(null);
  const [optionsFor, setOptionsFor] = useState(null);
  const [aboutFor, setAboutFor] = useState(null);
  const [feedToast, setFeedToast] = useState("");
  const flashFeed = (msg) => {
    setFeedToast(msg);
    setTimeout(() => setFeedToast(""), 2200);
  };
  const pressTimers = React.useRef({});
  const [countPrefs] = useCountPrefs();

  useEffect(() => {
    loadFeed();
    loadBadges();
  }, []);

  const loadBadges = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: unread } = await supabase.rpc("my_unread_count");
    setUnreadCount(unread || 0);
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    setHasNotifications((count || 0) > 0);
  };

  // ---- Loading, 10 posts at a time ----
  // First everyone you follow (and you), newest first; when that runs out,
  // "Suggested for you" posts from everyone else. Each page fetches only the
  // likes, comments, saves and names for its own 10 posts, so Home stays
  // quick however big Loop gets.
  const FEED_PAGE = 10;
  const feedRef = React.useRef({ me: null, followIds: [], phase: "following", cursor: null, busy: false, done: false });
  const [loadingMore, setLoadingMore] = useState(false);
  const [followingDone, setFollowingDone] = useState(false);
  const sentinelRef = React.useRef(null);

  const enrichPosts = async (rows, meId) => {
    if (rows.length === 0) return [];
    const ids = rows.map((p) => p.id);
    const [counts, mediaMap, { data: likesData }, { data: repostsData }, { data: savesData }, { data: commentsData }, { data: tagsData }] = await Promise.all([
      fetchPostCounts(ids),
      fetchPostMediaMap(ids),
      supabase.from("likes").select("post_id, user_id").in("post_id", ids),
      supabase.from("reposts").select("post_id, user_id").in("post_id", ids),
      supabase.from("saves").select("post_id, user_id").in("post_id", ids),
      supabase.from("comments").select("post_id").in("post_id", ids),
      supabase.from("post_tags").select("post_id, tagged_user_id").in("post_id", ids),
    ]);
    const followSet = new Set(feedRef.current.followIds || []);
    // For "Liked by …": someone you follow if possible, otherwise anyone.
    const likerFor = {};
    rows.forEach((p) => {
      const ls = (likesData || []).filter((l) => l.post_id === p.id && l.user_id !== meId);
      const pick = ls.find((l) => followSet.has(l.user_id)) || ls[0];
      if (pick) likerFor[p.id] = pick.user_id;
    });
    const peopleIds = [...new Set([...rows.map((p) => p.user_id), ...(tagsData || []).map((t) => t.tagged_user_id), ...Object.values(likerFor)])];
    const [{ data: profilesData }, collabMap, favs] = await Promise.all([
      supabase.from("profiles").select("id, username, avatar_url, is_verified").in("id", peopleIds),
      fetchCollabMap(ids),
      getFavorites(),
    ]);
    const prof = Object.fromEntries((profilesData || []).map((p) => [p.id, p]));
    const count = (list, id) => (list || []).filter((x) => x.post_id === id);
    return rows.map((p) => {
      const postLikes = count(likesData, p.id);
      const postReposts = count(repostsData, p.id);
      const postSaves = count(savesData, p.id);
      return {
        ...p,
        username: prof[p.user_id]?.username || "unknown",
        avatarUrl: prof[p.user_id]?.avatar_url || null,
        likeCount: postLikes.length,
        liked: postLikes.some((l) => l.user_id === meId),
        repostCount: postReposts.length,
        reposted: postReposts.some((x) => x.user_id === meId),
        saved: postSaves.some((x) => x.user_id === meId),
        saveCount: postSaves.length,
        commentCount: count(commentsData, p.id).length,
        tags: count(tagsData, p.id).map((t) => ({ tagged_user_id: t.tagged_user_id, username: prof[t.tagged_user_id]?.username || "unknown" })),
        media: mediaMap[p.id] || null,
        verified: !!prof[p.user_id]?.is_verified,
        collabs: collabMap[p.id] || [],
        isFavorite: favs.has(p.user_id),
        iFollow: followSet.has(p.user_id),
        likedBy: likerFor[p.id] ? { id: likerFor[p.id], username: prof[likerFor[p.id]]?.username } : null,
      };
    }).map((p) => applyCounts(p, counts[p.id]));
  };

  const loadPage = async () => {
    const st = feedRef.current;
    if (st.busy || st.done) return;
    st.busy = true;
    setLoadingMore(true);
    try {
      const rel = await getRelations();
      let gathered = [];
      // Loop so a short "following" page is topped up with suggestions.
      while (gathered.length < FEED_PAGE && !st.done) {
        let q = supabase
          .from("posts")
          .select("id, media_url, media_type, media_count, caption, created_at, user_id, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, views_count, location, aspect_ratio, link_url, cover_url")
          .eq("archived", false)
          .is("removed_at", null)
          .lte("created_at", new Date().toISOString()) // your own scheduled posts wait
          .order("created_at", { ascending: false })
          .limit(FEED_PAGE);
        q = st.phase === "following" ? q.in("user_id", st.followIds) : q.not("user_id", "in", `(${st.followIds.join(",")})`);
        if (st.cursor) q = q.lt("created_at", st.cursor);
        const { data: rows, error } = await q;
        if (error) throw error;
        const batch = rows || [];
        if (batch.length > 0) st.cursor = batch[batch.length - 1].created_at;
        const visible = batch
          .filter((p) => !isHiddenFromFeed(rel, p.user_id) && !(st.hiddenPosts && st.hiddenPosts.has(p.id)))
          .map((p) => ({ ...p, suggested: st.phase === "suggested" }));
        gathered = gathered.concat(visible);
        if (batch.length < FEED_PAGE) {
          if (st.phase === "following") {
            st.phase = "suggested";
            st.cursor = null;
            setFollowingDone(true);
          } else {
            st.done = true;
          }
        }
      }
      const enriched = await enrichPosts(gathered, st.me);
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return prev.concat(enriched.filter((p) => !seen.has(p.id)));
      });
    } catch (e) {
      setLoadError(e.message || "Couldn't load posts");
      st.done = true;
    }
    st.busy = false;
    setLoadingMore(false);
  };

  const loadFeed = async () => {
    setLoading(true);
    setLoadError("");
    setPosts([]);
    setFollowingDone(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    const { data: myFollows } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user?.id ?? "");
    const followingIds = new Set((myFollows || []).map((f) => f.following_id));
    feedRef.current = {
      me: user?.id ?? null,
      followIds: [user?.id, ...followingIds].filter(Boolean),
      phase: "following",
      cursor: null,
      busy: false,
      done: false,
    };
    if (feedRef.current.followIds.length === 0) feedRef.current.followIds = ["00000000-0000-0000-0000-000000000000"];
    const { data: notInterested } = await supabase
      .from("post_feedback")
      .select("post_id")
      .eq("user_id", user?.id ?? "")
      .eq("kind", "not_interested");
    feedRef.current.hiddenPosts = new Set((notInterested || []).map((f) => f.post_id));
    const a = 1 + Math.floor(Math.random() * 4); // after post 2–5
    setSlots({ accounts: a, reels: a + 3 + Math.floor(Math.random() * 4) });

    await loadPage();
    setLoading(false);

    const rel = await getRelations();
    loadSuggestedReels(feedRef.current.followIds, rel);
    loadSuggestedPeople(user?.id, followingIds, rel);
  };

  // Next 10 when you get near the bottom.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadPage();
      },
      { rootMargin: "800px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loading, posts.length > 0]);

  // Suggested reels: most-viewed reels from accounts you don't follow.
  const loadSuggestedReels = async (followIds, rel) => {
    const { data } = await supabase
      .from("posts")
      .select("id, media_url, user_id, views_count, created_at")
      .eq("media_type", "reel")
      .eq("archived", false)
      .is("removed_at", null)
      .lte("created_at", new Date().toISOString())
      .not("user_id", "in", `(${followIds.join(",")})`)
      .order("views_count", { ascending: false })
      .limit(14);
    const reels = (data || []).filter((r) => !isHiddenFromFeed(rel, r.user_id)).slice(0, 10);
    if (reels.length === 0) {
      setSuggestedReels([]);
      return;
    }
    const { data: profs } = await supabase.from("profiles").select("id, username").in("id", [...new Set(reels.map((r) => r.user_id))]);
    const name = Object.fromEntries((profs || []).map((p) => [p.id, p.username]));
    setSuggestedReels(reels.map((r) => ({ ...r, username: name[r.user_id] || "unknown" })));
  };

  const loadSuggestedPeople = async (meId, followingIds, rel) => {
    if (!meId) return;
    let dismissed = [];
    try {
      dismissed = JSON.parse(localStorage.getItem("loop_dismissed_suggestions") || "[]");
    } catch (e) {
      dismissed = [];
    }
    const skip = new Set([meId, ...followingIds, ...dismissed]);
    const ids = [...followingIds];
    const [{ data: theirFollows }, { data: followsMe }] = await Promise.all([
      ids.length
        ? supabase.from("follows").select("follower_id, following_id").in("follower_id", ids.slice(0, 200))
        : Promise.resolve({ data: [] }),
      supabase.from("follows").select("follower_id").eq("following_id", meId),
    ]);
    const followsMeSet = new Set((followsMe || []).map((f) => f.follower_id));
    const tally = {};
    (theirFollows || []).forEach((f) => {
      if (skip.has(f.following_id)) return;
      const t = (tally[f.following_id] = tally[f.following_id] || { count: 0, via: f.follower_id });
      t.count += 1;
    });
    followsMeSet.forEach((id) => {
      if (!skip.has(id) && !tally[id]) tally[id] = { count: 0, via: null };
    });
    let ranked = Object.entries(tally)
      .map(([id, t]) => ({ id, ...t }))
      .filter((t) => !isBlockedEither(rel, t.id))
      .sort((a, b) => b.count - a.count || Number(followsMeSet.has(b.id)) - Number(followsMeSet.has(a.id)))
      .slice(0, 15);
    // New accounts with no network yet: fill with other people on Loop.
    if (ranked.length < 6) {
      const { data: others } = await supabase.from("profiles").select("id").limit(40);
      (others || [])
        .filter((p) => !skip.has(p.id) && !tally[p.id] && !isBlockedEither(rel, p.id))
        .slice(0, 12 - ranked.length)
        .forEach((p) => ranked.push({ id: p.id, count: 0, via: null }));
    }
    const needIds = [...new Set([...ranked.map((t) => t.id), ...ranked.map((t) => t.via).filter(Boolean)])];
    if (needIds.length === 0) {
      setSuggestedPeople([]);
      return;
    }
    const { data: profs } = await supabase.from("profiles").select("id, username, avatar_url").in("id", needIds);
    const byId = Object.fromEntries((profs || []).map((p) => [p.id, p]));
    // Keep the strongest matches near the front but mix the order each time.
    ranked = ranked
      .map((t, i) => ({ t, k: i + Math.random() * 5 }))
      .sort((x, y) => x.k - y.k)
      .map((x) => x.t);
    setSuggestedPeople(
      ranked
        .filter((t) => byId[t.id])
        .map((t) => ({
          ...byId[t.id],
          mutualCount: t.count,
          mutualName: t.count > 0 ? byId[t.via]?.username : null,
          followsYou: followsMeSet.has(t.id),
          followed: false,
        }))
    );
  };

  const followSuggested = async (p) => {
    if (!userId) return;
    if (p.followed) {
      setSuggestedPeople((prev) => prev.map((x) => (x.id === p.id ? { ...x, followed: false, requested: false } : x)));
      await supabase.from("follows").delete().eq("follower_id", userId).eq("following_id", p.id);
      return;
    }
    setSuggestedPeople((prev) => prev.map((x) => (x.id === p.id ? { ...x, followed: true } : x)));
    const { error } = await supabase.from("follows").insert({ follower_id: userId, following_id: p.id });
    if (error) {
      setSuggestedPeople((prev) => prev.map((x) => (x.id === p.id ? { ...x, followed: false } : x)));
      return;
    }
    await supabase.from("notifications").insert({ user_id: p.id, actor_id: userId, type: "follow" });
  };

  const dismissSuggested = (id) => {
    setSuggestedPeople((prev) => prev.filter((x) => x.id !== id));
    try {
      const list = JSON.parse(localStorage.getItem("loop_dismissed_suggestions") || "[]");
      localStorage.setItem("loop_dismissed_suggestions", JSON.stringify([...new Set([...list, id])].slice(-200)));
    } catch (e) {
      // fine — it just comes back next time
    }
  };

  const toggleLike = async (post) => {
    if (!userId) return;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 }
          : p
      )
    );

    if (post.liked) {
      await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", userId);
    } else {
      await supabase.from("likes").insert({ post_id: post.id, user_id: userId });
      if (post.user_id !== userId) {
        await supabase.from("notifications").insert({
          user_id: post.user_id,
          actor_id: userId,
          type: "like",
          post_id: post.id,
        });
      }
    }
  };

  const [sharePost, setSharePost] = useState(null);
  const [collectionPost, setCollectionPost] = useState(null);
  const [saveError, setSaveError] = useState("");
  const savePressRef = React.useRef(null);
  const longPressedRef = React.useRef(false);

  const toggleSave = async (post) => {
    if (!userId) return;

    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, saved: !p.saved, saveCount: Math.max(0, (p.saveCount || 0) + (p.saved ? -1 : 1)) } : p))
    );

    const { error } = post.saved
      ? await supabase.from("saves").delete().eq("post_id", post.id).eq("user_id", userId)
      : await supabase.from("saves").insert({ post_id: post.id, user_id: userId });

    if (error) {
      // Put the icon back where it was — a bookmark that looks saved but
      // isn't is worse than an honest failure.
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, saved: post.saved, saveCount: post.saveCount } : p)));
      setSaveError(error.message);
      setTimeout(() => setSaveError(""), 4000);
    }
  };

  const toggleRepost = async (post) => {
    if (!userId) return;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, reposted: !p.reposted, repostCount: p.reposted ? p.repostCount - 1 : p.repostCount + 1 }
          : p
      )
    );

    if (post.reposted) {
      await supabase.from("reposts").delete().eq("post_id", post.id).eq("user_id", userId);
    } else {
      await supabase.from("reposts").insert({ post_id: post.id, user_id: userId });
    }
  };

  const sendFeedback = async (post, kind) => {
    setPostMenuFor(null);
    if (!userId) return;
    await supabase.from("post_feedback").upsert({ user_id: userId, post_id: post.id, kind }, { onConflict: "user_id,post_id" });
    if (kind === "not_interested") {
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      flashFeed("Post hidden. You'll see fewer posts like this.");
    } else {
      flashFeed("Thanks — you'll see more posts like this.");
    }
  };

  const toggleFavorite = async (post) => {
    setPostMenuFor(null);
    if (!userId) return;
    const on = !post.isFavorite;
    setPosts((prev) => prev.map((p) => (p.user_id === post.user_id ? { ...p, isFavorite: on } : p)));
    const { error } = on
      ? await supabase.from("favorites").insert({ user_id: userId, target_id: post.user_id })
      : await supabase.from("favorites").delete().eq("user_id", userId).eq("target_id", post.user_id);
    invalidateFavorites();
    if (error) {
      setPosts((prev) => prev.map((p) => (p.user_id === post.user_id ? { ...p, isFavorite: !on } : p)));
      flashFeed(error.message);
      return;
    }
    flashFeed(on ? `Added ${post.username} to favourites` : `Removed ${post.username} from favourites`);
  };

  const toggleFollowAuthor = async (post) => {
    if (!userId) return;
    const was = !!post.iFollow;
    setPosts((prev) => prev.map((p) => (p.user_id === post.user_id ? { ...p, iFollow: !was } : p)));
    if (was) {
      await supabase.from("follows").delete().eq("follower_id", userId).eq("following_id", post.user_id);
      feedRef.current.followIds = (feedRef.current.followIds || []).filter((id) => id !== post.user_id);
      flashFeed(`Unfollowed ${post.username}`);
      return;
    }
    const { error } = await supabase.from("follows").insert({ follower_id: userId, following_id: post.user_id });
    if (error) {
      setPosts((prev) => prev.map((p) => (p.user_id === post.user_id ? { ...p, iFollow: was } : p)));
      flashFeed(error.message);
      return;
    }
    feedRef.current.followIds = [...(feedRef.current.followIds || []), post.user_id];
    await supabase.from("notifications").insert({ user_id: post.user_id, actor_id: userId, type: "follow" });
    flashFeed(`Following ${post.username}`);
  };

  const unfollowFromPost = async (post) => {
    setPostMenuFor(null);
    if (!userId) return;
    await supabase.from("follows").delete().eq("follower_id", userId).eq("following_id", post.user_id);
    feedRef.current.followIds = (feedRef.current.followIds || []).filter((id) => id !== post.user_id);
    flashFeed(`Unfollowed ${post.username}`);
  };

  const deletePost = async (post) => {
    if (post.user_id !== userId) return;
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setMenuOpenFor(null);
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    await supabase.from("posts").delete().eq("id", post.id);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <TopBar
        title="Loop"
        showMessages
        onMessagesClick={onOpenMessages}
        showNotifications
        onNotificationsClick={onOpenNotifications}
        unreadCount={unreadCount}
        hasNotifications={hasNotifications}
      />
      <StoriesBar onOpenProfile={onOpenProfile} />

      {saveError && (
        <div className="mx-4 mb-2 rounded-xl px-3 py-2" style={{ background: "var(--bg-sunken)", border: "1px solid var(--heart)" }}>
          <p className="text-[11px]" style={{ color: "var(--heart)", fontWeight: 600 }}>Couldn't save that post</p>
          <p className="text-[11px]" style={{ color: "var(--text-muted)", wordBreak: "break-word" }}>{saveError}</p>
        </div>
      )}

      {loading ? (
        <p className="text-center text-xs py-10" style={{ color: "var(--text-muted)" }}>
          Loading...
        </p>
      ) : loadError ? (
        <p className="text-center text-xs py-10 px-6" style={{ color: "var(--accent-start)" }}>
          {loadError}
        </p>
      ) : posts.length === 0 ? (
        <>
          <SuggestedAccountsStrip people={suggestedPeople} onOpenProfile={onOpenProfile} onFollow={followSuggested} onDismiss={dismissSuggested} />
          <p className="text-center text-xs py-10" style={{ color: "var(--text-muted)" }}>
            No posts yet — be the first to post!
          </p>
        </>
      ) : (
        posts.map((post, postIndex) => (
          <React.Fragment key={post.id}>
          {/* suggestion rows land in a different place each visit */}
          {postIndex === slots.accounts && (
            <SuggestedAccountsStrip people={suggestedPeople} onOpenProfile={onOpenProfile} onFollow={followSuggested} onDismiss={dismissSuggested} />
          )}
          {postIndex === followingCount && followingCount > 0 && followingDone && (
            <div className="flex flex-col items-center py-6 px-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2" style={{ background: ACCENT }}>
                <Check size={28} color="var(--on-accent)" strokeWidth={2.4} />
              </div>
              <p className="text-sm" style={{ color: "var(--text)", fontWeight: 700 }}>You're all caught up</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>You've seen all new posts from accounts you follow.</p>
            </div>
          )}
          {postIndex === slots.reels && <SuggestedReelsStrip reels={suggestedReels} onOpenReel={onOpenReel} />}
          <div className="mb-1">
            <div className="flex items-center gap-2.5 px-4 py-2.5">
              <button onClick={() => onOpenProfile(post.user_id)} className="shrink-0">
                <Avatar username={post.username} avatarUrl={post.avatarUrl} size={36} />
              </button>
              <div className="flex flex-col leading-tight flex-1 min-w-0">
                <PostAuthorLine post={post} onOpenProfile={onOpenProfile} />
                {post.suggested && (
                  <span className="text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>Suggested for you</span>
                )}
                {post.location && (
                  <span className="flex items-center gap-0.5 text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>
                    <MapPin size={9} /> {post.location}
                  </span>
                )}
              </div>

              {post.suggested && post.user_id !== userId && (
                <button
                  onClick={() => toggleFollowAuthor(post)}
                  className="rounded-lg px-3.5 h-8 text-[13px] shrink-0 transition-transform active:scale-95"
                  style={
                    post.iFollow
                      ? { background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", fontWeight: 700 }
                      : { background: ACCENT, color: "var(--on-accent)", fontWeight: 700 }
                  }
                >
                  {post.iFollow ? "Following" : "Follow"}
                </button>
              )}
              <button onClick={() => setPostMenuFor(post)} className="p-1 -mr-1" aria-label="More">
                <Ellipsis size={19} color="var(--text)" />
              </button>
            </div>

            <div
              className="relative w-full overflow-hidden flex items-center justify-center"
              style={{ background: "var(--bg-sunken)", aspectRatio: postAspectCss(post) }}
            >
              {post.media && post.media.length > 1 ? (
                <FeedPhotoTap onLike={() => !post.liked && toggleLike(post)}>
                  <PostMediaCarousel media={post.media} />
                </FeedPhotoTap>
              ) : isPhotoPost(post) ? (
                <FeedPhotoTap onLike={() => !post.liked && toggleLike(post)}>
                  <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                </FeedPhotoTap>
              ) : (
                <FeedVideo post={post.media_type === "photo" ? { ...post, media_type: "video" } : post} onOpenReel={onOpenReel} onLike={() => !post.liked && toggleLike(post)} />
              )}
              <MediaTagOverlay tags={post.tags} isVideo={!isPhotoPost(post)} onOpenProfile={onOpenProfile} />
            </div>

            <PollBlock postId={post.id} currentUserId={userId} />

            <div className="flex items-center justify-between px-4 pt-2.5">
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
                  <button
                    onClick={() => setSharePost(post)}
                    className="h-7 flex items-center justify-center transition-transform active:scale-90"
                  >
                    <ShareIcon size={23} color="var(--text)" strokeWidth={1.9} />
                  </button>
                  <span className="text-[11px] leading-none h-3 mt-1">&nbsp;</span>
                </div>
                <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
                  <button
                    onClick={() => {
                      // A long press already opened the collection sheet; the
                      // click that follows lifting the finger must not also
                      // toggle the save.
                      if (longPressedRef.current) {
                        longPressedRef.current = false;
                        return;
                      }
                      toggleSave(post);
                    }}
                    onTouchStart={() => {
                      longPressedRef.current = false;
                      savePressRef.current = setTimeout(() => {
                        longPressedRef.current = true;
                        setCollectionPost(post);
                      }, 500);
                    }}
                    onTouchEnd={() => clearTimeout(savePressRef.current)}
                    onTouchMove={() => clearTimeout(savePressRef.current)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      longPressedRef.current = true;
                      setCollectionPost(post);
                    }}
                    className="h-7 flex items-center justify-center transition-transform active:scale-90"
                  >
                    <Bookmark size={23} color="var(--text)" fill={post.saved ? "var(--text)" : "none"} strokeWidth={1.9} />
                  </button>
                  <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                    {countPrefs.saves && !post.hide_saves && post.saveCount > 0 ? formatCount(post.saveCount) : "\u00A0"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center" style={{ minWidth: 34 }}>
                <button
                  onClick={() => toggleLike(post)}
                  onTouchStart={() => {
                    pressTimers.current[post.id] = setTimeout(() => setLikesPopupFor(post.id), 500);
                  }}
                  onTouchEnd={() => clearTimeout(pressTimers.current[post.id])}
                  onTouchMove={() => clearTimeout(pressTimers.current[post.id])}
                  className="h-8 flex items-center justify-center transition-transform active:scale-90"
                >
                  <Heart size={31} color={post.liked ? "var(--heart)" : "var(--text)"} fill={post.liked ? "var(--heart)" : "none"} strokeWidth={1.9} />
                </button>
                <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                  {countPrefs.likes && !post.hide_likes && post.likeCount > 0 ? formatCount(post.likeCount) : "\u00A0"}
                </span>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
                  <button
                    onClick={() => !post.comments_disabled && setCommentSheetFor(post)}
                    disabled={post.comments_disabled}
                    className="h-7 flex items-center justify-center"
                  >
                    <MessageCircle size={23} color={post.comments_disabled ? "var(--toggle-off)" : "var(--text)"} strokeWidth={1.9} style={{ transform: "scaleX(-1)" }} />
                  </button>
                  <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                    {countPrefs.comments && !post.hide_comments && post.commentCount > 0 ? formatCount(post.commentCount) : "\u00A0"}
                  </span>
                </div>
                <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
                  <button onClick={() => toggleRepost(post)} className="h-7 flex items-center justify-center">
                    <RepostIcon size={25} color={post.reposted ? "var(--accent-solid)" : "var(--text)"} active={post.reposted} />
                  </button>
                  <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                    {countPrefs.reposts && !post.hide_reposts && post.repostCount > 0 ? formatCount(post.repostCount) : "\u00A0"}
                  </span>
                </div>
              </div>
            </div>

            {likesPopupFor === post.id && (
              <LikesViewsPopup post={post} isOwner={post.user_id === userId} onClose={() => setLikesPopupFor(null)} onOpenProfile={onOpenProfile} />
            )}

            <div className="px-4 pt-1.5">
              {post.likedBy?.username && (
                <p className="text-[13px] mb-1" style={{ color: "var(--text)" }}>
                  Liked by{" "}
                  <button onClick={() => onOpenProfile(post.likedBy.id)} style={{ fontWeight: 700 }}>
                    {post.likedBy.username}
                  </button>
                  {post.likeCount > 1 && (
                    <>
                      {" "}and{" "}
                      <button onClick={() => setLikesPopupFor(post.id)} style={{ fontWeight: 700 }}>
                        others
                      </button>
                    </>
                  )}
                </p>
              )}
              <CaptionText
                username={post.username}
                caption={post.caption}
                onOpenProfile={() => onOpenProfile?.(post.user_id)}
                onMention={(n) => openProfileByUsername(n, onOpenProfile)}
              />
              <PostLinkChip url={post.link_url} />
              {!post.comments_disabled && !post.hide_comments && post.commentCount > 1 && (
                <button
                  onClick={() => setCommentSheetFor(post)}
                  className="text-[13px] mt-1 block"
                  style={{ color: "var(--text-muted)" }}
                >
                  View all {formatCount(post.commentCount)} comments
                </button>
              )}
              <span className="text-[10px] mt-1.5 block uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.3px" }}>
                {timeAgo(post.created_at)} ago
              </span>
            </div>

            <div className="h-px mx-4 mt-3" style={{ background: "var(--border-subtle)" }} />
          </div>
          </React.Fragment>
        ))
      )}
      {!loading && posts.length > 0 && posts.length <= slots.accounts && feedRef.current.done && (
        <SuggestedAccountsStrip people={suggestedPeople} onOpenProfile={onOpenProfile} onFollow={followSuggested} onDismiss={dismissSuggested} />
      )}
      {!loading && posts.length > 0 && posts.length <= slots.reels && !loadingMore && feedRef.current.done && (
        <SuggestedReelsStrip reels={suggestedReels} onOpenReel={onOpenReel} />
      )}
      {!loading && posts.length > 0 && (
        <div ref={sentinelRef} className="flex justify-center py-6">
          {loadingMore ? (
            <div className="w-6 h-6 rounded-full animate-spin" style={{ border: "2px solid var(--border)", borderTopColor: "var(--text)" }} />
          ) : feedRef.current.done ? (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>You've seen everything for now</span>
          ) : null}
        </div>
      )}

      {postMenuFor && (
        <FeedPostMenu
          post={postMenuFor}
          isOwn={postMenuFor.user_id === userId}
          onClose={() => setPostMenuFor(null)}
          onOptions={() => {
            setOptionsFor(postMenuFor);
            setPostMenuFor(null);
          }}
          onDelete={() => {
            const target = postMenuFor;
            setPostMenuFor(null);
            deletePost(target);
          }}
          onFeedback={(kind) => sendFeedback(postMenuFor, kind)}
          onFavorite={() => toggleFavorite(postMenuFor)}
          onUnfollow={() => unfollowFromPost(postMenuFor)}
          onAbout={() => {
            setAboutFor(postMenuFor.user_id);
            setPostMenuFor(null);
          }}
          onReport={() => {
            const id = postMenuFor.id;
            setPostMenuFor(null);
            onOpenReport(id);
          }}
        />
      )}
      {optionsFor && (
        <PostOptionsSheet
          post={optionsFor}
          onClose={() => setOptionsFor(null)}
          onSaved={(patch) => {
            setPosts((prev) => prev.map((p) => (p.id === optionsFor.id ? { ...p, ...patch } : p)));
            setOptionsFor((prev) => (prev ? { ...prev, ...patch } : prev));
          }}
          onDeleted={() => {
            setPosts((prev) => prev.filter((p) => p.id !== optionsFor.id));
            setOptionsFor(null);
          }}
        />
      )}
      {aboutFor && <AboutAccountSheet userId={aboutFor} onClose={() => setAboutFor(null)} onOpenProfile={onOpenProfile} />}
      {feedToast && (
        <div
          className="fixed left-1/2 bottom-24 -translate-x-1/2 z-[80] rounded-full px-4 py-2.5 text-xs"
          style={{ background: "var(--text)", color: "var(--bg)", fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}
        >
          {feedToast}
        </div>
      )}

      {commentSheetFor && (
        <ReelCommentsSheet
          postId={commentSheetFor.id}
          postOwnerId={commentSheetFor.user_id}
          currentUserId={userId}
          postUsername={commentSheetFor.username}
          postCaption={commentSheetFor.caption}
          postAvatar={commentSheetFor.avatarUrl}
          postCreatedAt={commentSheetFor.created_at}
          postLink={commentSheetFor.link_url}
          postTags={commentSheetFor.tags}
          commentsDisabled={commentSheetFor.comments_disabled}
          onOpenProfile={onOpenProfile}
          onClose={() => setCommentSheetFor(null)}
          onCommentPosted={() => {
            const id = commentSheetFor.id;
            setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, commentCount: p.commentCount + 1 } : p)));
          }}
        />
      )}

      {sharePost && (
        <ShareSheet item={sharePost} currentUserId={userId} onClose={() => setSharePost(null)} />
      )}

      {collectionPost && (
        <AddToCollectionSheet
          postIds={[collectionPost.id]}
          currentUserId={userId}
          onClose={() => setCollectionPost(null)}
          onDone={() => {
            // Filing a post into a collection should also save it, so it
            // still shows under "All posts" — but only if it isn't already.
            const current = posts.find((p) => p.id === collectionPost.id);
            if (current && !current.saved) toggleSave(current);
            setCollectionPost(null);
          }}
        />
      )}
    </div>
  );
}

// Tells one tap from two. Single taps wait a moment in case a second tap
// follows; a double tap cancels the pending single.
function useTapDetector(onSingle, onDouble, delay = 260) {
  const timer = React.useRef(null);
  const last = React.useRef(0);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  return React.useCallback(
    (e) => {
      const now = Date.now();
      if (now - last.current < delay) {
        clearTimeout(timer.current);
        last.current = 0;
        onDouble?.(e);
      } else {
        last.current = now;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => onSingle?.(e), delay);
      }
    },
    [onSingle, onDouble, delay]
  );
}

// The big heart that pops up on a double-tap like.
function HeartBurst({ burstKey, size = 96 }) {
  if (!burstKey) return null;
  return (
    <div key={burstKey} className="loop-heart-burst">
      <Heart size={size} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
    </div>
  );
}

const REEL_RAIL_PIN_KEY = "loop_reel_rail_pinned";
const readRailPinned = () => {
  try {
    return localStorage.getItem(REEL_RAIL_PIN_KEY) === "1";
  } catch (e) {
    return false;
  }
};
const writeRailPinned = (v) => {
  try {
    localStorage.setItem(REEL_RAIL_PIN_KEY, v ? "1" : "0");
  } catch (e) {
    // private mode — the pin just won't survive a reload
  }
};

function ReelsScreen({ onOpenReport, onOpenProfile, startReelId }) {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [userId, setUserId] = useState(null);
  const [followingSet, setFollowingSet] = useState(new Set());
  const [index, setIndex] = useState(0);
  const [expandedRaw, setExpanded] = useState(false);
  const [railPinned, setRailPinned] = useState(readRailPinned);
  const expanded = expandedRaw || railPinned;
  const [heartBurst, setHeartBurst] = useState(0);
  const railPressRef = React.useRef(null);
  const railLongRef = React.useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [autoScroll, setAutoScroll] = useState(getAutoScrollPref());
  const [fullscreen, setFullscreen] = useState(false);
  const [toast, setToast] = useState("");
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
  const [likesPopupOpen, setLikesPopupOpen] = useState(false);
  const [shareReel, setShareReel] = useState(null);
  const [collectionReel, setCollectionReel] = useState(null);
  const savePressRef = React.useRef(null);
  const longPressedRef = React.useRef(false);
  const [countPrefs, toggleCountPref] = useCountPrefs();
  const touchStartY = React.useRef(0);
  const videoRef = React.useRef(null);
  const containerRef = React.useRef(null);

  useEffect(() => {
    loadReels();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setPlaying(true);
      videoRef.current.play().catch(() => {});
    }
    setCaptionExpanded(false);

    const activeId = reels[index]?.id;
    if (activeId) {
      setReels((prev) => prev.map((r) => (r.id === activeId ? { ...r, views_count: (r.views_count || 0) + 1 } : r)));
      try {
        supabase.rpc("increment_post_views", { p_post_id: activeId }).then(
          () => {},
          () => {}
        );
      } catch (e) {
        // View counting is best-effort only — never let it break the screen
      }
    }
  }, [index, reels[index]?.id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  // Reels load 10 at a time; the next 10 arrive while you're 3 from the end.
  const REELS_PAGE = 10;
  const reelsRef = React.useRef({ me: null, cursor: null, busy: false, done: false, skipId: null });

  const enrichReels = async (rows, meId) => {
    if (rows.length === 0) return [];
    const ids = rows.map((p) => p.id);
    const [counts, { data: likesData }, { data: repostsData }, { data: savesData }, { data: commentsData }, { data: tagsData }] = await Promise.all([
      fetchPostCounts(ids),
      supabase.from("likes").select("post_id, user_id").in("post_id", ids),
      supabase.from("reposts").select("post_id, user_id").in("post_id", ids),
      supabase.from("saves").select("post_id, user_id").in("post_id", ids),
      supabase.from("comments").select("post_id").in("post_id", ids),
      supabase.from("post_tags").select("post_id, tagged_user_id").in("post_id", ids),
    ]);
    const peopleIds = [...new Set([...rows.map((p) => p.user_id), ...(tagsData || []).map((t) => t.tagged_user_id)])];
    const [{ data: profilesData }, collabMap] = await Promise.all([
      supabase.from("profiles").select("id, username, avatar_url, is_verified").in("id", peopleIds),
      fetchCollabMap(ids),
    ]);
    const prof = Object.fromEntries((profilesData || []).map((p) => [p.id, p]));
    const of = (list, id) => (list || []).filter((x) => x.post_id === id);
    return rows.map((p) => {
      const l = of(likesData, p.id);
      const rp = of(repostsData, p.id);
      const sv = of(savesData, p.id);
      return {
        ...p,
        username: prof[p.user_id]?.username || "unknown",
        avatarUrl: prof[p.user_id]?.avatar_url || null,
        likeCount: l.length,
        liked: l.some((x) => x.user_id === meId),
        repostCount: rp.length,
        reposted: rp.some((x) => x.user_id === meId),
        saved: sv.some((x) => x.user_id === meId),
        saveCount: sv.length,
        commentCount: of(commentsData, p.id).length,
        tags: of(tagsData, p.id).map((t) => ({ tagged_user_id: t.tagged_user_id, username: prof[t.tagged_user_id]?.username || "unknown" })),
        verified: !!prof[p.user_id]?.is_verified,
        collabs: collabMap[p.id] || [],
      };
    }).map((p) => applyCounts(p, counts[p.id]));
  };

  const REEL_COLS = "id, media_url, media_type, caption, created_at, user_id, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, views_count, location, link_url, cover_url";

  const loadMoreReels = async () => {
    const st = reelsRef.current;
    if (st.busy || st.done) return;
    st.busy = true;
    try {
      const rel = await getRelations();
      let q = supabase
        .from("posts")
        .select(REEL_COLS)
        .eq("media_type", "reel")
        .eq("archived", false)
        .is("removed_at", null)
        .lte("created_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(REELS_PAGE);
      if (st.cursor) q = q.lt("created_at", st.cursor);
      const { data, error } = await q;
      if (error) throw error;
      const batch = data || [];
      if (batch.length > 0) st.cursor = batch[batch.length - 1].created_at;
      if (batch.length < REELS_PAGE) st.done = true;
      const visible = batch.filter((r) => r.id !== st.skipId && !isHiddenFromFeed(rel, r.user_id));
      const enriched = await enrichReels(visible, st.me);
      setReels((prev) => {
        const seen = new Set(prev.map((r) => r.id));
        return prev.concat(enriched.filter((r) => !seen.has(r.id)));
      });
    } catch (e) {
      setLoadError(e.message || "Couldn't load reels");
      st.done = true;
    }
    st.busy = false;
  };

  const loadReels = async () => {
    setLoading(true);
    setLoadError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);
    reelsRef.current = { me: user?.id ?? null, cursor: null, busy: false, done: false, skipId: startReelId || null };

    const { data: followsData } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user?.id ?? "");
    setFollowingSet(new Set((followsData || []).map((f) => f.following_id)));

    // Opened from a reel on Home: that reel comes first, then the newest.
    let first = [];
    if (startReelId) {
      const { data: one } = await supabase.from("posts").select(REEL_COLS).eq("id", startReelId).maybeSingle();
      if (one) first = await enrichReels([one], user?.id ?? null);
    }
    setReels(first);
    setIndex(0);
    await loadMoreReels();
    setLoading(false);
  };

  // Fetch the next page while you're still a few reels away from the end.
  useEffect(() => {
    if (!loading && reels.length > 0 && index >= reels.length - 3) loadMoreReels();
  }, [index, reels.length, loading]);

  const reel = reels[index];

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaY) > 50) {
      if (deltaY < 0 && index < reels.length - 1) {
        setIndex((i) => i + 1); // swiped up -> next reel
      } else if (deltaY > 0 && index > 0) {
        setIndex((i) => i - 1); // swiped down -> previous reel
      }
      setExpanded(false);
      setMenuOpen(false);
      setCommentSheetOpen(false);
    } else {
      // A tap: one = play/pause, two = like.
      onScreenTap();
    }
  };

  // Double-tap only ever likes (never un-likes), like Instagram.
  const likeFromDoubleTap = () => {
    setHeartBurst(Date.now());
    if (reel && !reel.liked) toggleLike();
  };
  const onScreenTap = useTapDetector(
    () => togglePlay(),
    () => likeFromDoubleTap()
  );

  const seekBy = (secs) => {
    const v = videoRef.current;
    if (!v) return;
    const end = isFinite(v.duration) ? v.duration : v.currentTime + secs;
    v.currentTime = Math.max(0, Math.min(end - 0.05, v.currentTime + secs));
  };

  const stop = (e) => e.stopPropagation();

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleEnded = () => {
    if (autoScroll && index < reels.length - 1) {
      setIndex((i) => i + 1);
    } else if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const toggleLike = async () => {
    if (!userId || !reel) return;
    const wasLiked = reel.liked;

    setReels((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, liked: !wasLiked, likeCount: wasLiked ? r.likeCount - 1 : r.likeCount + 1 }
          : r
      )
    );

    if (wasLiked) {
      await supabase.from("likes").delete().eq("post_id", reel.id).eq("user_id", userId);
    } else {
      await supabase.from("likes").insert({ post_id: reel.id, user_id: userId });
      if (reel.user_id !== userId) {
        await supabase.from("notifications").insert({
          user_id: reel.user_id,
          actor_id: userId,
          type: "like",
          post_id: reel.id,
        });
      }
    }
  };

  const toggleRepost = async () => {
    if (!userId || !reel) return;
    const wasReposted = reel.reposted;

    setReels((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, reposted: !wasReposted, repostCount: wasReposted ? r.repostCount - 1 : r.repostCount + 1 }
          : r
      )
    );

    if (wasReposted) {
      await supabase.from("reposts").delete().eq("post_id", reel.id).eq("user_id", userId);
    } else {
      await supabase.from("reposts").insert({ post_id: reel.id, user_id: userId });
    }
  };

  const toggleSave = async () => {
    if (!userId || !reel) return;
    const wasSaved = reel.saved;

    setReels((prev) => prev.map((r, i) => (i === index ? { ...r, saved: !wasSaved, saveCount: Math.max(0, (r.saveCount || 0) + (wasSaved ? -1 : 1)) } : r)));

    const { error } = wasSaved
      ? await supabase.from("saves").delete().eq("post_id", reel.id).eq("user_id", userId)
      : await supabase.from("saves").insert({ post_id: reel.id, user_id: userId });

    if (error) {
      setReels((prev) => prev.map((r, i) => (i === index ? { ...r, saved: wasSaved, saveCount: reel.saveCount } : r)));
      showToast(error.message);
    }
  };

  const toggleFollow = async () => {
    if (!userId || !reel || reel.user_id === userId) return;
    const isFollowing = followingSet.has(reel.user_id);

    setFollowingSet((prev) => {
      const next = new Set(prev);
      if (isFollowing) next.delete(reel.user_id);
      else next.add(reel.user_id);
      return next;
    });

    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", userId).eq("following_id", reel.user_id);
    } else {
      await supabase.from("follows").insert({ follower_id: userId, following_id: reel.user_id });
      await supabase.from("notifications").insert({
        user_id: reel.user_id,
        actor_id: userId,
        type: "follow",
      });
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!fullscreen) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setFullscreen(false);
    }
    setMenuOpen(false);
  };

  const handleDownload = () => {
    if (!reel) return;
    const a = document.createElement("a");
    a.href = reel.media_url;
    a.download = `loop-reel-${reel.id}.mp4`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setMenuOpen(false);
  };

  const deleteReel = async () => {
    if (!reel || reel.user_id !== userId) return;
    if (!window.confirm("Delete this reel? This cannot be undone.")) return;
    setMenuOpen(false);
    await supabase.from("posts").delete().eq("id", reel.id);
    setReels((prev) => {
      const next = prev.filter((r) => r.id !== reel.id);
      setIndex((i) => Math.min(i, Math.max(next.length - 1, 0)));
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--bg-sunken)" }}>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex-1 flex items-center justify-center px-6" style={{ background: "var(--bg-sunken)" }}>
        <p className="text-xs text-center" style={{ color: "var(--accent-start)" }}>{loadError}</p>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2" style={{ background: "var(--bg-sunken)" }}>
        <Video size={32} color="var(--toggle-off)" />
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>No reels yet — be the first to post one!</p>
      </div>
    );
  }

  const isFollowing = followingSet.has(reel.user_id);

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden"
      style={{ background: "var(--bg-sunken)" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Reel video */}
      <div className="absolute inset-0">
        <video
          key={reel.id}
          ref={videoRef}
          src={reel.media_url}
          poster={reel.cover_url || undefined}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
          muted={muted}
          onEnded={handleEnded}
        />
        <HeartBurst burstKey={heartBurst} />
        {/* readability scrims — keeps white text legible over any video */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: 120, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: 260, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 100%)" }}
        />
      </div>

      {/* Paused: seek back · play · seek forward, with mute underneath */}
      {!playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none z-10">
          <div className="flex items-center gap-7">
            <button
              onClick={() => seekBy(-5)}
              onTouchStart={stop}
              onTouchEnd={stop}
              aria-label="Back 5 seconds"
              className="pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-90"
              style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <RotateCcw size={20} color="#fff" />
              <span className="absolute text-[8px]" style={{ color: "#fff", fontWeight: 700, marginTop: 1 }}>5</span>
            </button>
            <button
              onClick={togglePlay}
              onTouchStart={stop}
              onTouchEnd={stop}
              aria-label="Play"
              className="pointer-events-auto w-[72px] h-[72px] rounded-full flex items-center justify-center transition-transform active:scale-90"
              style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <Play size={30} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
            </button>
            <button
              onClick={() => seekBy(5)}
              onTouchStart={stop}
              onTouchEnd={stop}
              aria-label="Forward 5 seconds"
              className="pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-90"
              style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <RotateCw size={20} color="#fff" />
              <span className="absolute text-[8px]" style={{ color: "#fff", fontWeight: 700, marginTop: 1 }}>5</span>
            </button>
          </div>
          <button
            onClick={() => setMuted((m) => !m)}
            onTouchStart={stop}
            onTouchEnd={stop}
            aria-label={muted ? "Unmute" : "Mute"}
            className="pointer-events-auto flex items-center gap-1.5 rounded-full px-3.5 h-9 transition-transform active:scale-95"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            {muted ? <VolumeX size={16} color="#fff" /> : <Volume2 size={16} color="#fff" />}
            <span className="text-xs" style={{ color: "#fff", fontWeight: 600 }}>{muted ? "Unmute" : "Mute"}</span>
          </button>
        </div>
      )}

      {toast && (
        <div
          className="absolute top-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs z-30"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#FFFFFF",
            fontWeight: 600,
            boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
          }}
        >
          {toast}
        </div>
      )}

      {/* top label + options menu */}
      <div
        className="absolute top-4 left-0 right-0 flex items-center justify-center"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <span className="text-base" style={{ color: "#FFFFFF", fontWeight: 700, fontFamily: "'Sora', sans-serif", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
          Reels
        </span>
        <div className="absolute right-3" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
          <button onClick={() => setMenuOpen((v) => !v)}>
            <Ellipsis size={20} color="#FFFFFF" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-8 z-20 rounded-2xl overflow-hidden py-1"
                style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", minWidth: 200, boxShadow: "0 8px 28px rgba(0,0,0,0.4)" }}
              >
                <button
                  onClick={() => {
                    const next = !autoScroll;
                    setAutoScroll(next);
                    setAutoScrollPref(next);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm"
                  style={{ color: "var(--text)" }}
                >
                  <span className="flex items-center gap-2"><RefreshCw size={15} /> Auto Scroll</span>
                  <span
                    className="rounded-full"
                    style={{ width: 30, height: 17, background: autoScroll ? ACCENT : "var(--toggle-off)", position: "relative" }}
                  >
                    <span
                      className="rounded-full bg-white absolute"
                      style={{ width: 13, height: 13, top: 2, left: autoScroll ? 15 : 2, transition: "left 0.15s" }}
                    />
                  </span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    showToast("Remix — coming soon");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm"
                  style={{ color: "var(--text)" }}
                >
                  <Sparkles size={15} /> Remix
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm"
                  style={{ color: "var(--text)" }}
                >
                  {fullscreen ? <Minimize size={15} /> : <Maximize size={15} />} View Full Screen
                </button>

                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm"
                  style={{ color: "var(--text)" }}
                >
                  <Download size={15} /> Download
                </button>

                <button
                  onClick={() => showToast("Quality: Auto (only one version is uploaded)")}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm"
                  style={{ color: "var(--text)" }}
                >
                  <span className="flex items-center gap-2"><Gauge size={15} /> Quality</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Auto</span>
                </button>

                <div className="h-px my-1" style={{ background: "var(--border)" }} />
                <div className="px-4 py-1.5 text-[10px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>My view: show counts</div>
                {[
                  ["likes", "Likes"],
                  ["comments", "Comments"],
                  ["reposts", "Reposts"],
                  ["saves", "Saves"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => toggleCountPref(key)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm"
                    style={{ color: "var(--text)" }}
                  >
                    <span>{label}</span>
                    <span
                      className="rounded-full"
                      style={{ width: 30, height: 17, background: countPrefs[key] ? ACCENT : "var(--toggle-off)", position: "relative" }}
                    >
                      <span
                        className="rounded-full bg-white absolute"
                        style={{ width: 13, height: 13, top: 2, left: countPrefs[key] ? 15 : 2, transition: "left 0.15s" }}
                      />
                    </span>
                  </button>
                ))}

                {reel.user_id === userId ? (
                  <button
                    onClick={deleteReel}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm"
                    style={{ color: "var(--accent-start)" }}
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenReport(reel.id);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm"
                    style={{ color: "var(--accent-start)" }}
                  >
                    Report
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* bottom-left caption + follow */}
      <div
        className="absolute left-4 bottom-5 right-20"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 mb-2.5">
          <button onClick={() => onOpenProfile(reel.user_id)} className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-[13px]" style={{ background: "rgba(255,255,255,0.22)", color: "#FFFFFF", fontWeight: 600 }}>
              {reel.avatarUrl ? <img src={reel.avatarUrl} alt="" className="w-full h-full object-cover" /> : reel.username[0].toUpperCase()}
            </div>
          </button>
          <PostAuthorLine post={reel} onOpenProfile={onOpenProfile} light />
          {reel.user_id !== userId && (
            <button
              onClick={toggleFollow}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] shrink-0 transition-transform active:scale-95"
              style={{
                background: isFollowing ? "rgba(255,255,255,0.14)" : "#FFFFFF",
                border: isFollowing ? "1px solid rgba(255,255,255,0.55)" : "none",
                color: isFollowing ? "#FFFFFF" : "#000000",
                fontWeight: 700,
                backdropFilter: isFollowing ? "blur(8px)" : "none",
              }}
            >
              {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
        {reel.location && (
          <span className="flex items-center gap-1 text-[11px] mb-1.5" style={{ color: "rgba(255,255,255,0.85)" }}>
            <MapPin size={11} /> {reel.location}
          </span>
        )}
        <CaptionText
          caption={reel.caption}
          light
          onMention={(n) => openProfileByUsername(n, onOpenProfile)}
          onTap={reel.comments_disabled ? undefined : () => setCommentSheetOpen(true)}
        />
        <TaggedPeopleLine tags={reel.tags} onOpenProfile={onOpenProfile} light />
        <PostLinkChip url={reel.link_url} light />
      </div>

      {/* Quick Actions — the only action control; expands to full-size icons */}
      <div
        className="absolute right-3 bottom-6 flex flex-col items-center"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div className="relative flex flex-col items-center">
          {expanded && (
            <div
              className="absolute bottom-24 flex flex-col items-center gap-5 py-4 px-2.5 rounded-full"
              style={{
                background: "rgba(0,0,0,0.42)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
              }}
            >
              <button
                onClick={toggleLike}
                onTouchStart={(e) => {
                  e.currentTarget._pressTimer = setTimeout(() => setLikesPopupOpen(true), 500);
                }}
                onTouchEndCapture={(e) => clearTimeout(e.currentTarget._pressTimer)}
                className="flex flex-col items-center gap-1"
                style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}
              >
                <Heart size={28} color={reel.liked ? "#ED4956" : "#FFFFFF"} fill={reel.liked ? "#ED4956" : "none"} strokeWidth={2} />
                {countPrefs.likes && !reel.hide_likes && reel.likeCount > 0 && (
                  <span className="text-[11px]" style={{ color: "#FFFFFF", fontWeight: 600 }}>{formatCount(reel.likeCount)}</span>
                )}
              </button>
              {!reel.comments_disabled ? (
                <button onClick={() => setCommentSheetOpen(true)} className="flex flex-col items-center gap-1" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
                  <MessageCircle size={27} color="#FFFFFF" strokeWidth={2} />
                  {countPrefs.comments && !reel.hide_comments && reel.commentCount > 0 && (
                    <span className="text-[11px]" style={{ color: "#FFFFFF", fontWeight: 600 }}>{formatCount(reel.commentCount)}</span>
                  )}
                </button>
              ) : (
                <MessageCircle size={27} color="rgba(255,255,255,0.35)" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }} />
              )}
              <button onClick={toggleRepost} className="flex flex-col items-center gap-1" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
                <RepostIcon size={28} color={reel.reposted ? "var(--accent-end)" : "#FFFFFF"} strokeWidth={2} active={reel.reposted} />
                {countPrefs.reposts && !reel.hide_reposts && reel.repostCount > 0 && (
                  <span className="text-[11px]" style={{ color: "#FFFFFF", fontWeight: 600 }}>{formatCount(reel.repostCount)}</span>
                )}
              </button>
              <button
                onClick={() => setShareReel(reel)}
                className="flex flex-col items-center gap-1 transition-transform active:scale-90"
                style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}
              >
                <ShareIcon size={26} color="#FFFFFF" strokeWidth={2} />
              </button>
              <button
                onClick={() => {
                  // The long press already opened the collection sheet; don't
                  // let the click that follows un-save the reel.
                  if (longPressedRef.current) {
                    longPressedRef.current = false;
                    return;
                  }
                  toggleSave();
                }}
                onTouchStart={() => {
                  longPressedRef.current = false;
                  savePressRef.current = setTimeout(() => {
                    longPressedRef.current = true;
                    setCollectionReel(reel);
                  }, 500);
                }}
                onTouchEnd={() => clearTimeout(savePressRef.current)}
                onTouchMove={() => clearTimeout(savePressRef.current)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  longPressedRef.current = true;
                  setCollectionReel(reel);
                }}
                className="flex flex-col items-center gap-1 transition-transform active:scale-90"
                style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}
              >
                <Bookmark size={26} color="#FFFFFF" fill={reel.saved ? "#FFFFFF" : "none"} strokeWidth={2} />
                {countPrefs.saves && !reel.hide_saves && reel.saveCount > 0 && (
                  <span className="text-[11px]" style={{ color: "#FFFFFF", fontWeight: 600 }}>{formatCount(reel.saveCount)}</span>
                )}
              </button>
            </div>
          )}

          {likesPopupOpen && (
            <LikesViewsPopup post={reel} isOwner={reel.user_id === userId} onClose={() => setLikesPopupOpen(false)} onOpenProfile={onOpenProfile} />
          )}

          {/* audio / sound-source shortcut, sits just above the main heart button */}
          <button
            onClick={() => showToast("Reels using this audio — coming soon")}
            className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center transition-transform active:scale-90"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            <Music2 size={15} color="#FFFFFF" />
          </button>

          <button
            onClick={() => {
              if (railLongRef.current) {
                railLongRef.current = false;
                return;
              }
              if (railPinned) {
                setRailPinned(false);
                writeRailPinned(false);
                setExpanded(false);
                showToast("Unpinned");
                return;
              }
              setExpanded((v) => !v);
            }}
            onTouchStart={() => {
              railLongRef.current = false;
              railPressRef.current = setTimeout(() => {
                railLongRef.current = true;
                setRailPinned(true);
                writeRailPinned(true);
                showToast("Pinned — stays open on every reel");
              }, 500);
            }}
            onTouchEnd={() => clearTimeout(railPressRef.current)}
            onTouchMove={() => clearTimeout(railPressRef.current)}
            onContextMenu={(e) => {
              e.preventDefault();
              railLongRef.current = true;
              setRailPinned(true);
              writeRailPinned(true);
              showToast("Pinned — stays open on every reel");
            }}
            className="relative w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-90"
            style={{
              background: reel.liked ? ACCENT : "rgba(0,0,0,0.4)",
              backdropFilter: reel.liked ? "none" : "blur(8px)",
              border: reel.liked ? "none" : "1px solid rgba(255,255,255,0.18)",
              boxShadow: reel.liked ? "0 4px 16px rgba(0,0,0,0.35)" : "none",
            }}
          >
            {railPinned && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "#FFFFFF" }}
              >
                <Pin size={9} color="#000000" fill="#000000" />
              </span>
            )}
            {expanded ? (
              <Ellipsis size={20} color={reel.liked ? "var(--on-accent)" : "#FFFFFF"} />
            ) : (
              <Heart size={20} color={reel.liked ? "var(--on-accent)" : "#FFFFFF"} fill={reel.liked ? "var(--on-accent)" : "none"} />
            )}
          </button>
        </div>
      </div>

      {commentSheetOpen && (
        <ReelCommentsSheet
          postId={reel.id}
          postOwnerId={reel.user_id}
          currentUserId={userId}
          postUsername={reel.username}
          postCaption={reel.caption}
          postAvatar={reel.avatarUrl}
          postCreatedAt={reel.created_at}
          postLink={reel.link_url}
          postTags={reel.tags}
          commentsDisabled={reel.comments_disabled}
          onOpenProfile={onOpenProfile}
          onClose={() => setCommentSheetOpen(false)}
          onCommentPosted={() =>
            setReels((prev) => prev.map((r, i) => (i === index ? { ...r, commentCount: r.commentCount + 1 } : r)))
          }
        />
      )}
      {shareReel && (
        <ShareSheet item={shareReel} currentUserId={userId} onClose={() => setShareReel(null)} />
      )}

      {collectionReel && (
        <AddToCollectionSheet
          postIds={[collectionReel.id]}
          currentUserId={userId}
          onClose={() => setCollectionReel(null)}
          onDone={() => {
            const current = reels[index];
            if (current && current.id === collectionReel.id && !current.saved) toggleSave();
            setCollectionReel(null);
          }}
        />
      )}
    </div>
  );
}

// Inline bottom-sheet comment panel for Reels (Instagram-style), with per-comment
// like/dislike, single-level reply, and delete-your-own-comment. Requires two
// small additions in Supabase (see reels-comments-setup.sql):
//   alter table comments add column parent_id uuid references comments(id);
//   create table comment_reactions (... type text check (type in ('like','dislike')) ...);
function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w`;
  const months = Math.floor(days / 30);
  return `${months}mo`;
}

function ReelCommentsSheet({
  postId,
  postOwnerId,
  currentUserId,
  postUsername,
  postCaption,
  postAvatar,
  postCreatedAt,
  postLink,
  postTags,
  commentsDisabled,
  onOpenProfile,
  onClose,
  onCommentPosted,
}) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [posting, setPosting] = useState(false);
  const [menuFor, setMenuFor] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [attachment, setAttachment] = useState(null); // { file, url }
  const attachRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const [expanded, setExpanded] = useState(new Set()); // threads with replies open
  const [showHidden, setShowHidden] = useState(false);
  const [followsOwner, setFollowsOwner] = useState(null); // null = unknown/self
  useEffect(() => {
    if (!currentUserId || !postOwnerId || currentUserId === postOwnerId) return;
    supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", currentUserId)
      .eq("following_id", postOwnerId)
      .maybeSingle()
      .then(({ data }) => setFollowsOwner(!!data));
  }, [currentUserId, postOwnerId]);
  const followOwner = async () => {
    if (!currentUserId || !postOwnerId) return;
    if (followsOwner) {
      setFollowsOwner(false);
      await supabase.from("follows").delete().eq("follower_id", currentUserId).eq("following_id", postOwnerId);
    } else {
      setFollowsOwner(true);
      const { error } = await supabase.from("follows").insert({ follower_id: currentUserId, following_id: postOwnerId });
      if (!error) await supabase.from("notifications").insert({ user_id: postOwnerId, actor_id: currentUserId, type: "follow" });
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const openProfileByName = async (name) => {
    const { data } = await supabase.from("profiles").select("id").ilike("username", name).maybeSingle();
    if (data?.id) {
      onClose?.();
      onOpenProfile?.(data.id);
    }
  };

  // Reply like Instagram: the reply goes under the top comment, and the
  // box starts with @name of whoever you're answering.
  const startReply = (topComment, target) => {
    setReplyingTo({ id: topComment.id, username: target.username });
    setText(`@${target.username} `);
    setExpanded((prev) => new Set(prev).add(topComment.id));
    setMenuFor(null);
    setTimeout(() => {
      const el = inputRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }, 30);
  };

  const loadComments = async () => {
    setLoading(true);
    const { data: commentsData } = await supabase
      .from("comments")
      .select("id, user_id, content, image_url, created_at, parent_id, edited_at, pinned_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    const commentIds = (commentsData || []).map((c) => c.id);
    const authorIds = [...new Set((commentsData || []).map((c) => c.user_id))];
    const [{ data: profilesData }, { data: reactionsData }] = await Promise.all([
      authorIds.length
        ? supabase.from("profiles").select("id, username, avatar_url").in("id", authorIds)
        : Promise.resolve({ data: [] }),
      commentIds.length
        ? supabase.from("comment_reactions").select("comment_id, user_id, type").in("comment_id", commentIds)
        : Promise.resolve({ data: [] }),
    ]);
    const hidden = await hiddenCommenterSet(postOwnerId);
    const rel = await getRelations();
    const iAmOwner = currentUserId && currentUserId === postOwnerId;
    const words = await getHiddenWords();

    const merged = (commentsData || [])
      .filter((c) => !hidden.has(c.user_id))
      .map((c) => {
        const profile = (profilesData || []).find((p) => p.id === c.user_id);
        const reactions = (reactionsData || []).filter((r) => r.comment_id === c.id);
        const myReaction = reactions.find((r) => r.user_id === currentUserId)?.type ?? null;
        return {
          ...c,
          username: profile?.username || "unknown",
          avatarUrl: profile?.avatar_url || null,
          likeCount: reactions.filter((r) => r.type === "like").length,
          dislikeCount: reactions.filter((r) => r.type === "dislike").length,
          myReaction,
          // Only the post owner is told a comment comes from someone they
          // restricted — everyone else simply never sees it.
          restricted: iAmOwner && rel.restricted.has(c.user_id),
          likedByAuthor: c.user_id !== postOwnerId && reactions.some((rx) => rx.user_id === postOwnerId && rx.type === "like"),
          hiddenByWords:
            c.user_id !== currentUserId && words.length > 0 && words.some((w) => (c.content || "").toLowerCase().includes(w)),
        };
      });

    setComments(merged);
    setLoading(false);
  };

  const submitComment = async () => {
    const trimmed = text.trim();
    if ((!trimmed && !attachment) || !currentUserId || posting) return;
    setPosting(true);

    let imageUrl = null;
    if (attachment) {
      const upFile = await compressImage(attachment.file, 1080);
      const safeName = upFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${currentUserId}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage.from("comments").upload(path, upFile);
      if (upErr) {
        setPosting(false);
        alert(upErr.message);
        return;
      }
      imageUrl = supabase.storage.from("comments").getPublicUrl(path).data.publicUrl;
    }

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: currentUserId,
      content: trimmed,
      image_url: imageUrl,
      parent_id: replyingTo?.id ?? null,
    });
    if (!error && attachment) {
      URL.revokeObjectURL(attachment.url);
      setAttachment(null);
    }

    setPosting(false);
    if (error) {
      alert(error.message);
      return;
    }
    if (!error) {
      if (replyingTo) setExpanded((prev) => new Set(prev).add(replyingTo.id));
      setText("");
      setReplyingTo(null);
      onCommentPosted?.();
      loadComments();
      if (postOwnerId !== currentUserId) {
        await supabase.from("notifications").insert({
          user_id: postOwnerId,
          actor_id: currentUserId,
          type: "comment",
          post_id: postId,
        });
      }

      // Best-effort: notify anyone @mentioned in the comment
      try {
        const mentioned = [...new Set((trimmed.match(/@([a-zA-Z0-9_.]+)/g) || []).map((m) => m.slice(1)))];
        if (mentioned.length > 0) {
          const { data: matchedProfiles } = await supabase
            .from("profiles")
            .select("id, username")
            .in("username", mentioned);
          if (matchedProfiles && matchedProfiles.length > 0) {
            await supabase.from("notifications").insert(
              matchedProfiles
                .filter((p) => p.id !== currentUserId)
                .map((p) => ({ user_id: p.id, actor_id: currentUserId, type: "mention", post_id: postId }))
            );
          }
        }
      } catch (e) {
        // Mention notifications are best-effort — never block the comment over it
      }
    }
  };

  const setReaction = async (comment, type) => {
    if (!currentUserId) return;
    const current = comment.myReaction;
    const turningOff = current === type;

    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== comment.id) return c;
        let { likeCount, dislikeCount } = c;
        if (current === "like") likeCount -= 1;
        if (current === "dislike") dislikeCount -= 1;
        if (!turningOff) {
          if (type === "like") likeCount += 1;
          if (type === "dislike") dislikeCount += 1;
        }
        return { ...c, likeCount, dislikeCount, myReaction: turningOff ? null : type };
      })
    );

    if (turningOff) {
      await supabase.from("comment_reactions").delete().eq("comment_id", comment.id).eq("user_id", currentUserId);
    } else {
      await supabase
        .from("comment_reactions")
        .upsert({ comment_id: comment.id, user_id: currentUserId, type }, { onConflict: "comment_id,user_id" });
    }
  };

  const deleteComment = async (comment) => {
    if (comment.user_id !== currentUserId && postOwnerId !== currentUserId) return;
    setMenuFor(null);
    if (!window.confirm("Delete this comment?")) return;
    setComments((prev) => prev.filter((c) => c.id !== comment.id && c.parent_id !== comment.id));
    await supabase.from("comments").delete().eq("id", comment.id);
  };

  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
    setMenuFor(null);
  };

  const saveEdit = async (comment) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    if (trimmed === comment.content) {
      setEditingId(null);
      return;
    }
    const before = comment.content;
    // Show the new words straight away, then put them back if the save fails.
    setEditingId(null);
    setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, content: trimmed, edited_at: new Date().toISOString() } : c)));

    const { data: saved, error } = await supabase
      .from("comments")
      .update({ content: trimmed })
      .eq("id", comment.id)
      .eq("user_id", currentUserId)
      .select("id, content, edited_at")
      .maybeSingle();

    if (error || !saved) {
      setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, content: before, edited_at: comment.edited_at } : c)));
      setEditText(trimmed);
      setEditingId(comment.id);
      alert(
        error?.message?.includes("15 minutes")
          ? "Comments can only be edited within 15 minutes of posting."
          : error?.message ||
            "Loop couldn't save that edit. Your account doesn't have permission to change this comment yet — run the latest Loop SQL in Supabase and try again."
      );
      return;
    }
    setComments((prev) =>
      prev.map((c) => (c.id === comment.id ? { ...c, content: saved.content, edited_at: saved.edited_at || new Date().toISOString() } : c))
    );
  };

  const copyComment = (comment) => {
    navigator.clipboard?.writeText(comment.content).catch(() => {});
    setMenuFor(null);
  };

  const reportComment = async (comment) => {
    setMenuFor(null);
    if (!currentUserId) return;
    await supabase.from("reports").insert({
      post_id: postId,
      comment_id: comment.id,
      reported_user_id: comment.user_id,
      reporter_id: currentUserId,
      reason: "Reported comment",
    });
    alert("Comment reported. Thanks for letting us know.");
  };

  // Pin the post owner's own comments to the top; keep chronological order otherwise
  const allTopLevel = comments
    .filter((c) => !c.parent_id)
    .slice()
    .sort((a, b) => {
      if (!!a.pinned_at !== !!b.pinned_at) return a.pinned_at ? -1 : 1;
      if (a.pinned_at && b.pinned_at) return new Date(a.pinned_at) - new Date(b.pinned_at);
      const aOwner = a.user_id === postOwnerId ? 0 : 1;
      const bOwner = b.user_id === postOwnerId ? 0 : 1;
      if (aOwner !== bOwner) return aOwner - bOwner;
      return new Date(a.created_at) - new Date(b.created_at);
    });
  const hiddenCount = allTopLevel.filter((c) => c.hiddenByWords).length;
  const topLevel = showHidden ? allTopLevel : allTopLevel.filter((c) => !c.hiddenByWords);
  const repliesOf = (id) => comments.filter((c) => c.parent_id === id && (showHidden || !c.hiddenByWords));

  const togglePin = async (c) => {
    setMenuFor(null);
    const pin = !c.pinned_at;
    const { error } = await supabase.rpc("pin_comment", { p_comment: c.id, p_pin: pin });
    if (error) {
      alert(error.message);
      return;
    }
    setComments((prev) => prev.map((x) => (x.id === c.id ? { ...x, pinned_at: pin ? new Date().toISOString() : null } : x)));
  };

  return (
    <>
      <div className="fixed inset-0 z-30" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <div
        className="fixed left-0 right-0 bottom-0 z-40 rounded-t-3xl flex flex-col"
        style={{ background: "var(--bg)", maxHeight: "82vh", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-center pt-2.5 pb-2">
          <div className="rounded-full" style={{ width: 40, height: 4, background: "var(--toggle-off)" }} />
        </div>
        <div className="relative flex items-center justify-center px-4 pb-2.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <span className="text-[15px]" style={{ color: "var(--text)", fontWeight: 700 }}>Comments</span>
          <button onClick={onClose} className="absolute right-4"><X size={20} color="var(--text)" /></button>
        </div>

        {postUsername && (
          <div className="px-4 pt-1 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose?.();
                  onOpenProfile?.(postOwnerId);
                }}
                className="flex items-center gap-3 min-w-0"
              >
                <Avatar username={postUsername} avatarUrl={postAvatar} size={40} />
                <span className="text-[15px] truncate" style={{ color: "var(--text)", fontWeight: 700 }}>{postUsername}</span>
              </button>
              {followsOwner !== null && (
                <button
                  onClick={followOwner}
                  className="rounded-lg px-3.5 h-8 text-[13px] shrink-0 transition-transform active:scale-95"
                  style={{ border: "1px solid var(--text)", color: "var(--text)", fontWeight: 700, background: "transparent", opacity: followsOwner ? 0.6 : 1 }}
                >
                  {followsOwner ? "Following" : "Follow"}
                </button>
              )}
            </div>
            {postCaption && (
              <p className="text-[14px] mt-2.5" style={{ color: "var(--text)", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.45 }}>
                <MentionText text={postCaption} onMention={openProfileByName} />
              </p>
            )}
            {postCreatedAt && (
              <p className="text-[12px] mt-2" style={{ color: "var(--text-muted)" }}>
                {new Date(postCreatedAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                  ...(new Date(postCreatedAt).getFullYear() !== new Date().getFullYear() ? { year: "numeric" } : {}),
                })}
              </p>
            )}
            {postTags && postTags.length > 0 && (
              <TaggedPeopleLine
                tags={postTags}
                onOpenProfile={(id) => {
                  onClose?.();
                  onOpenProfile?.(id);
                }}
              />
            )}
            <PostLinkChip url={postLink} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 pt-3">
          {loading ? (
            <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Loading...</p>
          ) : topLevel.length === 0 ? (
            <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>No comments yet</p>
          ) : (
            topLevel.map((c) => {
              const replies = repliesOf(c.id);
              const open = expanded.has(c.id);
              const rowProps = (x, top, isReply) => ({
                comment: x,
                isReply,
                replyToName: isReply ? top.username : null,
                isPinned: x.user_id === postOwnerId,
                isEditing: editingId === x.id,
                editText,
                onEditTextChange: setEditText,
                onSaveEdit: () => saveEdit(x),
                onCancelEdit: () => setEditingId(null),
                onReact: (type) => setReaction(x, type),
                onReply: () => startReply(top, x),
                onOpenMenu: () => setMenuFor(x.id),
                onOpenProfile: () => {
                  onClose?.();
                  onOpenProfile?.(x.user_id);
                },
                onMention: openProfileByName,
              });
              return (
                <div key={c.id} className="mb-4">
                  {c.pinned_at && (
                    <p className="flex items-center gap-1 text-[11px] mb-1" style={{ color: "var(--text-muted)", marginLeft: 46 }}>
                      <Pin size={11} /> Pinned by {postUsername || "author"}
                    </p>
                  )}
                  <CommentRow {...rowProps(c, c, false)} />
                  {replies.length > 0 && (
                    <div className="mt-2" style={{ marginLeft: 46 }}>
                      <button
                        onClick={() =>
                          setExpanded((prev) => {
                            const next = new Set(prev);
                            open ? next.delete(c.id) : next.add(c.id);
                            return next;
                          })
                        }
                        className="flex items-center gap-2.5 text-xs mb-2"
                        style={{ color: "var(--text-muted)", fontWeight: 600 }}
                      >
                        <span style={{ width: 24, height: 1, background: "var(--text-muted)", opacity: 0.6 }} />
                        {open ? "Hide replies" : `View ${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
                      </button>
                      {open && (
                        <div className="flex flex-col gap-3 pl-3" style={{ borderLeft: "2px solid var(--border-subtle)" }}>
                          {replies.map((rp) => (
                            <CommentRow key={rp.id} {...rowProps(rp, c, true)} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {hiddenCount > 0 && (
          <button
            onClick={() => setShowHidden((v) => !v)}
            className="mx-4 mb-2 text-xs text-left"
            style={{ color: "var(--text-muted)", fontWeight: 600 }}
          >
            {showHidden ? "Hide comments with your hidden words" : `View ${hiddenCount} hidden ${hiddenCount === 1 ? "comment" : "comments"}`}
          </button>
        )}

        {menuFor && comments.find((x) => x.id === menuFor) && (() => {
          const mc = comments.find((x) => x.id === menuFor);
          const top = mc.parent_id ? comments.find((x) => x.id === mc.parent_id) || mc : mc;
          return (
            <CommentActionSheet
              comment={mc}
              isOwn={mc.user_id === currentUserId}
              isPostOwner={postOwnerId === currentUserId}
              onClose={() => setMenuFor(null)}
              onReply={() => startReply(top, mc)}
              onCopy={() => copyComment(mc)}
              onEdit={() => startEdit(mc)}
              onDelete={() => deleteComment(mc)}
              onReport={() => reportComment(mc)}
              onPin={postOwnerId === currentUserId && !mc.parent_id ? () => togglePin(mc) : null}
            />
          );
        })()}

        <div className="px-4 pt-2 pb-4" style={{ borderTop: "1px solid var(--border)" }}>
          {commentsDisabled ? (
            <p className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>Comments are off for this post.</p>
          ) : (
            <>
              {replyingTo && (
                <div className="flex items-center justify-between mb-2 rounded-xl px-3 py-2" style={{ background: "var(--surface)" }}>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Replying to <span style={{ color: "var(--text)", fontWeight: 700 }}>{replyingTo.username}</span>
                  </span>
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setText((t) => t.replace(/^@[a-zA-Z0-9_.]+\s?/, ""));
                    }}
                    aria-label="Cancel reply"
                  >
                    <X size={14} color="var(--text-muted)" />
                  </button>
                </div>
              )}
              {attachment && (
                <div className="relative mb-2" style={{ width: 72, height: 72 }}>
                  <img src={attachment.url} alt="" className="w-full h-full object-cover rounded-xl" style={{ border: "1px solid var(--border)" }} />
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(attachment.url);
                      setAttachment(null);
                    }}
                    className="absolute -top-1.5 -right-1.5 rounded-full flex items-center justify-center"
                    style={{ width: 20, height: 20, background: "var(--text)", border: "2px solid var(--bg)" }}
                  >
                    <X size={11} color="var(--bg)" />
                  </button>
                </div>
              )}
              <input
                ref={attachRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (!f) return;
                  if (f.size > 8 * 1024 * 1024) {
                    alert("That file is over 8 MB — pick a smaller photo or GIF.");
                    return;
                  }
                  if (attachment) URL.revokeObjectURL(attachment.url);
                  setAttachment({ file: f, url: URL.createObjectURL(f) });
                }}
              />
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={replyingTo ? `Reply to ${replyingTo.username}...` : "Add a comment..."}
                  rows={1}
                  className="flex-1 rounded-2xl px-3.5 py-2.5 text-sm outline-none resize-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", maxHeight: 110 }}
                />
                <button
                  disabled={posting}
                  onClick={() => attachRef.current?.click()}
                  title="Add a photo or GIF"
                  className="pb-2 transition-transform active:scale-90"
                >
                  <ImagePlus size={19} color={attachment ? "var(--accent-solid)" : "var(--text-muted)"} />
                </button>
                <button
                  onClick={submitComment}
                  disabled={posting || (!text.trim() && !attachment)}
                  className="text-sm pb-2"
                  style={{ color: text.trim() ? "var(--accent-start)" : "var(--text-muted)", fontWeight: 700 }}
                >
                  Post
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const COMMENT_EDIT_WINDOW_MS = 15 * 60 * 1000;
const canEditComment = (c) => Date.now() - new Date(c.created_at).getTime() < COMMENT_EDIT_WINDOW_MS;

// Text with @names, #tags and web links made tappable.
const RICH_TOKEN = /((?:https?:\/\/|www\.)[^\s]+|@[a-zA-Z0-9_.]+|#[\p{L}\p{N}_]+)/gu;
function MentionText({ text, onMention }) {
  if (!text) return null;
  const parts = text.split(RICH_TOKEN);
  return parts.map((part, i) => {
    if (!part) return null;
    if (/^(https?:\/\/|www\.)/i.test(part)) {
      const trail = (part.match(/[).,!?]+$/) || [""])[0];
      const clean = trail ? part.slice(0, -trail.length) : part;
      const href = /^https?:\/\//i.test(clean) ? clean : `https://${clean}`;
      return (
        <React.Fragment key={i}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            onClick={(e) => e.stopPropagation()}
            style={{ color: "var(--accent-solid)", fontWeight: 600, wordBreak: "break-all" }}
          >
            {clean.replace(/^https?:\/\//i, "")}
          </a>
          {trail}
        </React.Fragment>
      );
    }
    if (/^@[a-zA-Z0-9_.]+$/.test(part)) {
      return (
        <span
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onMention?.(part.slice(1));
          }}
          style={{ color: "var(--accent-solid)", fontWeight: 600 }}
        >
          {part}
        </span>
      );
    }
    if (/^#/.test(part)) {
      return (
        <span
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent("loop:hashtag", { detail: part.slice(1) }));
          }}
          style={{ color: "var(--accent-solid)", fontWeight: 600 }}
        >
          {part}
        </span>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// Open a profile from an @name.
async function openProfileByUsername(name, onOpenProfile) {
  if (!name || !onOpenProfile) return;
  const { data } = await supabase.from("profiles").select("id").ilike("username", name).maybeSingle();
  if (data?.id) onOpenProfile(data.id);
}

// A post's link as a tidy pill: "YouTube · youtu.be ↗".
const SITE_NAMES = [
  [/(^|\.)(youtube\.com|youtu\.be)$/, "YouTube"],
  [/(^|\.)(facebook\.com|fb\.watch|fb\.com)$/, "Facebook"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)(x\.com|twitter\.com)$/, "X"],
  [/(^|\.)wa\.me$|(^|\.)whatsapp\.com$/, "WhatsApp"],
  [/(^|\.)t\.me$/, "Telegram"],
  [/(^|\.)github\.com$/, "GitHub"],
  [/(^|\.)linkedin\.com$/, "LinkedIn"],
  [/(^|\.)spotify\.com$/, "Spotify"],
];
function PostLinkChip({ url, light = false }) {
  if (!url) return null;
  let host = url;
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    // keep raw
  }
  const site = (SITE_NAMES.find(([re]) => re.test(host)) || [])[1];
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-2 mt-2 rounded-full pl-1.5 pr-3 py-1 max-w-full"
      style={{
        background: light ? "rgba(255,255,255,0.16)" : "var(--surface)",
        border: light ? "1px solid rgba(255,255,255,0.22)" : "1px solid var(--border)",
        backdropFilter: light ? "blur(8px)" : "none",
      }}
    >
      <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: light ? "rgba(255,255,255,0.22)" : "var(--bg-sunken)" }}>
        <Link2 size={13} color={light ? "#FFFFFF" : "var(--text)"} style={{ transform: "rotate(-45deg)" }} />
      </span>
      <span className="text-[12px] truncate" style={{ color: light ? "#FFFFFF" : "var(--text)", fontWeight: 700 }}>{site || host}</span>
      {site && (
        <span className="text-[11px] truncate" style={{ color: light ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>{host}</span>
      )}
      <ExternalLink size={12} color={light ? "rgba(255,255,255,0.8)" : "var(--text-muted)"} className="shrink-0" />
    </a>
  );
}

// One comment. Long-press (or right-click) opens its action sheet.
// Replies show who they answer: an @name at the start (added when you tap
// Reply, the way Instagram does it), or the parent's name for older replies.
function CommentRow({
  comment,
  replyToName,
  isReply,
  isPinned,
  isEditing,
  editText,
  onEditTextChange,
  onSaveEdit,
  onCancelEdit,
  onReact,
  onReply,
  onOpenMenu,
  onOpenProfile,
  onMention,
}) {
  const pressTimer = React.useRef(null);
  const startPress = () => {
    pressTimer.current = setTimeout(() => onOpenMenu(), 450);
  };
  const cancelPress = () => clearTimeout(pressTimer.current);
  const startsWithMention = /^@[a-zA-Z0-9_.]+/.test(comment.content || "");

  return (
    <div
      className="relative flex items-start gap-3 select-none"
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
      onContextMenu={(e) => {
        e.preventDefault();
        onOpenMenu();
      }}
    >
      <button onClick={onOpenProfile} className="shrink-0">
        <Avatar username={comment.username} avatarUrl={comment.avatarUrl} size={isReply ? 28 : 34} />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={onOpenProfile} className="text-[13px]" style={{ color: "var(--text)", fontWeight: 700 }}>{comment.username}</button>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{timeAgo(comment.created_at)}</span>
          {comment.edited_at && (
            <span className="text-[11px]" style={{ color: "var(--text-muted)", fontWeight: 600 }}>· Edited</span>
          )}
          {isPinned && (
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--border)", color: "var(--text-muted)", fontWeight: 600 }}>Author</span>
          )}
          {comment.restricted && (
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--border)", color: "var(--text-muted)" }}>
              Restricted · only you and them
            </span>
          )}
        </div>

        {isEditing ? (
          <div className="mt-1">
            <textarea
              ref={(el) => {
                // Put the cursor after the last letter, the way a real
                // message box does — not in front of the first one.
                if (!el || el.dataset.caretSet === "1") return;
                el.dataset.caretSet = "1";
                const end = el.value.length;
                el.focus();
                try {
                  el.setSelectionRange(end, end);
                } catch {}
                el.scrollTop = el.scrollHeight;
              }}
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              rows={2}
              className="w-full rounded-xl px-3 py-2 text-[13px] outline-none resize-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <div className="flex items-center gap-4 mt-1">
              <button onClick={onSaveEdit} className="text-xs" style={{ color: "var(--accent-solid)", fontWeight: 700 }}>Save</button>
              <button onClick={onCancelEdit} className="text-xs" style={{ color: "var(--text-muted)", fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {comment.content ? (
              <p className="text-[13px] mt-0.5" style={{ color: "var(--text)", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.4 }}>
                {isReply && !startsWithMention && replyToName && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onMention?.(replyToName);
                    }}
                    style={{ color: "var(--accent-solid)", fontWeight: 600 }}
                  >
                    @{replyToName}{" "}
                  </span>
                )}
                <MentionText text={comment.content} onMention={onMention} />
              </p>
            ) : null}
            {comment.image_url && (
              <img
                src={comment.image_url}
                alt=""
                loading="lazy"
                className="mt-1.5 rounded-xl object-cover"
                style={{ maxWidth: 190, maxHeight: 230, border: "1px solid var(--border)" }}
              />
            )}
            <div className="flex items-center gap-4 mt-1.5">
              <button onClick={onReply} className="text-xs" style={{ color: "var(--text-muted)", fontWeight: 600 }}>Reply</button>
              {comment.likedByAuthor && (
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  <Heart size={11} color="var(--heart)" fill="var(--heart)" /> by author
                </span>
              )}
              {comment.dislikeCount > 0 && (
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {comment.dislikeCount} {comment.dislikeCount === 1 ? "dislike" : "dislikes"}
                </span>
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col items-center shrink-0 pt-0.5" style={{ width: 30 }}>
        <button onClick={() => onReact("like")} className="flex flex-col items-center p-1 transition-transform active:scale-90" aria-label="Like comment">
          <Heart size={14} color={comment.myReaction === "like" ? "var(--heart)" : "var(--text-muted)"} fill={comment.myReaction === "like" ? "var(--heart)" : "none"} strokeWidth={2} />
          <span className="text-[10px] leading-none mt-1" style={{ color: "var(--text-muted)", minHeight: 10 }}>
            {comment.likeCount > 0 ? formatCount(comment.likeCount) : ""}
          </span>
        </button>
        <button onClick={() => onReact("dislike")} className="p-1 mt-0.5 transition-transform active:scale-90" aria-label="Dislike comment">
          <ThumbsDown size={13} color={comment.myReaction === "dislike" ? "var(--accent-end)" : "var(--text-muted)"} fill={comment.myReaction === "dislike" ? "var(--accent-end)" : "none"} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

// Long-press sheet for a comment.
function CommentActionSheet({ comment, isOwn, isPostOwner, onClose, onReply, onCopy, onEdit, onDelete, onReport, onPin }) {
  const editable = isOwn && canEditComment(comment);
  return (
    <StorySheetShell title="Comment" onClose={onClose}>
      <div className="px-4 pb-2">
        <div className="rounded-2xl px-3 py-2.5 mb-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-xs mb-0.5" style={{ color: "var(--text)", fontWeight: 700 }}>{comment.username}</p>
          <p className="text-[13px]" style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 90, overflow: "hidden" }}>
            {comment.content || "Photo"}
          </p>
        </div>
      </div>
      <div className="pb-6">
        <StoryMenuRow icon={<MessageCircle size={17} color="var(--text)" />} label="Reply" onClick={onReply} />
        {onPin && <StoryMenuRow icon={<Pin size={17} color="var(--text)" />} label={comment.pinned_at ? "Unpin comment" : "Pin comment"} onClick={onPin} />}
        {comment.content && <StoryMenuRow icon={<Copy size={17} color="var(--text)" />} label="Copy text" onClick={onCopy} />}
        {isOwn && (
          <StoryMenuRow
            icon={<Pencil size={17} color={editable ? "var(--text)" : "var(--text-muted)"} />}
            label={editable ? "Edit" : "Edit · only within 15 minutes"}
            onClick={editable ? onEdit : undefined}
          />
        )}
        {(isOwn || isPostOwner) && <StoryMenuRow icon={<Trash2 size={17} color="var(--heart)" />} label="Delete" danger onClick={onDelete} />}
        {!isOwn && <StoryMenuRow icon={<Flag size={17} color="var(--heart)" />} label="Report" danger onClick={onReport} />}
      </div>
    </StorySheetShell>
  );
}

const mockAccounts = [
  { id: 1, user: "nilufar.k", name: "Nilufar Khan", followers: "1.2K" },
  { id: 2, user: "rafiq.tech", name: "Rafiq Ahmed", followers: "845" },
  { id: 3, user: "meherun.a", name: "Meherun Akter", followers: "3.4K" },
  { id: 4, user: "tanvir.v", name: "Tanvir Islam", followers: "12.4K" },
  { id: 5, user: "priya.dances", name: "Priya Das", followers: "8.1K" },
  { id: 6, user: "shuvo.eats", name: "Shuvo Rahman", followers: "23K" },
];

const RECENT_SEARCH_KEY = "loop_recent_searches";
const readRecentSearches = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) || "[]") || [];
  } catch {
    return [];
  }
};
const writeRecentSearches = (list) => {
  try {
    localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(list.slice(0, 15)));
  } catch {}
};

function SearchScreen({ onOpenInterests, onOpenProfile, onOpenPost }) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(readRecentSearches);
  const [searchFocused, setSearchFocused] = useState(false);
  const remember = (entry) => {
    const next = [entry, ...recent.filter((x) => !(x.kind === entry.kind && x.id === entry.id))];
    setRecent(next);
    writeRecentSearches(next);
  };
  const forget = (entry) => {
    const next = recent.filter((x) => !(x.kind === entry.kind && x.id === entry.id));
    setRecent(next);
    writeRecentSearches(next);
  };
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  // Explore grid — real posts, no longer placeholder squares.
  const [explore, setExplore] = useState([]);
  const [exploreLoading, setExploreLoading] = useState(true);

  useEffect(() => {
    loadExplore();
  }, []);

  const loadExplore = async () => {
    setExploreLoading(true);
    const { data } = await supabase
      .from("posts")
      .select("id, user_id, media_url, media_type, media_count, caption, created_at, cover_url")
      .eq("archived", false)
      .order("created_at", { ascending: false })
      .limit(48);
    const rel = await getRelations();
    setExplore((data || []).filter((p) => !isHiddenFromFeed(rel, p.user_id) && new Date(p.created_at).getTime() <= Date.now()));
    setExploreLoading(false);
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      runSearch(query.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const runSearch = async (q) => {
    setSearching(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url")
      .or(`username.ilike.%${q}%,full_name.ilike.%${q}%`)
      .limit(20);
    const rel = await getRelations();
    // Someone who blocked you can't be found; someone you blocked still can,
    // so you can open their profile and unblock them.
    setResults((data || []).filter((a) => !rel.blockedBy.has(a.id)));
    setSearching(false);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <TopBar title="Search" />
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex-1 flex items-center gap-2.5 rounded-full px-4 h-11"
            style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}
          >
            <Search size={17} color="var(--text-muted)" />
            <input
              value={query}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accounts and #tags"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--text)" }}
            />
            {query && (
              <button onClick={() => setQuery("")} className="shrink-0">
                <X size={15} color="var(--text-muted)" />
              </button>
            )}
          </div>
          <button
            onClick={onOpenInterests}
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90"
            style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}
          >
            <SlidersHorizontal size={17} color="var(--text)" />
          </button>
        </div>
      </div>

      {!query && searchFocused && recent.length > 0 ? (
        <div className="px-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-[15px]" style={{ color: "var(--text)", fontWeight: 700 }}>Recent</span>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setRecent([]);
                writeRecentSearches([]);
              }}
              className="text-[13px]"
              style={{ color: "var(--accent-solid)", fontWeight: 600 }}
            >
              Clear all
            </button>
          </div>
          {recent.map((x) => (
            <div key={x.kind + x.id} className="flex items-center gap-3 py-2">
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  remember(x);
                  if (x.kind === "tag") window.dispatchEvent(new CustomEvent("loop:hashtag", { detail: x.id }));
                  else onOpenProfile(x.id);
                }}
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                {x.kind === "tag" ? (
                  <span className="w-[46px] h-[46px] rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 700, fontSize: 20 }}>#</span>
                ) : (
                  <Avatar username={x.username} avatarUrl={x.avatar_url} size={46} />
                )}
                <div className="min-w-0">
                  <p className="text-[13px] truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{x.kind === "tag" ? `#${x.id}` : x.username}</p>
                  {x.full_name && <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{x.full_name}</p>}
                </div>
              </button>
              <button onMouseDown={(e) => e.preventDefault()} onClick={() => forget(x)} aria-label="Remove">
                <X size={16} color="var(--text-muted)" />
              </button>
            </div>
          ))}
        </div>
      ) : query ? (
        <div className="px-4">
          {query.trim().startsWith("#") && query.trim().length > 1 && (
            <button
              onClick={() => {
                const tag = query.trim().slice(1).replace(/\s+/g, "");
                remember({ kind: "tag", id: tag });
                window.dispatchEvent(new CustomEvent("loop:hashtag", { detail: tag }));
              }}
              className="flex items-center gap-3 py-2.5 w-full text-left"
            >
              <span className="w-[46px] h-[46px] rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 700, fontSize: 20 }}>#</span>
              <span className="text-[13px]" style={{ color: "var(--text)", fontWeight: 600 }}>{query.trim().replace(/\s+/g, "")}</span>
            </button>
          )}
          {searching ? (
            <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>
              Searching...
            </p>
          ) : results.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>
              No accounts found
            </p>
          ) : (
            results.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  remember({ kind: "user", id: a.id, username: a.username, full_name: a.full_name || null, avatar_url: a.avatar_url || null });
                  onOpenProfile(a.id);
                }}
                className="flex items-center gap-3 py-2.5 w-full text-left"
              >
                <Avatar username={a.username} avatarUrl={a.avatar_url} size={46} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{a.username}</p>
                  {a.full_name && (
                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{a.full_name}</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      ) : exploreLoading ? (
        <div className="grid grid-cols-3 gap-0.5">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="aspect-square" style={{ background: "var(--border-subtle)" }} />
          ))}
        </div>
      ) : explore.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 px-8 text-center">
          <ImageIcon size={30} color="var(--toggle-off)" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Nothing to explore yet</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>New posts from everyone will show up here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5">
          {explore.map((p) => (
            <button
              key={p.id}
              onClick={() => onOpenPost?.(p.id)}
              className="aspect-square relative overflow-hidden"
              style={{ background: "var(--bg-sunken)" }}
            >
              <MediaThumb src={p.media_url} cover={p.cover_url} isVideo={!isPhotoPost(p)} />
              {p.media_count > 1 ? (
                <span className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }}>
                  <Layers size={13} color="#FFFFFF" />
                </span>
              ) : (
                !isPhotoPost(p) && (
                  <span className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }}>
                    <Video size={13} color="#FFFFFF" />
                  </span>
                )
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Post drafts ----
// Kept on this device in IndexedDB, the way Instagram keeps drafts on the
// phone. IndexedDB can hold the actual photo/video files, which localStorage
// can't, so a draft reopens with its media intact.
const DRAFT_DB = "loop-drafts";

function openDraftDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Drafts aren't supported in this browser"));
      return;
    }
    const req = indexedDB.open(DRAFT_DB, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("drafts", { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function draftTx(mode, fn) {
  const db = await openDraftDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("drafts", mode);
    const store = tx.objectStore("drafts");
    const req = fn(store);
    tx.oncomplete = () => resolve(req ? req.result : undefined);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error("Draft save was cancelled — the device may be out of space"));
  });
}

const listDrafts = () => draftTx("readonly", (st) => st.getAll());
const putDraft = (draft) => draftTx("readwrite", (st) => st.put(draft));
const deleteDraft = (id) => draftTx("readwrite", (st) => st.delete(id));

// Instagram lets you schedule up to 75 days ahead.
const SCHEDULE_MAX_DAYS = 75;

function toLocalInputValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Instagram's shapes: feed posts are portrait 4:5, square 1:1 or landscape
// 16:9; Reels and Stories are always 9:16. Posts from before this was saved
// show as 4:5.
const POST_ASPECTS = [
  { key: "4:5", label: "Portrait", css: "4 / 5", value: 4 / 5 },
  { key: "1:1", label: "Square", css: "1 / 1", value: 1 },
  { key: "16:9", label: "Landscape", css: "16 / 9", value: 16 / 9 },
];
function postAspectCss(post) {
  if (post?.aspect_ratio === "9:16") return "9 / 16";
  const found = POST_ASPECTS.find((a) => a.key === post?.aspect_ratio);
  return found ? found.css : "4 / 5";
}
// Pick the closest of the three for a file's natural shape.
function detectAspect(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const done = (w, h) => {
      URL.revokeObjectURL(url);
      if (!w || !h) return resolve("4:5");
      const ratio = w / h;
      let best = POST_ASPECTS[0];
      POST_ASPECTS.forEach((a) => {
        if (Math.abs(Math.log(ratio / a.value)) < Math.abs(Math.log(ratio / best.value))) best = a;
      });
      resolve(best.key);
    };
    if ((file.type || "").startsWith("video")) {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => done(v.videoWidth, v.videoHeight);
      v.onerror = () => done(0, 0);
      v.src = url;
    } else {
      const img = new Image();
      img.onload = () => done(img.naturalWidth, img.naturalHeight);
      img.onerror = () => done(0, 0);
      img.src = url;
    }
  });
}

// A caption box that offers usernames as soon as you type "@", so a
// mention always lands on a real account.
function CaptionBox({ value, onChange, placeholder, rows = 3 }) {
  const ref = React.useRef(null);
  const [matches, setMatches] = useState([]);
  const [term, setTerm] = useState(null); // the @word being typed, or null

  // What's being typed right before the cursor?
  const readTerm = (el) => {
    if (!el) return null;
    const upto = el.value.slice(0, el.selectionStart ?? el.value.length);
    const m = upto.match(/(^|[\s\n(])@([a-zA-Z0-9_.]{1,30})$/);
    return m ? m[2] : null;
  };

  useEffect(() => {
    if (term === null || term === "") {
      setMatches([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      const safe = term.replace(/[%_,()]/g, "");
      const [{ data }, rel, { data: { user } }] = await Promise.all([
        supabase.from("profiles").select("id, username, full_name, avatar_url").ilike("username", `${safe}%`).limit(8),
        getRelations(),
        supabase.auth.getUser(),
      ]);
      if (cancelled) return;
      setMatches((data || []).filter((pp) => pp.id !== user?.id && !isBlockedEither(rel, pp.id)).slice(0, 6));
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [term]);

  const pick = (username) => {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart ?? value.length;
    const before = value.slice(0, pos).replace(/@([a-zA-Z0-9_.]{1,30})$/, `@${username} `);
    const next = before + value.slice(pos);
    onChange(next);
    setTerm(null);
    setMatches([]);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(before.length, before.length);
    }, 0);
  };

  return (
    <div className="mb-3">
      <textarea
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setTerm(readTerm(e.target));
        }}
        onKeyUp={(e) => setTerm(readTerm(e.currentTarget))}
        onClick={(e) => setTerm(readTerm(e.currentTarget))}
        onBlur={() => setTimeout(() => setTerm(null), 150)}
        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
      />
      {matches.length > 0 && (
        <div className="rounded-xl overflow-hidden mt-1" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {matches.map((pp) => (
            <button
              key={pp.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(pp.username)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <Avatar username={pp.username} avatarUrl={pp.avatar_url} size={30} />
              <div className="min-w-0">
                <p className="text-[13px] truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{pp.username}</p>
                {pp.full_name && <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>{pp.full_name}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
      <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
        Type @ to mention someone, # for a tag.
      </p>
    </div>
  );
}

// Pick the picture people see before a video plays: slide along the
// video and take that moment, or use a picture from the gallery.
function CoverPicker({ videoUrl, coverUrl, onPick, onClear, label = "Cover" }) {
  const [duration, setDuration] = useState(0);
  const [at, setAt] = useState(0.1);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const fileRef = React.useRef(null);
  const previewRef = React.useRef(null);

  const takeFrame = async () => {
    setBusy(true);
    setNote("");
    try {
      const blob = await grabVideoFrame(videoUrl, at);
      onPick(new File([blob], "cover.jpg", { type: "image/jpeg" }));
      setOpen(false);
    } catch (e) {
      setNote(e?.message || "Loop couldn't take that frame — pick a picture instead");
    }
    setBusy(false);
  };

  return (
    <div className="rounded-xl mb-3 overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) {
            onPick(f);
            setOpen(false);
          }
        }}
      />
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div className="rounded-lg overflow-hidden shrink-0" style={{ width: 44, height: 58, background: "var(--bg-sunken)" }}>
          {coverUrl ? (
            <img src={coverUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <video src={videoThumb(videoUrl)} className="w-full h-full object-cover" muted playsInline preload="metadata" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>{label}</p>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {coverUrl ? "Your own picture" : "The video's first moment"}
          </p>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg px-3 h-8 text-xs shrink-0"
          style={{ background: "var(--bg-sunken)", color: "var(--text)", fontWeight: 700, border: "1px solid var(--border)" }}
        >
          {open ? "Done" : "Change"}
        </button>
        {coverUrl && onClear && (
          <button onClick={onClear} aria-label="Remove cover" className="shrink-0">
            <X size={15} color="var(--text-muted)" />
          </button>
        )}
      </div>

      {open && (
        <div className="px-3 pb-3" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="rounded-xl overflow-hidden mt-3 mx-auto" style={{ width: 150, aspectRatio: "9 / 16", background: "#000" }}>
            <video
              ref={previewRef}
              src={videoUrl}
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              onLoadedMetadata={(e) => {
                setDuration(e.currentTarget.duration || 0);
                e.currentTarget.currentTime = 0.1;
              }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={Math.max(duration - 0.05, 0.1)}
            step={0.05}
            value={at}
            onChange={(e) => {
              const v = Number(e.target.value);
              setAt(v);
              if (previewRef.current) {
                try {
                  previewRef.current.currentTime = v;
                } catch {}
              }
            }}
            className="w-full mt-3"
            style={{ accentColor: "var(--accent-solid)" }}
          />
          <p className="text-[11px] text-center" style={{ color: "var(--text-muted)" }}>
            Slide to the moment you want · {at.toFixed(1)}s
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={takeFrame}
              disabled={busy}
              className="flex-1 rounded-lg h-9 text-xs"
              style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busy ? 0.6 : 1 }}
            >
              {busy ? "Taking…" : "Use this moment"}
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-1 rounded-lg h-9 text-xs"
              style={{ background: "var(--bg-sunken)", color: "var(--text)", fontWeight: 700, border: "1px solid var(--border)" }}
            >
              From gallery
            </button>
          </div>
          {note && <p className="text-[11px] mt-2 text-center" style={{ color: "var(--heart)" }}>{note}</p>}
        </div>
      )}
    </div>
  );
}

// Tag people: search by username, pick from the list, shown as chips.
function TagPeoplePicker({ value, onChange, title = "Tag people", max = 20, hint }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [me, setMe] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMe(data?.user?.id || null));
  }, []);

  useEffect(() => {
    const term = q.trim().replace(/^@/, "");
    if (!term) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      const safe = term.replace(/[%_,()]/g, "");
      const [{ data }, rel] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .or(`username.ilike.%${safe}%,full_name.ilike.%${safe}%`)
          .limit(12),
        getRelations(),
      ]);
      if (cancelled) return;
      const picked = new Set(value.map((p) => p.id));
      setResults((data || []).filter((p) => p.id !== me && !picked.has(p.id) && !isBlockedEither(rel, p.id)).slice(0, 8));
    }, 220);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, value, me]);

  const add = (p) => {
    if (value.length >= max) return;
    onChange([...value, p]);
    setQ("");
    setResults([]);
  };

  return (
    <div className="rounded-xl mb-4 overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <UserPlus size={15} color="var(--text-muted)" />
        <span className="text-sm flex-1" style={{ color: "var(--text)", fontWeight: 600 }}>{title}</span>
        {value.length > 0 && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{max < 20 ? `${value.length}/${max}` : value.length}</span>
        )}
      </div>
      {hint && (
        <p className="px-3 -mt-1.5 pb-2 text-[11px]" style={{ color: "var(--text-muted)" }}>{hint}</p>
      )}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-3 pb-2">
          {value.map((p) => (
            <span key={p.id} className="flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
              <Avatar username={p.username} avatarUrl={p.avatar_url} size={20} />
              <span className="text-xs" style={{ color: "var(--text)", fontWeight: 600 }}>{p.username}</span>
              <button onClick={() => onChange(value.filter((x) => x.id !== p.id))} aria-label={`Remove ${p.username}`}>
                <X size={12} color="var(--text-muted)" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="px-3 pb-2.5" style={{ display: value.length >= max ? "none" : undefined }}>
        <div className="flex items-center gap-2 rounded-lg px-2.5 h-9" style={{ background: "var(--bg-sunken)" }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search people"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text)" }}
          />
          {q && (
            <button onClick={() => setQ("")}>
              <X size={13} color="var(--text-muted)" />
            </button>
          )}
        </div>
        {results.length > 0 && (
          <div className="mt-1.5">
            {results.map((p) => (
              <button key={p.id} onClick={() => add(p)} className="w-full flex items-center gap-2.5 py-1.5 text-left">
                <Avatar username={p.username} avatarUrl={p.avatar_url} size={34} />
                <div className="min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{p.username}</p>
                  {p.full_name && <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>{p.full_name}</p>}
                </div>
              </button>
            ))}
          </div>
        )}
        {q.trim() && results.length === 0 && (
          <p className="text-[11px] mt-1.5" style={{ color: "var(--text-muted)" }}>No matching accounts</p>
        )}
      </div>
    </div>
  );
}

function UploadScreen({ initialMode = "photo" }) {
  const [mode, setMode] = useState(initialMode);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  // "photo" mode carries a carousel: 1-20 photos and/or videos, mixed.
  // "reel" mode stays single-video, using `file`/`previewUrl` above unchanged.
  const [items, setItems] = useState([]); // [{ file, url, type }]
  const [limitNotice, setLimitNotice] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [hideLikes, setHideLikes] = useState(false);
  const [hideComments, setHideComments] = useState(false);
  const [hideRepostsSaves, setHideRepostsSaves] = useState(false);
  const [turnOffComments, setTurnOffComments] = useState(false);
  const [tagInput, setTagInput] = useState(""); // only read from old drafts
  const [taggedPeople, setTaggedPeople] = useState([]); // [{id, username, avatar_url}]
  const [collabPeople, setCollabPeople] = useState([]); // invited collaborators (max 3)
  const [aspect, setAspect] = useState("4:5");
  const [linkUrl, setLinkUrl] = useState("");
  const [coverFile, setCoverFile] = useState(null); // the picture shown before the video plays
  const [coverUrl, setCoverUrl] = useState(null); // its preview
  // A single video — in Reel mode or as a one-video post — gets a cover
  // picture. A carousel or a photo doesn't need one.
  const videoForCover =
    mode === "reel"
      ? previewUrl
      : items.length === 1 && items[0]?.type === "video"
      ? items[0].url
      : null;
  const [pollEnabled, setPollEnabled] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const carouselInputRef = React.useRef(null);
  const [scheduleOn, setScheduleOn] = useState(false);
  const [scheduleAt, setScheduleAt] = useState(""); // datetime-local value
  const [drafts, setDrafts] = useState([]);
  const [draftsOpen, setDraftsOpen] = useState(false);
  const [draftId, setDraftId] = useState(null); // set when editing a saved draft
  const [draftNote, setDraftNote] = useState("");
  const [postedScheduled, setPostedScheduled] = useState(null); // Date when last share was scheduled

  const refreshDrafts = () =>
    listDrafts()
      .then((d) => setDrafts((d || []).sort((a, b) => b.savedAt - a.savedAt)))
      .catch(() => setDrafts([]));

  useEffect(() => {
    refreshDrafts();
  }, []);

  const hasContent = mode === "reel" ? !!file : items.length > 0;

  const saveDraft = async () => {
    if (!hasContent && !caption.trim()) {
      setDraftNote("Add a photo, video or caption first.");
      return;
    }
    const id = draftId || `d${Date.now()}`;
    try {
      await putDraft({
        id,
        savedAt: Date.now(),
        mode,
        reelFile: mode === "reel" ? file : null,
        files: mode === "reel" ? [] : items.map((it) => it.file),
        caption,
        location,
        hideLikes,
        hideComments,
        hideRepostsSaves,
        turnOffComments,
        tagInput,
        taggedPeople,
        aspect,
        pollEnabled,
        pollQuestion,
        pollOptions,
        scheduleOn,
        scheduleAt,
      });
    } catch (e) {
      setDraftNote(e.message || "Couldn't save the draft");
      return;
    }
    setDraftId(id);
    setDraftNote("Saved to drafts on this device");
    setTimeout(() => setDraftNote(""), 2000);
    refreshDrafts();
  };

  const openDraft = (d) => {
    items.forEach((it) => URL.revokeObjectURL(it.url));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setMode(d.mode);
    if (d.mode === "reel" && d.reelFile) {
      setFile(d.reelFile);
      setPreviewUrl(URL.createObjectURL(d.reelFile));
      setItems([]);
    } else {
      setFile(null);
      setPreviewUrl(null);
      setItems(
        (d.files || []).map((f) => ({
          file: f,
          url: URL.createObjectURL(f),
          type: (f.type || "").startsWith("video") ? "video" : "photo",
        }))
      );
    }
    setCaption(d.caption || "");
    setLocation(d.location || "");
    setHideLikes(!!d.hideLikes);
    setHideComments(!!d.hideComments);
    setHideRepostsSaves(!!d.hideRepostsSaves);
    setTurnOffComments(!!d.turnOffComments);
    setTagInput(d.tagInput || "");
    setTaggedPeople(Array.isArray(d.taggedPeople) ? d.taggedPeople : []);
    setAspect(d.aspect || "4:5");
    setPollEnabled(!!d.pollEnabled);
    setPollQuestion(d.pollQuestion || "");
    setPollOptions(d.pollOptions && d.pollOptions.length >= 2 ? d.pollOptions : ["", ""]);
    setScheduleOn(!!d.scheduleOn);
    setScheduleAt(d.scheduleAt || "");
    setDraftId(d.id);
    setDraftsOpen(false);
    setError("");
  };

  const removeDraft = async (id) => {
    try {
      await deleteDraft(id);
    } catch {}
    if (draftId === id) setDraftId(null);
    refreshDrafts();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (selected.size > MAX_UPLOAD_VIDEO_BYTES) {
      setError("That video is over 50 MB — pick a shorter one.");
      e.target.value = "";
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError("");
  };

  // Each pick is appended to whatever's already chosen — picking again
  // doesn't replace the set, it adds to it — capped at 20 total, matching
  // Instagram's own carousel limit.
  const handleCarouselFilesChange = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    if (picked.length === 0) return;
    setError("");
    const tooBig = picked.filter((f) => (f.type || "").startsWith("video") && f.size > MAX_UPLOAD_VIDEO_BYTES);
    if (tooBig.length) {
      setLimitNotice("Videos over 50 MB were skipped — pick shorter ones.");
      picked.splice(0, picked.length, ...picked.filter((f) => !tooBig.includes(f)));
      if (picked.length === 0) return;
    }
    // The first pick decides the shape (you can still change it).
    if (items.length === 0) detectAspect(picked[0]).then(setAspect);
    setItems((prev) => {
      const combined = [
        ...prev,
        ...picked.map((f) => ({
          file: f,
          url: URL.createObjectURL(f),
          type: f.type.startsWith("video") ? "video" : "photo",
        })),
      ];
      if (combined.length > 20) {
        setLimitNotice("Only the first 20 are kept — that's the most a single post can hold.");
        return combined.slice(0, 20);
      }
      setLimitNotice("");
      return combined;
    });
  };

  const removeItem = (index) => {
    setItems((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
    setLimitNotice("");
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl(null);
    items.forEach((it) => URL.revokeObjectURL(it.url));
    setItems([]);
    setLimitNotice("");
    setCaption("");
    setLocation("");
    setHideLikes(false);
    setHideComments(false);
    setHideRepostsSaves(false);
    setTurnOffComments(false);
    setTagInput("");
    setTaggedPeople([]);
    setCollabPeople([]);
    setAspect("4:5");
    setLinkUrl("");
    if (coverUrl) URL.revokeObjectURL(coverUrl);
    setCoverFile(null);
    setCoverUrl(null);
    setPollEnabled(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setScheduleOn(false);
    setScheduleAt("");
    setDraftId(null);
    setDraftNote("");
    setPostedScheduled(null);
    setSuccess(false);
  };

  const handleShare = async () => {
    setError("");

    if (mode === "reel") {
      if (!file) {
        setError("Choose a video first");
        return;
      }
    } else if (items.length === 0) {
      setError("Choose at least one photo or video");
      return;
    }

    if (pollEnabled) {
      const filledOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
      if (!pollQuestion.trim() || filledOptions.length < 2) {
        setError("A poll needs a question and at least 2 options");
        return;
      }
    }

    let cleanLink = linkUrl.trim();
    if (cleanLink) {
      if (!/^https?:\/\//i.test(cleanLink)) cleanLink = `https://${cleanLink}`;
      try {
        const u = new URL(cleanLink);
        if (!u.hostname.includes(".")) throw new Error("bad");
      } catch (e) {
        setError("That link doesn't look right");
        return;
      }
    } else {
      cleanLink = null;
    }

    let scheduledFor = null;
    if (scheduleOn) {
      const when = scheduleAt ? new Date(scheduleAt) : null;
      if (!when || isNaN(when.getTime())) {
        setError("Pick a date and time to schedule for");
        return;
      }
      if (when.getTime() < Date.now() + 5 * 60 * 1000) {
        setError("Schedule at least 5 minutes from now");
        return;
      }
      if (when.getTime() > Date.now() + SCHEDULE_MAX_DAYS * 24 * 60 * 60 * 1000) {
        setError(`You can schedule up to ${SCHEDULE_MAX_DAYS} days ahead`);
        return;
      }
      scheduledFor = when;
    }
    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploading(false);
      setError("Not logged in");
      return;
    }

    let coverImage;
    let customCover = null;
    let carouselUploads = null; // set only when items.length > 1

    // Every video gets a cover picture. If you picked one, that's used;
    // if not, Loop quietly takes the video's own first moment, so the
    // grid never shows a black square.
    if (videoForCover) {
      try {
        let coverBlob = coverFile;
        if (!coverBlob) coverBlob = await grabVideoFrame(videoForCover, 0.1);
        const small = coverBlob instanceof File ? await compressImage(coverBlob, 1080) : coverBlob;
        customCover = await uploadCoverBlob(small, user.id);
      } catch (e) {
        // A missing cover is never a reason to lose the post.
        customCover = null;
      }
    }

    if (mode === "reel") {
      const filePath = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: uploadError } = await supabase.storage.from("posts").upload(filePath, file);
      if (uploadError) {
        setUploading(false);
        setError(uploadError.message);
        return;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("posts").getPublicUrl(filePath);
      coverImage = publicUrl;
    } else if (items.length === 1) {
      // The overwhelming common case — identical to the original single-post
      // path, so it never touches post_media at all.
      const only = items[0];
      const onlyFile = await compressImage(only.file);
      const filePath = `${user.id}/${Date.now()}-${onlyFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: uploadError } = await supabase.storage.from("posts").upload(filePath, onlyFile);
      if (uploadError) {
        setUploading(false);
        setError(uploadError.message);
        return;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("posts").getPublicUrl(filePath);
      coverImage = publicUrl;
    } else {
      // Carousel: upload every item in parallel. Promise.all keeps results
      // in the original selection order regardless of which finishes first.
      try {
        carouselUploads = await Promise.all(
          items.map(async (it, i) => {
            const upFile = await compressImage(it.file);
            const filePath = `${user.id}/${Date.now()}-${i}-${upFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
            const { error: uploadError } = await supabase.storage.from("posts").upload(filePath, upFile);
            if (uploadError) throw uploadError;
            const {
              data: { publicUrl },
            } = supabase.storage.from("posts").getPublicUrl(filePath);
            return { url: publicUrl, type: it.type };
          })
        );
      } catch (e) {
        setUploading(false);
        setError(e.message || "One of the files failed to upload");
        return;
      }
      coverImage = carouselUploads[0].url;
    }

    const { data: insertedPost, error: insertError } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        media_url: coverImage,
        cover_url: customCover,
        // A carousel is a feed post regardless of what its individual slides
        // are — only single-video uploads through Reel mode ever get tagged
        // "reel", matching how Reels actually work on Instagram.
        media_type: mode === "reel" ? "reel" : items.length === 1 && items[0].type === "video" ? "video" : "photo",
        aspect_ratio: mode === "reel" ? "9:16" : aspect,
        link_url: cleanLink,
        caption,
        location: location.trim() || null,
        hide_likes: hideLikes,
        hide_comments: hideComments,
        hide_reposts: hideRepostsSaves,
        hide_saves: hideRepostsSaves,
        comments_disabled: turnOffComments,
        // A scheduled post is simply one whose time is in the future. The
        // database keeps it hidden from everyone else until then, and it
        // lands in the feed in the right place when that moment arrives.
        ...(scheduledFor ? { created_at: scheduledFor.toISOString() } : {}),
      })
      .select("id")
      .single();

    if (insertError) {
      setUploading(false);
      setError(insertError.message);
      return;
    }

    if (carouselUploads) {
      const { error: mediaError } = await supabase.from("post_media").insert(
        carouselUploads.map((u, i) => ({
          post_id: insertedPost.id,
          media_url: u.url,
          media_type: u.type,
          position: i,
        }))
      );
      if (mediaError) {
        // The post row exists with just its cover image at this point —
        // rather than claim success while slides 2+ never attached, say so.
        setUploading(false);
        setError(`Post created, but the rest of the carousel didn't save: ${mediaError.message}`);
        return;
      }
    }

    // Best-effort: tag people — from the dedicated field AND any @username
    // written directly in the caption (skips silently if a username isn't found)
    const captionMentions = (caption.match(/@([a-zA-Z0-9_.]+)/g) || []).map((m) => m.slice(1));
    const usernames = [
      ...tagInput.split(/[,\s]+/).map((u) => u.replace(/^@/, "").trim()),
      ...captionMentions,
    ].filter(Boolean);
    const uniqueUsernames = [...new Set(usernames)];
    try {
      const ids = new Set(taggedPeople.map((p) => p.id));
      if (uniqueUsernames.length > 0) {
        const { data: matchedProfiles } = await supabase.from("profiles").select("id").in("username", uniqueUsernames);
        (matchedProfiles || []).forEach((p) => ids.add(p.id));
      }
      ids.delete(user.id);
      if (ids.size > 0) {
        const rows = [...ids].map((id) => ({ post_id: insertedPost.id, tagged_user_id: id }));
        const { error: tagErr } = await supabase.from("post_tags").insert(rows);
        // Tell people they were tagged — but not before a scheduled post is out.
        if (!tagErr && !scheduledFor) {
          await supabase
            .from("notifications")
            .insert([...ids].map((id) => ({ user_id: id, actor_id: user.id, type: "tag", post_id: insertedPost.id })));
        }
      }
    } catch (e) {
      // Tagging is best-effort — never block publishing over it
    }

    // Collaboration invites — they accept or decline from Notifications.
    if (collabPeople.length > 0) {
      try {
        const invitees = collabPeople.filter((pp) => pp.id !== user.id).slice(0, 3);
        const { error: collabErr } = await supabase
          .from("post_collaborators")
          .insert(invitees.map((pp) => ({ post_id: insertedPost.id, user_id: pp.id })));
        if (!collabErr) {
          await supabase
            .from("notifications")
            .insert(invitees.map((pp) => ({ user_id: pp.id, actor_id: user.id, type: "collab", post_id: insertedPost.id })));
        }
      } catch (e) {
        // never block the post over invites
      }
    }

    // Best-effort: create the poll
    if (pollEnabled) {
      try {
        const { data: pollRow } = await supabase
          .from("polls")
          .insert({ post_id: insertedPost.id, question: pollQuestion.trim() })
          .select("id")
          .single();
        if (pollRow) {
          const filledOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
          await supabase.from("poll_options").insert(
            filledOptions.map((text, i) => ({ poll_id: pollRow.id, option_text: text, position: i }))
          );
        }
      } catch (e) {
        // Poll creation is best-effort — never block publishing over it
      }
    }

    if (draftId) {
      try {
        await deleteDraft(draftId);
      } catch {}
      setDraftId(null);
      refreshDrafts();
    }

    setPostedScheduled(scheduledFor);
    setUploading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
          style={{ background: ACCENT }}
        >
          <PlusSquare size={24} color="var(--on-accent)" />
        </div>
        <p className="text-sm mb-1" style={{ color: "var(--text)", fontWeight: 600 }}>
          {postedScheduled ? "Scheduled!" : "Posted!"}
        </p>
        {postedScheduled && (
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            It goes live {postedScheduled.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}. Until
            then only you can see it, on your profile.
          </p>
        )}
        {!postedScheduled && <div className="mb-3" />}
        <button
          onClick={resetForm}
          className="rounded-xl px-5 py-2.5 text-sm"
          style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700 }}
        >
          Create another post
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <TopBar title="New Post" />
      <div className="px-4">
        {drafts.length > 0 && (
          <button
            onClick={() => setDraftsOpen(true)}
            className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 mb-3 transition-transform active:scale-[0.99]"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span className="flex items-center gap-2 text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>
              <Pencil size={14} /> Drafts
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {drafts.length} saved on this device
            </span>
          </button>
        )}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setMode("photo");
              setFile(null);
              setPreviewUrl(null);
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition"
            style={{
              background: mode === "photo" ? ACCENT : "var(--surface)",
              color: "var(--text)",
              fontWeight: 600,
              border: mode === "photo" ? "none" : "1px solid var(--border)",
            }}
          >
            <Layers size={16} /> Post
          </button>
          <button
            onClick={() => {
              setMode("reel");
              items.forEach((it) => URL.revokeObjectURL(it.url));
              setItems([]);
              setLimitNotice("");
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition"
            style={{
              background: mode === "reel" ? ACCENT : "var(--surface)",
              color: "var(--text)",
              fontWeight: 600,
              border: mode === "reel" ? "none" : "1px solid var(--border)",
            }}
          >
            <Video size={16} /> Reel
          </button>
        </div>

        {mode === "reel" ? (
          <label
            className="rounded-2xl flex flex-col items-center justify-center gap-2 mb-4 overflow-hidden mx-auto"
            style={{ background: "var(--surface)", border: "1.5px dashed var(--toggle-off)", aspectRatio: "9 / 16", width: "62%" }}
          >
            <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
            {previewUrl ? (
              <video src={previewUrl} poster={coverUrl || undefined} className="w-full h-full object-cover" controls />
            ) : (
              <>
                <Video size={28} color="var(--text-muted)" />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Choose a video</span>
              </>
            )}
          </label>
        ) : (
          <div className="mb-4">
            <input
              ref={carouselInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleCarouselFilesChange}
              className="hidden"
            />

            {items.length === 0 ? (
              <label
                onClick={() => carouselInputRef.current?.click()}
                className="rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 overflow-hidden cursor-pointer"
                style={{ background: "var(--surface)", border: "1.5px dashed var(--toggle-off)" }}
              >
                <Layers size={28} color="var(--text-muted)" />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Choose photos and videos</span>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Up to 20, mixed however you like</span>
              </label>
            ) : (
              <>
                <div className="rounded-2xl overflow-hidden mb-2 mx-auto" style={{ background: "var(--bg-sunken)", aspectRatio: POST_ASPECTS.find((a) => a.key === aspect)?.css || "4 / 5", width: aspect === "16:9" ? "100%" : "82%" }}>
                  {items[0].type === "photo" ? (
                    <img src={items[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <video src={items[0].url} className="w-full h-full object-cover" muted playsInline autoPlay loop />
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  {POST_ASPECTS.map((a) => (
                    <button
                      key={a.key}
                      onClick={() => setAspect(a.key)}
                      className="flex items-center gap-1.5 rounded-full px-3 h-8 text-xs"
                      style={{
                        background: aspect === a.key ? "var(--text)" : "var(--surface)",
                        color: aspect === a.key ? "var(--bg)" : "var(--text)",
                        border: "1px solid var(--border)",
                        fontWeight: 600,
                      }}
                    >
                      <span
                        className="inline-block rounded-[3px]"
                        style={{ border: `1.5px solid ${aspect === a.key ? "var(--bg)" : "var(--text)"}`, width: a.key === "16:9" ? 14 : a.key === "1:1" ? 11 : 10, height: a.key === "16:9" ? 8 : a.key === "1:1" ? 11 : 12.5 }}
                      />
                      {a.key}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {items.length === 1 ? "1 item" : `${items.length} items — swipe through them like a post`}
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{items.length}/20</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {items.map((it, i) => (
                    <div key={i} className="relative shrink-0 rounded-xl overflow-hidden" style={{ width: 84, height: 84, background: "var(--surface)" }}>
                      {it.type === "photo" ? (
                        <img src={it.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <video src={it.url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                      )}
                      {it.type === "video" && (
                        <span className="absolute bottom-1 left-1" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))" }}>
                          <Video size={12} color="#FFFFFF" />
                        </span>
                      )}
                      {i === 0 && (
                        <span
                          className="absolute top-1 left-1 rounded-full px-1.5 py-0.5 text-[9px]"
                          style={{ background: "rgba(0,0,0,0.6)", color: "#FFFFFF", fontWeight: 700 }}
                        >
                          Cover
                        </span>
                      )}
                      <button
                        onClick={() => removeItem(i)}
                        className="absolute top-1 right-1 rounded-full flex items-center justify-center"
                        style={{ width: 18, height: 18, background: "rgba(0,0,0,0.65)" }}
                      >
                        <X size={11} color="#FFFFFF" />
                      </button>
                    </div>
                  ))}
                  {items.length < 20 && (
                    <button
                      onClick={() => carouselInputRef.current?.click()}
                      className="shrink-0 rounded-xl flex items-center justify-center"
                      style={{ width: 84, height: 84, background: "var(--surface)", border: "1.5px dashed var(--toggle-off)" }}
                    >
                      <Plus size={22} color="var(--text-muted)" />
                    </button>
                  )}
                </div>
                {limitNotice && (
                  <p className="text-[11px] mt-1.5" style={{ color: "var(--heart)" }}>{limitNotice}</p>
                )}
              </>
            )}
          </div>
        )}

        {videoForCover && (
          <CoverPicker
            videoUrl={videoForCover}
            coverUrl={coverUrl}
            onPick={(f) => {
              if (coverUrl) URL.revokeObjectURL(coverUrl);
              setCoverFile(f);
              setCoverUrl(URL.createObjectURL(f));
            }}
            onClear={() => {
              URL.revokeObjectURL(coverUrl);
              setCoverFile(null);
              setCoverUrl(null);
            }}
          />
        )}

        <CaptionBox value={caption} onChange={setCaption} placeholder="Write a caption..." />

        <div
          className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm mb-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <MapPin size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Add location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>

        <div
          className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm mb-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Link2 size={15} color="var(--text-muted)" />
          <input
            type="url"
            inputMode="url"
            placeholder="Add a link (optional)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>

        <TagPeoplePicker value={taggedPeople} onChange={setTaggedPeople} />
        <TagPeoplePicker
          value={collabPeople}
          onChange={setCollabPeople}
          title="Invite collaborators"
          max={3}
          hint="If they accept, this post shows on their profile too, with both your names on it."
        />

        {/* Poll */}
        <div className="rounded-xl mb-4 overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <button
            onClick={() => setPollEnabled((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2.5"
          >
            <span className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>Add a poll</span>
            <span className="rounded-full" style={{ width: 34, height: 19, background: pollEnabled ? ACCENT : "var(--toggle-off)", position: "relative" }}>
              <span className="rounded-full bg-white absolute" style={{ width: 15, height: 15, top: 2, left: pollEnabled ? 17 : 2, transition: "left 0.15s" }} />
            </span>
          </button>
          {pollEnabled && (
            <div className="px-3 pb-3">
              <input
                type="text"
                placeholder="Ask a question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm mb-2 outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
              {pollOptions.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const next = [...pollOptions];
                    next[i] = e.target.value;
                    setPollOptions(next);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-sm mb-2 outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
              ))}
              {pollOptions.length < 4 && (
                <button
                  onClick={() => setPollOptions((prev) => [...prev, ""])}
                  className="text-xs"
                  style={{ color: "var(--accent-start)", fontWeight: 600 }}
                >
                  + Add option
                </button>
              )}
            </div>
          )}
        </div>

        {/* Per-post privacy settings */}
        <div className="rounded-xl mb-4 overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {[
            [
              "Hide counts",
              hideLikes && hideComments && hideRepostsSaves,
              (v) => {
                setHideLikes(v);
                setHideComments(v);
                setHideRepostsSaves(v);
              },
              "Only you will see the like, comment, repost and save counts on this post.",
            ],
            ["Turn off commenting", turnOffComments, setTurnOffComments, "You can change this later from the ⋯ menu on your post."],
          ].map(([label, value, setValue, hint], i) => (
            <button
              key={label}
              onClick={() => setValue(!value)}
              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
              style={{ color: "var(--text)", borderTop: i > 0 ? "1px solid var(--border)" : "none", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>
                <span className="block">{label}</span>
                {hint && <span className="block text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{hint}</span>}
              </span>
              <span className="rounded-full shrink-0" style={{ width: 34, height: 19, background: value ? ACCENT : "var(--toggle-off)", position: "relative" }}>
                <span className="rounded-full bg-white absolute" style={{ width: 15, height: 15, top: 2, left: value ? 17 : 2, transition: "left 0.15s" }} />
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-xl mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <button
            onClick={() => {
              const next = !scheduleOn;
              setScheduleOn(next);
              if (next && !scheduleAt) {
                // Default to the next round hour, at least an hour out.
                const d = new Date(Date.now() + 60 * 60 * 1000);
                d.setMinutes(0, 0, 0);
                setScheduleAt(toLocalInputValue(d));
              }
            }}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
            style={{ color: "var(--text)", textAlign: "left" }}
          >
            <span className="flex items-center gap-2">
              <Clock size={15} color="var(--text-muted)" /> Schedule this post
            </span>
            <span className="rounded-full shrink-0" style={{ width: 34, height: 19, background: scheduleOn ? ACCENT : "var(--toggle-off)", position: "relative" }}>
              <span className="rounded-full bg-white absolute" style={{ width: 15, height: 15, top: 2, left: scheduleOn ? 17 : 2, transition: "left 0.15s" }} />
            </span>
          </button>
          {scheduleOn && (
            <div className="px-3 pb-3" style={{ borderTop: "1px solid var(--border)" }}>
              <input
                type="datetime-local"
                value={scheduleAt}
                min={toLocalInputValue(new Date(Date.now() + 5 * 60 * 1000))}
                max={toLocalInputValue(new Date(Date.now() + SCHEDULE_MAX_DAYS * 24 * 60 * 60 * 1000))}
                onChange={(e) => setScheduleAt(e.target.value)}
                className="w-full rounded-lg px-3 h-10 text-sm outline-none mt-2.5"
                style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)", colorScheme: "dark light" }}
              />
              <p className="text-[11px] mt-1.5" style={{ color: "var(--text-muted)" }}>
                Hidden from everyone but you until then. Up to {SCHEDULE_MAX_DAYS} days ahead.
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs mb-3" style={{ color: "var(--heart)" }}>
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={saveDraft}
            disabled={uploading}
            className="rounded-xl px-4 py-3 text-sm shrink-0 transition-transform active:scale-[0.98]"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600 }}
          >
            {draftId ? "Update draft" : "Save draft"}
          </button>
          <button
            onClick={handleShare}
            disabled={uploading}
            className="flex-1 rounded-xl py-3 text-sm transition-transform active:scale-[0.98]"
            style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: uploading ? 0.7 : 1 }}
          >
            {uploading ? "Uploading..." : scheduleOn ? "Schedule" : "Share"}
          </button>
        </div>
        {draftNote && (
          <p className="text-[11px] mt-2 text-center" style={{ color: "var(--text-muted)" }}>{draftNote}</p>
        )}
      </div>

      {draftsOpen && (
        <StorySheetShell title="Drafts" onClose={() => setDraftsOpen(false)}>
          <p className="text-[11px] px-4 pb-2" style={{ color: "var(--text-muted)" }}>
            Saved on this device only. Clearing the browser's site data removes them.
          </p>
          <div className="pb-6">
            {drafts.length === 0 ? (
              <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>No drafts</p>
            ) : (
              drafts.map((d) => (
                <DraftRow key={d.id} draft={d} onOpen={() => openDraft(d)} onDelete={() => removeDraft(d.id)} />
              ))
            )}
          </div>
        </StorySheetShell>
      )}
    </div>
  );
}

// Thumbnail URLs are created and released per row, so opening the drafts
// sheet repeatedly doesn't leak object URLs.
function DraftRow({ draft, onOpen, onDelete }) {
  const first = draft.mode === "reel" ? draft.reelFile : (draft.files || [])[0];
  const [thumb, setThumb] = useState(null);

  useEffect(() => {
    if (!first) return;
    const url = URL.createObjectURL(first);
    setThumb(url);
    return () => URL.revokeObjectURL(url);
  }, [draft.id]);

  const isVideo = first && (first.type || "").startsWith("video");
  const count = draft.mode === "reel" ? (draft.reelFile ? 1 : 0) : (draft.files || []).length;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <button onClick={onOpen} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        <div className="rounded-xl overflow-hidden shrink-0 flex items-center justify-center" style={{ width: 52, height: 52, background: "var(--surface)", border: "1px solid var(--border)" }}>
          {thumb ? (
            isVideo ? (
              <video src={videoThumb(thumb)} className="w-full h-full object-cover" muted playsInline preload="metadata" />
            ) : (
              <img src={thumb} alt="" className="w-full h-full object-cover" />
            )
          ) : (
            <ImageIcon size={18} color="var(--text-muted)" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>
            {draft.caption?.trim() || (draft.mode === "reel" ? "Reel" : "Post")}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {draft.mode === "reel" ? "Reel" : `${count} item${count === 1 ? "" : "s"}`} · saved {timeAgo(new Date(draft.savedAt).toISOString())} ago
            {draft.scheduleOn ? " · scheduled" : ""}
          </p>
        </div>
      </button>
      <button onClick={onDelete} className="p-1.5 shrink-0 transition-transform active:scale-90">
        <Trash2 size={17} color="var(--heart)" />
      </button>
    </div>
  );
}

// ---- Push notifications ----
// Public half of the VAPID key pair. It's safe in the app — browsers need it
// to subscribe. The private half lives only in the send-push Edge Function's
// secrets.
const VAPID_PUBLIC_KEY = "BGN7-9SC7Z-eNS5Fd7OmiU-JbfcTkuPNsufSm_V9O7muxFrQDR2ir_GEr4BwnIZ-GBHYr35OqbjIVq3DlIUvRoE";

function urlB64ToUint8Array(base64) {
  const pad = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function pushSupported() {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

// Returns { ok, reason } so the caller can say exactly what went wrong.
async function enablePush(userId) {
  if (!pushSupported()) return { ok: false, reason: "This browser can't receive push notifications." };
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return {
      ok: false,
      reason:
        permission === "denied"
          ? "Notifications are blocked for this site. Allow them in your browser's site settings, then try again."
          : "Permission wasn't granted.",
    };
  }
  let reg;
  try {
    reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
  } catch (e) {
    return { ok: false, reason: "Couldn't start the notification worker — is sw.js in the repo's public folder?" };
  }
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    try {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    } catch (e) {
      return { ok: false, reason: e.message || "Subscribing failed." };
    }
  }
  const json = sub.toJSON();
  const { error } = await supabase.from("push_subscriptions").upsert(
    { user_id: userId, endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth },
    { onConflict: "endpoint" }
  );
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

async function disablePush() {
  if (!pushSupported()) return;
  const reg = await navigator.serviceWorker.getRegistration("/sw.js");
  const sub = reg ? await reg.pushManager.getSubscription() : null;
  if (sub) {
    await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
    await sub.unsubscribe();
  }
}

async function pushIsOn() {
  if (!pushSupported() || Notification.permission !== "granted") return false;
  const reg = await navigator.serviceWorker.getRegistration("/sw.js");
  const sub = reg ? await reg.pushManager.getSubscription() : null;
  return !!sub;
}

// ---- Notification preferences (server side) ----
// Stored on the profile so the send-push function can honour them for every
// device. Missing keys mean "on", so older accounts behave as before.
const NOTIF_CATEGORIES = [
  { key: "likes", label: "Likes", hint: "When someone likes your post, reel or comment" },
  { key: "comments", label: "Comments, mentions and tags", hint: "Comments on your posts, replies, @mentions and photo tags" },
  { key: "follows", label: "New followers", hint: "When someone starts following you" },
  { key: "messages", label: "Messages", hint: "New direct and group messages" },
  { key: "collections", label: "Shared collections", hint: "When someone adds to a collection you share" },
];

const NOTIF_PROMPT_KEY = "loop_notif_prompt_snooze";

// Instagram's website asks once after login: Turn On / Not Now. Browsers
// only allow the permission prompt after a tap, so this card is that tap.
function NotificationPrompt({ userId }) {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId || !pushSupported() || Notification.permission !== "default") return;
    let snoozedUntil = 0;
    try {
      snoozedUntil = Number(localStorage.getItem(NOTIF_PROMPT_KEY) || 0);
    } catch {}
    if (Date.now() < snoozedUntil) return;
    // Let the feed load first, the way Instagram waits a beat.
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, [userId]);

  const notNow = () => {
    try {
      localStorage.setItem(NOTIF_PROMPT_KEY, String(Date.now() + 7 * 24 * 60 * 60 * 1000));
    } catch {}
    setShow(false);
  };

  const turnOn = async () => {
    setBusy(true);
    setError("");
    const res = await enablePush(userId);
    setBusy(false);
    if (res.ok || Notification.permission === "denied") {
      if (!res.ok) notNow();
      else setShow(false);
      return;
    }
    setError(res.reason);
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 z-[80]" style={{ background: "rgba(0,0,0,0.6)" }} />
      <div
        className="fixed left-1/2 top-1/2 z-[81] rounded-3xl text-center overflow-hidden"
        style={{ transform: "translate(-50%, -50%)", width: 290, background: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <div className="px-6 pt-7 pb-5">
          <div className="mx-auto mb-4 rounded-full flex items-center justify-center" style={{ width: 64, height: 64, border: "2px solid var(--text)" }}>
            <Bell size={28} color="var(--text)" />
          </div>
          <p className="text-base mb-1.5" style={{ color: "var(--text)", fontWeight: 700 }}>Turn on notifications</p>
          <p className="text-xs" style={{ color: "var(--text-muted)", lineHeight: 1.45 }}>
            Know right away when people follow you, message you, or like and comment on your posts.
          </p>
          {error && <p className="text-[11px] mt-2" style={{ color: "var(--heart)" }}>{error}</p>}
        </div>
        <button
          onClick={turnOn}
          disabled={busy}
          className="w-full py-3.5 text-sm"
          style={{ borderTop: "1px solid var(--border)", color: "var(--accent-solid)", fontWeight: 700, opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Turning on..." : "Turn On"}
        </button>
        <button onClick={notNow} className="w-full py-3.5 text-sm" style={{ borderTop: "1px solid var(--border)", color: "var(--text)" }}>
          Not Now
        </button>
      </div>
    </>
  );
}

function NotificationsSettings({ userId, onBack }) {
  const [prefs, setPrefs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [deviceOn, setDeviceOn] = useState(false);
  const [deviceBusy, setDeviceBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase
        .from("profiles")
        .select("notification_prefs")
        .eq("id", userId)
        .maybeSingle();
      if (err) setError(err.message);
      setPrefs((data && data.notification_prefs) || {});
      setDeviceOn(await pushIsOn());
      setLoading(false);
    })();
  }, [userId]);

  const save = async (patch, key) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    setSaving(key);
    setError("");
    const { error: err } = await supabase.from("profiles").update({ notification_prefs: next }).eq("id", userId);
    setSaving(null);
    if (err) {
      setPrefs(prefs);
      setError(err.message);
    }
  };

  const turnOnDevice = async () => {
    setDeviceBusy(true);
    setError("");
    const res = await enablePush(userId);
    setDeviceBusy(false);
    if (res.ok) setDeviceOn(true);
    else setError(res.reason);
  };

  const Switch = ({ on }) => (
    <span className="rounded-full shrink-0" style={{ width: 38, height: 21, background: on ? ACCENT : "var(--toggle-off)", position: "relative" }}>
      <span className="rounded-full bg-white absolute" style={{ width: 17, height: 17, top: 2, left: on ? 19 : 2, transition: "left 0.15s" }} />
    </span>
  );

  const paused = !!prefs.paused;

  return (
    <div className="flex-1 overflow-y-auto pb-8" style={{ background: "var(--bg)" }}>
      <div className="flex items-center gap-3 px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90">
          <ChevronLeft size={24} color="var(--text)" />
        </button>
        <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>Notifications</h1>
      </div>

      {error && <p className="text-xs px-4 pt-3" style={{ color: "var(--heart)" }}>{error}</p>}

      {loading ? (
        <p className="text-xs text-center py-10" style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : (
        <div className="px-4 pt-4">
          {/* On the web each device must opt in once; this is that switch,
              shown only until it's done. */}
          {!deviceOn && pushSupported() && (
            <div className="rounded-2xl px-4 py-3.5 mb-5" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
              <p className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>Notifications are off on this device</p>
              <p className="text-[11px] mt-0.5 mb-3" style={{ color: "var(--text-muted)" }}>
                {Notification.permission === "denied"
                  ? "They're blocked in your browser. Allow notifications for this site in the browser's site settings."
                  : "Turn them on to get alerts even when Loop is closed."}
              </p>
              {Notification.permission !== "denied" && (
                <button
                  onClick={turnOnDevice}
                  disabled={deviceBusy}
                  className="rounded-full px-5 h-9 text-xs transition-transform active:scale-95"
                  style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: deviceBusy ? 0.6 : 1 }}
                >
                  {deviceBusy ? "Turning on..." : "Turn On"}
                </button>
              )}
            </div>
          )}

          <p className="text-[10px] uppercase tracking-wide mb-1.5 px-1" style={{ color: "var(--text-muted)" }}>Push notifications</p>
          <div className="rounded-xl overflow-hidden mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <button onClick={() => save({ paused: !paused }, "paused")} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
              <span className="flex-1">
                <span className="text-sm block" style={{ color: "var(--text)" }}>Pause all</span>
                <span className="text-[11px] block mt-0.5" style={{ color: "var(--text-muted)" }}>Temporarily stop every push notification</span>
              </span>
              <Switch on={paused} />
            </button>
          </div>

          <p className="text-[10px] uppercase tracking-wide mb-1.5 px-1" style={{ color: "var(--text-muted)" }}>Notify me about</p>
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)", opacity: paused ? 0.5 : 1 }}>
            {NOTIF_CATEGORIES.map((c, i) => {
              const on = prefs[c.key] !== false;
              return (
                <button
                  key={c.key}
                  onClick={() => !paused && save({ [c.key]: !on }, c.key)}
                  disabled={paused || saving === c.key}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                  style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
                >
                  <span className="flex-1">
                    <span className="text-sm block" style={{ color: "var(--text)" }}>{c.label}</span>
                    <span className="text-[11px] block mt-0.5" style={{ color: "var(--text-muted)" }}>{c.hint}</span>
                  </span>
                  <Switch on={on && !paused} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsScreen({
  onBack,
  theme,
  onThemeChange,
  accentStart,
  accentEnd,
  onAccentChange,
  onOpenSaved,
  onOpenEditProfile,
  onOpenArchive,
  onOpenActivity,
  onOpenPeopleList,
  onOpenModeration,
}) {
  const staffRole = useStaffRole();
  const [settingsQuery, setSettingsQuery] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [privacyBusy, setPrivacyBusy] = useState(false);
  const [delPassword, setDelPassword] = useState("");
  const [delBusy, setDelBusy] = useState(false);
  const [delError, setDelError] = useState("");
  const [view, setView] = useState("menu"); // menu | editProfile | changeEmail | changePassword | appearance | notifications | about | support | deleteAccount
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");
  // The email and phone this account logs in with.
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneStep, setPhoneStep] = useState("number"); // "number" | "code"
  const [phoneBusy, setPhoneBusy] = useState(false);
  const [phoneMsg, setPhoneMsg] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  // Picker preview defaults follow the current theme when nothing is customised.
  const THEME_ACCENT_DEFAULTS = {
    dark: ["#FDDB92", "#EFBF04"],
    light: ["#38BDF8", "#0095F6"],
    bangladesh: ["#F42A41", "#DA291C"],
  };
  const DEFAULT_ACCENT_START = (THEME_ACCENT_DEFAULTS[theme] || THEME_ACCENT_DEFAULTS.dark)[0];
  const DEFAULT_ACCENT_END = (THEME_ACCENT_DEFAULTS[theme] || THEME_ACCENT_DEFAULTS.dark)[1];
  const [pickerStart, setPickerStart] = useState(accentStart || DEFAULT_ACCENT_START);
  const [pickerEnd, setPickerEnd] = useState(accentEnd || DEFAULT_ACCENT_END);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, username, full_name, bio, avatar_url, is_private")
      .eq("id", user.id)
      .single();
    setProfile(data);
    setIsPrivate(!!data?.is_private);
    setFullName(data?.full_name || "");
    setUsername(data?.username || "");
    setBio(data?.bio || "");
    setLoading(false);
  };

  const handleAvatarChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const saveProfile = async () => {
    setProfileError("");
    if (!username.trim()) {
      setProfileError("Username cannot be empty");
      return;
    }
    setSavingProfile(true);

    let avatarUrl = profile?.avatar_url || null;
    if (avatarFile) {
      const path = `${userId}/${Date.now()}-${avatarFile.name}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, avatarFile);
      if (uploadError) {
        setSavingProfile(false);
        setProfileError(uploadError.message);
        return;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);
      avatarUrl = publicUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username: username.trim(), full_name: fullName.trim(), bio: bio.trim(), avatar_url: avatarUrl })
      .eq("id", userId);

    setSavingProfile(false);
    if (error) {
      setProfileError(error.message);
      return;
    }
    setProfile((prev) => ({ ...prev, username: username.trim(), full_name: fullName.trim(), bio: bio.trim(), avatar_url: avatarUrl }));
    setAvatarFile(null);
    setAvatarPreview(null);
    setView("menu");
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setLoginEmail(data?.user?.email || "");
      setLoginPhone(data?.user?.phone || "");
    });
  }, []);

  // Sending the code is step one; typing it back is what actually
  // changes the number, so a wrong number can never take over an account.
  const startPhoneChange = async () => {
    const value = newPhone.trim();
    setPhoneMsg("");
    if (!/^\+[0-9]{8,15}$/.test(value)) {
      setPhoneMsg("Write the number with its country code, like +8801712345678");
      return;
    }
    setPhoneBusy(true);
    const { error } = await supabase.auth.updateUser({ phone: value });
    setPhoneBusy(false);
    if (error) {
      setPhoneMsg(
        /sms|provider|not enabled|unsupported|disabled/i.test(error.message)
          ? "Loop can't send SMS yet — text messages need an SMS service connected to the project. Your email still works for logging in and for resets."
          : error.message
      );
      return;
    }
    setPhoneStep("code");
    setPhoneMsg("");
  };

  const confirmPhone = async () => {
    setPhoneBusy(true);
    setPhoneMsg("");
    const { error } = await supabase.auth.verifyOtp({
      phone: newPhone.trim(),
      token: phoneCode.trim(),
      type: "phone_change",
    });
    setPhoneBusy(false);
    if (error) {
      setPhoneMsg(error.message);
      return;
    }
    setLoginPhone(newPhone.trim());
    setPhoneCode("");
    setPhoneStep("number");
    setPhoneMsg("That's your number now.");
  };

  const changeEmail = async () => {
    setEmailMsg("");
    if (!newEmail.trim()) return;
    setEmailBusy(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setEmailBusy(false);
    setEmailMsg(error ? error.message : "Check your new email to confirm the change.");
  };

  const changePassword = async () => {
    setPasswordMsg("");
    if (newPassword.length < 6) {
      setPasswordMsg("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match");
      return;
    }
    setPasswordBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordBusy(false);
    if (error) {
      setPasswordMsg(error.message);
      return;
    }
    setPasswordMsg("Password updated.");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = async () => {
    if (!window.confirm("Log out of Loop?")) return;
    await supabase.auth.signOut();
  };

  const Header = ({ title, back }) => (
    <div className="flex items-center gap-3 px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <button onClick={back} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90"><ChevronLeft size={24} color="var(--text)" /></button>
      <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>{title}</h1>
    </div>
  );

  const inputStyle = { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</span>
      </div>
    );
  }

  if (view === "editProfile") {
    return (
      <div className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
        <Header title="Edit Profile" back={() => setView("menu")} />
        <div className="px-4 pt-5 flex flex-col items-center">
          <label className="relative cursor-pointer">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center" style={{ background: ACCENT }}>
              {avatarPreview || profile?.avatar_url ? (
                <img src={avatarPreview || profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl" style={{ color: "var(--bg)", fontWeight: 700 }}>
                  {(username || "u")[0].toUpperCase()}
                </span>
              )}
            </div>
            <div
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "var(--surface)", border: "2px solid var(--bg)" }}
            >
              <Pencil size={11} color="var(--text)" />
            </div>
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
          <span className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Tap to change photo</span>
        </div>

        <div className="px-4 pt-5">
          <label className="text-[11px]" style={{ color: "var(--text-muted)" }}>Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm mt-1 mb-3 outline-none"
            style={inputStyle}
          />

          <label className="text-[11px]" style={{ color: "var(--text-muted)" }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm mt-1 mb-3 outline-none"
            style={inputStyle}
          />

          <label className="text-[11px]" style={{ color: "var(--text-muted)" }}>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full rounded-xl px-3 py-2.5 text-sm mt-1 mb-3 outline-none resize-none"
            style={inputStyle}
          />

          {profileError && (
            <p className="text-xs mb-3" style={{ color: "var(--accent-start)" }}>{profileError}</p>
          )}

          <button
            onClick={saveProfile}
            disabled={savingProfile}
            className="w-full rounded-xl py-3 text-sm"
            style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: savingProfile ? 0.6 : 1 }}
          >
            {savingProfile ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  if (view === "changeEmail") {
    return (
      <div className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
        <Header title="Email address" back={() => setView("security")} />
        <div className="px-4 pt-5">
          <div className="rounded-xl px-3 py-2.5 mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>You log in with</p>
            <p className="text-sm mt-0.5 break-all" style={{ color: "var(--text)", fontWeight: 600 }}>
              {loginEmail || "No email on this account"}
            </p>
          </div>

          <label className="text-[11px]" style={{ color: "var(--text-muted)" }}>New email address</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl px-3 py-2.5 text-sm mt-1 mb-3 outline-none"
            style={inputStyle}
          />
          {emailMsg && (
            <p className="text-xs mb-3" style={{ color: emailMsg.includes("Check") ? "var(--text-muted)" : "var(--accent-start)" }}>{emailMsg}</p>
          )}
          <button
            onClick={changeEmail}
            disabled={emailBusy}
            className="w-full rounded-xl py-3 text-sm"
            style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: emailBusy ? 0.6 : 1 }}
          >
            {emailBusy ? "Sending..." : "Send confirmation link"}
          </button>
          <p className="text-[11px] mt-3" style={{ color: "var(--text-muted)" }}>
            Loop sends a link to the new address. The change only happens once you open that link, so a typo can't lock you out.
          </p>
        </div>
      </div>
    );
  }

  if (view === "changePhone") {
    return (
      <div className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
        <Header title="Phone number" back={() => setView("security")} />
        <div className="px-4 pt-5">
          <div className="rounded-xl px-3 py-2.5 mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>On this account</p>
            <p className="text-sm mt-0.5" style={{ color: "var(--text)", fontWeight: 600 }}>
              {loginPhone || "No phone number yet"}
            </p>
          </div>

          {phoneStep === "code" ? (
            <>
              <label className="text-[11px]" style={{ color: "var(--text-muted)" }}>The 6-digit code sent to {newPhone}</label>
              <input
                type="tel"
                inputMode="numeric"
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                placeholder="123456"
                className="w-full rounded-xl px-3 py-2.5 text-sm mt-1 mb-3 outline-none tracking-[0.3em]"
                style={inputStyle}
              />
              {phoneMsg && (
                <p className="text-xs mb-3" style={{ color: phoneMsg.includes("now") ? "var(--text-muted)" : "var(--accent-start)" }}>{phoneMsg}</p>
              )}
              <button
                onClick={confirmPhone}
                disabled={phoneBusy || phoneCode.length < 4}
                className="w-full rounded-xl py-3 text-sm"
                style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: phoneBusy || phoneCode.length < 4 ? 0.6 : 1 }}
              >
                {phoneBusy ? "Checking..." : "Confirm"}
              </button>
              <button
                onClick={() => {
                  setPhoneStep("number");
                  setPhoneCode("");
                  setPhoneMsg("");
                }}
                className="w-full py-3 text-xs"
                style={{ color: "var(--text-muted)", fontWeight: 600 }}
              >
                Use a different number
              </button>
            </>
          ) : (
            <>
              <label className="text-[11px]" style={{ color: "var(--text-muted)" }}>New phone number</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="w-full rounded-xl px-3 py-2.5 text-sm mt-1 mb-3 outline-none"
                style={inputStyle}
              />
              {phoneMsg && (
                <p className="text-xs mb-3" style={{ color: "var(--accent-start)" }}>{phoneMsg}</p>
              )}
              <button
                onClick={startPhoneChange}
                disabled={phoneBusy}
                className="w-full rounded-xl py-3 text-sm"
                style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: phoneBusy ? 0.6 : 1 }}
              >
                {phoneBusy ? "Sending..." : "Send code by SMS"}
              </button>
              <p className="text-[11px] mt-3" style={{ color: "var(--text-muted)" }}>
                Start with the country code, like +880 for Bangladesh. Loop texts a 6-digit code to that number and the change
                only happens once you type it in.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (view === "changePassword") {
    return (
      <div className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
        <Header title="Change Password" back={() => setView("security")} />
        <div className="px-4 pt-5">
          <label className="text-[11px]" style={{ color: "var(--text-muted)" }}>New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm mt-1 mb-3 outline-none"
            style={inputStyle}
          />
          <label className="text-[11px]" style={{ color: "var(--text-muted)" }}>Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm mt-1 mb-3 outline-none"
            style={inputStyle}
          />
          {passwordMsg && (
            <p className="text-xs mb-3" style={{ color: passwordMsg === "Password updated." ? "var(--text-muted)" : "var(--accent-start)" }}>{passwordMsg}</p>
          )}
          <button
            onClick={changePassword}
            disabled={passwordBusy}
            className="w-full rounded-xl py-3 text-sm"
            style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: passwordBusy ? 0.6 : 1 }}
          >
            {passwordBusy ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    );
  }

  if (view === "notifications") {
    return <NotificationsSettings userId={userId} onBack={() => setView("menu")} />;
  }

  if (view === "appearance") {
    const applyAccent = () => onAccentChange?.(pickerStart, pickerEnd);
    const resetAccent = () => {
      setPickerStart(DEFAULT_ACCENT_START);
      setPickerEnd(DEFAULT_ACCENT_END);
      onAccentChange?.("", "");
    };
    const isCustomized = !!accentStart || !!accentEnd;

    const ThemeCard = ({ id, label, swatch, ring }) => {
      const selected = theme === id;
      return (
        <button
          onClick={() => onThemeChange?.(id)}
          className="flex-1 rounded-2xl py-4 flex flex-col items-center gap-2"
          style={{
            background: "var(--surface)",
            border: selected ? "2px solid var(--accent-solid)" : "1px solid var(--border)",
            boxShadow: selected ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
            transition: "all 0.15s",
          }}
        >
          <div
            className="w-9 h-9 rounded-full"
            style={{ background: swatch, border: ring }}
          />
          <span className="text-sm" style={{ color: "var(--text)", fontWeight: selected ? 700 : 500 }}>{label}</span>
        </button>
      );
    };

    return (
      <div className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
        <Header title="Theme & Colour" back={() => setView("menu")} />

        <div className="px-4 pt-4">
          <div className="text-[11px] mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Theme</div>
          <div className="flex gap-3 mb-3">
            <ThemeCard id="light" label="Light" swatch="#FFFFFF" ring="1px solid #DBDBDB" />
            <ThemeCard id="dark" label="Dark" swatch="#000000" ring="1px solid #363636" />
          </div>
          <div className="flex mb-6">
            <ThemeCard
              id="bangladesh"
              label="Bangladesh"
              swatch="linear-gradient(135deg, #006747 0%, #006747 60%, #DA291C 60%, #DA291C 100%)"
              ring="1px solid var(--border)"
            />
          </div>

          <div className="text-[11px] mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Accent colour</div>

          {/* Rainbow presets — tap one to apply instantly to buttons, icons & rings */}
          <div
            className="rounded-2xl p-3 mb-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="flex-1 h-2.5 rounded-full"
                style={{ background: "linear-gradient(90deg, #0095F6, #A855F7, #DB2777, #DC2626, #EA580C, #EFBF04, #059669, #0D9488)" }}
              />
            </div>
            <div className="flex flex-wrap gap-2.5">
              {[
                ["#38BDF8", "#0095F6"],
                ["#A855F7", "#6D28D9"],
                ["#F472B6", "#DB2777"],
                ["#F87171", "#DC2626"],
                ["#FB923C", "#EA580C"],
                ["#FDDB92", "#EFBF04"],
                ["#34D399", "#059669"],
                ["#2DD4BF", "#0D9488"],
              ].map(([s, e]) => {
                const active = isCustomized && accentStart === s && accentEnd === e;
                return (
                  <button
                    key={s + e}
                    onClick={() => {
                      setPickerStart(s);
                      setPickerEnd(e);
                      onAccentChange?.(s, e);
                    }}
                    className="rounded-full"
                    style={{
                      width: 34,
                      height: 34,
                      background: `linear-gradient(135deg, ${s} 0%, ${e} 100%)`,
                      border: active ? "2.5px solid var(--text)" : "2px solid var(--border)",
                      boxShadow: active ? "0 0 0 2px var(--surface) inset" : "none",
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="text-[11px] mb-2" style={{ color: "var(--text-muted)" }}>Or make your own</div>
          <div
            className="rounded-2xl overflow-hidden mb-3"
            style={{ background: "var(--surface)", border: isCustomized ? "2px solid var(--accent-solid)" : "1px solid var(--border)" }}
          >
            <div className="h-16 w-full" style={{ background: `linear-gradient(135deg, ${pickerStart} 0%, ${pickerEnd} 100%)` }} />
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full" style={{ background: pickerStart, border: "2px solid var(--border)" }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Start</span>
                </div>
                <label className="relative cursor-pointer">
                  <span
                    className="text-xs px-3 py-1.5 rounded-lg inline-block"
                    style={{ background: "var(--bg-sunken)", color: "var(--text)", fontWeight: 600, border: "1px solid var(--border)" }}
                  >
                    {pickerStart.toUpperCase()}
                  </span>
                  <input
                    type="color"
                    value={pickerStart}
                    onChange={(e) => setPickerStart(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full" style={{ background: pickerEnd, border: "2px solid var(--border)" }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>End</span>
                </div>
                <label className="relative cursor-pointer">
                  <span
                    className="text-xs px-3 py-1.5 rounded-lg inline-block"
                    style={{ background: "var(--bg-sunken)", color: "var(--text)", fontWeight: 600, border: "1px solid var(--border)" }}
                  >
                    {pickerEnd.toUpperCase()}
                  </span>
                  <input
                    type="color"
                    value={pickerEnd}
                    onChange={(e) => setPickerEnd(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={applyAccent}
              className="flex-1 rounded-xl py-3 text-sm"
              style={{ background: `linear-gradient(135deg, ${pickerStart} 0%, ${pickerEnd} 100%)`, color: "#fff", fontWeight: 700, boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}
            >
              Use custom colour
            </button>
            {isCustomized && (
              <button
                onClick={resetAccent}
                className="rounded-xl py-3 px-4 text-sm"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600 }}
              >
                Reset
              </button>
            )}
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            The accent colour is used for buttons, links, and active icons throughout the app. Pick a custom colour to override the current theme's default.
          </p>
        </div>
      </div>
    );
  }

  const togglePrivacy = async () => {
    if (!userId) return;
    const next = !isPrivate;
    setPrivacyBusy(true);
    setIsPrivate(next);
    const { error } = await supabase.from("profiles").update({ is_private: next }).eq("id", userId);
    setPrivacyBusy(false);
    if (error) {
      setIsPrivate(!next);
      alert(error.message);
    }
  };

  const requestDeletion = async () => {
    setDelError("");
    if (!delPassword) {
      setDelError("Enter your password to continue");
      return;
    }
    setDelBusy(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error: pwErr } = await supabase.auth.signInWithPassword({ email: user?.email || "", password: delPassword });
    if (pwErr) {
      setDelBusy(false);
      setDelError("That password isn't right");
      return;
    }
    const { data: when, error } = await supabase.rpc("request_account_deletion");
    setDelBusy(false);
    if (error) {
      setDelError(error.message);
      return;
    }
    alert(
      `Your account will be deleted on ${new Date(when).toLocaleDateString(undefined, { dateStyle: "long" })}. ` +
        "Log in before then if you change your mind."
    );
    await supabase.auth.signOut();
  };

  if (view === "security")
    return (
      <SecurityScreen
        onBack={() => setView("menu")}
        onChangePassword={() => setView("changePassword")}
        onChangeEmail={() => setView("changeEmail")}
        onChangePhone={() => setView("changePhone")}
      />
    );
  if (view === "time") return <TimeManagementScreen onBack={() => setView("menu")} />;
  if (view === "status") return <AccountStatusScreen onBack={() => setView("menu")} />;
  if (view === "favourites") return <FavouritesScreen onBack={() => setView("menu")} />;
  if (view === "hiddenWords") return <HiddenWordsScreen onBack={() => setView("menu")} />;

  if (view === "about") {
    return (
      <div className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
        <Header title="About" back={() => setView("menu")} />
        <div className="flex flex-col items-center px-6 pt-8 pb-6 text-center">
          <LoopLogo size={72} />
          <p className="text-lg mt-3" style={{ color: "var(--text)", fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>Loop</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Version 1.0 · Made in Bangladesh</p>
          <p className="text-sm mt-5" style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Share photos, videos and stories with the people you care about.
          </p>
        </div>
        <div className="mx-4 rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {["Terms of Use", "Privacy Policy", "Community Guidelines"].map((t, i) => (
            <div key={t} className="flex items-center justify-between px-4 py-3.5 text-sm" style={{ color: "var(--text)", borderTop: i ? "1px solid var(--border)" : "none" }}>
              {t}
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Coming soon</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "support") {
    return (
      <div className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
        <Header title="Support Loop" back={() => setView("menu")} />
        <div className="px-6 pt-8 pb-6 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: ACCENT }}>
            <HandHeart size={30} color="var(--on-accent)" />
          </div>
          <p className="text-lg" style={{ color: "var(--text)", fontWeight: 700 }}>Help keep Loop running</p>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
            Loop is built by one person. Servers for photos and videos cost money every month. If you enjoy Loop, a small
            gift helps keep it free and ad-light for everyone.
          </p>
        </div>
        <div className="mx-4 rounded-2xl p-4 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>Ways to give are coming soon</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>bKash and Nagad will appear here.</p>
        </div>
        <div className="mx-4 mt-3">
          <button
            onClick={async () => {
              const url = window.location.origin;
              try {
                if (navigator.share) await navigator.share({ title: "Loop", text: "Join me on Loop", url });
                else {
                  await navigator.clipboard.writeText(url);
                  alert("Link copied");
                }
              } catch (e) {
                // share cancelled
              }
            }}
            className="w-full rounded-xl h-11 text-sm"
            style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700 }}
          >
            Share Loop with friends
          </button>
          <p className="text-[11px] text-center mt-2" style={{ color: "var(--text-muted)" }}>Telling a friend helps just as much.</p>
        </div>
      </div>
    );
  }

  if (view === "deleteAccount") {
    return (
      <div className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
        <Header title="Delete account" back={() => setView("menu")} />
        <div className="px-5 pt-5">
          <p className="text-[17px]" style={{ color: "var(--text)", fontWeight: 700 }}>Delete @{profile?.username}?</p>
          <div className="mt-3 flex flex-col gap-2.5">
            {[
              "Your profile, photos, videos, comments and likes will be hidden right away.",
              "After 30 days they're deleted for good and can't be brought back.",
              "Changed your mind? Just log in before then and choose Keep account.",
            ].map((t) => (
              <div key={t} className="flex gap-2.5">
                <Check size={16} color="var(--text-muted)" className="shrink-0 mt-0.5" />
                <p className="text-[13px]" style={{ color: "var(--text-secondary)", lineHeight: 1.45 }}>{t}</p>
              </div>
            ))}
          </div>
          <label className="text-[11px] block mt-6 mb-1.5" style={{ color: "var(--text-muted)" }}>Re-enter your password</label>
          <input
            type="password"
            value={delPassword}
            onChange={(e) => setDelPassword(e.target.value)}
            className="w-full rounded-xl px-4 h-12 text-sm outline-none"
            style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          {delError && <p className="text-xs mt-2" style={{ color: "var(--heart)" }}>{delError}</p>}
          <button
            onClick={requestDeletion}
            disabled={delBusy}
            className="w-full rounded-xl h-12 text-sm mt-4"
            style={{ background: "var(--heart)", color: "#fff", fontWeight: 700, opacity: delBusy ? 0.6 : 1 }}
          >
            {delBusy ? "Please wait…" : "Delete account"}
          </button>
          <button onClick={() => setView("menu")} className="w-full h-11 text-sm mt-2" style={{ color: "var(--text)", fontWeight: 600 }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const themeLabel = theme === "light" ? "Light" : theme === "bangladesh" ? "Bangladesh" : "Dark";
  const sections = [
    {
      title: "Your account",
      rows: [
        { icon: CircleUserRound, label: "Edit profile", onClick: () => (onOpenEditProfile ? onOpenEditProfile() : setView("editProfile")) },
        { icon: KeyRound, label: "Password and security", onClick: () => setView("security") },
        { icon: Shield, label: "Account status", onClick: () => setView("status") },
      ],
    },
    {
      title: "How you use Loop",
      rows: [
        { icon: Bookmark, label: "Saved", onClick: onOpenSaved },
        { icon: Archive, label: "Archive", onClick: onOpenArchive },
        { icon: Gauge, label: "Your activity", onClick: onOpenActivity },
        { icon: Bell, label: "Notifications", onClick: () => setView("notifications") },
        { icon: Clock, label: "Time management", onClick: () => setView("time") },
      ],
    },
    {
      title: "What you see",
      rows: [
        { icon: Star, label: "Favourites", onClick: () => setView("favourites") },
        { icon: MessageCircle, label: "Hidden words", onClick: () => setView("hiddenWords") },
      ],
    },
    {
      title: "Who can see your content",
      rows: [
        { icon: Lock, label: "Account privacy", value: isPrivate ? "Private" : "Public", toggle: true, on: isPrivate, onClick: togglePrivacy, busy: privacyBusy },
        { icon: Star, label: "Close Friends", onClick: () => onOpenPeopleList?.("close_friends") },
        { icon: UserX, label: "Blocked", onClick: () => onOpenPeopleList?.("blocked") },
      ],
    },
    {
      title: "How others can interact with you",
      rows: [
        { icon: Shield, label: "Restricted", onClick: () => onOpenPeopleList?.("restricted") },
        { icon: VolumeX, label: "Muted accounts", onClick: () => onOpenPeopleList?.("muted") },
      ],
    },
    {
      title: "Your app and media",
      rows: [
        { icon: Palette, label: "Theme & colour", value: themeLabel, onClick: () => setView("appearance") },
        { icon: Globe, label: "Language", value: "English · বাংলা soon" },
      ],
    },
    ...(staffRole
      ? [{ title: "Moderation", rows: [{ icon: Shield, label: "Moderation", value: staffRole, onClick: onOpenModeration }] }]
      : []),
    {
      title: "More info and support",
      rows: [
        { icon: HandHeart, label: "Support Loop", onClick: () => setView("support") },
        {
          icon: LifeBuoy,
          label: "Help",
          onClick: () => {
            window.location.href = "mailto:eh.evu1000@gmail.com?subject=Loop%20help";
          },
        },
        { icon: Info, label: "About", onClick: () => setView("about") },
      ],
    },
    {
      title: "Login",
      rows: [
        { icon: LogOut, label: "Log out", danger: true, onClick: handleLogout },
        { icon: Trash, label: "Delete account", danger: true, onClick: () => setView("deleteAccount") },
      ],
    },
  ];
  const q = settingsQuery.trim().toLowerCase();
  const shownSections = sections
    .map((sec) => ({ ...sec, rows: sec.rows.filter((row) => !q || row.label.toLowerCase().includes(q) || sec.title.toLowerCase().includes(q)) }))
    .filter((sec) => sec.rows.length > 0);

  return (
    <div className="flex-1 overflow-y-auto pb-8" style={{ background: "var(--bg)" }}>
      <Header title="Settings and activity" back={onBack} />
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-2 rounded-xl px-3 h-10" style={{ background: "var(--surface)" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            value={settingsQuery}
            onChange={(e) => setSettingsQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text)" }}
          />
        </div>
      </div>
      {shownSections.length === 0 && (
        <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>No settings match "{settingsQuery}"</p>
      )}
      {shownSections.map((sec) => (
        <div key={sec.title} className="pt-4">
          <p className="px-4 pb-1.5 text-[13px]" style={{ color: "var(--text-muted)", fontWeight: 600 }}>{sec.title}</p>
          {sec.rows.map((row) => {
            const Icon = row.icon;
            return (
              <button
                key={row.label}
                onClick={row.onClick}
                disabled={!row.onClick || row.busy}
                className="w-full flex items-center gap-3.5 px-4 py-3 text-left transition-colors active:opacity-70"
              >
                <Icon size={21} color={row.danger ? "var(--heart)" : "var(--text)"} strokeWidth={1.8} />
                <span className="flex-1 text-[15px]" style={{ color: row.danger ? "var(--heart)" : "var(--text)" }}>{row.label}</span>
                {row.toggle ? (
                  <span className="rounded-full shrink-0" style={{ width: 40, height: 23, background: row.on ? ACCENT : "var(--toggle-off)", position: "relative" }}>
                    <span className="rounded-full bg-white absolute" style={{ width: 19, height: 19, top: 2, left: row.on ? 19 : 2, transition: "left 0.15s" }} />
                  </span>
                ) : (
                  <>
                    {row.value && (
                      <span className="text-[13px] capitalize" style={{ color: "var(--text-muted)" }}>{row.value}</span>
                    )}
                    {row.onClick && !row.danger && <ChevronRight size={18} color="var(--text-muted)" />}
                  </>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function PostDetailScreen({ postId, onBack, onOpenProfile, onOpenReport, onDeleted }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [userId, setUserId] = useState(null);
  const [likesPopupOpen, setLikesPopupOpen] = useState(false);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [countPrefs] = useCountPrefs();
  const pressTimer = React.useRef(null);

  useEffect(() => {
    load();
  }, [postId]);

  const load = async () => {
    setLoading(true);
    setLoadError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    const { data: p, error } = await supabase
      .from("posts")
      .select("id, media_url, media_type, media_count, caption, location, user_id, created_at, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, pinned, archived, views_count, aspect_ratio, link_url, cover_url")
      .eq("id", postId)
      .single();

    if (error || !p) {
      setLoadError(error?.message || "Post not found");
      setLoading(false);
      return;
    }

    const mediaMap = await fetchPostMediaMap([p.id]);
    const { data: profile } = await supabase.from("profiles").select("id, username, avatar_url").eq("id", p.user_id).single();
    const { data: likes } = await supabase.from("likes").select("user_id").eq("post_id", postId);
    const { data: reposts } = await supabase.from("reposts").select("user_id").eq("post_id", postId);
    const { data: allSaves } = await supabase.from("saves").select("user_id").eq("post_id", postId);
    const { data: comments } = await supabase.from("comments").select("id").eq("post_id", postId);
    const { data: tagRows } = await supabase.from("post_tags").select("tagged_user_id").eq("post_id", postId);
    let tagsData = [];
    if (tagRows && tagRows.length) {
      const { data: tp } = await supabase.from("profiles").select("id, username").in("id", tagRows.map((t) => t.tagged_user_id));
      tagsData = tagRows.map((t) => ({ tagged_user_id: t.tagged_user_id, username: (tp || []).find((x) => x.id === t.tagged_user_id)?.username || "unknown" }));
    }
    const counts = await fetchPostCounts([p.id]);

    setPost(applyCounts({
      ...p,
      username: profile?.username || "unknown",
      avatarUrl: profile?.avatar_url || null,
      likeCount: (likes || []).length,
      liked: (likes || []).some((l) => l.user_id === user?.id),
      repostCount: (reposts || []).length,
      reposted: (reposts || []).some((r) => r.user_id === user?.id),
      saveCount: (allSaves || []).length,
      saved: (allSaves || []).some((s) => s.user_id === user?.id),
      commentCount: (comments || []).length,
      tags: tagsData || [],
      media: mediaMap[p.id] || null,
    }, counts[p.id]));
    setLoading(false);
  };

  const toggleLike = async () => {
    if (!userId || !post) return;
    const was = post.liked;
    setPost((prev) => ({ ...prev, liked: !was, likeCount: was ? prev.likeCount - 1 : prev.likeCount + 1 }));
    if (was) {
      await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", userId);
    } else {
      await supabase.from("likes").insert({ post_id: post.id, user_id: userId });
      if (post.user_id !== userId) {
        await supabase.from("notifications").insert({ user_id: post.user_id, actor_id: userId, type: "like", post_id: post.id });
      }
    }
  };

  const toggleRepost = async () => {
    if (!userId || !post) return;
    const was = post.reposted;
    setPost((prev) => ({ ...prev, reposted: !was, repostCount: was ? prev.repostCount - 1 : prev.repostCount + 1 }));
    if (was) {
      await supabase.from("reposts").delete().eq("post_id", post.id).eq("user_id", userId);
    } else {
      await supabase.from("reposts").insert({ post_id: post.id, user_id: userId });
    }
  };

  const toggleSave = async () => {
    if (!userId || !post) return;
    const was = post.saved;
    setPost((prev) => ({ ...prev, saved: !was, saveCount: was ? prev.saveCount - 1 : prev.saveCount + 1 }));
    const { error } = was
      ? await supabase.from("saves").delete().eq("post_id", post.id).eq("user_id", userId)
      : await supabase.from("saves").insert({ post_id: post.id, user_id: userId });

    if (error) {
      setPost((prev) => ({ ...prev, saved: was, saveCount: was ? prev.saveCount + 1 : prev.saveCount - 1 }));
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</span>
      </div>
    );
  }

  if (loadError || !post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ background: "var(--bg)" }}>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>{loadError || "Post not found"}</span>
        <button onClick={onBack} className="text-sm" style={{ color: "var(--accent-start)" }}>Go back</button>
      </div>
    );
  }

  const isOwner = post.user_id === userId;

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
      <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90">
            <ChevronLeft size={24} color="var(--text)" />
          </button>
          <button onClick={() => onOpenProfile?.(post.user_id)} className="flex items-center gap-2.5 min-w-0">
            <Avatar username={post.username} avatarUrl={post.avatarUrl} size={36} />
            <div className="flex flex-col leading-tight min-w-0 text-left">
              <span className="text-[13px] truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{post.username}</span>
              {post.location && (
                <span className="flex items-center gap-0.5 text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>
                  <MapPin size={9} /> {post.location}
                </span>
              )}
            </div>
          </button>
        </div>
        <button onClick={() => (isOwner ? setOptionsOpen(true) : onOpenReport?.(post.id))} className="p-1 -mr-1 shrink-0">
          <Ellipsis size={19} color="var(--text)" />
        </button>
      </div>

      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ background: "var(--bg-sunken)", aspectRatio: postAspectCss(post) }}
      >
        {post.media && post.media.length > 1 ? (
          <FeedPhotoTap onLike={() => !post.liked && toggleLike()}>
            <PostMediaCarousel media={post.media} />
          </FeedPhotoTap>
        ) : isPhotoPost(post) ? (
          <FeedPhotoTap onLike={() => !post.liked && toggleLike()}>
            <img src={post.media_url} alt="" className="w-full h-full object-cover" />
          </FeedPhotoTap>
        ) : (
          <FeedVideo post={{ ...post, media_type: "video" }} onLike={() => !post.liked && toggleLike()} />
        )}
        <MediaTagOverlay tags={post.tags} isVideo={!isPhotoPost(post)} onOpenProfile={onOpenProfile} />
      </div>

      <div className="flex items-center justify-between px-4 pt-2.5">
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
            <button
              onClick={() => setShareOpen(true)}
              className="h-7 flex items-center justify-center transition-transform active:scale-90"
            >
              <ShareIcon size={23} color="var(--text)" strokeWidth={1.9} />
            </button>
            <span className="text-[11px] leading-none h-3 mt-1">&nbsp;</span>
          </div>
          <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
            <button onClick={toggleSave} className="h-7 flex items-center justify-center transition-transform active:scale-90">
              <Bookmark size={23} color="var(--text)" fill={post.saved ? "var(--text)" : "none"} strokeWidth={1.9} />
            </button>
            <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
              {countPrefs.saves && !post.hide_saves && post.saveCount > 0 ? formatCount(post.saveCount) : "\u00A0"}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center" style={{ minWidth: 34 }}>
          <button
            onClick={toggleLike}
            onTouchStart={() => {
              pressTimer.current = setTimeout(() => setLikesPopupOpen(true), 500);
            }}
            onTouchEnd={() => clearTimeout(pressTimer.current)}
            onTouchMove={() => clearTimeout(pressTimer.current)}
            className="h-8 flex items-center justify-center transition-transform active:scale-90"
          >
            <Heart size={31} color={post.liked ? "var(--heart)" : "var(--text)"} fill={post.liked ? "var(--heart)" : "none"} strokeWidth={1.9} />
          </button>
          <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
            {countPrefs.likes && !post.hide_likes && post.likeCount > 0 ? formatCount(post.likeCount) : "\u00A0"}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
            <button
              onClick={() => !post.comments_disabled && setCommentSheetOpen(true)}
              disabled={post.comments_disabled}
              className="h-7 flex items-center justify-center transition-transform active:scale-90"
            >
              <MessageCircle size={23} color={post.comments_disabled ? "var(--toggle-off)" : "var(--text)"} strokeWidth={1.9} style={{ transform: "scaleX(-1)" }} />
            </button>
            <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
              {countPrefs.comments && !post.hide_comments && post.commentCount > 0 ? formatCount(post.commentCount) : "\u00A0"}
            </span>
          </div>
          <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
            <button onClick={toggleRepost} className="h-7 flex items-center justify-center transition-transform active:scale-90">
              <RepostIcon size={25} color={post.reposted ? "var(--accent-solid)" : "var(--text)"} active={post.reposted} />
            </button>
            <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
              {countPrefs.reposts && !post.hide_reposts && post.repostCount > 0 ? formatCount(post.repostCount) : "\u00A0"}
            </span>
          </div>
        </div>
      </div>

      {likesPopupOpen && (
        <LikesViewsPopup post={post} isOwner={isOwner} onClose={() => setLikesPopupOpen(false)} onOpenProfile={onOpenProfile} />
      )}

      <div className="px-4 pt-1.5 pb-8">
        <CaptionText
          username={post.username}
          caption={post.caption}
          onOpenProfile={() => onOpenProfile?.(post.user_id)}
          onMention={(n) => openProfileByUsername(n, onOpenProfile)}
        />
        <PostLinkChip url={post.link_url} />
        {!post.comments_disabled && !post.hide_comments && post.commentCount > 0 && (
          <button
            onClick={() => setCommentSheetOpen(true)}
            className="text-[13px] mt-1 block"
            style={{ color: "var(--text-muted)" }}
          >
            View all {formatCount(post.commentCount)} comment{post.commentCount === 1 ? "" : "s"}
          </button>
        )}
        <span className="text-[10px] mt-1.5 block uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.3px" }}>
          {timeAgo(post.created_at)} ago
        </span>
      </div>

      {commentSheetOpen && (
        <ReelCommentsSheet
          postId={post.id}
          postOwnerId={post.user_id}
          currentUserId={userId}
          postUsername={post.username}
          postCaption={post.caption}
          postAvatar={post.avatarUrl}
          postCreatedAt={post.created_at}
          postLink={post.link_url}
          postTags={post.tags}
          commentsDisabled={post.comments_disabled}
          onOpenProfile={onOpenProfile}
          onClose={() => setCommentSheetOpen(false)}
          onCommentPosted={() => setPost((prev) => ({ ...prev, commentCount: prev.commentCount + 1 }))}
        />
      )}

      {optionsOpen && (
        <PostOptionsSheet
          post={post}
          onClose={() => setOptionsOpen(false)}
          onSaved={(patch) => setPost((prev) => ({ ...prev, ...patch }))}
          onDeleted={() => {
            onDeleted?.();
            onBack();
          }}
        />
      )}
      {shareOpen && post && (
        <ShareSheet item={post} currentUserId={userId} onClose={() => setShareOpen(false)} />
      )}
    </div>
  );
}

// ---- Your activity ----
// Everything here is counted from your own rows. Time spent is the one
// exception: nothing has ever recorded it, so it starts from the moment
// this build first runs rather than pretending to know your history.
const TIME_KEY = "loop_time_spent";

function readTimeSpent() {
  try {
    const raw = localStorage.getItem(TIME_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const localDay = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Time management choices (this device): a daily limit and break reminders.
const TIME_PREFS_KEY = "loop_time_prefs";
function readTimePrefs() {
  try {
    return { dailyLimit: 0, breakEvery: 0, ...(JSON.parse(localStorage.getItem(TIME_PREFS_KEY) || "{}") || {}) };
  } catch {
    return { dailyLimit: 0, breakEvery: 0 };
  }
}
function writeTimePrefs(prefs) {
  try {
    localStorage.setItem(TIME_PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}
const fmtMinutes = (sec) => {
  const m = Math.round(sec / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`;
};

function recordTimeSpent(seconds) {
  try {
    const day = localDay();
    const data = readTimeSpent();
    data[day] = (data[day] || 0) + seconds;
    // Keep a fortnight; older days aren't shown anywhere.
    const keep = Object.keys(data).sort().slice(-14);
    const trimmed = {};
    keep.forEach((k) => (trimmed[k] = data[k]));
    localStorage.setItem(TIME_KEY, JSON.stringify(trimmed));
  } catch {}
}

// Unlock with your fingerprint or face.
// This guards the Loop session that's already saved in this browser — the
// kind of lock that stops someone who picks up your unlocked phone. It is
// stored on this device only; it is not a way to sign in somewhere new.
const QUICK_UNLOCK_KEY = "loop_quick_unlock";
const b64uToBytes = (v) => {
  const pad = "=".repeat((4 - (v.length % 4)) % 4);
  const bin = atob((v + pad).replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};
const bytesToB64u = (buf) => {
  const arr = new Uint8Array(buf);
  let str = "";
  for (let i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
function readQuickUnlock() {
  try {
    return JSON.parse(localStorage.getItem(QUICK_UNLOCK_KEY) || "null");
  } catch {
    return null;
  }
}
function writeQuickUnlock(v) {
  try {
    if (v) localStorage.setItem(QUICK_UNLOCK_KEY, JSON.stringify(v));
    else localStorage.removeItem(QUICK_UNLOCK_KEY);
  } catch {}
}
const quickUnlockSupported = () =>
  typeof window !== "undefined" &&
  !!window.PublicKeyCredential &&
  !!navigator.credentials &&
  window.isSecureContext;

async function registerQuickUnlock(userId, label) {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const cred = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: "Loop", id: window.location.hostname },
      user: { id: new TextEncoder().encode(userId), name: label, displayName: label },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", residentKey: "preferred" },
      timeout: 60000,
      attestation: "none",
    },
  });
  if (!cred) throw new Error("No passkey was created");
  return { id: bytesToB64u(cred.rawId), userId, created: Date.now() };
}

async function verifyQuickUnlock(saved) {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const got = await navigator.credentials.get({
    publicKey: {
      challenge,
      allowCredentials: saved?.id ? [{ type: "public-key", id: b64uToBytes(saved.id) }] : [],
      userVerification: "required",
      timeout: 60000,
      rpId: window.location.hostname,
    },
  });
  return !!got;
}

// The screen shown over Loop while it's locked.
function LockScreen({ onUnlock, onForget }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const tryUnlock = async () => {
    setBusy(true);
    setError("");
    try {
      const ok = await verifyQuickUnlock(readQuickUnlock());
      if (ok) onUnlock();
      else setError("That didn't match. Try again.");
    } catch (e) {
      setError(e?.name === "NotAllowedError" ? "Cancelled." : e?.message || "Couldn't check that here.");
    }
    setBusy(false);
  };
  useEffect(() => {
    tryUnlock();
  }, []);
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center" style={{ background: "var(--bg)" }}>
      <LoopLogo size={72} />
      <p className="text-lg mt-4" style={{ color: "var(--text)", fontWeight: 700 }}>Loop is locked</p>
      <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>Use your fingerprint or face to carry on.</p>
      {error && <p className="text-xs mt-3" style={{ color: "var(--heart)" }}>{error}</p>}
      <button
        onClick={tryUnlock}
        disabled={busy}
        className="mt-6 w-full rounded-xl h-12 text-sm"
        style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busy ? 0.6 : 1 }}
      >
        {busy ? "Waiting…" : "Unlock"}
      </button>
      <button onClick={onForget} className="mt-2 w-full h-11 text-sm" style={{ color: "var(--text-muted)", fontWeight: 600 }}>
        Log out instead
      </button>
    </div>
  );
}

// Settings → Password and security.
function SecurityScreen({ onBack, onChangePassword, onChangeEmail, onChangePhone }) {
  const [account, setAccount] = useState(null);
  const [unlock, setUnlock] = useState(readQuickUnlock);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const supported = quickUnlockSupported();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user;
      setAccount({
        email: u?.email || null,
        phone: u?.phone || null,
        provider: u?.app_metadata?.provider || "email",
        created: u?.created_at || null,
        lastSignIn: u?.last_sign_in_at || null,
      });
    });
  }, []);

  const say = (m) => {
    setNote(m);
    setTimeout(() => setNote(""), 2400);
  };

  const turnOn = async () => {
    setBusy(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const saved = await registerQuickUnlock(user.id, user.email || "Loop account");
      writeQuickUnlock(saved);
      setUnlock(saved);
      say("Unlock is on for this device");
    } catch (e) {
      say(e?.name === "NotAllowedError" ? "Cancelled" : e?.message || "This device wouldn't set that up");
    }
    setBusy(false);
  };

  const turnOff = () => {
    writeQuickUnlock(null);
    setUnlock(null);
    say("Unlock is off for this device");
  };

  const Row = ({ icon: Icon, label, value, onClick, danger }) => (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <Icon size={20} color={danger ? "var(--heart)" : "var(--text)"} strokeWidth={1.8} />
      <span className="flex-1 min-w-0">
        <span className="block text-[15px]" style={{ color: danger ? "var(--heart)" : "var(--text)" }}>{label}</span>
        {value && <span className="block text-[12px] truncate" style={{ color: "var(--text-muted)" }}>{value}</span>}
      </span>
      {onClick && <ChevronRight size={18} color="var(--text-muted)" />}
    </button>
  );

  return (
    <div className="flex-1 overflow-y-auto pb-8" style={{ background: "var(--bg)" }}>
      <ScreenHeader title="Password and security" onBack={onBack} />

      <p className="px-4 pt-4 pb-1 text-[13px]" style={{ color: "var(--text-muted)", fontWeight: 600 }}>How you log in</p>
      <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <Row
          icon={Mail}
          label="Email address"
          value={account ? account.email || "No email on this account — tap to add one" : "…"}
          onClick={onChangeEmail}
        />
        <Row
          icon={Phone}
          label="Phone number"
          value={account ? account.phone || "No phone on this account — tap to add one" : "…"}
          onClick={onChangePhone}
        />
      </div>
      <p className="px-4 pt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
        This is what you type to log in, and where a reset link or code is sent. Tap either one to change it: the email gets a
        confirmation link, the phone gets a code by SMS. Neither is shown on your profile — the contact details people can see
        live in Edit profile.
      </p>

      <p className="px-4 pt-5 pb-1 text-[13px]" style={{ color: "var(--text-muted)", fontWeight: 600 }}>Security</p>
      <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <Row icon={KeyRound} label="Change password" onClick={onChangePassword} />
        <div className="flex items-center gap-3.5 px-4 py-3.5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <Lock size={20} color="var(--text)" strokeWidth={1.8} />
          <span className="flex-1 min-w-0">
            <span className="block text-[15px]" style={{ color: "var(--text)" }}>Unlock with fingerprint or face</span>
            <span className="block text-[12px]" style={{ color: "var(--text-muted)" }}>
              {!supported ? "This browser can't do it" : unlock ? "On for this device" : "Off"}
            </span>
          </span>
          <button
            onClick={unlock ? turnOff : turnOn}
            disabled={!supported || busy}
            className="rounded-lg px-3.5 h-8 text-[13px] shrink-0"
            style={
              unlock
                ? { background: "var(--surface)", color: "var(--text)", fontWeight: 700, border: "1px solid var(--border)" }
                : { background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: !supported || busy ? 0.5 : 1 }
            }
          >
            {busy ? "…" : unlock ? "Turn off" : "Turn on"}
          </button>
        </div>
      </div>
      <p className="px-4 pt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
        Asks for your fingerprint or face before Loop opens on this phone. It guards the session saved here; on a new device you
        still log in with your password.
      </p>
      {note && <p className="px-4 pt-3 text-xs" style={{ color: "var(--accent-solid)" }}>{note}</p>}

      <p className="px-4 pt-5 pb-1 text-[13px]" style={{ color: "var(--text-muted)", fontWeight: 600 }}>This account</p>
      <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <Row
          icon={Clock}
          label="Joined"
          value={account?.created ? new Date(account.created).toLocaleDateString(undefined, { dateStyle: "long" }) : "…"}
        />
        <Row
          icon={Shield}
          label="Last login"
          value={account?.lastSignIn ? new Date(account.lastSignIn).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "…"}
        />
      </div>
    </div>
  );
}

// Settings → Time management.
function TimeManagementScreen({ onBack }) {
  const [prefs, setPrefs] = useState(readTimePrefs);
  const data = readTimeSpent();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(localDay(d));
  }
  const values = days.map((d) => data[d] || 0);
  const today = values[values.length - 1];
  const recorded = values.filter((v) => v > 0);
  const avg = recorded.length ? recorded.reduce((a, b) => a + b, 0) / recorded.length : 0;
  const max = Math.max(60, ...values);
  const update = (patch) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    writeTimePrefs(next);
  };
  const Choice = ({ value, current, label, onPick }) => (
    <button
      onClick={() => onPick(value)}
      className="rounded-full px-3.5 h-9 text-[13px] shrink-0"
      style={{
        fontWeight: 600,
        background: current === value ? "var(--text)" : "var(--surface)",
        color: current === value ? "var(--bg)" : "var(--text)",
        border: "1px solid var(--border)",
      }}
    >
      {label}
    </button>
  );
  return (
    <div className="flex-1 overflow-y-auto pb-8" style={{ background: "var(--bg)" }}>
      <ScreenHeader title="Time management" onBack={onBack} />
      <div className="px-4 pt-4">
        <div className="rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Today</p>
              <p className="text-2xl" style={{ color: "var(--text)", fontWeight: 800 }}>{fmtMinutes(today)}</p>
            </div>
            <div className="text-right">
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Daily average</p>
              <p className="text-[15px]" style={{ color: "var(--text)", fontWeight: 700 }}>{fmtMinutes(avg)}</p>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2" style={{ height: 120 }}>
            {days.map((d, i) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full rounded-md"
                  style={{
                    height: `${Math.max(3, (values[i] / max) * 100)}%`,
                    background: i === days.length - 1 ? ACCENT : "var(--toggle-off)",
                  }}
                />
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {new Date(d + "T12:00:00").toLocaleDateString(undefined, { weekday: "narrow" })}
                </span>
              </div>
            ))}
          </div>
          {prefs.dailyLimit > 0 && (
            <p className="text-[12px] mt-3" style={{ color: "var(--text-secondary)" }}>
              Daily limit: {prefs.dailyLimit} min · {today >= prefs.dailyLimit * 60 ? "reached today" : `${fmtMinutes(Math.max(0, prefs.dailyLimit * 60 - today))} left`}
            </p>
          )}
        </div>

        <p className="text-[15px] mt-6" style={{ color: "var(--text)", fontWeight: 700 }}>Daily limit</p>
        <p className="text-[12px] mt-0.5 mb-2.5" style={{ color: "var(--text-muted)" }}>
          We'll remind you when you've used Loop this long today.
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {[0, 15, 30, 45, 60, 90, 120].map((m) => (
            <Choice key={m} value={m} current={prefs.dailyLimit} label={m ? (m < 60 ? `${m} min` : `${m / 60} h`) : "Off"} onPick={(v) => update({ dailyLimit: v })} />
          ))}
        </div>

        <p className="text-[15px] mt-6" style={{ color: "var(--text)", fontWeight: 700 }}>Take a break</p>
        <p className="text-[12px] mt-0.5 mb-2.5" style={{ color: "var(--text-muted)" }}>
          A gentle reminder to look up after you've been scrolling for a while.
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {[0, 10, 20, 30].map((m) => (
            <Choice key={m} value={m} current={prefs.breakEvery} label={m ? `Every ${m} min` : "Off"} onPick={(v) => update({ breakEvery: v })} />
          ))}
        </div>

        <p className="text-[11px] mt-6" style={{ color: "var(--text-muted)" }}>
          Time is measured on this device while Loop is open on screen.
        </p>
      </div>
    </div>
  );
}

// The reminder card shown over the app.
function TimeNudge({ kind, minutes, onClose, onSnooze }) {
  return (
    <div className="absolute inset-0 z-[90] flex items-center justify-center px-8" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full rounded-3xl p-6 text-center" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: ACCENT }}>
          <Clock size={26} color="var(--on-accent)" />
        </div>
        <p className="text-lg" style={{ color: "var(--text)", fontWeight: 700 }}>
          {kind === "limit" ? "You've reached your daily limit" : "Time for a break?"}
        </p>
        <p className="text-sm mt-2" style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {kind === "limit"
            ? `You've spent ${minutes} minutes on Loop today — the limit you set.`
            : `You've been scrolling for ${minutes} minutes. Stretch, drink some water, look away for a moment.`}
        </p>
        <button onClick={onClose} className="mt-5 w-full rounded-xl h-11 text-sm" style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700 }}>
          {kind === "limit" ? "Close for today" : "OK"}
        </button>
        <button onClick={onSnooze} className="mt-1 w-full h-10 text-sm" style={{ color: "var(--text-muted)", fontWeight: 600 }}>
          Remind me in 15 minutes
        </button>
      </div>
    </div>
  );
}

// Plain back-arrow header used by the newer screens.
function ScreenHeader({ title, onBack, right }) {
  return (
    <div className="flex items-center gap-3 px-4 h-14 shrink-0 sticky top-0 z-10" style={{ background: "var(--bg)", borderBottom: "1px solid var(--border-subtle)" }}>
      <button onClick={onBack} aria-label="Back">
        <ChevronLeft size={24} color="var(--text)" />
      </button>
      <span className="text-[17px] flex-1 truncate" style={{ color: "var(--text)", fontWeight: 700 }}>{title}</span>
      {right}
    </div>
  );
}

// Settings → Account status: is anything removed or limited?
function AccountStatusScreen({ onBack }) {
  const [state, setState] = useState(null);
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: removed }, { data: ban }] = await Promise.all([
        supabase.from("posts").select("id, media_url, media_type, removed_at, removed_reason, cover_url").eq("user_id", user.id).not("removed_at", "is", null).order("removed_at", { ascending: false }),
        supabase.from("user_bans").select("until, reason").eq("user_id", user.id).maybeSingle(),
      ]);
      const activeBan = ban && (!ban.until || new Date(ban.until).getTime() > Date.now()) ? ban : null;
      setState({ removed: removed || [], ban: activeBan });
    })();
  }, []);
  const good = state && state.removed.length === 0 && !state.ban;
  const Row = ({ title, sub, ok }) => (
    <div className="flex items-start gap-3 px-4 py-3.5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: ok ? "#1DB954" : "var(--heart)" }}>
        {ok ? <Check size={14} color="#fff" strokeWidth={3} /> : <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>!</span>}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[15px]" style={{ color: "var(--text)", fontWeight: 600 }}>{title}</p>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>
      </div>
    </div>
  );
  return (
    <div className="flex-1 overflow-y-auto pb-8" style={{ background: "var(--bg)" }}>
      <ScreenHeader title="Account status" onBack={onBack} />
      {!state ? (
        <p className="text-xs text-center py-10" style={{ color: "var(--text-muted)" }}>Loading…</p>
      ) : (
        <>
          <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: good ? "rgba(29,185,84,0.15)" : "rgba(237,73,86,0.15)" }}>
              {good ? <Check size={40} color="#1DB954" strokeWidth={2.6} /> : <Shield size={36} color="var(--heart)" />}
            </div>
            <p className="text-lg mt-4" style={{ color: "var(--text)", fontWeight: 700 }}>
              {good ? "Your account is in good standing" : state.ban ? "Your account is limited" : "Some of your content was removed"}
            </p>
            <p className="text-[13px] mt-1.5" style={{ color: "var(--text-muted)", lineHeight: 1.45 }}>
              See whether anything you shared went against Loop's Community Guidelines.
            </p>
          </div>
          <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <Row
              ok={state.removed.length === 0}
              title="Removed content"
              sub={state.removed.length === 0 ? "Nothing you've posted has been removed." : `${state.removed.length} ${state.removed.length === 1 ? "post was" : "posts were"} removed.`}
            />
            <Row
              ok={!state.ban}
              title="Features you can use"
              sub={
                state.ban
                  ? state.ban.until
                    ? `Posting, commenting, messaging and following are paused until ${new Date(state.ban.until).toLocaleString()}.`
                    : "This account is disabled."
                  : "You can post, comment, message and follow as usual."
              }
            />
          </div>
          {state.removed.length > 0 && (
            <div className="px-4 pt-4">
              <p className="text-[13px] mb-2" style={{ color: "var(--text-muted)", fontWeight: 600 }}>Removed posts</p>
              {state.removed.map((rp) => (
                <div key={rp.id} className="flex items-center gap-3 py-2">
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0" style={{ background: "var(--surface)" }}>
                    <MediaThumb src={rp.media_url} cover={rp.cover_url} isVideo={!isPhotoPost(rp)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px]" style={{ color: "var(--text)", fontWeight: 600 }}>{rp.removed_reason || "Community Guidelines"}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Removed {new Date(rp.removed_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Settings → Favourites: people whose posts you see first.
function FavouritesScreen({ onBack, onOpenProfile }) {
  const [rows, setRows] = useState(null);
  const load = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data } = await supabase.from("favorites").select("target_id").eq("user_id", user?.id ?? "");
    const ids = (data || []).map((f) => f.target_id);
    if (!ids.length) {
      setRows([]);
      return;
    }
    const { data: profs } = await supabase.from("profiles").select("id, username, full_name, avatar_url").in("id", ids);
    setRows(profs || []);
  };
  useEffect(() => {
    load();
  }, []);
  const remove = async (id) => {
    setRows((prev) => prev.filter((x) => x.id !== id));
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("favorites").delete().eq("user_id", user?.id ?? "").eq("target_id", id);
    invalidateFavorites();
  };
  return (
    <div className="flex-1 overflow-y-auto pb-8" style={{ background: "var(--bg)" }}>
      <ScreenHeader title="Favourites" onBack={onBack} />
      <p className="px-4 pt-3 pb-2 text-[13px]" style={{ color: "var(--text-muted)", lineHeight: 1.45 }}>
        Posts from your favourites show with a ★ in your feed. Add someone from the ⋯ menu on their post. They won't be told.
      </p>
      {rows === null ? (
        <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>Loading…</p>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <Star size={34} color="var(--text-muted)" strokeWidth={1.5} />
          <p className="text-sm mt-2" style={{ color: "var(--text)", fontWeight: 600 }}>No favourites yet</p>
        </div>
      ) : (
        rows.map((pp) => (
          <div key={pp.id} className="flex items-center gap-3 px-4 py-2">
            <button onClick={() => onOpenProfile?.(pp.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
              <Avatar username={pp.username} avatarUrl={pp.avatar_url} size={46} />
              <div className="min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--text)", fontWeight: 700 }}>{pp.username}</p>
                {pp.full_name && <p className="text-[12px] truncate" style={{ color: "var(--text-muted)" }}>{pp.full_name}</p>}
              </div>
            </button>
            <button onClick={() => remove(pp.id)} className="rounded-lg px-3.5 h-8 text-[13px]" style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 700, border: "1px solid var(--border)" }}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

// Settings → Hidden words: comments containing these are tucked away for you.
function HiddenWordsScreen({ onBack }) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data } = await supabase.from("profile_private").select("hidden_words").eq("user_id", user?.id ?? "").maybeSingle();
      setText((data?.hidden_words || []).join(", "));
    })();
  }, []);
  const save = async () => {
    setSaving(true);
    const words = [...new Set(text.split(/[,\n]/).map((w) => w.trim().toLowerCase()).filter(Boolean))].slice(0, 200);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("profile_private").upsert({ user_id: user?.id, hidden_words: words }, { onConflict: "user_id" });
    setSaving(false);
    hiddenWordsPromise = null;
    setNote(error ? error.message : "Saved");
    setTimeout(() => setNote(""), 1800);
  };
  return (
    <div className="flex-1 overflow-y-auto pb-8" style={{ background: "var(--bg)" }}>
      <ScreenHeader title="Hidden words" onBack={onBack} />
      <div className="px-4 pt-4">
        <p className="text-[13px] mb-3" style={{ color: "var(--text-muted)", lineHeight: 1.45 }}>
          Comments with these words or emojis are hidden from you. You can still open them if you want. Separate words with commas.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="e.g. spam, scam, 🤡"
          className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none"
          style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)" }}
        />
        <button onClick={save} disabled={saving} className="w-full rounded-xl h-11 text-sm mt-3" style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : "Save"}
        </button>
        {note && <p className="text-xs text-center mt-2" style={{ color: "var(--text-muted)" }}>{note}</p>}
      </div>
    </div>
  );
}

// Cached per session: your hidden words and your favourites.
let hiddenWordsPromise = null;
function getHiddenWords() {
  if (!hiddenWordsPromise) {
    hiddenWordsPromise = (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data } = await supabase.from("profile_private").select("hidden_words").eq("user_id", user?.id ?? "").maybeSingle();
      return (data?.hidden_words || []).map((w) => String(w).toLowerCase()).filter(Boolean);
    })().catch(() => []);
  }
  return hiddenWordsPromise;
}
let favoritesPromise = null;
function getFavorites() {
  if (!favoritesPromise) {
    favoritesPromise = (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("favorites").select("target_id").eq("user_id", user?.id ?? "");
      return new Set(error ? [] : (data || []).map((f) => f.target_id));
    })().catch(() => new Set());
  }
  return favoritesPromise;
}
function invalidateFavorites() {
  favoritesPromise = null;
}

function YourActivityScreen({ currentUserId, onBack, onOpenPost }) {
  const [view, setView] = useState("menu"); // menu | likes | comments | time
  const [counts, setCounts] = useState({ likes: 0, comments: 0, saves: 0 });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const [likesRes, commentsRes, savesRes] = await Promise.all([
        supabase.from("likes").select("post_id", { count: "exact", head: true }).eq("user_id", currentUserId),
        supabase.from("comments").select("id", { count: "exact", head: true }).eq("user_id", currentUserId),
        supabase.from("saves").select("post_id", { count: "exact", head: true }).eq("user_id", currentUserId),
      ]);
      setCounts({
        likes: likesRes.count || 0,
        comments: commentsRes.count || 0,
        saves: savesRes.count || 0,
      });
      setLoading(false);
    })();
  }, [currentUserId]);

  const openLikes = async () => {
    setView("likes");
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase.from("likes").select("post_id").eq("user_id", currentUserId);
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    const ids = (data || []).map((r) => r.post_id);
    if (ids.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data: rows } = await supabase
      .from("posts")
      .select("id, media_url, media_type, media_count, created_at, cover_url")
      .in("id", ids)
      .order("created_at", { ascending: false });
    setItems(rows || []);
    setLoading(false);
  };

  const openComments = async () => {
    setView("comments");
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase
      .from("comments")
      .select("id, post_id, content, created_at")
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (err) setError(err.message);
    setItems(data || []);
    setLoading(false);
  };

  const Header = ({ title, back }) => (
    <div className="flex items-center gap-2 px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <button onClick={back} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90">
        <ChevronLeft size={24} color="var(--text)" />
      </button>
      <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>{title}</h1>
    </div>
  );

  if (view === "likes" || view === "comments") {
    const isLikes = view === "likes";
    return (
      <div className="flex-1 overflow-y-auto pb-6">
        <Header title={isLikes ? "Likes" : "Comments"} back={() => setView("menu")} />
        {error ? (
          <p className="text-xs text-center py-8 px-6" style={{ color: "var(--heart)" }}>{error}</p>
        ) : loading ? (
          <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-center py-10" style={{ color: "var(--text-muted)" }}>Nothing here yet</p>
        ) : isLikes ? (
          <div className="grid grid-cols-3 gap-0.5 mt-0.5">
            {items.map((p) => (
              <MediaTile key={p.id} post={p} onClick={() => onOpenPost?.(p.id)} />
            ))}
          </div>
        ) : (
          items.map((c) => (
            <button
              key={c.id}
              onClick={() => onOpenPost?.(c.post_id)}
              className="w-full text-left px-4 py-3"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <p className="text-sm" style={{ color: "var(--text)", wordBreak: "break-word" }}>{c.content}</p>
              <span className="text-[11px] mt-1 block" style={{ color: "var(--text-muted)" }}>{timeAgo(c.created_at)} ago</span>
            </button>
          ))
        )}
      </div>
    );
  }

  if (view === "time") {
    const data = readTimeSpent();
    const days = Object.keys(data).sort().slice(-7);
    const total = days.reduce((a, d) => a + data[d], 0);
    const avg = days.length ? Math.round(total / days.length) : 0;
    const fmt = (sec) => {
      const m = Math.round(sec / 60);
      return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`;
    };
    const max = Math.max(1, ...days.map((d) => data[d]));

    return (
      <div className="flex-1 overflow-y-auto pb-6">
        <Header title="Time spent" back={() => setView("menu")} />
        <div className="px-4 pt-4">
          <p className="text-[11px] mb-4" style={{ color: "var(--text-muted)" }}>
            Measured on this device only, and only since this version was installed — nothing was
            recorded before that.
          </p>
          <div className="rounded-2xl px-4 py-4 mb-4" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
            <span className="text-[11px] block" style={{ color: "var(--text-muted)" }}>Daily average</span>
            <span className="text-2xl block mt-0.5" style={{ color: "var(--text)", fontWeight: 700 }}>{fmt(avg)}</span>
          </div>
          {days.length === 0 ? (
            <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>No days recorded yet</p>
          ) : (
            <div className="flex items-end justify-between gap-2" style={{ height: 140 }}>
              {days.map((d) => (
                <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full rounded-t-lg" style={{ height: `${(data[d] / max) * 100}%`, background: ACCENT, minHeight: 4 }} />
                  <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                    {new Date(d).toLocaleDateString(undefined, { weekday: "short" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-6">
      <Header title="Your activity" back={onBack} />
      <div className="flex gap-2 px-4 pt-4 pb-3">
        {[
          { label: "Likes", value: counts.likes },
          { label: "Comments", value: counts.comments },
          { label: "Saved", value: counts.saves },
        ].map((c) => (
          <div key={c.label} className="flex-1 rounded-2xl px-3 py-3 text-center" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
            <span className="text-lg block" style={{ color: "var(--text)", fontWeight: 700 }}>{loading ? "—" : formatCount(c.value)}</span>
            <span className="text-[11px] block mt-0.5" style={{ color: "var(--text-muted)" }}>{c.label}</span>
          </div>
        ))}
      </div>
      <StoryMenuRow icon={<Heart size={17} color="var(--text)" />} label="Likes you've given" onClick={openLikes} />
      <StoryMenuRow icon={<MessageCircle size={17} color="var(--text)" style={{ transform: "scaleX(-1)" }} />} label="Comments you've made" onClick={openComments} />
      <StoryMenuRow icon={<Gauge size={17} color="var(--text)" />} label="Time spent" onClick={() => setView("time")} />
    </div>
  );
}

// ---- Archive ----
function ArchiveScreen({ currentUserId, onBack, onOpenPost }) {
  const [tab, setTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data: p, error: pe } = await supabase
        .from("posts")
      .select("id, media_url, media_type, media_count, created_at, cover_url")
        .eq("user_id", currentUserId)
        .eq("archived", true)
        .order("created_at", { ascending: false });
      if (pe) setError(pe.message);
      setPosts(p || []);

      // Owners can read their own stories past expiry, so this is the
      // full story archive rather than only the live ones.
      const { data: st } = await supabase
        .from("stories")
        .select("id, media_url, media_type, created_at")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false })
        .limit(200);
      setStories(st || []);
      setLoading(false);
    })();
  }, [currentUserId]);

  const shown = tab === "posts" ? posts : stories;

  return (
    <div className="flex-1 overflow-y-auto pb-6">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90">
          <ChevronLeft size={24} color="var(--text)" />
        </button>
        <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>Archive</h1>
      </div>

      <div className="flex" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        {[
          { k: "posts", label: "Posts" },
          { k: "stories", label: "Stories" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className="flex-1 py-2.5 text-[13px]"
            style={{
              color: tab === t.k ? "var(--text)" : "var(--text-muted)",
              fontWeight: tab === t.k ? 700 : 500,
              borderBottom: tab === t.k ? "2px solid var(--text)" : "2px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="text-xs text-center py-8 px-6" style={{ color: "var(--heart)" }}>{error}</p>
      ) : loading ? (
        <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 px-8 text-center">
          <Archive size={28} color="var(--toggle-off)" />
          <p className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>
            {tab === "posts" ? "No archived posts" : "No stories yet"}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {tab === "posts"
              ? "Archive a post from its ··· menu and it lands here."
              : "Stories you post stay here after they expire."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 mt-0.5">
          {shown.map((item) => (
            <MediaTile
              key={item.id}
              post={item}
              onClick={() => tab === "posts" && onOpenPost?.(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Multi-account ----
// Supabase keeps one session in localStorage, so switching accounts means
// stashing each session's tokens ourselves and calling setSession to swap.
// Refresh tokens rotate, so a stashed one can go stale — that case is
// handled by asking for a fresh login rather than failing silently.
const ACCOUNTS_KEY = "loop_accounts";

function readAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeAccounts(list) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
  } catch {}
}

async function rememberCurrentAccount(profile) {
  const { data } = await supabase.auth.getSession();
  const session = data?.session;
  if (!session || !profile) return;
  const entry = {
    id: profile.id,
    username: profile.username,
    avatar_url: profile.avatar_url || null,
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  };
  const list = readAccounts().filter((a) => a.id !== entry.id);
  writeAccounts([entry, ...list].slice(0, 5));
}

function AccountSwitcherSheet({ currentUserId, onClose, onSwitched, onAddAccount }) {
  const [accounts, setAccounts] = useState(readAccounts());
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const switchTo = async (acc) => {
    if (acc.id === currentUserId) {
      onClose();
      return;
    }
    setBusyId(acc.id);
    setError("");
    const { error: err } = await supabase.auth.setSession({
      access_token: acc.access_token,
      refresh_token: acc.refresh_token,
    });
    setBusyId(null);
    if (err) {
      // Stale refresh token — drop it and send them to a normal login.
      writeAccounts(readAccounts().filter((a) => a.id !== acc.id));
      setAccounts(readAccounts());
      setError(`Session for @${acc.username} expired. Log in again to add it back.`);
      return;
    }
    onSwitched();
  };

  const forget = (acc) => {
    writeAccounts(readAccounts().filter((a) => a.id !== acc.id));
    setAccounts(readAccounts());
  };

  return (
    <StorySheetShell title="Switch account" onClose={onClose}>
      {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}
      <div className="pb-2">
        {accounts.length === 0 ? (
          <p className="text-xs text-center py-5 px-8" style={{ color: "var(--text-muted)" }}>
            No other accounts saved on this device yet.
          </p>
        ) : (
          accounts.map((a) => (
            <div key={a.id} className="flex items-center gap-3 px-4 py-2.5">
              <Avatar username={a.username} avatarUrl={a.avatar_url} size={44} />
              <span className="flex-1 text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{a.username}</span>
              {a.id === currentUserId ? (
                <Check size={18} color="var(--accent-solid)" />
              ) : (
                <>
                  <button
                    onClick={() => switchTo(a)}
                    disabled={busyId === a.id}
                    className="rounded-full px-4 h-8 text-xs shrink-0 transition-transform active:scale-95"
                    style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busyId === a.id ? 0.6 : 1 }}
                  >
                    {busyId === a.id ? "..." : "Switch"}
                  </button>
                  <button onClick={() => forget(a)} className="p-1 shrink-0"><X size={16} color="var(--text-muted)" /></button>
                </>
              )}
            </div>
          ))
        )}
      </div>
      <div className="h-px my-1.5 mx-4" style={{ background: "var(--border)" }} />
      <StoryMenuRow icon={<UserPlus size={17} color="var(--text)" />} label="Log into another account" onClick={onAddAccount} />
      <div className="pb-4" />
    </StorySheetShell>
  );
}

// ---- Share profile ----
// The QR card: a big code on a colourful background, like Instagram's.
const QR_CARD_COLOURS = [
  ["#F58529", "#DD2A7B"],
  ["#0F2027", "#2C5364"],
  ["#00B09B", "#96C93D"],
  ["#8E2DE2", "#4A00E0"],
  ["#006A4E", "#F42A41"],
];
function QRCardScreen({ title, caption, link, fileName, onBack }) {
  const [qr, setQr] = useState("");
  const [colour, setColour] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(link, { width: 640, margin: 1, errorCorrectionLevel: "M" })
      .then((url) => !cancelled && setQr(url))
      .catch(() => !cancelled && setQr(""));
    return () => {
      cancelled = true;
    };
  }, [link]);

  const say = (m) => {
    setNote(m);
    setTimeout(() => setNote(""), 1800);
  };

  const download = () => {
    if (!qr) return;
    const a = document.createElement("a");
    a.href = qr;
    a.download = `${fileName || "loop"}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    say("Saved to your downloads");
  };

  const [a, b] = QR_CARD_COLOURS[colour];
  return (
    <div className="absolute inset-0 z-[78] flex flex-col" style={{ background: `linear-gradient(160deg, ${a} 0%, ${b} 100%)` }}>
      <div className="flex items-center gap-3 px-4 h-14 shrink-0">
        <button onClick={onBack} aria-label="Back">
          <ChevronLeft size={24} color="#FFFFFF" />
        </button>
        <span className="text-[16px] flex-1 truncate" style={{ color: "#FFFFFF", fontWeight: 700 }}>{title || "QR code"}</span>
        <button onClick={download} aria-label="Save">
          <Download size={21} color="#FFFFFF" />
        </button>
      </div>

      <button
        onClick={() => setColour((c) => (c + 1) % QR_CARD_COLOURS.length)}
        className="flex-1 flex flex-col items-center justify-center px-8"
      >
        <div className="rounded-3xl p-5 flex flex-col items-center" style={{ background: "#FFFFFF", width: "min(78vw, 300px)" }}>
          {qr ? (
            <img src={qr} alt="Profile QR code" className="w-full" style={{ imageRendering: "pixelated" }} />
          ) : (
            <div className="w-full flex items-center justify-center" style={{ aspectRatio: "1 / 1" }}>
              <span className="text-xs" style={{ color: "#666" }}>Generating…</span>
            </div>
          )}
          <span className="text-[15px] mt-3 text-center" style={{ color: "#111", fontWeight: 800 }}>{caption}</span>
        </div>
        <span className="text-[12px] mt-5" style={{ color: "rgba(255,255,255,0.85)" }}>Tap to change the colour</span>
        <span className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>Scan this to open it in Loop</span>
      </button>

      {note && (
        <p className="text-center text-xs pb-3" style={{ color: "#FFFFFF", fontWeight: 600 }}>{note}</p>
      )}
    </div>
  );
}

function ProfileQRScreen({ profile, onBack }) {
  return (
    <QRCardScreen
      title="QR code"
      caption={`@${profile.username}`}
      link={`${window.location.origin}/u/${profile.username}`}
      fileName={`loop-${profile.username}`}
      onBack={onBack}
    />
  );
}

function ShareProfileSheet({ profile, currentUserId, onClose, onOpenQR }) {
  const [flash, setFlash] = useState("");
  const [sendOpen, setSendOpen] = useState(false);

  const link = `${window.location.origin}/u/${profile.username}`;

  const say = (m) => {
    setFlash(m);
    setTimeout(() => setFlash(""), 1800);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      say("Link copied");
    } catch {
      say("Couldn't copy on this device");
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `@${profile.username} on Loop`, url: link });
        return;
      }
      await navigator.clipboard.writeText(link);
      say("Link copied");
    } catch {
      say("Sharing isn't available here");
    }
  };

  if (sendOpen) {
    return (
      <ForwardSheet
        message={{ content: `Check out @${profile.username} on Loop: ${link}` }}
        currentUserId={currentUserId}
        onClose={() => setSendOpen(false)}
      />
    );
  }

  return (
    <StorySheetShell title="Share profile" onClose={onClose}>
      {flash && <p className="text-xs px-4 pb-2" style={{ color: "var(--accent-solid)" }}>{flash}</p>}

      <div className="flex items-center gap-3 px-4 pb-3">
        <Avatar username={profile.username} avatarUrl={profile.avatar_url} size={48} />
        <div className="min-w-0">
          <p className="text-sm truncate" style={{ color: "var(--text)", fontWeight: 700 }}>@{profile.username}</p>
          <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>{link.replace(/^https?:\/\//, "")}</p>
        </div>
      </div>

      <div className="pb-6">
        <StoryMenuRow icon={<ShareIcon size={17} color="var(--text)" />} label="Send in Loop" onClick={() => setSendOpen(true)} />
        <StoryMenuRow icon={<Copy size={17} color="var(--text)" />} label="Copy link" onClick={copy} />
        <StoryMenuRow icon={<Share2 size={17} color="var(--text)" />} label="Share to…" onClick={share} />
        {onOpenQR && (
          <StoryMenuRow
            icon={<QrCode size={17} color="var(--text)" />}
            label="QR code"
            onClick={() => {
              onClose();
              onOpenQR();
            }}
          />
        )}
      </div>
    </StorySheetShell>
  );
}

// ---- People lists (close friends, blocked, restricted, muted) ----
// All four are the same shape: a list of people you've put in a bucket,
// plus a search to add more. `table` picks which store to write to.
function PeopleListScreen({ kind, title, hint, currentUserId, onBack, onOpenProfile }) {
  const isCloseFriends = kind === "close_friends";
  const [members, setMembers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const { data, error: err } = isCloseFriends
      ? await supabase.from("close_friends").select("friend_id").eq("user_id", currentUserId)
      : await supabase.from("user_relations").select("target_id").eq("user_id", currentUserId).eq("kind", kind);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    const ids = (data || []).map((r) => (isCloseFriends ? r.friend_id : r.target_id));
    let profiles = [];
    if (ids.length > 0) {
      const { data: pr } = await supabase.from("profiles").select("id, username, full_name, avatar_url").in("id", ids);
      profiles = pr || [];
    }
    setMembers(profiles);

    const { data: all } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url")
      .neq("id", currentUserId || "")
      .limit(80);
    setCandidates(all || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [kind, currentUserId]);

  const add = async (person) => {
    setBusyId(person.id);
    setError("");
    const { error: err } = isCloseFriends
      ? await supabase.from("close_friends").insert({ user_id: currentUserId, friend_id: person.id })
      : await supabase.from("user_relations").insert({ user_id: currentUserId, target_id: person.id, kind });
    setBusyId(null);
    if (err) {
      setError(err.message);
      return;
    }
    invalidateRelations();
    setMembers((prev) => [...prev, person]);
  };

  const remove = async (person) => {
    setBusyId(person.id);
    setError("");
    const { error: err } = isCloseFriends
      ? await supabase.from("close_friends").delete().eq("user_id", currentUserId).eq("friend_id", person.id)
      : await supabase
          .from("user_relations")
          .delete()
          .eq("user_id", currentUserId)
          .eq("target_id", person.id)
          .eq("kind", kind);
    setBusyId(null);
    if (err) {
      setError(err.message);
      return;
    }
    invalidateRelations();
    setMembers((prev) => prev.filter((m) => m.id !== person.id));
  };

  const memberIds = members.map((m) => m.id);
  const q = query.trim().toLowerCase();
  const shown = candidates
    .filter((c) => !memberIds.includes(c.id))
    .filter((c) => c.username.toLowerCase().includes(q) || (c.full_name || "").toLowerCase().includes(q));

  return (
    <div className="flex-1 overflow-y-auto pb-6">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90">
          <ChevronLeft size={24} color="var(--text)" />
        </button>
        <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>{title}</h1>
      </div>

      {hint && <p className="text-[11px] px-4 pt-3" style={{ color: "var(--text-muted)" }}>{hint}</p>}
      {error && <p className="text-xs px-4 pt-2" style={{ color: "var(--heart)" }}>{error}</p>}

      <p className="text-[11px] px-4 pt-3 pb-1.5 uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.4px" }}>
        {members.length} on this list
      </p>
      {loading ? (
        <p className="text-xs text-center py-5" style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : members.length === 0 ? (
        <p className="text-xs px-4 pb-1" style={{ color: "var(--text-muted)" }}>Nobody yet</p>
      ) : (
        members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 px-4 py-2.5">
            <button onClick={() => onOpenProfile?.(m.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
              <Avatar username={m.username} avatarUrl={m.avatar_url} size={44} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{m.username}</p>
                {m.full_name && <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{m.full_name}</p>}
              </div>
            </button>
            <button
              onClick={() => remove(m)}
              disabled={busyId === m.id}
              className="rounded-full px-4 h-8 text-xs shrink-0 transition-transform active:scale-95"
              style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600 }}
            >
              Remove
            </button>
          </div>
        ))
      )}

      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2.5 rounded-full px-4 h-11" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people to add"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text)" }}
          />
        </div>
      </div>

      {shown.slice(0, 25).map((c) => (
        <div key={c.id} className="flex items-center gap-3 px-4 py-2.5">
          <Avatar username={c.username} avatarUrl={c.avatar_url} size={44} />
          <span className="flex-1 text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{c.username}</span>
          <button
            onClick={() => add(c)}
            disabled={busyId === c.id}
            className="rounded-full px-4 h-8 text-xs shrink-0 transition-transform active:scale-95"
            style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busyId === c.id ? 0.6 : 1 }}
          >
            Add
          </button>
        </div>
      ))}
      {!loading && shown.length === 0 && (
        <p className="text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>No one else to add</p>
      )}
    </div>
  );
}

// ---- Profile photo or short video ----
// A video avatar (30 seconds or less) plays on the profile header. Everywhere
// else in the app shows a still, so a frame is captured from the video at
// upload time and stored as the normal avatar_url — no other screen needs
// to know videos exist.
const AVATAR_VIDEO_MAX_SECONDS = 30;

function readVideoMeta(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    v.src = url;
    const fail = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That video couldn't be read. Try a different file."));
    };
    v.onerror = fail;
    v.onloadedmetadata = () => {
      const duration = v.duration;
      // Grab a frame a little way in — the very first frame is often black.
      v.currentTime = Math.min(0.5, (duration || 1) / 2);
    };
    v.onseeked = () => {
      try {
        const size = Math.min(v.videoWidth, v.videoHeight) || 480;
        const out = 480;
        const canvas = document.createElement("canvas");
        canvas.width = out;
        canvas.height = out;
        const ctx = canvas.getContext("2d");
        // Centre square crop, the same crop the round avatar shows.
        const sx = (v.videoWidth - size) / 2;
        const sy = (v.videoHeight - size) / 2;
        ctx.drawImage(v, sx, sy, size, size, 0, 0, out, out);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) reject(new Error("Couldn't make a preview from that video."));
            else resolve({ duration: v.duration, frame: blob });
          },
          "image/jpeg",
          0.85
        );
      } catch (e) {
        fail();
      }
    };
  });
}

async function uploadAvatarMedia(userId, file) {
  const safe = (name) => name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const put = async (path, body, contentType) => {
    const { error } = await supabase.storage.from("avatars").upload(path, body, contentType ? { contentType } : undefined);
    if (error) throw error;
    return supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
  };

  if ((file.type || "").startsWith("video")) {
    const meta = await readVideoMeta(file);
    if (!meta.duration || meta.duration > AVATAR_VIDEO_MAX_SECONDS + 0.5) {
      throw new Error(`Profile videos can be up to ${AVATAR_VIDEO_MAX_SECONDS} seconds. This one is ${Math.round(meta.duration || 0)}s.`);
    }
    const stamp = Date.now();
    const [videoUrl, frameUrl] = await Promise.all([
      put(`${userId}/${stamp}-${safe(file.name)}`, file),
      put(`${userId}/${stamp}-frame.jpg`, meta.frame, "image/jpeg"),
    ]);
    return { avatar_url: frameUrl, avatar_video_url: videoUrl };
  }

  const small = await compressImage(file, 640, 0.85);
  const photoUrl = await put(`${userId}/${Date.now()}-${safe(small.name)}`, small);
  return { avatar_url: photoUrl, avatar_video_url: null };
}

// Only me / Public, used for the contact details on a profile.
function VisibilityPicker({ value, onChange }) {
  return (
    <div className="flex gap-1.5 px-4 pb-2.5">
      {[
        [false, "Only me", Lock],
        [true, "Public", Users],
      ].map(([v, label, Icon]) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(v)}
          className="flex items-center gap-1.5 rounded-full px-3 h-7 text-[12px]"
          style={{
            fontWeight: 600,
            background: value === v ? "var(--text)" : "var(--surface)",
            color: value === v ? "var(--bg)" : "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  );
}

// ---- Edit profile ----

// Instagram's username rules: lowercase letters, numbers, dots and
// underscores; 1-30 characters; no leading, trailing or doubled dots.
function validateUsername(raw) {
  const v = (raw || "").trim();
  if (v.length === 0) return "Username can't be empty";
  if (v.length > 30) return "Username can't be longer than 30 characters";
  if (!/^[a-z0-9._]+$/.test(v)) return "Only lowercase letters, numbers, periods and underscores";
  if (v.startsWith(".") || v.endsWith(".")) return "Username can't start or end with a period";
  if (v.includes("..")) return "Username can't have two periods in a row";
  return null;
}

const GENDERS = [
  { key: "male", label: "Male" },
  { key: "female", label: "Female" },
  { key: "third", label: "Third gender" },
];

function EditProfileScreen({ currentUserId: passedUserId, onBack, onSaved }) {
  // Work out who's signed in ourselves too — right after signing up or
  // switching accounts the id handed down can still be empty, and an empty
  // id is what made saving fail with 'invalid input syntax for type uuid'.
  const [currentUserId, setCurrentUserId] = useState(passedUserId || null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) setCurrentUserId(data.user.id);
    });
  }, [passedUserId]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarVideoUrl, setAvatarVideoUrl] = useState(null);
  const [birthday, setBirthday] = useState("");
  const [birthdayPublic, setBirthdayPublic] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [emailPublic, setEmailPublic] = useState(false);
  const [phonePublic, setPhonePublic] = useState(false);
  const [category, setCategory] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState([]);
  const [gender, setGender] = useState(null);

  const [nameError, setNameError] = useState(null);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);
  const fileRef = React.useRef(null);

  useEffect(() => {
    if (!currentUserId) return;
    (async () => {
      setError("");
      const { data, error: err } = await supabase
        .from("profiles")
        .select("username, full_name, bio, avatar_url, avatar_video_url, links, gender, contact_email, contact_phone, contact_email_public, contact_phone_public, category")
        .eq("id", currentUserId)
        .maybeSingle();
      if (err) setError(err.message);
      if (data) {
        setUsername(data.username || "");
        setOriginalUsername(data.username || "");
        setFullName(data.full_name || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || null);
        setAvatarVideoUrl(data.avatar_video_url || null);
        setContactEmail(data.contact_email || "");
        setEmailPublic(!!data.contact_email_public);
        setPhonePublic(!!data.contact_phone_public);
        setCategory(data.category || "");
        setContactPhone(data.contact_phone || "");
        // Birthday lives in its own owner-only table so nobody else can read it.
        supabase
          .from("profile_private")
          .select("birthday, birthday_public")
          .eq("user_id", currentUserId)
          .maybeSingle()
          .then(({ data: priv }) => {
            setBirthday(priv?.birthday || "");
            setBirthdayPublic(!!priv?.birthday_public);
          });
        setGender(data.gender || null);
        setLinks(Array.isArray(data.links) ? data.links : []);
      }
      setLoading(false);
    })();
  }, [currentUserId]);

  // Debounced availability check — only when it actually changed.
  useEffect(() => {
    const v = username.trim();
    setAvailable(null);
    const problem = validateUsername(v);
    setNameError(problem);
    if (problem || v.toLowerCase() === originalUsername.toLowerCase()) return;

    const t = setTimeout(async () => {
      setChecking(true);
      const { data, error: err } = await supabase.rpc("username_available", { p_username: v });
      setChecking(false);
      if (err) {
        setAvailable(null);
        return;
      }
      setAvailable(!!data);
    }, 450);
    return () => clearTimeout(t);
  }, [username, originalUsername]);

  const uploadAvatar = async (file) => {
    if (!file) return;
    if (!currentUserId) {
      setError("Still loading your account — try again in a moment.");
      return;
    }
    setAvatarBusy(true);
    setError("");
    try {
      const res = await uploadAvatarMedia(currentUserId, file);
      setAvatarUrl(res.avatar_url);
      setAvatarVideoUrl(res.avatar_video_url);
    } catch (e) {
      setError(e.message || "Upload failed");
    }
    setAvatarBusy(false);
  };

  const setLink = (i, field, value) =>
    setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));

  const addLink = () => {
    if (links.length >= 5) return;
    setLinks((prev) => [...prev, { title: "", url: "" }]);
  };

  const removeLink = (i) => setLinks((prev) => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    setError("");
    const problem = validateUsername(username);
    if (problem) {
      setError(problem);
      return;
    }
    if (available === false) {
      setError("That username is taken");
      return;
    }
    if (!gender) {
      setError("Please choose a gender — it's required");
      return;
    }
    if (birthday) {
      const b = new Date(birthday + "T00:00:00");
      if (isNaN(b.getTime()) || b.getTime() > Date.now()) {
        setError("Birthday can't be in the future");
        return;
      }
      if (b.getFullYear() < new Date().getFullYear() - 120) {
        setError("Please check the birthday year");
        return;
      }
    }
    const cEmail = contactEmail.trim();
    const cPhone = contactPhone.trim();
    if (cEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cEmail)) {
      setError("That contact email doesn't look right");
      return;
    }
    if (cPhone && !/^\+?[0-9 ()-]{6,20}$/.test(cPhone)) {
      setError("Phone number can only have digits, spaces, + ( ) and -");
      return;
    }
    if (bio.length > 150) {
      setError("Bio can't be longer than 150 characters");
      return;
    }

    // Drop blank rows and normalise the URLs so a bare domain still works.
    const cleanLinks = links
      .map((l) => ({ title: (l.title || "").trim(), url: (l.url || "").trim() }))
      .filter((l) => l.url)
      .slice(0, 5)
      .map((l) => ({
        title: l.title || l.url.replace(/^https?:\/\//, "").split("/")[0],
        url: /^https?:\/\//i.test(l.url) ? l.url : `https://${l.url}`,
      }));

    setSaving(true);
    if (!currentUserId) {
      setError("Still loading your account — try again in a moment.");
      return;
    }
    const { data: savedRows, error: err } = await supabase
      .from("profiles")
      .update({
        username: username.trim(),
        full_name: fullName.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl,
        avatar_video_url: avatarVideoUrl,
        contact_email: contactEmail.trim() || null,
        category: category.trim().slice(0, 30) || null,
        contact_phone: contactPhone.trim() || null,
        contact_email_public: !!contactEmail.trim() && emailPublic,
        contact_phone_public: !!contactPhone.trim() && phonePublic,
        links: cleanLinks,
        gender,
      })
      .eq("id", currentUserId)
      .select("id");

    if (!err && (!savedRows || savedRows.length === 0)) {
      setSaving(false);
      setError("Your profile wasn't found — log out and back in, then try again.");
      return;
    }
    if (err) {
      setSaving(false);
      // The unique index fires here if someone took the name in between.
      setError(err.message.includes("profiles_username_lower_idx") ? "That username is taken" : err.message);
      return;
    }

    const { error: privErr } = await supabase
      .from("profile_private")
      .upsert(
        { user_id: currentUserId, birthday: birthday || null, birthday_public: birthday ? birthdayPublic : false },
        { onConflict: "user_id" }
      );
    setSaving(false);
    if (privErr) {
      setError(`Saved, but the birthday didn't: ${privErr.message}`);
      return;
    }
    setFlash("Profile saved");
    setTimeout(() => setFlash(""), 1500);
    onSaved?.();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</span>
      </div>
    );
  }

  const nameState = nameError
    ? { text: nameError, color: "var(--heart)" }
    : checking
    ? { text: "Checking...", color: "var(--text-muted)" }
    : available === true
    ? { text: "Available", color: "var(--accent-solid)" }
    : available === false
    ? { text: "Taken", color: "var(--heart)" }
    : null;

  return (
    <div className="flex-1 overflow-y-auto pb-10">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90">
          <ChevronLeft size={24} color="var(--text)" />
        </button>
        <h1 className="flex-1 text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>Edit profile</h1>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full px-4 h-9 text-xs transition-transform active:scale-95"
          style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {error && <p className="text-xs px-4 pt-3" style={{ color: "var(--heart)" }}>{error}</p>}
      {flash && <p className="text-xs px-4 pt-3" style={{ color: "var(--accent-solid)" }}>{flash}</p>}

      <div className="flex flex-col items-center py-5">
        <button onClick={() => fileRef.current?.click()} className="relative transition-transform active:scale-95">
          <div
            className="rounded-full overflow-hidden flex items-center justify-center"
            style={{ width: 88, height: 88, background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {avatarVideoUrl ? (
              <video src={avatarVideoUrl} poster={avatarUrl || undefined} className="w-full h-full object-cover" autoPlay muted loop playsInline />
            ) : avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl" style={{ color: "var(--text)", fontWeight: 700 }}>
                {(username || "u")[0].toUpperCase()}
              </span>
            )}
          </div>
          <span
            className="absolute bottom-0 right-0 rounded-full flex items-center justify-center"
            style={{ width: 28, height: 28, background: ACCENT, border: "2px solid var(--bg)" }}
          >
            <ImagePlus size={14} color="var(--on-accent)" />
          </span>
        </button>
        <span className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
          {avatarBusy ? "Uploading..." : "Change photo or video"}
        </span>
        <span className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          Videos up to {AVATAR_VIDEO_MAX_SECONDS} seconds
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files[0]) uploadAvatar(e.target.files[0]);
            e.target.value = "";
          }}
        />
      </div>

      <div className="px-4">
        <label className="text-[11px] block mb-1.5" style={{ color: "var(--text-muted)" }}>Name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          maxLength={60}
          placeholder="Your name"
          className="w-full rounded-2xl px-4 h-12 text-sm outline-none mb-4"
          style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)" }}
        />

        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px]" style={{ color: "var(--text-muted)" }}>Username</label>
          {nameState && (
            <span className="text-[11px]" style={{ color: nameState.color, fontWeight: 600 }}>{nameState.text}</span>
          )}
        </div>
        <div
          className="flex items-center rounded-2xl px-4 h-12 mb-1"
          style={{ background: "var(--bg-sunken)", border: `1px solid ${nameError || available === false ? "var(--heart)" : "var(--border)"}` }}
        >
          <span className="text-sm shrink-0" style={{ color: "var(--text-muted)" }}>@</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
            maxLength={30}
            autoCapitalize="none"
            autoCorrect="off"
            className="flex-1 bg-transparent outline-none text-sm ml-1"
            style={{ color: "var(--text)" }}
          />
        </div>
        <p className="text-[11px] mb-4" style={{ color: "var(--text-muted)" }}>
          Lowercase letters, numbers, periods and underscores.
        </p>

        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px]" style={{ color: "var(--text-muted)" }}>Bio</label>
          <span className="text-[11px]" style={{ color: bio.length > 150 ? "var(--heart)" : "var(--text-muted)" }}>
            {bio.length}/150
          </span>
        </div>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 150))}
          rows={3}
          placeholder="Tell people about yourself"
          className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none mb-4"
          style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)" }}
        />

        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px]" style={{ color: "var(--text-muted)" }}>Links</label>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{links.length}/5</span>
        </div>
        {links.map((l, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <input
                value={l.title || ""}
                onChange={(e) => setLink(i, "title", e.target.value)}
                maxLength={30}
                placeholder="Label (optional)"
                className="w-full rounded-t-2xl px-4 h-10 text-sm outline-none"
                style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", borderBottom: "none", color: "var(--text)" }}
              />
              <input
                value={l.url || ""}
                onChange={(e) => setLink(i, "url", e.target.value)}
                placeholder="example.com"
                autoCapitalize="none"
                className="w-full rounded-b-2xl px-4 h-10 text-sm outline-none"
                style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
            </div>
            <button onClick={() => removeLink(i)} className="p-2 shrink-0 transition-transform active:scale-90">
              <X size={17} color="var(--text-muted)" />
            </button>
          </div>
        ))}
        {links.length < 5 && (
          <button
            onClick={addLink}
            className="w-full flex items-center justify-center gap-2 rounded-2xl h-11 text-xs mb-4 transition-transform active:scale-[0.99]"
            style={{ background: "var(--bg-sunken)", border: "1px dashed var(--border)", color: "var(--text)", fontWeight: 600 }}
          >
            <Plus size={15} /> Add link
          </button>
        )}

        <label className="text-[11px] block mb-1.5" style={{ color: "var(--text-muted)" }}>Category</label>
        <div className="flex flex-wrap gap-1.5 mb-1">
          {["", "Artist", "Creator", "Musician", "Photographer", "Blogger", "Gamer", "Business", "Education", "Public figure"].map((c) => (
            <button
              key={c || "none"}
              type="button"
              onClick={() => setCategory(c)}
              className="rounded-full px-3 h-8 text-xs"
              style={{
                fontWeight: 600,
                background: category === c ? "var(--text)" : "var(--bg-sunken)",
                color: category === c ? "var(--bg)" : "var(--text)",
                border: "1px solid var(--border)",
              }}
            >
              {c || "None"}
            </button>
          ))}
        </div>
        <p className="text-[11px] mt-1 mb-4" style={{ color: "var(--text-muted)" }}>Shown under your name on your profile.</p>

        <label className="text-[11px] block mb-1.5" style={{ color: "var(--text-muted)" }}>Contact options</label>
        <div className="rounded-2xl overflow-hidden mb-1" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 px-4 h-12">
            <Mail size={16} color="var(--text-muted)" />
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Email address (optional)"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--text)" }}
            />
          </div>
          {contactEmail.trim() !== "" && <VisibilityPicker value={emailPublic} onChange={setEmailPublic} />}
          <div className="flex items-center gap-3 px-4 h-12" style={{ borderTop: "1px solid var(--border)" }}>
            <Phone size={16} color="var(--text-muted)" />
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Phone number (optional)"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--text)" }}
            />
          </div>
          {contactPhone.trim() !== "" && <VisibilityPicker value={phonePublic} onChange={setPhonePublic} />}
        </div>
        <p className="text-[11px] mt-1 mb-4" style={{ color: "var(--text-muted)" }}>
          Set one to Public and your profile shows an Email, Call or Contact button. Only me keeps it hidden from everyone else.
        </p>

        <label className="text-[11px] block mb-1.5" style={{ color: "var(--text-muted)" }}>Birthday</label>
        <input
          type="date"
          value={birthday}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full rounded-2xl px-4 h-12 text-sm outline-none"
          style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)", colorScheme: "dark light" }}
        />
        {birthday !== "" && (
          <div className="rounded-2xl mt-1.5 py-2" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
            <VisibilityPicker value={birthdayPublic} onChange={setBirthdayPublic} />
          </div>
        )}
        <p className="text-[11px] mt-1 mb-4" style={{ color: "var(--text-muted)" }}>
          {birthday === ""
            ? "Loop uses this to check your age. It never appears on your profile unless you turn it on."
            : birthdayPublic
            ? "Shown on your profile as a day and month — the year stays private."
            : "Only you can see this."}
        </p>

        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px]" style={{ color: "var(--text-muted)" }}>Gender</label>
          <span className="text-[11px]" style={{ color: gender ? "var(--text-muted)" : "var(--heart)" }}>Required</span>
        </div>
        <div className="flex gap-2 mb-6">
          {GENDERS.map((g) => (
            <button
              key={g.key}
              onClick={() => setGender(g.key)}
              className="flex-1 rounded-2xl h-11 text-xs transition-transform active:scale-95"
              style={{
                background: gender === g.key ? ACCENT : "var(--bg-sunken)",
                border: gender === g.key ? "none" : "1px solid var(--border)",
                color: gender === g.key ? "var(--on-accent)" : "var(--text)",
                fontWeight: 600,
              }}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Profile → post feed ----
// Tapping a grid tile on Instagram doesn't open one post in isolation: it
// drops you into a scrollable column of that grid, positioned at the tile
// you touched. This renders the same list and jumps to that index.
function ProfileFeedScreen({ postIds, startIndex, title, currentUserId, onBack, onOpenProfile, onOpenReport }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentFor, setCommentFor] = useState(null);
  const [shareFor, setShareFor] = useState(null);
  const [optionsFor, setOptionsFor] = useState(null);
  const [likesFor, setLikesFor] = useState(null);
  const likePressRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const itemRefs = React.useRef({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!postIds || postIds.length === 0) {
        setLoading(false);
        return;
      }
      const { data: rows, error: err } = await supabase
        .from("posts")
        .select("id, user_id, media_url, media_type, media_count, caption, location, created_at, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, pinned, archived, aspect_ratio, removed_at, removed_reason, link_url, cover_url")
        .in("id", postIds);

      if (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
        return;
      }

      const mediaMap = await fetchPostMediaMap((rows || []).map((r) => r.id));

      const byId = {};
      (rows || []).forEach((r) => (byId[r.id] = r));
      // Preserve the grid's order rather than whatever the DB returned.
      const ordered = postIds.map((id) => byId[id]).filter(Boolean);

      const authorIds = [...new Set(ordered.map((p) => p.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", authorIds.length ? authorIds : ["x"]);

      const ids = ordered.map((p) => p.id);
      const [likesRes, savesRes, commentsRes, repostsRes, tagsRes] = await Promise.all([
        supabase.from("likes").select("post_id, user_id").in("post_id", ids),
        supabase.from("saves").select("post_id, user_id").in("post_id", ids),
        supabase.from("comments").select("post_id").in("post_id", ids),
        supabase.from("reposts").select("post_id, user_id").in("post_id", ids),
        supabase.from("post_tags").select("post_id, tagged_user_id").in("post_id", ids),
      ]);

      const likes = likesRes.data || [];
      const saves = savesRes.data || [];
      const comments = commentsRes.data || [];
      const reposts = repostsRes.data || [];
      const tagRows = tagsRes.data || [];

      const taggedIds = [...new Set(tagRows.map((t) => t.tagged_user_id))];
      let tagProfiles = [];
      if (taggedIds.length > 0) {
        const { data } = await supabase.from("profiles").select("id, username").in("id", taggedIds);
        tagProfiles = data || [];
      }

      const counts = await fetchPostCounts(ids);
      if (cancelled) return;
      setPosts(
        ordered.map((p) => {
          const author = (profiles || []).find((pr) => pr.id === p.user_id);
          return {
            ...p,
            username: author?.username || "unknown",
            avatarUrl: author?.avatar_url || null,
            likeCount: likes.filter((l) => l.post_id === p.id).length,
            liked: likes.some((l) => l.post_id === p.id && l.user_id === currentUserId),
            saveCount: saves.filter((sv) => sv.post_id === p.id).length,
            saved: saves.some((sv) => sv.post_id === p.id && sv.user_id === currentUserId),
            commentCount: comments.filter((c) => c.post_id === p.id).length,
            repostCount: reposts.filter((r) => r.post_id === p.id).length,
            reposted: reposts.some((r) => r.post_id === p.id && r.user_id === currentUserId),
            tags: tagRows
              .filter((t) => t.post_id === p.id)
              .map((t) => ({
                tagged_user_id: t.tagged_user_id,
                username: tagProfiles.find((tp) => tp.id === t.tagged_user_id)?.username || "unknown",
              })),
            media: mediaMap[p.id] || null,
            ...(counts[p.id]
              ? { likeCount: counts[p.id].likes, commentCount: counts[p.id].comments, repostCount: counts[p.id].reposts, saveCount: counts[p.id].saves }
              : {}),
          };
        })
      );
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [postIds, currentUserId]);

  // Jump to the tapped post once the list has rendered.
  useEffect(() => {
    if (loading || posts.length === 0) return;
    const target = posts[startIndex];
    if (!target) return;
    const el = itemRefs.current[target.id];
    if (el && containerRef.current) {
      containerRef.current.scrollTop = el.offsetTop - containerRef.current.offsetTop;
    }
  }, [loading, posts.length]);

  const toggleLike = async (post) => {
    if (!currentUserId) return;
    const was = post.liked;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, liked: !was, likeCount: was ? p.likeCount - 1 : p.likeCount + 1 } : p
      )
    );
    const { error: err } = was
      ? await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", currentUserId)
      : await supabase.from("likes").insert({ post_id: post.id, user_id: currentUserId });
    if (err) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, liked: was, likeCount: was ? p.likeCount + 1 : p.likeCount - 1 } : p
        )
      );
      return;
    }
    if (!was && post.user_id !== currentUserId) {
      await supabase.from("notifications").insert({
        user_id: post.user_id,
        actor_id: currentUserId,
        type: "like",
        post_id: post.id,
      });
    }
  };

  const toggleRepost = async (post) => {
    if (!currentUserId) return;
    const was = post.reposted;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, reposted: !was, repostCount: was ? p.repostCount - 1 : p.repostCount + 1 } : p
      )
    );
    const { error: err } = was
      ? await supabase.from("reposts").delete().eq("post_id", post.id).eq("user_id", currentUserId)
      : await supabase.from("reposts").insert({ post_id: post.id, user_id: currentUserId });
    if (err) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, reposted: was, repostCount: was ? p.repostCount + 1 : p.repostCount - 1 } : p
        )
      );
    }
  };

  const toggleSave = async (post) => {
    if (!currentUserId) return;
    const was = post.saved;
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, saved: !was, saveCount: was ? p.saveCount - 1 : p.saveCount + 1 } : p))
    );
    const { error: err } = was
      ? await supabase.from("saves").delete().eq("post_id", post.id).eq("user_id", currentUserId)
      : await supabase.from("saves").insert({ post_id: post.id, user_id: currentUserId });
    if (err) {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, saved: was, saveCount: was ? p.saveCount + 1 : p.saveCount - 1 } : p))
      );
      alert(err.message);
    }
  };

  const heading =
    title === "reels" ? "Reels" : title === "reposts" ? "Reposts" : title === "tagged" ? "Tagged" : "Posts";

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--bg)" }}>
      <div className="flex items-center gap-2 px-4 pt-4 pb-3 shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90">
          <ChevronLeft size={24} color="var(--text)" />
        </button>
        <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>{heading}</h1>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto pb-4">
        {error ? (
          <p className="text-xs text-center py-10 px-6" style={{ color: "var(--heart)" }}>{error}</p>
        ) : loading ? (
          <p className="text-xs text-center py-10" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-xs text-center py-10" style={{ color: "var(--text-muted)" }}>Nothing here</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              ref={(el) => (itemRefs.current[post.id] = el)}
              className="pb-3 mb-3"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
                <button onClick={() => onOpenProfile?.(post.user_id)} className="flex items-center gap-2.5 min-w-0">
                  <Avatar username={post.username} avatarUrl={post.avatarUrl} size={36} />
                  <div className="flex flex-col leading-tight min-w-0 text-left">
                    <span className="text-[13px] truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{post.username}</span>
                    {post.location && (
                      <span className="flex items-center gap-0.5 text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>
                        <MapPin size={9} /> {post.location}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => (post.user_id === currentUserId ? setOptionsFor(post) : onOpenReport?.(post.id))}
                  className="p-1 -mr-1 shrink-0"
                >
                  <Ellipsis size={19} color="var(--text)" />
                </button>
              </div>

              <div
                className="relative w-full overflow-hidden flex items-center justify-center"
                style={{ background: "var(--bg-sunken)", aspectRatio: postAspectCss(post) }}
              >
                {post.media && post.media.length > 1 ? (
                  <FeedPhotoTap onLike={() => !post.liked && toggleLike(post)}>
                    <PostMediaCarousel media={post.media} />
                  </FeedPhotoTap>
                ) : isPhotoPost(post) ? (
                  <FeedPhotoTap onLike={() => !post.liked && toggleLike(post)}>
                    <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                  </FeedPhotoTap>
                ) : (
                  <FeedVideo post={{ ...post, media_type: "video" }} onLike={() => !post.liked && toggleLike(post)} />
                )}
                <MediaTagOverlay tags={post.tags} isVideo={!isPhotoPost(post)} onOpenProfile={onOpenProfile} />
              </div>

              <div className="flex items-center justify-between px-4 pt-2.5">
                <div className="flex items-center gap-5">
                  <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
                    <button onClick={() => setShareFor(post)} className="h-7 flex items-center justify-center transition-transform active:scale-90">
                      <ShareIcon size={23} color="var(--text)" strokeWidth={1.9} />
                    </button>
                    <span className="text-[11px] leading-none h-3 mt-1">&nbsp;</span>
                  </div>
                  <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
                    <button onClick={() => toggleSave(post)} className="h-7 flex items-center justify-center transition-transform active:scale-90">
                      <Bookmark size={23} color="var(--text)" fill={post.saved ? "var(--text)" : "none"} strokeWidth={1.9} />
                    </button>
                    <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                      {!post.hide_saves && post.saveCount > 0 ? formatCount(post.saveCount) : "\u00A0"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center" style={{ minWidth: 34 }}>
                  <button
                    onClick={() => toggleLike(post)}
                    onTouchStart={() => {
                      likePressRef.current = setTimeout(() => setLikesFor(post), 500);
                    }}
                    onTouchEnd={() => clearTimeout(likePressRef.current)}
                    onTouchMove={() => clearTimeout(likePressRef.current)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setLikesFor(post);
                    }}
                    className="h-8 flex items-center justify-center transition-transform active:scale-90"
                  >
                    <Heart size={31} color={post.liked ? "var(--heart)" : "var(--text)"} fill={post.liked ? "var(--heart)" : "none"} strokeWidth={1.9} />
                  </button>
                  <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                    {!post.hide_likes && post.likeCount > 0 ? formatCount(post.likeCount) : "\u00A0"}
                  </span>
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
                    <button
                      onClick={() => !post.comments_disabled && setCommentFor(post)}
                      disabled={post.comments_disabled}
                      className="h-7 flex items-center justify-center transition-transform active:scale-90"
                    >
                      <MessageCircle size={23} color={post.comments_disabled ? "var(--toggle-off)" : "var(--text)"} strokeWidth={1.9} style={{ transform: "scaleX(-1)" }} />
                    </button>
                    <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                      {!post.hide_comments && post.commentCount > 0 ? formatCount(post.commentCount) : "\u00A0"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center" style={{ minWidth: 28 }}>
                    <button onClick={() => toggleRepost(post)} className="h-7 flex items-center justify-center transition-transform active:scale-90">
                      <RepostIcon size={25} color={post.reposted ? "var(--accent-solid)" : "var(--text)"} active={post.reposted} />
                    </button>
                    <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                      {!post.hide_reposts && post.repostCount > 0 ? formatCount(post.repostCount) : "\u00A0"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 pt-2">
                <CaptionText
                  username={post.username}
                  caption={post.caption}
                  onOpenProfile={() => onOpenProfile?.(post.user_id)}
                  onMention={(n) => openProfileByUsername(n, onOpenProfile)}
                />
                <PostLinkChip url={post.link_url} />
                {!post.comments_disabled && !post.hide_comments && post.commentCount > 1 && (
                  <button
                    onClick={() => setCommentFor(post)}
                    className="text-[13px] mt-1 block"
                    style={{ color: "var(--text-muted)" }}
                  >
                    View all {formatCount(post.commentCount)} comments
                  </button>
                )}
                {new Date(post.created_at).getTime() > Date.now() ? (
                  <span className="text-[10px] mt-1.5 flex items-center gap-1 uppercase" style={{ color: "var(--accent-solid)", letterSpacing: "0.3px", fontWeight: 600 }}>
                    <Clock size={10} /> Scheduled · {new Date(post.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                ) : (
                  <span className="text-[10px] mt-1.5 block uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.3px" }}>
                    {timeAgo(post.created_at)} ago
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {commentFor && (
        <ReelCommentsSheet
          postId={commentFor.id}
          postOwnerId={commentFor.user_id}
          currentUserId={currentUserId}
          postUsername={commentFor.username}
          postCaption={commentFor.caption}
          postAvatar={commentFor.avatarUrl}
          postCreatedAt={commentFor.created_at}
          postLink={commentFor.link_url}
          postTags={commentFor.tags}
          commentsDisabled={commentFor.comments_disabled}
          onOpenProfile={onOpenProfile}
          onClose={() => setCommentFor(null)}
          onCommentPosted={() => {
            const id = commentFor.id;
            setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, commentCount: p.commentCount + 1 } : p)));
          }}
        />
      )}

      {shareFor && (
        <ShareSheet item={shareFor} currentUserId={currentUserId} onClose={() => setShareFor(null)} />
      )}

      {likesFor && (
        <LikesViewsPopup
          post={likesFor}
          isOwner={likesFor.user_id === currentUserId}
          onClose={() => setLikesFor(null)}
          onOpenProfile={onOpenProfile}
        />
      )}

      {optionsFor && (
        <PostOptionsSheet
          post={optionsFor}
          onClose={() => setOptionsFor(null)}
          onSaved={(patch) => {
            const id = optionsFor.id;
            setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
            setOptionsFor((prev) => (prev ? { ...prev, ...patch } : prev));
          }}
          onDeleted={() => {
            const id = optionsFor.id;
            setOptionsFor(null);
            setPosts((prev) => {
              const next = prev.filter((p) => p.id !== id);
              if (next.length === 0) onBack();
              return next;
            });
          }}
        />
      )}
    </div>
  );
}

// ---- Edit a highlight ----
// Instagram's "Edit" screen: change the cover, rename it, and tick
// stories in or out — Selected shows what's in it now, Stories shows
// everything you've ever posted.
function EditHighlightScreen({ highlight, currentUserId, onClose, onSaved }) {
  const [title, setTitle] = useState(highlight.title || "");
  const [stories, setStories] = useState([]);
  const [picked, setPicked] = useState([]);
  const [tab, setTab] = useState("selected");
  const [cover, setCover] = useState(highlight.cover_url || null);
  const [coverSheet, setCoverSheet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const coverInput = React.useRef(null);

  useEffect(() => {
    (async () => {
      const [{ data: mine }, { data: links }] = await Promise.all([
        supabase
          .from("stories")
          .select("id, media_url, media_type, created_at")
          .eq("user_id", currentUserId || "")
          .order("created_at", { ascending: false })
          .limit(200),
        supabase.from("story_highlight_items").select("story_id").eq("highlight_id", highlight.id),
      ]);
      setStories(mine || []);
      setPicked((links || []).map((l) => l.story_id));
      setLoading(false);
    })();
  }, [highlight.id, currentUserId]);

  const toggle = (id) => setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const useStoryAsCover = async (st) => {
    setCoverSheet(false);
    if (st.media_type === "photo") {
      setCover(st.media_url);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const blob = await grabVideoFrame(st.media_url, 0.1);
      setCover(await uploadCoverBlob(blob, currentUserId));
    } catch (e) {
      setError(e?.message || "Loop couldn't take a picture from that story");
    }
    setBusy(false);
  };

  const useFileAsCover = async (f) => {
    setCoverSheet(false);
    setBusy(true);
    setError("");
    try {
      const small = await compressImage(f, 1080);
      setCover(await uploadCoverBlob(small, currentUserId));
    } catch (e) {
      setError(e?.message || "That picture didn't upload");
    }
    setBusy(false);
  };

  const save = async () => {
    const name = title.trim().slice(0, 30);
    if (!name) {
      setError("Give the highlight a name");
      return;
    }
    if (picked.length === 0) {
      setError("Keep at least one story, or delete the highlight instead");
      return;
    }
    setBusy(true);
    setError("");

    const { error: upErr } = await supabase
      .from("story_highlights")
      .update({ title: name, cover_url: cover })
      .eq("id", highlight.id);
    if (upErr) {
      setBusy(false);
      setError(upErr.message);
      return;
    }

    const { data: links } = await supabase.from("story_highlight_items").select("story_id").eq("highlight_id", highlight.id);
    const before = (links || []).map((l) => l.story_id);
    const added = picked.filter((id) => !before.includes(id));
    const removed = before.filter((id) => !picked.includes(id));

    if (added.length) {
      const { error: addErr } = await supabase
        .from("story_highlight_items")
        .insert(added.map((sid) => ({ highlight_id: highlight.id, story_id: sid })));
      if (addErr) {
        setBusy(false);
        setError(addErr.message);
        return;
      }
    }
    if (removed.length) {
      const { error: delErr } = await supabase
        .from("story_highlight_items")
        .delete()
        .eq("highlight_id", highlight.id)
        .in("story_id", removed);
      if (delErr) {
        setBusy(false);
        setError(delErr.message);
        return;
      }
    }
    setBusy(false);
    onSaved({ ...highlight, title: name, cover_url: cover });
  };

  const list = tab === "selected" ? stories.filter((st) => picked.includes(st.id)) : stories;

  return (
    <div className="absolute inset-0 z-[79] flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="flex items-center gap-3 px-4 h-14 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
        <button onClick={onClose} aria-label="Back">
          <ChevronLeft size={24} color="var(--text)" />
        </button>
        <span className="text-[16px] flex-1" style={{ color: "var(--text)", fontWeight: 700 }}>Edit</span>
        <button onClick={save} disabled={busy} className="text-[15px]" style={{ color: "var(--accent-solid)", fontWeight: 700, opacity: busy ? 0.5 : 1 }}>
          {busy ? "Saving…" : "Finished"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        <input
          ref={coverInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) useFileAsCover(f);
          }}
        />

        <div className="flex flex-col items-center pt-5 pb-4">
          <div className="rounded-full overflow-hidden flex items-center justify-center" style={{ width: 86, height: 86, background: "var(--surface)", border: "1px solid var(--border)" }}>
            {cover ? (
              <img src={cover} alt="" className="w-full h-full object-cover" />
            ) : (
              <Star size={26} color="var(--text-muted)" />
            )}
          </div>
          <button onClick={() => setCoverSheet(true)} className="text-[14px] mt-2.5" style={{ color: "var(--accent-solid)", fontWeight: 700 }}>
            Edit cover
          </button>
        </div>

        <div className="px-4 pb-4">
          <label className="text-[11px] block mb-1.5" style={{ color: "var(--text-muted)" }}>Highlight name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={30}
            placeholder="Travel, Food, Work…"
            className="w-full rounded-2xl px-4 h-12 text-sm outline-none"
            style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>

        {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}

        <div className="flex px-4" style={{ borderBottom: "1px solid var(--border)" }}>
          {[
            ["selected", `Selected${picked.length ? ` · ${picked.length}` : ""}`],
            ["all", "Stories"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className="flex-1 pb-2.5 text-[14px]"
              style={{
                color: tab === k ? "var(--text)" : "var(--text-muted)",
                fontWeight: tab === k ? 700 : 500,
                borderBottom: tab === k ? "2px solid var(--text)" : "2px solid transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>Loading…</p>
        ) : list.length === 0 ? (
          <p className="text-xs text-center py-10 px-8" style={{ color: "var(--text-muted)" }}>
            {tab === "selected"
              ? "Nothing is in this highlight. Open Stories and tap the ones to keep."
              : "You haven't posted any stories yet."}
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 px-4 pt-3">
            {list.map((st) => {
              const on = picked.includes(st.id);
              return (
                <button
                  key={st.id}
                  onClick={() => toggle(st.id)}
                  className="relative overflow-hidden rounded-xl"
                  style={{ aspectRatio: "9 / 16", background: "var(--bg-sunken)", border: on ? "2px solid var(--accent-solid)" : "1px solid var(--border)" }}
                >
                  {st.media_type === "photo" ? (
                    <img src={st.media_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <video src={videoThumb(st.media_url)} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                  )}
                  <span
                    className="absolute bottom-1.5 right-1.5 rounded-full flex items-center justify-center"
                    style={{ width: 20, height: 20, background: on ? ACCENT : "rgba(0,0,0,0.45)", border: on ? "none" : "1.5px solid rgba(255,255,255,0.85)" }}
                  >
                    {on && <Check size={12} color="var(--on-accent)" strokeWidth={3} />}
                  </span>
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] px-1 rounded" style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}>
                    {new Date(st.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {coverSheet && (
        <StorySheetShell title="Cover" onClose={() => setCoverSheet(false)}>
          <div className="pb-6">
            <p className="px-4 pb-2 text-[11px]" style={{ color: "var(--text-muted)" }}>Pick one of these stories, or use a picture of your own.</p>
            {picked.length > 0 && (
              <div className="flex gap-2 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {stories
                  .filter((st) => picked.includes(st.id))
                  .map((st) => (
                    <button
                      key={st.id}
                      onClick={() => useStoryAsCover(st)}
                      className="rounded-xl overflow-hidden shrink-0"
                      style={{ width: 56, height: 74, border: "1px solid var(--border)" }}
                    >
                      {st.media_type === "photo" ? (
                        <img src={st.media_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <video src={videoThumb(st.media_url)} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                      )}
                    </button>
                  ))}
              </div>
            )}
            <StoryMenuRow icon={<ImageIcon size={17} color="var(--text)" />} label="Choose from gallery" onClick={() => coverInput.current?.click()} />
          </div>
        </StorySheetShell>
      )}
    </div>
  );
}

// ---- Story highlights on the profile ----
// The rows come from story_highlights / story_highlight_items, which the
// story viewer has been writing into all along — this is the shelf that
// was missing.
function HighlightsRow({ profileId, username, isOwn, onOpen, onNew }) {
  const [items, setItems] = useState([]);
  const [archivedItems, setArchivedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manage, setManage] = useState(null); // highlight being held
  const [editing, setEditing] = useState(null);
  const [qrFor, setQrFor] = useState(null);
  const [sendFor, setSendFor] = useState(null);
  const [archiveList, setArchiveList] = useState(false);
  const [flash, setFlash] = useState("");
  const pressRef = React.useRef(null);
  const heldRef = React.useRef(false);

  const linkTo = (h) => `${window.location.origin}/u/${username || ""}?h=${h.id}`;
  const say = (m) => {
    setFlash(m);
    setTimeout(() => setFlash(""), 1800);
  };

  const load = async () => {
    // "archived" may not exist on older projects, so ask for it and fall
    // back to the plain columns rather than breaking the whole shelf.
    let hs = null;
    const withArchived = await supabase
      .from("story_highlights")
      .select("id, title, cover_url, archived")
      .eq("user_id", profileId)
      .order("created_at", { ascending: false });
    if (withArchived.error) {
      const plain = await supabase
        .from("story_highlights")
        .select("id, title, cover_url")
        .eq("user_id", profileId)
        .order("created_at", { ascending: false });
      hs = plain.data;
    } else {
      hs = withArchived.data;
    }

    const ids = (hs || []).map((h) => h.id);
    let firstStory = {};
    const countFor = {};
    if (ids.length > 0) {
      const { data: links } = await supabase
        .from("story_highlight_items")
        .select("highlight_id, story_id")
        .in("highlight_id", ids);
      const storyIds = [...new Set((links || []).map((l) => l.story_id))];
      if (storyIds.length > 0) {
        const { data: stories } = await supabase
          .from("stories")
          .select("id, media_url, media_type")
          .in("id", storyIds);
        const byId = {};
        (stories || []).forEach((st) => (byId[st.id] = st));
        (links || []).forEach((l) => {
          if (!byId[l.story_id]) return;
          countFor[l.highlight_id] = (countFor[l.highlight_id] || 0) + 1;
          if (!firstStory[l.highlight_id]) firstStory[l.highlight_id] = byId[l.story_id];
        });
      }
    }

    const shaped = (hs || []).map((h) => ({
      ...h,
      preview: h.cover_url || firstStory[h.id]?.media_url || null,
      previewIsVideo: !h.cover_url && firstStory[h.id] && firstStory[h.id].media_type !== "photo",
      count: countFor[h.id] || 0,
    }));
    setItems(shaped.filter((h) => !h.archived));
    setArchivedItems(shaped.filter((h) => h.archived));
    setLoading(false);
  };

  const remove = async (h) => {
    setManage(null);
    if (!window.confirm(`Delete the highlight "${h.title}"? The stories in it aren't deleted.`)) return;
    const { error } = await supabase.from("story_highlights").delete().eq("id", h.id);
    if (error) {
      alert(error.message);
      return;
    }
    setItems((prev) => prev.filter((x) => x.id !== h.id));
  };

  const setArchived = async (h, value) => {
    setManage(null);
    const { error } = await supabase.from("story_highlights").update({ archived: value }).eq("id", h.id);
    if (error) {
      alert(
        error.message.includes("archived")
          ? "Archiving needs the latest Loop SQL — run it in Supabase and try again."
          : error.message
      );
      return;
    }
    if (value) {
      setItems((prev) => prev.filter((x) => x.id !== h.id));
      setArchivedItems((prev) => [{ ...h, archived: true }, ...prev]);
      say(`"${h.title}" is archived`);
    } else {
      setArchivedItems((prev) => prev.filter((x) => x.id !== h.id));
      setItems((prev) => [{ ...h, archived: false }, ...prev]);
      say(`"${h.title}" is back on your profile`);
    }
  };

  const copyLink = async (h) => {
    setManage(null);
    try {
      await navigator.clipboard.writeText(linkTo(h));
      say("Link copied");
    } catch {
      say("Couldn't copy on this device");
    }
  };

  const shareTo = async (h) => {
    setManage(null);
    try {
      if (navigator.share) {
        await navigator.share({ title: `${h.title} · @${username}`, url: linkTo(h) });
        return;
      }
      await navigator.clipboard.writeText(linkTo(h));
      say("Link copied");
    } catch {
      say("Sharing isn't available here");
    }
  };

  useEffect(() => {
    load();
  }, [profileId]);

  if (loading) return null;
  if (items.length === 0 && !isOwn) return null;

  return (
    <div className="relative flex gap-4 px-4 pb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {isOwn && (
        <button onClick={onNew} className="flex flex-col items-center gap-1.5 shrink-0 transition-transform active:scale-95" style={{ width: 64 }}>
          <div
            className="rounded-full flex items-center justify-center"
            style={{ width: 64, height: 64, background: "var(--surface)", border: "1.5px dashed var(--border)" }}
          >
            <Plus size={22} color="var(--text-muted)" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] truncate w-full text-center" style={{ color: "var(--text)" }}>New</span>
        </button>
      )}
      {items.map((h) => (
        <button
          key={h.id}
          onClick={() => {
            if (heldRef.current) {
              heldRef.current = false;
              return;
            }
            onOpen(h);
          }}
          onTouchStart={() => {
            if (!isOwn) return;
            heldRef.current = false;
            pressRef.current = setTimeout(() => {
              heldRef.current = true;
              setManage(h);
            }, 450);
          }}
          onTouchEnd={() => clearTimeout(pressRef.current)}
          onTouchMove={() => clearTimeout(pressRef.current)}
          onContextMenu={(e) => {
            if (!isOwn) return;
            e.preventDefault();
            heldRef.current = true;
            setManage(h);
          }}
          className="flex flex-col items-center gap-1.5 shrink-0 transition-transform active:scale-95"
          style={{ width: 64 }}
        >
          <div
            className="rounded-full flex items-center justify-center"
            style={{ width: 64, height: 64, background: "var(--border)", padding: 2 }}
          >
            <div
              className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
              style={{ background: "var(--surface)", border: "2px solid var(--bg)" }}
            >
              {h.preview && h.previewIsVideo ? (
                <video src={videoThumb(h.preview)} className="w-full h-full object-cover" muted playsInline preload="metadata" />
              ) : h.preview ? (
                <img src={h.preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <Star size={20} color="var(--text-muted)" />
              )}
            </div>
          </div>
          <span className="text-[11px] truncate w-full text-center" style={{ color: "var(--text)" }}>{h.title}</span>
        </button>
      ))}
      {isOwn && archivedItems.length > 0 && (
        <button onClick={() => setArchiveList(true)} className="flex flex-col items-center gap-1.5 shrink-0 transition-transform active:scale-95" style={{ width: 64 }}>
          <div className="rounded-full flex items-center justify-center" style={{ width: 64, height: 64, background: "var(--surface)", border: "1.5px solid var(--border)" }}>
            <Archive size={20} color="var(--text-muted)" />
          </div>
          <span className="text-[11px] truncate w-full text-center" style={{ color: "var(--text-muted)" }}>Archived</span>
        </button>
      )}

      {flash && (
        <p className="absolute left-0 right-0 text-center text-[11px]" style={{ color: "var(--accent-solid)", marginTop: 72 }}>{flash}</p>
      )}

      {manage && (
        <StorySheetShell title={manage.title} onClose={() => setManage(null)}>
          <div className="pb-6">
            <p className="px-4 pb-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
              {manage.count === 0 ? "This highlight has no stories left." : `${manage.count} ${manage.count === 1 ? "story" : "stories"}`}
            </p>
            <StoryMenuRow
              icon={<Pencil size={17} color="var(--text)" />}
              label="Edit highlight"
              onClick={() => {
                setEditing(manage);
                setManage(null);
              }}
            />
            <StoryMenuRow
              icon={<Archive size={17} color="var(--text)" />}
              label={manage.archived ? "Put back on profile" : "Archive highlight"}
              onClick={() => setArchived(manage, !manage.archived)}
            />
            <StoryMenuRow icon={<Trash2 size={17} color="var(--heart)" />} label="Delete highlight" danger onClick={() => remove(manage)} />
            <div className="h-px my-1.5 mx-4" style={{ background: "var(--border)" }} />
            <StoryMenuRow
              icon={<ShareIcon size={17} color="var(--text)" />}
              label="Send to…"
              onClick={() => {
                setSendFor(manage);
                setManage(null);
              }}
            />
            <StoryMenuRow icon={<Copy size={17} color="var(--text)" />} label="Copy link" onClick={() => copyLink(manage)} />
            <StoryMenuRow
              icon={<QrCode size={17} color="var(--text)" />}
              label="Show QR code"
              onClick={() => {
                setQrFor(manage);
                setManage(null);
              }}
            />
            <StoryMenuRow icon={<Share2 size={17} color="var(--text)" />} label="Share to" onClick={() => shareTo(manage)} />
          </div>
        </StorySheetShell>
      )}

      {archiveList && (
        <StorySheetShell title="Archived highlights" onClose={() => setArchiveList(false)}>
          <div className="pb-6">
            <p className="px-4 pb-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
              These are hidden from your profile. Only you can see them here.
            </p>
            {archivedItems.map((h) => (
              <div key={h.id} className="flex items-center gap-3 px-4 py-2">
                <div className="rounded-full overflow-hidden shrink-0 flex items-center justify-center" style={{ width: 44, height: 44, background: "var(--surface)", border: "1px solid var(--border)" }}>
                  {h.preview && !h.previewIsVideo ? (
                    <img src={h.preview} alt="" className="w-full h-full object-cover" />
                  ) : h.preview ? (
                    <video src={videoThumb(h.preview)} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                  ) : (
                    <Star size={16} color="var(--text-muted)" />
                  )}
                </div>
                <span className="flex-1 min-w-0 text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{h.title}</span>
                <button
                  onClick={() => setArchived(h, false)}
                  className="rounded-lg px-3 h-8 text-xs shrink-0"
                  style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700 }}
                >
                  Put back
                </button>
              </div>
            ))}
          </div>
        </StorySheetShell>
      )}

      {sendFor && (
        <ForwardSheet
          message={{ content: `${sendFor.title} · @${username} on Loop: ${linkTo(sendFor)}` }}
          currentUserId={profileId}
          onClose={() => setSendFor(null)}
        />
      )}

      {qrFor && (
        <QRCardScreen
          title={qrFor.title}
          caption={`${qrFor.title} · @${username}`}
          link={linkTo(qrFor)}
          fileName={`loop-${qrFor.title}`}
          onBack={() => setQrFor(null)}
        />
      )}

      {editing && (
        <EditHighlightScreen
          highlight={editing}
          currentUserId={profileId}
          onClose={() => setEditing(null)}
          onSaved={(h) => {
            setEditing(null);
            setItems((prev) => prev.map((x) => (x.id === h.id ? { ...x, ...h } : x)));
            load();
          }}
        />
      )}
    </div>
  );
}

// Build a highlight out of stories you've already posted — including
// expired and archived ones, which is the whole point of a highlight.
function NewHighlightSheet({ currentUserId, onClose, onCreated }) {
  const [stories, setStories] = useState([]);
  const [picked, setPicked] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      // RLS lets owners read their own stories whatever the expiry, so this
      // is the archive: everything you've ever posted that still exists.
      const { data, error: err } = await supabase
        .from("stories")
        .select("id, media_url, media_type, created_at")
        .eq("user_id", currentUserId || "")
        .order("created_at", { ascending: false })
        .limit(100);
      if (err) setError(err.message);
      setStories(data || []);
      setLoading(false);
    })();
  }, [currentUserId]);

  const toggle = (id) => setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const create = async () => {
    const name = title.trim();
    if (!name || picked.length === 0) return;
    setBusy(true);
    setError("");
    const coverStory = stories.find((st) => st.id === picked[0] && st.media_type === "photo");
    const { data: created, error: err } = await supabase
      .from("story_highlights")
      .insert({ user_id: currentUserId, title: name, cover_url: coverStory?.media_url || null })
      .select("id, title, cover_url")
      .single();
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const { error: itemErr } = await supabase
      .from("story_highlight_items")
      .insert(picked.map((sid) => ({ highlight_id: created.id, story_id: sid })));
    setBusy(false);
    if (itemErr) {
      setError(itemErr.message);
      return;
    }
    onCreated(created);
  };

  return (
    <StorySheetShell title="New highlight" onClose={onClose}>
      {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}

      <div className="px-4 pb-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Highlight name — Travel, Food, Work..."
          maxLength={24}
          className="w-full rounded-full px-4 h-11 text-sm outline-none"
          style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)" }}
        />
      </div>

      <p className="text-[11px] px-4 pb-2" style={{ color: "var(--text-muted)" }}>
        {picked.length > 0 ? `${picked.length} selected` : "Pick the stories to keep"}
      </p>

      {loading ? (
        <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : stories.length === 0 ? (
        <p className="text-xs text-center py-8 px-8" style={{ color: "var(--text-muted)" }}>
          You haven't posted any stories yet. Post one and it can live here afterwards.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-1.5 px-4">
          {stories.map((st) => {
            const on = picked.includes(st.id);
            return (
              <button
                key={st.id}
                onClick={() => toggle(st.id)}
                className="aspect-square rounded-xl overflow-hidden relative"
                style={{ border: on ? "2px solid var(--accent-solid)" : "1px solid var(--border)", background: "var(--bg-sunken)" }}
              >
                {st.media_type === "photo" ? (
                  <img src={st.media_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <video src={videoThumb(st.media_url)} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                )}
                {on && (
                  <span className="absolute bottom-1 right-1 rounded-full flex items-center justify-center" style={{ width: 18, height: 18, background: ACCENT }}>
                    <Check size={11} color="var(--on-accent)" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="px-4 pt-4 pb-6">
        <button
          onClick={create}
          disabled={busy || !title.trim() || picked.length === 0}
          className="w-full rounded-full h-11 text-sm transition-transform active:scale-95"
          style={{
            background: ACCENT,
            color: "var(--on-accent)",
            fontWeight: 700,
            opacity: busy || !title.trim() || picked.length === 0 ? 0.5 : 1,
          }}
        >
          {busy ? "Creating..." : "Create highlight"}
        </button>
      </div>
    </StorySheetShell>
  );
}

// ---- Profile note ----
// 60 characters, 24 hours, sits in a bubble above the avatar.
function NoteBubble({ note, noteAt, isOwn, onEdit }) {
  const fresh = note && noteAt && Date.now() - new Date(noteAt).getTime() < 24 * 60 * 60 * 1000;
  if (!fresh && !isOwn) return null;

  return (
    <button
      onClick={isOwn ? onEdit : undefined}
      disabled={!isOwn}
      className="absolute text-left z-10"
      style={{ top: -14, left: 46, width: "max-content", maxWidth: 170 }}
    >
      <div
        className="rounded-2xl px-3 py-1.5"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border)",
          boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
        }}
      >
        <span
          className="text-[11px] block"
          style={{ color: fresh ? "var(--text)" : "var(--text-muted)", lineHeight: 1.3, wordBreak: "break-word" }}
        >
          {fresh ? note : "Leave a note..."}
        </span>
      </div>
      {/* the two little tails that make it read as a thought bubble */}
      <span className="block rounded-full" style={{ width: 7, height: 7, background: "var(--surface-raised)", border: "1px solid var(--border)", marginLeft: 10, marginTop: 2 }} />
      <span className="block rounded-full" style={{ width: 4, height: 4, background: "var(--surface-raised)", border: "1px solid var(--border)", marginLeft: 6, marginTop: 1 }} />
    </button>
  );
}

function NoteEditSheet({ initial, onClose, onSaved, currentUserId }) {
  const [text, setText] = useState(initial || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const save = async (clear) => {
    setBusy(true);
    setError("");
    const value = clear ? null : text.trim();
    const { error: err } = await supabase
      .from("profiles")
      .update({ note: value || null, note_created_at: value ? new Date().toISOString() : null })
      .eq("id", currentUserId);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    onSaved(value || null);
  };

  return (
    <StorySheetShell title="Leave a note" onClose={onClose}>
      {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}
      <div className="px-4 pb-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={60}
          autoFocus
          className="w-full rounded-2xl px-4 h-12 text-sm outline-none"
          style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)" }}
        />
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Disappears after 24 hours</span>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{text.length}/60</span>
        </div>
      </div>
      <div className="flex gap-2.5 px-4 pb-6">
        {initial && (
          <button
            onClick={() => save(true)}
            disabled={busy}
            className="flex-1 rounded-full h-11 text-sm transition-transform active:scale-95"
            style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--heart)", fontWeight: 600 }}
          >
            Delete note
          </button>
        )}
        <button
          onClick={() => save(false)}
          disabled={busy || !text.trim()}
          className="flex-1 rounded-full h-11 text-sm transition-transform active:scale-95"
          style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busy || !text.trim() ? 0.5 : 1 }}
        >
          {busy ? "Saving..." : "Share note"}
        </button>
      </div>
    </StorySheetShell>
  );
}

// ---- Profile tab icons ----
// Hand-drawn rather than lucide so all four share one stroke weight and
// optical size. Lucide's Grid3x3 / UserSquare2 sat at different visual
// weights next to each other, which is what made the old row look cheap.
function ProfileTabIcon({ kind, active }) {
  const c = active ? "var(--text)" : "var(--text-muted)";
  const w = active ? 1.9 : 1.5;
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: w,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (kind === "posts") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="5.6" height="5.6" rx="1.4" />
        <rect x="9.2" y="3" width="5.6" height="5.6" rx="1.4" />
        <rect x="15.4" y="3" width="5.6" height="5.6" rx="1.4" />
        <rect x="3" y="9.2" width="5.6" height="5.6" rx="1.4" />
        <rect x="9.2" y="9.2" width="5.6" height="5.6" rx="1.4" />
        <rect x="15.4" y="9.2" width="5.6" height="5.6" rx="1.4" />
        <rect x="3" y="15.4" width="5.6" height="5.6" rx="1.4" />
        <rect x="9.2" y="15.4" width="5.6" height="5.6" rx="1.4" />
        <rect x="15.4" y="15.4" width="5.6" height="5.6" rx="1.4" />
      </svg>
    );
  }

  if (kind === "reels") {
    return (
      <svg {...common}>
        <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="4.4" />
        <path d="M2.9 8.2h18.2" />
        <path d="M8.4 2.9 11.4 8.1" />
        <path d="M14.6 2.9 17.6 8.1" />
        <path d="M10.4 11.9v5.4l4.6-2.7z" fill={c} stroke="none" />
      </svg>
    );
  }

  if (kind === "reposts") {
    return <RepostIcon size={24} color={c} strokeWidth={w} />;
  }

  // tagged — a person inside a frame
  return (
    <svg {...common}>
      <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="4.4" />
      <circle cx="12" cy="10" r="2.9" />
      <path d="M6.9 18.6a5.6 5.6 0 0 1 10.2 0" />
    </svg>
  );
}

// ---- Follower / following list ----
function FollowListScreen({ targetId, mode, title, currentUserId, onBack, onOpenProfile }) {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // followers = rows pointing AT this person; following = rows they own.
      const column = mode === "followers" ? "following_id" : "follower_id";
      const other = mode === "followers" ? "follower_id" : "following_id";

      const { data: rows, error: err } = await supabase
        .from("follows")
        .select(`${other}`)
        .eq(column, targetId);

      if (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
        return;
      }

      const ids = (rows || []).map((r) => r[other]);
      if (ids.length === 0) {
        if (!cancelled) {
          setPeople([]);
          setLoading(false);
        }
        return;
      }
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .in("id", ids);
      if (!cancelled) {
        setPeople(profiles || []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [targetId, mode]);

  const q = query.trim().toLowerCase();
  const shown = people.filter(
    (p) => p.username.toLowerCase().includes(q) || (p.full_name || "").toLowerCase().includes(q)
  );

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3" style={{ background: "var(--bg)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-2 mb-3">
          <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90">
            <ChevronLeft size={24} color="var(--text)" />
          </button>
          <h1 className="text-lg truncate" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2.5 rounded-full px-4 h-11" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text)" }}
          />
          {query && (
            <button onClick={() => setQuery("")}><X size={15} color="var(--text-muted)" /></button>
          )}
        </div>
      </div>

      {error ? (
        <p className="text-xs text-center py-8 px-6" style={{ color: "var(--heart)" }}>{error}</p>
      ) : loading ? (
        <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : shown.length === 0 ? (
        <p className="text-xs text-center py-10" style={{ color: "var(--text-muted)" }}>
          {q ? "No one matches that" : mode === "followers" ? "No followers yet" : "Not following anyone yet"}
        </p>
      ) : (
        shown.map((p) => (
          <button
            key={p.id}
            onClick={() => onOpenProfile(p.id)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors active:bg-[var(--active-highlight)]"
          >
            <Avatar username={p.username} avatarUrl={p.avatar_url} size={46} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{p.username}</p>
              {p.full_name && (
                <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{p.full_name}</p>
              )}
            </div>
            {p.id === currentUserId && (
              <span className="text-[11px] shrink-0" style={{ color: "var(--text-muted)" }}>You</span>
            )}
          </button>
        ))
      )}
    </div>
  );
}

// Big profile photo (long-press someone's picture): blurred backdrop,
// large circle, and Follow · Share profile · Copy link · QR code.
function AvatarViewer({ profile, isOwn, isFollowing, onFollow, onEditPhoto, onShare, onQR, onClose }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/u/${profile.username}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // clipboard blocked — nothing else to do
    }
  };
  const Action = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 transition-transform active:scale-95" style={{ width: 76 }}>
      <span className="w-14 h-14 rounded-full flex items-center justify-center" style={{ border: "1.5px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.06)" }}>
        {icon}
      </span>
      <span className="text-[12px] text-center leading-tight" style={{ color: "#FFFFFF", fontWeight: 500 }}>{label}</span>
    </button>
  );
  return (
    <div className="absolute inset-0 z-[75] flex flex-col overflow-hidden" style={{ background: "#0b0d12" }} onClick={onClose}>
      {profile.avatar_url && (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url(${profile.avatar_url})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(40px) brightness(0.45)", transform: "scale(1.3)" }}
        />
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75))" }} />
      <div className="relative flex items-center gap-3 px-4 h-14 shrink-0">
        <button onClick={onClose} aria-label="Close">
          <ChevronLeft size={24} color="rgba(255,255,255,0.8)" />
        </button>
        <span className="text-[15px] truncate" style={{ color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>{profile.username}</span>
      </div>
      <div className="relative flex-1 flex items-center justify-center px-8">
        <div
          className="rounded-full overflow-hidden flex items-center justify-center"
          style={{ width: "min(78vw, 300px)", height: "min(78vw, 300px)", background: "var(--surface)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {profile.avatar_video_url ? (
            <video src={profile.avatar_video_url} poster={profile.avatar_url || undefined} className="w-full h-full object-cover" autoPlay loop playsInline muted />
          ) : profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span style={{ color: "var(--text)", fontSize: 96, fontWeight: 700 }}>{profile.username[0].toUpperCase()}</span>
          )}
        </div>
      </div>
      <div className="relative flex items-start justify-center gap-3 px-4 pb-10 pt-4" onClick={(e) => e.stopPropagation()}>
        {isOwn ? (
          <Action icon={<ImagePlus size={22} color="#fff" />} label="Edit" onClick={onEditPhoto} />
        ) : (
          <Action
            icon={isFollowing ? <UserCheck size={22} color="#fff" /> : <UserPlus size={22} color="#fff" />}
            label={isFollowing ? "Following" : "Follow"}
            onClick={onFollow}
          />
        )}
        <Action icon={<CircleUserRound size={22} color="#fff" />} label="Share profile" onClick={onShare} />
        <Action icon={<Link2 size={22} color="#fff" />} label={copied ? "Copied!" : "Copy link"} onClick={copy} />
        <Action icon={<QrCode size={22} color="#fff" />} label="QR code" onClick={onQR} />
      </div>
    </div>
  );
}

// Email / Call options from a profile's Contact button.
function ContactSheet({ profile, onClose }) {
  return (
    <StorySheetShell title={`Contact ${profile.username}`} onClose={onClose}>
      <div className="pb-6">
        {profile.contact_email && profile.contact_email_public && (
          <a href={`mailto:${profile.contact_email}`} onClick={onClose} className="block">
            <StoryMenuRow icon={<Mail size={17} color="var(--text)" />} label="Email" trailing={<span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{profile.contact_email}</span>} />
          </a>
        )}
        {profile.contact_phone && profile.contact_phone_public && (
          <a href={`tel:${profile.contact_phone.replace(/[^0-9+]/g, "")}`} onClick={onClose} className="block">
            <StoryMenuRow icon={<Phone size={17} color="var(--text)" />} label="Call" trailing={<span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{profile.contact_phone}</span>} />
          </a>
        )}
      </div>
    </StorySheetShell>
  );
}

const REPORT_REASONS = [
  "Spam",
  "Nudity or sexual content",
  "Hate speech or symbols",
  "Bullying or harassment",
  "Violence or dangerous content",
  "Scam or fraud",
  "Pretending to be someone else",
  "May be under 13",
  "Something else",
];

// Your moderation role, if any ("admin" | "moderator" | null). Cached for
// the session so screens don't ask the database again and again.
let staffRolePromise = null;
function getMyStaffRole() {
  if (!staffRolePromise) {
    staffRolePromise = supabase
      .rpc("my_staff_role")
      .then(({ data, error }) => (error ? null : data || null))
      .catch(() => null);
  }
  return staffRolePromise;
}
function useStaffRole() {
  const [role, setRole] = useState(null);
  useEffect(() => {
    getMyStaffRole().then(setRole);
  }, []);
  return role;
}

function ProfileScreen({ userId, initialHighlightId, onHighlightOpened, onMessage, onOpenModeration, onOpenSettings, onOpenPost, onBack, onOpenProfile, onOpenProfileFeed, onOpenHighlight, onAddStory, onOpenProfileStory, onOpenEditProfile, onOpenActivity, onOpenArchive, onOpenSaved, onOpenPeopleList, onAddAccount, onSwitched, onCreate }) {
  const [tab, setTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reposts, setReposts] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [tagged, setTagged] = useState([]);
  const [followList, setFollowList] = useState(null); // "followers" | "following"
  const [sheet, setSheet] = useState(null); // note | newHighlight | avatar
  const [highlightsKey, setHighlightsKey] = useState(0);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [privacyBusy, setPrivacyBusy] = useState(false);
  // How you relate to the person whose profile this is.
  const [myRel, setMyRel] = useState({ blocked: false, blockedBy: false, muted: false, restricted: false });
  const [relBusy, setRelBusy] = useState(null);
  const staffRole = useStaffRole();
  const [reportNote, setReportNote] = useState("");
  const [avatarViewer, setAvatarViewer] = useState(false);
  const [birthdayInfo, setBirthdayInfo] = useState(null); // { date, shared }
  const [qrOpen, setQrOpen] = useState(false);
  const [storyFile, setStoryFile] = useState(null);
  const [viewStoryFor, setViewStoryFor] = useState(null); // profile id
  const [viewHighlight, setViewHighlight] = useState(null);
  const storyInputRef = React.useRef(null);
  const [showSuggest, setShowSuggest] = useState(false);
  const [similar, setSimilar] = useState(null);
  const [reelSort, setReelSort] = useState("latest"); // latest | views
  const [reelSortMenu, setReelSortMenu] = useState(false);
  const [hasStory, setHasStory] = useState(false);
  const avatarInputRef = React.useRef(null);
  const avatarPressRef = React.useRef(null);
  const avatarLongRef = React.useRef(false);

  const tabOrder = ["posts", "reels", "reposts", "tagged"];
  // Reels are just video posts — no separate table, so split by media_type.
  // A carousel is never a Reel, even if its cover happens to be a video —
  // the media_count guard keeps carousels out of this split.
  const reelsRaw = posts.filter((p) => !isPhotoPost(p) && (p.media_count || 1) <= 1);
  const reels =
    reelSort === "views"
      ? reelsRaw.slice().sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
      : reelsRaw;
  const photos = posts;
  const gridFor = tab === "posts" ? photos : tab === "reels" ? reels : tab === "reposts" ? reposts : tagged;
  const isOwnProfile = myId && profile && myId === profile.id;

  const touchStartX = React.useRef(0);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const currentIndex = tabOrder.indexOf(tab);
    if (deltaX < -50 && currentIndex < tabOrder.length - 1) setTab(tabOrder[currentIndex + 1]);
    else if (deltaX > 50 && currentIndex > 0) setTab(tabOrder[currentIndex - 1]);
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    setMyId(user?.id ?? null);

    const targetId = userId || user?.id;
    if (!targetId) { setLoading(false); return; }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, username, full_name, bio, avatar_url, avatar_video_url, note, note_created_at, links, gender, is_private, contact_email, contact_phone, contact_email_public, contact_phone_public, is_verified, category")
      .eq("id", targetId)
      .single();
    setProfile(profileData);

    // The birthday lives in its own owner-only table. This function hands
    // it back only when its owner chose Public (or when it's yours).
    try {
      const { data: bd } = await supabase.rpc("public_birthday", { p_user: targetId });
      const row = Array.isArray(bd) ? bd[0] : bd;
      setBirthdayInfo(row?.birthday ? { date: row.birthday, shared: !!row.is_public } : null);
    } catch {
      setBirthdayInfo(null);
    }

    const isViewingOwnPosts = user && user.id === targetId;

    let postsQuery = supabase
      .from("posts")
      .select("id, media_url, media_type, media_count, caption, location, created_at, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, pinned, archived, removed_at, removed_reason, views_count, cover_url")
      .eq("user_id", targetId);
    if (!isViewingOwnPosts) {
      postsQuery = postsQuery.eq("archived", false);
    }
    const { data: ownPosts } = await postsQuery.order("created_at", { ascending: false });
    // Collab posts they accepted show on their grid too.
    let collabPosts = [];
    const { data: collabRows } = await supabase.from("post_collaborators").select("post_id").eq("user_id", targetId).eq("status", "accepted");
    const collabIds = (collabRows || []).map((c) => c.post_id);
    if (collabIds.length) {
      const { data } = await supabase
        .from("posts")
        .select("id, media_url, media_type, media_count, caption, location, created_at, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, pinned, archived, removed_at, removed_reason, views_count, user_id, cover_url")
        .in("id", collabIds)
        .eq("archived", false);
      collabPosts = (data || []).map((pp) => ({ ...pp, pinned: false, isCollab: true }));
    }
    const postsData = [...(ownPosts || []), ...collabPosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const sortedPosts = (postsData || []).slice().sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return 0;
    });
    setPosts(sortedPosts);

    // Give older videos the picture they never had.
    if (isViewingOwnPosts && user?.id) {
      healMissingCovers(
        sortedPosts.map((pp) => ({ ...pp, user_id: pp.user_id || targetId })),
        user.id,
        (id, url) => setPosts((prev) => prev.map((pp) => (pp.id === id ? { ...pp, cover_url: url } : pp)))
      );
    }

    const { data: repostsData } = await supabase
      .from("reposts")
      .select("post_id")
      .eq("user_id", targetId);

    if (repostsData && repostsData.length > 0) {
      const postIds = repostsData.map((r) => r.post_id);
      const { data: repostedPosts } = await supabase
        .from("posts")
        .select("id, media_url, media_type, cover_url")
        .in("id", postIds);
      setReposts(repostedPosts || []);
    } else {
      setReposts([]);
    }

    // Tagged: posts other people tagged this person in.
    const { data: tagRows } = await supabase
      .from("post_tags")
      .select("post_id")
      .eq("tagged_user_id", targetId);
    const tagIds = [...new Set((tagRows || []).map((r) => r.post_id))];
    if (tagIds.length > 0) {
      const { data: taggedPosts } = await supabase
        .from("posts")
        .select("id, media_url, media_type, cover_url")
        .in("id", tagIds)
        .eq("archived", false)
        .order("created_at", { ascending: false });
      setTagged(taggedPosts || []);
    } else {
      setTagged([]);
    }

    const { count: followers } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", targetId);
    setFollowerCount(followers || 0);

    const { count: following } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", targetId);
    setFollowingCount(following || 0);

    if (user && targetId !== user.id) {
      const { data: existingFollow } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", targetId)
        .maybeSingle();
      setIsFollowing(!!existingFollow);
    }

    if (user && targetId === user.id && profileData) {
      rememberCurrentAccount(profileData);
    }

    if (user && targetId !== user.id) {
      const rel = await getRelations();
      setMyRel({
        blocked: rel.blocked.has(targetId),
        blockedBy: rel.blockedBy.has(targetId),
        muted: rel.muted.has(targetId),
        restricted: rel.restricted.has(targetId),
      });
    }

    setLoading(false);
  };

  // "Suggested accounts" on someone's profile: people they follow that you
  // don't, then people who follow the same accounts.
  const loadSimilar = async () => {
    if (!profile || !myId) return;
    const [{ data: theirs }, { data: mine }, rel] = await Promise.all([
      supabase.from("follows").select("following_id").eq("follower_id", profile.id).limit(60),
      supabase.from("follows").select("following_id").eq("follower_id", myId),
      getRelations(),
    ]);
    const skip = new Set([myId, profile.id, ...(mine || []).map((f) => f.following_id)]);
    let ids = (theirs || []).map((f) => f.following_id).filter((id) => !skip.has(id) && !isBlockedEither(rel, id));
    if (ids.length < 5) {
      const { data: alsoFollow } = await supabase.from("follows").select("follower_id").eq("following_id", profile.id).limit(40);
      (alsoFollow || []).forEach((f) => {
        if (!skip.has(f.follower_id) && !ids.includes(f.follower_id) && !isBlockedEither(rel, f.follower_id)) ids.push(f.follower_id);
      });
    }
    ids = ids.slice(0, 12);
    if (ids.length === 0) {
      setSimilar([]);
      return;
    }
    const { data: profs } = await supabase.from("profiles").select("id, username, avatar_url").in("id", ids);
    setSimilar((profs || []).map((pp) => ({ ...pp, mutualName: profile.username, mutualCount: 1, followed: false })));
  };

  const followSimilar = async (pp) => {
    if (!myId) return;
    if (pp.followed) {
      setSimilar((prev) => prev.map((x) => (x.id === pp.id ? { ...x, followed: false } : x)));
      await supabase.from("follows").delete().eq("follower_id", myId).eq("following_id", pp.id);
      return;
    }
    setSimilar((prev) => prev.map((x) => (x.id === pp.id ? { ...x, followed: true } : x)));
    const { error } = await supabase.from("follows").insert({ follower_id: myId, following_id: pp.id });
    if (!error) await supabase.from("notifications").insert({ user_id: pp.id, actor_id: myId, type: "follow" });
  };

  // A coloured ring only when they have a story from the last 24 hours.
  useEffect(() => {
    if (!profile?.id) return;
    supabase
      .from("stories")
      .select("id")
      .eq("user_id", profile.id)
      .gt("created_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString())
      .limit(1)
      .then(({ data, error }) => setHasStory(!error && (data || []).length > 0));
  }, [profile?.id]);

  const flashNote = (msg) => {
    setReportNote(msg);
    setTimeout(() => setReportNote(""), 2200);
  };

  const reportAccount = async (reason) => {
    setSheet(null);
    if (!myId || !profile) return;
    const { error } = await supabase.from("reports").insert({ reported_user_id: profile.id, reporter_id: myId, reason });
    flashNote(error ? error.message : "Thanks — we'll review this account.");
  };

  const modBanProfile = async (days) => {
    if (!profile) return;
    const label = days ? `Suspend ${profile.username} for ${days} days?` : `Ban ${profile.username} permanently? Their posts will be hidden.`;
    if (!window.confirm(label)) return;
    setSheet(null);
    const { error } = await supabase.rpc("mod_ban", { p_user: profile.id, p_days: days, p_reason: "Suspended by moderator" });
    flashNote(error ? error.message : days ? `Suspended for ${days} days` : "Banned permanently");
  };

  const modUnbanProfile = async () => {
    if (!profile) return;
    setSheet(null);
    const { error } = await supabase.rpc("mod_unban", { p_user: profile.id });
    flashNote(error ? error.message : "Suspension lifted");
  };

  const changeAvatar = async (file) => {
    if (!file || !myId) return;
    setAvatarBusy(true);
    let res;
    try {
      res = await uploadAvatarMedia(myId, file);
    } catch (e) {
      setAvatarBusy(false);
      alert(e.message || "Upload failed");
      return;
    }
    const { error: dbErr } = await supabase.from("profiles").update(res).eq("id", myId);
    setAvatarBusy(false);
    if (dbErr) {
      alert(dbErr.message);
      return;
    }
    setProfile((prev) => ({ ...prev, ...res }));
    setSheet(null);
  };

  const removeAvatar = async () => {
    if (!myId) return;
    setAvatarBusy(true);
    const { error } = await supabase.from("profiles").update({ avatar_url: null, avatar_video_url: null }).eq("id", myId);
    setAvatarBusy(false);
    if (error) {
      alert(error.message);
      return;
    }
    setProfile((prev) => ({ ...prev, avatar_url: null, avatar_video_url: null }));
    setSheet(null);
  };

  const toggleRelation = async (kind) => {
    if (!myId || !profile) return;
    const on = myRel[kind];
    if (kind === "blocked" && !on) {
      const ok = window.confirm(
        `Block ${profile.username}? They won't be able to find your profile, see your posts or message you. They won't be told.`
      );
      if (!ok) return;
    }
    setRelBusy(kind);
    const { error } = on
      ? await supabase
          .from("user_relations")
          .delete()
          .eq("user_id", myId)
          .eq("target_id", profile.id)
          .eq("kind", kind)
      : await supabase.from("user_relations").insert({ user_id: myId, target_id: profile.id, kind });
    setRelBusy(null);
    if (error) {
      alert(error.message);
      return;
    }
    invalidateRelations();
    setMyRel((prev) => ({ ...prev, [kind]: !on }));
    if (kind === "blocked" && !on) {
      // The server already removed the follow both ways; mirror it here.
      setIsFollowing(false);
      setSheet(null);
    }
  };

  const togglePrivacy = async () => {
    if (!myId || !profile) return;
    setPrivacyBusy(true);
    const next = !profile.is_private;
    const { error } = await supabase.from("profiles").update({ is_private: next }).eq("id", myId);
    setPrivacyBusy(false);
    if (error) {
      alert(error.message);
      return;
    }
    setProfile((prev) => ({ ...prev, is_private: next }));
  };

  const toggleFollow = async () => {
    if (!myId || !profile) return;
    setFollowBusy(true);

    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", myId).eq("following_id", profile.id);
      setIsFollowing(false);
      setFollowerCount((c) => c - 1);
    } else {
      await supabase.from("follows").insert({ follower_id: myId, following_id: profile.id });
      await supabase.from("notifications").insert({
        user_id: profile.id,
        actor_id: myId,
        type: "follow",
      });
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
    }
    setFollowBusy(false);
  };

  // A shared highlight link lands here: open it once, then forget it.
  useEffect(() => {
    if (!initialHighlightId || !profile) return;
    let cancelled = false;
    supabase
      .from("story_highlights")
      .select("id, title, cover_url, user_id")
      .eq("id", initialHighlightId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data) setViewHighlight(data);
        onHighlightOpened?.();
      });
    return () => {
      cancelled = true;
    };
  }, [initialHighlightId, profile]);

  const birthdayShared = !!birthdayInfo?.shared;
  const birthdayLine = birthdayInfo?.date
    ? new Date(birthdayInfo.date + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "long" })
    : null;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>Profile not found</span>
      </div>
    );
  }

  // Someone who blocked you: Instagram shows nothing at all, not even that
  // a block exists.
  if (!isOwnProfile && myRel.blockedBy) {
    return (
      <div className="flex-1 flex flex-col" style={{ background: "var(--bg)" }}>
        {onBack && (
          <div className="px-4 pt-4 pb-3">
            <button onClick={onBack} className="-ml-1.5 p-1 transition-transform active:scale-90">
              <ChevronLeft size={24} color="var(--text)" />
            </button>
          </div>
        )}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-2">
          <p className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>This account isn't available</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>The link may be broken, or the profile may have been removed.</p>
        </div>
      </div>
    );
  }

  if (followList) {
    return (
      <FollowListScreen
        targetId={profile.id}
        mode={followList}
        title={followList === "followers" ? "Followers" : "Following"}
        currentUserId={myId}
        onBack={() => setFollowList(null)}
        onOpenProfile={(id) => {
          setFollowList(null);
          onOpenProfile?.(id);
        }}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90"><ChevronLeft size={24} color="var(--text)" /></button>
          )}
          <button
            onClick={() => isOwnProfile && setSheet("accounts")}
            disabled={!isOwnProfile}
            className="flex items-center gap-1 min-w-0 transition-transform active:scale-95"
          >
            <span className="text-base truncate" style={{ color: "var(--text)", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
              {profile.username}
            </span>
            {profile.is_verified && <VerifiedBadge size={15} />}
            {isOwnProfile && <ChevronLeft size={16} color="var(--text-muted)" style={{ transform: "rotate(-90deg)" }} />}
          </button>
          {profile.is_private && (
            <Lock size={13} color="var(--text-muted)" className="shrink-0" />
          )}
        </div>
        {isOwnProfile ? (
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setSheet("create")} className="transition-transform active:scale-90">
              <PlusSquare size={22} color="var(--text)" />
            </button>
            <button onClick={() => onOpenSettings?.()} className="transition-transform active:scale-90">
              <SlidersHorizontal size={21} color="var(--text)" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setSheet("safety")} className="p-1 transition-transform active:scale-90">
              <Ellipsis size={20} color="var(--text)" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 px-4 mb-3 mt-3">
        <div className="shrink-0 relative">
          <NoteBubble
            note={profile.note}
            noteAt={profile.note_created_at}
            isOwn={isOwnProfile}
            onEdit={() => setSheet("note")}
          />
          <button
            onClick={() => {
              // Long press already opened the photo menu; ignore the click
              // that follows lifting the finger.
              if (avatarLongRef.current) {
                avatarLongRef.current = false;
                return;
              }
              if (isOwnProfile) {
                if (hasStory) setViewStoryFor(profile.id);
                else storyInputRef.current?.click();
              } else if (hasStory) {
                setViewStoryFor(profile.id);
              } else {
                setAvatarViewer(true);
              }
            }}
            onTouchStart={() => {
              avatarLongRef.current = false;
              avatarPressRef.current = setTimeout(() => {
                avatarLongRef.current = true;
                if (isOwnProfile) setSheet("avatar");
                else setAvatarViewer(true);
              }, 450);
            }}
            onTouchEnd={() => clearTimeout(avatarPressRef.current)}
            onTouchMove={() => clearTimeout(avatarPressRef.current)}
            onContextMenu={(e) => {
              e.preventDefault();
              avatarLongRef.current = true;
              if (isOwnProfile) setSheet("avatar");
              else setAvatarViewer(true);
            }}
            className="rounded-full flex items-center justify-center transition-transform active:scale-95"
            style={{
              width: 88,
              height: 88,
              background: hasStory ? "linear-gradient(135deg, var(--ring-start) 0%, var(--ring-end) 100%)" : "transparent",
              padding: hasStory ? 3 : 0,
            }}
          >
            <div
              className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
              style={{ background: "var(--border)", border: hasStory ? "3px solid var(--bg)" : "none" }}
            >
              {profile.avatar_video_url ? (
                <video src={profile.avatar_video_url} poster={profile.avatar_url || undefined} className="w-full h-full object-cover" autoPlay muted loop playsInline />
              ) : profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl" style={{ color: "var(--text)", fontWeight: 700 }}>
                  {profile.username[0].toUpperCase()}
                </span>
              )}
            </div>
          </button>
        </div>

        <div className="flex-1 flex justify-around">
          <div className="flex flex-col items-center">
            <span className="text-[17px]" style={{ color: "var(--text)", fontWeight: 700 }}>{posts.length}</span>
            <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Posts</span>
          </div>
          <button onClick={() => setFollowList("followers")} className="flex flex-col items-center transition-transform active:scale-95">
            <span className="text-[17px]" style={{ color: "var(--text)", fontWeight: 700 }}>{formatCount(followerCount)}</span>
            <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Followers</span>
          </button>
          <button onClick={() => setFollowList("following")} className="flex flex-col items-center transition-transform active:scale-95">
            <span className="text-[17px]" style={{ color: "var(--text)", fontWeight: 700 }}>{formatCount(followingCount)}</span>
            <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Following</span>
          </button>
        </div>
      </div>

      <div className="px-4 mb-3">
        <p className="text-[13px]" style={{ color: "var(--text)", fontWeight: 700 }}>
          {profile.full_name || profile.username}
        </p>
        {profile.category && (
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>{profile.category}</p>
        )}
        {profile.bio && (
          <p className="text-[13px] mt-0.5" style={{ color: "var(--text)", whiteSpace: "pre-wrap", lineHeight: 1.4 }}>{profile.bio}</p>
        )}
        {birthdayLine && (
          <p className="flex items-center gap-1.5 text-[12px] mt-1.5" style={{ color: "var(--text-muted)" }}>
            <Cake size={12} /> {birthdayLine}
            {isOwnProfile && !birthdayShared && <span style={{ opacity: 0.7 }}>· only you</span>}
          </p>
        )}
        {Array.isArray(profile.links) && profile.links.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
            {profile.links.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[13px]"
                style={{ color: "var(--accent-solid)", fontWeight: 600 }}
              >
                <Share2 size={11} /> {l.title || l.url}
              </a>
            ))}
          </div>
        )}
      </div>

      {!isOwnProfile && !myRel.blocked && (
        <>
          <div className="flex gap-1.5 px-4 mb-3">
            <button
              onClick={toggleFollow}
              disabled={followBusy}
              className="flex-1 rounded-lg h-9 text-[13px] transition-transform active:scale-[0.98]"
              style={{
                background: isFollowing ? "var(--surface)" : ACCENT,
                border: isFollowing ? "1px solid var(--border)" : "none",
                color: isFollowing ? "var(--text)" : "var(--on-accent)",
                fontWeight: 700,
                opacity: followBusy ? 0.6 : 1,
              }}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
            {!myRel.blockedBy && (
              <button
                onClick={() => onMessage?.(profile)}
                className="flex-1 rounded-lg h-9 text-[13px] transition-transform active:scale-[0.98]"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 700 }}
              >
                Message
              </button>
            )}
            {((profile.contact_email && profile.contact_email_public) || (profile.contact_phone && profile.contact_phone_public)) && (
              <button
                onClick={() => {
                  const e = profile.contact_email_public ? profile.contact_email : null;
                  const ph = profile.contact_phone_public ? profile.contact_phone : null;
                  if (e && !ph) window.location.href = `mailto:${e}`;
                  else if (ph && !e) window.location.href = `tel:${ph.replace(/[^0-9+]/g, "")}`;
                  else setSheet("contact");
                }}
                className="flex-1 rounded-lg h-9 text-[13px] transition-transform active:scale-[0.98]"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 700 }}
              >
                {profile.contact_email_public && profile.contact_phone_public ? "Contact" : profile.contact_email_public ? "Email" : "Call"}
              </button>
            )}
            <button
              onClick={() => {
                const next = !showSuggest;
                setShowSuggest(next);
                if (next && similar === null) loadSimilar();
              }}
              aria-label="Suggested accounts"
              className="rounded-lg h-9 w-10 flex items-center justify-center transition-transform active:scale-[0.98]"
              style={{ background: showSuggest ? "var(--text)" : "var(--surface)", border: "1px solid var(--border)" }}
            >
              <UserPlus size={16} color={showSuggest ? "var(--bg)" : "var(--text)"} />
            </button>
          </div>
          {showSuggest && (
            <div className="mb-2">
              {similar === null ? (
                <p className="text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>Loading…</p>
              ) : similar.length === 0 ? (
                <p className="text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>No suggestions right now</p>
              ) : (
                <SuggestedAccountsStrip
                  people={similar}
                  onOpenProfile={(id) => onOpenProfile?.(id)}
                  onFollow={followSimilar}
                  onDismiss={(id) => setSimilar((prev) => prev.filter((x) => x.id !== id))}
                />
              )}
            </div>
          )}
        </>
      )}

      {isOwnProfile && (
        <div className="flex gap-2 px-4 mb-4">
          <button
            onClick={() => onOpenEditProfile?.()}
            className="flex-1 rounded-xl py-2 text-[13px] transition-transform active:scale-[0.98]"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600 }}
          >
            Edit profile
          </button>
          <button
            onClick={() => setSheet("shareProfile")}
            className="flex-1 rounded-xl py-2 text-[13px] transition-transform active:scale-[0.98]"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600 }}
          >
            Share profile
          </button>
        </div>
      )}

      {!isOwnProfile && myRel.blocked ? (
        <div className="mx-4 mt-2 rounded-2xl px-4 py-5 text-center" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
          <p className="text-sm mb-1" style={{ color: "var(--text)", fontWeight: 600 }}>You blocked {profile.username}</p>
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
            You won't see their posts and they can't see yours or message you.
          </p>
          <button
            onClick={() => toggleRelation("blocked")}
            disabled={relBusy === "blocked"}
            className="rounded-full px-5 h-9 text-xs transition-transform active:scale-95"
            style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: relBusy === "blocked" ? 0.6 : 1 }}
          >
            Unblock
          </button>
        </div>
      ) : (
      <>
      <HighlightsRow
        key={`${profile.id}-${highlightsKey}`}
        profileId={profile.id}
        username={profile.username}
        isOwn={isOwnProfile}
        onNew={() => setSheet("newHighlight")}
        onOpen={(h) => setViewHighlight({ ...h, user_id: profile.id })}
      />

      <div
        className="flex items-center justify-around mb-0.5"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {tabOrder.map((t) => (
          <div key={t} className="relative flex-1">
            <button
              onClick={() => {
                if (t === "reels" && tab === "reels") setReelSortMenu((v) => !v);
                else {
                  setReelSortMenu(false);
                  setTab(t);
                }
              }}
              className="w-full flex items-center justify-center py-3"
              style={{ borderBottom: tab === t ? "1.5px solid var(--text)" : "1.5px solid transparent" }}
            >
              <span className="relative inline-flex">
                <ProfileTabIcon kind={t} active={tab === t} />
                {t === "reels" && tab === "reels" && (
                  <ChevronLeft
                    size={14}
                    color="var(--text)"
                    className="absolute top-1/2"
                    style={{ left: "calc(100% + 3px)", marginTop: -7, transform: reelSortMenu ? "rotate(90deg)" : "rotate(-90deg)", transition: "transform 0.15s" }}
                  />
                )}
              </span>
            </button>
            {t === "reels" && reelSortMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setReelSortMenu(false)} />
                <div
                  className="absolute left-1/2 top-full -translate-x-1/2 z-30 rounded-2xl overflow-hidden py-1 mt-1"
                  style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", minWidth: 180, boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}
                >
                  {[
                    ["latest", "Latest"],
                    ["views", "Most viewed"],
                  ].map(([k, label]) => (
                    <button
                      key={k}
                      onClick={() => {
                        setReelSort(k);
                        setReelSortMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm"
                      style={{ color: "var(--text)", fontWeight: reelSort === k ? 700 : 500 }}
                    >
                      {label}
                      {reelSort === k && <Check size={16} color="var(--text)" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-3 gap-0.5 px-0.5"
        style={{ minHeight: 280 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {gridFor.length === 0 ? (
          <div className="col-span-3 py-12 text-center px-8">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {tab === "posts"
                ? "No posts yet"
                : tab === "reels"
                ? "No reels yet"
                : tab === "reposts"
                ? "No reposts yet"
                : "No tagged posts yet"}
            </span>
          </div>
        ) : (
          gridFor.map((p, i) => (
            <button
              key={p.id}
              onClick={() => onOpenProfileFeed?.({ posts: gridFor, index: i, title: tab })}
              className="aspect-square flex items-center justify-center relative overflow-hidden"
              style={{ background: "var(--surface)" }}
            >
              <MediaThumb src={p.media_url} cover={p.cover_url} isVideo={!isPhotoPost(p)} />
              {tab === "reposts" && (
                <RepostIcon size={13} color="#FFFFFF" strokeWidth={2.2} className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))" }} />
              )}
              {tab === "tagged" && (
                <span className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }}>
                  <UserSquare2 size={12} color="#FFFFFF" />
                </span>
              )}
              {tab === "posts" && p.media_count > 1 ? (
                <span className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }}>
                  <Layers size={12} color="#FFFFFF" />
                </span>
              ) : (
                (tab === "reels" || (tab === "posts" && !isPhotoPost(p))) && (
                  <span className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }}>
                    <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
                  </span>
                )
              )}
              {p.isCollab && (
                <div className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.7))" }}>
                  <Users size={14} color="#FFFFFF" />
                </div>
              )}
              {tab === "posts" && p.pinned && (
                <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.55)" }}>
                  <Pin size={10} color="var(--accent-end)" />
                </div>
              )}
              {tab === "posts" && p.removed_at && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1" style={{ background: "rgba(0,0,0,0.62)" }}>
                  <Shield size={16} color="#FFFFFF" />
                  <span className="text-[10px]" style={{ color: "#FFFFFF", fontWeight: 700 }}>Removed</span>
                </div>
              )}
              {tab === "posts" && isOwnProfile && p.created_at && new Date(p.created_at).getTime() > Date.now() && (
                <div
                  className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 py-1"
                  style={{ background: "rgba(0,0,0,0.6)" }}
                >
                  <Clock size={10} color="#FFFFFF" />
                  <span className="text-[9px]" style={{ color: "#FFFFFF", fontWeight: 600 }}>
                    {new Date(p.created_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>
              )}
              {tab === "posts" && p.archived && isOwnProfile && (
                <div
                  className="absolute bottom-1.5 left-1.5 rounded px-1.5 py-0.5"
                  style={{ background: "rgba(0,0,0,0.65)" }}
                >
                  <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>Archived</span>
                </div>
              )}
            </button>
          ))
        )}
      </div>
      </>
      )}

      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files[0]) changeAvatar(e.target.files[0]);
          e.target.value = "";
        }}
      />

      {sheet === "note" && (
        <NoteEditSheet
          initial={profile.note}
          currentUserId={myId}
          onClose={() => setSheet(null)}
          onSaved={(value) => {
            setProfile((prev) => ({
              ...prev,
              note: value,
              note_created_at: value ? new Date().toISOString() : null,
            }));
            setSheet(null);
          }}
        />
      )}

      {sheet === "newHighlight" && (
        <NewHighlightSheet
          currentUserId={myId}
          onClose={() => setSheet(null)}
          onCreated={() => {
            setSheet(null);
            setHighlightsKey((k) => k + 1);
          }}
        />
      )}

      {sheet === "safety" && !isOwnProfile && (
        <StorySheetShell title={profile.username} onClose={() => setSheet(null)}>
          <div className="pb-6">
            <StoryMenuRow
              icon={<VolumeX size={17} color="var(--text)" />}
              label={myRel.muted ? "Unmute" : "Mute"}
              busy={relBusy === "muted"}
              onClick={() => toggleRelation("muted")}
              trailing={
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {myRel.muted ? "On" : "Hide posts & stories"}
                </span>
              }
            />
            <StoryMenuRow
              icon={<Shield size={17} color="var(--text)" />}
              label={myRel.restricted ? "Unrestrict" : "Restrict"}
              busy={relBusy === "restricted"}
              onClick={() => toggleRelation("restricted")}
              trailing={
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {myRel.restricted ? "On" : "Limit their comments"}
                </span>
              }
            />
            <div className="h-px my-1.5 mx-4" style={{ background: "var(--border)" }} />
            <StoryMenuRow
              icon={<UserMinus size={17} color="var(--heart)" />}
              label={myRel.blocked ? "Unblock" : "Block"}
              danger
              busy={relBusy === "blocked"}
              onClick={() => toggleRelation("blocked")}
            />
            <StoryMenuRow
              icon={<Flag size={17} color="var(--heart)" />}
              label="Report"
              danger
              onClick={() => setSheet("reportAccount")}
            />
            <StoryMenuRow
              icon={<Share2 size={17} color="var(--text)" />}
              label="Share this profile"
              onClick={() => setSheet("shareProfile")}
            />
            {staffRole && (
              <>
                <div className="h-px my-1.5 mx-4" style={{ background: "var(--border)" }} />
                <p className="px-4 pt-1 pb-1 text-[11px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Moderation</p>
                <StoryMenuRow icon={<Shield size={17} color="var(--heart)" />} label="Suspend for 7 days" danger onClick={() => modBanProfile(7)} />
                <StoryMenuRow icon={<Shield size={17} color="var(--heart)" />} label="Suspend for 30 days" danger onClick={() => modBanProfile(30)} />
                {staffRole === "admin" && (
                  <StoryMenuRow icon={<Shield size={17} color="var(--heart)" />} label="Ban permanently" danger onClick={() => modBanProfile(null)} />
                )}
                <StoryMenuRow icon={<Shield size={17} color="var(--text)" />} label="Lift suspension" onClick={modUnbanProfile} />
                {staffRole === "admin" && (
                  <StoryMenuRow
                    icon={<VerifiedBadge size={17} />}
                    label={profile.is_verified ? "Remove verified badge" : "Give verified badge"}
                    onClick={async () => {
                      setSheet(null);
                      const on = !profile.is_verified;
                      const { error } = await supabase.rpc("admin_set_verified", { p_user: profile.id, p_on: on });
                      if (error) flashNote(error.message);
                      else {
                        setProfile((prev) => ({ ...prev, is_verified: on }));
                        flashNote(on ? "Verified badge given" : "Badge removed");
                      }
                    }}
                  />
                )}
              </>
            )}
          </div>
        </StorySheetShell>
      )}

      {sheet === "contact" && <ContactSheet profile={profile} onClose={() => setSheet(null)} />}

      {avatarViewer && (
        <AvatarViewer
          profile={profile}
          isOwn={isOwnProfile}
          isFollowing={isFollowing}
          onFollow={toggleFollow}
          onEditPhoto={() => {
            setAvatarViewer(false);
            setSheet("avatar");
          }}
          onShare={() => {
            setAvatarViewer(false);
            setSheet("shareProfile");
          }}
          onQR={() => {
            setAvatarViewer(false);
            setQrOpen(true);
          }}
          onClose={() => setAvatarViewer(false)}
        />
      )}

      {sheet === "reportAccount" && !isOwnProfile && (
        <StorySheetShell title={`Report ${profile.username}`} onClose={() => setSheet(null)}>
          <div className="pb-6">
            <p className="px-4 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
              Why are you reporting this account? They won't know it was you.
            </p>
            {REPORT_REASONS.map((reason) => (
              <StoryMenuRow key={reason} icon={<Flag size={16} color="var(--text-muted)" />} label={reason} onClick={() => reportAccount(reason)} />
            ))}
          </div>
        </StorySheetShell>
      )}

      {reportNote && (
        <div
          className="fixed left-1/2 bottom-24 -translate-x-1/2 z-[80] rounded-full px-4 py-2.5 text-xs"
          style={{ background: "var(--text)", color: "var(--bg)", fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}
        >
          {reportNote}
        </div>
      )}

      {sheet === "accounts" && (
        <AccountSwitcherSheet
          currentUserId={myId}
          onClose={() => setSheet(null)}
          onSwitched={() => {
            setSheet(null);
            onSwitched?.();
          }}
          onAddAccount={() => {
            setSheet(null);
            onAddAccount?.();
          }}
        />
      )}

      {sheet === "shareProfile" && (
        <ShareProfileSheet
          profile={profile}
          currentUserId={myId}
          onClose={() => setSheet(null)}
          onOpenQR={() => setQrOpen(true)}
        />
      )}

      {qrOpen && <ProfileQRScreen profile={profile} onBack={() => setQrOpen(false)} />}

      {/* Add a story from this screen: the avatar "+" and Create → Story */}
      <input
        ref={storyInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) setStoryFile(f);
        }}
      />
      {storyFile && (
        <StoryComposer
          file={storyFile}
          onCancel={() => setStoryFile(null)}
          onPublished={() => {
            setStoryFile(null);
            setHasStory(true);
            setHighlightsKey((k) => k + 1);
          }}
        />
      )}
      {viewStoryFor && (
        <StandaloneStoryViewer
          profileId={viewStoryFor}
          currentUserId={myId}
          onClose={() => setViewStoryFor(null)}
          onOpenProfile={onOpenProfile}
        />
      )}
      {viewHighlight && (
        <StandaloneStoryViewer
          highlight={viewHighlight}
          currentUserId={myId}
          onClose={() => setViewHighlight(null)}
          onOpenProfile={onOpenProfile}
        />
      )}

      {sheet === "create" && (
        <StorySheetShell title="Create" onClose={() => setSheet(null)}>
          <div className="pb-6">
            <StoryMenuRow
              icon={<ImageIcon size={17} color="var(--text)" />}
              label="Post"
              onClick={() => {
                setSheet(null);
                onCreate?.("post");
              }}
            />
            <StoryMenuRow
              icon={<Plus size={17} color="var(--text)" />}
              label="Story"
              onClick={() => {
                setSheet(null);
                storyInputRef.current?.click();
              }}
            />
            <StoryMenuRow
              icon={<Clapperboard size={17} color="var(--text)" />}
              label="Reel"
              onClick={() => {
                setSheet(null);
                onCreate?.("reel");
              }}
            />
            <StoryMenuRow
              icon={<Star size={17} color="var(--text)" />}
              label="Highlight"
              onClick={() => setSheet("newHighlight")}
            />
            <div className="h-px my-1.5 mx-4" style={{ background: "var(--border)" }} />
            <div className="px-4 py-3">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Live</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                Live video isn't built yet — it needs streaming infrastructure, so it's not
                something this menu can do today.
              </p>
            </div>
          </div>
        </StorySheetShell>
      )}

      {sheet === "menu" && (
        <StorySheetShell title="Settings and activity" onClose={() => setSheet(null)}>
          <div className="pb-6">
            {staffRole && (
              <StoryMenuRow
                icon={<Shield size={17} color="var(--accent-solid)" />}
                label="Moderation"
                trailing={
                  <span className="text-[11px] capitalize" style={{ color: "var(--text-muted)" }}>{staffRole}</span>
                }
                onClick={() => {
                  setSheet(null);
                  onOpenModeration?.();
                }}
              />
            )}
            <StoryMenuRow
              icon={<Gauge size={17} color="var(--text)" />}
              label="Your activity"
              onClick={() => {
                setSheet(null);
                onOpenActivity?.();
              }}
            />
            <StoryMenuRow
              icon={<Archive size={17} color="var(--text)" />}
              label="Archive"
              onClick={() => {
                setSheet(null);
                onOpenArchive?.();
              }}
            />
            <StoryMenuRow
              icon={<Bookmark size={17} color="var(--text)" />}
              label="Saved"
              onClick={() => {
                setSheet(null);
                onOpenSaved?.();
              }}
            />

            <div className="h-px my-1.5 mx-4" style={{ background: "var(--border)" }} />

            <StoryMenuRow
              icon={<Lock size={17} color="var(--text)" />}
              label={profile.is_private ? "Private account" : "Public account"}
              busy={privacyBusy}
              onClick={togglePrivacy}
              trailing={
                <span className="rounded-full shrink-0" style={{ width: 34, height: 19, background: profile.is_private ? ACCENT : "var(--toggle-off)", position: "relative" }}>
                  <span className="rounded-full bg-white absolute" style={{ width: 15, height: 15, top: 2, left: profile.is_private ? 17 : 2, transition: "left 0.15s" }} />
                </span>
              }
            />
            <StoryMenuRow
              icon={<Star size={17} color="var(--text)" />}
              label="Close friends"
              onClick={() => {
                setSheet(null);
                onOpenPeopleList?.("close_friends");
              }}
            />
            <StoryMenuRow
              icon={<UserMinus size={17} color="var(--text)" />}
              label="Blocked"
              onClick={() => {
                setSheet(null);
                onOpenPeopleList?.("blocked");
              }}
            />
            <StoryMenuRow
              icon={<Shield size={17} color="var(--text)" />}
              label="Restricted"
              onClick={() => {
                setSheet(null);
                onOpenPeopleList?.("restricted");
              }}
            />
            <StoryMenuRow
              icon={<VolumeX size={17} color="var(--text)" />}
              label="Muted"
              onClick={() => {
                setSheet(null);
                onOpenPeopleList?.("muted");
              }}
            />

            <div className="h-px my-1.5 mx-4" style={{ background: "var(--border)" }} />

            <StoryMenuRow
              icon={<Settings size={17} color="var(--text)" />}
              label="Settings"
              onClick={() => {
                setSheet(null);
                onOpenSettings?.();
              }}
            />

            <div className="px-4 pt-3">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Supervision</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                Parental supervision needs verified ages and linked guardian accounts, neither of
                which exists in Loop yet. Rather than show a switch that does nothing, it's left
                out until that groundwork is there.
              </p>
            </div>
          </div>
        </StorySheetShell>
      )}

      {sheet === "avatar" && (
        <StorySheetShell title="Profile photo or video" onClose={() => setSheet(null)}>
          <div className="pb-6">
            <StoryMenuRow
              icon={<CircleUserRound size={17} color="var(--text)" />}
              label="View profile photo"
              onClick={() => {
                setSheet(null);
                setAvatarViewer(true);
              }}
            />
            <StoryMenuRow
              icon={<ImagePlus size={17} color="var(--text)" />}
              label={avatarBusy ? "Uploading..." : "Choose from library"}
              busy={avatarBusy}
              onClick={() => avatarInputRef.current?.click()}
            />
            <StoryMenuRow
              icon={<Sparkles size={17} color="var(--text)" />}
              label="Use a letter avatar"
              busy={avatarBusy}
              onClick={removeAvatar}
            />
          </div>
        </StorySheetShell>
      )}
    </div>
  );
}

function timeShort(dateStr) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}

function MessagesScreen({ onBack, startWith }) {
  const [userId, setUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [openChat, setOpenChat] = useState(null);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [rowMenu, setRowMenu] = useState(null); // conversation object

  useEffect(() => {
    init();
  }, []);

  // Opened from someone's profile "Message" button: go straight to that chat.
  useEffect(() => {
    if (startWith && startWith.id) startChat(startWith);
  }, [startWith?.id]);

  const init = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);
    if (!user) {
      setLoading(false);
      return;
    }
    await loadConversations(user.id);
    setLoading(false);
  };

  const loadConversations = async (uid) => {
    // Which conversations am I a member of, and when did I last read each?
    const { data: memberships } = await supabase
      .from("conversation_members")
      .select("conversation_id, last_read_at, pinned, hidden, muted_messages, muted_calls")
      .eq("user_id", uid);

    if (!memberships || memberships.length === 0) {
      setConversations([]);
      return;
    }

    // "Delete" hides the chat for you only, like Instagram — the other
    // person keeps their copy.
    const visible = memberships.filter((m) => !m.hidden);
    if (visible.length === 0) {
      setConversations([]);
      return;
    }
    const convoIds = visible.map((m) => m.conversation_id);
    const lastReadMap = {};
    const flagMap = {};
    visible.forEach((m) => {
      lastReadMap[m.conversation_id] = m.last_read_at;
      flagMap[m.conversation_id] = {
        pinned: !!m.pinned,
        mutedMessages: !!m.muted_messages,
        mutedCalls: !!m.muted_calls,
      };
    });

    const { data: convos } = await supabase
      .from("conversations")
      .select("id, user_a, user_b, is_group, title, avatar_url, last_message, last_message_at")
      .in("id", convoIds)
      .order("last_message_at", { ascending: false, nullsFirst: false });

    if (!convos || convos.length === 0) {
      setConversations([]);
      return;
    }

    // Gather all members of these conversations (to name groups + get 1:1 other person)
    const { data: allMembers } = await supabase
      .from("conversation_members")
      .select("conversation_id, user_id")
      .in("conversation_id", convoIds);

    const otherIds = new Set();
    (allMembers || []).forEach((m) => {
      if (m.user_id !== uid) otherIds.add(m.user_id);
    });

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", otherIds.size > 0 ? [...otherIds] : ["00000000-0000-0000-0000-000000000000"]);

    const profMap = {};
    (profiles || []).forEach((p) => (profMap[p.id] = p));

    // Count unread per conversation
    const { data: recentMsgs } = await supabase
      .from("messages")
      .select("conversation_id, sender_id, created_at, deleted")
      .in("conversation_id", convoIds)
      .order("created_at", { ascending: false })
      .limit(500);

    const unreadMap = {};
    (recentMsgs || []).forEach((m) => {
      if (m.sender_id === uid || m.deleted) return;
      const lastRead = lastReadMap[m.conversation_id];
      if (!lastRead || new Date(m.created_at) > new Date(lastRead)) {
        unreadMap[m.conversation_id] = (unreadMap[m.conversation_id] || 0) + 1;
      }
    });

    const merged = convos.map((c) => {
      const members = (allMembers || []).filter((m) => m.conversation_id === c.id).map((m) => m.user_id);
      let displayName, avatarUrl, otherUser;
      if (c.is_group) {
        const names = members.filter((m) => m !== uid).map((m) => profMap[m]?.username || "?");
        displayName = c.title || names.slice(0, 3).join(", ") || "Group";
        avatarUrl = c.avatar_url || null;
        otherUser = null;
      } else {
        const otherId = members.find((m) => m !== uid) || (c.user_a === uid ? c.user_b : c.user_a);
        const prof = profMap[otherId];
        displayName = prof?.username || "unknown";
        avatarUrl = prof?.avatar_url || null;
        otherUser = { id: otherId, username: displayName, avatar_url: avatarUrl };
      }
      return {
        conversationId: c.id,
        isGroup: c.is_group,
        title: c.title,
        displayName,
        avatarUrl,
        otherUser,
        lastMessage: c.last_message,
        lastMessageAt: c.last_message_at,
        unread: unreadMap[c.id] || 0,
        ...(flagMap[c.id] || { pinned: false, mutedMessages: false, mutedCalls: false }),
      };
    });
    // Pinned chats float to the top; the rest keep their recency order.
    merged.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return 0;
    });
    const rel = await getRelations();
    setConversations(
      merged
        .filter((c) => c.isGroup || !c.otherUser || !rel.blockedBy.has(c.otherUser.id))
        .map((c) => ({ ...c, blockedByMe: !c.isGroup && c.otherUser ? rel.blocked.has(c.otherUser.id) : false }))
    );
  };

  const setConvoFlag = async (convo, patch) => {
    const { error } = await supabase
      .from("conversation_members")
      .update(patch)
      .eq("conversation_id", convo.conversationId)
      .eq("user_id", userId);
    if (error) {
      alert(error.message);
      return;
    }
    setRowMenu(null);
    loadConversations(userId);
  };

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .ilike("username", `%${q}%`)
        .neq("id", userId || "")
        .limit(20);
      if (!cancelled) {
        setSearchResults(data || []);
        setSearching(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, userId]);

  const startChat = async (profile) => {
    const { data: convoId, error } = await supabase.rpc("get_or_create_conversation", { other_user: profile.id });
    if (error) {
      alert(error.message);
      return;
    }
    setOpenChat({
      conversationId: convoId,
      isGroup: false,
      displayName: profile.username,
      avatarUrl: profile.avatar_url,
      otherUser: { id: profile.id, username: profile.username, avatar_url: profile.avatar_url },
    });
  };

  const backToList = () => {
    setOpenChat(null);
    setCreatingGroup(false);
    setQuery("");
    setSearchResults([]);
    if (userId) loadConversations(userId);
  };

  if (creatingGroup) {
    return (
      <NewGroupScreen
        currentUserId={userId}
        onBack={() => setCreatingGroup(false)}
        onCreated={(convo) => {
          setCreatingGroup(false);
          setOpenChat(convo);
        }}
      />
    );
  }

  if (openChat) {
    return (
      <ChatScreen
        conversationId={openChat.conversationId}
        isGroup={openChat.isGroup}
        chatTitle={openChat.displayName}
        chatAvatarUrl={openChat.avatarUrl}
        otherUser={openChat.otherUser}
        currentUserId={userId}
        onBack={backToList}
      />
    );
  }

  const showingSearch = query.trim().length > 0;

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--bg)" }}>
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3" style={{ background: "var(--bg)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={onBack} className="-ml-1.5 p-1 transition-transform active:scale-90">
              <ChevronLeft size={24} color="var(--text)" />
            </button>
            <h1 className="text-xl truncate" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>
              Messages
            </h1>
          </div>
          <button
            onClick={() => setCreatingGroup(true)}
            className="flex items-center gap-1.5 rounded-full px-3.5 h-9 text-xs shrink-0 transition-transform active:scale-95"
            style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600 }}
          >
            <Users size={14} /> New group
          </button>
        </div>
        <div className="flex items-center gap-2.5 rounded-full px-4 h-11" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people to message..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text)" }}
          />
          {query && (
            <button onClick={() => setQuery("")} className="shrink-0">
              <X size={15} color="var(--text-muted)" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showingSearch ? (
          searching ? (
            <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>Searching...</p>
          ) : searchResults.length === 0 ? (
            <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>No accounts found</p>
          ) : (
            searchResults.map((p) => (
              <button
                key={p.id}
                onClick={() => startChat(p)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors active:bg-[var(--active-highlight)]"
              >
                <Avatar username={p.username} avatarUrl={p.avatar_url} size={52} />
                <span className="text-[14px] truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{p.username}</span>
              </button>
            ))
          )
        ) : loading ? (
          <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 px-8 text-center gap-2">
            <Send size={30} color="var(--toggle-off)" />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No messages yet</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Search for someone above, or start a group.</p>
          </div>
        ) : (
          conversations.map((c) => (
            <div key={c.conversationId} className="flex items-center">
              <button
                onClick={() => setOpenChat(c)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setRowMenu(c);
                }}
                className="flex-1 min-w-0 flex items-center gap-3 pl-4 py-3 text-left transition-colors active:bg-[var(--active-highlight)]"
              >
                {c.isGroup ? (
                  c.avatarUrl ? (
                    <img src={c.avatarUrl} alt="" className="rounded-full object-cover shrink-0" style={{ width: 52, height: 52 }} />
                  ) : (
                    <div
                      className="w-[52px] h-[52px] rounded-full shrink-0 flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, var(--ring-start) 0%, var(--ring-end) 100%)", padding: 2 }}
                    >
                      <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: "var(--surface)" }}>
                        <Users size={21} color="var(--text)" />
                      </div>
                    </div>
                  )
                ) : (
                  <Avatar username={c.displayName} avatarUrl={c.avatarUrl} size={52} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] truncate flex items-center gap-1.5" style={{ color: "var(--text)", fontWeight: c.unread > 0 ? 700 : 600 }}>
                    {c.pinned && <Pin size={11} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
                    <span className="truncate">{c.displayName}</span>
                    {c.mutedMessages && <VolumeX size={11} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
                  </p>
                  <p className="text-[13px] truncate mt-0.5" style={{ color: c.unread > 0 ? "var(--text)" : "var(--text-muted)", fontWeight: c.unread > 0 ? 600 : 400 }}>
                    {c.lastMessage || "Say hi 👋"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{timeShort(c.lastMessageAt)}</span>
                  {c.unread > 0 && !c.mutedMessages && (
                    <span
                      className="rounded-full flex items-center justify-center text-[10px]"
                      style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, minWidth: 20, height: 20, padding: "0 6px" }}
                    >
                      {c.unread > 99 ? "99+" : c.unread}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setRowMenu(c)}
                className="px-3 py-3 shrink-0 transition-transform active:scale-90"
              >
                <Ellipsis size={17} color="var(--text-muted)" />
              </button>
            </div>
          ))
        )}
      </div>
    
      {rowMenu && (
        <StorySheetShell title={rowMenu.displayName} onClose={() => setRowMenu(null)}>
          <div className="pb-6">
            <StoryMenuRow
              icon={<Pin size={17} color="var(--text)" />}
              label={rowMenu.pinned ? "Unpin from top" : "Pin to top"}
              onClick={() => setConvoFlag(rowMenu, { pinned: !rowMenu.pinned })}
            />
            <StoryMenuRow
              icon={rowMenu.mutedMessages ? <Volume2 size={17} color="var(--text)" /> : <VolumeX size={17} color="var(--text)" />}
              label={rowMenu.mutedMessages ? "Unmute messages" : "Mute messages"}
              onClick={() => setConvoFlag(rowMenu, { muted_messages: !rowMenu.mutedMessages })}
              trailing={
                <span className="rounded-full shrink-0" style={{ width: 34, height: 19, background: rowMenu.mutedMessages ? ACCENT : "var(--toggle-off)", position: "relative" }}>
                  <span className="rounded-full bg-white absolute" style={{ width: 15, height: 15, top: 2, left: rowMenu.mutedMessages ? 17 : 2, transition: "left 0.15s" }} />
                </span>
              }
            />
            <StoryMenuRow
              icon={<Bell size={17} color="var(--text)" />}
              label={rowMenu.mutedCalls ? "Unmute calls" : "Mute calls"}
              onClick={() => setConvoFlag(rowMenu, { muted_calls: !rowMenu.mutedCalls })}
              trailing={
                <span className="rounded-full shrink-0" style={{ width: 34, height: 19, background: rowMenu.mutedCalls ? ACCENT : "var(--toggle-off)", position: "relative" }}>
                  <span className="rounded-full bg-white absolute" style={{ width: 15, height: 15, top: 2, left: rowMenu.mutedCalls ? 17 : 2, transition: "left 0.15s" }} />
                </span>
              }
            />
            <div className="h-px my-1.5 mx-4" style={{ background: "var(--border)" }} />
            <StoryMenuRow
              icon={<Trash2 size={17} color="var(--heart)" />}
              label="Delete chat"
              danger
              onClick={() => {
                if (!window.confirm("Delete this chat from your inbox? The other person keeps their copy.")) return;
                setConvoFlag(rowMenu, { hidden: true });
              }}
            />
            <p className="text-[11px] px-4 pt-2" style={{ color: "var(--text-muted)" }}>
              Deleting only removes it for you. A new message will bring the chat back.
            </p>
          </div>
        </StorySheetShell>
      )}
    </div>
  );
}

function NewGroupScreen({ currentUserId, onBack, onCreated }) {
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]); // array of {id, username, avatar_url}
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .ilike("username", `%${q}%`)
        .neq("id", currentUserId || "")
        .limit(20);
      if (!cancelled) setResults(data || []);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, currentUserId]);

  const toggle = (p) => {
    setSelected((prev) => (prev.some((s) => s.id === p.id) ? prev.filter((s) => s.id !== p.id) : [...prev, p]));
  };

  const create = async () => {
    setError("");
    if (selected.length < 2) {
      setError("Pick at least 2 people for a group");
      return;
    }
    setCreating(true);
    const { data: convoId, error: rpcError } = await supabase.rpc("create_group_conversation", {
      group_title: title.trim() || null,
      member_ids: selected.map((s) => s.id),
    });
    setCreating(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    onCreated({
      conversationId: convoId,
      isGroup: true,
      displayName: title.trim() || selected.map((s) => s.username).slice(0, 3).join(", "),
      avatarUrl: null,
      otherUser: null,
    });
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--bg)" }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90"><ChevronLeft size={24} color="var(--text)" /></button>
          <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>New group</h1>
        </div>
        <button
          onClick={create}
          disabled={creating || selected.length < 2}
          className="rounded-full px-4 py-1.5 text-xs"
          style={{ background: selected.length >= 2 ? ACCENT : "var(--surface)", color: selected.length >= 2 ? "var(--on-accent)" : "var(--text-muted)", fontWeight: 700 }}
        >
          {creating ? "Creating..." : "Create"}
        </button>
      </div>

      <div className="px-4 pt-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Group name (optional)"
          className="w-full rounded-xl px-3 py-2.5 text-sm mb-3 outline-none"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
        />

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selected.map((s) => (
              <button
                key={s.id}
                onClick={() => toggle(s)}
                className="flex items-center gap-1 rounded-full pl-1 pr-2 py-1 text-xs"
                style={{ background: "var(--border)", color: "var(--text)" }}
              >
                <Avatar username={s.username} avatarUrl={s.avatar_url} size={20} />
                {s.username}
                <X size={11} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people to add..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text)" }}
          />
        </div>

        {error && <p className="text-xs mb-2" style={{ color: "var(--accent-start)" }}>{error}</p>}
      </div>

      <div className="flex-1 overflow-y-auto">
        {results.map((p) => {
          const isSel = selected.some((s) => s.id === p.id);
          return (
            <button key={p.id} onClick={() => toggle(p)} className="w-full flex items-center gap-3 px-4 py-2.5 text-left">
              <Avatar username={p.username} avatarUrl={p.avatar_url} size={40} />
              <span className="flex-1 text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>{p.username}</span>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: isSel ? ACCENT : "transparent", border: isSel ? "none" : "1.5px solid var(--toggle-off)" }}
              >
                {isSel && <Check size={12} color="var(--bg)" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Messaging helpers ----

const REACTION_EMOJIS = ["❤️", "😂", "😮", "😢", "🔥", "👍"];

// Shown when you tap "+" on the quick row.
const EMOJI_LIBRARY = {
  Smileys: ["😀","😃","😄","😁","😆","😅","🤣","😊","🙂","😉","😍","🥰","😘","😗","😋","😛","🤪","🤨","🧐","🤓","😎","🥳","😏","😒","😞","😔","😟","😕","🙁","😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","🤗","🤔","🤭","🤫","😶","😐","😑","😬","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕"],
  Gestures: ["👍","👎","👌","🤌","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👏","🙌","👐","🤲","🤝","🙏","💪","🦾","✍️","💅","👀","👋","🖐️","✋","🖖"],
  Hearts: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","♥️"],
  Fun: ["🔥","✨","🌟","💫","⭐","🎉","🎊","🎈","🎁","🏆","🥇","💯","💥","💦","💨","🕳️","💣","🎵","🎶","👑","💎","🌈","☀️","🌙","⚡","❄️","🍀","🌸","🌹","🥀"],
  Food: ["🍎","🍌","🍇","🍓","🍑","🍍","🥭","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🍜","🍝","🍣","🍤","🍩","🍪","🎂","🍰","🍫","🍬","☕","🍵","🧋","🥤","🍺","🍻"],
  Animals: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅","🦉","🐴","🦄","🐝","🦋","🐌","🐞","🐢","🐍","🐙"],
};

function EmojiPickerSheet({ onPick, onClose }) {
  const [tab, setTab] = useState("Smileys");
  const tabs = Object.keys(EMOJI_LIBRARY);
  return (
    <StorySheetShell title="Choose a reaction" onClose={onClose}>
      <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="rounded-full px-3 h-8 text-xs shrink-0"
            style={{
              background: tab === t ? ACCENT : "var(--bg-sunken)",
              color: tab === t ? "var(--on-accent)" : "var(--text-muted)",
              border: tab === t ? "none" : "1px solid var(--border)",
              fontWeight: 600,
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1 px-4 pb-6">
        {EMOJI_LIBRARY[tab].map((e) => (
          <button
            key={e}
            onClick={() => onPick(e)}
            className="aspect-square flex items-center justify-center text-xl rounded-lg transition-transform active:scale-125"
          >
            {e}
          </button>
        ))}
      </div>
    </StorySheetShell>
  );
}

function secsToClock(total) {
  const s = Math.max(0, Math.round(total || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// Voice note bubble. The duration is stored at record time because a
// freshly-recorded webm blob often reports Infinity for .duration until
// it has been fully seeked, which would show "0:00" on the sender's side.
function AudioBubble({ src, duration, mine }) {
  const audioRef = React.useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      a.play().catch(() => {});
    }
  };

  const fg = mine ? "var(--on-accent)" : "var(--text)";
  const track = mine ? "rgba(255,255,255,0.35)" : "var(--toggle-off)";

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5"
      style={{
        background: mine ? ACCENT : "var(--surface)",
        border: mine ? "none" : "1px solid var(--border)",
        borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        minWidth: 190,
      }}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          const total = Number.isFinite(a.duration) ? a.duration : duration || 0;
          if (total > 0) setProgress((a.currentTime / total) * 100);
        }}
      />
      <button onClick={toggle} className="shrink-0 transition-transform active:scale-90">
        {playing ? (
          <span className="flex items-center justify-center rounded-full" style={{ width: 30, height: 30, background: mine ? "rgba(255,255,255,0.22)" : "var(--bg-sunken)" }}>
            <span style={{ display: "flex", gap: 3 }}>
              <span style={{ width: 3, height: 12, background: fg, borderRadius: 1 }} />
              <span style={{ width: 3, height: 12, background: fg, borderRadius: 1 }} />
            </span>
          </span>
        ) : (
          <span className="flex items-center justify-center rounded-full" style={{ width: 30, height: 30, background: mine ? "rgba(255,255,255,0.22)" : "var(--bg-sunken)" }}>
            <Play size={14} color={fg} fill={fg} style={{ marginLeft: 2 }} />
          </span>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="rounded-full overflow-hidden" style={{ height: 4, background: track }}>
          <div className="h-full rounded-full" style={{ width: `${progress}%`, background: fg, transition: "width 0.1s linear" }} />
        </div>
      </div>

      <span className="text-[11px] shrink-0 tabular-nums" style={{ color: mine ? "rgba(255,255,255,0.85)" : "var(--text-muted)" }}>
        {secsToClock(duration)}
      </span>
    </div>
  );
}

// Pick a chat to forward a message into. Shows your groups plus anyone
// you can start a 1:1 with.
function ForwardSheet({ message, currentUserId, onClose, onDone }) {
  const [groups, setGroups] = useState([]);
  const [people, setPeople] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sentTo, setSentTo] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: memberRows } = await supabase
        .from("conversation_members")
        .select("conversation_id")
        .eq("user_id", currentUserId || "");
      const ids = (memberRows || []).map((r) => r.conversation_id);
      let groupRows = [];
      if (ids.length > 0) {
        const { data } = await supabase
          .from("conversations")
          .select("id, title")
          .in("id", ids)
          .eq("is_group", true);
        groupRows = data || [];
      }
      const { data: profileRows } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .neq("id", currentUserId || "")
        .limit(50);
      if (!cancelled) {
        setGroups(groupRows);
        setPeople(profileRows || []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  const copyInto = async (conversationId) => {
    const { error: err } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: message.content,
      image_url: message.image_url,
      audio_url: message.audio_url,
      audio_duration: message.audio_duration,
      forwarded: true,
    });
    if (err) throw err;
    await supabase
      .from("conversations")
      .update({
        last_message: message.content || (message.audio_url ? "🎤 Voice message" : "📷 Photo"),
        last_message_at: new Date().toISOString(),
      })
      .eq("id", conversationId);
  };

  const forwardToGroup = async (g) => {
    setBusyId(g.id);
    setError("");
    try {
      await copyInto(g.id);
      setSentTo((prev) => [...prev, g.id]);
      onDone?.();
    } catch (e) {
      setError(e.message);
    }
    setBusyId(null);
  };

  const forwardToPerson = async (p) => {
    setBusyId(p.id);
    setError("");
    const { data: convoId, error: convoErr } = await supabase.rpc("get_or_create_conversation", { other_user: p.id });
    if (convoErr) {
      setBusyId(null);
      setError(convoErr.message);
      return;
    }
    try {
      await copyInto(convoId);
      setSentTo((prev) => [...prev, p.id]);
      onDone?.();
    } catch (e) {
      setError(e.message);
    }
    setBusyId(null);
  };

  const q = query.trim().toLowerCase();
  const shownGroups = groups.filter((g) => (g.title || "Group").toLowerCase().includes(q));
  const shownPeople = people.filter((p) => p.username.toLowerCase().includes(q));

  const Btn = ({ id, onClick }) => {
    const done = sentTo.includes(id);
    return (
      <button
        onClick={() => !done && onClick()}
        disabled={done || busyId === id}
        className="rounded-full px-4 h-8 text-xs shrink-0 transition-transform active:scale-95"
        style={{
          background: done ? "var(--bg-sunken)" : ACCENT,
          border: done ? "1px solid var(--border)" : "none",
          color: done ? "var(--text-muted)" : "var(--on-accent)",
          fontWeight: 700,
          opacity: busyId === id ? 0.6 : 1,
        }}
      >
        {done ? "Sent" : busyId === id ? "..." : "Send"}
      </button>
    );
  };

  return (
    <StorySheetShell title="Forward to" onClose={onClose}>
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2.5 rounded-full px-4 h-11" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats and people"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text)" }}
          />
        </div>
      </div>
      {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}
      <div className="pb-6">
        {loading ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : (
          <>
            {shownGroups.length > 0 && (
              <p className="text-[11px] px-4 pt-1 pb-1.5 uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.4px" }}>Groups</p>
            )}
            {shownGroups.map((g) => (
              <div key={g.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <Users size={18} color="var(--text)" />
                </div>
                <span className="flex-1 text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{g.title || "Group"}</span>
                <Btn id={g.id} onClick={() => forwardToGroup(g)} />
              </div>
            ))}

            {shownPeople.length > 0 && (
              <p className="text-[11px] px-4 pt-3 pb-1.5 uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.4px" }}>People</p>
            )}
            {shownPeople.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
                <Avatar username={p.username} avatarUrl={p.avatar_url} size={44} />
                <span className="flex-1 text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{p.username}</span>
                <Btn id={p.id} onClick={() => forwardToPerson(p)} />
              </div>
            ))}

            {shownGroups.length === 0 && shownPeople.length === 0 && (
              <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Nothing matches that</p>
            )}
          </>
        )}
      </div>
    </StorySheetShell>
  );
}

// Group members: rename, add, remove, promote, leave.
function GroupManageSheet({ conversationId, title, avatarUrl, currentUserId, onClose, onRenamed, onLeft, onPhotoChanged, onOpenInvite }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(title || "");
  const [savingName, setSavingName] = useState(false);
  const [adding, setAdding] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(avatarUrl || null);
  const [photoBusy, setPhotoBusy] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [conversationId]);

  const uploadPhoto = async (file) => {
    if (!file) return;
    setPhotoBusy(true);
    setError("");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${currentUserId}/${conversationId}/group-${Date.now()}-${safeName}`;
    const { error: upErr } = await supabase.storage.from("messages").upload(path, file);
    if (upErr) {
      setPhotoBusy(false);
      setError(upErr.message);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("messages").getPublicUrl(path);
    const { error: dbErr } = await supabase
      .from("conversations")
      .update({ avatar_url: publicUrl })
      .eq("id", conversationId);
    setPhotoBusy(false);
    if (dbErr) {
      setError(dbErr.message);
      return;
    }
    setPhoto(publicUrl);
    onPhotoChanged?.(publicUrl);
  };

  const loadMembers = async () => {
    setLoading(true);
    const { data: rows } = await supabase
      .from("conversation_members")
      .select("user_id, is_admin")
      .eq("conversation_id", conversationId);
    const ids = (rows || []).map((r) => r.user_id);
    let profiles = [];
    if (ids.length > 0) {
      const { data } = await supabase.from("profiles").select("id, username, avatar_url").in("id", ids);
      profiles = data || [];
    }
    setMembers(
      (rows || []).map((r) => ({
        ...r,
        username: profiles.find((p) => p.id === r.user_id)?.username || "unknown",
        avatarUrl: profiles.find((p) => p.id === r.user_id)?.avatar_url || null,
      }))
    );
    setLoading(false);
  };

  const openAdd = async () => {
    setAdding(true);
    const { data } = await supabase.from("profiles").select("id, username, avatar_url").limit(60);
    setCandidates(data || []);
  };

  const iAmAdmin = members.find((m) => m.user_id === currentUserId)?.is_admin === true;

  const saveName = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === title) return;
    setSavingName(true);
    const { error: err } = await supabase.from("conversations").update({ title: trimmed }).eq("id", conversationId);
    setSavingName(false);
    if (err) {
      setError(err.message);
      return;
    }
    onRenamed?.(trimmed);
  };

  const addMember = async (p) => {
    setBusyId(p.id);
    setError("");
    const { error: err } = await supabase
      .from("conversation_members")
      .insert({ conversation_id: conversationId, user_id: p.id });
    setBusyId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await loadMembers();
  };

  const removeMember = async (m) => {
    if (!window.confirm(`Remove ${m.username} from the group?`)) return;
    setBusyId(m.user_id);
    setError("");
    const { error: err } = await supabase
      .from("conversation_members")
      .delete()
      .eq("conversation_id", conversationId)
      .eq("user_id", m.user_id);
    setBusyId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await loadMembers();
  };

  const toggleAdmin = async (m) => {
    setBusyId(m.user_id);
    setError("");
    const { error: err } = await supabase
      .from("conversation_members")
      .update({ is_admin: !m.is_admin })
      .eq("conversation_id", conversationId)
      .eq("user_id", m.user_id);
    setBusyId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await loadMembers();
  };

  const leave = async () => {
    if (!window.confirm("Leave this group? You'll stop receiving its messages.")) return;
    const { error: err } = await supabase
      .from("conversation_members")
      .delete()
      .eq("conversation_id", conversationId)
      .eq("user_id", currentUserId);
    if (err) {
      setError(err.message);
      return;
    }
    onLeft?.();
  };

  const memberIds = members.map((m) => m.user_id);
  const shownCandidates = candidates
    .filter((c) => !memberIds.includes(c.id))
    .filter((c) => c.username.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <StorySheetShell title="Group info" onClose={onClose}>
      {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}

      <div className="flex flex-col items-center pb-3">
        <label className="cursor-pointer relative">
          {photo ? (
            <img src={photo} alt="" className="rounded-full object-cover" style={{ width: 76, height: 76 }} />
          ) : (
            <div className="rounded-full flex items-center justify-center" style={{ width: 76, height: 76, background: "var(--surface)", border: "1px solid var(--border)" }}>
              <Users size={30} color="var(--text-muted)" />
            </div>
          )}
          <span
            className="absolute bottom-0 right-0 rounded-full flex items-center justify-center"
            style={{ width: 26, height: 26, background: ACCENT, border: "2px solid var(--bg)" }}
          >
            <ImagePlus size={13} color="var(--on-accent)" />
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files[0]) uploadPhoto(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </label>
        <span className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
          {photoBusy ? "Uploading..." : "Tap to change group photo"}
        </span>
      </div>

      <div className="px-4 pb-3">
        <label className="text-[11px] block mb-1.5" style={{ color: "var(--text-muted)" }}>Group name</label>
        <div className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="flex-1 rounded-full px-4 h-11 text-sm outline-none"
            style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          <button
            onClick={saveName}
            disabled={savingName || !name.trim() || name.trim() === title}
            className="rounded-full px-4 h-11 text-xs shrink-0 transition-transform active:scale-95"
            style={{
              background: ACCENT,
              color: "var(--on-accent)",
              fontWeight: 700,
              opacity: savingName || !name.trim() || name.trim() === title ? 0.5 : 1,
            }}
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pt-1 pb-1.5">
        <span className="text-[11px] uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.4px" }}>
          {members.length} member{members.length === 1 ? "" : "s"}
        </span>
        {!adding && (
          <button onClick={openAdd} className="flex items-center gap-1 text-xs" style={{ color: "var(--accent-solid)", fontWeight: 700 }}>
            <UserPlus size={13} /> Add
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-xs text-center py-5" style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : (
        members.map((m) => (
          <div key={m.user_id} className="flex items-center gap-3 px-4 py-2.5">
            <Avatar username={m.username} avatarUrl={m.avatarUrl} size={40} />
            <div className="flex-1 min-w-0">
              <span className="text-sm truncate block" style={{ color: "var(--text)", fontWeight: 600 }}>
                {m.username}
                {m.user_id === currentUserId ? " (you)" : ""}
              </span>
              {m.is_admin && (
                <span className="flex items-center gap-1 text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                  <Shield size={10} /> Admin
                </span>
              )}
            </div>
            {iAmAdmin && m.user_id !== currentUserId && (
              <>
                <button
                  onClick={() => toggleAdmin(m)}
                  disabled={busyId === m.user_id}
                  className="text-[11px] shrink-0 px-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {m.is_admin ? "Demote" : "Make admin"}
                </button>
                <button
                  onClick={() => removeMember(m)}
                  disabled={busyId === m.user_id}
                  className="p-1 shrink-0 transition-transform active:scale-90"
                >
                  <UserMinus size={17} color="var(--heart)" />
                </button>
              </>
            )}
          </div>
        ))
      )}

      {adding && (
        <div className="pt-2">
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2.5 rounded-full px-4 h-11" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search people to add"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "var(--text)" }}
                autoFocus
              />
              <button onClick={() => setAdding(false)}><X size={15} color="var(--text-muted)" /></button>
            </div>
          </div>
          {shownCandidates.slice(0, 20).map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-4 py-2.5">
              <Avatar username={c.username} avatarUrl={c.avatar_url} size={40} />
              <span className="flex-1 text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{c.username}</span>
              <button
                onClick={() => addMember(c)}
                disabled={busyId === c.id}
                className="rounded-full px-4 h-8 text-xs shrink-0 transition-transform active:scale-95"
                style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busyId === c.id ? 0.6 : 1 }}
              >
                Add
              </button>
            </div>
          ))}
          {shownCandidates.length === 0 && (
            <p className="text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>Everyone is already in</p>
          )}
        </div>
      )}

      <div className="h-px my-2 mx-4" style={{ background: "var(--border)" }} />
      {onOpenInvite && (
        <StoryMenuRow icon={<Share2 size={17} color="var(--text)" />} label="Invite link" onClick={onOpenInvite} />
      )}
      <button
        onClick={leave}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-sm mb-5 transition-colors active:bg-[var(--active-highlight)]"
        style={{ color: "var(--heart)" }}
      >
        <LogOut size={17} /> Leave group
      </button>
    </StorySheetShell>
  );
}

const MSG_COLS =
  "id, sender_id, content, image_url, audio_url, audio_duration, reply_to_id, forwarded, created_at, edited_at, deleted";

// ---- Chat customisation ----
// Themes colour your own bubbles; fonts apply to the whole thread.
// Both are stored on the conversation, so everyone in the chat sees them.
// Chat themes: a background for the whole chat plus matching bubbles.
// Patterns are tiny inline SVGs, so nothing extra is downloaded.
const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const PAT = {
  hearts: (c) => svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><path d='M14 20c-2.5-3-7-1.5-7 2 0 3 4 5.5 7 8 3-2.5 7-5 7-8 0-3.5-4.5-5-7-2z' fill='${c}'/><path d='M42 46c-1.8-2.1-5-1-5 1.4 0 2.1 2.8 3.9 5 5.6 2.2-1.7 5-3.5 5-5.6 0-2.4-3.2-3.5-5-1.4z' fill='${c}'/></svg>`),
  stars: (c) => svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><circle cx='8' cy='12' r='1.2' fill='${c}'/><circle cx='52' cy='6' r='0.8' fill='${c}'/><circle cx='30' cy='34' r='1' fill='${c}'/><circle cx='70' cy='44' r='1.4' fill='${c}'/><circle cx='14' cy='62' r='0.9' fill='${c}'/><circle cx='46' cy='70' r='1.1' fill='${c}'/><path d='M62 20l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z' fill='${c}'/></svg>`),
  dots: (c) => svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22'><circle cx='3' cy='3' r='1.6' fill='${c}'/></svg>`),
  waves: (c) => svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='80' height='26'><path d='M0 13c10 0 10-8 20-8s10 8 20 8 10-8 20-8 10 8 20 8' fill='none' stroke='${c}' stroke-width='1.6'/></svg>`),
  leaves: (c) => svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><path d='M14 30c0-10 8-16 18-16-1 10-8 17-18 16z' fill='${c}'/><path d='M44 58c0-7 6-11 12-11-1 7-6 11-12 11z' fill='${c}'/></svg>`),
  confetti: (c1, c2) => svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect x='8' y='10' width='6' height='2.4' rx='1.2' transform='rotate(30 11 11)' fill='${c1}'/><rect x='40' y='30' width='6' height='2.4' rx='1.2' transform='rotate(-25 43 31)' fill='${c2}'/><circle cx='22' cy='46' r='1.8' fill='${c2}'/><circle cx='50' cy='8' r='1.5' fill='${c1}'/></svg>`),
};
const CHAT_THEMES = [
  { key: "default", name: "Default", bubble: "linear-gradient(135deg, var(--accent-start) 0%, var(--accent-end) 100%)", on: "var(--on-accent)" },
  {
    key: "love", name: "Love",
    bg: `${PAT.hearts("rgba(237,66,100,0.16)")}, linear-gradient(180deg, #FFE8EE 0%, #FFF3F5 100%)`,
    bubble: "linear-gradient(135deg, #ED4264 0%, #F15F79 100%)", on: "#FFFFFF",
    other: "#FFFFFF", otherText: "#3A0D18", muted: "rgba(58,13,24,0.55)",
  },
  {
    key: "night", name: "Night sky",
    bg: `${PAT.stars("rgba(255,255,255,0.55)")}, linear-gradient(180deg, #0B1026 0%, #1B2A4A 100%)`,
    bubble: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)", on: "#00243A",
    other: "rgba(255,255,255,0.12)", otherText: "#EEF4FF", muted: "rgba(238,244,255,0.6)",
  },
  {
    key: "ocean", name: "Ocean",
    bg: `${PAT.waves("rgba(255,255,255,0.10)")}, linear-gradient(180deg, #0F2027 0%, #203A43 50%, #2C5364 100%)`,
    bubble: "linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)", on: "#FFFFFF",
    other: "rgba(255,255,255,0.13)", otherText: "#EAF6FF", muted: "rgba(234,246,255,0.6)",
  },
  {
    key: "forest", name: "Forest",
    bg: `${PAT.leaves("rgba(255,255,255,0.07)")}, linear-gradient(180deg, #0B3D2E 0%, #1E5B45 100%)`,
    bubble: "linear-gradient(135deg, #71B280 0%, #A8E063 100%)", on: "#08201A",
    other: "rgba(255,255,255,0.12)", otherText: "#EFFFF6", muted: "rgba(239,255,246,0.6)",
  },
  {
    key: "sunset", name: "Sunset",
    bg: "linear-gradient(165deg, #FF9A76 0%, #FECFEF 100%)",
    bubble: "linear-gradient(135deg, #FF5E62 0%, #FF9966 100%)", on: "#FFFFFF",
    other: "rgba(255,255,255,0.85)", otherText: "#3A1A0E", muted: "rgba(58,26,14,0.6)",
  },
  {
    key: "galaxy", name: "Galaxy",
    bg: `${PAT.stars("rgba(255,255,255,0.45)")}, radial-gradient(circle at 30% 20%, #5B2A86 0%, #24123B 55%, #0E0718 100%)`,
    bubble: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)", on: "#FFFFFF",
    other: "rgba(255,255,255,0.12)", otherText: "#F3EAFF", muted: "rgba(243,234,255,0.6)",
  },
  {
    key: "bangladesh", name: "Bangladesh",
    bg: "radial-gradient(circle at 45% 40%, rgba(244,42,65,0.9) 0 22%, transparent 23%), linear-gradient(180deg, #006A4E 0%, #00543D 100%)",
    bubble: "linear-gradient(135deg, #F42A41 0%, #C8102E 100%)", on: "#FFFFFF",
    other: "rgba(255,255,255,0.14)", otherText: "#FFFFFF", muted: "rgba(255,255,255,0.65)",
  },
  {
    key: "desert", name: "Desert",
    bg: "linear-gradient(180deg, #F6D365 0%, #FDA085 100%)",
    bubble: "linear-gradient(135deg, #8E5A2B 0%, #C1803D 100%)", on: "#FFFFFF",
    other: "rgba(255,255,255,0.8)", otherText: "#3B230C", muted: "rgba(59,35,12,0.6)",
  },
  {
    key: "candy", name: "Candy",
    bg: `${PAT.confetti("rgba(240,147,251,0.55)", "rgba(245,87,108,0.45)")}, #FDF0FF`,
    bubble: "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)", on: "#FFFFFF",
    other: "#FFFFFF", otherText: "#3A1036", muted: "rgba(58,16,54,0.55)",
  },
  {
    key: "mint", name: "Mint",
    bg: `${PAT.waves("rgba(0,176,155,0.18)")}, #E6FFF7`,
    bubble: "linear-gradient(135deg, #00B09B 0%, #96C93D 100%)", on: "#04241E",
    other: "#FFFFFF", otherText: "#06302A", muted: "rgba(6,48,42,0.55)",
  },
  {
    key: "citrus", name: "Citrus",
    bg: `${PAT.dots("rgba(247,151,30,0.25)")}, #FFF7D6`,
    bubble: "linear-gradient(135deg, #F7971E 0%, #FFD200 100%)", on: "#2E1E00",
    other: "#FFFFFF", otherText: "#2E1E00", muted: "rgba(46,30,0,0.55)",
  },
  {
    key: "mono", name: "Monochrome",
    bg: `${PAT.dots("rgba(0,0,0,0.10)")}, #F2F2F2`,
    bubble: "linear-gradient(135deg, #434343 0%, #000000 100%)", on: "#FFFFFF",
    other: "#FFFFFF", otherText: "#111111", muted: "rgba(17,17,17,0.5)",
  },
  {
    key: "rose", name: "Rose",
    bg: "linear-gradient(180deg, #FBE3E8 0%, #FFF1EB 100%)",
    bubble: "linear-gradient(135deg, #ED4264 0%, #FFEDBC 100%)", on: "#33060F",
    other: "#FFFFFF", otherText: "#33060F", muted: "rgba(51,6,15,0.55)",
  },
  {
    key: "berry", name: "Berry",
    bg: "linear-gradient(180deg, #3A0F2E 0%, #5E1742 100%)",
    bubble: "linear-gradient(135deg, #B24592 0%, #F15F79 100%)", on: "#FFFFFF",
    other: "rgba(255,255,255,0.12)", otherText: "#FFEAF4", muted: "rgba(255,234,244,0.6)",
  },
  {
    key: "lavender", name: "Lavender",
    bg: `${PAT.dots("rgba(142,45,226,0.16)")}, #F3ECFF`,
    bubble: "linear-gradient(135deg, #8E2DE2 0%, #B06AB3 100%)", on: "#FFFFFF",
    other: "#FFFFFF", otherText: "#2A0F45", muted: "rgba(42,15,69,0.55)",
  },
];

// Style for the message area of a themed chat: the background, plus the
// colours used inside it so received bubbles and times stay readable.
function chatAreaStyle(t) {
  if (!t || !t.bg) return {};
  return {
    background: t.bg,
    "--surface": t.other,
    "--text": t.otherText,
    "--text-muted": t.muted,
    "--text-secondary": t.muted,
    "--border": "transparent",
  };
}

// System stacks only — no extra webfont downloads, so nothing flashes
// or blocks while a chat opens.
const CHAT_FONTS = [
  { key: "default",   name: "Default",   stack: "inherit" },
  { key: "sora",      name: "Sora",      stack: "'Sora', sans-serif" },
  { key: "cinzel",    name: "Cinzel",    stack: "'Cinzel', serif" },
  { key: "serif",     name: "Serif",     stack: "'Playfair Display', Georgia, serif" },
  { key: "mono",      name: "Mono",      stack: "'Space Mono', ui-monospace, monospace" },
  { key: "rounded",   name: "Rounded",   stack: "'Nunito', sans-serif" },
  { key: "classic",   name: "Classic",   stack: "'Lora', serif" },
  { key: "wide",      name: "Wide",      stack: "'Montserrat', sans-serif" },
  { key: "condensed", name: "Condensed", stack: "'Oswald', sans-serif" },
  { key: "playful",   name: "Playful",   stack: "'Pacifico', cursive" },
  { key: "hand",      name: "Handwriting", stack: "'Caveat', cursive" },
]

const themeOf = (key) => CHAT_THEMES.find((t) => t.key === key) || CHAT_THEMES[0];
const fontOf = (key) => CHAT_FONTS.find((f) => f.key === key) || CHAT_FONTS[0];

function CustomiseSheet({ conversationId, theme, font, onClose, onApplied }) {
  const [pickedTheme, setPickedTheme] = useState(theme || "default");
  const [pickedFont, setPickedFont] = useState(font || "default");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const t = themeOf(pickedTheme);
  const f = fontOf(pickedFont);

  const apply = async () => {
    setBusy(true);
    setError("");
    const { error: err } = await supabase
      .from("conversations")
      .update({ theme: pickedTheme, chat_font: pickedFont })
      .eq("id", conversationId);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    onApplied(pickedTheme, pickedFont);
  };

  return (
    <StorySheetShell title="Chat theme" onClose={onClose}>
      {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}

      {/* Live preview — stays at the top while you scroll the themes */}
      <div className="sticky top-0 z-10 px-4 pb-3" style={{ background: "var(--bg)" }}>
      <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div className="px-3.5 pt-2.5 pb-3" style={{ background: "var(--bg)", fontFamily: f.stack, ...chatAreaStyle(t) }}>
          <p className="text-center text-[10px] mb-2.5" style={{ color: "var(--text-muted)" }}>Today 9:41 PM</p>
          <div className="flex justify-start mb-1.5">
            <div className="px-3.5 py-2 text-[13px]" style={{ background: "var(--surface)", color: "var(--text)", borderRadius: "18px 18px 18px 5px", border: t.bg ? "none" : "1px solid var(--border)" }}>
              Did you see the new theme? 😍
            </div>
          </div>
          <div className="flex justify-end mb-1.5">
            <div className="px-3.5 py-2 text-[13px]" style={{ background: t.bubble, color: t.on, borderRadius: "18px 18px 5px 18px" }}>
              Yes! It looks amazing
            </div>
          </div>
          <div className="flex justify-end">
            <div className="px-3.5 py-2 text-[13px]" style={{ background: t.bubble, color: t.on, borderRadius: "18px 5px 18px 18px" }}>
              Using it right now 🔥
            </div>
          </div>
          <p className="text-right text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>Seen · {t.name} · {f.name}</p>
        </div>
      </div>
      </div>

      <p className="px-4 text-[12px] mb-2" style={{ color: "var(--text-muted)", fontWeight: 600 }}>Themes</p>
      <div className="grid grid-cols-3 gap-2.5 px-4">
        {CHAT_THEMES.map((th) => {
          const on = pickedTheme === th.key;
          return (
            <button
              key={th.key}
              onClick={() => setPickedTheme(th.key)}
              className="flex flex-col items-center gap-1.5 transition-transform active:scale-95"
            >
              <span
                className="relative w-full rounded-2xl overflow-hidden flex flex-col justify-end gap-1 p-2"
                style={{
                  aspectRatio: "3 / 4",
                  background: th.bg || "var(--bg-sunken)",
                  border: on ? "2.5px solid var(--accent-solid)" : "1px solid var(--border)",
                }}
              >
                <span className="self-start rounded-full" style={{ width: "62%", height: 10, background: th.other || "var(--surface)" }} />
                <span className="self-end rounded-full" style={{ width: "55%", height: 10, background: th.bubble }} />
                <span className="self-end rounded-full" style={{ width: "40%", height: 10, background: th.bubble }} />
                {on && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--accent-solid)" }}>
                    <Check size={12} color="var(--on-accent)" strokeWidth={3} />
                  </span>
                )}
              </span>
              <span className="text-[11px]" style={{ color: "var(--text)", fontWeight: on ? 700 : 500 }}>{th.name}</span>
            </button>
          );
        })}
      </div>

      <p className="px-4 text-[12px] mt-4 mb-2" style={{ color: "var(--text-muted)", fontWeight: 600 }}>Font</p>
      <div className="flex gap-2 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: "none" }}>
        {CHAT_FONTS.map((ft) => (
          <button
            key={ft.key}
            onClick={() => setPickedFont(ft.key)}
            className="rounded-full px-3.5 h-9 text-[13px] shrink-0"
            style={{
              fontFamily: ft.stack,
              background: pickedFont === ft.key ? "var(--text)" : "var(--surface)",
              color: pickedFont === ft.key ? "var(--bg)" : "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            {ft.name}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 pb-6">
        <button
          onClick={apply}
          disabled={busy}
          className="w-full rounded-full h-11 text-sm transition-transform active:scale-95"
          style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Applying..." : "Apply"}
        </button>
      </div>
    </StorySheetShell>
  );
}

// ---- Invite link ----
function InviteSheet({ conversationId, code, title, currentUserId, onClose, onReset }) {
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [sendOpen, setSendOpen] = useState(false);
  const [flash, setFlash] = useState("");
  const [busy, setBusy] = useState(false);

  const link = `${window.location.origin}/join/${code || ""}`;

  // Rendered on-device with the qrcode package — the link never leaves
  // the browser. Regenerates whenever the link is reset.
  useEffect(() => {
    if (!showQR) return;
    let cancelled = false;
    QRCode.toDataURL(link, { width: 220, margin: 1, errorCorrectionLevel: "M" })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl("");
      });
    return () => {
      cancelled = true;
    };
  }, [showQR, link]);

  const say = (m) => {
    setFlash(m);
    setTimeout(() => setFlash(""), 1800);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      say("Link copied");
    } catch {
      say("Couldn't copy on this device");
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: title || "Join my group on Loop", url: link });
        return;
      }
      await navigator.clipboard.writeText(link);
      say("Link copied");
    } catch {
      say("Sharing isn't available here");
    }
  };

  const reset = async () => {
    if (!window.confirm("Reset the link? The old one will stop working.")) return;
    setBusy(true);
    const { data, error } = await supabase.rpc("reset_invite_code", { p_conversation_id: conversationId });
    setBusy(false);
    if (error) {
      say(error.message);
      return;
    }
    onReset(data);
    say("New link created");
  };

  if (sendOpen) {
    return (
      <ForwardSheet
        message={{ content: `Join "${title || "my group"}" on Loop: ${link}` }}
        currentUserId={currentUserId}
        onClose={() => setSendOpen(false)}
      />
    );
  }

  return (
    <StorySheetShell title="Invite link" onClose={onClose}>
      {flash && <p className="text-xs px-4 pb-2" style={{ color: "var(--accent-solid)" }}>{flash}</p>}

      <div className="px-4 pb-3">
        <div className="rounded-2xl px-4 py-3" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
          <span className="text-[11px] block mb-1" style={{ color: "var(--text-muted)" }}>Anyone with this link can join</span>
          <span className="text-xs block" style={{ color: "var(--text)", wordBreak: "break-all" }}>{link}</span>
        </div>
      </div>

      {showQR && (
        <div className="flex flex-col items-center pb-3">
          <div className="rounded-2xl p-3 flex items-center justify-center" style={{ background: "#FFFFFF", minWidth: 226, minHeight: 226 }}>
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Invite QR code" width={200} height={200} />
            ) : (
              <span className="text-xs" style={{ color: "#666" }}>Generating...</span>
            )}
          </div>
          <span className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>Point a camera at this to join</span>
        </div>
      )}

      <div className="pb-6">
        <StoryMenuRow icon={<Copy size={17} color="var(--text)" />} label="Copy link" onClick={copy} />
        <StoryMenuRow icon={<ShareIcon size={17} color="var(--text)" />} label="Send in Loop" onClick={() => setSendOpen(true)} />
        <StoryMenuRow
          icon={<Hash size={17} color="var(--text)" />}
          label={showQR ? "Hide QR code" : "QR code"}
          onClick={() => setShowQR((v) => !v)}
        />
        <StoryMenuRow icon={<Share2 size={17} color="var(--text)" />} label="Share" onClick={share} />
        <div className="h-px my-1.5 mx-4" style={{ background: "var(--border)" }} />
        <StoryMenuRow icon={<RefreshCw size={17} color="var(--heart)" />} label="Reset link" danger busy={busy} onClick={reset} />
      </div>
    </StorySheetShell>
  );
}

// ---- Nicknames ----
function NicknamesSheet({ conversationId, currentUserId, onClose, onSaved }) {
  const [rows, setRows] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data: members } = await supabase
        .from("conversation_members")
        .select("user_id, nickname")
        .eq("conversation_id", conversationId);
      const ids = (members || []).map((m) => m.user_id);
      let profiles = [];
      if (ids.length > 0) {
        const { data } = await supabase.from("profiles").select("id, username, avatar_url").in("id", ids);
        profiles = data || [];
      }
      const built = (members || []).map((m) => ({
        ...m,
        username: profiles.find((pr) => pr.id === m.user_id)?.username || "unknown",
        avatarUrl: profiles.find((pr) => pr.id === m.user_id)?.avatar_url || null,
      }));
      setRows(built);
      const d = {};
      built.forEach((b) => (d[b.user_id] = b.nickname || ""));
      setDrafts(d);
      setLoading(false);
    })();
  }, [conversationId]);

  const save = async (userId) => {
    setBusyId(userId);
    setError("");
    const value = (drafts[userId] || "").trim();
    const { error: err } = await supabase
      .from("conversation_members")
      .update({ nickname: value || null })
      .eq("conversation_id", conversationId)
      .eq("user_id", userId);
    setBusyId(null);
    if (err) {
      setError(err.message);
      return;
    }
    setRows((prev) => prev.map((r) => (r.user_id === userId ? { ...r, nickname: value || null } : r)));
    onSaved?.();
  };

  return (
    <StorySheetShell title="Nicknames" onClose={onClose}>
      {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}
      <p className="text-[11px] px-4 pb-2" style={{ color: "var(--text-muted)" }}>
        Nicknames are visible to everyone in this chat.
      </p>
      <div className="pb-6">
        {loading ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : (
          rows.map((r) => {
            const changed = (drafts[r.user_id] || "") !== (r.nickname || "");
            return (
              <div key={r.user_id} className="flex items-center gap-3 px-4 py-2.5">
                <Avatar username={r.username} avatarUrl={r.avatarUrl} size={40} />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] block mb-1 truncate" style={{ color: "var(--text-muted)" }}>
                    {r.username}{r.user_id === currentUserId ? " (you)" : ""}
                  </span>
                  <input
                    value={drafts[r.user_id] || ""}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [r.user_id]: e.target.value }))}
                    placeholder="Set a nickname"
                    maxLength={30}
                    className="w-full rounded-full px-3 h-9 text-sm outline-none"
                    style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)" }}
                  />
                </div>
                <button
                  onClick={() => save(r.user_id)}
                  disabled={!changed || busyId === r.user_id}
                  className="rounded-full px-3.5 h-9 text-xs shrink-0 transition-transform active:scale-95"
                  style={{
                    background: changed ? ACCENT : "var(--bg-sunken)",
                    border: changed ? "none" : "1px solid var(--border)",
                    color: changed ? "var(--on-accent)" : "var(--text-muted)",
                    fontWeight: 700,
                  }}
                >
                  Save
                </button>
              </div>
            );
          })
        )}
      </div>
    </StorySheetShell>
  );
}

// ---- Sharing a post or reel ----
// One sheet used by Feed, Reels and PostDetail. Sends into a DM (reusing
// the conversation tables), copies a link, or hands off to the OS share
// sheet where the browser supports it.
function ShareSheet({ item, currentUserId, onClose }) {
  const [groups, setGroups] = useState([]);
  const [people, setPeople] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sentTo, setSentTo] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [flash, setFlash] = useState("");

  const link = `${window.location.origin}/p/${item.id}`;
  const label = isPhotoPost(item) ? "📷 Shared a post" : "🎬 Shared a reel";

  const say = (m) => {
    setFlash(m);
    setTimeout(() => setFlash(""), 1800);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: memberRows } = await supabase
        .from("conversation_members")
        .select("conversation_id")
        .eq("user_id", currentUserId || "");
      const ids = (memberRows || []).map((r) => r.conversation_id);
      let groupRows = [];
      if (ids.length > 0) {
        const { data } = await supabase.from("conversations").select("id, title, avatar_url").in("id", ids).eq("is_group", true);
        groupRows = data || [];
      }
      const { data: profileRows } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .neq("id", currentUserId || "")
        .limit(50);
      if (!cancelled) {
        setGroups(groupRows);
        setPeople(profileRows || []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  const sendInto = async (conversationId) => {
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      // Videos don't render in a bubble, so only photos travel as media;
      // either way the link goes along so the post is reachable.
      image_url: isPhotoPost(item) ? item.media_url : null,
      content: item.caption ? `${label} · ${item.caption}\n${link}` : `${label}\n${link}`,
    });
    if (error) throw error;
    await supabase
      .from("conversations")
      .update({ last_message: label, last_message_at: new Date().toISOString() })
      .eq("id", conversationId);
  };

  const toGroup = async (g) => {
    setBusyId(g.id);
    try {
      await sendInto(g.id);
      setSentTo((prev) => [...prev, g.id]);
    } catch (e) {
      say(e.message);
    }
    setBusyId(null);
  };

  const toPerson = async (pr) => {
    setBusyId(pr.id);
    const { data: convoId, error } = await supabase.rpc("get_or_create_conversation", { other_user: pr.id });
    if (error) {
      setBusyId(null);
      say(error.message);
      return;
    }
    try {
      await sendInto(convoId);
      await supabase.from("notifications").insert({ user_id: pr.id, actor_id: currentUserId, type: "message" });
      setSentTo((prev) => [...prev, pr.id]);
    } catch (e) {
      say(e.message);
    }
    setBusyId(null);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      say("Link copied");
    } catch {
      say("Couldn't copy on this device");
    }
  };

  const nativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Loop", text: item.caption || "", url: link });
        return;
      }
      await navigator.clipboard.writeText(link);
      say("Link copied");
    } catch {
      say("Sharing isn't available here");
    }
  };

  const q = query.trim().toLowerCase();
  const shownGroups = groups.filter((g) => (g.title || "Group").toLowerCase().includes(q));
  const shownPeople = people.filter((pr) => pr.username.toLowerCase().includes(q));

  const SendBtn = ({ id, onClick }) => {
    const done = sentTo.includes(id);
    return (
      <button
        onClick={() => !done && onClick()}
        disabled={done || busyId === id}
        className="rounded-full px-4 h-8 text-xs shrink-0 transition-transform active:scale-95"
        style={{
          background: done ? "var(--bg-sunken)" : ACCENT,
          border: done ? "1px solid var(--border)" : "none",
          color: done ? "var(--text-muted)" : "var(--on-accent)",
          fontWeight: 700,
          opacity: busyId === id ? 0.6 : 1,
        }}
      >
        {done ? "Sent" : busyId === id ? "..." : "Send"}
      </button>
    );
  };

  return (
    <StorySheetShell title="Share" onClose={onClose}>
      {flash && <p className="text-xs px-4 pb-2" style={{ color: "var(--accent-solid)" }}>{flash}</p>}

      <div className="flex gap-2 px-4 pb-3">
        <button
          onClick={copyLink}
          className="flex-1 flex items-center justify-center gap-2 rounded-full h-11 text-xs transition-transform active:scale-95"
          style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600 }}
        >
          <Copy size={15} /> Copy link
        </button>
        <button
          onClick={nativeShare}
          className="flex-1 flex items-center justify-center gap-2 rounded-full h-11 text-xs transition-transform active:scale-95"
          style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600 }}
        >
          <Share2 size={15} /> Share to...
        </button>
      </div>

      <div className="px-4 pb-2">
        <div className="flex items-center gap-2.5 rounded-full px-4 h-11" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats and people"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text)" }}
          />
        </div>
      </div>

      <div className="pb-6">
        {loading ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : (
          <>
            {shownGroups.length > 0 && (
              <p className="text-[11px] px-4 pt-1 pb-1.5 uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.4px" }}>Groups</p>
            )}
            {shownGroups.map((g) => (
              <div key={g.id} className="flex items-center gap-3 px-4 py-2.5">
                {g.avatar_url ? (
                  <img src={g.avatar_url} alt="" className="rounded-full object-cover shrink-0" style={{ width: 44, height: 44 }} />
                ) : (
                  <div className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <Users size={18} color="var(--text)" />
                  </div>
                )}
                <span className="flex-1 text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{g.title || "Group"}</span>
                <SendBtn id={g.id} onClick={() => toGroup(g)} />
              </div>
            ))}

            {shownPeople.length > 0 && (
              <p className="text-[11px] px-4 pt-3 pb-1.5 uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.4px" }}>People</p>
            )}
            {shownPeople.map((pr) => (
              <div key={pr.id} className="flex items-center gap-3 px-4 py-2.5">
                <Avatar username={pr.username} avatarUrl={pr.avatar_url} size={44} />
                <span className="flex-1 text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{pr.username}</span>
                <SendBtn id={pr.id} onClick={() => toPerson(pr)} />
              </div>
            ))}

            {shownGroups.length === 0 && shownPeople.length === 0 && (
              <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Nothing matches that</p>
            )}
          </>
        )}
      </div>
    </StorySheetShell>
  );
}

// ---- Saved posts and collections ----

// Small reusable grid tile.
function MediaTile({ post, onClick, selected, selectable, badge }) {
  return (
    <button
      onClick={onClick}
      className="aspect-square relative overflow-hidden"
      style={{ background: "var(--bg-sunken)" }}
    >
      <MediaThumb src={post.media_url} cover={post.cover_url} isVideo={!isPhotoPost(post)} />
      {post.media_count > 1 ? (
        <span className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }}>
          <Layers size={13} color="#FFFFFF" />
        </span>
      ) : (
        !isPhotoPost(post) && (
          <span className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }}>
            <Video size={13} color="#FFFFFF" />
          </span>
        )
      )}
      {badge}
      {selectable && (
        <span
          className="absolute bottom-1.5 right-1.5 rounded-full flex items-center justify-center"
          style={{
            width: 20,
            height: 20,
            background: selected ? ACCENT : "rgba(0,0,0,0.45)",
            border: selected ? "none" : "1.5px solid rgba(255,255,255,0.8)",
          }}
        >
          {selected && <Check size={12} color="var(--on-accent)" strokeWidth={3} />}
        </span>
      )}
    </button>
  );
}

// Pick which collections a post belongs to. Used from the bookmark
// long-press and from inside a collection.
function AddToCollectionSheet({ postIds, currentUserId, onClose, onDone }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [collaborative, setCollaborative] = useState(false);
  const [busy, setBusy] = useState(false);
  const [addedTo, setAddedTo] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    // Owned collections plus any collaborative ones you were added to.
    const { data: owned } = await supabase
      .from("save_collections")
      .select("id, name, cover_url, is_collaborative, owner_id")
      .eq("owner_id", currentUserId || "")
      .order("created_at", { ascending: false });

    const { data: shared } = await supabase
      .from("collection_collaborators")
      .select("collection_id")
      .eq("user_id", currentUserId || "");

    let sharedRows = [];
    const sharedIds = (shared || []).map((r) => r.collection_id);
    if (sharedIds.length > 0) {
      const { data } = await supabase
        .from("save_collections")
        .select("id, name, cover_url, is_collaborative, owner_id")
        .in("id", sharedIds)
        .eq("is_collaborative", true);
      sharedRows = data || [];
    }

    const seen = new Set();
    const merged = [...(owned || []), ...sharedRows].filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
    setCollections(merged);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [currentUserId]);

  const addInto = async (collectionId) => {
    setBusy(true);
    setError("");
    const rows = postIds.map((id) => ({ collection_id: collectionId, post_id: id, added_by: currentUserId }));
    const { error: err } = await supabase
      .from("collection_items")
      .upsert(rows, { onConflict: "collection_id,post_id" });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setAddedTo((prev) => [...prev, collectionId]);
    onDone?.();
  };

  const createAndAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    setBusy(true);
    setError("");
    const { data: created, error: err } = await supabase
      .from("save_collections")
      .insert({ owner_id: currentUserId, name, is_collaborative: collaborative })
      .select("id, name, cover_url, is_collaborative, owner_id")
      .single();
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    setCollections((prev) => [created, ...prev]);
    setNewName("");
    setBusy(false);
    await addInto(created.id);
  };

  return (
    <StorySheetShell title={postIds.length > 1 ? `Add ${postIds.length} posts to...` : "Save to collection"} onClose={onClose}>
      {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New collection name"
            maxLength={40}
            className="flex-1 rounded-full px-4 h-11 text-sm outline-none"
            style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          <button
            onClick={createAndAdd}
            disabled={busy || !newName.trim()}
            className="rounded-full px-4 h-11 text-xs shrink-0 transition-transform active:scale-95"
            style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busy || !newName.trim() ? 0.5 : 1 }}
          >
            Create
          </button>
        </div>
        <button onClick={() => setCollaborative((v) => !v)} className="flex items-center gap-2.5 w-full text-left">
          <span className="rounded-full shrink-0" style={{ width: 34, height: 19, background: collaborative ? ACCENT : "var(--toggle-off)", position: "relative" }}>
            <span className="rounded-full bg-white absolute" style={{ width: 15, height: 15, top: 2, left: collaborative ? 17 : 2, transition: "left 0.15s" }} />
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Make it collaborative — invite people to add posts</span>
        </button>
      </div>

      <div className="pb-6">
        {loading ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : collections.length === 0 ? (
          <p className="text-xs text-center py-6 px-8" style={{ color: "var(--text-muted)" }}>
            No collections yet. Name one above to make your first.
          </p>
        ) : (
          collections.map((c) => {
            const done = addedTo.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => !done && addInto(c.id)}
                disabled={done || busy}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors active:bg-[var(--active-highlight)]"
              >
                <div
                  className="w-12 h-12 rounded-xl shrink-0 overflow-hidden flex items-center justify-center"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  {c.cover_url ? (
                    <img src={c.cover_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Bookmark size={17} color="var(--text-muted)" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm truncate block" style={{ color: "var(--text)", fontWeight: 600 }}>{c.name}</span>
                  {c.is_collaborative && (
                    <span className="flex items-center gap-1 text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      <Users size={10} /> Collaborative
                      {c.owner_id !== currentUserId ? " · shared with you" : ""}
                    </span>
                  )}
                </div>
                {done && <Check size={17} color="var(--accent-solid)" />}
              </button>
            );
          })
        )}
      </div>
    </StorySheetShell>
  );
}

// Manage who can add to a collaborative collection.
function CollaboratorsSheet({ collection, currentUserId, onClose, onChanged }) {
  const [rows, setRows] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const isOwner = collection.owner_id === currentUserId;

  const load = async () => {
    const { data: collabs } = await supabase
      .from("collection_collaborators")
      .select("user_id")
      .eq("collection_id", collection.id);
    const ids = (collabs || []).map((r) => r.user_id);
    let profiles = [];
    if (ids.length > 0) {
      const { data } = await supabase.from("profiles").select("id, username, avatar_url").in("id", ids);
      profiles = data || [];
    }
    setRows(
      (collabs || []).map((r) => ({
        user_id: r.user_id,
        username: profiles.find((pr) => pr.id === r.user_id)?.username || "unknown",
        avatarUrl: profiles.find((pr) => pr.id === r.user_id)?.avatar_url || null,
      }))
    );
    const { data: all } = await supabase.from("profiles").select("id, username, avatar_url").limit(60);
    setCandidates(all || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [collection.id]);

  const add = async (pr) => {
    setBusyId(pr.id);
    setError("");
    const { error: err } = await supabase
      .from("collection_collaborators")
      .insert({ collection_id: collection.id, user_id: pr.id });
    setBusyId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await load();
    onChanged?.();
  };

  const remove = async (r) => {
    setBusyId(r.user_id);
    setError("");
    const { error: err } = await supabase
      .from("collection_collaborators")
      .delete()
      .eq("collection_id", collection.id)
      .eq("user_id", r.user_id);
    setBusyId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await load();
    onChanged?.();
  };

  const memberIds = rows.map((r) => r.user_id);
  const shown = candidates
    .filter((c) => !memberIds.includes(c.id) && c.id !== collection.owner_id)
    .filter((c) => c.username.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <StorySheetShell title="Collaborators" onClose={onClose}>
      {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}
      {!collection.is_collaborative && (
        <p className="text-[11px] px-4 pb-2" style={{ color: "var(--text-muted)" }}>
          This collection isn't collaborative yet — turn it on in the collection's ··· menu so invitees can add posts.
        </p>
      )}

      <p className="text-[11px] px-4 pb-1.5 uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.4px" }}>
        {rows.length} collaborator{rows.length === 1 ? "" : "s"}
      </p>
      {loading ? (
        <p className="text-xs text-center py-5" style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : rows.length === 0 ? (
        <p className="text-xs px-4 pb-2" style={{ color: "var(--text-muted)" }}>No one added yet</p>
      ) : (
        rows.map((r) => (
          <div key={r.user_id} className="flex items-center gap-3 px-4 py-2.5">
            <Avatar username={r.username} avatarUrl={r.avatarUrl} size={40} />
            <span className="flex-1 text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{r.username}</span>
            {(isOwner || r.user_id === currentUserId) && (
              <button onClick={() => remove(r)} disabled={busyId === r.user_id} className="p-1 shrink-0 transition-transform active:scale-90">
                <UserMinus size={17} color="var(--heart)" />
              </button>
            )}
          </div>
        ))
      )}

      {isOwner && (
        <>
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center gap-2.5 rounded-full px-4 h-11" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search people to invite"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "var(--text)" }}
              />
            </div>
          </div>
          <div className="pb-6">
            {shown.slice(0, 20).map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-2.5">
                <Avatar username={c.username} avatarUrl={c.avatar_url} size={40} />
                <span className="flex-1 text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{c.username}</span>
                <button
                  onClick={() => add(c)}
                  disabled={busyId === c.id}
                  className="rounded-full px-4 h-8 text-xs shrink-0 transition-transform active:scale-95"
                  style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busyId === c.id ? 0.6 : 1 }}
                >
                  Invite
                </button>
              </div>
            ))}
            {shown.length === 0 && (
              <p className="text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>Everyone is already invited</p>
            )}
          </div>
        </>
      )}
    </StorySheetShell>
  );
}

// Rename a collection and choose its cover from the posts inside it.
function CollectionEditSheet({ collection, posts, onClose, onSaved }) {
  const [name, setName] = useState(collection.name);
  const [cover, setCover] = useState(collection.cover_url || null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Only photos make sensible covers — a video frame can't be read here
  // without decoding it, so those are left out of the picker.
  const coverChoices = posts.filter((p) => isPhotoPost(p));

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setBusy(true);
    setError("");
    const { error: err } = await supabase
      .from("save_collections")
      .update({ name: trimmed, cover_url: cover })
      .eq("id", collection.id);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    onSaved({ ...collection, name: trimmed, cover_url: cover });
  };

  return (
    <StorySheetShell title="Edit collection" onClose={onClose}>
      {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}

      <div className="px-4 pb-3">
        <label className="text-[11px] block mb-1.5" style={{ color: "var(--text-muted)" }}>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          className="w-full rounded-full px-4 h-11 text-sm outline-none"
          style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)" }}
        />
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px]" style={{ color: "var(--text-muted)" }}>Cover</label>
          {cover && (
            <button onClick={() => setCover(null)} className="text-[11px]" style={{ color: "var(--accent-solid)", fontWeight: 600 }}>
              Use newest post
            </button>
          )}
        </div>
        {coverChoices.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Add a photo to this collection to pick a cover.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            {coverChoices.map((p) => {
              const picked = cover === p.media_url;
              return (
                <button
                  key={p.id}
                  onClick={() => setCover(p.media_url)}
                  className="aspect-square rounded-xl overflow-hidden relative"
                  style={{ border: picked ? "2px solid var(--accent-solid)" : "1px solid var(--border)" }}
                >
                  <img src={p.media_url} alt="" className="w-full h-full object-cover" />
                  {picked && (
                    <span
                      className="absolute bottom-1 right-1 rounded-full flex items-center justify-center"
                      style={{ width: 18, height: 18, background: ACCENT }}
                    >
                      <Check size={11} color="var(--on-accent)" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-4 pb-6">
        <button
          onClick={save}
          disabled={busy || !name.trim()}
          className="w-full rounded-full h-11 text-sm transition-transform active:scale-95"
          style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busy || !name.trim() ? 0.5 : 1 }}
        >
          {busy ? "Saving..." : "Save changes"}
        </button>
      </div>
    </StorySheetShell>
  );
}

function SavedScreen({ onBack, onOpenPost }) {
  const [tab, setTab] = useState("all"); // all | collections
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCollection, setOpenCollection] = useState(null);
  const [collectionPosts, setCollectionPosts] = useState([]);
  const [collectionLoading, setCollectionLoading] = useState(false);

  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [sheet, setSheet] = useState(null); // add | collaborators | menu
  const [flash, setFlash] = useState("");
  const [loadError, setLoadError] = useState("");
  const [collectionsError, setCollectionsError] = useState("");

  const say = (m) => {
    setFlash(m);
    setTimeout(() => setFlash(""), 1800);
  };

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);
      await Promise.all([loadSaved(user.id), loadCollections(user.id)]);
      setLoading(false);
    })();
  }, []);

  const loadSaved = async (uid) => {
    // Only post_id is selected on purpose — the ordering happens on the
    // posts table, so this keeps working whatever columns saves has.
    const { data: saves, error: savesErr } = await supabase
      .from("saves")
      .select("post_id")
      .eq("user_id", uid);

    if (savesErr) {
      setLoadError(savesErr.message);
      setPosts([]);
      return;
    }

    const ids = (saves || []).map((r) => r.post_id);
    if (ids.length === 0) {
      setPosts([]);
      return;
    }
    const { data: rows, error: postsErr } = await supabase
      .from("posts")
      .select("id, media_url, media_type, media_count, caption, created_at, cover_url")
      .in("id", ids)
      .order("created_at", { ascending: false });

    if (postsErr) {
      setLoadError(postsErr.message);
      setPosts([]);
      return;
    }
    setPosts(rows || []);
  };

  const loadCollections = async (uid) => {
    const { data: owned, error: ownedErr } = await supabase
      .from("save_collections")
      .select("id, name, cover_url, is_collaborative, owner_id")
      .eq("owner_id", uid)
      .order("created_at", { ascending: false });

    if (ownedErr) {
      setCollectionsError(ownedErr.message);
      setCollections([]);
      return;
    }

    const { data: shared } = await supabase
      .from("collection_collaborators")
      .select("collection_id")
      .eq("user_id", uid);
    const sharedIds = (shared || []).map((r) => r.collection_id);
    let sharedRows = [];
    if (sharedIds.length > 0) {
      const { data } = await supabase
        .from("save_collections")
        .select("id, name, cover_url, is_collaborative, owner_id")
        .in("id", sharedIds);
      sharedRows = data || [];
    }

    const seen = new Set();
    const merged = [...(owned || []), ...sharedRows].filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });

    // Count items and borrow the newest item as a cover when none is set.
    const ids = merged.map((c) => c.id);
    let items = [];
    if (ids.length > 0) {
      const { data } = await supabase.from("collection_items").select("collection_id, post_id").in("collection_id", ids);
      items = data || [];
    }
    const postIds = [...new Set(items.map((i) => i.post_id))];
    let media = {};
    if (postIds.length > 0) {
      const { data } = await supabase.from("posts").select("id, media_url, media_type, cover_url").in("id", postIds);
      (data || []).forEach((m) => (media[m.id] = m));
    }
    setCollections(
      merged.map((c) => {
        const mine = items.filter((i) => i.collection_id === c.id);
        const first = mine.map((i) => media[i.post_id]).find(Boolean);
        return {
          ...c,
          count: mine.length,
          previewUrl: c.cover_url || first?.media_url || null,
          previewType: first?.media_type,
          previewCover: first?.cover_url || null,
        };
      })
    );
  };

  const openCollectionView = async (c) => {
    setOpenCollection(c);
    setCollectionLoading(true);
    const { data: items } = await supabase.from("collection_items").select("post_id").eq("collection_id", c.id);
    const ids = (items || []).map((i) => i.post_id);
    if (ids.length === 0) {
      setCollectionPosts([]);
      setCollectionLoading(false);
      return;
    }
    const { data: rows } = await supabase
      .from("posts")
      .select("id, media_url, media_type, media_count, created_at, cover_url")
      .in("id", ids)
      .order("created_at", { ascending: false });
    setCollectionPosts(rows || []);
    setCollectionLoading(false);
  };

  const toggleSelect = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const removeFromCollection = async (postId) => {
    const { error } = await supabase
      .from("collection_items")
      .delete()
      .eq("collection_id", openCollection.id)
      .eq("post_id", postId);
    if (error) {
      say(error.message);
      return;
    }
    setCollectionPosts((prev) => prev.filter((p) => p.id !== postId));
    loadCollections(userId);
  };

  const toggleCollaborative = async () => {
    const next = !openCollection.is_collaborative;
    const { error } = await supabase.from("save_collections").update({ is_collaborative: next }).eq("id", openCollection.id);
    if (error) {
      say(error.message);
      return;
    }
    setOpenCollection((prev) => ({ ...prev, is_collaborative: next }));
    loadCollections(userId);
    say(next ? "Collaboration turned on" : "Collaboration turned off");
  };

  const deleteCollection = async () => {
    if (!window.confirm(`Delete "${openCollection.name}"? The posts stay saved.`)) return;
    const { error } = await supabase.from("save_collections").delete().eq("id", openCollection.id);
    if (error) {
      say(error.message);
      return;
    }
    setSheet(null);
    setOpenCollection(null);
    loadCollections(userId);
  };

  // ---------- collection detail ----------
  if (openCollection) {
    const isOwner = openCollection.owner_id === userId;
    return (
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="flex items-center gap-2 px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <button
            onClick={() => {
              setOpenCollection(null);
              setSelectMode(false);
              setSelected([]);
            }}
            className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90"
          >
            <ChevronLeft size={24} color="var(--text)" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg truncate" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>
              {openCollection.name}
            </h1>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {collectionPosts.length} post{collectionPosts.length === 1 ? "" : "s"}
              {openCollection.is_collaborative ? " · Collaborative" : ""}
            </span>
          </div>
          <button onClick={() => setSheet("menu")} className="p-1 -mr-1 shrink-0 transition-transform active:scale-90">
            <Ellipsis size={19} color="var(--text)" />
          </button>
        </div>

        {flash && <p className="text-xs px-4 py-2" style={{ color: "var(--accent-solid)" }}>{flash}</p>}

        {collectionLoading ? (
          <div className="grid grid-cols-3 gap-0.5 mt-0.5">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="aspect-square" style={{ background: "var(--border-subtle)" }} />
            ))}
          </div>
        ) : collectionPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 px-8 text-center">
            <Bookmark size={28} color="var(--toggle-off)" />
            <p className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>This collection is empty</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Go to Saved, pick some posts, and add them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5 mt-0.5">
            {collectionPosts.map((p) => (
              <MediaTile
                key={p.id}
                post={p}
                onClick={() => onOpenPost?.(p.id)}
                badge={
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCollection(p.id);
                    }}
                    className="absolute bottom-1.5 left-1.5 rounded-full flex items-center justify-center"
                    style={{ width: 20, height: 20, background: "rgba(0,0,0,0.55)" }}
                  >
                    <X size={11} color="#FFFFFF" />
                  </span>
                }
              />
            ))}
          </div>
        )}

        {sheet === "menu" && (
          <StorySheetShell title={openCollection.name} onClose={() => setSheet(null)}>
            <div className="pb-6">
              {isOwner && (
                <StoryMenuRow
                  icon={<Pencil size={17} color="var(--text)" />}
                  label="Rename & cover"
                  onClick={() => setSheet("edit")}
                />
              )}
              <StoryMenuRow
                icon={<Users size={17} color="var(--text)" />}
                label="Collaborators"
                onClick={() => setSheet("collaborators")}
              />
              {isOwner && (
                <StoryMenuRow
                  icon={<UserPlus size={17} color="var(--text)" />}
                  label={openCollection.is_collaborative ? "Turn off collaboration" : "Make collaborative"}
                  onClick={toggleCollaborative}
                  trailing={
                    <span className="rounded-full shrink-0" style={{ width: 34, height: 19, background: openCollection.is_collaborative ? ACCENT : "var(--toggle-off)", position: "relative" }}>
                      <span className="rounded-full bg-white absolute" style={{ width: 15, height: 15, top: 2, left: openCollection.is_collaborative ? 17 : 2, transition: "left 0.15s" }} />
                    </span>
                  }
                />
              )}
              {isOwner && (
                <>
                  <div className="h-px my-1.5 mx-4" style={{ background: "var(--border)" }} />
                  <StoryMenuRow icon={<Trash2 size={17} color="var(--heart)" />} label="Delete collection" danger onClick={deleteCollection} />
                </>
              )}
            </div>
          </StorySheetShell>
        )}

        {sheet === "collaborators" && (
          <CollaboratorsSheet
            collection={openCollection}
            currentUserId={userId}
            onClose={() => setSheet(null)}
            onChanged={() => loadCollections(userId)}
          />
        )}

        {sheet === "edit" && (
          <CollectionEditSheet
            collection={openCollection}
            posts={collectionPosts}
            onClose={() => setSheet(null)}
            onSaved={(updated) => {
              setOpenCollection(updated);
              setSheet(null);
              loadCollections(userId);
              say("Collection updated");
            }}
          />
        )}
      </div>
    );
  }

  // ---------- main saved screen ----------
  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90">
          <ChevronLeft size={24} color="var(--text)" />
        </button>
        <h1 className="flex-1 text-xl" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>Saved</h1>
        {tab === "all" && posts.length > 0 && (
          <button
            onClick={() => {
              setSelectMode((v) => !v);
              setSelected([]);
            }}
            className="text-xs px-2"
            style={{ color: selectMode ? "var(--accent-solid)" : "var(--text-muted)", fontWeight: 600 }}
          >
            {selectMode ? "Cancel" : "Select"}
          </button>
        )}
      </div>

      <div className="flex" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        {[
          { k: "all", label: "All posts" },
          { k: "collections", label: "Collections" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => {
              setTab(t.k);
              setSelectMode(false);
              setSelected([]);
            }}
            className="flex-1 py-2.5 text-[13px]"
            style={{
              color: tab === t.k ? "var(--text)" : "var(--text-muted)",
              fontWeight: tab === t.k ? 700 : 500,
              borderBottom: tab === t.k ? "2px solid var(--text)" : "2px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {flash && <p className="text-xs px-4 py-2" style={{ color: "var(--accent-solid)" }}>{flash}</p>}

      {loading ? (
        <div className="grid grid-cols-3 gap-0.5 mt-0.5">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="aspect-square" style={{ background: "var(--border-subtle)" }} />
          ))}
        </div>
      ) : tab === "all" ? (
        loadError ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm mb-1.5" style={{ color: "var(--heart)", fontWeight: 600 }}>Couldn't load your saved posts</p>
            <p className="text-xs" style={{ color: "var(--text-muted)", wordBreak: "break-word" }}>{loadError}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 px-8 text-center">
            <Bookmark size={30} color="var(--toggle-off)" />
            <p className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>Nothing saved yet</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Tap the bookmark on any post or reel and it will show up here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5 mt-0.5">
            {posts.map((p) => (
              <MediaTile
                key={p.id}
                post={p}
                selectable={selectMode}
                selected={selected.includes(p.id)}
                onClick={() => (selectMode ? toggleSelect(p.id) : onOpenPost?.(p.id))}
              />
            ))}
          </div>
        )
      ) : collectionsError ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm mb-1.5" style={{ color: "var(--heart)", fontWeight: 600 }}>Couldn't load collections</p>
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)", wordBreak: "break-word" }}>{collectionsError}</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            If this mentions a missing table, run collections-setup.sql in Supabase.
          </p>
        </div>
      ) : collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 px-8 text-center">
          <Bookmark size={30} color="var(--toggle-off)" />
          <p className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>No collections yet</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Group your saved posts into albums — and invite people to add to them.
          </p>
          <button
            onClick={() => setSheet("add")}
            className="rounded-full px-5 h-10 text-xs mt-1 transition-transform active:scale-95"
            style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700 }}
          >
            New collection
          </button>
        </div>
      ) : (
        <div className="px-4 pt-3">
          <button
            onClick={() => setSheet("add")}
            className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 mb-3 transition-transform active:scale-[0.99]"
            style={{ background: "var(--bg-sunken)", border: "1px dashed var(--border)" }}
          >
            <span className="rounded-full flex items-center justify-center shrink-0" style={{ width: 34, height: 34, background: ACCENT }}>
              <Plus size={17} color="var(--on-accent)" strokeWidth={3} />
            </span>
            <span className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>New collection</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            {collections.map((c) => (
              <button key={c.id} onClick={() => openCollectionView(c)} className="text-left transition-transform active:scale-[0.98]">
                <div
                  className="aspect-square rounded-2xl overflow-hidden flex items-center justify-center mb-1.5"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  {c.previewUrl ? (
                    <MediaThumb
                      src={c.previewUrl}
                      cover={c.cover_url || c.previewCover}
                      isVideo={c.previewType !== "photo" && !c.cover_url}
                    />
                  ) : (
                    <Bookmark size={24} color="var(--toggle-off)" />
                  )}
                </div>
                <span className="text-[13px] truncate block" style={{ color: "var(--text)", fontWeight: 600 }}>{c.name}</span>
                <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {c.count} post{c.count === 1 ? "" : "s"}
                  {c.is_collaborative && (
                    <>
                      {" · "}
                      <Users size={10} />
                      {c.owner_id !== userId ? "shared" : "collab"}
                    </>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* selection action bar */}
      {selectMode && selected.length > 0 && (
        <div className="fixed left-0 right-0 bottom-0 px-4 py-3 z-40" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => setSheet("add")}
            className="w-full rounded-full h-11 text-sm transition-transform active:scale-95"
            style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700 }}
          >
            Add {selected.length} to a collection
          </button>
        </div>
      )}

      {sheet === "add" && (
        <AddToCollectionSheet
          postIds={selected}
          currentUserId={userId}
          onClose={() => setSheet(null)}
          onDone={() => {
            setSheet(null);
            setSelectMode(false);
            setSelected([]);
            loadCollections(userId);
            setTab("collections");
            say("Added to collection");
          }}
        />
      )}
    </div>
  );
}

// Reads a date out of whatever someone types into the chat search:
// 3/11/2026, 2026-11-03, "3 Nov", "November 3". Returns a local midnight.
function parseChatDate(input) {
  const t = (input || "").trim();
  if (!t || /^\d{1,2}$/.test(t)) return null;
  const now = new Date();
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  m = t.match(/^(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2,4}))?$/);
  if (m) {
    // Day first, the way dates are written in Bangladesh.
    let year = m[3] ? +m[3] : now.getFullYear();
    if (year < 100) year += 2000;
    return new Date(year, +m[2] - 1, +m[1]);
  }
  const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  m = t.toLowerCase().match(/^(\d{1,2})\s+([a-z]{3,})\.?\s*(\d{4})?$/) || null;
  let day, monName, yr;
  if (m) {
    day = +m[1];
    monName = m[2];
    yr = m[3];
  } else {
    const m2 = t.toLowerCase().match(/^([a-z]{3,})\.?\s+(\d{1,2})(?:,?\s*(\d{4}))?$/);
    if (!m2) return null;
    monName = m2[1];
    day = +m2[2];
    yr = m2[3];
  }
  const mi = MONTHS.findIndex((x) => monName.startsWith(x));
  if (mi < 0 || !day || day > 31) return null;
  return new Date(yr ? +yr : now.getFullYear(), mi, day);
}

// "Send this later": pick a time, and the message goes out on its own.
function ScheduleMessageSheet({ conversationId, currentUserId, presetText, onClose, onScheduled }) {
  const [text, setText] = useState(presetText || "");
  const [when, setWhen] = useState(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    d.setMinutes(0, 0, 0);
    return toLocalInputValue(d);
  });
  const [pending, setPending] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("scheduled_messages")
      .select("id, content, send_at")
      .eq("conversation_id", conversationId)
      .is("sent_at", null)
      .order("send_at", { ascending: true });
    setPending(data || []);
  };
  useEffect(() => {
    load();
  }, [conversationId]);

  const save = async () => {
    setError("");
    const body = text.trim();
    if (!body) {
      setError("Write the message first");
      return;
    }
    const at = when ? new Date(when) : null;
    if (!at || isNaN(at.getTime()) || at.getTime() < Date.now() + 60 * 1000) {
      setError("Pick a time at least a minute from now");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.from("scheduled_messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: body,
      send_at: at.toISOString(),
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setText("");
    onScheduled?.(at);
    load();
  };

  const cancel = async (id) => {
    setPending((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("scheduled_messages").delete().eq("id", id);
  };

  const quick = (label, d) => (
    <button
      key={label}
      onClick={() => setWhen(toLocalInputValue(d))}
      className="rounded-full px-3 h-8 text-xs shrink-0"
      style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 600, border: "1px solid var(--border)" }}
    >
      {label}
    </button>
  );
  const tomorrow9 = new Date();
  tomorrow9.setDate(tomorrow9.getDate() + 1);
  tomorrow9.setHours(9, 0, 0, 0);
  const tonight8 = new Date();
  tonight8.setHours(20, 0, 0, 0);
  if (tonight8.getTime() < Date.now()) tonight8.setDate(tonight8.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(9, 0, 0, 0);

  return (
    <StorySheetShell title="Send later" onClose={onClose}>
      <div className="px-4 pb-6">
        <p className="text-[12px] mb-2.5" style={{ color: "var(--text-muted)" }}>
          Write it now and Loop sends it at the time you pick — handy for a birthday wish at midnight.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Your message…"
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
        />
        <div className="flex gap-2 overflow-x-auto py-2.5" style={{ scrollbarWidth: "none" }}>
          {quick("Tonight 8pm", tonight8)}
          {quick("Tomorrow 9am", tomorrow9)}
          {quick("Next week", nextWeek)}
        </div>
        <input
          type="datetime-local"
          value={when}
          min={toLocalInputValue(new Date(Date.now() + 60 * 1000))}
          onChange={(e) => setWhen(e.target.value)}
          className="w-full rounded-xl px-3 h-11 text-sm outline-none"
          style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)", colorScheme: "dark light" }}
        />
        {error && <p className="text-xs mt-2" style={{ color: "var(--heart)" }}>{error}</p>}
        <button
          onClick={save}
          disabled={busy}
          className="w-full rounded-xl h-11 text-sm mt-3"
          style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Saving…" : "Schedule"}
        </button>

        {pending.length > 0 && (
          <>
            <p className="text-[13px] mt-5 mb-1.5" style={{ color: "var(--text)", fontWeight: 700 }}>Waiting to send</p>
            {pending.map((x) => (
              <div key={x.id} className="flex items-center gap-3 py-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <Clock size={15} color="var(--text-muted)" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] truncate" style={{ color: "var(--text)" }}>{x.content}</p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {new Date(x.send_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <button onClick={() => cancel(x.id)} className="text-xs shrink-0" style={{ color: "var(--heart)", fontWeight: 700 }}>
                  Cancel
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </StorySheetShell>
  );
}

function ChatScreen({ conversationId, isGroup, chatTitle, chatAvatarUrl, otherUser, currentUserId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [otherLastRead, setOtherLastRead] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [menuFor, setMenuFor] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [memberNames, setMemberNames] = useState({});
  const [imageUploading, setImageUploading] = useState(false);

  // new in v3
  const [reactions, setReactions] = useState({});        // messageId -> [{user_id, emoji}]
  const [pickerFor, setPickerFor] = useState(null);      // message id showing the emoji row
  const [replyTo, setReplyTo] = useState(null);          // message being replied to
  const [forwardMsg, setForwardMsg] = useState(null);
  const [groupSheet, setGroupSheet] = useState(false);
  const [title, setTitle] = useState(chatTitle);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [matchAt, setMatchAt] = useState(0); // which match is in view
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [chatToast, setChatToast] = useState("");
  const msgRefs = React.useRef({});
  const [emojiSheetFor, setEmojiSheetFor] = useState(null);
  const [sheet, setSheet] = useState(null); // customise | invite | nicknames
  const [convoMeta, setConvoMeta] = useState({ theme: "default", chat_font: "default", invite_code: null, avatar_url: null });
  const [nicknames, setNicknames] = useState({}); // userId -> nickname
  const [rel, setRel] = useState(null); // block/mute lists, loaded once
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [audioUploading, setAudioUploading] = useState(false);
  const [micError, setMicError] = useState("");

  const scrollRef = React.useRef(null);
  const channelRef = React.useRef(null);
  const typingTimeoutRef = React.useRef(null);
  const openedAtRef = React.useRef(0);
  const pressTimerRef = React.useRef(null);
  const recorderRef = React.useRef(null);
  const chunksRef = React.useRef([]);
  const recordTimerRef = React.useRef(null);
  const cancelRecordRef = React.useRef(false);
  const recordSecsRef = React.useRef(0);
  const inputRef = React.useRef(null);
  const messageIdsRef = React.useRef([]); // read by the realtime handler

  useEffect(() => {
    loadMessages();
    markRead();
    loadConvoMeta();
    loadMemberNames();
    getRelations().then(setRel);

    const channel = supabase.channel(`chat:${conversationId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => (prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new]));
          if (payload.new.sender_id !== currentUserId) markRead();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => prev.map((m) => (m.id === payload.new.id ? payload.new : m)));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "conversation_members", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          if (payload.new.user_id !== currentUserId) setOtherLastRead(payload.new.last_read_at);
        }
      )
      // Reactions live on their own table, which can't be filtered by
      // conversation — so we take everything RLS lets through and keep
      // only the rows belonging to messages in this chat.
      .on("postgres_changes", { event: "*", schema: "public", table: "message_reactions" }, () => {
        loadReactions(messageIdsRef.current);
      })
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (payload.userId === currentUserId) return;
        setTypingUsers((prev) => (prev.includes(payload.username) ? prev : [...prev, payload.username]));
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== payload.username));
        }, 3000);
      })
      .subscribe();

    channelRef.current = channel;
    loadOtherRead();

    return () => {
      supabase.removeChannel(channel);
      stopRecordTimer();
    };
  }, [conversationId]);

  useEffect(() => {
    if (searchOpen) return; // don't yank the view while searching
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typingUsers, searchOpen]);

  useEffect(() => {
    const ids = messages.map((m) => m.id);
    messageIdsRef.current = ids;
    if (ids.length > 0) loadReactions(ids);
  }, [messages.length]);

  const loadMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select(MSG_COLS)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    setMessages(data || []);
    setLoading(false);
  };

  // Takes plain ids so the realtime callback can pass a ref and never work
  // from a stale `messages` closure.
  const loadReactions = async (ids) => {
    if (!ids || ids.length === 0) return;
    const { data } = await supabase
      .from("message_reactions")
      .select("message_id, user_id, emoji")
      .in("message_id", ids);
    const map = {};
    (data || []).forEach((r) => {
      if (!map[r.message_id]) map[r.message_id] = [];
      map[r.message_id].push(r);
    });
    setReactions(map);
  };

  const loadConvoMeta = async () => {
    const { data } = await supabase
      .from("conversations")
      .select("theme, chat_font, invite_code, avatar_url, title")
      .eq("id", conversationId)
      .maybeSingle();
    if (data) {
      setConvoMeta(data);
      if (isGroup && data.title) setTitle(data.title);
    }
  };

  // Names and nicknames both come from here — nicknames win wherever a
  // person is shown inside this chat.
  const loadMemberNames = async () => {
    const { data: members } = await supabase
      .from("conversation_members")
      .select("user_id, nickname")
      .eq("conversation_id", conversationId);
    const ids = (members || []).map((m) => m.user_id);
    if (ids.length === 0) return;
    const { data: profiles } = await supabase.from("profiles").select("id, username").in("id", ids);
    const map = {};
    (profiles || []).forEach((pr) => (map[pr.id] = pr.username));
    setMemberNames(map);
    const nick = {};
    (members || []).forEach((m) => {
      if (m.nickname) nick[m.user_id] = m.nickname;
    });
    setNicknames(nick);
  };

  const loadOtherRead = async () => {
    if (isGroup) return;
    const { data } = await supabase
      .from("conversation_members")
      .select("user_id, last_read_at")
      .eq("conversation_id", conversationId)
      .neq("user_id", currentUserId)
      .limit(1);
    if (data && data[0]) setOtherLastRead(data[0].last_read_at);
  };

  const markRead = async () => {
    if (!currentUserId) return;
    await supabase
      .from("conversation_members")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("user_id", currentUserId);
  };

  const broadcastTyping = () => {
    if (!channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { userId: currentUserId, username: "Someone" },
    });
  };

  const onChangeText = (v) => {
    setText(v);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    broadcastTyping();
    typingTimeoutRef.current = setTimeout(() => {}, 1500);
  };

  const afterSend = async (contentForSummary) => {
    await supabase
      .from("conversations")
      .update({ last_message: contentForSummary, last_message_at: new Date().toISOString() })
      .eq("id", conversationId);

    if (!isGroup && otherUser?.id && otherUser.id !== currentUserId) {
      await supabase.from("notifications").insert({ user_id: otherUser.id, actor_id: currentUserId, type: "message" });
    }
  };

  const insertMessage = async (payload, summary) => {
    const { data: inserted, error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: currentUserId, reply_to_id: replyTo?.id || null, ...payload })
      .select(MSG_COLS)
      .single();
    if (error) throw error;
    setMessages((prev) => (prev.some((m) => m.id === inserted.id) ? prev : [...prev, inserted]));
    setReplyTo(null);
    afterSend(summary);
    return inserted;
  };

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || !currentUserId || sending) return;
    setSending(true);
    setText("");
    try {
      await insertMessage({ content: trimmed }, trimmed);
    } catch (e) {
      setText(trimmed);
      alert(e.message);
    }
    setSending(false);
  };

  const sendImage = async (file) => {
    if (!file || !currentUserId) return;
    setImageUploading(true);
    const path = `${currentUserId}/${conversationId}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("messages").upload(path, file);
    if (upErr) {
      setImageUploading(false);
      alert(upErr.message);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("messages").getPublicUrl(path);
    try {
      await insertMessage({ image_url: publicUrl }, "📷 Photo");
    } catch (e) {
      alert(e.message);
    }
    setImageUploading(false);
  };

  // ---- voice messages ----
  // Chrome/Android records webm/opus. Safari only offers mp4/aac, so we
  // probe instead of hard-coding, and store the extension the browser
  // actually gave us. (iOS still needs its own pass later.)
  const pickAudioMime = () => {
    if (typeof MediaRecorder === "undefined") return null;
    const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus", "audio/ogg"];
    for (const c of candidates) {
      try {
        if (MediaRecorder.isTypeSupported(c)) return c;
      } catch {}
    }
    return "";
  };

  const stopRecordTimer = () => {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    recordTimerRef.current = null;
  };

  const startRecording = async () => {
    setMicError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMicError("This browser can't record audio");
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicError("Microphone permission denied");
      return;
    }
    const mime = pickAudioMime();
    let recorder;
    try {
      recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    } catch {
      recorder = new MediaRecorder(stream);
    }

    chunksRef.current = [];
    cancelRecordRef.current = false;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      stopRecordTimer();
      const secs = recordSecsRef.current;
      setRecording(false);
      setRecordSecs(0);
      if (cancelRecordRef.current || chunksRef.current.length === 0 || secs < 1) return;
      const type = recorder.mimeType || mime || "audio/webm";
      const blob = new Blob(chunksRef.current, { type });
      await uploadVoice(blob, type, secs);
    };

    recorderRef.current = recorder;
    recorder.start();
    setRecording(true);
    setRecordSecs(0);
    recordSecsRef.current = 0;
    recordTimerRef.current = setInterval(() => {
      recordSecsRef.current += 1;
      setRecordSecs(recordSecsRef.current);
      if (recordSecsRef.current >= 120) stopRecording(); // hard cap at 2 minutes
    }, 1000);
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
  };

  const cancelRecording = () => {
    cancelRecordRef.current = true;
    stopRecording();
  };

  const uploadVoice = async (blob, type, secs) => {
    setAudioUploading(true);
    const ext = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm";
    const path = `${currentUserId}/${conversationId}/${Date.now()}-voice.${ext}`;
    const { error: upErr } = await supabase.storage.from("messages").upload(path, blob, { contentType: type });
    if (upErr) {
      setAudioUploading(false);
      setMicError(upErr.message);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("messages").getPublicUrl(path);
    try {
      await insertMessage({ audio_url: publicUrl, audio_duration: secs }, "🎤 Voice message");
    } catch (e) {
      setMicError(e.message);
    }
    setAudioUploading(false);
  };

  // ---- reactions ----
  const react = async (m, emoji) => {
    setPickerFor(null);
    setMenuFor(null);
    const mine = (reactions[m.id] || []).find((r) => r.user_id === currentUserId);
    if (mine && mine.emoji === emoji) {
      setReactions((prev) => ({
        ...prev,
        [m.id]: (prev[m.id] || []).filter((r) => r.user_id !== currentUserId),
      }));
      await supabase.from("message_reactions").delete().eq("message_id", m.id).eq("user_id", currentUserId);
      return;
    }
    setReactions((prev) => ({
      ...prev,
      [m.id]: [...(prev[m.id] || []).filter((r) => r.user_id !== currentUserId), { message_id: m.id, user_id: currentUserId, emoji }],
    }));
    await supabase
      .from("message_reactions")
      .upsert({ message_id: m.id, user_id: currentUserId, emoji }, { onConflict: "message_id,user_id" });
  };

  const deleteMessage = async (m) => {
    setMenuFor(null);
    if (!window.confirm("Delete this message?")) return;
    setMessages((prev) =>
      prev.map((x) => (x.id === m.id ? { ...x, deleted: true, content: null, image_url: null, audio_url: null } : x))
    );
    await supabase
      .from("messages")
      .update({ deleted: true, content: null, image_url: null, audio_url: null })
      .eq("id", m.id);
  };

  const startEdit = (m) => {
    setMenuFor(null);
    setEditingId(m.id);
    setEditText(m.content || "");
  };

  const saveEdit = async (m) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, content: trimmed, edited_at: new Date().toISOString() } : x)));
    setEditingId(null);
    await supabase.from("messages").update({ content: trimmed, edited_at: new Date().toISOString() }).eq("id", m.id);
  };

  const copyMessage = (m) => {
    setMenuFor(null);
    navigator.clipboard?.writeText(m.content || "").catch(() => {});
  };

  const startReply = (m) => {
    setMenuFor(null);
    setReplyTo(m);
    inputRef.current?.focus();
  };

  const previewOf = (m) => {
    if (!m) return "";
    if (m.deleted) return "Deleted message";
    if (m.content) return m.content;
    if (m.audio_url) return "🎤 Voice message";
    if (m.image_url) return "📷 Photo";
    return "";
  };

  const nameOf = (userId) => {
    if (nicknames[userId]) return nicknames[userId];
    if (userId === currentUserId) return "You";
    return isGroup ? memberNames[userId] || "unknown" : title;
  };

  const chatTheme = themeOf(convoMeta.theme);
  const chatFont = fontOf(convoMeta.chat_font);

  const myLastMessage = [...messages].reverse().find((m) => m.sender_id === currentUserId && !m.deleted);
  const seen = !isGroup && myLastMessage && otherLastRead && new Date(otherLastRead) >= new Date(myLastMessage.created_at);

  const q = searchQuery.trim().toLowerCase();
  const blockedHere =
    !isGroup && rel && otherUser?.id ? isBlockedEither(rel, otherUser.id) : false;
  const afterBlocks = rel ? messages.filter((m) => !isBlockedEither(rel, m.sender_id)) : messages;
  // Searching keeps every message on screen and moves you between the hits,
  // so you can always read what came before and after.
  const visibleMessages = afterBlocks;
  const searchDate = searchOpen ? parseChatDate(searchQuery) : null;
  const matches = !q
    ? []
    : searchDate
    ? (() => {
        const start = searchDate.getTime();
        const end = start + 24 * 3600 * 1000;
        const sameDay = afterBlocks.filter((m) => {
          const t = new Date(m.created_at).getTime();
          return t >= start && t < end;
        });
        if (sameDay.length) return [sameDay[0]];
        // Nothing that day — go to the first message after it.
        const after = afterBlocks.find((m) => new Date(m.created_at).getTime() >= start);
        return after ? [after] : [];
      })()
    : afterBlocks.filter((m) => !m.deleted && (m.content || "").toLowerCase().includes(q));
  const currentMatch = matches.length ? matches[Math.min(matchAt, matches.length - 1)] : null;

  useEffect(() => {
    setMatchAt(0);
  }, [searchQuery]);

  useEffect(() => {
    if (!currentMatch) return;
    const el = msgRefs.current[currentMatch.id];
    if (el && el.scrollIntoView) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [currentMatch?.id]);

  const stepMatch = (dir) => {
    if (matches.length === 0) return;
    setMatchAt((i) => (i + dir + matches.length) % matches.length);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--bg)", fontFamily: chatFont.stack }}>
      {/* header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90">
          <ChevronLeft size={24} color="var(--text)" />
        </button>
        <button
          onClick={() => isGroup && setGroupSheet(true)}
          disabled={!isGroup}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
        >
          {isGroup ? (
            convoMeta.avatar_url ? (
              <img src={convoMeta.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--border)" }}>
                <Users size={16} color="var(--text)" />
              </div>
            )
          ) : (
            <Avatar username={title} avatarUrl={chatAvatarUrl} size={32} />
          )}
          <span className="text-sm truncate" style={{ color: "var(--text)", fontWeight: 700 }}>
            {!isGroup && nicknames[otherUser?.id] ? nicknames[otherUser.id] : title}
          </span>
        </button>
        <button
          onClick={() => setScheduleOpen(true)}
          className="p-1 shrink-0 transition-transform active:scale-90"
          aria-label="Send later"
        >
          <Clock size={19} color="var(--text)" />
        </button>
        <button
          onClick={() => {
            setSearchOpen((v) => !v);
            setSearchQuery("");
          }}
          className="p-1 shrink-0 transition-transform active:scale-90"
        >
          <Search size={19} color={searchOpen ? "var(--accent-solid)" : "var(--text)"} />
        </button>
        <button onClick={() => setSheet("options")} className="p-1 -mr-1 shrink-0 transition-transform active:scale-90">
          <Ellipsis size={19} color="var(--text)" />
        </button>
      </div>

      {searchOpen && (
        <div className="px-3 py-2.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-2.5 rounded-full px-4 h-10" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
            <Search size={15} color="var(--text-muted)" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this chat"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--text)" }}
              autoFocus
            />
            {searchQuery && (
              <span className="text-[11px] shrink-0 tabular-nums" style={{ color: "var(--text-muted)" }}>
                {matches.length === 0 ? "0" : `${Math.min(matchAt, matches.length - 1) + 1}/${matches.length}`}
              </span>
            )}
            <button
              onClick={() => stepMatch(-1)}
              disabled={matches.length === 0}
              aria-label="Previous match"
              className="shrink-0 p-0.5 transition-transform active:scale-90"
              style={{ opacity: matches.length === 0 ? 0.35 : 1 }}
            >
              <ChevronLeft size={18} color="var(--text)" style={{ transform: "rotate(90deg)" }} />
            </button>
            <button
              onClick={() => stepMatch(1)}
              disabled={matches.length === 0}
              aria-label="Next match"
              className="shrink-0 p-0.5 transition-transform active:scale-90"
              style={{ opacity: matches.length === 0 ? 0.35 : 1 }}
            >
              <ChevronLeft size={18} color="var(--text)" style={{ transform: "rotate(-90deg)" }} />
            </button>
          </div>
          <p className="text-[11px] mt-1.5 px-1" style={{ color: "var(--text-muted)" }}>
            {searchDate
              ? `Jumping to ${searchDate.toLocaleDateString(undefined, { dateStyle: "medium" })}`
              : "Type a word, or a date like 3/11/2026 to jump to that day."}
          </p>
        </div>
      )}

      {/* messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-3"
        style={chatAreaStyle(chatTheme)}
        onClick={() => {
          setMenuFor(null);
          setPickerFor(null);
        }}
      >
        {loading ? (
          <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : visibleMessages.length === 0 ? (
          <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>No messages yet — say hi 👋</p>
        ) : (
          visibleMessages.map((m, idx) => {
            const mine = m.sender_id === currentUserId;
            const isLast = myLastMessage && m.id === myLastMessage.id;
            const parent = m.reply_to_id ? messages.find((x) => x.id === m.reply_to_id) : null;
            const rx = reactions[m.id] || [];
            const myRx = rx.find((r) => r.user_id === currentUserId);
            // No room above for the first couple of bubbles — the row would
            // be clipped by the scroll container, so it opens downward.
            const flipDown = idx < 2;

            if (editingId === m.id) {
              return (
                <div key={m.id} className="flex justify-end mb-2">
                  <div className="max-w-[80%] w-full">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl px-3 py-2 text-sm outline-none resize-none"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                    />
                    <div className="flex justify-end gap-3 mt-1">
                      <button onClick={() => setEditingId(null)} className="text-[11px]" style={{ color: "var(--text-muted)" }}>Cancel</button>
                      <button onClick={() => saveEdit(m)} className="text-[11px]" style={{ color: "var(--accent-start)", fontWeight: 700 }}>Save</button>
                    </div>
                  </div>
                </div>
              );
            }

            const isCurrentMatch = currentMatch && currentMatch.id === m.id;
            const isMatch = q && matches.some((x) => x.id === m.id);
            return (
              <div
                key={m.id}
                ref={(el) => {
                  if (el) msgRefs.current[m.id] = el;
                  else delete msgRefs.current[m.id];
                }}
                className={`flex flex-col mb-2 ${mine ? "items-end" : "items-start"}`}
                style={
                  isCurrentMatch
                    ? { background: "rgba(255, 213, 79, 0.22)", borderRadius: 14, padding: 4, margin: "-4px -4px 4px" }
                    : isMatch
                    ? { background: "rgba(255, 213, 79, 0.10)", borderRadius: 14, padding: 4, margin: "-4px -4px 4px" }
                    : undefined
                }
              >
                {isGroup && !mine && (
                  <span className="text-[10px] mb-0.5 ml-1" style={{ color: "var(--text-muted)" }}>
                    {nicknames[m.sender_id] || memberNames[m.sender_id] || "unknown"}
                  </span>
                )}

                {m.forwarded && !m.deleted && (
                  <span className="flex items-center gap-1 text-[10px] mb-0.5 mx-1" style={{ color: "var(--text-muted)" }}>
                    <Forward size={10} /> Forwarded
                  </span>
                )}

                <div
                  onTouchStart={() => {
                    if (m.deleted) return;
                    pressTimerRef.current = setTimeout(() => {
                      openedAtRef.current = Date.now();
                      setMenuFor(m.id);
                      setPickerFor(m.id);
                    }, 450);
                  }}
                  onTouchEnd={() => clearTimeout(pressTimerRef.current)}
                  onTouchMove={() => clearTimeout(pressTimerRef.current)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (m.deleted) return;
                    openedAtRef.current = Date.now();
                    setMenuFor(m.id);
                    setPickerFor(m.id);
                  }}
                  className="relative max-w-[78%]"
                >
                  {/* quoted parent */}
                  {parent && !m.deleted && (
                    <div
                      className="px-3 py-1.5 mb-0.5"
                      style={{
                        background: "var(--bg-sunken)",
                        borderLeft: "3px solid var(--accent-solid)",
                        borderRadius: "12px 12px 4px 4px",
                        opacity: 0.95,
                      }}
                    >
                      <span className="text-[10px] block" style={{ color: "var(--accent-solid)", fontWeight: 700 }}>
                        {nameOf(parent.sender_id)}
                      </span>
                      <span className="text-[11px] block truncate" style={{ color: "var(--text-muted)", maxWidth: 200 }}>
                        {previewOf(parent)}
                      </span>
                    </div>
                  )}

                  {m.deleted ? (
                    <div
                      className="px-3.5 py-2 text-sm italic"
                      style={{ background: "var(--surface)", color: "var(--text-muted)", borderRadius: 14, border: "1px solid var(--border)" }}
                    >
                      This message was deleted
                    </div>
                  ) : m.audio_url ? (
                    <AudioBubble src={m.audio_url} duration={m.audio_duration} mine={mine} />
                  ) : (
                    <>
                      {m.image_url && (
                        <img
                          src={m.image_url}
                          alt=""
                          className="rounded-2xl max-w-full"
                          style={{ maxHeight: 260, border: mine ? "none" : "1px solid var(--border)", display: "block" }}
                        />
                      )}
                      {m.content && (
                        <div
                          className="px-3.5 py-2 text-sm"
                          style={{
                            background: mine ? chatTheme.bubble : "var(--surface)",
                            color: mine ? chatTheme.on : "var(--text)",
                            borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            marginTop: m.image_url ? 4 : 0,
                          }}
                        >
                          {m.content}
                        </div>
                      )}
                    </>
                  )}

                  {/* emoji row + action menu */}
                  {menuFor === m.id && !m.deleted && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (Date.now() - openedAtRef.current < 400) return;
                          setMenuFor(null);
                          setPickerFor(null);
                        }}
                      />
                      {pickerFor === m.id && (
                        <div
                          className={`absolute z-50 flex items-center gap-0.5 px-2 py-1.5 rounded-full ${mine ? "right-0" : "left-0"}`}
                          style={{
                            background: "var(--surface-raised)",
                            border: "1px solid var(--border)",
                            ...(flipDown
                              ? { top: "100%", marginTop: 6 }
                              : { bottom: "100%", marginBottom: 6 }),
                            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                          }}
                        >
                          {REACTION_EMOJIS.map((e) => (
                            <button
                              key={e}
                              onClick={(ev) => {
                                ev.stopPropagation();
                                react(m, e);
                              }}
                              className="text-lg leading-none px-1 transition-transform active:scale-125"
                              style={{ opacity: myRx?.emoji === e ? 1 : 0.85 }}
                            >
                              {e}
                            </button>
                          ))}
                          <button
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setEmojiSheetFor(m);
                            }}
                            className="ml-0.5 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-110"
                            style={{ width: 26, height: 26, background: "var(--bg-sunken)", border: "1px solid var(--border)" }}
                          >
                            <Plus size={14} color="var(--text)" strokeWidth={2.5} />
                          </button>
                        </div>
                      )}
                      <div
                        className={`absolute z-50 rounded-xl overflow-hidden py-1 ${mine ? "right-0" : "left-0"}`}
                        style={{
                          background: "var(--surface-raised)",
                          border: "1px solid var(--border)",
                          minWidth: 150,
                          top: "100%",
                          marginTop: flipDown && pickerFor === m.id ? 52 : 4,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                        }}
                      >
                        <button onClick={() => startReply(m)} className="w-full flex items-center gap-2 px-4 py-2 text-xs" style={{ color: "var(--text)" }}>
                          <CornerUpLeft size={13} /> Reply
                        </button>
                        <button
                          onClick={() => {
                            setMenuFor(null);
                            setForwardMsg(m);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs"
                          style={{ color: "var(--text)" }}
                        >
                          <Forward size={13} /> Forward
                        </button>
                        {m.content && (
                          <button onClick={() => copyMessage(m)} className="w-full flex items-center gap-2 px-4 py-2 text-xs" style={{ color: "var(--text)" }}>
                            <Copy size={13} /> Copy
                          </button>
                        )}
                        {mine && m.content && (
                          <button onClick={() => startEdit(m)} className="w-full flex items-center gap-2 px-4 py-2 text-xs" style={{ color: "var(--text)" }}>
                            <Pencil size={13} /> Edit
                          </button>
                        )}
                        {mine && (
                          <button onClick={() => deleteMessage(m)} className="w-full flex items-center gap-2 px-4 py-2 text-xs" style={{ color: "var(--heart)" }}>
                            <Trash2 size={13} /> Delete
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* reaction chips */}
                {rx.length > 0 && !m.deleted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuFor(m.id);
                      setPickerFor(m.id);
                      openedAtRef.current = Date.now();
                    }}
                    className="flex items-center gap-0.5 px-2 py-0.5 rounded-full mx-1"
                    style={{
                      background: "var(--surface-raised)",
                      border: "1px solid var(--border)",
                      marginTop: -8,
                      position: "relative",
                      zIndex: 20,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                    }}
                  >
                    {[...new Set(rx.map((r) => r.emoji))].slice(0, 3).map((e) => (
                      <span key={e} className="text-[12px] leading-none">{e}</span>
                    ))}
                    {rx.length > 1 && (
                      <span className="text-[10px] ml-0.5" style={{ color: "var(--text-muted)" }}>{rx.length}</span>
                    )}
                  </button>
                )}

                {!m.deleted && (
                  <span className="text-[9px] mt-0.5 mx-1" style={{ color: "var(--text-muted)" }}>
                    {timeShort(m.created_at)}
                    {m.edited_at ? " · edited" : ""}
                    {mine && isLast && seen ? " · Seen" : ""}
                  </span>
                )}
              </div>
            );
          })
        )}

        {typingUsers.length > 0 && !q && (
          <div className="flex items-center gap-1 ml-1 mb-1">
            <div className="px-3 py-2 rounded-2xl" style={{ background: "var(--surface)" }}>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {isGroup ? `${typingUsers.join(", ")} typing...` : "typing..."}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* reply preview */}
      {replyTo && (
        <div
          className="flex items-center gap-2.5 px-3.5 py-2"
          style={{ background: "var(--bg-sunken)", borderTop: "1px solid var(--border-subtle)" }}
        >
          <div style={{ width: 3, alignSelf: "stretch", background: "var(--accent-solid)", borderRadius: 2 }} />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] block" style={{ color: "var(--accent-solid)", fontWeight: 700 }}>
              Replying to {nameOf(replyTo.sender_id)}
            </span>
            <span className="text-[11px] block truncate" style={{ color: "var(--text-muted)" }}>{previewOf(replyTo)}</span>
          </div>
          <button onClick={() => setReplyTo(null)} className="p-1 shrink-0"><X size={16} color="var(--text-muted)" /></button>
        </div>
      )}

      {micError && (
        <p className="text-[11px] px-4 py-1.5" style={{ color: "var(--heart)", background: "var(--bg-sunken)" }}>{micError}</p>
      )}

      {/* composer */}
      {blockedHere ? (
        <div className="px-4 py-4 text-center" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {rel.blocked.has(otherUser.id)
              ? "You blocked this account. Unblock them from their profile to message again."
              : "You can't message this account."}
          </p>
        </div>
      ) : (
      <div className="flex items-end gap-2 px-3 py-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        {recording ? (
          <div className="flex-1 flex items-center gap-3 rounded-2xl px-4 h-11" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>
            <span className="rounded-full animate-pulse" style={{ width: 9, height: 9, background: "var(--heart)" }} />
            <span className="text-sm tabular-nums" style={{ color: "var(--text)", fontWeight: 600 }}>{secsToClock(recordSecs)}</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Recording...</span>
            <div className="flex-1" />
            <button onClick={cancelRecording} className="text-xs" style={{ color: "var(--text-muted)" }}>Cancel</button>
          </div>
        ) : (
          <>
            <label className="pb-2 cursor-pointer shrink-0">
              {imageUploading ? (
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>...</span>
              ) : (
                <ImagePlus size={22} color="var(--text-muted)" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) sendImage(e.target.files[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => onChangeText(e.target.value)}
              placeholder={replyTo ? "Write a reply..." : "Message..."}
              rows={1}
              className="flex-1 rounded-2xl px-3.5 py-2.5 text-sm outline-none resize-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", maxHeight: 110 }}
            />
          </>
        )}

        {recording ? (
          <button
            onClick={stopRecording}
            className="rounded-full w-10 h-10 flex items-center justify-center shrink-0 transition-transform active:scale-90"
            style={{ background: ACCENT }}
          >
            <SendHorizontal size={18} color="var(--on-accent)" />
          </button>
        ) : text.trim() ? (
          <button
            onClick={send}
            disabled={sending}
            className="rounded-full w-10 h-10 flex items-center justify-center shrink-0 transition-transform active:scale-90"
            style={{ background: ACCENT }}
          >
            <SendHorizontal size={18} color="var(--on-accent)" />
          </button>
        ) : (
          <button
            onClick={startRecording}
            disabled={audioUploading}
            className="rounded-full w-10 h-10 flex items-center justify-center shrink-0 transition-transform active:scale-90"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", opacity: audioUploading ? 0.5 : 1 }}
          >
            <Mic size={18} color="var(--text-muted)" />
          </button>
        )}
      </div>
      )}

      {scheduleOpen && (
        <ScheduleMessageSheet
          conversationId={conversationId}
          currentUserId={currentUserId}
          presetText={text}
          onClose={() => setScheduleOpen(false)}
          onScheduled={(at) => {
            setText("");
            setChatToast(`Will send ${at.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}`);
            setTimeout(() => setChatToast(""), 2600);
          }}
        />
      )}
      {chatToast && (
        <div
          className="absolute left-1/2 bottom-24 -translate-x-1/2 z-[80] rounded-full px-4 py-2.5 text-xs"
          style={{ background: "var(--text)", color: "var(--bg)", fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}
        >
          {chatToast}
        </div>
      )}

      {emojiSheetFor && (
        <EmojiPickerSheet
          onPick={(e) => {
            react(emojiSheetFor, e);
            setEmojiSheetFor(null);
          }}
          onClose={() => setEmojiSheetFor(null)}
        />
      )}

      {forwardMsg && (
        <ForwardSheet
          message={forwardMsg}
          currentUserId={currentUserId}
          onClose={() => setForwardMsg(null)}
        />
      )}

      {sheet === "options" && (
        <StorySheetShell title="Chat options" onClose={() => setSheet(null)}>
          <div className="pb-6">
            <StoryMenuRow
              icon={<Sparkles size={17} color="var(--text)" />}
              label="Customise chat"
              onClick={() => setSheet("customise")}
            />
            <StoryMenuRow
              icon={<Pencil size={17} color="var(--text)" />}
              label="Nicknames"
              onClick={() => setSheet("nicknames")}
            />
            {isGroup && (
              <>
                <StoryMenuRow
                  icon={<Users size={17} color="var(--text)" />}
                  label="Group info"
                  onClick={() => {
                    setSheet(null);
                    setGroupSheet(true);
                  }}
                />
                <StoryMenuRow
                  icon={<Share2 size={17} color="var(--text)" />}
                  label="Invite link"
                  onClick={() => setSheet("invite")}
                />
              </>
            )}
          </div>
        </StorySheetShell>
      )}

      {sheet === "customise" && (
        <CustomiseSheet
          conversationId={conversationId}
          theme={convoMeta.theme}
          font={convoMeta.chat_font}
          onClose={() => setSheet(null)}
          onApplied={(t, f) => {
            setConvoMeta((prev) => ({ ...prev, theme: t, chat_font: f }));
            setSheet(null);
          }}
        />
      )}

      {sheet === "nicknames" && (
        <NicknamesSheet
          conversationId={conversationId}
          currentUserId={currentUserId}
          onClose={() => setSheet(null)}
          onSaved={loadMemberNames}
        />
      )}

      {sheet === "invite" && (
        <InviteSheet
          conversationId={conversationId}
          code={convoMeta.invite_code}
          title={title}
          currentUserId={currentUserId}
          onClose={() => setSheet(null)}
          onReset={(code) => setConvoMeta((prev) => ({ ...prev, invite_code: code }))}
        />
      )}

      {groupSheet && (
        <GroupManageSheet
          conversationId={conversationId}
          title={title}
          avatarUrl={convoMeta.avatar_url}
          currentUserId={currentUserId}
          onClose={() => setGroupSheet(false)}
          onRenamed={(t) => {
            setTitle(t);
            setGroupSheet(false);
          }}
          onPhotoChanged={(url) => setConvoMeta((prev) => ({ ...prev, avatar_url: url }))}
          onOpenInvite={() => {
            setGroupSheet(false);
            setSheet("invite");
          }}
          onLeft={() => {
            setGroupSheet(false);
            onBack();
          }}
        />
      )}
    </div>
  );
}

const mockNotifications = [
  { id: 1, user: "nilufar.k", action: "liked your post", time: "5m", icon: Heart, color: "var(--accent-start)" },
  { id: 2, user: "rafiq.tech", action: "started following you", time: "22m", icon: CircleUserRound, color: "var(--text-muted)" },
  { id: 3, user: "meherun.a", action: "commented on your Reel", time: "1h", icon: MessageCircle, color: "var(--text-muted)" },
  { id: 4, user: "tanvir.v", action: "reposted your post", time: "3h", icon: Repeat2, color: "var(--accent-end)" },
];

function NotificationsScreen({ onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: notifData } = await supabase
      .from("notifications")
      .select("id, type, actor_id, created_at, post_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!notifData || notifData.length === 0) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const actorIds = [...new Set(notifData.map((n) => n.actor_id))];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", actorIds);

    // Where a collab invite stands now (pending / accepted / declined).
    const collabPostIds = notifData.filter((n) => n.type === "collab" && n.post_id).map((n) => n.post_id);
    let collabStatus = {};
    if (collabPostIds.length) {
      const { data: cs } = await supabase
        .from("post_collaborators")
        .select("post_id, status")
        .eq("user_id", user.id)
        .in("post_id", collabPostIds);
      collabStatus = Object.fromEntries((cs || []).map((c) => [c.post_id, c.status]));
    }

    const merged = notifData.map((n) => ({
      ...n,
      username: (profilesData || []).find((p) => p.id === n.actor_id)?.username || "unknown",
      avatarUrl: (profilesData || []).find((p) => p.id === n.actor_id)?.avatar_url || null,
      collabStatus: n.type === "collab" ? collabStatus[n.post_id] || "gone" : null,
    }));

    const rel = await getRelations();
    setNotifications(merged.filter((n) => !isBlockedEither(rel, n.actor_id)));
    setLoading(false);
  };

  const answerCollab = async (n, status) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, collabStatus: status } : x)));
    const { error } = await supabase.from("post_collaborators").update({ status }).eq("post_id", n.post_id).eq("user_id", user?.id ?? "");
    if (error) {
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, collabStatus: "pending" } : x)));
      alert(error.message);
    }
  };

  const actionText = (type) =>
    type === "collab"
      ? "invited you to collaborate on a post"
      : type === "like"
      ? "liked your post"
      : type === "follow"
      ? "started following you"
      : type === "comment"
      ? "commented on your post"
      : type === "mention"
      ? "mentioned you in a comment"
      : type === "tag"
      ? "tagged you in a post"
      : type === "message"
      ? "sent you a message"
      : type === "collection"
      ? "added a post to your shared collection"
      : "";

  const iconFor = (type) =>
    type === "collab"
      ? Users
      : type === "like"
      ? Heart
      : type === "comment" || type === "mention"
      ? MessageCircle
      : type === "tag"
      ? UserPlus
      : type === "message"
      ? SendHorizontal
      : type === "collection"
      ? Bookmark
      : CircleUserRound;
  const colorFor = (type) => (type === "like" ? "var(--accent-start)" : "var(--text-muted)");

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--bg)" }}>
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 pt-4 pb-3"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90"><ChevronLeft size={24} color="var(--text)" /></button>
        <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>
          Notifications
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-center text-xs py-8" style={{ color: "var(--text-muted)" }}>
            Loading...
          </p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-xs py-8" style={{ color: "var(--text-muted)" }}>
            No notifications yet
          </p>
        ) : (
          notifications.map((n) => {
            const Icon = iconFor(n.type);
            return (
              <div key={n.id} className="flex items-center gap-3 px-4 py-2.5">
                <Avatar username={n.username} avatarUrl={n.avatarUrl} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: "var(--text)" }}>
                    <span style={{ fontWeight: 600 }}>{n.username}</span> {actionText(n.type)}
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}> · {timeAgo(n.created_at)}</span>
                  </p>
                  {n.type === "collab" && (
                    n.collabStatus === "pending" ? (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => answerCollab(n, "accepted")} className="rounded-lg px-4 h-8 text-xs" style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700 }}>
                          Accept
                        </button>
                        <button onClick={() => answerCollab(n, "declined")} className="rounded-lg px-4 h-8 text-xs" style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 700, border: "1px solid var(--border)" }}>
                          Decline
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {n.collabStatus === "accepted" ? "You're a collaborator — it's on your profile" : n.collabStatus === "declined" ? "Declined" : "This invite is no longer available"}
                      </p>
                    )
                  )}
                </div>
                <Icon size={17} color={colorFor(n.type)} className="shrink-0" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


const reportReasons = [
  "Spam",
  "Nudity or sexual content",
  "Hate speech or symbols",
  "False information",
  "Bullying or harassment",
  "Violence",
  "Something else",
];

function ReportScreen({ postId, onBack }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReport = async (reason) => {
    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: reportedPost } = await supabase.from("posts").select("user_id").eq("id", postId).maybeSingle();
      await supabase.from("reports").insert({
        post_id: postId,
        reported_user_id: reportedPost?.user_id ?? null,
        reporter_id: user.id,
        reason,
      });
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
          style={{ background: ACCENT }}
        >
          <Ellipsis size={22} color="var(--on-accent)" />
        </div>
        <p className="text-sm mb-1" style={{ color: "var(--text)", fontWeight: 600 }}>
          Reported
        </p>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
          Thanks for letting us know. We'll review it.
        </p>
        <button onClick={onBack} style={{ color: "var(--accent-start)", fontWeight: 600 }} className="text-sm">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--bg)" }}>
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 pt-4 pb-3"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90"><ChevronLeft size={24} color="var(--text)" /></button>
        <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>
          Report
        </h1>
      </div>
      <p className="text-xs px-4 pt-4 pb-2" style={{ color: "var(--text-muted)" }}>
        Why are you reporting this post?
      </p>
      <div className="flex-1 overflow-y-auto">
        {reportReasons.map((reason) => (
          <button
            key={reason}
            onClick={() => handleReport(reason)}
            disabled={submitting}
            className="w-full text-left px-4 py-3.5 text-sm"
            style={{ color: "var(--text)", borderBottom: "1px solid var(--border-subtle)", opacity: submitting ? 0.6 : 1 }}
          >
            {reason}
          </button>
        ))}
      </div>
    </div>
  );
}

function CommentsScreen({ postId, postOwnerId, onBack }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [myUsername, setMyUsername] = useState("");

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    if (user) {
      const { data: myProfile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      setMyUsername(myProfile?.username || "");
    }

    const { data: commentsData } = await supabase
      .from("comments")
      .select("id, content, created_at, user_id")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    const { data: profilesData } = await supabase.from("profiles").select("id, username, avatar_url");
    const hidden = await hiddenCommenterSet(postOwnerId);

    const merged = (commentsData || [])
      .filter((c) => !hidden.has(c.user_id))
      .map((c) => {
        const pr = (profilesData || []).find((p) => p.id === c.user_id);
        return { ...c, username: pr?.username || "unknown", avatarUrl: pr?.avatar_url || null };
      });

    setComments(merged);
    setLoading(false);
  };

  const handlePost = async () => {
    const trimmed = newComment.trim();
    if (!trimmed || !userId) return;

    setPosting(true);
    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: userId, content: trimmed })
      .select("id, content, created_at, user_id")
      .single();
    setPosting(false);

    if (!error && data) {
      setComments((prev) => [...prev, { ...data, username: myUsername || "unknown" }]);
      setNewComment("");
      if (postOwnerId && postOwnerId !== userId) {
        await supabase.from("notifications").insert({
          user_id: postOwnerId,
          actor_id: userId,
          type: "comment",
          post_id: postId,
        });
      }
    }
  };

  const deleteComment = async (comment) => {
    if (comment.user_id !== userId) return;
    if (!window.confirm("Delete this comment?")) return;
    setComments((prev) => prev.filter((c) => c.id !== comment.id));
    await supabase.from("comments").delete().eq("id", comment.id);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--bg)" }}>
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 pt-4 pb-3"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90"><ChevronLeft size={24} color="var(--text)" /></button>
        <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>
          Comments
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3">
        {loading ? (
          <p className="text-center text-xs py-8" style={{ color: "var(--text-muted)" }}>
            Loading...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-center text-xs py-8" style={{ color: "var(--text-muted)" }}>
            No comments yet — be the first to comment
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full shrink-0" style={{ background: ACCENT, padding: 1.5 }}>
                <div className="w-full h-full rounded-full bg-[var(--bg)] flex items-center justify-center text-[10px]" style={{ color: "var(--text)" }}>
                  {c.username[0].toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: "var(--text)", whiteSpace: "pre-wrap" }}>
                  <span style={{ fontWeight: 600 }}>{c.username}</span> {c.content}
                </p>
                {c.user_id === userId && (
                  <button onClick={() => deleteComment(c)} className="text-[10px] mt-1" style={{ color: "var(--accent-start)" }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-end gap-2 px-4 py-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={1}
          className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", maxHeight: 110 }}
        />
        <button
          onClick={handlePost}
          disabled={posting || !newComment.trim()}
          className="rounded-xl px-4 py-2.5 text-sm"
          style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: posting || !newComment.trim() ? 0.6 : 1 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

function AuthInput({ icon: Icon, type, placeholder, value, onChange, showToggle, onToggle, revealed }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-3.5 mb-3"
      style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)" }}
    >
      <Icon size={18} color="var(--text-muted)" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none text-sm"
        style={{ color: "var(--text)" }}
      />
      {showToggle && (
        <button onClick={onToggle} type="button" className="text-xs shrink-0" style={{ color: "var(--text-secondary)", fontWeight: 700 }}>
          {revealed ? "Hide" : "Show"}
        </button>
      )}
    </div>
  );
}

// ---- Password reset ----
// Step 1: ask for the email and have Supabase send a reset link back to
// this site. Step 2 happens when that link is opened — Supabase signs the
// person in with a short-lived recovery session and fires PASSWORD_RECOVERY,
// which App() catches to show SetNewPasswordScreen.
function ForgotPasswordScreen({ onBack }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    setError("");
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setError("Enter the email you signed up with");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(v, {
      redirectTo: window.location.origin,
    });
    setBusy(false);
    if (err) {
      // Supabase's built-in mailer is rate-limited; say so plainly rather
      // than showing its raw message.
      setError(
        /rate|limit|seconds/i.test(err.message)
          ? "Too many reset emails just now. Wait a few minutes and try again."
          : err.message
      );
      return;
    }
    // Shown whether or not the address has an account, so this screen
    // can't be used to find out who is signed up.
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <Mail size={32} color="var(--accent-solid)" className="mb-3" />
        <p className="text-sm mb-2" style={{ color: "var(--text)", fontWeight: 600 }}>Check your email</p>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
          If an account uses {email.trim()}, a link to reset the password is on its way. Open it on this
          device. Check spam if it doesn't arrive in a few minutes.
        </p>
        <button onClick={onBack} className="text-sm" style={{ color: "var(--accent-solid)", fontWeight: 600 }}>
          Back to log in
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="flex flex-col items-center mb-8">
        <div className="rounded-full flex items-center justify-center mb-4" style={{ width: 72, height: 72, border: "2px solid var(--text)" }}>
          <Lock size={30} color="var(--text)" />
        </div>
        <p className="text-base mb-1" style={{ color: "var(--text)", fontWeight: 700 }}>Trouble logging in?</p>
        <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
          Enter your email and we'll send you a link to get back into your account.
        </p>
      </div>

      <AuthInput icon={Mail} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

      {error && (
        <p className="text-xs mb-3" style={{ color: "var(--heart)" }}>{error}</p>
      )}

      <button
        onClick={send}
        disabled={busy}
        className="w-full rounded-2xl py-3.5 text-sm mt-2 mb-4 transition-transform active:scale-[0.98]"
        style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busy ? 0.7 : 1 }}
      >
        {busy ? "Sending..." : "Send reset link"}
      </button>

      <button onClick={onBack} className="text-center text-xs" style={{ color: "var(--accent-solid)", fontWeight: 600 }}>
        Back to log in
      </button>
    </div>
  );
}

function SetNewPasswordScreen({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) {
      setError(
        /session|expired|invalid/i.test(err.message)
          ? "This reset link has expired. Ask for a new one from the log-in screen."
          : err.message
      );
      return;
    }
    onDone();
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="flex flex-col items-center mb-8">
        <LoopLogo size={96} />
        <p className="text-base mt-3 mb-1" style={{ color: "var(--text)", fontWeight: 700 }}>Create a new password</p>
        <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
          At least 6 characters. You'll stay logged in after this.
        </p>
      </div>

      <AuthInput
        icon={Lock}
        type={show ? "text" : "password"}
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        showToggle
        onToggle={() => setShow((v) => !v)}
        revealed={show}
      />
      <AuthInput
        icon={Lock}
        type={show ? "text" : "password"}
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      {error && (
        <p className="text-xs mb-3" style={{ color: "var(--heart)" }}>{error}</p>
      )}

      <button
        onClick={save}
        disabled={busy}
        className="w-full rounded-2xl py-3.5 text-sm mt-2 transition-transform active:scale-[0.98]"
        style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busy ? 0.7 : 1 }}
      >
        {busy ? "Saving..." : "Save password"}
      </button>
    </div>
  );
}

function LoginScreen({ onLogin, onGoSignup, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Enter email and password");
      return;
    }
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    onLogin();
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="flex flex-col items-center mb-8">
        <LoopLogo size={132} />
        <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)" }}>
          Share your moments
        </p>
      </div>

      <AuthInput icon={Mail} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <AuthInput
        icon={Lock}
        type={showPass ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        showToggle
        onToggle={() => setShowPass((v) => !v)}
        revealed={showPass}
      />

      {error && (
        <p className="text-xs mb-3" style={{ color: "var(--accent-solid)" }}>
          {error}
        </p>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full rounded-2xl py-3.5 text-sm mt-2 mb-4 transition-transform active:scale-[0.98]"
        style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Please wait..." : "Log In"}
      </button>

      <button onClick={onForgot} className="text-center text-xs mb-4" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
        Forgot password?
      </button>

      <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Don't have an account?{" "}
        <button onClick={onGoSignup} style={{ color: "var(--accent-solid)", fontWeight: 600 }}>
          Sign Up
        </button>
      </p>
    </div>
  );
}

function SignupScreen({ onSignup, onGoLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmSent, setConfirmSent] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setConfirmSent(true);
  };

  if (confirmSent) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <Mail size={32} color="var(--accent-start)" className="mb-3" />
        <p className="text-sm mb-2" style={{ color: "var(--text)", fontWeight: 600 }}>
          Check your email
        </p>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
          A confirmation link was sent to {email}. Click the link to verify your account, then log in.
        </p>
        <button onClick={onGoLogin} style={{ color: "var(--accent-start)", fontWeight: 600 }} className="text-sm">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="flex flex-col items-center mb-8">
        <LoopLogo size={104} />
        <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)" }}>
          Get started in seconds
        </p>
      </div>

      <AuthInput icon={CircleUserRound} type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
      <AuthInput icon={Mail} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <AuthInput
        icon={Lock}
        type={showPass ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        showToggle
        onToggle={() => setShowPass((v) => !v)}
        revealed={showPass}
      />

      {error && (
        <p className="text-xs mb-3" style={{ color: "var(--accent-solid)" }}>
          {error}
        </p>
      )}

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full rounded-2xl py-3.5 text-sm mt-2 mb-4 transition-transform active:scale-[0.98]"
        style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Please wait..." : "Sign Up"}
      </button>

      <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Already have an account?{" "}
        <button onClick={onGoLogin} style={{ color: "var(--accent-solid)", fontWeight: 600 }}>
          Log In
        </button>
      </p>
    </div>
  );
}

const defaultTopics = [
  "AI",
  "Smartphones",
  "Cars",
  "Bikes",
  "Real Estate Investment",
  "Beauty",
  "Exercise",
];

const mockTaggedContent = [
  { id: 1, tag: "AI", type: "reel", user: "tanvir.v" },
  { id: 2, tag: "Smartphones", type: "post", user: "rafiq.tech" },
  { id: 3, tag: "Cars", type: "reel", user: "shuvo.eats" },
  { id: 4, tag: "Bikes", type: "post", user: "priya.dances" },
  { id: 5, tag: "Real Estate Investment", type: "post", user: "meherun.a" },
  { id: 6, tag: "Beauty", type: "reel", user: "nilufar.k" },
  { id: 7, tag: "Exercise", type: "post", user: "tanvir.v" },
  { id: 8, tag: "AI", type: "post", user: "rafiq.tech" },
];

function InterestsScreen({ onBack }) {
  const [topics, setTopics] = useState(defaultTopics);
  const [selected, setSelected] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newTopic, setNewTopic] = useState("");

  const [lessTopics, setLessTopics] = useState([]);
  const [addingLess, setAddingLess] = useState(false);
  const [newLessTopic, setNewLessTopic] = useState("");

  const toggleTopic = (t) => {
    setSelected((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const handleAddTopic = () => {
    const trimmed = newTopic.trim();
    if (trimmed && !topics.includes(trimmed)) {
      setTopics((prev) => [...prev, trimmed]);
      setSelected((prev) => [...prev, trimmed]);
    }
    setNewTopic("");
    setAdding(false);
  };

  const handleAddLessTopic = () => {
    const trimmed = newLessTopic.trim();
    if (trimmed && !lessTopics.includes(trimmed)) {
      setLessTopics((prev) => [...prev, trimmed]);
    }
    setNewLessTopic("");
    setAddingLess(false);
  };

  const removeLessTopic = (t) => {
    setLessTopics((prev) => prev.filter((x) => x !== t));
  };

  const matches = mockTaggedContent.filter((c) => selected.includes(c.tag));

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--bg)" }}>
      <div
        className="sticky top-0 z-10 px-4 pt-4 pb-3"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90"><ChevronLeft size={24} color="var(--text)" /></button>
          <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>
            Interests
          </h1>
        </div>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          You'll see more posts and reels related to the topics you pick
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3">
        <div className="flex flex-wrap gap-2 mb-5">
          {topics.map((t) => {
            const isSelected = selected.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleTopic(t)}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs"
                style={{
                  background: isSelected ? ACCENT : "var(--surface)",
                  color: isSelected ? "var(--bg)" : "var(--text)",
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected ? "none" : "1px solid var(--border)",
                }}
              >
                <Hash size={12} color={isSelected ? "var(--bg)" : "var(--text-muted)"} />
                {t}
              </button>
            );
          })}

          {adding ? (
            <div
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <input
                autoFocus
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                placeholder="New topic..."
                className="bg-transparent outline-none text-xs w-24"
                style={{ color: "var(--text)" }}
              />
              <button onClick={handleAddTopic} className="text-xs" style={{ color: "var(--accent-start)", fontWeight: 700 }}>
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1 rounded-full px-3.5 py-2 text-xs"
              style={{ background: "var(--surface)", border: "1.5px dashed var(--toggle-off)", color: "var(--text-secondary)" }}
            >
              <Plus size={13} /> Add
            </button>
          )}
        </div>

        <div style={{ borderTop: "1px solid var(--border-subtle)" }} className="pt-4">
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
            Related Posts & Reels
          </p>
          {matches.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>
              Pick at least one topic above
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {matches.map((c) => (
                <div
                  key={c.id}
                  className="relative aspect-square flex flex-col items-center justify-center gap-1 rounded-lg"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  {c.type === "reel" ? (
                    <Play size={16} color="var(--toggle-off)" fill="var(--toggle-off)" />
                  ) : (
                    <ImageIcon size={16} color="var(--toggle-off)" />
                  )}
                  <span className="text-[9px] px-1 text-center" style={{ color: "var(--text-muted)" }}>
                    #{c.tag}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid var(--border-subtle)" }} className="pt-4 mt-5 pb-2">
          <p className="text-xs mb-1" style={{ color: "var(--text)", fontWeight: 600 }}>
            What you want to see less
          </p>
          <p className="text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>
            The algorithm will stop showing posts/reels about these topics
          </p>

          <div className="flex flex-wrap gap-2">
            {lessTopics.map((t) => (
              <button
                key={t}
                onClick={() => removeLessTopic(t)}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs"
                style={{ background: "var(--tag-bg)", border: "1px solid var(--tag-border)", color: "var(--tag-text)" }}
              >
                <Hash size={12} color="var(--tag-text)" />
                {t}
                <span style={{ fontWeight: 700 }}>×</span>
              </button>
            ))}

            {addingLess ? (
              <div
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <input
                  autoFocus
                  value={newLessTopic}
                  onChange={(e) => setNewLessTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddLessTopic()}
                  placeholder="New topic..."
                  className="bg-transparent outline-none text-xs w-24"
                  style={{ color: "var(--text)" }}
                />
                <button onClick={handleAddLessTopic} className="text-xs" style={{ color: "var(--accent-start)", fontWeight: 700 }}>
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingLess(true)}
                className="flex items-center gap-1 rounded-full px-3.5 py-2 text-xs"
                style={{ background: "var(--surface)", border: "1.5px dashed var(--toggle-off)", color: "var(--text-secondary)" }}
              >
                <Plus size={13} /> Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { key: "feed", label: "Feed", icon: Home, screen: FeedScreen },
  { key: "reels", label: "Reels", icon: Clapperboard, screen: ReelsScreen },
  { key: "search", label: "Search", icon: Search, screen: SearchScreen },
  { key: "upload", label: "Upload", icon: PlusSquare, screen: UploadScreen },
  { key: "profile", label: "Profile", icon: CircleUserRound, screen: ProfileScreen },
];

const PEOPLE_LIST_META = {
  close_friends: { title: "Close friends", hint: "Only these people see stories you share with close friends." },
  blocked: { title: "Blocked", hint: "Blocked people can't find your profile, posts or story." },
  restricted: { title: "Restricted", hint: "Their comments on your posts are only visible to them and you. They aren't told." },
  muted: { title: "Muted", hint: "You stay following them, but their posts, reels and stories stop appearing. They aren't told." },
};

// #hashtag page: every post whose caption uses the tag.
function HashtagScreen({ tag, onBack, onOpenProfile, onOpenReport }) {
  const [posts, setPosts] = useState(null);
  const [openAt, setOpenAt] = useState(null); // index of the post being viewed
  const [me, setMe] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMe(data?.user?.id || null));
  }, []);
  useEffect(() => {
    (async () => {
      const safe = tag.replace(/[%_]/g, "");
      const { data } = await supabase
        .from("posts")
        .select("id, user_id, media_url, media_type, media_count, created_at, views_count, cover_url")
        .ilike("caption", `%#${safe}%`)
        .eq("archived", false)
        .is("removed_at", null)
        .lte("created_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(90);
      const rel = await getRelations();
      setPosts((data || []).filter((pp) => !isHiddenFromFeed(rel, pp.user_id)));
    })();
  }, [tag]);
  if (openAt !== null && posts && posts[openAt]) {
    return (
      <ProfileFeedScreen
        postIds={posts.map((x) => x.id)}
        startIndex={openAt}
        title="posts"
        currentUserId={me}
        onBack={() => setOpenAt(null)}
        onOpenProfile={onOpenProfile}
        onOpenReport={onOpenReport}
      />
    );
  }
  return (
    <div className="flex-1 overflow-y-auto pb-6" style={{ background: "var(--bg)" }}>
      <ScreenHeader title={`#${tag}`} onBack={onBack} />
      <div className="flex items-center gap-4 px-4 py-5">
        <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <span style={{ color: "var(--text)", fontSize: 34, fontWeight: 700 }}>#</span>
        </div>
        <div>
          <p className="text-[17px]" style={{ color: "var(--text)", fontWeight: 700 }}>#{tag}</p>
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            {posts === null ? "…" : `${formatCount(posts.length)} ${posts.length === 1 ? "post" : "posts"}`}
          </p>
        </div>
      </div>
      {posts === null ? (
        <div className="grid grid-cols-3 gap-0.5">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="aspect-square" style={{ background: "var(--border-subtle)" }} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-xs text-center py-10" style={{ color: "var(--text-muted)" }}>No posts with #{tag} yet</p>
      ) : (
        <div className="grid grid-cols-3 gap-0.5">
          {posts.map((pp) => (
            <button key={pp.id} onClick={() => setOpenAt(posts.indexOf(pp))} className="relative aspect-square overflow-hidden" style={{ background: "var(--surface)" }}>
              <MediaThumb src={pp.media_url} cover={pp.cover_url} isVideo={!isPhotoPost(pp)} />
              {!isPhotoPost(pp) && (
                <span className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.7))" }}>
                  <Play size={13} color="#fff" fill="#fff" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Moderation (Admin + Moderators) ----
// Reports come in here. One tap dismisses, removes the post/comment, or
// suspends the account; every decision is written to the log. Only the
// admin can ban permanently or add/remove moderators — the database
// enforces that too, not just this screen.
const MOD_ACTION_LABEL = {
  dismiss: "Dismissed",
  remove: "Removed",
  ban7: "Suspended 7 days",
  ban30: "Suspended 30 days",
  banperm: "Banned permanently",
  restore: "Post restored",
  unban: "Suspension lifted",
  add_moderator: "Made moderator",
  remove_moderator: "Removed as moderator",
  verify: "Gave verified badge",
  unverify: "Removed verified badge",
};
const modLabel = (a) => MOD_ACTION_LABEL[a] || (a?.startsWith("ban") ? `Suspended ${a.slice(3)} days` : a);

function ModerationScreen({ onBack }) {
  const role = useStaffRole();
  const [tab, setTab] = useState("reports");
  const [status, setStatus] = useState("open");
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [newMod, setNewMod] = useState("");
  const [note, setNote] = useState("");

  const flash = (msg) => {
    setNote(msg);
    setTimeout(() => setNote(""), 2200);
  };

  const load = async () => {
    setRows(null);
    setError("");
    const call =
      tab === "reports"
        ? supabase.rpc("mod_list_reports", { p_status: status })
        : tab === "bans"
        ? supabase.rpc("mod_list_bans")
        : tab === "team"
        ? supabase.rpc("mod_list_staff")
        : supabase.rpc("mod_log");
    const { data, error: err } = await call;
    if (err) {
      setError(err.message);
      setRows([]);
      return;
    }
    setRows(data || []);
  };

  useEffect(() => {
    load();
  }, [tab, status]);

  const act = async (fn, args, done, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(JSON.stringify(args));
    const { error: err } = await supabase.rpc(fn, args);
    setBusy(null);
    if (err) {
      flash(err.message);
      return;
    }
    flash(done);
    load();
  };

  const tabs = [
    ["reports", "Reports"],
    ["bans", "Suspended"],
    ["team", "Team"],
    ["log", "Log"],
  ];

  const ActionBtn = ({ label, onClick, danger, primary }) => (
    <button
      onClick={onClick}
      disabled={!!busy}
      className="rounded-lg px-3 h-8 text-xs transition-transform active:scale-95"
      style={{
        fontWeight: 700,
        ...(primary
          ? { background: ACCENT, color: "var(--on-accent)" }
          : danger
          ? { background: "transparent", color: "var(--heart)", border: "1px solid var(--heart)" }
          : { background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }),
        opacity: busy ? 0.6 : 1,
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: "var(--bg)" }}>
      <div className="flex items-center gap-3 px-4 h-14 shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <button onClick={onBack} aria-label="Back">
          <ChevronLeft size={24} color="var(--text)" />
        </button>
        <span className="text-[17px] flex-1" style={{ color: "var(--text)", fontWeight: 700 }}>Moderation</span>
        {role && (
          <span className="text-[11px] rounded-full px-2.5 py-1 capitalize" style={{ background: "var(--surface)", color: "var(--text-secondary)", fontWeight: 700 }}>
            {role}
          </span>
        )}
      </div>

      <div className="flex shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        {tabs.map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className="flex-1 h-11 text-[13px]"
            style={{
              color: tab === k ? "var(--text)" : "var(--text-muted)",
              fontWeight: tab === k ? 700 : 500,
              borderBottom: tab === k ? "2px solid var(--text)" : "2px solid transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {tab === "reports" && (
          <div className="flex gap-2 mb-3">
            {["open", "resolved"].map((st) => (
              <button
                key={st}
                onClick={() => setStatus(st)}
                className="rounded-full px-3.5 h-8 text-xs capitalize"
                style={{
                  fontWeight: 700,
                  background: status === st ? "var(--text)" : "var(--surface)",
                  color: status === st ? "var(--bg)" : "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                {st}
              </button>
            ))}
          </div>
        )}

        {tab === "team" && role === "admin" && (
          <div className="rounded-2xl p-3 mb-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-[13px] mb-2" style={{ color: "var(--text)", fontWeight: 700 }}>Add a moderator</p>
            <div className="flex gap-2">
              <input
                value={newMod}
                onChange={(e) => setNewMod(e.target.value)}
                placeholder="Their username"
                className="flex-1 rounded-lg px-3 h-9 text-sm outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
              <ActionBtn
                primary
                label="Add"
                onClick={() =>
                  newMod.trim() &&
                  act("admin_set_role", { p_username: newMod.trim().replace(/^@/, ""), p_role: "moderator" }, "Moderator added").then(() => setNewMod(""))
                }
              />
            </div>
            <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
              Moderators can review reports, remove posts and suspend for 7 or 30 days. Only you can ban permanently or change the team.
            </p>
          </div>
        )}

        {error ? (
          <div className="rounded-2xl p-4 text-center" style={{ background: "var(--surface)" }}>
            <p className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>Couldn't load this</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {/Not allowed/.test(error) ? "This account isn't on the moderation team." : error}
            </p>
          </div>
        ) : rows === null ? (
          <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>Loading…</p>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <Shield size={34} color="var(--text-muted)" strokeWidth={1.5} />
            <p className="text-sm mt-2" style={{ color: "var(--text)", fontWeight: 600 }}>
              {tab === "reports" ? (status === "open" ? "No open reports" : "Nothing resolved yet") : tab === "bans" ? "No one is suspended" : tab === "team" ? "No team yet" : "No actions yet"}
            </p>
            {tab === "reports" && status === "open" && (
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>You're all caught up.</p>
            )}
          </div>
        ) : tab === "reports" ? (
          rows.map((rp) => (
            <div key={rp.id} className="rounded-2xl p-3 mb-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2.5">
                <Avatar username={rp.target_username || "?"} avatarUrl={rp.target_avatar} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--text)", fontWeight: 700 }}>{rp.target_username || "Unknown account"}</p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {rp.reports_against_user} {Number(rp.reports_against_user) === 1 ? "report" : "reports"} in total
                    {rp.target_banned ? " · Suspended" : ""}
                  </p>
                </div>
                <span className="text-[11px] rounded-full px-2 py-0.5" style={{ background: "var(--bg)", color: "var(--text-secondary)", fontWeight: 600 }}>
                  {rp.comment_id ? "Comment" : rp.post_id ? "Post" : "Account"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-2.5">
                <Flag size={13} color="var(--heart)" />
                <span className="text-[13px]" style={{ color: "var(--text)", fontWeight: 600 }}>{rp.reason || "No reason given"}</span>
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                Reported by {rp.reporter_username || "someone"} · {timeAgo(rp.created_at)} ago
              </p>

              {rp.comment_id ? (
                <div className="rounded-xl px-3 py-2 mt-2.5" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                  <p className="text-[13px]" style={{ color: "var(--text)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {rp.comment_content || <span style={{ color: "var(--text-muted)" }}>(comment already deleted)</span>}
                  </p>
                </div>
              ) : rp.post_id ? (
                <div className="mt-2.5">
                  {rp.post_media_url ? (
                    <div className="relative rounded-xl overflow-hidden" style={{ background: "var(--bg)", maxHeight: 280 }}>
                      {rp.post_media_type === "photo" ? (
                        <img src={rp.post_media_url} alt="" className="w-full object-cover" style={{ maxHeight: 280 }} />
                      ) : (
                        <video src={rp.post_media_url} className="w-full object-cover" style={{ maxHeight: 280 }} controls playsInline preload="metadata" />
                      )}
                      {rp.post_removed && (
                        <span className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[11px]" style={{ background: "var(--heart)", color: "#fff", fontWeight: 700 }}>
                          Removed
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>(post already deleted)</p>
                  )}
                  {rp.post_caption && (
                    <p className="text-[13px] mt-1.5" style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{rp.post_caption}</p>
                  )}
                </div>
              ) : null}

              {rp.status === "open" ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  <ActionBtn label="Dismiss" onClick={() => act("mod_resolve_report", { p_report: rp.id, p_action: "dismiss" }, "Dismissed")} />
                  {(rp.post_id || rp.comment_id) && (
                    <ActionBtn danger label="Remove" onClick={() => act("mod_resolve_report", { p_report: rp.id, p_action: "remove" }, "Removed")} />
                  )}
                  <ActionBtn
                    danger
                    label="Suspend 7d"
                    onClick={() => act("mod_resolve_report", { p_report: rp.id, p_action: "ban7" }, "Removed and suspended for 7 days", `Remove this and suspend ${rp.target_username} for 7 days?`)}
                  />
                  <ActionBtn
                    danger
                    label="Suspend 30d"
                    onClick={() => act("mod_resolve_report", { p_report: rp.id, p_action: "ban30" }, "Removed and suspended for 30 days", `Remove this and suspend ${rp.target_username} for 30 days?`)}
                  />
                  {role === "admin" && (
                    <ActionBtn
                      danger
                      label="Ban"
                      onClick={() => act("mod_resolve_report", { p_report: rp.id, p_action: "banperm" }, "Banned permanently", `Ban ${rp.target_username} permanently? All their posts will be hidden.`)}
                    />
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{modLabel(rp.resolution)}</span>
                  {rp.post_removed && rp.post_id && (
                    <ActionBtn label="Restore post" onClick={() => act("mod_restore_post", { p_post: rp.post_id }, "Post restored")} />
                  )}
                </div>
              )}
            </div>
          ))
        ) : tab === "bans" ? (
          rows.map((b) => (
            <div key={b.user_id} className="flex items-center gap-3 py-2.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <Avatar username={b.username || "?"} avatarUrl={b.avatar_url} size={42} />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--text)", fontWeight: 700 }}>{b.username}</p>
                <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                  {b.until ? `Until ${new Date(b.until).toLocaleDateString()}` : "Permanent"} · {b.reason || "—"}
                  {b.banned_by_username ? ` · by ${b.banned_by_username}` : ""}
                </p>
              </div>
              {(b.until || role === "admin") && (
                <ActionBtn label="Lift" onClick={() => act("mod_unban", { p_user: b.user_id }, "Suspension lifted", `Lift the suspension on ${b.username}?`)} />
              )}
            </div>
          ))
        ) : tab === "team" ? (
          rows.map((m) => (
            <div key={m.user_id} className="flex items-center gap-3 py-2.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <Avatar username={m.username || "?"} avatarUrl={m.avatar_url} size={42} />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--text)", fontWeight: 700 }}>{m.username}</p>
                <p className="text-[11px] capitalize" style={{ color: "var(--text-muted)" }}>{m.role}</p>
              </div>
              {role === "admin" && m.role === "moderator" && (
                <ActionBtn
                  danger
                  label="Remove"
                  onClick={() => act("admin_set_role", { p_username: m.username, p_role: null }, "Removed from the team", `Remove ${m.username} as moderator?`)}
                />
              )}
            </div>
          ))
        ) : (
          rows.map((l, i) => (
            <div key={i} className="py-2.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <p className="text-[13px]" style={{ color: "var(--text)" }}>
                <span style={{ fontWeight: 700 }}>{l.actor_username || "someone"}</span> · {modLabel(l.action)}
                {l.target_username ? (
                  <>
                    {" "}
                    <span style={{ fontWeight: 700 }}>{l.target_username}</span>
                  </>
                ) : null}
              </p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {timeAgo(l.created_at)} ago{l.note ? ` · ${l.note}` : ""}
              </p>
            </div>
          ))
        )}
      </div>

      {note && (
        <div
          className="absolute left-1/2 bottom-6 -translate-x-1/2 z-[80] rounded-full px-4 py-2.5 text-xs"
          style={{ background: "var(--text)", color: "var(--bg)", fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}
        >
          {note}
        </div>
      )}
    </div>
  );
}

// Logged in while the account is waiting to be deleted: keep it, or leave.
function PendingDeletionScreen({ deleteAfter, onKeep, onLogout }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center" style={{ background: "var(--bg)" }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--surface)" }}>
        <Trash size={28} color="var(--heart)" />
      </div>
      <p className="text-lg" style={{ color: "var(--text)", fontWeight: 700 }}>Keep your account?</p>
      <p className="text-sm mt-2" style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
        You asked to delete this account. It will be deleted for good on{" "}
        <span style={{ fontWeight: 700 }}>{new Date(deleteAfter).toLocaleDateString(undefined, { dateStyle: "long" })}</span>.
      </p>
      <button
        onClick={async () => {
          setBusy(true);
          await onKeep();
          setBusy(false);
        }}
        disabled={busy}
        className="mt-6 w-full rounded-xl h-12 text-sm"
        style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: busy ? 0.6 : 1 }}
      >
        Keep account
      </button>
      <button onClick={onLogout} className="mt-2 w-full h-11 text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>
        Log out
      </button>
    </div>
  );
}

// Shown instead of the app while an account is suspended or banned.
function SuspendedScreen({ ban, onLogout }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center" style={{ background: "var(--bg)" }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--surface)" }}>
        <Shield size={30} color="var(--heart)" />
      </div>
      <p className="text-lg" style={{ color: "var(--text)", fontWeight: 700 }}>
        {ban.until ? "Your account is suspended" : "Your account has been disabled"}
      </p>
      <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
        {ban.until
          ? `You can use Loop again on ${new Date(ban.until).toLocaleString()}.`
          : "This account broke Loop's Community Guidelines."}
      </p>
      {ban.reason && (
        <p className="text-xs mt-3 rounded-xl px-3 py-2" style={{ background: "var(--surface)", color: "var(--text-muted)" }}>
          Reason: {ban.reason}
        </p>
      )}
      <button onClick={onLogout} className="mt-6 rounded-xl px-6 h-11 text-sm" style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 700, border: "1px solid var(--border)" }}>
        Log out
      </button>
    </div>
  );
}

export default function App() {
  const [authScreen, setAuthScreen] = useState("login"); // "login" | "signup" | null
  const [checkingSession, setCheckingSession] = useState(true);
  const [active, setActive] = useState("feed");
  // Set when a reel on Home is tapped, so Reels opens on that reel.
  const [reelStartId, setReelStartId] = useState(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [interestsOpen, setInterestsOpen] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState(null);
  const [commentsPostOwnerId, setCommentsPostOwnerId] = useState(null);
  const [reportPostId, setReportPostId] = useState(null);
  const [viewProfileId, setViewProfileId] = useState(null);
  const [deepHighlight, setDeepHighlight] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewPostId, setViewPostId] = useState(null);
  const [savedOpen, setSavedOpen] = useState(false);
  const [profileFeed, setProfileFeed] = useState(null); // { postIds, index, title }
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [peopleList, setPeopleList] = useState(null); // close_friends | blocked | restricted | muted
  const [profileRefresh, setProfileRefresh] = useState(0);
  const [meId, setMeId] = useState(null);
  const [moderationOpen, setModerationOpen] = useState(false);
  const [messageTarget, setMessageTarget] = useState(null); // profile to open a chat with
  const [timeNudge, setTimeNudge] = useState(null); // { kind, minutes }
  const [locked, setLocked] = useState(() => !!readQuickUnlock());
  const [hashtag, setHashtag] = useState(null);
  const [uploadMode, setUploadMode] = useState("photo");
  const [uploadNonce, setUploadNonce] = useState(0);
  useEffect(() => {
    const onTag = (e) => setHashtag(e.detail);
    window.addEventListener("loop:hashtag", onTag);
    return () => window.removeEventListener("loop:hashtag", onTag);
  }, []);
  const sessionSecondsRef = React.useRef(0);
  const snoozeUntilRef = React.useRef(0);
  const limitShownDayRef = React.useRef("");

  // Count time while Loop is open on screen, and nudge for breaks / limits.
  useEffect(() => {
    const TICK = 15;
    const id = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      recordTimeSpent(TICK);
      sessionSecondsRef.current += TICK;
      if (Date.now() < snoozeUntilRef.current) return;
      const prefs = readTimePrefs();
      const today = readTimeSpent()[localDay()] || 0;
      if (prefs.dailyLimit > 0 && today >= prefs.dailyLimit * 60 && limitShownDayRef.current !== localDay()) {
        limitShownDayRef.current = localDay();
        setTimeNudge({ kind: "limit", minutes: prefs.dailyLimit });
      } else if (prefs.breakEvery > 0 && sessionSecondsRef.current >= prefs.breakEvery * 60) {
        sessionSecondsRef.current = 0;
        setTimeNudge({ kind: "break", minutes: prefs.breakEvery });
      }
    }, TICK * 1000);
    const onVis = () => {
      // Coming back after a while away starts a fresh scrolling session.
      if (document.visibilityState === "hidden") sessionSecondsRef.current = Math.max(0, sessionSecondsRef.current - 60);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  const [myBan, setMyBan] = useState(null); // { until, reason } while suspended
  const [myDeletion, setMyDeletion] = useState(null); // { delete_after } while deletion is pending
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMeId(data?.user?.id ?? null));
    // Keep "who am I" right after logging in, out, or switching accounts.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setMeId(session?.user?.id ?? null);
      staffRolePromise = null;
      invalidateRelations();
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  // Entering the app (after login/sign-up) — make sure we know who it is.
  useEffect(() => {
    if (authScreen === null) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user?.id) setMeId(data.user.id);
      });
    }
  }, [authScreen]);
  // Every signed-in account needs a profile. If one is missing (for example
  // its row was deleted by hand), make a fresh one instead of showing
  // "Profile not found".
  useEffect(() => {
    if (!meId) return;
    (async () => {
      const { data: existing } = await supabase.from("profiles").select("id").eq("id", meId).maybeSingle();
      if (existing) return;
      const { data: u } = await supabase.auth.getUser();
      const base =
        ((u?.user?.email || "user").split("@")[0].toLowerCase().replace(/[^a-z0-9._]/g, "") || "user").slice(0, 20);
      for (let attempt = 0; attempt < 4; attempt++) {
        const username = attempt === 0 ? base : `${base}_${Math.floor(1000 + Math.random() * 9000)}`;
        const { error } = await supabase.from("profiles").insert({ id: meId, username });
        if (!error) {
          setProfileRefresh((n) => n + 1);
          return;
        }
        if (!/duplicate|unique|username/i.test(error.message)) return;
      }
    })();
  }, [meId]);
  useEffect(() => {
    if (!meId) {
      setMyDeletion(null);
      return;
    }
    supabase
      .from("account_deletions")
      .select("delete_after")
      .eq("user_id", meId)
      .maybeSingle()
      .then(({ data }) => setMyDeletion(data || null));
  }, [meId]);
  useEffect(() => {
    if (!meId) {
      setMyBan(null);
      return;
    }
    supabase
      .from("user_bans")
      .select("until, reason")
      .eq("user_id", meId)
      .maybeSingle()
      .then(({ data }) => {
        if (data && (!data.until || new Date(data.until).getTime() > Date.now())) setMyBan(data);
        else setMyBan(null);
      });
  }, [meId]);
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem("loop_theme") || "dark";
    } catch {
      return "dark";
    }
  });
  // v2 keys: a one-time reset that wipes any accidentally-saved accent from an
  // earlier build (old picker defaults could get saved and pollute every theme).
  const [accentStart, setAccentStartState] = useState(() => {
    try {
      localStorage.removeItem("loop_accent_start");
      localStorage.removeItem("loop_accent_end");
      return localStorage.getItem("loop_accent_start_v2") || "";
    } catch {
      return "";
    }
  });
  const [accentEnd, setAccentEndState] = useState(() => {
    try {
      return localStorage.getItem("loop_accent_end_v2") || "";
    } catch {
      return "";
    }
  });

  const setTheme = (next) => {
    setThemeState(next);
    try {
      localStorage.setItem("loop_theme", next);
    } catch {}
  };
  const setCustomAccent = (start, end) => {
    setAccentStartState(start);
    setAccentEndState(end);
    try {
      if (start) localStorage.setItem("loop_accent_start_v2", start);
      else localStorage.removeItem("loop_accent_start_v2");
      if (end) localStorage.setItem("loop_accent_end_v2", end);
      else localStorage.removeItem("loop_accent_end_v2");
    } catch {}
  };

  // A custom accent overrides the action accent AND the story/avatar ring, so
  // the chosen colour shows consistently on every button, icon, and ring.
  const rootVarOverrides = {};
  if (accentStart) {
    rootVarOverrides["--accent-start"] = accentStart;
    rootVarOverrides["--ring-start"] = accentStart;
  }
  if (accentEnd) {
    rootVarOverrides["--accent-end"] = accentEnd;
    rootVarOverrides["--accent-solid"] = accentEnd;
    rootVarOverrides["--ring-end"] = accentEnd;
  }
  if (accentStart && !accentEnd) rootVarOverrides["--accent-solid"] = accentStart;

  const ActiveScreen = TABS.find((t) => t.key === active).screen;
  const overlayOpen = inboxOpen || notificationsOpen || interestsOpen || commentsPostId !== null || reportPostId !== null || viewProfileId !== null || settingsOpen || viewPostId !== null || savedOpen || profileFeed !== null || editProfileOpen || activityOpen || archiveOpen || peopleList !== null || moderationOpen || !!myBan || !!myDeletion || hashtag !== null || locked;

  // ---- Back button ----
  // Every screen that opens on top (a profile, a post, Settings, Your
  // activity…) adds a step to the browser history, so the phone's Back
  // button / swipe goes back one screen instead of leaving Loop, and the
  // on-screen back arrows and the phone's Back stay in step.
  // Order = which screen is on top when several are open (same order as
  // the screen picker below).
  const overlayStack = [
    [moderationOpen, () => setModerationOpen(false)],
    [reportPostId !== null, () => setReportPostId(null)],
    [hashtag !== null, () => setHashtag(null)],
    [editProfileOpen, () => setEditProfileOpen(false)],
    [activityOpen, () => setActivityOpen(false)],
    [archiveOpen, () => setArchiveOpen(false)],
    [peopleList !== null, () => setPeopleList(null)],
    [profileFeed !== null, () => setProfileFeed(null)],
    [savedOpen, () => setSavedOpen(false)],
    [inboxOpen, () => {
      setInboxOpen(false);
      setMessageTarget(null);
    }],
    [notificationsOpen, () => setNotificationsOpen(false)],
    [interestsOpen, () => setInterestsOpen(false)],
    [commentsPostId !== null, () => setCommentsPostId(null)],
    [settingsOpen, () => setSettingsOpen(false)],
    [viewPostId !== null, () => setViewPostId(null)],
    [viewProfileId !== null, () => setViewProfileId(null)],
    [active !== "feed", () => setActive("feed")],
  ];
  const navDepth = authScreen || myBan || myDeletion || locked ? 0 : overlayStack.filter((o) => o[0]).length;
  const overlayStackRef = React.useRef(overlayStack);
  overlayStackRef.current = overlayStack;
  const prevDepthRef = React.useRef(0);
  const skipPopRef = React.useRef(0);
  const closingFromPopRef = React.useRef(false);

  useEffect(() => {
    const prev = prevDepthRef.current;
    prevDepthRef.current = navDepth;
    if (navDepth > prev) {
      for (let k = prev; k < navDepth; k++) window.history.pushState({ loop: k + 1 }, "");
    } else if (navDepth < prev) {
      if (closingFromPopRef.current) {
        closingFromPopRef.current = false;
        return;
      }
      // Closed with an on-screen arrow: drop the matching history steps.
      skipPopRef.current += 1;
      window.history.go(-(prev - navDepth));
    }
  }, [navDepth]);

  useEffect(() => {
    const onPop = () => {
      if (skipPopRef.current > 0) {
        skipPopRef.current -= 1;
        return;
      }
      const top = overlayStackRef.current.find((o) => o[0]);
      if (top) {
        closingFromPopRef.current = true;
        top[1]();
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  React.useEffect(() => {
    // A reset link lands here with "type=recovery" in the URL. Check it up
    // front too — the PASSWORD_RECOVERY event and getSession() can resolve in
    // either order, and getSession alone would just log the person straight in.
    // A link someone shared: loop.app/u/name, and ?h=... for a highlight.
    (async () => {
      try {
        const match = window.location.pathname.match(/^\/u\/([a-zA-Z0-9_.]{1,30})\/?$/);
        if (!match) return;
        const wanted = new URLSearchParams(window.location.search).get("h");
        const { data: found } = await supabase.from("profiles").select("id").eq("username", match[1]).maybeSingle();
        window.history.replaceState(null, "", "/");
        if (!found) return;
        setViewProfileId(found.id);
        if (wanted) setDeepHighlight(wanted);
      } catch {
        // A bad link should never stop the app from opening.
      }
    })();

    const isRecoveryLink = /type=recovery/.test(window.location.hash + window.location.search);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthScreen((prev) =>
        prev === "newPassword" || (session && isRecoveryLink) ? "newPassword" : session ? null : "login"
      );
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // Opening a reset link signs you in with a recovery session — show the
      // new-password screen instead of dropping straight into the app.
      if (event === "PASSWORD_RECOVERY") {
        setAuthScreen("newPassword");
        return;
      }
      setAuthScreen((prev) => (prev === "newPassword" && session ? "newPassword" : session ? null : prev === "forgot" ? "forgot" : "login"));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (checkingSession) {
    return (
      <div className="loop-page w-full min-h-screen flex items-center justify-center notranslate" translate="no" data-theme={theme} style={{ background: "var(--page-bg)", ...rootVarOverrides }}>
        <style>{THEME_CSS}</style>
        <div className="flex flex-col items-center gap-4">
          <LoopLogo size={96} />
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</span>
        </div>
      </div>
    );
  }

  if (authScreen) {
    return (
      <div className="loop-page w-full min-h-screen flex items-center justify-center notranslate" translate="no" data-theme={theme} style={{ background: "var(--page-bg)", ...rootVarOverrides }}>
        <style>{THEME_CSS}</style>
        <div
          className="loop-frame flex flex-col w-full max-w-[390px] h-[780px] overflow-hidden relative"
          style={{ background: "var(--bg)", borderRadius: 36, border: "8px solid var(--page-bg)" }}
        >
          {authScreen === "login" ? (
            <LoginScreen
              onLogin={() => setAuthScreen(null)}
              onGoSignup={() => setAuthScreen("signup")}
              onForgot={() => setAuthScreen("forgot")}
            />
          ) : authScreen === "forgot" ? (
            <ForgotPasswordScreen onBack={() => setAuthScreen("login")} />
          ) : authScreen === "newPassword" ? (
            <SetNewPasswordScreen
              onDone={() => {
                window.history.replaceState(null, "", window.location.pathname);
                setAuthScreen(null);
              }}
            />
          ) : (
            <SignupScreen onSignup={() => setAuthScreen(null)} onGoLogin={() => setAuthScreen("login")} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="loop-page w-full min-h-screen flex items-center justify-center notranslate" translate="no" data-theme={theme} style={{ background: "var(--page-bg)", ...rootVarOverrides }}>
      <style>{THEME_CSS}</style>
      <div
        className="loop-frame flex flex-col w-full max-w-[390px] h-[780px] overflow-hidden relative"
        style={{ background: "var(--bg)", borderRadius: 36, border: "8px solid var(--page-bg)" }}
      >
        <ErrorBoundary key={active + String(inboxOpen) + String(notificationsOpen) + String(interestsOpen) + String(commentsPostId) + String(reportPostId) + String(viewProfileId) + String(settingsOpen) + String(viewPostId) + String(savedOpen) + String(profileFeed !== null) + String(editProfileOpen) + String(activityOpen) + String(archiveOpen) + String(peopleList) + String(profileRefresh) + String(moderationOpen) + String(hashtag)}>
          {locked ? (
            <LockScreen
              onUnlock={() => setLocked(false)}
              onForget={async () => {
                writeQuickUnlock(null);
                setLocked(false);
                await supabase.auth.signOut();
              }}
            />
          ) : myDeletion ? (
            <PendingDeletionScreen
              deleteAfter={myDeletion.delete_after}
              onKeep={async () => {
                const { error } = await supabase.rpc("cancel_account_deletion");
                if (error) alert(error.message);
                else setMyDeletion(null);
              }}
              onLogout={() => supabase.auth.signOut()}
            />
          ) : myBan ? (
            <SuspendedScreen ban={myBan} onLogout={() => supabase.auth.signOut()} />
          ) : moderationOpen ? (
            <ModerationScreen onBack={() => setModerationOpen(false)} />
          ) : reportPostId !== null ? (
            <ReportScreen postId={reportPostId} onBack={() => setReportPostId(null)} />
          ) : hashtag !== null ? (
            <HashtagScreen
              key={hashtag}
              tag={hashtag}
              onBack={() => setHashtag(null)}
              onOpenProfile={(id) => {
                setHashtag(null);
                setProfileFeed(null);
                setViewPostId(null);
                setViewProfileId(id);
              }}
              onOpenReport={(id) => setReportPostId(id)}
            />
          ) : editProfileOpen ? (
            <EditProfileScreen
              currentUserId={meId}
              onBack={() => setEditProfileOpen(false)}
              onSaved={() => {
                setEditProfileOpen(false);
                setProfileRefresh((n) => n + 1);
              }}
            />
          ) : activityOpen ? (
            <YourActivityScreen
              currentUserId={meId}
              onBack={() => setActivityOpen(false)}
              onOpenPost={(postId) => {
                setActivityOpen(false);
                setViewPostId(postId);
              }}
            />
          ) : archiveOpen ? (
            <ArchiveScreen
              currentUserId={meId}
              onBack={() => setArchiveOpen(false)}
              onOpenPost={(postId) => {
                setArchiveOpen(false);
                setViewPostId(postId);
              }}
            />
          ) : peopleList ? (
            <PeopleListScreen
              kind={peopleList}
              title={PEOPLE_LIST_META[peopleList].title}
              hint={PEOPLE_LIST_META[peopleList].hint}
              currentUserId={meId}
              onBack={() => setPeopleList(null)}
              onOpenProfile={(id) => {
                setPeopleList(null);
                setViewProfileId(id);
              }}
            />
          ) : profileFeed ? (
            <ProfileFeedScreen
              postIds={profileFeed.postIds}
              startIndex={profileFeed.index}
              title={profileFeed.title}
              currentUserId={meId}
              onBack={() => setProfileFeed(null)}
              onOpenProfile={(id) => {
                setProfileFeed(null);
                setViewProfileId(id);
              }}
              onOpenReport={(postId) => setReportPostId(postId)}
            />
          ) : savedOpen ? (
            <SavedScreen
              onBack={() => setSavedOpen(false)}
              onOpenPost={(postId) => {
                setSavedOpen(false);
                setViewPostId(postId);
              }}
            />
          ) : inboxOpen ? (
            <MessagesScreen
              startWith={messageTarget}
              onBack={() => {
                setInboxOpen(false);
                setMessageTarget(null);
              }}
            />
          ) : notificationsOpen ? (
            <NotificationsScreen onBack={() => setNotificationsOpen(false)} />
          ) : interestsOpen ? (
            <InterestsScreen onBack={() => setInterestsOpen(false)} />
          ) : commentsPostId !== null ? (
            <CommentsScreen postId={commentsPostId} postOwnerId={commentsPostOwnerId} onBack={() => setCommentsPostId(null)} />
          ) : settingsOpen ? (
            <SettingsScreen
              onBack={() => setSettingsOpen(false)}
              theme={theme}
              onThemeChange={setTheme}
              accentStart={accentStart}
              accentEnd={accentEnd}
              onAccentChange={setCustomAccent}
              onOpenSaved={() => {
                setSavedOpen(true);
              }}
              onOpenEditProfile={() => {
                setEditProfileOpen(true);
              }}
              onOpenArchive={() => {
                setArchiveOpen(true);
              }}
              onOpenActivity={() => {
                setActivityOpen(true);
              }}
              onOpenPeopleList={(kind) => {
                setPeopleList(kind);
              }}
              onOpenModeration={() => {
                setModerationOpen(true);
              }}
            />
          ) : viewPostId !== null ? (
            <PostDetailScreen
              postId={viewPostId}
              onBack={() => setViewPostId(null)}
              onOpenProfile={(userId) => {
                setViewPostId(null);
                setViewProfileId(userId);
              }}
              onOpenReport={(postId) => setReportPostId(postId)}
              onDeleted={() => {}}
            />
          ) : viewProfileId !== null ? (
            <ProfileScreen
              userId={viewProfileId}
              initialHighlightId={deepHighlight}
              onHighlightOpened={() => setDeepHighlight(null)}
              onMessage={(prof) => {
                setMessageTarget({ id: prof.id, username: prof.username, avatar_url: prof.avatar_url });
                setInboxOpen(true);
              }}
              onOpenPost={(postId) => setViewPostId(postId)}
              onBack={() => setViewProfileId(null)}
              onOpenProfile={(id) => setViewProfileId(id)}
              onOpenProfileFeed={({ posts, index, title }) =>
                setProfileFeed({ postIds: posts.map((x) => x.id), index, title })
              }
            />
          ) : active === "feed" ? (
            <FeedScreen
              onOpenMessages={() => setInboxOpen(true)}
              onOpenNotifications={() => setNotificationsOpen(true)}
              onOpenComments={(postId, ownerId) => {
                setCommentsPostId(postId);
                setCommentsPostOwnerId(ownerId);
              }}
              onOpenReport={(postId) => setReportPostId(postId)}
              onOpenProfile={(userId) => setViewProfileId(userId)}
              onOpenReel={(postId) => {
                setReelStartId(postId);
                setActive("reels");
              }}
            />
          ) : active === "reels" ? (
            <ReelsScreen
              key={reelStartId || "reels"}
              startReelId={reelStartId}
              onOpenReport={(postId) => setReportPostId(postId)}
              onOpenProfile={(userId) => setViewProfileId(userId)}
            />
          ) : active === "search" ? (
            <SearchScreen
              onOpenInterests={() => setInterestsOpen(true)}
              onOpenProfile={(userId) => setViewProfileId(userId)}
              onOpenPost={(postId) => setViewPostId(postId)}
            />
          ) : active === "profile" ? (
            <ProfileScreen
              key={profileRefresh}
              onOpenSettings={() => setSettingsOpen(true)}
              onOpenPost={(postId) => setViewPostId(postId)}
              onOpenProfile={(id) => setViewProfileId(id)}
              onOpenEditProfile={() => setEditProfileOpen(true)}
              onOpenActivity={() => setActivityOpen(true)}
              onOpenArchive={() => setArchiveOpen(true)}
              onOpenSaved={() => setSavedOpen(true)}
              onOpenPeopleList={(kind) => setPeopleList(kind)}
              onCreate={(kind) => {
                setUploadMode(kind === "reel" ? "reel" : "photo");
                setUploadNonce((n) => n + 1);
                setActive("upload");
              }}
              onOpenModeration={() => setModerationOpen(true)}
              onAddAccount={async () => {
                await supabase.auth.signOut();
              }}
              onSwitched={() => window.location.reload()}
              onOpenProfileFeed={({ posts, index, title }) =>
                setProfileFeed({ postIds: posts.map((x) => x.id), index, title })
              }
            />
          ) : active === "upload" ? (
            <UploadScreen key={`upload-${uploadNonce}`} initialMode={uploadMode} />
          ) : (
            <ActiveScreen />
          )}
        </ErrorBoundary>

        <NotificationPrompt userId={meId} />
        {timeNudge && (
          <TimeNudge
            kind={timeNudge.kind}
            minutes={timeNudge.minutes}
            onClose={() => setTimeNudge(null)}
            onSnooze={() => {
              snoozeUntilRef.current = Date.now() + 15 * 60 * 1000;
              if (timeNudge.kind === "limit") limitShownDayRef.current = "";
              setTimeNudge(null);
            }}
          />
        )}

        {/* Bottom nav */}
        {!overlayOpen && (
          <div
            className="flex items-center justify-around px-2 pt-3 shrink-0"
            style={{ background: "var(--bg)", borderTop: "1px solid var(--border-subtle)", paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    if (tab.key === "reels") setReelStartId(null);
                    if (tab.key === "upload" && active !== "upload") {
                      setUploadMode("photo");
                      setUploadNonce((n) => n + 1);
                    }
                    setActive(tab.key);
                  }}
                  className="flex flex-col items-center justify-center gap-1"
                  style={{ width: 44, height: 36 }}
                >
                  <Icon
                    size={23}
                    color={isActive ? "var(--accent-solid)" : "var(--text-muted)"}
                    strokeWidth={isActive ? 2.4 : 2}
                    fill={isActive && (tab.key === "feed" || tab.key === "profile") ? "var(--accent-solid)" : "none"}
                  />
                  <span
                    className="rounded-full"
                    style={{
                      width: 4,
                      height: 4,
                      background: isActive ? "var(--accent-solid)" : "transparent",
                      transition: "background 0.2s",
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
