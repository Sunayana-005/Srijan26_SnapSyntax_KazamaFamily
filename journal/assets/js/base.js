(function () {
  const path = window.location.pathname.toLowerCase();
  const route = path.endsWith("/") ? "index.html" : path.split("/").pop();
  const links = document.querySelectorAll("[data-nav]");

  links.forEach((link) => {
    const key = link.getAttribute("data-nav");
    const isHome = key === "home" && route === "index.html";
    const isWrite = key === "write" && route === "write.html";
    const isLibrary = key === "library" && route === "library.html";

    if (isHome || isWrite || isLibrary) {
      link.classList.add("is-active");
    }
  });

  const yearStamp = document.getElementById("yearStamp");
  if (yearStamp) {
    yearStamp.textContent = String(new Date().getUTCFullYear());
  }
})();
