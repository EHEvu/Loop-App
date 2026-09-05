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
  Eye,
  EyeOff,
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
  Archive,
  Crop,
  Users,
  Check,
  Copy,
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

// Caption with a real 2-line clamp and an Instagram-style more/less toggle.
// "more" only appears when the text actually overflows two lines (measured).
// `light` renders the toggle in a light colour for dark video overlays (Reels).
function CaptionText({ username, caption, onOpenProfile, light = false }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Compare full scroll height to the 2-line clamped height.
    const clampedHeight = el.clientHeight;
    const fullHeight = el.scrollHeight;
    setOverflows(fullHeight - clampedHeight > 2);
  }, [caption]);

  if (!caption) return null;

  const nameColor = light ? "#FFFFFF" : "var(--text)";
  const bodyColor = light ? "rgba(255,255,255,0.92)" : "var(--text)";
  const toggleColor = light ? "rgba(255,255,255,0.7)" : "var(--text-muted)";

  return (
    <div>
      <p
        ref={ref}
        className="text-sm"
        style={{
          color: bodyColor,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          display: expanded ? "block" : "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 2,
          WebkitBoxOrient: "vertical",
          overflow: expanded ? "visible" : "hidden",
          lineHeight: 1.4,
        }}
      >
        {username && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onOpenProfile?.();
            }}
            style={{ color: nameColor, fontWeight: 600, marginRight: 5 }}
          >
            {username}
          </span>
        )}
        {caption}
      </p>
      {(overflows || expanded) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="text-xs mt-0.5"
          style={{ color: toggleColor, fontWeight: 600 }}
        >
          {expanded ? "less" : "more"}
        </button>
      )}
    </div>
  );
}

// Long-press-triggered popup showing total Likes (and Views, for reels) —
// replaces a permanently-visible number next to the Like icon.
function LikesViewsPopup({ post, isOwner, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 z-50 rounded-2xl px-6 py-5 text-center"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", transform: "translate(-50%, -50%)", minWidth: 220 }}
      >
        <p className="text-sm mb-3" style={{ color: "var(--text)", fontWeight: 700 }}>Likes and Views</p>
        <div className="flex items-center justify-center gap-6">
          <div>
            <p className="text-lg" style={{ color: "var(--text)", fontWeight: 700 }}>
              {isOwner || !post.hide_likes ? formatCount(post.likeCount) : "—"}
            </p>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Likes</p>
          </div>
          {post.media_type === "reel" && (
            <div>
              <p className="text-lg" style={{ color: "var(--text)", fontWeight: 700 }}>{formatCount(post.views_count)}</p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Views</p>
            </div>
          )}
        </div>
        {!isOwner && post.hide_likes && (
          <p className="text-[10px] mt-3" style={{ color: "var(--text-muted)" }}>The creator hid the like count on this post.</p>
        )}
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
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${user.id}/${Date.now()}-${safeName}`;
    const { error: upErr } = await supabase.storage.from("stories").upload(path, file);
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
                <Eye size={15} /> {formatCount(meta.views)}
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
                  <SendHorizontal size={25} color="#FFFFFF" strokeWidth={1.9} />
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
              icon={<SendHorizontal size={17} color="var(--text)" />}
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

    setGroups(list);
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

function FeedScreen({ onOpenMessages, onOpenNotifications, onOpenComments, onOpenReport, onOpenProfile }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [userId, setUserId] = useState(null);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [likesPopupFor, setLikesPopupFor] = useState(null);
  const [commentSheetFor, setCommentSheetFor] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNotifications, setHasNotifications] = useState(false);
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

  const loadFeed = async () => {
    setLoading(true);
    setLoadError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("id, media_url, media_type, caption, created_at, user_id, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, views_count, location")
      .eq("archived", false)
      .order("created_at", { ascending: false });

    if (postsError) {
      setLoadError(postsError.message);
      setLoading(false);
      return;
    }

    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username");

    if (profilesError) {
      setLoadError(profilesError.message);
      setLoading(false);
      return;
    }

    const { data: likesData, error: likesError } = await supabase
      .from("likes")
      .select("post_id, user_id");

    if (likesError) {
      setLoadError(likesError.message);
      setLoading(false);
      return;
    }

    const { data: repostsData } = await supabase
      .from("reposts")
      .select("post_id, user_id");

    const { data: allSavesData } = await supabase
      .from("saves")
      .select("post_id");

    const { data: savesData } = await supabase
      .from("saves")
      .select("post_id, user_id")
      .eq("user_id", user?.id ?? "");

    const { data: commentsData } = await supabase.from("comments").select("post_id");

    const { data: tagsData } = await supabase.from("post_tags").select("post_id, tagged_user_id");

    const merged = (postsData || []).map((p) => {
      const profile = (profilesData || []).find((pr) => pr.id === p.user_id);
      const postLikes = (likesData || []).filter((l) => l.post_id === p.id);
      const postReposts = (repostsData || []).filter((r) => r.post_id === p.id);
      const postSaves = (allSavesData || []).filter((s) => s.post_id === p.id);
      const postComments = (commentsData || []).filter((c) => c.post_id === p.id);
      const postTags = (tagsData || [])
        .filter((t) => t.post_id === p.id)
        .map((t) => ({
          tagged_user_id: t.tagged_user_id,
          username: (profilesData || []).find((pr) => pr.id === t.tagged_user_id)?.username || "unknown",
        }));
      return {
        ...p,
        username: profile?.username || "unknown",
        likeCount: postLikes.length,
        liked: postLikes.some((l) => l.user_id === user?.id),
        repostCount: postReposts.length,
        reposted: postReposts.some((r) => r.user_id === user?.id),
        saved: (savesData || []).some((s) => s.post_id === p.id),
        saveCount: postSaves.length,
        commentCount: postComments.length,
        tags: postTags,
      };
    });

    setPosts(merged);
    setLoading(false);
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
  const savePressRef = React.useRef(null);
  const longPressedRef = React.useRef(false);

  const toggleSave = async (post) => {
    if (!userId) return;

    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, saved: !p.saved } : p))
    );

    if (post.saved) {
      await supabase.from("saves").delete().eq("post_id", post.id).eq("user_id", userId);
    } else {
      await supabase.from("saves").insert({ post_id: post.id, user_id: userId });
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

      {loading ? (
        <p className="text-center text-xs py-10" style={{ color: "var(--text-muted)" }}>
          Loading...
        </p>
      ) : loadError ? (
        <p className="text-center text-xs py-10 px-6" style={{ color: "var(--accent-start)" }}>
          {loadError}
        </p>
      ) : posts.length === 0 ? (
        <p className="text-center text-xs py-10" style={{ color: "var(--text-muted)" }}>
          No posts yet — be the first to post!
        </p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="mb-1">
            <div className="flex items-center gap-2.5 px-4 py-2.5">
              <button
                onClick={() => onOpenProfile(post.user_id)}
                className="shrink-0"
                style={{ width: 36, height: 36, borderRadius: "9999px", background: "linear-gradient(135deg, var(--ring-start) 0%, var(--ring-end) 100%)", padding: 2 }}
              >
                <div className="w-full h-full rounded-full flex items-center justify-center text-[11px]" style={{ background: "var(--bg)", color: "var(--text)", fontWeight: 600 }}>
                  {post.username[0].toUpperCase()}
                </div>
              </button>
              <div className="flex flex-col leading-tight flex-1 min-w-0">
                <button onClick={() => onOpenProfile(post.user_id)} className="text-[13px] text-left truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{post.username}</button>
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
                      <button
                        onClick={() => {
                          setMenuOpenFor(null);
                          setCollectionPost(post);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm"
                        style={{ color: "var(--text)", borderBottom: "1px solid var(--border)" }}
                      >
                        <Bookmark size={16} /> Save to collection
                      </button>
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
              className="w-full aspect-[4/5] overflow-hidden flex items-center justify-center"
              style={{ background: "var(--bg-sunken)" }}
              onDoubleClick={() => toggleLike(post)}
            >
              {post.media_type === "photo" ? (
                <img src={post.media_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <video src={post.media_url} className="w-full h-full object-cover" controls />
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
                    <Send size={23} color="var(--text)" strokeWidth={1.9} />
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
                    <Repeat2 size={25} color={post.reposted ? "var(--accent-solid)" : "var(--text)"} strokeWidth={post.reposted ? 2.6 : 1.9} />
                  </button>
                  <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                    {countPrefs.reposts && !post.hide_reposts && post.repostCount > 0 ? formatCount(post.repostCount) : "\u00A0"}
                  </span>
                </div>
              </div>
            </div>

            {likesPopupFor === post.id && (
              <LikesViewsPopup post={post} isOwner={post.user_id === userId} onClose={() => setLikesPopupFor(null)} />
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
        ))
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

function ReelsScreen({ onOpenReport, onOpenProfile }) {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [userId, setUserId] = useState(null);
  const [followingSet, setFollowingSet] = useState(new Set());
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
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

  const loadReels = async () => {
    setLoading(true);
    setLoadError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("id, media_url, media_type, caption, created_at, user_id, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, views_count, location")
      .eq("media_type", "reel")
      .eq("archived", false)
      .order("created_at", { ascending: false });

    if (postsError) {
      setLoadError(postsError.message);
      setLoading(false);
      return;
    }

    const { data: profilesData } = await supabase.from("profiles").select("id, username");
    const { data: likesData } = await supabase.from("likes").select("post_id, user_id");
    const { data: repostsData } = await supabase.from("reposts").select("post_id, user_id");
    const { data: savesData } = await supabase
      .from("saves")
      .select("post_id, user_id")
      .eq("user_id", user?.id ?? "");
    const { data: allSavesData } = await supabase.from("saves").select("post_id");
    const { data: commentsData } = await supabase.from("comments").select("post_id");
    const { data: followsData } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user?.id ?? "");
    const { data: tagsData } = await supabase.from("post_tags").select("post_id, tagged_user_id");

    setFollowingSet(new Set((followsData || []).map((f) => f.following_id)));

    const merged = (postsData || []).map((p) => {
      const profile = (profilesData || []).find((pr) => pr.id === p.user_id);
      const postLikes = (likesData || []).filter((l) => l.post_id === p.id);
      const postReposts = (repostsData || []).filter((r) => r.post_id === p.id);
      const postSaves = (allSavesData || []).filter((s) => s.post_id === p.id);
      const postComments = (commentsData || []).filter((c) => c.post_id === p.id);
      const postTags = (tagsData || [])
        .filter((t) => t.post_id === p.id)
        .map((t) => ({
          tagged_user_id: t.tagged_user_id,
          username: (profilesData || []).find((pr) => pr.id === t.tagged_user_id)?.username || "unknown",
        }));
      return {
        ...p,
        username: profile?.username || "unknown",
        likeCount: postLikes.length,
        liked: postLikes.some((l) => l.user_id === user?.id),
        repostCount: postReposts.length,
        reposted: postReposts.some((r) => r.user_id === user?.id),
        saved: (savesData || []).some((s) => s.post_id === p.id),
        saveCount: postSaves.length,
        commentCount: postComments.length,
        tags: postTags,
      };
    });

    setReels(merged);
    setIndex(0);
    setLoading(false);
  };

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
      // treat as a tap, not a swipe -> Instagram-style play/pause toggle
      togglePlay();
    }
  };

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

    if (wasSaved) {
      await supabase.from("saves").delete().eq("post_id", reel.id).eq("user_id", userId);
    } else {
      await supabase.from("saves").insert({ post_id: reel.id, user_id: userId });
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
      <div className="absolute inset-0" onDoubleClick={toggleLike}>
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
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <Play size={30} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
            </div>
          </div>
        )}
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

      {/* mute toggle — only shown while paused, per request */}
      {!playing && (
        <button
          onClick={() => setMuted((m) => !m)}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          className="absolute top-14 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-90"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          {muted ? <VolumeX size={19} color="#fff" /> : <Volume2 size={19} color="#fff" />}
        </button>
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
              <div className="w-full h-full rounded-full flex items-center justify-center text-[11px]" style={{ background: "rgba(20,20,20,0.9)", color: "#FFFFFF", fontWeight: 600 }}>
                {reel.username[0].toUpperCase()}
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
                <Repeat2 size={28} color="#FFFFFF" strokeWidth={reel.reposted ? 2.8 : 2} />
                {countPrefs.reposts && !reel.hide_reposts && reel.repostCount > 0 && (
                  <span className="text-[11px]" style={{ color: "#FFFFFF", fontWeight: 600 }}>{formatCount(reel.repostCount)}</span>
                )}
              </button>
              <button
                onClick={() => setShareReel(reel)}
                className="flex flex-col items-center gap-1 transition-transform active:scale-90"
                style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}
              >
                <SendHorizontal size={26} color="#FFFFFF" strokeWidth={2} />
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
            <LikesViewsPopup post={reel} isOwner={reel.user_id === userId} onClose={() => setLikesPopupOpen(false)} />
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
            onClick={() => setExpanded((v) => !v)}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-90"
            style={{
              background: reel.liked ? ACCENT : "rgba(0,0,0,0.4)",
              backdropFilter: reel.liked ? "none" : "blur(8px)",
              border: reel.liked ? "none" : "1px solid rgba(255,255,255,0.18)",
              boxShadow: reel.liked ? "0 4px 16px rgba(0,0,0,0.35)" : "none",
            }}
          >
            {expanded ? (
              <Ellipsis size={20} color={reel.liked ? "var(--on-accent)" : "#FFFFFF"} />
            ) : (
              <Heart size={20} color={reel.liked ? "var(--on-accent)" : "#FFFFFF"} fill={reel.liked ? "var(--on-accent)" : "none"} />
            )}
          </button>
        </div>
      </div>

      {/* swipe progress — a slim windowed indicator on the right edge.
          Only ~7 dots are ever drawn so a long reel list can't run off screen,
          and it sits mid-height so it never collides with the mute button. */}
      {reels.length > 1 && (
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-none">
          {(() => {
            const WINDOW = 7;
            const half = Math.floor(WINDOW / 2);
            let start = Math.max(0, Math.min(index - half, reels.length - WINDOW));
            if (start < 0) start = 0;
            const end = Math.min(reels.length, start + WINDOW);
            return reels.slice(start, end).map((_, k) => {
              const i = start + k;
              const active = i === index;
              return (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 3,
                    height: active ? 16 : 5,
                    background: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)",
                    transition: "height 0.22s ease, background 0.22s ease",
                  }}
                />
              );
            });
          })()}
        </div>
      )}

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

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    setLoading(true);
    const { data: commentsData } = await supabase
      .from("comments")
      .select("id, user_id, content, created_at, parent_id")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    const { data: profilesData } = await supabase.from("profiles").select("id, username");
    const { data: reactionsData } = await supabase.from("comment_reactions").select("comment_id, user_id, type");

    const merged = (commentsData || []).map((c) => {
      const profile = (profilesData || []).find((p) => p.id === c.user_id);
      const reactions = (reactionsData || []).filter((r) => r.comment_id === c.id);
      const myReaction = reactions.find((r) => r.user_id === currentUserId)?.type ?? null;
      return {
        ...c,
        username: profile?.username || "unknown",
        likeCount: reactions.filter((r) => r.type === "like").length,
        dislikeCount: reactions.filter((r) => r.type === "dislike").length,
        myReaction,
      };
    });

    setComments(merged);
    setLoading(false);
  };

  const submitComment = async () => {
    const trimmed = text.trim();
    if (!trimmed || !currentUserId || posting) return;
    setPosting(true);

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: currentUserId,
      content: trimmed,
      parent_id: replyingTo?.id ?? null,
    });

    setPosting(false);
    if (!error) {
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
    if (comment.user_id !== currentUserId) return;
    if (!window.confirm("Delete this comment?")) return;
    setComments((prev) => prev.filter((c) => c.id !== comment.id && c.parent_id !== comment.id));
    await supabase.from("comments").delete().eq("id", comment.id);
    setMenuFor(null);
  };

  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
    setMenuFor(null);
  };

  const saveEdit = async (comment) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, content: trimmed } : c)));
    setEditingId(null);
    await supabase.from("comments").update({ content: trimmed }).eq("id", comment.id);
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

        <div className="flex-1 overflow-y-auto px-4 pt-3" onClick={() => setMenuFor(null)}>
          {loading ? (
            <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>Loading...</p>
          ) : topLevel.length === 0 ? (
            <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>No comments yet</p>
          ) : (
            topLevel.map((c) => (
              <div key={c.id} className="mb-3">
                <CommentRow
                  comment={c}
                  isPinned={c.user_id === postOwnerId}
                  isOwn={c.user_id === currentUserId}
                  isEditing={editingId === c.id}
                  editText={editText}
                  onEditTextChange={setEditText}
                  onSaveEdit={() => saveEdit(c)}
                  onCancelEdit={() => setEditingId(null)}
                  onReact={(type) => setReaction(c, type)}
                  onReply={() => setReplyingTo(c)}
                  menuOpen={menuFor === c.id}
                  onOpenMenu={() => setMenuFor(menuFor === c.id ? null : c.id)}
                  onEdit={() => startEdit(c)}
                  onDelete={() => deleteComment(c)}
                  onCopy={() => copyComment(c)}
                  onReport={() => reportComment(c)}
                />
                {repliesOf(c.id).map((r) => (
                  <div key={r.id} className="ml-9 mt-2">
                    <CommentRow
                      comment={r}
                      isPinned={r.user_id === postOwnerId}
                      isOwn={r.user_id === currentUserId}
                      isEditing={editingId === r.id}
                      editText={editText}
                      onEditTextChange={setEditText}
                      onSaveEdit={() => saveEdit(r)}
                      onCancelEdit={() => setEditingId(null)}
                      onReact={(type) => setReaction(r, type)}
                      onReply={() => setReplyingTo(c)}
                      menuOpen={menuFor === r.id}
                      onOpenMenu={() => setMenuFor(menuFor === r.id ? null : r.id)}
                      onEdit={() => startEdit(r)}
                      onDelete={() => deleteComment(r)}
                      onCopy={() => copyComment(r)}
                      onReport={() => reportComment(r)}
                    />
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="px-4 pt-2 pb-4" style={{ borderTop: "1px solid var(--border)" }}>
          {commentsDisabled ? (
            <p className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>Comments are off for this post.</p>
          ) : (
            <>
              {replyingTo && (
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Replying to {replyingTo.username}</span>
                  <button onClick={() => setReplyingTo(null)}><X size={12} color="var(--text-muted)" /></button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Add a comment..."
                  rows={1}
                  className="flex-1 rounded-2xl px-3.5 py-2.5 text-sm outline-none resize-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", maxHeight: 110 }}
                />
                <button
                  disabled={posting}
                  onClick={() => showCommentUploadHint()}
                  title="Photo/GIF upload — coming soon"
                  className="pb-2"
                >
                  <ImagePlus size={19} color="var(--text-muted)" />
                </button>
                <button
                  onClick={submitComment}
                  disabled={posting || !text.trim()}
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

function showCommentUploadHint() {
  alert("Photo/GIF upload in comments — coming soon");
}

function CommentRow({
  comment,
  isPinned,
  isOwn,
  isEditing,
  editText,
  onEditTextChange,
  onSaveEdit,
  onCancelEdit,
  onReact,
  onReply,
  menuOpen,
  onOpenMenu,
  onEdit,
  onDelete,
  onCopy,
  onReport,
}) {
  const pressTimer = React.useRef(null);
  const openedAtRef = React.useRef(0);

  const startPress = () => {
    pressTimer.current = setTimeout(() => {
      openedAtRef.current = Date.now();
      onOpenMenu();
    }, 500);
  };
  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <div
      className="relative flex items-start gap-2.5"
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
      onContextMenu={(e) => {
        e.preventDefault();
        openedAtRef.current = Date.now();
        onOpenMenu();
      }}
    >
      <div className="w-7 h-7 rounded-full shrink-0" style={{ background: ACCENT, padding: 1.5 }}>
        <div className="w-full h-full rounded-full bg-[var(--bg)] flex items-center justify-center text-[9px]" style={{ color: "var(--text)" }}>
          {comment.username[0].toUpperCase()}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs" style={{ color: "var(--text)", fontWeight: 700 }}>{comment.username}</span>
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{timeAgo(comment.created_at)}</span>
          {isPinned && (
            <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "var(--border)", color: "var(--text-muted)" }}>Author</span>
          )}
        </div>

        {isEditing ? (
          <div className="mt-1">
            <textarea
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              rows={1}
              className="w-full rounded-lg px-2 py-1.5 text-xs outline-none resize-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <div className="flex items-center gap-3 mt-1">
              <button onClick={onSaveEdit} className="text-[10px]" style={{ color: "var(--accent-start)", fontWeight: 700 }}>Save</button>
              <button onClick={onCancelEdit} className="text-[10px]" style={{ color: "var(--text-muted)" }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>{comment.content}</p>
            <div className="flex items-center gap-3 mt-1">
              <button onClick={onReply} className="text-[10px]" style={{ color: "var(--text-muted)" }}>Reply</button>
              {isOwn && (
                <button onClick={onEdit} className="text-[10px]" style={{ color: "var(--text-muted)" }}>Edit</button>
              )}
              {comment.likeCount > 0 && (
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{comment.likeCount} likes</span>
              )}
              {comment.dislikeCount > 0 && (
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{comment.dislikeCount} dislikes</span>
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col items-center gap-2 pt-0.5">
        <button onClick={() => onReact("like")}>
          <Heart size={13} color={comment.myReaction === "like" ? "var(--heart)" : "var(--text-muted)"} fill={comment.myReaction === "like" ? "var(--heart)" : "none"} />
        </button>
        <button onClick={() => onReact("dislike")}>
          <ThumbsDown size={12} color={comment.myReaction === "dislike" ? "var(--accent-end)" : "var(--text-muted)"} fill={comment.myReaction === "dislike" ? "var(--accent-end)" : "none"} />
        </button>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              if (Date.now() - openedAtRef.current < 400) return;
              onOpenMenu();
            }}
          />
          <div
            className="absolute right-8 top-6 z-50 rounded-xl overflow-hidden py-1"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", minWidth: 150 }}
          >
            {isOwn && (
              <button onClick={onEdit} className="w-full flex items-center gap-2 px-4 py-2 text-xs" style={{ color: "var(--text)" }}>
                <Pencil size={13} /> Edit
              </button>
            )}
            {isOwn && (
              <button onClick={onDelete} className="w-full flex items-center gap-2 px-4 py-2 text-xs" style={{ color: "var(--text)" }}>
                <Trash2 size={13} /> Delete
              </button>
            )}
            <button onClick={onCopy} className="w-full flex items-center gap-2 px-4 py-2 text-xs" style={{ color: "var(--text)" }}>
              <Copy size={13} /> Copy
            </button>
            <button onClick={onReply} className="w-full flex items-center gap-2 px-4 py-2 text-xs" style={{ color: "var(--text)" }}>
              <MessageCircle size={13} /> Reply
            </button>
            {!isOwn && (
              <button onClick={onReport} className="w-full flex items-center gap-2 px-4 py-2 text-xs" style={{ color: "var(--accent-start)" }}>
                Report
              </button>
            )}
          </div>
        </>
      )}

    </div>
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
      .select("id, media_url, media_type, caption")
      .eq("archived", false)
      .order("created_at", { ascending: false })
      .limit(48);
    setExplore(data || []);
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
    setResults(data || []);
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
              {p.media_type !== "photo" && (
                <span className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }}>
                  <Video size={13} color="#FFFFFF" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadScreen() {
  const [mode, setMode] = useState("photo");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [hideLikes, setHideLikes] = useState(false);
  const [hideComments, setHideComments] = useState(false);
  const [hideRepostsSaves, setHideRepostsSaves] = useState(false);
  const [turnOffComments, setTurnOffComments] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [pollEnabled, setPollEnabled] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError("");
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl(null);
    setCaption("");
    setLocation("");
    setHideLikes(false);
    setHideComments(false);
    setHideRepostsSaves(false);
    setTurnOffComments(false);
    setTagInput("");
    setPollEnabled(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setSuccess(false);
  };

  const handleShare = async () => {
    setError("");
    if (!file) {
      setError("Choose a photo or video first");
      return;
    }
    if (pollEnabled) {
      const filledOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
      if (!pollQuestion.trim() || filledOptions.length < 2) {
        setError("A poll needs a question and at least 2 options");
        return;
      }
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

    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(filePath, file);

    if (uploadError) {
      setUploading(false);
      setError(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("posts").getPublicUrl(filePath);

    const { data: insertedPost, error: insertError } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        media_url: publicUrl,
        media_type: mode,
        caption,
        location: location.trim() || null,
        hide_likes: hideLikes,
        hide_comments: hideComments,
        hide_reposts: hideRepostsSaves,
        hide_saves: hideRepostsSaves,
        comments_disabled: turnOffComments,
      })
      .select("id")
      .single();

    if (insertError) {
      setUploading(false);
      setError(insertError.message);
      return;
    }

    // Best-effort: tag people — from the dedicated field AND any @username
    // written directly in the caption (skips silently if a username isn't found)
    const captionMentions = (caption.match(/@([a-zA-Z0-9_.]+)/g) || []).map((m) => m.slice(1));
    const usernames = [
      ...tagInput.split(/[,\s]+/).map((u) => u.replace(/^@/, "").trim()),
      ...captionMentions,
    ].filter(Boolean);
    const uniqueUsernames = [...new Set(usernames)];
    if (uniqueUsernames.length > 0) {
      try {
        const { data: matchedProfiles } = await supabase
          .from("profiles")
          .select("id, username")
          .in("username", uniqueUsernames);
        if (matchedProfiles && matchedProfiles.length > 0) {
          await supabase.from("post_tags").insert(
            matchedProfiles.map((p) => ({ post_id: insertedPost.id, tagged_user_id: p.id }))
          );
        }
      } catch (e) {
        // Tagging is best-effort — never block publishing over it
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
        <p className="text-sm mb-4" style={{ color: "var(--text)", fontWeight: 600 }}>
          Posted!
        </p>
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
            <ImageIcon size={16} /> Photo
          </button>
          <button
            onClick={() => {
              setMode("reel");
              setFile(null);
              setPreviewUrl(null);
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

        <label
          className="rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 mb-4 overflow-hidden"
          style={{ background: "var(--surface)", border: "1.5px dashed var(--toggle-off)" }}
        >
          <input
            type="file"
            accept={mode === "photo" ? "image/*" : "video/*"}
            onChange={handleFileChange}
            className="hidden"
          />
          {previewUrl ? (
            mode === "photo" ? (
              <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <video src={previewUrl} className="w-full h-full object-cover" controls />
            )
          ) : (
            <>
              {mode === "photo" ? <ImageIcon size={28} color="var(--text-muted)" /> : <Video size={28} color="var(--text-muted)" />}
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {mode === "photo" ? "Choose a photo" : "Choose a video"}
              </span>
            </>
          )}
        </label>

        <textarea
          placeholder="Write a caption... (use @username to tag someone)"
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

        <div
          className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm mb-4"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <span className="text-sm" style={{ color: "var(--text-muted)", fontWeight: 700 }}>@</span>
          <input
            type="text"
            placeholder="Tag people (e.g. nilufar.k, rafiq.tech)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>

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
            ["Hide Like Count For This Post", hideLikes, setHideLikes],
            ["Hide Comment Count For This Post", hideComments, setHideComments],
            ["Hide Repost/Share/Save Count For This Post", hideRepostsSaves, setHideRepostsSaves],
            ["Turn Off Comments", turnOffComments, setTurnOffComments],
          ].map(([label, value, setValue], i) => (
            <button
              key={label}
              onClick={() => setValue(!value)}
              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
              style={{ color: "var(--text)", borderTop: i > 0 ? "1px solid var(--border)" : "none", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>{label}</span>
              <span className="rounded-full shrink-0" style={{ width: 34, height: 19, background: value ? ACCENT : "var(--toggle-off)", position: "relative" }}>
                <span className="rounded-full bg-white absolute" style={{ width: 15, height: 15, top: 2, left: value ? 17 : 2, transition: "left 0.15s" }} />
              </span>
            </button>
          ))}
        </div>

        {error && (
          <p className="text-xs mb-3" style={{ color: "var(--accent-start)" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleShare}
          disabled={uploading}
          className="w-full rounded-xl py-3 text-sm"
          style={{ background: ACCENT, color: "var(--on-accent)", fontWeight: 700, opacity: uploading ? 0.7 : 1 }}
        >
          {uploading ? "Uploading..." : "Share"}
        </button>
      </div>
    </div>
  );
}

function SettingsScreen({ onBack, theme, onThemeChange, accentStart, accentEnd, onAccentChange, onOpenSaved }) {
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

        <div className="text-[10px] uppercase tracking-wide mb-1.5 px-1" style={{ color: "var(--text-muted)" }}>Your content</div>
        <div className="rounded-xl overflow-hidden mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <button onClick={onOpenSaved} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm" style={{ color: "var(--text)" }}>
            <Bookmark size={16} color="var(--text-muted)" />
            <span>Saved</span>
          </button>
        </div>

        <div className="text-[10px] uppercase tracking-wide mb-1.5 px-1" style={{ color: "var(--text-muted)" }}>Account</div>
        <div className="rounded-xl overflow-hidden mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <button onClick={() => setView("editProfile")} className="w-full text-left px-4 py-3 text-sm" style={{ color: "var(--text)", borderBottom: "1px solid var(--border)" }}>
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
      .select("id, media_url, media_type, caption, location, user_id, created_at, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, pinned, archived, views_count")
      .eq("id", postId)
      .single();

    if (error || !p) {
      setLoadError(error?.message || "Post not found");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("id, username").eq("id", p.user_id).single();
    const { data: likes } = await supabase.from("likes").select("user_id").eq("post_id", postId);
    const { data: reposts } = await supabase.from("reposts").select("user_id").eq("post_id", postId);
    const { data: allSaves } = await supabase.from("saves").select("user_id").eq("post_id", postId);
    const { data: comments } = await supabase.from("comments").select("id").eq("post_id", postId);
    const { data: tagsData } = await supabase.from("post_tags").select("tagged_user_id");

    setPost({
      ...p,
      username: profile?.username || "unknown",
      likeCount: (likes || []).length,
      liked: (likes || []).some((l) => l.user_id === user?.id),
      repostCount: (reposts || []).length,
      reposted: (reposts || []).some((r) => r.user_id === user?.id),
      saveCount: (allSaves || []).length,
      saved: (allSaves || []).some((s) => s.user_id === user?.id),
      commentCount: (comments || []).length,
      tags: tagsData || [],
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
    if (was) {
      await supabase.from("saves").delete().eq("post_id", post.id).eq("user_id", userId);
    } else {
      await supabase.from("saves").insert({ post_id: post.id, user_id: userId });
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
              <div className="w-full h-full rounded-full flex items-center justify-center text-[11px]" style={{ background: "var(--bg)", color: "var(--text)", fontWeight: 600 }}>
                {post.username[0].toUpperCase()}
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
        style={{ background: "var(--bg-sunken)", aspectRatio: "4/5" }}
        onDoubleClick={toggleLike}
      >
        {post.media_type === "photo" ? (
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
              <Send size={23} color="var(--text)" strokeWidth={1.9} />
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
              <Repeat2 size={25} color={post.reposted ? "var(--accent-solid)" : "var(--text)"} strokeWidth={post.reposted ? 2.6 : 1.9} />
            </button>
            <span className="text-[11px] leading-none h-3 mt-1" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
              {countPrefs.reposts && !post.hide_reposts && post.repostCount > 0 ? formatCount(post.repostCount) : "\u00A0"}
            </span>
          </div>
        </div>
      </div>

      {likesPopupOpen && (
        <LikesViewsPopup post={post} isOwner={isOwner} onClose={() => setLikesPopupOpen(false)} />
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

function ProfileScreen({ userId, onOpenSettings, onOpenPost, onBack }) {
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

  const tabOrder = ["posts", "reposts", "tagged"];
  const mockTagged = Array.from({ length: 6 }, (_, i) => i);
  const gridFor = tab === "posts" ? posts : tab === "reposts" ? reposts : mockTagged;
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
      .select("id, username, full_name, bio, avatar_url")
      .eq("id", targetId)
      .single();
    setProfile(profileData);

    const isViewingOwnPosts = user && user.id === targetId;

    let postsQuery = supabase
      .from("posts")
      .select("id, media_url, media_type, caption, location, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, pinned, archived")
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

    setLoading(false);
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

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="-ml-1.5 p-1 shrink-0 transition-transform active:scale-90"><ChevronLeft size={24} color="var(--text)" /></button>
          )}
          <span className="text-base" style={{ color: "var(--text)", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
            {profile.username}
          </span>
        </div>
        {isOwnProfile ? (
          <button onClick={onOpenSettings}>
            <Settings size={20} color="var(--text)" />
          </button>
        ) : (
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
      </div>

      <div className="flex items-center gap-6 px-4 mb-3">
        <div
          className="shrink-0 rounded-full flex items-center justify-center"
          style={{ width: 88, height: 88, background: "linear-gradient(135deg, var(--ring-start) 0%, var(--ring-end) 100%)", padding: 3 }}
        >
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center" style={{ background: "var(--surface)", border: "3px solid var(--bg)" }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl" style={{ color: "var(--text)", fontWeight: 700 }}>
                {profile.username[0].toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 flex justify-around">
          <div className="flex flex-col items-center">
            <span className="text-[17px]" style={{ color: "var(--text)", fontWeight: 700 }}>{posts.length}</span>
            <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[17px]" style={{ color: "var(--text)", fontWeight: 700 }}>{formatCount(followerCount)}</span>
            <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[17px]" style={{ color: "var(--text)", fontWeight: 700 }}>{formatCount(followingCount)}</span>
            <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Following</span>
          </div>
        </div>
      </div>

      <div className="px-4 mb-3">
        <p className="text-[13px]" style={{ color: "var(--text)", fontWeight: 700 }}>
          {profile.full_name || profile.username}
        </p>
        {profile.bio && (
          <p className="text-[13px] mt-0.5" style={{ color: "var(--text)", whiteSpace: "pre-wrap", lineHeight: 1.4 }}>{profile.bio}</p>
        )}
      </div>

      {isOwnProfile && (
        <div className="px-4 mb-4">
          <button
            onClick={onOpenSettings}
            className="w-full rounded-xl py-2 text-[13px] transition-transform active:scale-[0.98]"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600 }}
          >
            Edit Profile
          </button>
        </div>
      )}

      <div
        className="flex items-center justify-around mb-0.5"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => setTab("posts")}
          className="flex-1 flex items-center justify-center py-2.5"
          style={{ borderBottom: tab === "posts" ? "1.5px solid var(--text)" : "1.5px solid transparent" }}
        >
          <Grid3x3 size={23} color={tab === "posts" ? "var(--text)" : "var(--text-muted)"} strokeWidth={tab === "posts" ? 2.2 : 1.8} />
        </button>
        <button
          onClick={() => setTab("reposts")}
          className="flex-1 flex items-center justify-center py-2.5"
          style={{ borderBottom: tab === "reposts" ? "1.5px solid var(--text)" : "1.5px solid transparent" }}
        >
          <Repeat2 size={24} color={tab === "reposts" ? "var(--text)" : "var(--text-muted)"} strokeWidth={tab === "reposts" ? 2.2 : 1.8} />
        </button>
        <button
          onClick={() => setTab("tagged")}
          className="flex-1 flex items-center justify-center py-2.5"
          style={{ borderBottom: tab === "tagged" ? "1.5px solid var(--text)" : "1.5px solid transparent" }}
        >
          <UserSquare2 size={23} color={tab === "tagged" ? "var(--text)" : "var(--text-muted)"} strokeWidth={tab === "tagged" ? 2.2 : 1.8} />
        </button>
      </div>

      <div
        className="grid grid-cols-3 gap-0.5 px-0.5"
        style={{ minHeight: 280 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {tab === "tagged" ? (
          mockTagged.map((i) => (
            <div
              key={i}
              className="aspect-square flex items-center justify-center relative"
              style={{ background: i % 3 === 0 ? "var(--surface)" : "var(--border-subtle)" }}
            >
              <ImageIcon size={18} color="var(--toggle-off)" />
              <UserSquare2 size={12} color="var(--accent-end)" className="absolute top-1.5 right-1.5" />
            </div>
          ))
        ) : gridFor.length === 0 ? (
          <div className="col-span-3 py-10 text-center">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {tab === "posts" ? "No posts yet" : "No reposts yet"}
            </span>
          </div>
        ) : (
          gridFor.map((p) => (
            <button
              key={p.id}
              onClick={() => onOpenPost?.(p.id)}
              className="aspect-square flex items-center justify-center relative overflow-hidden"
              style={{ background: "var(--surface)" }}
            >
              {p.media_type === "photo" ? (
                <img src={p.media_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <video src={p.media_url} className="w-full h-full object-cover" />
              )}
              {tab === "reposts" && (
                <Repeat2 size={12} color="var(--accent-end)" className="absolute top-1.5 right-1.5" />
              )}
              {tab === "posts" && p.pinned && (
                <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.55)" }}>
                  <Pin size={10} color="var(--accent-end)" />
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
    setConversations(merged);
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
        <StoryMenuRow icon={<SendHorizontal size={17} color="var(--text)" />} label="Send in Loop" onClick={() => setSendOpen(true)} />
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
      {post.media_type !== "photo" && (
        <span className="absolute top-1.5 right-1.5" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }}>
          <Video size={13} color="#FFFFFF" />
        </span>
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
      .select("id, media_url, media_type, caption, created_at")
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
      .select("id, media_url, media_type, created_at")
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
  const visibleMessages = q
    ? messages.filter((m) => !m.deleted && (m.content || "").toLowerCase().includes(q))
    : messages;

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

    setNotifications(merged);
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
      await supabase.from("reports").insert({
        post_id: postId,
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

    const { data: profilesData } = await supabase.from("profiles").select("id, username");

    const merged = (commentsData || []).map((c) => ({
      ...c,
      username: (profilesData || []).find((p) => p.id === c.user_id)?.username || "unknown",
    }));

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
        <button onClick={onToggle} type="button">
          {revealed ? <EyeOff size={17} color="var(--text-muted)" /> : <Eye size={17} color="var(--text-muted)" />}
        </button>
      )}
    </div>
  );
}

function LoginScreen({ onLogin, onGoSignup }) {
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

export default function App() {
  const [authScreen, setAuthScreen] = useState("login"); // "login" | "signup" | null
  const [checkingSession, setCheckingSession] = useState(true);
  const [active, setActive] = useState("feed");
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
  const overlayOpen = inboxOpen || notificationsOpen || interestsOpen || commentsPostId !== null || reportPostId !== null || viewProfileId !== null || settingsOpen || viewPostId !== null || savedOpen;

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthScreen(session ? null : "login");
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthScreen(session ? null : "login");
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
            <LoginScreen onLogin={() => setAuthScreen(null)} onGoSignup={() => setAuthScreen("signup")} />
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
        <ErrorBoundary key={active + String(inboxOpen) + String(notificationsOpen) + String(interestsOpen) + String(commentsPostId) + String(reportPostId) + String(viewProfileId) + String(settingsOpen) + String(viewPostId) + String(savedOpen)}>
          {savedOpen ? (
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
          ) : reportPostId !== null ? (
            <ReportScreen postId={reportPostId} onBack={() => setReportPostId(null)} />
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
            <ProfileScreen userId={viewProfileId} onOpenPost={(postId) => setViewPostId(postId)} onBack={() => setViewProfileId(null)} />
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
            />
          ) : active === "reels" ? (
            <ReelsScreen
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
            <ProfileScreen onOpenSettings={() => setSettingsOpen(true)} onOpenPost={(postId) => setViewPostId(postId)} />
          ) : (
            <ActiveScreen />
          )}
        </ErrorBoundary>

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
                  onClick={() => setActive(tab.key)}
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
