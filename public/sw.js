// Loop — service worker for push notifications.
// This file must sit in the repo's public/ folder so it is served from the
// site root as /sw.js — a service worker only controls the folder it is
// served from and below.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// Opening pages. Loop always loads fresh from the internet — nothing is
// cached, so an update can never get stuck behind an old copy. Only when
// the phone is offline do we answer with a small "you're offline" page
// instead of the browser's dinosaur. Everything that isn't a page (the
// database, pictures, videos) is left completely alone.
const OFFLINE_PAGE = `<!doctype html><html lang="bn"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Loop</title>
<style>body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;
justify-content:center;font-family:system-ui,sans-serif;background:#fff;color:#111;text-align:center;padding:24px}
img{width:96px;height:96px}h1{font-size:18px;margin:16px 0 6px}p{font-size:14px;color:#666;margin:0 0 20px}
button{border:0;border-radius:12px;padding:12px 22px;font-size:14px;font-weight:700;background:#1d6fe0;color:#fff}</style>
</head><body><img src="/icon-192.png" alt=""><h1>You're offline</h1>
<p>Loop needs the internet. Check your connection and try again.</p>
<button onclick="location.reload()">Try again</button></body></html>`;

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.mode !== "navigate") return;
  event.respondWith(
    fetch(req).catch(
      () => new Response(OFFLINE_PAGE, { headers: { "Content-Type": "text/html; charset=utf-8" } })
    )
  );
});

self.addEventListener("push", (event) => {
  let data = { title: "Loop", body: "You have new activity", url: "/" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (e) {
    // Malformed payload — fall back to the generic text above.
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      // Same tag replaces the previous notification instead of stacking
      // ten "liked your post" alerts for one post.
      tag: data.tag || undefined,
      renotify: !!data.tag,
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      // Reuse an open Loop tab if there is one.
      for (const client of list) {
        if ("focus" in client) {
          client.navigate(target).catch(() => {});
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    })
  );
});
