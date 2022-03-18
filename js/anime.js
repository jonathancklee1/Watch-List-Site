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

const BASE_URL = "https://api.jikan.moe/v4/anime";
const ASIDE_API_URL = BASE_URL + "?status=airing";
const SEARCH_API_URL = "https://api.jikan.moe/v4/anime?q=";

// Function Invocation
getAnimes(BASE_URL);
getAsideAnimes(ASIDE_API_URL);

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
  const searchTerm = searchBar.value;
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

// Functions
// Retrieve animes from TMDB API
function getAnimes(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.data);
      displayMainAnimes(data.data);
    })
    .catch((err) => alert("getanimes " + err));
}

function getAsideAnimes(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.data);
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
      console.log(anime);
      const image_path = anime.images.jpg.image_url;
      const { mal_id, title, score, synopsis, year, episodes } = anime;
      // console.log(data.title);
      const animeCard = document.createElement("div");
      animeCard.classList.add("anime-card");
      animeCard.innerHTML = `
                  <div class="poster">
                    <img src="${image_path}" alt="Image Unavailable">
                  </div>
                  <div class="anime-info">
                    <h3 class="anime-title">${title}</h3>
                    <p class="duration">${episodes + " ep"}</p>
                    <span class="dot"></span>
                    <p class="release-year">${checkYear(year)}</p>
                    <p class="rating ${setColor(score)}">${checkScore(
        score
      )}</p>
                  </div>
                  <div class="anime-overview">
                    <p class="blurb">${synopsis}</p>
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

function checkYear(year) {
  if (year === null) return "N/A";
  return year;
}
