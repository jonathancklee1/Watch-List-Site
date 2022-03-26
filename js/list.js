const closeBtn = document.getElementById("mobile-close-icon");
const mobileNav = document.querySelector(".mobile-nav-bar");
const hamburgerIcon = document.querySelector(".hamburger-icon");
const movieTab = document.querySelector(".movie-tab");
const tvTab = document.querySelector(".tv-tab");
const animeTab = document.querySelector(".anime-tab");
const movieList = document.querySelector(".movie-list");
const tvList = document.querySelector(".tv-list");
const animeList = document.querySelector(".anime-list");

const deleteBtn = document.querySelectorAll(".delete-div");
const watchedBtn = document.querySelectorAll(".watched-div");
const clearbtn = document.querySelector(".clear-btn");

// Event listeners
hamburgerIcon.addEventListener("click", () => {
  mobileNav.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  mobileNav.classList.remove("open");
});

movieTab.addEventListener("click", () => {
  movieTab.classList.add("selected");
  tvTab.classList.remove("selected");
  animeTab.classList.remove("selected");

  movieList.classList.add("selected");
  tvList.classList.remove("selected");
  animeList.classList.remove("selected");
});
tvTab.addEventListener("click", () => {
  movieTab.classList.remove("selected");
  tvTab.classList.add("selected");
  animeTab.classList.remove("selected");

  movieList.classList.remove("selected");
  tvList.classList.add("selected");
  animeList.classList.remove("selected");
});
animeTab.addEventListener("click", () => {
  movieTab.classList.remove("selected");
  tvTab.classList.remove("selected");
  animeTab.classList.add("selected");
  movieList.classList.remove("selected");
  tvList.classList.remove("selected");
  animeList.classList.add("selected");
});

deleteBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(btn.parentNode);
    btn.parentNode.remove();
  });
});

watchedBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    btn.parentElement.classList.toggle("watched");
  });
});

clearbtn.addEventListener("click", () => {
  const listItem = document.querySelectorAll(".list-item");
  listItem.forEach((item) => {
    if (item.classList.contains("watched")) {
      item.remove();
    }
  });
});
