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

const ACCENT = "linear-gradient(135deg, #FF5D73 0%, #FFB84D 100%)";

const mockPosts = [
  { id: 1, user: "nilufar.k", place: "Cox's Bazar", likes: 482, caption: "সূর্যাস্তটা আজ অন্যরকম সুন্দর ছিল 🌅" },
  { id: 2, user: "rafiq.tech", place: "Dhaka", likes: 219, caption: "নতুন ডেস্ক সেটআপ, অবশেষে শেষ হলো ✨" },
  { id: 3, user: "meherun.a", place: "Sylhet", likes: 967, caption: "চা বাগানের সকাল ☕🍃" },
];

const mockReels = [
  { id: 1, user: "tanvir.v", views: "12.4K" },
  { id: 2, user: "priya.dances", views: "8.1K" },
  { id: 3, user: "shuvo.eats", views: "23K" },
];

const mockGrid = Array.from({ length: 9 }, (_, i) => i);

const mockStories = [
  { id: 0, user: "আপনি", isSelf: true },
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
          লোড হচ্ছে...
        </p>
      ) : loadError ? (
        <p className="text-center text-xs py-10 px-6" style={{ color: "#FF5D73" }}>
          {loadError}
        </p>
      ) : posts.length === 0 ? (
        <p className="text-center text-xs py-10" style={{ color: "#8B8494" }}>
          এখনো কোনো পোস্ট নেই — প্রথম পোস্টটি আপনিই করুন!
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
  { id: 1, user: "tanvir.v", caption: "সকালের রুটিন ৫ মিনিটে ☀️", likes: "12.4K", comments: "342", shares: "89" },
  { id: 2, user: "priya.dances", caption: "নতুন স্টেপ ট্রাই করলাম 💃", likes: "8.1K", comments: "156", shares: "44" },
  { id: 3, user: "shuvo.eats", caption: "রাস্তার সেরা ফুচকা 😋", likes: "23K", comments: "512", shares: "201" },
  { id: 4, user: "meherun.a", caption: "চা বাগানের সকাল ☕🍃", likes: "6.7K", comments: "98", shares: "31" },
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
      setIndex((i) => i + 1);
      setExpanded(false);
    } else if (deltaY > 50 && index > 0) {
      setIndex((i) => i - 1);
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
      <div
        className="absolute inset-0 flex items-center justify-center"
        onDoubleClick={toggleLike}
      >
        <Video size={40} color="#2A2632" />
      </div>

      <div className="absolute top-4 left-0 right-0 flex justify-center">
        <span className="text-sm" style={{ color: "#F5F1EA", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
          Reels
        </span>
      </div>

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
              কোনো অ্যাকাউন্ট পাওয়া যায়নি
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
      setError("আগে একটা ছবি বা ভিডিও বেছে নিন");
      return;
    }
    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploading(false);
      setError("লগইন করা নেই");
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
          পোস্ট হয়ে গেছে!
        </p>
        <button
          onClick={resetForm}
          className="rounded-xl px-5 py-2.5 text-sm"
          style={{ background: ACCENT, color: "#14121A", fontWeight: 700 }}
        >
          আরেকটা পোস্ট করুন
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <TopBar title="নতুন পোস্ট" />
      <div className="px-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setMode("photo"); setFile(null); setPreviewUrl(null); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition"
            style={{ background: mode === "photo" ? ACCENT : "#1E1B26", color: "#F5F1EA", fontWeight: 600, border: mode === "photo" ? "none" : "1px solid #2A2632" }}
          >
            <ImageIcon size={16} /> Photo
          </button>
          <button
            onClick={() => { setMode("reel"); setFile(null); setPreviewUrl(null); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition"
            style={{ background: mode === "reel" ? ACCENT : "#1E1B26", color: "#F5F1EA", fontWeight: 600, border: mode === "reel" ? "none" : "1px solid #2A2632" }}
          >
            <Video size={16} /> Reel
          </button>
        </div>

        <label
          className="rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 mb-4 overflow-hidden"
          style={{ background: "#1E1B26", border: "1.5px dashed #3E3849" }}
        >
          <input type="file" accept={mode === "photo" ? "image/*" : "video/*"} onChange={handleFileChange} className="hidden" />
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
                {mode === "photo" ? "একটা ছবি বেছে নিন" : "একটা ভিডিও বেছে নিন"}
              </span>
            </>
          )}
        </label>

        <textarea
          placeholder="ক্যাপশন লিখুন..."
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-sm mb-4 outline-none resize-none"
          style={{ background: "#1E1B26", border: "1px solid #2A2632", color: "#F5F1EA" }}
        />

        {error && <p className="text-xs mb-3" style={{ color: "#FF5D73" }}>{error}</p>}

        <button
          onClick={handleShare}
          disabled={uploading}
          className="w-full rounded-xl py-3 text-sm"
          style={{ background: ACCENT, color: "#14121A", fontWeight: 700, opacity: uploading ? 0.7 : 1 }}
        >
          {uploading ? "আপলোড হচ্ছে..." : "শেয়ার করুন"}
        </button>
      </div>
    </div>
  );
}
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
              কোনো অ্যাকাউন্ট পাওয়া যায়নি
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
      setError("আগে একটা ছবি বা ভিডিও বেছে নিন");
      return;
    }
    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploading(false);
      setError("লগইন করা নেই");
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
          পোস্ট হয়ে গেছে!
        </p>
        <button
          onClick={resetForm}
          className="rounded-xl px-5 py-2.5 text-sm"
          style={{ background: ACCENT, color: "#14121A", fontWeight: 700 }}
        >
          আরেকটা পোস্ট করুন
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <TopBar title="নতুন পোস্ট" />
      <div className="px-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setMode("photo"); setFile(null); setPreviewUrl(null); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition"
            style={{ background: mode === "photo" ? ACCENT : "#1E1B26", color: "#F5F1EA", fontWeight: 600, border: mode === "photo" ? "none" : "1px solid #2A2632" }}
          >
            <ImageIcon size={16} /> Photo
          </button>
          <button
            onClick={() => { setMode("reel"); setFile(null); setPreviewUrl(null); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition"
            style={{ background: mode === "reel" ? ACCENT : "#1E1B26", color: "#F5F1EA", fontWeight: 600, border: mode === "reel" ? "none" : "1px solid #2A2632" }}
          >
            <Video size={16} /> Reel
          </button>
        </div>

        <label
          className="rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 mb-4 overflow-hidden"
          style={{ background: "#1E1B26", border: "1.5px dashed #3E3849" }}
        >
          <input type="file" accept={mode === "photo" ? "image/*" : "video/*"} onChange={handleFileChange} className="hidden" />
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
                {mode === "photo" ? "একটা ছবি বেছে নিন" : "একটা ভিডিও বেছে নিন"}
              </span>
            </>
          )}
        </label>

        <textarea
          placeholder="ক্যাপশন লিখুন..."
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-sm mb-4 outline-none resize-none"
          style={{ background: "#1E1B26", border: "1px solid #2A2632", color: "#F5F1EA" }}
        />

        {error && <p className="text-xs mb-3" style={{ color: "#FF5D73" }}>{error}</p>}

        <button
          onClick={handleShare}
          disabled={uploading}
          className="w-full rounded-xl py-3 text-sm"
          style={{ background: ACCENT, color: "#14121A", fontWeight: 700, opacity: uploading ? 0.7 : 1 }}
        >
          {uploading ? "আপলোড হচ্ছে..." : "শেয়ার করুন"}
        </button>
      </div>
    </div>
  );
}
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
              কোনো অ্যাকাউন্ট পাওয়া যায়নি
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
      setError("আগে একটা ছবি বা ভিডিও বেছে নিন");
      return;
    }
    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploading(false);
      setError("লগইন করা নেই");
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
          পোস্ট হয়ে গেছে!
        </p>
        <button
          onClick={resetForm}
          className="rounded-xl px-5 py-2.5 text-sm"
          style={{ background: ACCENT, color: "#14121A", fontWeight: 700 }}
        >
          আরেকটা পোস্ট করুন
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <TopBar title="নতুন পোস্ট" />
      <div className="px-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setMode("photo"); setFile(null); setPreviewUrl(null); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition"
            style={{ background: mode === "photo" ? ACCENT : "#1E1B26", color: "#F5F1EA", fontWeight: 600, border: mode === "photo" ? "none" : "1px solid #2A2632" }}
          >
            <ImageIcon size={16} /> Photo
          </button>
          <button
            onClick={() => { setMode("reel"); setFile(null); setPreviewUrl(null); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition"
            style={{ background: mode === "reel" ? ACCENT : "#1E1B26", color: "#F5F1EA", fontWeight: 600, border: mode === "reel" ? "none" : "1px solid #2A2632" }}
          >
            <Video size={16} /> Reel
          </button>
        </div>

        <label
          className="rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 mb-4 overflow-hidden"
          style={{ background: "#1E1B26", border: "1.5px dashed #3E3849" }}
        >
          <input type="file" accept={mode === "photo" ? "image/*" : "video/*"} onChange={handleFileChange} className="hidden" />
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
                {mode === "photo" ? "একটা ছবি বেছে নিন" : "একটা ভিডিও বেছে নিন"}
              </span>
            </>
          )}
        </label>

        <textarea
          placeholder="ক্যাপশন লিখুন..."
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-sm mb-4 outline-none resize-none"
          style={{ background: "#1E1B26", border: "1px solid #2A2632", color: "#F5F1EA" }}
        />

        {error && <p className="text-xs mb-3" style={{ color: "#FF5D73" }}>{error}</p>}

        <button
          onClick={handleShare}
          disabled={uploading}
          className="w-full rounded-xl py-3 text-sm"
          style={{ background: ACCENT, color: "#14121A", fontWeight: 700, opacity: uploading ? 0.7 : 1 }}
        >
          {uploading ? "আপলোড হচ্ছে..." : "শেয়ার করুন"}
        </button>
      </div>
    </div>
  );
}
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
              কোনো অ্যাকাউন্ট পাওয়া যায়নি
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
      setError("আগে একটা ছবি বা ভিডিও বেছে নিন");
      return;
    }
    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploading(false);
      setError("লগইন করা নেই");
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
          পোস্ট হয়ে গেছে!
        </p>
        <button
          onClick={resetForm}
          className="rounded-xl px-5 py-2.5 text-sm"
          style={{ background: ACCENT, color: "#14121A", fontWeight: 700 }}
        >
          আরেকটা পোস্ট করুন
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <TopBar title="নতুন পোস্ট" />
      <div className="px-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setMode("photo"); setFile(null); setPreviewUrl(null); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition"
            style={{ background: mode === "photo" ? ACCENT : "#1E1B26", color: "#F5F1EA", fontWeight: 600, border: mode === "photo" ? "none" : "1px solid #2A2632" }}
          >
            <ImageIcon size={16} /> Photo
          </button>
          <button
            onClick={() => { setMode("reel"); setFile(null); setPreviewUrl(null); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition"
            style={{ background: mode === "reel" ? ACCENT : "#1E1B26", color: "#F5F1EA", fontWeight: 600, border: mode === "reel" ? "none" : "1px solid #2A2632" }}
          >
            <Video size={16} /> Reel
          </button>
        </div>

        <label
          className="rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 mb-4 overflow-hidden"
          style={{ background: "#1E1B26", border: "1.5px dashed #3E3849" }}
        >
          <input type="file" accept={mode === "photo" ? "image/*" : "video/*"} onChange={handleFileChange} className="hidden" />
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
                {mode === "photo" ? "একটা ছবি বেছে নিন" : "একটা ভিডিও বেছে নিন"}
              </span>
            </>
          )}
        </label>

        <textarea
          placeholder="ক্যাপশন লিখুন..."
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-sm mb-4 outline-none resize-none"
          style={{ background: "#1E1B26", border: "1px solid #2A2632", color: "#F5F1EA" }}
        />

        {error && <p className="text-xs mb-3" style={{ color: "#FF5D73" }}>{error}</p>}

        <button
          onClick={handleShare}
          disabled={uploading}
          className="w-full rounded-xl py-3 text-sm"
          style={{ background: ACCENT, color: "#14121A", fontWeight: 700, opacity: uploading ? 0.7 : 1 }}
        >
          {uploading ? "আপলোড হচ্ছে..." : "শেয়ার করুন"}
        </button>
      </div>
    </div>
  );
}
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
              কোনো অ্যাকাউন্ট পাওয়া যায়নি
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
      setError("আগে একটা ছবি বা ভিডিও বেছে নিন");
      return;
    }
    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploading(false);
      setError("লগইন করা নেই");
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
          পোস্ট হয়ে গেছে!
        </p>
        <button
          onClick={resetForm}
          className="rounded-xl px-5 py-2.5 text-sm"
          style={{ background: ACCENT, color: "#14121A", fontWeight: 700 }}
        >
          আরেকটা পোস্ট করুন
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <TopBar title="নতুন পোস্ট" />
      <div className="px-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setMode("photo"); setFile(null); setPreviewUrl(null); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition"
            style={{ background: mode === "photo" ? ACCENT : "#1E1B26", color: "#F5F1EA", fontWeight: 600, border: mode === "photo" ? "none" : "1px solid #2A2632" }}
          >
            <ImageIcon size={16} /> Photo
          </button>
          <button
            onClick={() => { setMode("reel"); setFile(null); setPreviewUrl(null); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition"
            style={{ background: mode === "reel" ? ACCENT : "#1E1B26", color: "#F5F1EA", fontWeight: 600, border: mode === "reel" ? "none" : "1px solid #2A2632" }}
          >
            <Video size={16} /> Reel
          </button>
        </div>

        <label
          className="rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 mb-4 overflow-hidden"
          style={{ background: "#1E1B26", border: "1.5px dashed #3E3849" }}
        >
          <input type="file" accept={mode === "photo" ? "image/*" : "video/*"} onChange={handleFileChange} className="hidden" />
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
                {mode === "photo" ? "একটা ছবি বেছে নিন" : "একটা ভিডিও বেছে নিন"}
              </span>
            </>
          )}
        </label>

        <textarea
          placeholder="ক্যাপশন লিখুন..."
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-sm mb-4 outline-none resize-none"
          style={{ background: "#1E1B26", border: "1px solid #2A2632", color: "#F5F1EA" }}
        />

        {error && <p className="text-xs mb-3" style={{ color: "#FF5D73" }}>{error}</p>}

        <button
          onClick={handleShare}
          disabled={uploading}
          className="w-full rounded-xl py-3 text-sm"
          style={{ background: ACCENT, color: "#14121A", fontWeight: 700, opacity: uploading ? 0.7 : 1 }}
        >
          {uploading ? "আপলোড হচ্ছে..." : "শেয়ার করুন"}
        </button>
      </div>
    </div>
  );
}
