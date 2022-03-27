const closeBtn = document.getElementById("mobile-close-icon");
const mobileNav = document.querySelector(".mobile-nav-bar");
const hamburgerIcon = document.querySelector(".hamburger-icon");
const navDownBtn = document.querySelector(".nav-down-btn");
const tvListSection = document.querySelector(".tv-list-section");
const tvList = document.querySelector(".tv-list");
const upcomingList = document.querySelector(".upcoming-list");
const searchBar = document.querySelector(".search-bar");
const searchBtn = document.getElementById("search-btn");
const form = document.querySelector(".search-func");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = "";
let totalPages = 100;

const API_KEY = "api_key=42c15f29217106b8f3f7867104c1fc6a";
const BASE_URL = "https://api.themoviedb.org/3";
const MAIN_API_URL =
  BASE_URL + "/discover/tv?sort_by=popularity.desc&" + API_KEY;
const ASIDE_API_URL = BASE_URL + "/tv/on_the_air?language=en-US&" + API_KEY;
const SEARCH_API_URL = BASE_URL + "/search/tv?" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500/";

// Function Invocation
if (sessionStorage.getItem("tv-page")) {
  getTvs(sessionStorage.getItem("tv-page"));
} else {
  getTvs(MAIN_API_URL);
}
getAsideTvs(ASIDE_API_URL);

// Event listeners
hamburgerIcon.addEventListener("click", () => {
  mobileNav.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  mobileNav.classList.remove("open");
});
navDownBtn.addEventListener("click", () => {
  tvListSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
});
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchTerm = searchBar.value;
  if (searchTerm) {
    getTvs(SEARCH_API_URL + "&query=" + searchTerm);
  } else {
    getTvs(API_URL);
  }
  tvListSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
});

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    callPage(prevPage);
  }
  tvListSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    callPage(nextPage);
  }
  tvListSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
});

// Functions
function callPage(page) {
  let urlSplit = lastUrl.split("?");
  let queryParams = urlSplit[1].split("&");
  let pageParam = queryParams[queryParams.length - 1].split("=");
  if (pageParam[0] != "page") {
    let url = lastUrl + "&page=" + page;
    sessionStorage.setItem("tv-page", url);
    getTvs(url);
  } else {
    pageParam[1] = page.toString();
    let key = pageParam.join("=");
    queryParams[queryParams.length - 1] = key;
    let key2 = queryParams.join("&");
    let url = urlSplit[0] + "?" + key2;
    sessionStorage.setItem("tv-page", url);
    getTvs(url);
  }
}

// Retrieve tvs from TMDB API
function getTvs(url) {
  lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayMainTvs(data.results);
      currentPage = data.page;
      nextPage = currentPage + 1;
      prevPage = currentPage - 1;
      totalPages = data.total_pages;
      current.innerText = currentPage;
      // Enable/disable navigation button for pagination
      if (currentPage <= 1) {
        prev.classList.add("disabled");
        next.classList.remove("disabled");
      } else if (currentPage >= totalPages) {
        prev.classList.remove("disabled");
        next.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
        next.classList.remove("disabled");
      }
    })
    .catch((err) => alert("gettvs " + err));
}

function getAsideTvs(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      displayAsideTvs(data.results);
    })
    .catch((err) => alert("Aside" + err));
}

function displayMainTvs(data) {
  // Reset display
  tvList.innerHTML = "";
  const errorDiv = document.createElement("div");
  const newErrorDiv = document.querySelector(".error-div");
  if (newErrorDiv) newErrorDiv.remove();
  // Check if search result is empty
  if (data.length == 0) {
    const searchTerm = searchBar.value;
    errorDiv.innerHTML = `<h1>No results for "${searchTerm}"</h1>`;
    errorDiv.classList.add("error-div");
    tvListSection.appendChild(errorDiv);
  } else {
    data.forEach((tv) => {
      const { id } = tv;
      // Retrieve tv details for targeted tv
      fetch(`https://api.themoviedb.org/3/tv/${id}?${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          const {
            name,
            poster_path,
            vote_average,
            overview,
            first_air_date,
            number_of_seasons,
          } = data;
          const tvCard = document.createElement("div");
          tvCard.classList.add("tv-card");
          tvCard.innerHTML = `
                  <div class="poster">
                    <img src="${IMG_URL + poster_path}" alt="${name} poster">
                  </div>
                  <div class="tv-info">
                    <h3 class="tv-title">${name}</h3>
                    <p class="duration">${
                      checkNull(number_of_seasons) + " series"
                    }</p>
                    <span class="dot"></span>
                    <p class="release-year">${checkNull(
                      first_air_date
                    ).substring(0, 4)}</p>
                    <p class="rating ${setColor(vote_average)}">${checkNull(
            vote_average
          )}</p>
                  </div>
                  <div class="tv-overview">
                    <p class="blurb">${overview}</p>
                    <a href="#">Click To See More</a>
                  </div>`;
          tvList.appendChild(tvCard);
          // Set localstorage for tv id for details page
          tvCard.addEventListener("click", () => {
            localStorage.setItem("tvId", id);
            localStorage.setItem("clicked", "tv");
            window.location.href = "details.html";
          });
        })
        .catch((err) => {
          alert("Detail error" + err);
        });
    });
  }
}
function displayAsideTvs(data) {
  data.forEach((tv) => {
    const { id } = tv;
    fetch(`https://api.themoviedb.org/3/tv/${id}?${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const { name, poster_path, first_air_date } = data;
        const tvAsideLi = document.createElement("li");
        const tvAsideCard = document.createElement("div");
        tvAsideCard.classList.add("tv-card-aside");
        tvAsideCard.innerHTML = `                 
                    <img src="${IMG_URL + poster_path}" alt="">
                    <div class="tv-info">
                      <h3>${name}</h3>
                      <p>${first_air_date}</p>
                    </div>
               `;
        tvAsideLi.appendChild(tvAsideCard);
        upcomingList.appendChild(tvAsideLi);
        tvAsideCard.addEventListener("click", () => {
          localStorage.setItem("tvId", id);
          localStorage.setItem("clicked", "tv");
          window.location.href = "details.html";
        });
      });
  });
}

// Set visual color for tv rating
function setColor(rating) {
  if (rating < 5) return "red";
  if (rating < 5.9 && rating > 4.9) return "orange";
  return "green";
}
function checkNull(data) {
  if (data === null) return "Unknown";
  return data;
}
