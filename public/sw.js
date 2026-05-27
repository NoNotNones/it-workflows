const cacheName = self.location.pathname
const pages = [

  "/it-workflows/docs/section-1/",
    "/it-workflows/docs/section-1/section-2/",
    "/it-workflows/docs/section-1/section-2/leaf-page-1/",
    "/it-workflows/docs/section-1/section-2/leaf-page-2/",
    "/it-workflows/docs/section-1/section-3/",
    "/it-workflows/docs/section-1/section-3/leaf-page-1/",
    "/it-workflows/docs/section-1/section-3/leaf-page-2/",
    "/it-workflows/posts/blog-post-4/",
    "/it-workflows/tags/blog/",
    "/it-workflows/tags/post/",
    "/it-workflows/tags/",
    "/it-workflows/posts/blog-post-3/",
    "/it-workflows/posts/blog-post-2/",
    "/it-workflows/posts/blog-post-1/",
    "/it-workflows/",
    "/it-workflows/docs/",
    "/it-workflows/posts/",
    "/it-workflows/book.min.7dca40f168e2fd532b7b1937df678e5fcb9289577e924bd85f799138b6137fa6.css",
  "/it-workflows/en.search-data.min.7a7e68e143960f2683dcd225cc53bde93caf73eb7e22bc4bfe2193944ed1402e.json",
  "/it-workflows/en.search.min.3e3abd9ea6bd196754a6962614973a73b1db075043373190fb812031b82e1992.js",
  
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
