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
} from "lucide-react";

// ---- Design tokens ----
// bg: var(--bg) (deep aubergine-black)  card: var(--surface)
// accent: var(--accent-start) (coral) -> var(--accent-end) (amber) gradient
// text: var(--text) (warm off-white)  muted: var(--text-muted)

const ACCENT = "linear-gradient(135deg, var(--accent-start) 0%, var(--accent-end) 100%)";

// All theme colors live here as CSS custom properties. Dark is the default
// (matches the app's original look exactly); light overrides swap the
// surface/text scale while keeping brand accent colors consistent across
// both themes. bg-sunken (Reels' video stage) and page-bg (the outer frame)
// intentionally stay the same in both themes, matching how video players
// conventionally stay dark regardless of app theme.
const THEME_CSS = `
  :root {
    --bg: #14121A;
    --bg-sunken: #0E0C13;
    --page-bg: #0A090D;
    --surface: #1E1B26;
    --border: #2A2632;
    --border-subtle: #221F2B;
    --text: #F5F1EA;
    --text-secondary: #C9C3D1;
    --text-muted: #8B8494;
    --text-disabled: #4A4453;
    --toggle-off: #3E3849;
    --accent-start: #FF5D73;
    --accent-end: #FFB84D;
    --tag-bg: #2A1B22;
    --tag-border: #4A2530;
    --tag-text: #F5B8C4;
  }
  [data-theme="light"] {
    --bg: #FAFAFA;
    --surface: #FFFFFF;
    --border: #E8E3ED;
    --border-subtle: #F0ECF2;
    --text: #14121A;
    --text-secondary: #4A4453;
    --text-muted: #746D80;
    --text-disabled: #C4BFCC;
    --toggle-off: #DAD5E0;
    --tag-bg: #FDF0F2;
    --tag-border: #F5C6D0;
    --tag-text: #C23558;
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
            style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700 }}
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

// Shared avatar: shows the uploaded photo if present, else the first letter
// of the username on the accent ring. size is the outer diameter in px.
function Avatar({ username, avatarUrl, size = 40 }) {
  const letter = (username || "u")[0].toUpperCase();
  return (
    <div className="rounded-full shrink-0 overflow-hidden flex items-center justify-center" style={{ width: size, height: size, background: ACCENT, padding: avatarUrl ? 0 : 2 }}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
      ) : (
        <div className="w-full h-full rounded-full bg-[var(--bg)] flex items-center justify-center" style={{ color: "var(--text)", fontSize: size * 0.4, fontWeight: 600 }}>
          {letter}
        </div>
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
                style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700, opacity: savingEdit ? 0.6 : 1 }}
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

const mockPosts = [
  { id: 1, user: "nilufar.k", place: "Cox's Bazar", likes: 482, caption: "The sunset was unreal today 🌅" },
  { id: 2, user: "rafiq.tech", place: "Dhaka", likes: 219, caption: "New desk setup, finally done ✨" },
  { id: 3, user: "meherun.a", place: "Sylhet", likes: 967, caption: "Morning at the tea garden ☕🍃" },
];

const mockGrid = Array.from({ length: 9 }, (_, i) => i);

const mockStories = [
  { id: 0, user: "You", isSelf: true },
  { id: 1, user: "nilufar.k" },
  { id: 2, user: "rafiq.tech" },
  { id: 3, user: "meherun.a" },
  { id: 4, user: "tanvir.v" },
  { id: 5, user: "priya.dances" },
];

function TopBar({ title, showMessages, onMessagesClick, showNotifications, onNotificationsClick, unreadCount = 0, hasNotifications = false }) {
  return (
    <div className="relative flex items-center justify-center px-4 pt-4 pb-3">
      {showNotifications && (
        <button onClick={onNotificationsClick} className="absolute left-4 top-1/2 -translate-y-1/2">
          <Bell size={21} color="var(--text)" />
          {hasNotifications && (
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
              style={{ background: "var(--accent-start)" }}
            />
          )}
        </button>
      )}
      <h1
        className="text-xl tracking-tight"
        style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "var(--text)" }}
      >
        {title}
      </h1>
      {showMessages && (
        <button onClick={onMessagesClick} className="absolute right-4 top-1/2 -translate-y-1/2">
          <SendHorizontal size={22} color="var(--text)" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 rounded-full flex items-center justify-center text-[9px]"
              style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700, minWidth: 16, height: 16, padding: "0 4px" }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

function StoriesBar() {
  return (
    <div className="flex gap-3 px-4 pb-3 overflow-x-auto">
      {mockStories.map((s) => (
        <div key={s.id} className="flex flex-col items-center gap-1 shrink-0" style={{ width: 56 }}>
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: s.isSelf ? "var(--border)" : ACCENT, padding: s.isSelf ? 0 : 2 }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-sm relative"
              style={{ background: "var(--surface)", color: "var(--text)", border: "2px solid var(--bg)" }}
            >
              {s.user[0].toUpperCase()}
              {s.isSelf && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                  style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700 }}
                >
                  +
                </span>
              )}
            </div>
          </div>
          <span className="text-[10px] truncate w-full text-center" style={{ color: "var(--text-secondary)" }}>
            {s.user}
          </span>
        </div>
      ))}
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
      <StoriesBar />

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
          <div key={post.id} className="mb-5">
            <div className="flex items-center gap-2 px-4 py-2">
              <button
                onClick={() => onOpenProfile(post.user_id)}
                className="w-9 h-9 rounded-full shrink-0"
                style={{ background: ACCENT, padding: 2 }}
              >
                <div className="w-full h-full rounded-full bg-[var(--bg)] flex items-center justify-center text-[10px]" style={{ color: "var(--text)" }}>
                  {post.username[0].toUpperCase()}
                </div>
              </button>
              <div className="flex flex-col leading-tight flex-1">
                <button onClick={() => onOpenProfile(post.user_id)} className="text-sm text-left" style={{ color: "var(--text)", fontWeight: 600 }}>{post.username}</button>
                {post.location && (
                  <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                    <MapPin size={10} /> {post.location}
                  </span>
                )}
              </div>

              <div className="relative">
                <button onClick={() => setMenuOpenFor(menuOpenFor === post.id ? null : post.id)}>
                  <Ellipsis size={18} color="var(--text-muted)" />
                </button>
                {menuOpenFor === post.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpenFor(null)}
                    />
                    <div
                      className="absolute right-0 top-6 z-20 rounded-xl overflow-hidden py-1"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)", minWidth: 190 }}
                    >
                      {post.user_id === userId ? (
                        <button
                          onClick={() => deletePost(post)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm"
                          style={{ color: "var(--accent-start)" }}
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setMenuOpenFor(null);
                            onOpenReport(post.id);
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

            <div
              className="mx-4 rounded-2xl aspect-[4/5] overflow-hidden flex items-center justify-center"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              onDoubleClick={() => toggleLike(post)}
            >
              {post.media_type === "photo" ? (
                <img src={post.media_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <video src={post.media_url} className="w-full h-full object-cover" controls />
              )}
            </div>

            <PollBlock postId={post.id} currentUserId={userId} />

            <div className="flex items-center justify-between px-4 pt-3">
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-center" style={{ minWidth: 30 }}>
                  <div className="h-8 flex items-center justify-center">
                    <Send size={22} color="var(--text)" />
                  </div>
                  <span className="text-[10px] leading-none h-3 mt-0.5">&nbsp;</span>
                </div>
                <div className="flex flex-col items-center" style={{ minWidth: 30 }}>
                  <button onClick={() => toggleSave(post)} className="h-8 flex items-center justify-center">
                    <Bookmark size={22} color="var(--text)" fill={post.saved ? "var(--text)" : "none"} />
                  </button>
                  <span className="text-[10px] leading-none h-3 mt-0.5" style={{ color: "var(--text-muted)" }}>
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
                  className="h-8 flex items-center justify-center"
                >
                  <Heart size={30} color={post.liked ? "var(--accent-start)" : "var(--text)"} fill={post.liked ? "var(--accent-start)" : "none"} />
                </button>
                <span className="text-[10px] leading-none h-3 mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {countPrefs.likes && !post.hide_likes && post.likeCount > 0 ? formatCount(post.likeCount) : "\u00A0"}
                </span>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex flex-col items-center" style={{ minWidth: 30 }}>
                  <button
                    onClick={() => !post.comments_disabled && setCommentSheetFor(post)}
                    disabled={post.comments_disabled}
                    className="h-8 flex items-center justify-center"
                  >
                    <MessageCircle size={22} color={post.comments_disabled ? "var(--toggle-off)" : "var(--text)"} />
                  </button>
                  <span className="text-[10px] leading-none h-3 mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {countPrefs.comments && !post.hide_comments && post.commentCount > 0 ? formatCount(post.commentCount) : "\u00A0"}
                  </span>
                </div>
                <div className="flex flex-col items-center" style={{ minWidth: 30 }}>
                  <button onClick={() => toggleRepost(post)} className="h-8 flex items-center justify-center">
                    <Repeat2 size={24} color={post.reposted ? "var(--accent-end)" : "var(--text)"} strokeWidth={post.reposted ? 2.6 : 2} />
                  </button>
                  <span className="text-[10px] leading-none h-3 mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {countPrefs.reposts && !post.hide_reposts && post.repostCount > 0 ? formatCount(post.repostCount) : "\u00A0"}
                  </span>
                </div>
              </div>
            </div>

            {likesPopupFor === post.id && (
              <LikesViewsPopup post={post} isOwner={post.user_id === userId} onClose={() => setLikesPopupFor(null)} />
            )}

            <div className="px-4 pt-1">
              <TaggedPeopleLine tags={post.tags} onOpenProfile={onOpenProfile} />
              {post.caption && (
                <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>{post.username} </span>
                  {post.caption}
                </p>
              )}
            </div>
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
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }}>
              <Play size={28} color="#fff" fill="#fff" />
            </div>
          </div>
        )}
      </div>

      {/* mute toggle — only shown while paused, per request */}
      {!playing && (
        <button
          onClick={() => setMuted((m) => !m)}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          className="absolute top-14 right-3 w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.45)" }}
        >
          {muted ? <VolumeX size={20} color="#fff" /> : <Volume2 size={20} color="#fff" />}
        </button>
      )}

      {toast && (
        <div
          className="absolute top-24 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs z-30"
          style={{ background: "rgba(0,0,0,0.75)", color: "var(--text)" }}
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
        <span className="text-sm" style={{ color: "var(--text)", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
          Reels
        </span>
        <div className="absolute right-3">
          <button onClick={() => setMenuOpen((v) => !v)}>
            <Ellipsis size={20} color="var(--text)" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-7 z-20 rounded-xl overflow-hidden py-1"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", minWidth: 190 }}
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
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => onOpenProfile(reel.user_id)} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full shrink-0" style={{ background: ACCENT, padding: 1.5 }}>
              <div className="w-full h-full rounded-full bg-[var(--bg)] flex items-center justify-center text-[10px]" style={{ color: "var(--text)" }}>
                {reel.username[0].toUpperCase()}
              </div>
            </div>
            <span className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>{reel.username}</span>
          </button>
          {reel.user_id !== userId && (
            <button
              onClick={toggleFollow}
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
              style={{
                background: isFollowing ? "transparent" : ACCENT,
                border: isFollowing ? "1px solid var(--text-muted)" : "none",
                color: isFollowing ? "var(--text)" : "var(--bg)",
                fontWeight: 700,
              }}
            >
              {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
        {reel.location && (
          <span className="flex items-center gap-1 text-[11px] mb-1.5" style={{ color: "var(--text-secondary)" }}>
            <MapPin size={11} /> {reel.location}
          </span>
        )}
        <TaggedPeopleLine tags={reel.tags} onOpenProfile={onOpenProfile} />
        {reel.caption && (
          <div>
            <p
              onClick={() => setCommentSheetOpen(true)}
              className="text-xs"
              style={{
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
                ...(captionExpanded
                  ? {}
                  : { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }),
              }}
            >
              {reel.caption}
            </p>
            {reel.caption.length > 70 && (
              <button
                onClick={() => setCaptionExpanded((v) => !v)}
                className="text-xs mt-0.5"
                style={{ color: "var(--text-muted)", fontWeight: 600 }}
              >
                {captionExpanded ? "less" : "...more"}
              </button>
            )}
          </div>
        )}
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
              className="absolute bottom-24 flex flex-col items-center gap-5 py-3 px-2 rounded-full"
              style={{ background: "rgba(30,27,38,0.92)", border: "1px solid var(--border)" }}
            >
              <button
                onClick={toggleLike}
                onTouchStart={(e) => {
                  e.currentTarget._pressTimer = setTimeout(() => setLikesPopupOpen(true), 500);
                }}
                onTouchEndCapture={(e) => clearTimeout(e.currentTarget._pressTimer)}
                className="flex flex-col items-center gap-1"
              >
                <Heart size={26} color={reel.liked ? "var(--accent-start)" : "var(--text)"} fill={reel.liked ? "var(--accent-start)" : "none"} />
                {countPrefs.likes && !reel.hide_likes && reel.likeCount > 0 && (
                  <span className="text-[10px]" style={{ color: "var(--text)" }}>{formatCount(reel.likeCount)}</span>
                )}
              </button>
              {!reel.comments_disabled ? (
                <button onClick={() => setCommentSheetOpen(true)} className="flex flex-col items-center gap-1">
                  <MessageCircle size={25} color="var(--text)" />
                  {countPrefs.comments && !reel.hide_comments && reel.commentCount > 0 && (
                    <span className="text-[10px]" style={{ color: "var(--text)" }}>{formatCount(reel.commentCount)}</span>
                  )}
                </button>
              ) : (
                <MessageCircle size={25} color="var(--text-disabled)" />
              )}
              <button onClick={toggleRepost} className="flex flex-col items-center gap-1">
                <Repeat2 size={26} color={reel.reposted ? "var(--accent-end)" : "var(--text)"} strokeWidth={reel.reposted ? 2.4 : 2} />
                {countPrefs.reposts && !reel.hide_reposts && reel.repostCount > 0 && (
                  <span className="text-[10px]" style={{ color: "var(--text)" }}>{formatCount(reel.repostCount)}</span>
                )}
              </button>
              <button className="flex flex-col items-center gap-1">
                <SendHorizontal size={24} color="var(--text)" />
              </button>
              <button onClick={toggleSave} className="flex flex-col items-center gap-1">
                <Bookmark size={24} color="var(--text)" fill={reel.saved ? "var(--text)" : "none"} />
                {countPrefs.saves && !reel.hide_saves && reel.saveCount > 0 && (
                  <span className="text-[10px]" style={{ color: "var(--text)" }}>{formatCount(reel.saveCount)}</span>
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
            className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <Music2 size={15} color="var(--text)" />
          </button>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: reel.liked ? ACCENT : "var(--surface)", border: reel.liked ? "none" : "1px solid var(--border)" }}
          >
            {expanded ? (
              <Ellipsis size={19} color={reel.liked ? "var(--bg)" : "var(--text)"} />
            ) : (
              <Heart size={19} color={reel.liked ? "var(--bg)" : "var(--text)"} fill={reel.liked ? "var(--bg)" : "none"} />
            )}
          </button>
        </div>
      </div>

      {/* swipe progress dots */}
      <div className="absolute top-11 right-3 flex flex-col gap-1">
        {reels.map((_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: 3,
              height: i === index ? 14 : 6,
              background: i === index ? "var(--text)" : "var(--toggle-off)",
              transition: "height 0.2s",
            }}
          />
        ))}
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
        style={{ background: "var(--bg)", maxHeight: "78vh", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-center pt-2.5 pb-1">
          <div className="rounded-full" style={{ width: 36, height: 4, background: "var(--toggle-off)" }} />
        </div>
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-sm" style={{ color: "var(--text)", fontWeight: 700 }}>Comments</span>
          <button onClick={onClose}><X size={18} color="var(--text-muted)" /></button>
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
          <Heart size={13} color={comment.myReaction === "like" ? "var(--accent-start)" : "var(--text-muted)"} fill={comment.myReaction === "like" ? "var(--accent-start)" : "none"} />
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

function SearchScreen({ onOpenInterests, onOpenProfile }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

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
      .select("id, username, full_name")
      .or(`username.ilike.%${q}%,full_name.ilike.%${q}%`)
      .limit(20);
    setResults(data || []);
    setSearching(false);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <TopBar title="Search" />
      <div className="px-4">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--text)" }}
            />
          </div>
          <button
            onClick={onOpenInterests}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
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
                <div className="w-11 h-11 rounded-full shrink-0" style={{ background: ACCENT, padding: 2 }}>
                  <div className="w-full h-full rounded-full bg-[var(--bg)] flex items-center justify-center text-xs" style={{ color: "var(--text)" }}>
                    {a.username[0].toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--text)", fontWeight: 600 }}>{a.username}</p>
                  {a.full_name && (
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{a.full_name}</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 px-0.5">
          {mockGrid.map((i) => (
            <div
              key={i}
              className="aspect-square flex items-center justify-center"
              style={{ background: i % 4 === 0 ? "var(--surface)" : "var(--border-subtle)" }}
            >
              <ImageIcon size={18} color="var(--toggle-off)" />
            </div>
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
          <PlusSquare size={24} color="var(--bg)" />
        </div>
        <p className="text-sm mb-4" style={{ color: "var(--text)", fontWeight: 600 }}>
          Posted!
        </p>
        <button
          onClick={resetForm}
          className="rounded-xl px-5 py-2.5 text-sm"
          style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700 }}
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
          style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700, opacity: uploading ? 0.7 : 1 }}
        >
          {uploading ? "Uploading..." : "Share"}
        </button>
      </div>
    </div>
  );
}

function SettingsScreen({ onBack, theme, onThemeChange, accentStart, accentEnd, onAccentChange }) {
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

  const DEFAULT_ACCENT_START = "#FF5D73";
  const DEFAULT_ACCENT_END = "#FFB84D";
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
      <button onClick={back} className="text-sm" style={{ color: "var(--text)" }}>←</button>
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
            style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700, opacity: savingProfile ? 0.6 : 1 }}
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
            style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700, opacity: emailBusy ? 0.6 : 1 }}
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
            style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700, opacity: passwordBusy ? 0.6 : 1 }}
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

    return (
      <div className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
        <Header title="Theme & Color" back={() => setView("menu")} />

        <div className="px-4 pt-4">
          <div className="text-[11px] mb-2" style={{ color: "var(--text-muted)" }}>Theme</div>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => onThemeChange?.("dark")}
              className="flex-1 rounded-xl py-3 text-sm flex flex-col items-center gap-1.5"
              style={{
                background: theme === "dark" ? "var(--surface)" : "transparent",
                border: theme === "dark" ? "1.5px solid var(--accent-start)" : "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              <div className="w-8 h-8 rounded-full" style={{ background: "#14121A", border: "1px solid #2A2632" }} />
              Dark
            </button>
            <button
              onClick={() => onThemeChange?.("light")}
              className="flex-1 rounded-xl py-3 text-sm flex flex-col items-center gap-1.5"
              style={{
                background: theme === "light" ? "var(--surface)" : "transparent",
                border: theme === "light" ? "1.5px solid var(--accent-start)" : "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              <div className="w-8 h-8 rounded-full" style={{ background: "#FAFAFA", border: "1px solid #E8E3ED" }} />
              Light
            </button>
          </div>

          <div className="text-[11px] mb-2" style={{ color: "var(--text-muted)" }}>Accent color</div>
          <div
            className="rounded-xl p-3 mb-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="w-full h-10 rounded-lg mb-3" style={{ background: `linear-gradient(135deg, ${pickerStart} 0%, ${pickerEnd} 100%)` }} />
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs flex-1" style={{ color: "var(--text)" }}>Start</span>
              <input
                type="color"
                value={pickerStart}
                onChange={(e) => setPickerStart(e.target.value)}
                className="w-10 h-8 rounded"
                style={{ background: "transparent", border: "1px solid var(--border)" }}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs flex-1" style={{ color: "var(--text)" }}>End</span>
              <input
                type="color"
                value={pickerEnd}
                onChange={(e) => setPickerEnd(e.target.value)}
                className="w-10 h-8 rounded"
                style={{ background: "transparent", border: "1px solid var(--border)" }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={applyAccent}
              className="flex-1 rounded-xl py-2.5 text-sm"
              style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700 }}
            >
              Apply
            </button>
            {isCustomized && (
              <button
                onClick={resetAccent}
                className="flex-1 rounded-xl py-2.5 text-sm"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
              >
                Reset to default
              </button>
            )}
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            The accent color is used for buttons, links, and highlights throughout the app, in both Dark and Light theme.
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
            <span>Theme & Color</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{theme === "light" ? "Light" : "Dark"}</span>
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
      .select("id, media_url, media_type, caption, location, user_id, hide_likes, hide_comments, hide_reposts, hide_saves, comments_disabled, pinned, archived, views_count")
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
      <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm" style={{ color: "var(--text)" }}>←</button>
          <button onClick={() => onOpenProfile?.(post.user_id)} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full shrink-0" style={{ background: ACCENT, padding: 1.5 }}>
              <div className="w-full h-full rounded-full bg-[var(--bg)] flex items-center justify-center text-[9px]" style={{ color: "var(--text)" }}>
                {post.username[0].toUpperCase()}
              </div>
            </div>
            <span className="text-sm" style={{ color: "var(--text)", fontWeight: 700 }}>{post.username}</span>
          </button>
        </div>
        <button onClick={() => (isOwner ? setOptionsOpen(true) : onOpenReport?.(post.id))}>
          <Ellipsis size={20} color="var(--text)" />
        </button>
      </div>

      <div
        className="w-full flex items-center justify-center"
        style={{ background: "var(--surface)", aspectRatio: "4/5" }}
        onDoubleClick={toggleLike}
      >
        {post.media_type === "photo" ? (
          <img src={post.media_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <video src={post.media_url} className="w-full h-full object-cover" controls />
        )}
      </div>

      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center" style={{ minWidth: 30 }}>
            <div className="h-8 flex items-center justify-center">
              <Send size={22} color="var(--text)" />
            </div>
            <span className="text-[10px] leading-none h-3 mt-0.5">&nbsp;</span>
          </div>
          <div className="flex flex-col items-center" style={{ minWidth: 30 }}>
            <button onClick={toggleSave} className="h-8 flex items-center justify-center">
              <Bookmark size={22} color="var(--text)" fill={post.saved ? "var(--text)" : "none"} />
            </button>
            <span className="text-[10px] leading-none h-3 mt-0.5" style={{ color: "var(--text-muted)" }}>
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
            className="h-8 flex items-center justify-center"
          >
            <Heart size={30} color={post.liked ? "var(--accent-start)" : "var(--text)"} fill={post.liked ? "var(--accent-start)" : "none"} />
          </button>
          <span className="text-[10px] leading-none h-3 mt-0.5" style={{ color: "var(--text-muted)" }}>
            {countPrefs.likes && !post.hide_likes && post.likeCount > 0 ? formatCount(post.likeCount) : "\u00A0"}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center" style={{ minWidth: 30 }}>
            <button
              onClick={() => !post.comments_disabled && setCommentSheetOpen(true)}
              disabled={post.comments_disabled}
              className="h-8 flex items-center justify-center"
            >
              <MessageCircle size={22} color={post.comments_disabled ? "var(--toggle-off)" : "var(--text)"} />
            </button>
            <span className="text-[10px] leading-none h-3 mt-0.5" style={{ color: "var(--text-muted)" }}>
              {countPrefs.comments && !post.hide_comments && post.commentCount > 0 ? formatCount(post.commentCount) : "\u00A0"}
            </span>
          </div>
          <div className="flex flex-col items-center" style={{ minWidth: 30 }}>
            <button onClick={toggleRepost} className="h-8 flex items-center justify-center">
              <Repeat2 size={24} color={post.reposted ? "var(--accent-end)" : "var(--text)"} strokeWidth={post.reposted ? 2.6 : 2} />
            </button>
            <span className="text-[10px] leading-none h-3 mt-0.5" style={{ color: "var(--text-muted)" }}>
              {countPrefs.reposts && !post.hide_reposts && post.repostCount > 0 ? formatCount(post.repostCount) : "\u00A0"}
            </span>
          </div>
        </div>
      </div>

      {likesPopupOpen && (
        <LikesViewsPopup post={post} isOwner={isOwner} onClose={() => setLikesPopupOpen(false)} />
      )}

      <div className="px-4 pt-1 pb-6">
        {post.location && (
          <span className="flex items-center gap-1 text-[11px] mb-1" style={{ color: "var(--text-muted)" }}>
            <MapPin size={11} /> {post.location}
          </span>
        )}
        <TaggedPeopleLine tags={post.tags} onOpenProfile={onOpenProfile} />
        {post.caption && (
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
            <span style={{ color: "var(--text)", fontWeight: 600 }}>{post.username} </span>
            {post.caption}
          </p>
        )}
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
            <button onClick={onBack} className="text-sm mr-1" style={{ color: "var(--text)" }}>←</button>
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
            className="rounded-lg px-4 py-1.5 text-xs"
            style={{
              background: isFollowing ? "var(--surface)" : ACCENT,
              border: isFollowing ? "1px solid var(--border)" : "none",
              color: isFollowing ? "var(--text)" : "var(--bg)",
              fontWeight: 700,
              opacity: followBusy ? 0.6 : 1,
            }}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      <div className="flex items-center gap-5 px-4 mb-4">
        <div
          className="w-20 h-20 rounded-full shrink-0 flex items-center justify-center overflow-hidden"
          style={{ background: ACCENT }}
        >
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl" style={{ color: "var(--bg)", fontWeight: 700 }}>
              {profile.username[0].toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col items-center">
            <span className="text-sm" style={{ color: "var(--text)", fontWeight: 700 }}>{posts.length}</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm" style={{ color: "var(--text)", fontWeight: 700 }}>{followerCount}</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm" style={{ color: "var(--text)", fontWeight: 700 }}>{followingCount}</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Following</span>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <p className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>
          {profile.full_name || profile.username}
        </p>
        {profile.bio && (
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>{profile.bio}</p>
        )}
      </div>

      <div
        className="flex items-center justify-center gap-12 py-2.5 mx-4 mb-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => setTab("posts")}
          className="flex items-center gap-1.5 py-2"
          style={{ borderBottom: tab === "posts" ? "2px solid var(--text)" : "2px solid transparent" }}
        >
          <Grid3x3 size={24} color={tab === "posts" ? "var(--text)" : "var(--text-muted)"} strokeWidth={tab === "posts" ? 2.2 : 1.8} />
        </button>
        <button
          onClick={() => setTab("reposts")}
          className="flex items-center gap-1.5 py-2"
          style={{ borderBottom: tab === "reposts" ? "2px solid var(--text)" : "2px solid transparent" }}
        >
          <Repeat2 size={25} color={tab === "reposts" ? "var(--text)" : "var(--text-muted)"} strokeWidth={tab === "reposts" ? 2.2 : 1.8} />
        </button>
        <button
          onClick={() => setTab("tagged")}
          className="flex items-center gap-1.5 py-2"
          style={{ borderBottom: tab === "tagged" ? "2px solid var(--text)" : "2px solid transparent" }}
        >
          <UserSquare2 size={24} color={tab === "tagged" ? "var(--text)" : "var(--text-muted)"} strokeWidth={tab === "tagged" ? 2.2 : 1.8} />
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
      .select("conversation_id, last_read_at")
      .eq("user_id", uid);

    if (!memberships || memberships.length === 0) {
      setConversations([]);
      return;
    }

    const convoIds = memberships.map((m) => m.conversation_id);
    const lastReadMap = {};
    memberships.forEach((m) => (lastReadMap[m.conversation_id] = m.last_read_at));

    const { data: convos } = await supabase
      .from("conversations")
      .select("id, user_a, user_b, is_group, title, last_message, last_message_at")
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
        avatarUrl = null;
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
      };
    });
    setConversations(merged);
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
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3" style={{ background: "var(--bg)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-sm" style={{ color: "var(--text)" }}>←</button>
            <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>
              Messages
            </h1>
          </div>
          <button
            onClick={() => setCreatingGroup(true)}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            <Users size={14} /> New group
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people to message..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text)" }}
          />
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
              <button key={p.id} onClick={() => startChat(p)} className="w-full flex items-center gap-3 px-4 py-2.5 text-left">
                <Avatar username={p.username} avatarUrl={p.avatar_url} size={44} />
                <span className="text-sm" style={{ color: "var(--text)", fontWeight: 600 }}>{p.username}</span>
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
            <button
              key={c.conversationId}
              onClick={() => setOpenChat(c)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
            >
              {c.isGroup ? (
                <div className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center" style={{ background: "var(--border)" }}>
                  <Users size={20} color="var(--text)" />
                </div>
              ) : (
                <Avatar username={c.displayName} avatarUrl={c.avatarUrl} size={44} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--text)", fontWeight: c.unread > 0 ? 700 : 600 }}>{c.displayName}</p>
                <p className="text-xs truncate" style={{ color: c.unread > 0 ? "var(--text)" : "var(--text-muted)", fontWeight: c.unread > 0 ? 600 : 400 }}>
                  {c.lastMessage || "Say hi 👋"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{timeShort(c.lastMessageAt)}</span>
                {c.unread > 0 && (
                  <span
                    className="rounded-full flex items-center justify-center text-[9px]"
                    style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700, minWidth: 18, height: 18, padding: "0 5px" }}
                  >
                    {c.unread > 99 ? "99+" : c.unread}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
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
          <button onClick={onBack} className="text-sm" style={{ color: "var(--text)" }}>←</button>
          <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "var(--text)" }}>New group</h1>
        </div>
        <button
          onClick={create}
          disabled={creating || selected.length < 2}
          className="rounded-full px-4 py-1.5 text-xs"
          style={{ background: selected.length >= 2 ? ACCENT : "var(--surface)", color: selected.length >= 2 ? "var(--bg)" : "var(--text-muted)", fontWeight: 700 }}
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

function ChatScreen({ conversationId, isGroup, chatTitle, chatAvatarUrl, otherUser, currentUserId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [otherLastRead, setOtherLastRead] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]); // usernames currently typing
  const [menuFor, setMenuFor] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [memberNames, setMemberNames] = useState({}); // id -> username, for group sender labels
  const [imageUploading, setImageUploading] = useState(false);
  const scrollRef = React.useRef(null);
  const channelRef = React.useRef(null);
  const typingTimeoutRef = React.useRef(null);
  const openedAtRef = React.useRef(0);
  const pressTimerRef = React.useRef(null);

  useEffect(() => {
    loadMessages();
    markRead();
    if (isGroup) loadMemberNames();

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
    };
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typingUsers]);

  const loadMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("id, sender_id, content, image_url, created_at, edited_at, deleted")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    setMessages(data || []);
    setLoading(false);
  };

  const loadMemberNames = async () => {
    const { data: members } = await supabase
      .from("conversation_members")
      .select("user_id")
      .eq("conversation_id", conversationId);
    const ids = (members || []).map((m) => m.user_id);
    if (ids.length === 0) return;
    const { data: profiles } = await supabase.from("profiles").select("id, username").in("id", ids);
    const map = {};
    (profiles || []).forEach((p) => (map[p.id] = p.username));
    setMemberNames(map);
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

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || !currentUserId || sending) return;
    setSending(true);
    setText("");

    const { data: inserted, error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: currentUserId, content: trimmed })
      .select("id, sender_id, content, image_url, created_at, edited_at, deleted")
      .single();

    setSending(false);
    if (error) {
      setText(trimmed);
      alert(error.message);
      return;
    }
    setMessages((prev) => (prev.some((m) => m.id === inserted.id) ? prev : [...prev, inserted]));
    afterSend(trimmed);
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

    const { data: inserted, error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: currentUserId, image_url: publicUrl })
      .select("id, sender_id, content, image_url, created_at, edited_at, deleted")
      .single();

    setImageUploading(false);
    if (error) {
      alert(error.message);
      return;
    }
    setMessages((prev) => (prev.some((m) => m.id === inserted.id) ? prev : [...prev, inserted]));
    afterSend("📷 Photo");
  };

  const deleteMessage = async (m) => {
    setMenuFor(null);
    if (!window.confirm("Delete this message?")) return;
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, deleted: true, content: null, image_url: null } : x)));
    await supabase.from("messages").update({ deleted: true, content: null, image_url: null }).eq("id", m.id);
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

  // read receipt: my last non-deleted message seen if other's last_read >= its time
  const myLastMessage = [...messages].reverse().find((m) => m.sender_id === currentUserId && !m.deleted);
  const seen = !isGroup && myLastMessage && otherLastRead && new Date(otherLastRead) >= new Date(myLastMessage.created_at);

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--bg)" }}>
      <div className="flex items-center gap-3 px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <button onClick={onBack} className="text-sm" style={{ color: "var(--text)" }}>←</button>
        {isGroup ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--border)" }}>
            <Users size={16} color="var(--text)" />
          </div>
        ) : (
          <Avatar username={chatTitle} avatarUrl={chatAvatarUrl} size={32} />
        )}
        <span className="text-sm" style={{ color: "var(--text)", fontWeight: 700 }}>{chatTitle}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3" onClick={() => setMenuFor(null)}>
        {loading ? (
          <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>No messages yet — say hi 👋</p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === currentUserId;
            const isLast = myLastMessage && m.id === myLastMessage.id;

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
                  <span className="text-[10px] mb-0.5 ml-1" style={{ color: "var(--text-muted)" }}>{memberNames[m.sender_id] || "unknown"}</span>
                )}
                <div
                  onTouchStart={() => {
                    if (m.deleted) return;
                    pressTimerRef.current = setTimeout(() => {
                      openedAtRef.current = Date.now();
                      setMenuFor(m.id);
                    }, 500);
                  }}
                  onTouchEnd={() => clearTimeout(pressTimerRef.current)}
                  onTouchMove={() => clearTimeout(pressTimerRef.current)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (m.deleted) return;
                    openedAtRef.current = Date.now();
                    setMenuFor(m.id);
                  }}
                  className="relative max-w-[75%]"
                >
                  {m.deleted ? (
                    <div
                      className="px-3.5 py-2 text-sm italic"
                      style={{ background: "var(--surface)", color: "var(--text-muted)", borderRadius: 14, border: "1px solid var(--border)" }}
                    >
                      This message was deleted
                    </div>
                  ) : m.image_url ? (
                    <img
                      src={m.image_url}
                      alt=""
                      className="rounded-2xl max-w-full"
                      style={{ maxHeight: 260, border: mine ? "none" : "1px solid var(--border)" }}
                    />
                  ) : (
                    <div
                      className="px-3.5 py-2 text-sm"
                      style={{
                        background: mine ? ACCENT : "var(--surface)",
                        color: mine ? "var(--bg)" : "var(--text)",
                        borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {m.content}
                    </div>
                  )}

                  {menuFor === m.id && !m.deleted && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (Date.now() - openedAtRef.current < 400) return;
                          setMenuFor(null);
                        }}
                      />
                      <div
                        className={`absolute z-50 rounded-xl overflow-hidden py-1 ${mine ? "right-0" : "left-0"}`}
                        style={{ background: "var(--surface)", border: "1px solid var(--border)", minWidth: 130, top: "100%", marginTop: 4 }}
                      >
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
                          <button onClick={() => deleteMessage(m)} className="w-full flex items-center gap-2 px-4 py-2 text-xs" style={{ color: "var(--accent-start)" }}>
                            <Trash2 size={13} /> Delete
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>

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

        {typingUsers.length > 0 && (
          <div className="flex items-center gap-1 ml-1 mb-1">
            <div className="px-3 py-2 rounded-2xl" style={{ background: "var(--surface)" }}>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {isGroup ? `${typingUsers.join(", ")} typing...` : "typing..."}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-end gap-2 px-3 py-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
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
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Message..."
          rows={1}
          className="flex-1 rounded-2xl px-3.5 py-2.5 text-sm outline-none resize-none"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", maxHeight: 110 }}
        />
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          className="rounded-full w-10 h-10 flex items-center justify-center shrink-0"
          style={{ background: text.trim() ? ACCENT : "var(--surface)", border: text.trim() ? "none" : "1px solid var(--border)" }}
        >
          <SendHorizontal size={18} color={text.trim() ? "var(--bg)" : "var(--text-muted)"} />
        </button>
      </div>
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
      : "";

  const iconFor = (type) =>
    type === "like" ? Heart : type === "comment" || type === "mention" ? MessageCircle : type === "message" ? SendHorizontal : CircleUserRound;
  const colorFor = (type) => (type === "like" ? "var(--accent-start)" : "var(--text-muted)");

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--bg)" }}>
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 pt-4 pb-3"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <button onClick={onBack} className="text-sm" style={{ color: "var(--text)" }}>←</button>
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
          <Ellipsis size={22} color="var(--bg)" />
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
        <button onClick={onBack} className="text-sm" style={{ color: "var(--text)" }}>←</button>
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
        <button onClick={onBack} className="text-sm" style={{ color: "var(--text)" }}>←</button>
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
          style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700, opacity: posting || !newComment.trim() ? 0.6 : 1 }}
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
      className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 mb-3"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <Icon size={17} color="var(--text-muted)" />
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
          {revealed ? <EyeOff size={16} color="var(--text-muted)" /> : <Eye size={16} color="var(--text-muted)" />}
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
      <h1
        className="text-3xl text-center mb-1"
        style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "var(--text)" }}
      >
        Loop
      </h1>
      <p className="text-center text-xs mb-8" style={{ color: "var(--text-muted)" }}>
        Share your moments
      </p>

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
        <p className="text-xs mb-3" style={{ color: "var(--accent-start)" }}>
          {error}
        </p>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full rounded-xl py-3 text-sm mt-2 mb-4"
        style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Please wait..." : "Log In"}
      </button>

      <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Don't have an account?{" "}
        <button onClick={onGoSignup} style={{ color: "var(--accent-start)", fontWeight: 600 }}>
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
      <h1
        className="text-3xl text-center mb-1"
        style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "var(--text)" }}
      >
        New Account
      </h1>
      <p className="text-center text-xs mb-8" style={{ color: "var(--text-muted)" }}>
        Get started in seconds
      </p>

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
        <p className="text-xs mb-3" style={{ color: "var(--accent-start)" }}>
          {error}
        </p>
      )}

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full rounded-xl py-3 text-sm mt-2 mb-4"
        style={{ background: ACCENT, color: "var(--bg)", fontWeight: 700, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Please wait..." : "Sign Up"}
      </button>

      <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Already have an account?{" "}
        <button onClick={onGoLogin} style={{ color: "var(--accent-start)", fontWeight: 600 }}>
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
          <button onClick={onBack} className="text-sm" style={{ color: "var(--text)" }}>←</button>
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
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem("loop_theme") || "dark";
    } catch {
      return "dark";
    }
  });
  const [accentStart, setAccentStartState] = useState(() => {
    try {
      return localStorage.getItem("loop_accent_start") || "";
    } catch {
      return "";
    }
  });
  const [accentEnd, setAccentEndState] = useState(() => {
    try {
      return localStorage.getItem("loop_accent_end") || "";
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
      if (start) localStorage.setItem("loop_accent_start", start);
      else localStorage.removeItem("loop_accent_start");
      if (end) localStorage.setItem("loop_accent_end", end);
      else localStorage.removeItem("loop_accent_end");
    } catch {}
  };

  const rootVarOverrides = {};
  if (accentStart) rootVarOverrides["--accent-start"] = accentStart;
  if (accentEnd) rootVarOverrides["--accent-end"] = accentEnd;

  const ActiveScreen = TABS.find((t) => t.key === active).screen;
  const overlayOpen = inboxOpen || notificationsOpen || interestsOpen || commentsPostId !== null || reportPostId !== null || viewProfileId !== null || settingsOpen || viewPostId !== null;

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
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</span>
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
        <ErrorBoundary key={active + String(inboxOpen) + String(notificationsOpen) + String(interestsOpen) + String(commentsPostId) + String(reportPostId) + String(viewProfileId) + String(settingsOpen) + String(viewPostId)}>
          {inboxOpen ? (
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
            <SearchScreen onOpenInterests={() => setInterestsOpen(true)} onOpenProfile={(userId) => setViewProfileId(userId)} />
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
                  className="flex flex-col items-center justify-center"
                  style={{ width: 44, height: 32 }}
                >
                  <Icon size={22} color={isActive ? "var(--accent-start)" : "var(--text-muted)"} strokeWidth={2} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
