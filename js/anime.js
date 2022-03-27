const closeBtn = document.getElementById("mobile-close-icon");
const mobileNav = document.querySelector(".mobile-nav-bar");
const hamburgerIcon = document.querySelector(".hamburger-icon");
const navDownBtn = document.querySelector(".nav-down-btn");
const animeListSection = document.querySelector(".anime-list-section");
const animeList = document.querySelector(".anime-list");
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

const BASE_URL = "https://api.jikan.moe/v4/anime";
const MAIN_URL = BASE_URL + "?page=1";
const ASIDE_API_URL = BASE_URL + "?status=airing";
const SEARCH_API_URL = "https://api.jikan.moe/v4/anime?q=";

// Function Invocation
window.addEventListener("DOMContentLoaded", (event) => {
  if (sessionStorage.getItem("anime-page")) {
    getAnimes(sessionStorage.getItem("anime-page"));
  } else {
    getAnimes(MAIN_URL);
  }
  getAsideAnimes(ASIDE_API_URL);
  console.log("DOM fully loaded and parsed");
});

// Event listeners
hamburgerIcon.addEventListener("click", () => {
  mobileNav.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  mobileNav.classList.remove("open");
});
navDownBtn.addEventListener("click", () => {
  animeListSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
});
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchTerm = searchBar.value.replace(/\s/g, "%20");
  console.log(searchTerm);
  if (searchTerm) {
    getAnimes(SEARCH_API_URL + searchTerm + "&limit=20");
  } else {
    getAnimes(BASE_URL);
  }
  animeListSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
});

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    callPage(prevPage);
    currentPage -= 1;
  }
  animeListSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    callPage(nextPage);
    currentPage += 1;
  }
  animeListSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
});

// Functions
function callPage(page) {
  console.log(page);
  let urlSplit = lastUrl.split("?");
  console.log(lastUrl);
  console.log(urlSplit);
  let queryParams = urlSplit[1];
  let pageParam = queryParams.split("=");
  if (pageParam[0] != "page") {
    let url = lastUrl + "&page=" + page;
    sessionStorage.setItem("anime-page", url);
    getAnimes(url);
  } else {
    pageParam[1] = page.toString();
    let key = pageParam.join("=");
    let url = urlSplit[0] + "?" + key;
    sessionStorage.setItem("anime-page", url);
    getAnimes(url);
  }
}

// Retrieve animes from TMDB API
function getAnimes(url) {
  lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayMainAnimes(data.data);
      // currentPage = data.page;
      nextPage = currentPage + 1;
      prevPage = currentPage - 1;
      totalPages = data.pagination.last_visible_page;
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
    .catch((err) => alert("getAnimes " + err));
}

function getAsideAnimes(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayAsideAnimes(data.data);
    })
    .catch((err) => alert("Aside" + err));
}

function displayMainAnimes(obj) {
  // Reset display
  animeList.innerHTML = "";
  const errorDiv = document.createElement("div");
  const newErrorDiv = document.querySelector(".error-div");
  if (newErrorDiv) newErrorDiv.remove();
  // Check if search result is empty
  if (obj.length == 0) {
    const searchTerm = searchBar.value;
    errorDiv.innerHTML = `<h1>No results for "${searchTerm}"</h1>`;
    errorDiv.classList.add("error-div");
    animeListSection.appendChild(errorDiv);
  } else {
    obj.forEach((anime) => {
      // const { mal_id } = anime;
      // Retrieve anime details for targeted anime
      const image_path = anime.images.jpg.image_url;
      const { mal_id, title, score, synopsis, year, episodes, aired } = anime;
      // console.log(data.title);
      let release_year = year;
      if (release_year == null && aired) {
        try {
          release_year = aired.from.substring(0, 4);
        } catch (error) {
          alert(error);
        }
      }
      const animeCard = document.createElement("div");
      animeCard.classList.add("anime-card");
      animeCard.innerHTML = `
                  <div class="poster">
                    <img src="${image_path}" alt="${title} poster">
                  </div>
                  <div class="anime-info">
                    <h3 class="anime-title">${title}</h3>
                    <p class="duration">${checkNullShort(episodes) + " ep"}</p>
                    <span class="dot"></span>
                    <p class="release-year">${checkNull(release_year)}</p>
                    <p class="rating ${setColor(score)}">${checkScore(
        score
      )}</p>
                  </div>
                  <div class="anime-overview">
                    <p class="blurb">${checkNull(synopsis)}</p>
                    <a href="#">Click To See More</a>
                  </div>`;
      animeList.appendChild(animeCard);
      // Set localstorage for anime id for details page
      animeCard.addEventListener("click", () => {
        localStorage.setItem("animeId", mal_id);
        localStorage.setItem("clicked", "anime");
        window.location.href = "details.html";
      });
    });
  }
}
function displayAsideAnimes(obj) {
  obj.forEach((anime) => {
    const image_path = anime.images.jpg.image_url;
    const { mal_id, title, status } = anime;
    const animeAsideLi = document.createElement("li");
    const animeAsideCard = document.createElement("div");
    animeAsideCard.classList.add("anime-card-aside");
    animeAsideCard.innerHTML = `                 
                    <img src="${image_path}" alt="">
                    <div class="anime-info">
                      <h3>${title}</h3>
                      <p>${status}</p>
                    </div>
               `;
    animeAsideLi.appendChild(animeAsideCard);
    upcomingList.appendChild(animeAsideLi);
    animeAsideCard.addEventListener("click", () => {
      localStorage.setItem("animeId", mal_id);
      localStorage.setItem("clicked", "anime");
      window.location.href = "details.html";
    });
  });
}

// Set visual color for anime rating
function setColor(rating) {
  if (rating < 5) return "red";
  if (rating < 5.9 && rating > 4.9) return "orange";
  return "green";
}
function checkScore(score) {
  if (score === null) return "Unrated";
  return score;
}
function checkNullShort(data) {
  if (data === null) return "N/A";
  return data;
}
function checkNull(data) {
  if (data === null) return "Unknown";
  return data;
}
