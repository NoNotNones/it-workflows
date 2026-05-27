const cacheName = self.location.pathname
const pages = [

  "/docs/section-1/",
    "/docs/section-1/section-2/",
    "/docs/section-1/section-2/leaf-page-1/",
    "/docs/section-1/section-2/leaf-page-2/",
    "/docs/section-1/section-3/",
    "/docs/section-1/section-3/leaf-page-1/",
    "/docs/section-1/section-3/leaf-page-2/",
    "/",
    "/posts/blog-post-4/",
    "/posts/",
    "/tags/blog/",
    "/tags/post/",
    "/tags/",
    "/posts/blog-post-3/",
    "/posts/blog-post-2/",
    "/posts/blog-post-1/",
    "/docs/",
    "/book.min.7dca40f168e2fd532b7b1937df678e5fcb9289577e924bd85f799138b6137fa6.css",
  "/en.search-data.min.6cf7681c82ac29ca1bcaf8cac014a9c4b2392362d7223393718244fdd4767738.json",
  "/en.search.min.90c8052cd115ea93cdd96105635c3d5df3080559cc206d238cf387672b12e241.js",
  
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  caches.open(cacheName).then((cache) => {
    return cache.addAll(pages);
  });
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  /**
   * @param {Response} response
   * @returns {Promise<Response>}
   */
  function saveToCache(response) {
    if (cacheable(response)) {
      return caches
        .open(cacheName)
        .then((cache) => cache.put(request, response.clone()))
        .then(() => response);
    } else {
      return response;
    }
  }

  /**
   * @param {Error} error
   */
  function serveFromCache(error) {
    return caches.open(cacheName).then((cache) => cache.match(request.url));
  }

  /**
   * @param {Response} response
   * @returns {Boolean}
   */
  function cacheable(response) {
    return response.type === "basic" && response.ok && !response.headers.has("Content-Disposition")
  }

  event.respondWith(fetch(request).then(saveToCache).catch(serveFromCache));
});
