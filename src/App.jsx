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
  render() {
    if (this.state.error) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
          <p className="text-sm mb-2" style={{ color: "var(--accent-start)", fontWeight: 700 }}>Something went wrong</p>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)", wordBreak: "break-word" }}>
            {String(this.state.error?.message || this.state.error)}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            className="text-xs px-4 py-2 rounded-full"
            style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700 }}
          >
            Try again
          </button>
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
    <div className="rounded-full shrink-0 overflow-hidden flex items-center justify-center" style={{ width: size, height: size, background: "linear-gradient(135deg, var(--ring-start) 0%, var(--ring-end) 100%)", padding: avatarUrl ? 0 : 2 }}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
      ) : (
        <div className="w-full h-full rounded-full bg-[var(--surface)] flex items-center justify-center" style={{ color: "var(--text)", fontSize: size * 0.4, fontWeight: 600 }}>
          {letter}
        </div>
      )}
    </div>
  );
}

// Caption the way Instagram shows it: one line, cut with "… more" at the very
// end of that line; tapping it opens the whole caption with "less" at the end.
// "more" only appears when there really is more (measured, or a line break).
// `light` renders it for dark video overlays (Reels).
function CaptionText({ username, caption, onOpenProfile, light = false }) {
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
        {caption}{" "}
        <button onClick={toggle} style={{ color: toggleColor, fontWeight: 500 }}>
          less
        </button>
      </p>
    );
  }

  const showMore = overflows || hasMoreLines;
  return (
    <div className="flex items-baseline text-sm" style={{ lineHeight: 1.4 }} onClick={showMore ? toggle : undefined}>
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

// Share: a curved arrow heading out to the right.
function ShareIcon({ size = 24, color = "currentColor", strokeWidth = 1.9, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" {...rest}>
      <path d="M14 4.5 20.5 11 14 17.5" />
      <path d="M20.5 11H11a7.5 7.5 0 0 0-7.5 7.5v1" />
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
function TaggedPeopleLine({ tags, onOpenProfile }) {
  if (!tags || tags.length === 0) return null;
  return (
    <p className="text-[11px] mb-1" style={{ color: "var(--text-muted)" }}>
      with{" "}
      {tags.map((t, i) => (
        <React.Fragment key={t.tagged_user_id}>
          <button onClick={() => onOpenProfile?.(t.tagged_user_id)} style={{ color: "var(--text)", fontWeight: 600 }}>
            @{t.username}
          </button>
          {i < tags.length - 1 ? ", " : ""}
        </React.Fragment>
      ))}
    </p>
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
  const [view, setView] = useState("menu"); // "menu" | "edit"
  const [busyField, setBusyField] = useState(null);
  const [menuError, setMenuError] = useState("");
  const [editCaption, setEditCaption] = useState(post.caption || "");
  const [editLocation, setEditLocation] = useState(post.location || "");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

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
            {view === "edit" ? "Edit" : "Post options"}
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
            <MenuRow icon={<Pencil size={16} color="var(--text)" />} label="Edit" onClick={() => setView("edit")} />
            <MenuRow
              icon={<Crop size={16} color="var(--text)" />}
              label="Adjust preview"
              onClick={() => alert("Adjust preview — coming soon. This app stores one image per post, so there's no second frame to pick from yet.")}
            />

            <div className="h-px my-1.5" style={{ background: "var(--border)" }} />
            <MenuRow icon={<Trash2 size={16} color="var(--accent-start)" />} label="Delete" onClick={handleDelete} danger />
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
          <SendHorizontal size={22} color="var(--text)" />
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
      <video ref={ref} src={post.media_url} className="w-full h-full object-cover" muted={muted} loop playsInline preload="metadata" />
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
    const [mediaMap, { data: likesData }, { data: repostsData }, { data: savesData }, { data: commentsData }, { data: tagsData }] = await Promise.all([
      fetchPostMediaMap(ids),
      supabase.from("likes").select("post_id, user_id").in("post_id", ids),
      supabase.from("reposts").select("post_id, user_id").in("post_id", ids),
      supabase.from("saves").select("post_id, user_id").in("post_id", ids),
      supabase.from("comments").select("post_id").in("post_id", ids),
      supabase.from("post_tags").select("post_id, tagged_user_id").in("post_id", ids),
    ]);
    const peopleIds = [...new Set([...rows.map((p) => p.user_id), ...(tagsData || []).map((t) => t.tagged_user_id)])];
    const { data: profilesData } = await supabase.from("profiles").select("id, username, avatar_url").in("id", peopleIds);
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
      };
    });
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
          .select("id, media_url, media_type, media_count, caption, created_at, user_id, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, views_count, location, aspect_ratio")
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
        const visible = batch.filter((p) => !isHiddenFromFeed(rel, p.user_id)).map((p) => ({ ...p, suggested: st.phase === "suggested" }));
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
      prev.map((p) => (p.id === post.id ? { ...p, saved: !p.saved } : p))
    );

    const { error } = post.saved
      ? await supabase.from("saves").delete().eq("post_id", post.id).eq("user_id", userId)
      : await supabase.from("saves").insert({ post_id: post.id, user_id: userId });

    if (error) {
      // Put the icon back where it was — a bookmark that looks saved but
      // isn't is worse than an honest failure.
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, saved: post.saved } : p)));
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
          {/* accounts strip after the 3rd post from people you follow (or at the top) */}
          {postIndex === Math.min(3, followingCount) && (
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
          {postIndex === followingCount + 4 && <SuggestedReelsStrip reels={suggestedReels} onOpenReel={onOpenReel} />}
          <div className="mb-1">
            <div className="flex items-center gap-2.5 px-4 py-2.5">
              <button
                onClick={() => onOpenProfile(post.user_id)}
                className="shrink-0"
                style={{ width: 36, height: 36, borderRadius: "9999px", background: "linear-gradient(135deg, var(--ring-start) 0%, var(--ring-end) 100%)", padding: 2 }}
              >
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-[11px]" style={{ background: "var(--bg)", color: "var(--text)", fontWeight: 600 }}>
                  {post.avatarUrl ? (
                    <img src={post.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    post.username[0].toUpperCase()
                  )}
                </div>
              </button>
              <div className="flex flex-col leading-tight flex-1 min-w-0">
                <button onClick={() => onOpenProfile(post.user_id)} className="text-[13px] text-left truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{post.username}</button>
                {post.suggested && (
                  <span className="text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>Suggested for you</span>
                )}
                {post.location && (
                  <span className="flex items-center gap-0.5 text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>
                    <MapPin size={9} /> {post.location}
                  </span>
                )}
              </div>

              <div className="relative">
                <button onClick={() => setMenuOpenFor(menuOpenFor === post.id ? null : post.id)} className="p-1 -mr-1">
                  <Ellipsis size={19} color="var(--text)" />
                </button>
                {menuOpenFor === post.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpenFor(null)}
                    />
                    <div
                      className="absolute right-0 top-8 z-20 rounded-2xl overflow-hidden py-1"
                      style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", minWidth: 190, boxShadow: "0 8px 28px rgba(0,0,0,0.35)" }}
                    >
                      {post.user_id === userId ? (
                        <button
                          onClick={() => deletePost(post)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm"
                          style={{ color: "var(--heart)", fontWeight: 600 }}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setMenuOpenFor(null);
                            onOpenReport(post.id);
                          }}
                          className="w-full text-left px-4 py-3 text-sm"
                          style={{ color: "var(--heart)", fontWeight: 600 }}
                        >
                          Report
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div
              className="w-full overflow-hidden flex items-center justify-center"
              style={{ background: "var(--bg-sunken)", aspectRatio: postAspectCss(post) }}
            >
              {post.media && post.media.length > 1 ? (
                <FeedPhotoTap onLike={() => !post.liked && toggleLike(post)}>
                  <PostMediaCarousel media={post.media} />
                </FeedPhotoTap>
              ) : post.media_type === "photo" ? (
                <FeedPhotoTap onLike={() => !post.liked && toggleLike(post)}>
                  <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                </FeedPhotoTap>
              ) : (
                <FeedVideo post={post} onOpenReel={onOpenReel} onLike={() => !post.liked && toggleLike(post)} />
              )}
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
              <TaggedPeopleLine tags={post.tags} onOpenProfile={onOpenProfile} />
              <CaptionText
                username={post.username}
                caption={post.caption}
                onOpenProfile={() => onOpenProfile?.(post.user_id)}
              />
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
      {!loading && posts.length > 0 && posts.length <= followingCount + 4 && !loadingMore && feedRef.current.done && (
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

      {commentSheetFor && (
        <ReelCommentsSheet
          postId={commentSheetFor.id}
          postOwnerId={commentSheetFor.user_id}
          currentUserId={userId}
          postUsername={commentSheetFor.username}
          postCaption={commentSheetFor.caption}
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
    const [{ data: likesData }, { data: repostsData }, { data: savesData }, { data: commentsData }, { data: tagsData }] = await Promise.all([
      supabase.from("likes").select("post_id, user_id").in("post_id", ids),
      supabase.from("reposts").select("post_id, user_id").in("post_id", ids),
      supabase.from("saves").select("post_id, user_id").in("post_id", ids),
      supabase.from("comments").select("post_id").in("post_id", ids),
      supabase.from("post_tags").select("post_id, tagged_user_id").in("post_id", ids),
    ]);
    const peopleIds = [...new Set([...rows.map((p) => p.user_id), ...(tagsData || []).map((t) => t.tagged_user_id)])];
    const { data: profilesData } = await supabase.from("profiles").select("id, username, avatar_url").in("id", peopleIds);
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
      };
    });
  };

  const REEL_COLS = "id, media_url, media_type, caption, created_at, user_id, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, views_count, location";

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

    setReels((prev) => prev.map((r, i) => (i === index ? { ...r, saved: !wasSaved } : r)));

    const { error } = wasSaved
      ? await supabase.from("saves").delete().eq("post_id", reel.id).eq("user_id", userId)
      : await supabase.from("saves").insert({ post_id: reel.id, user_id: userId });

    if (error) {
      setReels((prev) => prev.map((r, i) => (i === index ? { ...r, saved: wasSaved } : r)));
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
            <div className="w-9 h-9 rounded-full shrink-0" style={{ background: "linear-gradient(135deg, var(--ring-start) 0%, var(--ring-end) 100%)", padding: 2 }}>
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-[11px]" style={{ background: "rgba(20,20,20,0.9)", color: "#FFFFFF", fontWeight: 600 }}>
                {reel.avatarUrl ? (
                  <img src={reel.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  reel.username[0].toUpperCase()
                )}
              </div>
            </div>
            <span className="text-[13px] truncate" style={{ color: "#FFFFFF", fontWeight: 600 }}>{reel.username}</span>
          </button>
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
        <TaggedPeopleLine tags={reel.tags} onOpenProfile={onOpenProfile} />
        <CaptionText caption={reel.caption} light />
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
      .select("id, user_id, content, image_url, created_at, parent_id, edited_at")
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
    setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, content: trimmed, edited_at: new Date().toISOString() } : c)));
    setEditingId(null);
    const { error } = await supabase.from("comments").update({ content: trimmed }).eq("id", comment.id);
    if (error) {
      setComments((prev) => prev.map((c) => (c.id === comment.id ? comment : c)));
      alert(error.message.includes("15 minutes") ? "Comments can only be edited within 15 minutes of posting." : error.message);
    }
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
  const topLevel = comments
    .filter((c) => !c.parent_id)
    .slice()
    .sort((a, b) => {
      const aOwner = a.user_id === postOwnerId ? 0 : 1;
      const bOwner = b.user_id === postOwnerId ? 0 : 1;
      if (aOwner !== bOwner) return aOwner - bOwner;
      return new Date(a.created_at) - new Date(b.created_at);
    });
  const repliesOf = (id) => comments.filter((c) => c.parent_id === id);

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

        {postCaption && (
          <button
            onClick={() => onOpenProfile?.(postOwnerId)}
            className="text-left px-4 pb-3 flex items-start gap-2.5"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <div className="w-7 h-7 rounded-full shrink-0" style={{ background: ACCENT, padding: 1.5 }}>
              <div className="w-full h-full rounded-full bg-[var(--bg)] flex items-center justify-center text-[9px]" style={{ color: "var(--text)" }}>
                {(postUsername || "u")[0].toUpperCase()}
              </div>
            </div>
            <p className="text-xs" style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
              <span style={{ fontWeight: 700, color: "var(--text)" }}>{postUsername} </span>
              {postCaption}
            </p>
          </button>
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

// Comment text with @names shown bold and tappable.
function MentionText({ text, onMention }) {
  if (!text) return null;
  const parts = text.split(/(@[a-zA-Z0-9_.]+)/g);
  return parts.map((part, i) =>
    /^@[a-zA-Z0-9_.]+$/.test(part) ? (
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
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
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
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {timeAgo(comment.created_at)}
            {comment.edited_at ? " · Edited" : ""}
          </span>
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
              autoFocus
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
              {comment.dislikeCount > 0 && (
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {comment.dislikeCount} {comment.dislikeCount === 1 ? "dislike" : "dislikes"}
                </span>
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col items-center shrink-0" style={{ width: 34 }}>
        <button onClick={() => onReact("like")} className="flex flex-col items-center p-1 transition-transform active:scale-90" aria-label="Like comment">
          <Heart size={19} color={comment.myReaction === "like" ? "var(--heart)" : "var(--text-muted)"} fill={comment.myReaction === "like" ? "var(--heart)" : "none"} strokeWidth={1.9} />
          <span className="text-[11px] leading-none mt-0.5" style={{ color: "var(--text-muted)", minHeight: 11 }}>
            {comment.likeCount > 0 ? formatCount(comment.likeCount) : ""}
          </span>
        </button>
        <button onClick={() => onReact("dislike")} className="p-1 mt-0.5 transition-transform active:scale-90" aria-label="Dislike comment">
          <ThumbsDown size={17} color={comment.myReaction === "dislike" ? "var(--accent-end)" : "var(--text-muted)"} fill={comment.myReaction === "dislike" ? "var(--accent-end)" : "none"} strokeWidth={1.9} />
        </button>
      </div>
    </div>
  );
}

// Long-press sheet for a comment.
function CommentActionSheet({ comment, isOwn, isPostOwner, onClose, onReply, onCopy, onEdit, onDelete, onReport }) {
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

function SearchScreen({ onOpenInterests, onOpenProfile, onOpenPost }) {
  const [query, setQuery] = useState("");
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
      .select("id, user_id, media_url, media_type, media_count, caption, created_at")
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accounts"
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

      {query ? (
        <div className="px-4">
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
                onClick={() => onOpenProfile(a.id)}
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
              {p.media_type === "photo" ? (
                <img src={p.media_url} alt="" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <video src={p.media_url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
              )}
              {p.media_count > 1 ? (
                <span className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }}>
                  <Layers size={13} color="#FFFFFF" />
                </span>
              ) : (
                p.media_type !== "photo" && (
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

// Tag people: search by username, pick from the list, shown as chips.
function TagPeoplePicker({ value, onChange }) {
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
    if (value.length >= 20) return;
    onChange([...value, p]);
    setQ("");
    setResults([]);
  };

  return (
    <div className="rounded-xl mb-4 overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <UserPlus size={15} color="var(--text-muted)" />
        <span className="text-sm flex-1" style={{ color: "var(--text)", fontWeight: 600 }}>Tag people</span>
        {value.length > 0 && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{value.length}</span>
        )}
      </div>
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
      <div className="px-3 pb-2.5">
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

function UploadScreen() {
  const [mode, setMode] = useState("photo");
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
  const [aspect, setAspect] = useState("4:5");
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
    setAspect("4:5");
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

    let coverUrl;
    let carouselUploads = null; // set only when items.length > 1

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
      coverUrl = publicUrl;
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
      coverUrl = publicUrl;
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
      coverUrl = carouselUploads[0].url;
    }

    const { data: insertedPost, error: insertError } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        media_url: coverUrl,
        // A carousel is a feed post regardless of what its individual slides
        // are — only single-video uploads through Reel mode ever get tagged
        // "reel", matching how Reels actually work on Instagram.
        media_type: mode,
        aspect_ratio: mode === "reel" ? "9:16" : aspect,
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
              <video src={previewUrl} className="w-full h-full object-cover" controls />
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

        <textarea
          placeholder="Write a caption..."
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-sm mb-3 outline-none resize-none"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
        />

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

        <TagPeoplePicker value={taggedPeople} onChange={setTaggedPeople} />

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
              <video src={thumb} className="w-full h-full object-cover" muted playsInline preload="metadata" />
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

function SettingsScreen({ onBack, theme, onThemeChange, accentStart, accentEnd, onAccentChange, onOpenSaved, onOpenEditProfile }) {
  const [view, setView] = useState("menu"); // "menu" | "editProfile" | "changeEmail" | "changePassword" | "appearance"
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
      .select("id, username, full_name, bio, avatar_url")
      .eq("id", user.id)
      .single();
    setProfile(data);
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
        <Header title="Change Email" back={() => setView("menu")} />
        <div className="px-4 pt-5">
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
            {emailBusy ? "Sending..." : "Update Email"}
          </button>
        </div>
      </div>
    );
  }

  if (view === "changePassword") {
    return (
      <div className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
        <Header title="Change Password" back={() => setView("menu")} />
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

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
      <Header title="Settings" back={onBack} />

      <div className="px-4 pt-3">
        <div className="text-[10px] uppercase tracking-wide mb-1.5 px-1" style={{ color: "var(--text-muted)" }}>Appearance</div>
        <div className="rounded-xl overflow-hidden mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <button onClick={() => setView("appearance")} className="w-full flex items-center justify-between px-4 py-3 text-sm" style={{ color: "var(--text)" }}>
            <span>Theme & Colour</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{theme === "light" ? "Light" : theme === "bangladesh" ? "Bangladesh" : "Dark"}</span>
          </button>
        </div>

        <div className="text-[10px] uppercase tracking-wide mb-1.5 px-1" style={{ color: "var(--text-muted)" }}>How you use Loop</div>
        <div className="rounded-xl overflow-hidden mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <button onClick={() => setView("notifications")} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm" style={{ color: "var(--text)" }}>
            <Bell size={16} color="var(--text-muted)" />
            <span>Notifications</span>
          </button>
        </div>

        <div className="text-[10px] uppercase tracking-wide mb-1.5 px-1" style={{ color: "var(--text-muted)" }}>Your content</div>
        <div className="rounded-xl overflow-hidden mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <button onClick={onOpenSaved} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm" style={{ color: "var(--text)" }}>
            <Bookmark size={16} color="var(--text-muted)" />
            <span>Saved</span>
          </button>
        </div>

        <div className="text-[10px] uppercase tracking-wide mb-1.5 px-1" style={{ color: "var(--text-muted)" }}>Account</div>
        <div className="rounded-xl overflow-hidden mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <button onClick={() => (onOpenEditProfile ? onOpenEditProfile() : setView("editProfile"))} className="w-full text-left px-4 py-3 text-sm" style={{ color: "var(--text)", borderBottom: "1px solid var(--border)" }}>
            Edit Profile
          </button>
          <button onClick={() => setView("changeEmail")} className="w-full text-left px-4 py-3 text-sm" style={{ color: "var(--text)", borderBottom: "1px solid var(--border)" }}>
            Change Email
          </button>
          <button onClick={() => setView("changePassword")} className="w-full text-left px-4 py-3 text-sm" style={{ color: "var(--text)" }}>
            Change Password
          </button>
        </div>

        <div className="rounded-xl overflow-hidden mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm" style={{ color: "var(--accent-start)", fontWeight: 600 }}>
            Log Out
          </button>
        </div>
      </div>
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
      .select("id, media_url, media_type, media_count, caption, location, user_id, created_at, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, pinned, archived, views_count, aspect_ratio")
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
    const { data: tagsData } = await supabase.from("post_tags").select("tagged_user_id");

    setPost({
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
    });
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
            <div
              className="shrink-0"
              style={{ width: 36, height: 36, borderRadius: "9999px", background: "linear-gradient(135deg, var(--ring-start) 0%, var(--ring-end) 100%)", padding: 2 }}
            >
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-[11px]" style={{ background: "var(--bg)", color: "var(--text)", fontWeight: 600 }}>
                {post.avatarUrl ? (
                  <img src={post.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  post.username[0].toUpperCase()
                )}
              </div>
            </div>
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
        className="w-full flex items-center justify-center"
        style={{ background: "var(--bg-sunken)", aspectRatio: postAspectCss(post) }}
        onDoubleClick={toggleLike}
      >
        {post.media && post.media.length > 1 ? (
          <PostMediaCarousel media={post.media} />
        ) : post.media_type === "photo" ? (
          <img src={post.media_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <video src={post.media_url} className="w-full h-full object-cover" controls />
        )}
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
        <TaggedPeopleLine tags={post.tags} onOpenProfile={onOpenProfile} />
        <CaptionText
          username={post.username}
          caption={post.caption}
          onOpenProfile={() => onOpenProfile?.(post.user_id)}
        />
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

function recordTimeSpent(seconds) {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const data = readTimeSpent();
    data[day] = (data[day] || 0) + seconds;
    // Keep a fortnight; older days aren't shown anywhere.
    const keep = Object.keys(data).sort().slice(-14);
    const trimmed = {};
    keep.forEach((k) => (trimmed[k] = data[k]));
    localStorage.setItem(TIME_KEY, JSON.stringify(trimmed));
  } catch {}
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
      .select("id, media_url, media_type, media_count, created_at")
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
      .select("id, media_url, media_type, media_count, created_at")
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
function ShareProfileSheet({ profile, currentUserId, onClose }) {
  const [qr, setQr] = useState("");
  const [flash, setFlash] = useState("");
  const [sendOpen, setSendOpen] = useState(false);

  const link = `${window.location.origin}/u/${profile.username}`;

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(link, { width: 220, margin: 1, errorCorrectionLevel: "M" })
      .then((url) => !cancelled && setQr(url))
      .catch(() => !cancelled && setQr(""));
    return () => {
      cancelled = true;
    };
  }, [link]);

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

      <div className="flex flex-col items-center pb-4">
        <div className="rounded-3xl p-4 flex items-center justify-center" style={{ background: "#FFFFFF", minWidth: 252, minHeight: 252 }}>
          {qr ? <img src={qr} alt="Profile QR code" width={220} height={220} /> : <span className="text-xs" style={{ color: "#666" }}>Generating...</span>}
        </div>
        <span className="text-sm mt-3" style={{ color: "var(--text)", fontWeight: 700 }}>@{profile.username}</span>
        <span className="text-[11px] mt-0.5 px-8 text-center" style={{ color: "var(--text-muted)", wordBreak: "break-all" }}>{link}</span>
      </div>

      <div className="pb-6">
        <StoryMenuRow icon={<Copy size={17} color="var(--text)" />} label="Copy link" onClick={copy} />
        <StoryMenuRow icon={<ShareIcon size={17} color="var(--text)" />} label="Send in Loop" onClick={() => setSendOpen(true)} />
        <StoryMenuRow icon={<Share2 size={17} color="var(--text)" />} label="Share to..." onClick={share} />
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
// A video avatar (10 seconds or less) plays on the profile header. Everywhere
// else in the app shows a still, so a frame is captured from the video at
// upload time and stored as the normal avatar_url — no other screen needs
// to know videos exist.
const AVATAR_VIDEO_MAX_SECONDS = 10;

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
        .select("username, full_name, bio, avatar_url, avatar_video_url, links, gender")
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
        // Birthday lives in its own owner-only table so nobody else can read it.
        supabase
          .from("profile_private")
          .select("birthday")
          .eq("user_id", currentUserId)
          .maybeSingle()
          .then(({ data: priv }) => setBirthday(priv?.birthday || ""));
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
      .upsert({ user_id: currentUserId, birthday: birthday || null }, { onConflict: "user_id" });
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

        <label className="text-[11px] block mb-1.5" style={{ color: "var(--text-muted)" }}>Birthday</label>
        <input
          type="date"
          value={birthday}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full rounded-2xl px-4 h-12 text-sm outline-none"
          style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)", colorScheme: "dark light" }}
        />
        <p className="text-[11px] mt-1 mb-4" style={{ color: "var(--text-muted)" }}>
          Private — it won't appear on your profile.
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
        .select("id, user_id, media_url, media_type, media_count, caption, location, created_at, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, pinned, archived, aspect_ratio, removed_at, removed_reason")
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
                className="w-full flex items-center justify-center"
                style={{ background: "var(--bg-sunken)", aspectRatio: postAspectCss(post) }}
                onDoubleClick={() => !post.liked && toggleLike(post)}
              >
                {post.media && post.media.length > 1 ? (
                  <PostMediaCarousel media={post.media} />
                ) : post.media_type === "photo" ? (
                  <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <video src={post.media_url} className="w-full h-full object-cover" controls playsInline preload="metadata" />
                )}
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
                <TaggedPeopleLine tags={post.tags} onOpenProfile={onOpenProfile} />
                <CaptionText
                  username={post.username}
                  caption={post.caption}
                  onOpenProfile={() => onOpenProfile?.(post.user_id)}
                />
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

// ---- Story highlights on the profile ----
// The rows come from story_highlights / story_highlight_items, which the
// story viewer has been writing into all along — this is the shelf that
// was missing.
function HighlightsRow({ profileId, isOwn, onOpen, onNew }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data: hs } = await supabase
      .from("story_highlights")
      .select("id, title, cover_url")
      .eq("user_id", profileId)
      .order("created_at", { ascending: false });

    const ids = (hs || []).map((h) => h.id);
    let firstStory = {};
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
          if (!firstStory[l.highlight_id] && byId[l.story_id]) firstStory[l.highlight_id] = byId[l.story_id];
        });
      }
    }

    setItems(
      (hs || []).map((h) => ({
        ...h,
        preview: h.cover_url || (firstStory[h.id]?.media_type === "photo" ? firstStory[h.id].media_url : null),
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [profileId]);

  if (loading) return null;
  if (items.length === 0 && !isOwn) return null;

  return (
    <div className="flex gap-4 px-4 pb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
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
          onClick={() => onOpen(h)}
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
              {h.preview ? (
                <img src={h.preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <Star size={20} color="var(--text-muted)" />
              )}
            </div>
          </div>
          <span className="text-[11px] truncate w-full text-center" style={{ color: "var(--text)" }}>{h.title}</span>
        </button>
      ))}
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
                  <video src={st.media_url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
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

function ProfileScreen({ userId, onOpenModeration, onOpenSettings, onOpenPost, onBack, onOpenProfile, onOpenProfileFeed, onOpenHighlight, onAddStory, onOpenProfileStory, onOpenEditProfile, onOpenActivity, onOpenArchive, onOpenSaved, onOpenPeopleList, onAddAccount, onSwitched, onCreate }) {
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
  const avatarInputRef = React.useRef(null);
  const avatarPressRef = React.useRef(null);
  const avatarLongRef = React.useRef(false);

  const tabOrder = ["posts", "reels", "reposts", "tagged"];
  // Reels are just video posts — no separate table, so split by media_type.
  // A carousel is never a Reel, even if its cover happens to be a video —
  // the media_count guard keeps carousels out of this split.
  const reels = posts.filter((p) => p.media_type !== "photo" && (p.media_count || 1) <= 1);
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
      .select("id, username, full_name, bio, avatar_url, avatar_video_url, note, note_created_at, links, gender, is_private")
      .eq("id", targetId)
      .single();
    setProfile(profileData);

    const isViewingOwnPosts = user && user.id === targetId;

    let postsQuery = supabase
      .from("posts")
      .select("id, media_url, media_type, media_count, caption, location, created_at, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, pinned, archived, removed_at, removed_reason")
      .eq("user_id", targetId);
    if (!isViewingOwnPosts) {
      postsQuery = postsQuery.eq("archived", false);
    }
    const { data: postsData } = await postsQuery.order("created_at", { ascending: false });
    const sortedPosts = (postsData || []).slice().sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return 0;
    });
    setPosts(sortedPosts);

    const { data: repostsData } = await supabase
      .from("reposts")
      .select("post_id")
      .eq("user_id", targetId);

    if (repostsData && repostsData.length > 0) {
      const postIds = repostsData.map((r) => r.post_id);
      const { data: repostedPosts } = await supabase
        .from("posts")
        .select("id, media_url, media_type")
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
        .select("id, media_url, media_type")
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
            <button onClick={() => setSheet("menu")} className="transition-transform active:scale-90">
              <SlidersHorizontal size={21} color="var(--text)" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            {!myRel.blocked && (
              <button
                onClick={toggleFollow}
                disabled={followBusy}
                className="rounded-lg px-5 py-1.5 text-[13px] transition-transform active:scale-[0.98]"
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
            )}
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
              if (isOwnProfile) onAddStory?.();
              else onOpenProfileStory?.(profile.id);
            }}
            onTouchStart={() => {
              if (!isOwnProfile) return;
              avatarLongRef.current = false;
              avatarPressRef.current = setTimeout(() => {
                avatarLongRef.current = true;
                setSheet("avatar");
              }, 500);
            }}
            onTouchEnd={() => clearTimeout(avatarPressRef.current)}
            onTouchMove={() => clearTimeout(avatarPressRef.current)}
            onContextMenu={(e) => {
              if (!isOwnProfile) return;
              e.preventDefault();
              avatarLongRef.current = true;
              setSheet("avatar");
            }}
            className="rounded-full flex items-center justify-center transition-transform active:scale-95"
            style={{ width: 88, height: 88, background: "linear-gradient(135deg, var(--ring-start) 0%, var(--ring-end) 100%)", padding: 3 }}
          >
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center" style={{ background: "var(--surface)", border: "3px solid var(--bg)" }}>
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
        {profile.bio && (
          <p className="text-[13px] mt-0.5" style={{ color: "var(--text)", whiteSpace: "pre-wrap", lineHeight: 1.4 }}>{profile.bio}</p>
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
        isOwn={isOwnProfile}
        onNew={() => setSheet("newHighlight")}
        onOpen={(h) => onOpenHighlight?.(h)}
      />

      <div
        className="flex items-center justify-around mb-0.5"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {tabOrder.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 flex items-center justify-center py-3 transition-transform active:scale-95"
            style={{ borderBottom: tab === t ? "1.5px solid var(--text)" : "1.5px solid transparent" }}
          >
            <ProfileTabIcon kind={t} active={tab === t} />
          </button>
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
              {p.media_type === "photo" ? (
                <img src={p.media_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <video src={p.media_url} className="w-full h-full object-cover" />
              )}
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
                (tab === "reels" || (tab === "posts" && p.media_type !== "photo")) && (
                  <span className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }}>
                    <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
                  </span>
                )
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
              </>
            )}
          </div>
        </StorySheetShell>
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
        <ShareProfileSheet profile={profile} currentUserId={myId} onClose={() => setSheet(null)} />
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
                onAddStory?.();
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

function MessagesScreen({ onBack }) {
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
const CHAT_THEMES = [
  { key: "default", name: "Default",   bubble: "linear-gradient(135deg, var(--accent-start) 0%, var(--accent-end) 100%)", on: "var(--on-accent)" },
  { key: "sunset",  name: "Sunset",    bubble: "linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)", on: "#3A1A0E" },
  { key: "ocean",   name: "Ocean",     bubble: "linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)", on: "#04222B" },
  { key: "forest",  name: "Forest",    bubble: "linear-gradient(135deg, #134E5E 0%, #71B280 100%)", on: "#08201A" },
  { key: "berry",   name: "Berry",     bubble: "linear-gradient(135deg, #B24592 0%, #F15F79 100%)", on: "#2E0B22" },
  { key: "mono",    name: "Monochrome",bubble: "linear-gradient(135deg, #434343 0%, #000000 100%)", on: "#FFFFFF" },
  { key: "citrus",  name: "Citrus",    bubble: "linear-gradient(135deg, #F7971E 0%, #FFD200 100%)", on: "#2E1E00" },
  { key: "lavender",name: "Lavender",  bubble: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)", on: "#FFFFFF" },
  { key: "mint",    name: "Mint",      bubble: "linear-gradient(135deg, #00B09B 0%, #96C93D 100%)", on: "#04241E" },
  { key: "rose",    name: "Rose",      bubble: "linear-gradient(135deg, #ED4264 0%, #FFEDBC 100%)", on: "#33060F" },
];

// System stacks only — no extra webfont downloads, so nothing flashes
// or blocks while a chat opens.
const CHAT_FONTS = [
  { key: "default",   name: "Default",   stack: "inherit" },
  { key: "sora",      name: "Sora",      stack: "'Sora', sans-serif" },
  { key: "cinzel",    name: "Cinzel",    stack: "'Cinzel', serif" },
  { key: "serif",     name: "Serif",     stack: "Georgia, 'Times New Roman', serif" },
  { key: "mono",      name: "Mono",      stack: "'Courier New', ui-monospace, monospace" },
  { key: "rounded",   name: "Rounded",   stack: "'Trebuchet MS', 'Segoe UI', sans-serif" },
  { key: "classic",   name: "Classic",   stack: "'Palatino Linotype', Palatino, serif" },
  { key: "wide",      name: "Wide",      stack: "Verdana, Geneva, sans-serif" },
  { key: "condensed", name: "Condensed", stack: "'Arial Narrow', Arial, sans-serif" },
  { key: "playful",   name: "Playful",   stack: "'Comic Sans MS', 'Segoe UI', cursive" },
];

const themeOf = (key) => CHAT_THEMES.find((t) => t.key === key) || CHAT_THEMES[0];
const fontOf = (key) => CHAT_FONTS.find((f) => f.key === key) || CHAT_FONTS[0];

function CustomiseSheet({ conversationId, theme, font, onClose, onApplied }) {
  const [pickedTheme, setPickedTheme] = useState(theme || "default");
  const [pickedFont, setPickedFont] = useState(font || "default");
  const [preview, setPreview] = useState(false);
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
    <StorySheetShell title="Customise chat" onClose={onClose}>
      {error && <p className="text-xs px-4 pb-2" style={{ color: "var(--heart)" }}>{error}</p>}

      {preview && (
        <div className="mx-4 mb-3 rounded-2xl p-3" style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", fontFamily: f.stack }}>
          <div className="flex justify-start mb-2">
            <div className="px-3.5 py-2 text-sm" style={{ background: "var(--surface)", color: "var(--text)", borderRadius: "16px 16px 16px 4px", border: "1px solid var(--border)" }}>
              How does this look?
            </div>
          </div>
          <div className="flex justify-end">
            <div className="px-3.5 py-2 text-sm" style={{ background: t.bubble, color: t.on, borderRadius: "16px 16px 4px 16px" }}>
              Looks great 🔥
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 px-4">
        {/* Theme — left */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] mb-2 uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.4px" }}>Theme</p>
          <div className="flex flex-col gap-1.5" style={{ maxHeight: 250, overflowY: "auto" }}>
            {CHAT_THEMES.map((th) => (
              <button
                key={th.key}
                onClick={() => setPickedTheme(th.key)}
                className="flex items-center gap-2 rounded-xl px-2 py-2 text-left"
                style={{
                  background: pickedTheme === th.key ? "var(--bg-sunken)" : "transparent",
                  border: pickedTheme === th.key ? "1px solid var(--accent-solid)" : "1px solid transparent",
                }}
              >
                <span className="rounded-full shrink-0" style={{ width: 22, height: 22, background: th.bubble }} />
                <span className="text-xs truncate" style={{ color: "var(--text)" }}>{th.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font — right */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] mb-2 uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.4px" }}>Font</p>
          <div className="flex flex-col gap-1.5" style={{ maxHeight: 250, overflowY: "auto" }}>
            {CHAT_FONTS.map((ft) => (
              <button
                key={ft.key}
                onClick={() => setPickedFont(ft.key)}
                className="rounded-xl px-2.5 py-2 text-left"
                style={{
                  background: pickedFont === ft.key ? "var(--bg-sunken)" : "transparent",
                  border: pickedFont === ft.key ? "1px solid var(--accent-solid)" : "1px solid transparent",
                  fontFamily: ft.stack,
                }}
              >
                <span className="text-xs truncate block" style={{ color: "var(--text)" }}>{ft.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2.5 px-4 pt-4 pb-6">
        <button
          onClick={() => setPreview((v) => !v)}
          className="flex-1 rounded-full h-11 text-sm transition-transform active:scale-95"
          style={{ background: "var(--bg-sunken)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600 }}
        >
          {preview ? "Hide preview" : "Preview"}
        </button>
        <button
          onClick={apply}
          disabled={busy}
          className="flex-1 rounded-full h-11 text-sm transition-transform active:scale-95"
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
  const label = item.media_type === "photo" ? "📷 Shared a post" : "🎬 Shared a reel";

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
      image_url: item.media_type === "photo" ? item.media_url : null,
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
      {post.media_type === "photo" ? (
        <img src={post.media_url} alt="" className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <video src={post.media_url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
      )}
      {post.media_count > 1 ? (
        <span className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }}>
          <Layers size={13} color="#FFFFFF" />
        </span>
      ) : (
        post.media_type !== "photo" && (
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
  const coverChoices = posts.filter((p) => p.media_type === "photo");

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
      .select("id, media_url, media_type, media_count, caption, created_at")
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
      const { data } = await supabase.from("posts").select("id, media_url, media_type").in("id", postIds);
      (data || []).forEach((m) => (media[m.id] = m));
    }
    setCollections(
      merged.map((c) => {
        const mine = items.filter((i) => i.collection_id === c.id);
        const first = mine.map((i) => media[i.post_id]).find(Boolean);
        return { ...c, count: mine.length, previewUrl: c.cover_url || first?.media_url || null, previewType: first?.media_type };
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
      .select("id, media_url, media_type, media_count, created_at")
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
                    c.previewType === "photo" || c.cover_url ? (
                      <img src={c.previewUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <video src={c.previewUrl} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                    )
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
  const visibleMessages = q
    ? afterBlocks.filter((m) => !m.deleted && (m.content || "").toLowerCase().includes(q))
    : afterBlocks;

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
              <span className="text-[11px] shrink-0" style={{ color: "var(--text-muted)" }}>
                {visibleMessages.length}
              </span>
            )}
          </div>
        </div>
      )}

      {/* messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-3"
        onClick={() => {
          setMenuFor(null);
          setPickerFor(null);
        }}
      >
        {loading ? (
          <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : visibleMessages.length === 0 ? (
          <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
            {q ? "No messages match that" : "No messages yet — say hi 👋"}
          </p>
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

            return (
              <div key={m.id} className={`flex flex-col mb-2 ${mine ? "items-end" : "items-start"}`}>
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
      .select("id, type, actor_id, created_at")
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
      .select("id, username")
      .in("id", actorIds);

    const merged = notifData.map((n) => ({
      ...n,
      username: (profilesData || []).find((p) => p.id === n.actor_id)?.username || "unknown",
    }));

    const rel = await getRelations();
    setNotifications(merged.filter((n) => !isBlockedEither(rel, n.actor_id)));
    setLoading(false);
  };

  const actionText = (type) =>
    type === "like"
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
    type === "like"
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
                <div className="w-11 h-11 rounded-full shrink-0" style={{ background: ACCENT, padding: 2 }}>
                  <div className="w-full h-full rounded-full bg-[var(--bg)] flex items-center justify-center text-xs" style={{ color: "var(--text)" }}>
                    {n.username[0].toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: "var(--text)" }}>
                    <span style={{ fontWeight: 600 }}>{n.username}</span> {actionText(n.type)}
                  </p>
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
  const [myBan, setMyBan] = useState(null); // { until, reason } while suspended
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
  const overlayOpen = inboxOpen || notificationsOpen || interestsOpen || commentsPostId !== null || reportPostId !== null || viewProfileId !== null || settingsOpen || viewPostId !== null || savedOpen || profileFeed !== null || editProfileOpen || activityOpen || archiveOpen || peopleList !== null || moderationOpen || !!myBan;

  React.useEffect(() => {
    // A reset link lands here with "type=recovery" in the URL. Check it up
    // front too — the PASSWORD_RECOVERY event and getSession() can resolve in
    // either order, and getSession alone would just log the person straight in.
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
      <div className="w-full min-h-screen flex items-center justify-center" data-theme={theme} style={{ background: "var(--page-bg)", ...rootVarOverrides }}>
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
      <div className="w-full min-h-screen flex items-center justify-center" data-theme={theme} style={{ background: "var(--page-bg)", ...rootVarOverrides }}>
        <style>{THEME_CSS}</style>
        <div
          className="flex flex-col w-full max-w-[390px] h-[780px] overflow-hidden relative"
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
    <div className="w-full min-h-screen flex items-center justify-center" data-theme={theme} style={{ background: "var(--page-bg)", ...rootVarOverrides }}>
      <style>{THEME_CSS}</style>
      <div
        className="flex flex-col w-full max-w-[390px] h-[780px] overflow-hidden relative"
        style={{ background: "var(--bg)", borderRadius: 36, border: "8px solid var(--page-bg)" }}
      >
        <ErrorBoundary key={active + String(inboxOpen) + String(notificationsOpen) + String(interestsOpen) + String(commentsPostId) + String(reportPostId) + String(viewProfileId) + String(settingsOpen) + String(viewPostId) + String(savedOpen) + String(profileFeed !== null) + String(editProfileOpen) + String(activityOpen) + String(archiveOpen) + String(peopleList) + String(profileRefresh) + String(moderationOpen)}>
          {myBan ? (
            <SuspendedScreen ban={myBan} onLogout={() => supabase.auth.signOut()} />
          ) : moderationOpen ? (
            <ModerationScreen onBack={() => setModerationOpen(false)} />
          ) : reportPostId !== null ? (
            <ReportScreen postId={reportPostId} onBack={() => setReportPostId(null)} />
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
            <MessagesScreen onBack={() => setInboxOpen(false)} />
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
                setSettingsOpen(false);
                setSavedOpen(true);
              }}
              onOpenEditProfile={() => {
                setSettingsOpen(false);
                setEditProfileOpen(true);
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
              onCreate={() => setActive("upload")}
              onOpenModeration={() => setModerationOpen(true)}
              onAddAccount={async () => {
                await supabase.auth.signOut();
              }}
              onSwitched={() => window.location.reload()}
              onOpenProfileFeed={({ posts, index, title }) =>
                setProfileFeed({ postIds: posts.map((x) => x.id), index, title })
              }
            />
          ) : (
            <ActiveScreen />
          )}
        </ErrorBoundary>

        <NotificationPrompt userId={meId} />

        {/* Bottom nav */}
        {!overlayOpen && (
          <div
            className="flex items-center justify-around px-2 py-3 shrink-0"
            style={{ background: "var(--bg)", borderTop: "1px solid var(--border-subtle)" }}
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    if (tab.key === "reels") setReelStartId(null);
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
