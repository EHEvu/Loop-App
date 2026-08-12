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
} from "lucide-react";

// ---- Design tokens ----
// bg: #14121A (deep aubergine-black)  card: #1E1B26
// accent: #FF5D73 (coral) -> #FFB84D (amber) gradient
// text: #F5F1EA (warm off-white)  muted: #8B8494

const ACCENT = "linear-gradient(135deg, #FF5D73 0%, #FFB84D 100%)";

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

function TopBar({ title, showMessages, onMessagesClick, showNotifications, onNotificationsClick }) {
  return (
    <div className="relative flex items-center justify-center px-4 pt-4 pb-3">
      {showNotifications && (
        <button onClick={onNotificationsClick} className="absolute left-4 top-1/2 -translate-y-1/2">
          <Bell size={21} color="#F5F1EA" />
          <span
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
            style={{ background: "#FF5D73" }}
          />
        </button>
      )}
      <h1
        className="text-xl tracking-tight"
        style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "#F5F1EA" }}
      >
        {title}
      </h1>
      {showMessages && (
        <button onClick={onMessagesClick} className="absolute right-4 top-1/2 -translate-y-1/2">
          <SendHorizontal size={22} color="#F5F1EA" />
          <span
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px]"
            style={{ background: ACCENT, color: "#14121A", fontWeight: 700 }}
          >
            3
          </span>
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
            style={{ background: s.isSelf ? "#2A2632" : ACCENT, padding: s.isSelf ? 0 : 2 }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-sm relative"
              style={{ background: "#1E1B26", color: "#F5F1EA", border: "2px solid #14121A" }}
            >
              {s.user[0].toUpperCase()}
              {s.isSelf && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                  style={{ background: ACCENT, color: "#14121A", fontWeight: 700 }}
                >
                  +
                </span>
              )}
            </div>
          </div>
          <span className="text-[10px] truncate w-full text-center" style={{ color: "#C9C3D1" }}>
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
  const [countPrefs] = useCountPrefs();

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    setLoadError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("id, media_url, media_type, caption, created_at, user_id, hide_likes, hide_comments, hide_reposts, hide_saves")
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

    const merged = (postsData || []).map((p) => {
      const profile = (profilesData || []).find((pr) => pr.id === p.user_id);
      const postLikes = (likesData || []).filter((l) => l.post_id === p.id);
      const postReposts = (repostsData || []).filter((r) => r.post_id === p.id);
      const postSaves = (allSavesData || []).filter((s) => s.post_id === p.id);
      const postComments = (commentsData || []).filter((c) => c.post_id === p.id);
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

  const toggleOwnerHideCount = async (post, field) => {
    if (post.user_id !== userId) return;
    const nextVal = !post[field];
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, [field]: nextVal } : p)));
    await supabase.from("posts").update({ [field]: nextVal }).eq("id", post.id);
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
      />
      <StoriesBar />

      {loading ? (
        <p className="text-center text-xs py-10" style={{ color: "#8B8494" }}>
          Loading...
        </p>
      ) : loadError ? (
        <p className="text-center text-xs py-10 px-6" style={{ color: "#FF5D73" }}>
          {loadError}
        </p>
      ) : posts.length === 0 ? (
        <p className="text-center text-xs py-10" style={{ color: "#8B8494" }}>
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
                <div className="w-full h-full rounded-full bg-[#14121A] flex items-center justify-center text-[10px]" style={{ color: "#F5F1EA" }}>
                  {post.username[0].toUpperCase()}
                </div>
              </button>
              <div className="flex flex-col leading-tight flex-1">
                <button onClick={() => onOpenProfile(post.user_id)} className="text-sm text-left" style={{ color: "#F5F1EA", fontWeight: 600 }}>{post.username}</button>
              </div>

              <div className="relative">
                <button onClick={() => setMenuOpenFor(menuOpenFor === post.id ? null : post.id)}>
                  <Ellipsis size={18} color="#8B8494" />
                </button>
                {menuOpenFor === post.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpenFor(null)}
                    />
                    <div
                      className="absolute right-0 top-6 z-20 rounded-xl overflow-hidden py-1"
                      style={{ background: "#1E1B26", border: "1px solid #2A2632", minWidth: 190 }}
                    >
                      {post.user_id === userId ? (
                        <>
                          <div className="px-4 py-1.5 text-[10px] uppercase tracking-wide" style={{ color: "#8B8494" }}>Hide counts from everyone</div>
                          {[
                            ["hide_likes", "Likes"],
                            ["hide_comments", "Comments"],
                            ["hide_reposts", "Reposts"],
                            ["hide_saves", "Saves"],
                          ].map(([field, label]) => (
                            <button
                              key={field}
                              onClick={() => toggleOwnerHideCount(post, field)}
                              className="w-full flex items-center justify-between px-4 py-2 text-sm"
                              style={{ color: "#F5F1EA" }}
                            >
                              <span>{label}</span>
                              <span
                                className="rounded-full"
                                style={{ width: 30, height: 17, background: post[field] ? ACCENT : "#3E3849", position: "relative" }}
                              >
                                <span
                                  className="rounded-full bg-white absolute"
                                  style={{ width: 13, height: 13, top: 2, left: post[field] ? 15 : 2, transition: "left 0.15s" }}
                                />
                              </span>
                            </button>
                          ))}
                          <div className="h-px my-1" style={{ background: "#2A2632" }} />
                          <button
                            onClick={() => deletePost(post)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm"
                            style={{ color: "#FF5D73" }}
                          >
                            <Trash2 size={15} /> Delete
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setMenuOpenFor(null);
                            onOpenReport(post.id);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm"
                          style={{ color: "#FF5D73" }}
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
              style={{ background: "#1E1B26", border: "1px solid #2A2632" }}
              onDoubleClick={() => toggleLike(post)}
            >
              {post.media_type === "photo" ? (
                <img src={post.media_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <video src={post.media_url} className="w-full h-full object-cover" controls />
              )}
            </div>

            <div className="flex items-center justify-between px-4 pt-3">
              <div className="flex items-center gap-4">
                <Send size={20} color="#F5F1EA" />
                <button onClick={() => toggleSave(post)}>
                  <Bookmark size={20} color="#F5F1EA" fill={post.saved ? "#F5F1EA" : "none"} />
                </button>
              </div>

              <button onClick={() => toggleLike(post)}>
                <Heart
                  size={30}
                  color={post.liked ? "#FF5D73" : "#F5F1EA"}
                  fill={post.liked ? "#FF5D73" : "none"}
                />
              </button>

              <div className="flex items-center gap-4">
                <button onClick={() => onOpenComments(post.id, post.user_id)}>
                  <MessageCircle size={20} color="#F5F1EA" />
                </button>
                <button onClick={() => toggleRepost(post)}>
                  <Repeat2 size={22} color={post.reposted ? "#FFB84D" : "#F5F1EA"} strokeWidth={post.reposted ? 2.6 : 2} />
                </button>
              </div>
            </div>
            <div className="px-4 pt-1.5">
              {countPrefs.likes && !post.hide_likes && (
                <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 600 }}>{post.likeCount} likes</span>
              )}
              {countPrefs.comments && !post.hide_comments && post.commentCount > 0 && (
                <span className="text-xs ml-2" style={{ color: "#8B8494" }}>· {post.commentCount} comments</span>
              )}
              {countPrefs.reposts && !post.hide_reposts && post.repostCount > 0 && (
                <span className="text-xs ml-2" style={{ color: "#8B8494" }}>· {post.repostCount} reposts</span>
              )}
              {countPrefs.saves && !post.hide_saves && post.saveCount > 0 && (
                <span className="text-xs ml-2" style={{ color: "#8B8494" }}>· {post.saveCount} saves</span>
              )}
              {post.caption && (
                <p className="text-sm mt-0.5" style={{ color: "#C9C3D1", whiteSpace: "pre-wrap" }}>
                  <span style={{ color: "#F5F1EA", fontWeight: 600 }}>{post.username} </span>
                  {post.caption}
                </p>
              )}
            </div>
          </div>
        ))
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
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
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
      .select("id, media_url, media_type, caption, created_at, user_id, hide_likes, hide_comments, hide_reposts, hide_saves")
      .eq("media_type", "reel")
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
    const { data: commentsData } = await supabase.from("comments").select("post_id");
    const { data: followsData } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user?.id ?? "");

    setFollowingSet(new Set((followsData || []).map((f) => f.following_id)));

    const merged = (postsData || []).map((p) => {
      const profile = (profilesData || []).find((pr) => pr.id === p.user_id);
      const postLikes = (likesData || []).filter((l) => l.post_id === p.id);
      const postReposts = (repostsData || []).filter((r) => r.post_id === p.id);
      const postComments = (commentsData || []).filter((c) => c.post_id === p.id);
      return {
        ...p,
        username: profile?.username || "unknown",
        likeCount: postLikes.length,
        liked: postLikes.some((l) => l.user_id === user?.id),
        repostCount: postReposts.length,
        reposted: postReposts.some((r) => r.user_id === user?.id),
        saved: (savesData || []).some((s) => s.post_id === p.id),
        commentCount: postComments.length,
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

  // Owner-only: hide/unhide a specific count type on THIS post for everyone who views it
  const toggleOwnerHideCount = async (field) => {
    if (!reel || reel.user_id !== userId) return;
    const nextVal = !reel[field];
    setReels((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: nextVal } : r)));
    await supabase.from("posts").update({ [field]: nextVal }).eq("id", reel.id);
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
      <div className="flex-1 flex items-center justify-center" style={{ background: "#0E0C13" }}>
        <p className="text-xs" style={{ color: "#8B8494" }}>Loading...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex-1 flex items-center justify-center px-6" style={{ background: "#0E0C13" }}>
        <p className="text-xs text-center" style={{ color: "#FF5D73" }}>{loadError}</p>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2" style={{ background: "#0E0C13" }}>
        <Video size={32} color="#3E3849" />
        <p className="text-xs" style={{ color: "#8B8494" }}>No reels yet — be the first to post one!</p>
      </div>
    );
  }

  const isFollowing = followingSet.has(reel.user_id);

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden"
      style={{ background: "#0E0C13" }}
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
          className="absolute top-14 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          {muted ? <VolumeX size={16} color="#fff" /> : <Volume2 size={16} color="#fff" />}
        </button>
      )}

      {toast && (
        <div
          className="absolute top-24 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs z-30"
          style={{ background: "rgba(0,0,0,0.75)", color: "#F5F1EA" }}
        >
          {toast}
        </div>
      )}

      {/* top label + options menu */}
      <div className="absolute top-4 left-0 right-0 flex items-center justify-center">
        <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
          Reels
        </span>
        <div className="absolute right-3">
          <button onClick={() => setMenuOpen((v) => !v)}>
            <Ellipsis size={20} color="#F5F1EA" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-7 z-20 rounded-xl overflow-hidden py-1"
                style={{ background: "#1E1B26", border: "1px solid #2A2632", minWidth: 190 }}
              >
                <button
                  onClick={() => {
                    const next = !autoScroll;
                    setAutoScroll(next);
                    setAutoScrollPref(next);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm"
                  style={{ color: "#F5F1EA" }}
                >
                  <span className="flex items-center gap-2"><RefreshCw size={15} /> Auto Scroll</span>
                  <span
                    className="rounded-full"
                    style={{ width: 30, height: 17, background: autoScroll ? ACCENT : "#3E3849", position: "relative" }}
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
                  style={{ color: "#F5F1EA" }}
                >
                  <Sparkles size={15} /> Remix
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm"
                  style={{ color: "#F5F1EA" }}
                >
                  {fullscreen ? <Minimize size={15} /> : <Maximize size={15} />} View Full Screen
                </button>

                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm"
                  style={{ color: "#F5F1EA" }}
                >
                  <Download size={15} /> Download
                </button>

                <button
                  onClick={() => showToast("Quality: Auto (only one version is uploaded)")}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm"
                  style={{ color: "#F5F1EA" }}
                >
                  <span className="flex items-center gap-2"><Gauge size={15} /> Quality</span>
                  <span className="text-xs" style={{ color: "#8B8494" }}>Auto</span>
                </button>

                <div className="h-px my-1" style={{ background: "#2A2632" }} />
                <div className="px-4 py-1.5 text-[10px] uppercase tracking-wide" style={{ color: "#8B8494" }}>My view: show counts</div>
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
                    style={{ color: "#F5F1EA" }}
                  >
                    <span>{label}</span>
                    <span
                      className="rounded-full"
                      style={{ width: 30, height: 17, background: countPrefs[key] ? ACCENT : "#3E3849", position: "relative" }}
                    >
                      <span
                        className="rounded-full bg-white absolute"
                        style={{ width: 13, height: 13, top: 2, left: countPrefs[key] ? 15 : 2, transition: "left 0.15s" }}
                      />
                    </span>
                  </button>
                ))}

                {reel.user_id === userId && (
                  <>
                    <div className="h-px my-1" style={{ background: "#2A2632" }} />
                    <div className="px-4 py-1.5 text-[10px] uppercase tracking-wide" style={{ color: "#8B8494" }}>This reel: hide counts from everyone</div>
                    {[
                      ["hide_likes", "Likes"],
                      ["hide_comments", "Comments"],
                      ["hide_reposts", "Reposts"],
                      ["hide_saves", "Saves"],
                    ].map(([field, label]) => (
                      <button
                        key={field}
                        onClick={() => toggleOwnerHideCount(field)}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm"
                        style={{ color: "#F5F1EA" }}
                      >
                        <span>{label}</span>
                        <span
                          className="rounded-full"
                          style={{ width: 30, height: 17, background: reel[field] ? ACCENT : "#3E3849", position: "relative" }}
                        >
                          <span
                            className="rounded-full bg-white absolute"
                            style={{ width: 13, height: 13, top: 2, left: reel[field] ? 15 : 2, transition: "left 0.15s" }}
                          />
                        </span>
                      </button>
                    ))}
                  </>
                )}

                <div className="h-px my-1" style={{ background: "#2A2632" }} />
                {reel.user_id === userId ? (
                  <button
                    onClick={deleteReel}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm"
                    style={{ color: "#FF5D73" }}
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
                    style={{ color: "#FF5D73" }}
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
      <div className="absolute left-4 bottom-5 right-20">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => onOpenProfile(reel.user_id)} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full shrink-0" style={{ background: ACCENT, padding: 1.5 }}>
              <div className="w-full h-full rounded-full bg-[#14121A] flex items-center justify-center text-[10px]" style={{ color: "#F5F1EA" }}>
                {reel.username[0].toUpperCase()}
              </div>
            </div>
            <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 600 }}>{reel.username}</span>
          </button>
          {reel.user_id !== userId && (
            <button
              onClick={toggleFollow}
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
              style={{
                background: isFollowing ? "transparent" : ACCENT,
                border: isFollowing ? "1px solid #8B8494" : "none",
                color: isFollowing ? "#F5F1EA" : "#14121A",
                fontWeight: 700,
              }}
            >
              {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
        {reel.caption && (
          <button onClick={() => setCommentSheetOpen(true)} className="text-left">
            <p className="text-xs" style={{ color: "#E5E1EA", whiteSpace: "pre-wrap" }}>{reel.caption}</p>
          </button>
        )}
      </div>

      {/* Quick Actions — the only action control; expands to full-size icons */}
      <div className="absolute right-3 bottom-6 flex flex-col items-center">
        <div className="relative flex flex-col items-center">
          {expanded && (
            <div
              className="absolute bottom-24 flex flex-col items-center gap-5 py-3 px-2 rounded-full"
              style={{ background: "rgba(30,27,38,0.92)", border: "1px solid #2A2632" }}
            >
              <button onClick={toggleLike} className="flex flex-col items-center gap-1">
                <Heart size={26} color={reel.liked ? "#FF5D73" : "#F5F1EA"} fill={reel.liked ? "#FF5D73" : "none"} />
                {countPrefs.likes && !reel.hide_likes && <span className="text-[10px]" style={{ color: "#F5F1EA" }}>{reel.likeCount}</span>}
              </button>
              <button onClick={() => setCommentSheetOpen(true)} className="flex flex-col items-center gap-1">
                <MessageCircle size={25} color="#F5F1EA" />
                {countPrefs.comments && !reel.hide_comments && <span className="text-[10px]" style={{ color: "#F5F1EA" }}>{reel.commentCount}</span>}
              </button>
              <button onClick={toggleRepost} className="flex flex-col items-center gap-1">
                <Repeat2 size={26} color={reel.reposted ? "#FFB84D" : "#F5F1EA"} strokeWidth={reel.reposted ? 2.4 : 2} />
                {countPrefs.reposts && !reel.hide_reposts && <span className="text-[10px]" style={{ color: "#F5F1EA" }}>{reel.repostCount}</span>}
              </button>
              <button className="flex flex-col items-center gap-1">
                <SendHorizontal size={24} color="#F5F1EA" />
              </button>
              <button onClick={toggleSave} className="flex flex-col items-center gap-1">
                <Bookmark size={24} color="#F5F1EA" fill={reel.saved ? "#F5F1EA" : "none"} />
              </button>
            </div>
          )}

          {/* audio / sound-source shortcut, sits just above the main heart button */}
          <button
            onClick={() => showToast("Reels using this audio — coming soon")}
            className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center"
            style={{ background: "#1E1B26", border: "1px solid #2A2632" }}
          >
            <Music2 size={15} color="#F5F1EA" />
          </button>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: reel.liked ? ACCENT : "#1E1B26", border: reel.liked ? "none" : "1px solid #2A2632" }}
          >
            {expanded ? (
              <Ellipsis size={19} color={reel.liked ? "#14121A" : "#F5F1EA"} />
            ) : (
              <Heart size={19} color={reel.liked ? "#14121A" : "#F5F1EA"} fill={reel.liked ? "#14121A" : "none"} />
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
              background: i === index ? "#F5F1EA" : "#3E3849",
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
  onOpenProfile,
  onClose,
  onCommentPosted,
}) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [posting, setPosting] = useState(false);

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
  };

  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesOf = (id) => comments.filter((c) => c.parent_id === id);

  return (
    <>
      <div className="fixed inset-0 z-30" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <div
        className="fixed left-0 right-0 bottom-0 z-40 rounded-t-3xl flex flex-col"
        style={{ background: "#14121A", maxHeight: "78vh", border: "1px solid #2A2632" }}
      >
        <div className="flex items-center justify-center pt-2.5 pb-1">
          <div className="rounded-full" style={{ width: 36, height: 4, background: "#3E3849" }} />
        </div>
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 700 }}>Comments</span>
          <button onClick={onClose}><X size={18} color="#8B8494" /></button>
        </div>

        {postCaption && (
          <button
            onClick={() => onOpenProfile?.(postOwnerId)}
            className="text-left px-4 pb-3 flex items-start gap-2.5"
            style={{ borderBottom: "1px solid #221F2B" }}
          >
            <div className="w-7 h-7 rounded-full shrink-0" style={{ background: ACCENT, padding: 1.5 }}>
              <div className="w-full h-full rounded-full bg-[#14121A] flex items-center justify-center text-[9px]" style={{ color: "#F5F1EA" }}>
                {(postUsername || "u")[0].toUpperCase()}
              </div>
            </div>
            <p className="text-xs" style={{ color: "#E5E1EA", whiteSpace: "pre-wrap" }}>
              <span style={{ fontWeight: 700, color: "#F5F1EA" }}>{postUsername} </span>
              {postCaption}
            </p>
          </button>
        )}

        <div className="flex-1 overflow-y-auto px-4 pt-3">
          {loading ? (
            <p className="text-xs text-center py-6" style={{ color: "#8B8494" }}>Loading...</p>
          ) : topLevel.length === 0 ? (
            <p className="text-xs text-center py-6" style={{ color: "#8B8494" }}>No comments yet</p>
          ) : (
            topLevel.map((c) => (
              <div key={c.id} className="mb-3">
                <CommentRow
                  comment={c}
                  isAuthor={c.user_id === postOwnerId}
                  canDelete={c.user_id === currentUserId}
                  onReact={(type) => setReaction(c, type)}
                  onReply={() => setReplyingTo(c)}
                  onDelete={() => deleteComment(c)}
                />
                {repliesOf(c.id).map((r) => (
                  <div key={r.id} className="ml-9 mt-2">
                    <CommentRow
                      comment={r}
                      isAuthor={r.user_id === postOwnerId}
                      canDelete={r.user_id === currentUserId}
                      onReact={(type) => setReaction(r, type)}
                      onReply={() => setReplyingTo(c)}
                      onDelete={() => deleteComment(r)}
                    />
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="px-4 pt-2 pb-4" style={{ borderTop: "1px solid #2A2632" }}>
          {replyingTo && (
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px]" style={{ color: "#8B8494" }}>Replying to {replyingTo.username}</span>
              <button onClick={() => setReplyingTo(null)}><X size={12} color="#8B8494" /></button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              rows={1}
              className="flex-1 rounded-2xl px-3.5 py-2.5 text-sm outline-none resize-none"
              style={{ background: "#1E1B26", border: "1px solid #2A2632", color: "#F5F1EA", maxHeight: 110 }}
            />
            <button
              disabled={posting}
              onClick={() => showCommentUploadHint()}
              title="Photo/GIF upload — coming soon"
              className="pb-2"
            >
              <ImagePlus size={19} color="#8B8494" />
            </button>
            <button
              onClick={submitComment}
              disabled={posting || !text.trim()}
              className="text-sm pb-2"
              style={{ color: text.trim() ? "#FF5D73" : "#8B8494", fontWeight: 700 }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function showCommentUploadHint() {
  alert("Photo/GIF upload in comments — coming soon");
}

function CommentRow({ comment, isAuthor, canDelete, onReact, onReply, onDelete }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-full shrink-0" style={{ background: ACCENT, padding: 1.5 }}>
        <div className="w-full h-full rounded-full bg-[#14121A] flex items-center justify-center text-[9px]" style={{ color: "#F5F1EA" }}>
          {comment.username[0].toUpperCase()}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-xs" style={{ color: "#F5F1EA" }}>
          <span style={{ fontWeight: 700 }}>{comment.username} </span>
          {isAuthor && (
            <span className="text-[9px] mr-1 px-1.5 py-0.5 rounded" style={{ background: "#2A2632", color: "#8B8494" }}>Author</span>
          )}
          {comment.content}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px]" style={{ color: "#8B8494" }}>{timeAgo(comment.created_at)}</span>
          <button onClick={onReply} className="text-[10px]" style={{ color: "#8B8494" }}>Reply</button>
          {comment.likeCount > 0 && (
            <span className="text-[10px]" style={{ color: "#8B8494" }}>{comment.likeCount} likes</span>
          )}
          {comment.dislikeCount > 0 && (
            <span className="text-[10px]" style={{ color: "#8B8494" }}>{comment.dislikeCount} dislikes</span>
          )}
          {canDelete && (
            <button onClick={onDelete} className="text-[10px]" style={{ color: "#FF5D73" }}>Delete</button>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 pt-0.5">
        <button onClick={() => onReact("like")}>
          <Heart size={13} color={comment.myReaction === "like" ? "#FF5D73" : "#8B8494"} fill={comment.myReaction === "like" ? "#FF5D73" : "none"} />
        </button>
        <button onClick={() => onReact("dislike")}>
          <ThumbsDown size={12} color={comment.myReaction === "dislike" ? "#FFB84D" : "#8B8494"} fill={comment.myReaction === "dislike" ? "#FFB84D" : "none"} />
        </button>
      </div>
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
            style={{ background: "#1E1B26", border: "1px solid #2A2632" }}
          >
            <Search size={16} color="#8B8494" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "#F5F1EA" }}
            />
          </div>
          <button
            onClick={onOpenInterests}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#1E1B26", border: "1px solid #2A2632" }}
          >
            <SlidersHorizontal size={17} color="#F5F1EA" />
          </button>
        </div>
      </div>

      {query ? (
        <div className="px-4">
          {searching ? (
            <p className="text-xs text-center py-8" style={{ color: "#8B8494" }}>
              Searching...
            </p>
          ) : results.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "#8B8494" }}>
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
                  <div className="w-full h-full rounded-full bg-[#14121A] flex items-center justify-center text-xs" style={{ color: "#F5F1EA" }}>
                    {a.username[0].toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "#F5F1EA", fontWeight: 600 }}>{a.username}</p>
                  {a.full_name && (
                    <p className="text-xs truncate" style={{ color: "#8B8494" }}>{a.full_name}</p>
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
              style={{ background: i % 4 === 0 ? "#1E1B26" : "#221F2B" }}
            >
              <ImageIcon size={18} color="#3E3849" />
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
    setSuccess(false);
  };

  const handleShare = async () => {
    setError("");
    if (!file) {
      setError("Choose a photo or video first");
      return;
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

    const { error: insertError } = await supabase.from("posts").insert({
      user_id: user.id,
      media_url: publicUrl,
      media_type: mode,
      caption,
    });

    setUploading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ background: "#14121A" }}>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
          style={{ background: ACCENT }}
        >
          <PlusSquare size={24} color="#14121A" />
        </div>
        <p className="text-sm mb-4" style={{ color: "#F5F1EA", fontWeight: 600 }}>
          Posted!
        </p>
        <button
          onClick={resetForm}
          className="rounded-xl px-5 py-2.5 text-sm"
          style={{ background: ACCENT, color: "#14121A", fontWeight: 700 }}
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
              background: mode === "photo" ? ACCENT : "#1E1B26",
              color: "#F5F1EA",
              fontWeight: 600,
              border: mode === "photo" ? "none" : "1px solid #2A2632",
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
              background: mode === "reel" ? ACCENT : "#1E1B26",
              color: "#F5F1EA",
              fontWeight: 600,
              border: mode === "reel" ? "none" : "1px solid #2A2632",
            }}
          >
            <Video size={16} /> Reel
          </button>
        </div>

        <label
          className="rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 mb-4 overflow-hidden"
          style={{ background: "#1E1B26", border: "1.5px dashed #3E3849" }}
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
              {mode === "photo" ? <ImageIcon size={28} color="#8B8494" /> : <Video size={28} color="#8B8494" />}
              <span className="text-xs" style={{ color: "#8B8494" }}>
                {mode === "photo" ? "Choose a photo" : "Choose a video"}
              </span>
            </>
          )}
        </label>

        <textarea
          placeholder="Write a caption..."
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-sm mb-4 outline-none resize-none"
          style={{ background: "#1E1B26", border: "1px solid #2A2632", color: "#F5F1EA" }}
        />

        {error && (
          <p className="text-xs mb-3" style={{ color: "#FF5D73" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleShare}
          disabled={uploading}
          className="w-full rounded-xl py-3 text-sm"
          style={{ background: ACCENT, color: "#14121A", fontWeight: 700, opacity: uploading ? 0.7 : 1 }}
        >
          {uploading ? "Uploading..." : "Share"}
        </button>
      </div>
    </div>
  );
}

function ProfileScreen({ userId, onLogout, onBack }) {
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
      .select("id, username, full_name")
      .eq("id", targetId)
      .single();
    setProfile(profileData);

    const { data: postsData } = await supabase
      .from("posts")
      .select("id, media_url, media_type")
      .eq("user_id", targetId)
      .order("created_at", { ascending: false });
    setPosts(postsData || []);

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
      <div className="flex-1 flex items-center justify-center" style={{ background: "#14121A" }}>
        <span className="text-sm" style={{ color: "#8B8494" }}>Loading...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "#14121A" }}>
        <span className="text-sm" style={{ color: "#8B8494" }}>Profile not found</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="text-sm mr-1" style={{ color: "#F5F1EA" }}>←</button>
          )}
          <span className="text-base" style={{ color: "#F5F1EA", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
            {profile.username}
          </span>
        </div>
        {isOwnProfile ? (
          <button onClick={onLogout}>
            <Settings size={20} color="#F5F1EA" />
          </button>
        ) : (
          <button
            onClick={toggleFollow}
            disabled={followBusy}
            className="rounded-lg px-4 py-1.5 text-xs"
            style={{
              background: isFollowing ? "#1E1B26" : ACCENT,
              border: isFollowing ? "1px solid #2A2632" : "none",
              color: isFollowing ? "#F5F1EA" : "#14121A",
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
          className="w-20 h-20 rounded-full shrink-0 flex items-center justify-center"
          style={{ background: ACCENT }}
        >
          <span className="text-2xl" style={{ color: "#14121A", fontWeight: 700 }}>
            {profile.username[0].toUpperCase()}
          </span>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col items-center">
            <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 700 }}>{posts.length}</span>
            <span className="text-[11px]" style={{ color: "#8B8494" }}>Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 700 }}>{followerCount}</span>
            <span className="text-[11px]" style={{ color: "#8B8494" }}>Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 700 }}>{followingCount}</span>
            <span className="text-[11px]" style={{ color: "#8B8494" }}>Following</span>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <p className="text-sm" style={{ color: "#F5F1EA", fontWeight: 600 }}>
          {profile.full_name || profile.username}
        </p>
      </div>

      <div
        className="flex items-center justify-center gap-12 py-2.5 mx-4 mb-3"
        style={{ borderTop: "1px solid #2A2632" }}
      >
        <button
          onClick={() => setTab("posts")}
          className="flex items-center gap-1.5 py-2"
          style={{ borderBottom: tab === "posts" ? "2px solid #F5F1EA" : "2px solid transparent" }}
        >
          <Grid3x3 size={24} color={tab === "posts" ? "#F5F1EA" : "#8B8494"} strokeWidth={tab === "posts" ? 2.2 : 1.8} />
        </button>
        <button
          onClick={() => setTab("reposts")}
          className="flex items-center gap-1.5 py-2"
          style={{ borderBottom: tab === "reposts" ? "2px solid #F5F1EA" : "2px solid transparent" }}
        >
          <Repeat2 size={25} color={tab === "reposts" ? "#F5F1EA" : "#8B8494"} strokeWidth={tab === "reposts" ? 2.2 : 1.8} />
        </button>
        <button
          onClick={() => setTab("tagged")}
          className="flex items-center gap-1.5 py-2"
          style={{ borderBottom: tab === "tagged" ? "2px solid #F5F1EA" : "2px solid transparent" }}
        >
          <UserSquare2 size={24} color={tab === "tagged" ? "#F5F1EA" : "#8B8494"} strokeWidth={tab === "tagged" ? 2.2 : 1.8} />
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
              style={{ background: i % 3 === 0 ? "#1E1B26" : "#221F2B" }}
            >
              <ImageIcon size={18} color="#3E3849" />
              <UserSquare2 size={12} color="#FFB84D" className="absolute top-1.5 right-1.5" />
            </div>
          ))
        ) : gridFor.length === 0 ? (
          <div className="col-span-3 py-10 text-center">
            <span className="text-xs" style={{ color: "#8B8494" }}>
              {tab === "posts" ? "No posts yet" : "No reposts yet"}
            </span>
          </div>
        ) : (
          gridFor.map((p) => (
            <div
              key={p.id}
              className="aspect-square flex items-center justify-center relative overflow-hidden"
              style={{ background: "#1E1B26" }}
            >
              {p.media_type === "photo" ? (
                <img src={p.media_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <video src={p.media_url} className="w-full h-full object-cover" />
              )}
              {tab === "reposts" && (
                <Repeat2 size={12} color="#FFB84D" className="absolute top-1.5 right-1.5" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const mockChats = [
  { id: 1, user: "nilufar.k", last: "The photo turned out amazing!", time: "2m" },
  { id: 2, user: "rafiq.tech", last: "Okay, sounds good 👍", time: "1h" },
  { id: 3, user: "meherun.a", last: "See you tomorrow", time: "5h" },
];

function MessagesScreen({ onBack }) {
  const [query, setQuery] = useState("");
  const filteredChats = mockChats.filter((c) =>
    c.user.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full" style={{ background: "#14121A" }}>
      <div
        className="sticky top-0 z-10 px-4 pt-4 pb-3"
        style={{ background: "#14121A" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="text-sm" style={{ color: "#F5F1EA" }}>←</button>
          <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#F5F1EA" }}>
            Messages
          </h1>
        </div>
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ background: "#1E1B26", border: "1px solid #2A2632" }}
        >
          <Search size={15} color="#8B8494" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#F5F1EA" }}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <p className="text-center text-xs mt-6" style={{ color: "#8B8494" }}>
            No ID found
          </p>
        ) : (
          filteredChats.map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-4 py-2.5">
              <div className="w-11 h-11 rounded-full shrink-0" style={{ background: ACCENT, padding: 2 }}>
                <div className="w-full h-full rounded-full bg-[#14121A] flex items-center justify-center text-xs" style={{ color: "#F5F1EA" }}>
                  {c.user[0].toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "#F5F1EA", fontWeight: 600 }}>{c.user}</p>
                <p className="text-xs truncate" style={{ color: "#8B8494" }}>{c.last}</p>
              </div>
              <span className="text-[10px] shrink-0" style={{ color: "#8B8494" }}>{c.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const mockNotifications = [
  { id: 1, user: "nilufar.k", action: "liked your post", time: "5m", icon: Heart, color: "#FF5D73" },
  { id: 2, user: "rafiq.tech", action: "started following you", time: "22m", icon: CircleUserRound, color: "#8B8494" },
  { id: 3, user: "meherun.a", action: "commented on your Reel", time: "1h", icon: MessageCircle, color: "#8B8494" },
  { id: 4, user: "tanvir.v", action: "reposted your post", time: "3h", icon: Repeat2, color: "#FFB84D" },
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
    type === "like" ? "liked your post" : type === "follow" ? "started following you" : type === "comment" ? "commented on your post" : "";

  const iconFor = (type) => (type === "like" ? Heart : type === "comment" ? MessageCircle : CircleUserRound);
  const colorFor = (type) => (type === "like" ? "#FF5D73" : type === "comment" ? "#8B8494" : "#8B8494");

  return (
    <div className="flex flex-col h-full" style={{ background: "#14121A" }}>
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 pt-4 pb-3"
        style={{ background: "#14121A", borderBottom: "1px solid #221F2B" }}
      >
        <button onClick={onBack} className="text-sm" style={{ color: "#F5F1EA" }}>←</button>
        <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#F5F1EA" }}>
          Notifications
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-center text-xs py-8" style={{ color: "#8B8494" }}>
            Loading...
          </p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-xs py-8" style={{ color: "#8B8494" }}>
            No notifications yet
          </p>
        ) : (
          notifications.map((n) => {
            const Icon = iconFor(n.type);
            return (
              <div key={n.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-11 h-11 rounded-full shrink-0" style={{ background: ACCENT, padding: 2 }}>
                  <div className="w-full h-full rounded-full bg-[#14121A] flex items-center justify-center text-xs" style={{ color: "#F5F1EA" }}>
                    {n.username[0].toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: "#F5F1EA" }}>
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
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ background: "#14121A" }}>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
          style={{ background: ACCENT }}
        >
          <Ellipsis size={22} color="#14121A" />
        </div>
        <p className="text-sm mb-1" style={{ color: "#F5F1EA", fontWeight: 600 }}>
          Reported
        </p>
        <p className="text-xs mb-6" style={{ color: "#8B8494" }}>
          Thanks for letting us know. We'll review it.
        </p>
        <button onClick={onBack} style={{ color: "#FF5D73", fontWeight: 600 }} className="text-sm">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#14121A" }}>
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 pt-4 pb-3"
        style={{ background: "#14121A", borderBottom: "1px solid #221F2B" }}
      >
        <button onClick={onBack} className="text-sm" style={{ color: "#F5F1EA" }}>←</button>
        <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#F5F1EA" }}>
          Report
        </h1>
      </div>
      <p className="text-xs px-4 pt-4 pb-2" style={{ color: "#8B8494" }}>
        Why are you reporting this post?
      </p>
      <div className="flex-1 overflow-y-auto">
        {reportReasons.map((reason) => (
          <button
            key={reason}
            onClick={() => handleReport(reason)}
            disabled={submitting}
            className="w-full text-left px-4 py-3.5 text-sm"
            style={{ color: "#F5F1EA", borderBottom: "1px solid #221F2B", opacity: submitting ? 0.6 : 1 }}
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
    <div className="flex flex-col h-full" style={{ background: "#14121A" }}>
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 pt-4 pb-3"
        style={{ background: "#14121A", borderBottom: "1px solid #221F2B" }}
      >
        <button onClick={onBack} className="text-sm" style={{ color: "#F5F1EA" }}>←</button>
        <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#F5F1EA" }}>
          Comments
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3">
        {loading ? (
          <p className="text-center text-xs py-8" style={{ color: "#8B8494" }}>
            Loading...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-center text-xs py-8" style={{ color: "#8B8494" }}>
            No comments yet — be the first to comment
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full shrink-0" style={{ background: ACCENT, padding: 1.5 }}>
                <div className="w-full h-full rounded-full bg-[#14121A] flex items-center justify-center text-[10px]" style={{ color: "#F5F1EA" }}>
                  {c.username[0].toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: "#F5F1EA", whiteSpace: "pre-wrap" }}>
                  <span style={{ fontWeight: 600 }}>{c.username}</span> {c.content}
                </p>
                {c.user_id === userId && (
                  <button onClick={() => deleteComment(c)} className="text-[10px] mt-1" style={{ color: "#FF5D73" }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-end gap-2 px-4 py-3" style={{ borderTop: "1px solid #221F2B" }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={1}
          className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
          style={{ background: "#1E1B26", border: "1px solid #2A2632", color: "#F5F1EA", maxHeight: 110 }}
        />
        <button
          onClick={handlePost}
          disabled={posting || !newComment.trim()}
          className="rounded-xl px-4 py-2.5 text-sm"
          style={{ background: ACCENT, color: "#14121A", fontWeight: 700, opacity: posting || !newComment.trim() ? 0.6 : 1 }}
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
      style={{ background: "#1E1B26", border: "1px solid #2A2632" }}
    >
      <Icon size={17} color="#8B8494" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none text-sm"
        style={{ color: "#F5F1EA" }}
      />
      {showToggle && (
        <button onClick={onToggle} type="button">
          {revealed ? <EyeOff size={16} color="#8B8494" /> : <Eye size={16} color="#8B8494" />}
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
    <div className="flex-1 flex flex-col justify-center px-6" style={{ background: "#14121A" }}>
      <h1
        className="text-3xl text-center mb-1"
        style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "#F5F1EA" }}
      >
        Loop
      </h1>
      <p className="text-center text-xs mb-8" style={{ color: "#8B8494" }}>
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
        <p className="text-xs mb-3" style={{ color: "#FF5D73" }}>
          {error}
        </p>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full rounded-xl py-3 text-sm mt-2 mb-4"
        style={{ background: ACCENT, color: "#14121A", fontWeight: 700, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Please wait..." : "Log In"}
      </button>

      <p className="text-center text-xs" style={{ color: "#8B8494" }}>
        Don't have an account?{" "}
        <button onClick={onGoSignup} style={{ color: "#FF5D73", fontWeight: 600 }}>
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
      <div className="flex-1 flex flex-col justify-center items-center px-6 text-center" style={{ background: "#14121A" }}>
        <Mail size={32} color="#FF5D73" className="mb-3" />
        <p className="text-sm mb-2" style={{ color: "#F5F1EA", fontWeight: 600 }}>
          Check your email
        </p>
        <p className="text-xs mb-6" style={{ color: "#8B8494" }}>
          A confirmation link was sent to {email}. Click the link to verify your account, then log in.
        </p>
        <button onClick={onGoLogin} style={{ color: "#FF5D73", fontWeight: 600 }} className="text-sm">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6" style={{ background: "#14121A" }}>
      <h1
        className="text-3xl text-center mb-1"
        style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "#F5F1EA" }}
      >
        New Account
      </h1>
      <p className="text-center text-xs mb-8" style={{ color: "#8B8494" }}>
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
        <p className="text-xs mb-3" style={{ color: "#FF5D73" }}>
          {error}
        </p>
      )}

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full rounded-xl py-3 text-sm mt-2 mb-4"
        style={{ background: ACCENT, color: "#14121A", fontWeight: 700, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Please wait..." : "Sign Up"}
      </button>

      <p className="text-center text-xs" style={{ color: "#8B8494" }}>
        Already have an account?{" "}
        <button onClick={onGoLogin} style={{ color: "#FF5D73", fontWeight: 600 }}>
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
    <div className="flex flex-col h-full" style={{ background: "#14121A" }}>
      <div
        className="sticky top-0 z-10 px-4 pt-4 pb-3"
        style={{ background: "#14121A", borderBottom: "1px solid #221F2B" }}
      >
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm" style={{ color: "#F5F1EA" }}>←</button>
          <h1 className="text-lg" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#F5F1EA" }}>
            Interests
          </h1>
        </div>
        <p className="text-xs mt-1" style={{ color: "#8B8494" }}>
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
                  background: isSelected ? ACCENT : "#1E1B26",
                  color: isSelected ? "#14121A" : "#F5F1EA",
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected ? "none" : "1px solid #2A2632",
                }}
              >
                <Hash size={12} color={isSelected ? "#14121A" : "#8B8494"} />
                {t}
              </button>
            );
          })}

          {adding ? (
            <div
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
              style={{ background: "#1E1B26", border: "1px solid #2A2632" }}
            >
              <input
                autoFocus
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                placeholder="New topic..."
                className="bg-transparent outline-none text-xs w-24"
                style={{ color: "#F5F1EA" }}
              />
              <button onClick={handleAddTopic} className="text-xs" style={{ color: "#FF5D73", fontWeight: 700 }}>
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1 rounded-full px-3.5 py-2 text-xs"
              style={{ background: "#1E1B26", border: "1.5px dashed #3E3849", color: "#C9C3D1" }}
            >
              <Plus size={13} /> Add
            </button>
          )}
        </div>

        <div style={{ borderTop: "1px solid #221F2B" }} className="pt-4">
          <p className="text-xs mb-3" style={{ color: "#8B8494" }}>
            Related Posts & Reels
          </p>
          {matches.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "#8B8494" }}>
              Pick at least one topic above
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {matches.map((c) => (
                <div
                  key={c.id}
                  className="relative aspect-square flex flex-col items-center justify-center gap-1 rounded-lg"
                  style={{ background: "#1E1B26", border: "1px solid #2A2632" }}
                >
                  {c.type === "reel" ? (
                    <Play size={16} color="#3E3849" fill="#3E3849" />
                  ) : (
                    <ImageIcon size={16} color="#3E3849" />
                  )}
                  <span className="text-[9px] px-1 text-center" style={{ color: "#8B8494" }}>
                    #{c.tag}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid #221F2B" }} className="pt-4 mt-5 pb-2">
          <p className="text-xs mb-1" style={{ color: "#F5F1EA", fontWeight: 600 }}>
            What you want to see less
          </p>
          <p className="text-[11px] mb-3" style={{ color: "#8B8494" }}>
            The algorithm will stop showing posts/reels about these topics
          </p>

          <div className="flex flex-wrap gap-2">
            {lessTopics.map((t) => (
              <button
                key={t}
                onClick={() => removeLessTopic(t)}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs"
                style={{ background: "#2A1B22", border: "1px solid #4A2530", color: "#F5B8C4" }}
              >
                <Hash size={12} color="#F5B8C4" />
                {t}
                <span style={{ fontWeight: 700 }}>×</span>
              </button>
            ))}

            {addingLess ? (
              <div
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
                style={{ background: "#1E1B26", border: "1px solid #2A2632" }}
              >
                <input
                  autoFocus
                  value={newLessTopic}
                  onChange={(e) => setNewLessTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddLessTopic()}
                  placeholder="New topic..."
                  className="bg-transparent outline-none text-xs w-24"
                  style={{ color: "#F5F1EA" }}
                />
                <button onClick={handleAddLessTopic} className="text-xs" style={{ color: "#FF5D73", fontWeight: 700 }}>
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingLess(true)}
                className="flex items-center gap-1 rounded-full px-3.5 py-2 text-xs"
                style={{ background: "#1E1B26", border: "1.5px dashed #3E3849", color: "#C9C3D1" }}
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
  const ActiveScreen = TABS.find((t) => t.key === active).screen;
  const overlayOpen = inboxOpen || notificationsOpen || interestsOpen || commentsPostId !== null || reportPostId !== null || viewProfileId !== null;

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
      <div className="w-full min-h-screen flex items-center justify-center" style={{ background: "#0A090D" }}>
        <span className="text-sm" style={{ color: "#8B8494" }}>Loading...</span>
      </div>
    );
  }

  if (authScreen) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ background: "#0A090D" }}>
        <div
          className="flex flex-col w-full max-w-[390px] h-[780px] overflow-hidden relative"
          style={{ background: "#14121A", borderRadius: 36, border: "8px solid #0A090D" }}
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
    <div className="w-full min-h-screen flex items-center justify-center" style={{ background: "#0A090D" }}>
      <div
        className="flex flex-col w-full max-w-[390px] h-[780px] overflow-hidden relative"
        style={{ background: "#14121A", borderRadius: 36, border: "8px solid #0A090D" }}
      >
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
        ) : viewProfileId !== null ? (
          <ProfileScreen userId={viewProfileId} onBack={() => setViewProfileId(null)} />
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
          <ProfileScreen onLogout={() => supabase.auth.signOut()} />
        ) : (
          <ActiveScreen />
        )}

        {/* Bottom nav */}
        {!overlayOpen && (
          <div
            className="flex items-center justify-around px-2 py-3 shrink-0"
            style={{ background: "#14121A", borderTop: "1px solid #221F2B" }}
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
                  <Icon size={22} color={isActive ? "#FF5D73" : "#8B8494"} strokeWidth={2} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
