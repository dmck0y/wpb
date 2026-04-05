(function () {
  "use strict";

  // Keyboard navigation: arrow keys trigger prev/next links
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      var prev = document.getElementById("prev-link");
      if (prev) {
        e.preventDefault();
        prev.click();
      }
    } else if (e.key === "ArrowRight") {
      var next = document.getElementById("next-link");
      if (next) {
        e.preventDefault();
        next.click();
      }
    }
  });

  // Preload next image for instant navigation
  var nextLink = document.getElementById("next-link");
  if (nextLink) {
    var nextHref = nextLink.getAttribute("href");
    if (nextHref) {
      // Extract the image ID from the href
      var parts = nextHref.split("/");
      var nextId = parts[parts.length - 1];

      // Fetch asset list and find the next image URL to preload
      fetch("/api/v1/assets")
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (data.images && Array.isArray(data.images)) {
            var nextImage = data.images.find(function (img) {
              return img.uuid === nextId;
            });
            if (nextImage && nextImage.url) {
              var preload = new Image();
              preload.src = nextImage.url;
            }
          }
        })
        .catch(function () {
          // Silently fail - preloading is a nice-to-have
        });
    }
  }
})();
