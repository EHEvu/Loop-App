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
} from "lucide-react";

// ---- Design tokens ----
// bg: #14121A (deep aubergine-black)  card: #1E1B26
// accent: #FF5D73 (coral) -> #FFB84D (amber) gradient
// text: #F5F1EA (warm off-white)  muted: #8B8494

const ACCENT = "linear-gradient(135deg, #FF5D73 0%, #FFB84D 100%)";

const mockPosts = [
  { id: 1, user: "nilufar.k", place: "Cox's Bazar", likes: 482, caption: "The sunset was unreal today 🌅" },
  { id: 2, user: "rafiq.tech", place: "Dhaka", likes: 219, caption: "New desk setup, finally done ✨" },
  { id: 3, user: "meherun.a", place: "Sylhet", likes: 967, caption: "Morning at the tea garden ☕🍃" },
];

const mockReels = [
  { id: 1, user: "tanvir.v", views: "12.4K" },
  { id: 2, user: "priya.dances", views: "8.1K" },
  { id: 3, user: "shuvo.eats", views: "23K" },
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

function FeedScreen({ onOpenMessages, onOpenNotifications, onOpenComments, onOpenReport }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [userId, setUserId] = useState(null);
  const [menuOpenFor, setMenuOpenFor] = useState(null);

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
      .select("id, media_url, media_type, caption, created_at, user_id")
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

    const { data: savesData } = await supabase
      .from("saves")
      .select("post_id, user_id")
      .eq("user_id", user?.id ?? "");

    const merged = (postsData || []).map((p) => {
      const profile = (profilesData || []).find((pr) => pr.id === p.user_id);
      const postLikes = (likesData || []).filter((l) => l.post_id === p.id);
      const postReposts = (repostsData || []).filter((r) => r.post_id === p.id);
      return {
        ...p,
        username: profile?.username || "unknown",
        likeCount: postLikes.length,
        liked: postLikes.some((l) => l.user_id === user?.id),
        repostCount: postReposts.length,
        reposted: postReposts.some((r) => r.user_id === user?.id),
        saved: (savesData || []).some((s) => s.post_id === p.id),
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
              <div
                className="w-9 h-9 rounded-full shrink-0"
                style={{ background: ACCENT, padding: 2 }}
              >
                <div className="w-full h-full rounded-full bg-[#14121A] flex items-center justify-center text-[10px]" style={{ color: "#F5F1EA" }}>
                  {post.username[0].toUpperCase()}
                </div>
              </div>
              <div className="flex flex-col leading-tight flex-1">
                <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 600 }}>{post.username}</span>
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
                      className="absolute right-0 top-6 z-20 rounded-xl overflow-hidden"
                      style={{ background: "#1E1B26", border: "1px solid #2A2632", minWidth: 140 }}
                    >
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
                <button onClick={() => onOpenComments(post.id)}>
                  <MessageCircle size={20} color="#F5F1EA" />
                </button>
                <button onClick={() => toggleRepost(post)}>
                  <Repeat2 size={22} color={post.reposted ? "#FFB84D" : "#F5F1EA"} strokeWidth={post.reposted ? 2.6 : 2} />
                </button>
              </div>
            </div>
            <div className="px-4 pt-1.5">
              <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 600 }}>{post.likeCount} likes</span>
              {post.repostCount > 0 && (
                <span className="text-xs ml-2" style={{ color: "#8B8494" }}>· {post.repostCount} reposts</span>
              )}
              {post.caption && (
                <p className="text-sm mt-0.5" style={{ color: "#C9C3D1" }}>
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

const mockReelsFull = [
  { id: 1, user: "tanvir.v", caption: "5-minute morning routine ☀️", likes: "12.4K", comments: "342", shares: "89" },
  { id: 2, user: "priya.dances", caption: "Tried a new move 💃", likes: "8.1K", comments: "156", shares: "44" },
  { id: 3, user: "shuvo.eats", caption: "Best street food 😋", likes: "23K", comments: "512", shares: "201" },
  { id: 4, user: "meherun.a", caption: "Morning at the tea garden ☕🍃", likes: "6.7K", comments: "98", shares: "31" },
];

function ReelsScreen() {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [reelState, setReelState] = useState(
    mockReelsFull.map((r) => ({ ...r, liked: false, reposted: false, saved: false }))
  );
  const touchStartY = React.useRef(0);

  const reel = reelState[index];

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY < -50 && index < reelState.length - 1) {
      setIndex((i) => i + 1); // swiped up -> next reel
      setExpanded(false);
    } else if (deltaY > 50 && index > 0) {
      setIndex((i) => i - 1); // swiped down -> previous reel
      setExpanded(false);
    }
  };

  const updateReel = (patch) => {
    setReelState((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch(r) } : r)));
  };

  const toggleLike = () =>
    updateReel((r) => ({ liked: !r.liked }));
  const toggleRepost = () => updateReel((r) => ({ reposted: !r.reposted }));
  const toggleSave = () => updateReel((r) => ({ saved: !r.saved }));

  return (
    <div
      className="flex-1 relative overflow-hidden"
      style={{ background: "#0E0C13" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Reel content placeholder */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        onDoubleClick={toggleLike}
      >
        <Video size={40} color="#2A2632" />
      </div>

      {/* top label */}
      <div className="absolute top-4 left-0 right-0 flex justify-center">
        <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
          Reels
        </span>
      </div>

      {/* bottom-left caption */}
      <div className="absolute left-4 bottom-5 right-20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full shrink-0" style={{ background: ACCENT, padding: 1.5 }}>
            <div className="w-full h-full rounded-full bg-[#14121A] flex items-center justify-center text-[10px]" style={{ color: "#F5F1EA" }}>
              {reel.user[0].toUpperCase()}
            </div>
          </div>
          <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 600 }}>{reel.user}</span>
        </div>
        <p className="text-xs" style={{ color: "#E5E1EA" }}>{reel.caption}</p>
      </div>

      {/* Quick Actions — the only action control; expands to full-size icons */}
      <div className="absolute right-3 bottom-6 flex flex-col items-center">
        <div className="relative flex flex-col items-center">
          {expanded && (
            <div
              className="absolute bottom-12 flex flex-col items-center gap-5 py-3 px-2 rounded-full"
              style={{ background: "rgba(30,27,38,0.92)", border: "1px solid #2A2632" }}
            >
              <button onClick={toggleLike} className="flex flex-col items-center gap-1">
                <Heart size={26} color={reel.liked ? "#FF5D73" : "#F5F1EA"} fill={reel.liked ? "#FF5D73" : "none"} />
                <span className="text-[10px]" style={{ color: "#F5F1EA" }}>{reel.likes}</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <MessageCircle size={25} color="#F5F1EA" />
                <span className="text-[10px]" style={{ color: "#F5F1EA" }}>{reel.comments}</span>
              </button>
              <button onClick={toggleRepost} className="flex flex-col items-center gap-1">
                <Repeat2 size={26} color={reel.reposted ? "#FFB84D" : "#F5F1EA"} strokeWidth={reel.reposted ? 2.4 : 2} />
              </button>
              <button className="flex flex-col items-center gap-1">
                <SendHorizontal size={24} color="#F5F1EA" />
                <span className="text-[10px]" style={{ color: "#F5F1EA" }}>{reel.shares}</span>
              </button>
              <button onClick={toggleSave} className="flex flex-col items-center gap-1">
                <Bookmark size={24} color="#F5F1EA" fill={reel.saved ? "#F5F1EA" : "none"} />
              </button>
            </div>
          )}
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
        {reelState.map((_, i) => (
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

function SearchScreen({ onOpenInterests }) {
  const [query, setQuery] = useState("");
  const results = mockAccounts.filter(
    (a) =>
      a.user.toLowerCase().includes(query.toLowerCase()) ||
      a.name.toLowerCase().includes(query.toLowerCase())
  );

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
          {results.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "#8B8494" }}>
              No accounts found
            </p>
          ) : (
            results.map((a) => (
              <div key={a.id} className="flex items-center gap-3 py-2.5">
                <div className="w-11 h-11 rounded-full shrink-0" style={{ background: ACCENT, padding: 2 }}>
                  <div className="w-full h-full rounded-full bg-[#14121A] flex items-center justify-center text-xs" style={{ color: "#F5F1EA" }}>
                    {a.user[0].toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "#F5F1EA", fontWeight: 600 }}>{a.user}</p>
                  <p className="text-xs truncate" style={{ color: "#8B8494" }}>{a.name} · {a.followers} followers</p>
                </div>
              </div>
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

function ProfileScreen({ onLogout }) {
  const [tab, setTab] = useState("posts");
  const mockReposts = Array.from({ length: 4 }, (_, i) => i);
  const mockTagged = Array.from({ length: 6 }, (_, i) => i);

  const tabOrder = ["posts", "reposts", "tagged"];
  const gridFor = { posts: mockGrid, reposts: mockReposts, tagged: mockTagged }[tab];

  const touchStartX = React.useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const currentIndex = tabOrder.indexOf(tab);
    if (deltaX < -50 && currentIndex < tabOrder.length - 1) {
      setTab(tabOrder[currentIndex + 1]); // swiped left -> next tab
    } else if (deltaX > 50 && currentIndex > 0) {
      setTab(tabOrder[currentIndex - 1]); // swiped right -> previous tab
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <span className="text-base" style={{ color: "#F5F1EA", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
          your.handle
        </span>
        <button onClick={onLogout}>
          <Settings size={20} color="#F5F1EA" />
        </button>
      </div>

      <div className="flex items-center gap-5 px-4 mb-4">
        <div
          className="w-20 h-20 rounded-full shrink-0 flex items-center justify-center"
          style={{ background: ACCENT }}
        >
          <span className="text-2xl" style={{ color: "#14121A", fontWeight: 700 }}>A</span>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col items-center">
            <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 700 }}>24</span>
            <span className="text-[11px]" style={{ color: "#8B8494" }}>Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 700 }}>1.2K</span>
            <span className="text-[11px]" style={{ color: "#8B8494" }}>Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 700 }}>310</span>
            <span className="text-[11px]" style={{ color: "#8B8494" }}>Following</span>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <p className="text-sm" style={{ color: "#F5F1EA", fontWeight: 600 }}>Your Name</p>
        <p className="text-xs mt-0.5" style={{ color: "#8B8494" }}>Your bio will show here ✨</p>
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
        {gridFor.map((i) => (
          <div
            key={i}
            className="aspect-square flex items-center justify-center relative"
            style={{ background: i % 3 === 0 ? "#1E1B26" : "#221F2B" }}
          >
            <ImageIcon size={18} color="#3E3849" />
            {tab === "reposts" && (
              <Repeat2 size={12} color="#FFB84D" className="absolute top-1.5 right-1.5" />
            )}
            {tab === "tagged" && (
              <UserSquare2 size={12} color="#FFB84D" className="absolute top-1.5 right-1.5" />
            )}
          </div>
        ))}
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
        {mockNotifications.map((n) => {
          const Icon = n.icon;
          return (
            <div key={n.id} className="flex items-center gap-3 px-4 py-2.5">
              <div className="w-11 h-11 rounded-full shrink-0" style={{ background: ACCENT, padding: 2 }}>
                <div className="w-full h-full rounded-full bg-[#14121A] flex items-center justify-center text-xs" style={{ color: "#F5F1EA" }}>
                  {n.user[0].toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: "#F5F1EA" }}>
                  <span style={{ fontWeight: 600 }}>{n.user}</span> {n.action}
                </p>
                <span className="text-[10px]" style={{ color: "#8B8494" }}>{n.time}</span>
              </div>
              <Icon size={17} color={n.color} className="shrink-0" />
            </div>
          );
        })}
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

function CommentsScreen({ postId, onBack }) {
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
    }
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
                <p className="text-sm" style={{ color: "#F5F1EA" }}>
                  <span style={{ fontWeight: 600 }}>{c.username}</span> {c.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: "1px solid #221F2B" }}>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePost()}
          placeholder="Write a comment..."
          className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none"
          style={{ background: "#1E1B26", border: "1px solid #2A2632", color: "#F5F1EA" }}
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
  const [reportPostId, setReportPostId] = useState(null);
  const ActiveScreen = TABS.find((t) => t.key === active).screen;
  const overlayOpen = inboxOpen || notificationsOpen || interestsOpen || commentsPostId !== null || reportPostId !== null;

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
          <CommentsScreen postId={commentsPostId} onBack={() => setCommentsPostId(null)} />
        ) : reportPostId !== null ? (
          <ReportScreen postId={reportPostId} onBack={() => setReportPostId(null)} />
        ) : active === "feed" ? (
          <FeedScreen
            onOpenMessages={() => setInboxOpen(true)}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onOpenComments={(postId) => setCommentsPostId(postId)}
            onOpenReport={(postId) => setReportPostId(postId)}
          />
        ) : active === "search" ? (
          <SearchScreen onOpenInterests={() => setInterestsOpen(true)} />
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
