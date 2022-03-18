const closeBtn = document.getElementById("mobile-close-icon");
const mobileNav = document.querySelector(".mobile-nav-bar");
const hamburgerIcon = document.querySelector(".hamburger-icon");
const navDownBtn = document.querySelector(".nav-down-btn");
const movieListSection = document.querySelector(".movie-list-section");
const movieList = document.querySelector(".movie-list");
const upcomingList = document.querySelector(".upcoming-list");
const searchBar = document.querySelector(".search-bar");
const searchBtn = document.getElementById("search-btn");
const form = document.querySelector(".search-func");

const API_KEY = "api_key=42c15f29217106b8f3f7867104c1fc6a";
const BASE_URL = "https://api.themoviedb.org/3";
const MAIN_API_URL =
  BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const ASIDE_API_URL =
  BASE_URL +
  "/movie/now_playing?primary_release_year=2022&language=en-US&" +
  API_KEY;
const SEARCH_API_URL = BASE_URL + "/search/movie?" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500/";

// Function Invocation
getMovies(MAIN_API_URL);
getAsideMovies(ASIDE_API_URL);

// Event listeners
hamburgerIcon.addEventListener("click", () => {
  mobileNav.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  mobileNav.classList.remove("open");
});
navDownBtn.addEventListener("click", () => {
  movieListSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
});
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchTerm = searchBar.value;
  if (searchTerm) {
    getMovies(SEARCH_API_URL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
  movieListSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
});

// Functions
// Retrieve movies from TMDB API
function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.results);
      displayMainMovies(data.results);
    })
    .catch((err) => alert("getMovies " + err));
}

function getAsideMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      displayAsideMovies(data.results);
    })
    .catch((err) => alert("Aside" + err));
}

function displayMainMovies(data) {
  // Reset display
  movieList.innerHTML = "";
  const errorDiv = document.createElement("div");
  const newErrorDiv = document.querySelector(".error-div");
  if (newErrorDiv) newErrorDiv.remove();
  // Check if search result is empty
  if (data.length == 0) {
    const searchTerm = searchBar.value;
    errorDiv.innerHTML = `<h1>No results for "${searchTerm}"</h1>`;
    errorDiv.classList.add("error-div");
    movieListSection.appendChild(errorDiv);
  } else {
    data.forEach((movie) => {
      const { id } = movie;
      // Retrieve movie details for targeted movie
      fetch(`https://api.themoviedb.org/3/movie/${id}?${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          const {
            title,
            poster_path,
            vote_average,
            overview,
            release_date,
            runtime,
          } = data;
          const movieCard = document.createElement("div");
          movieCard.classList.add("movie-card");
          movieCard.innerHTML = `
                  <div class="poster">
                    <img src="${IMG_URL + poster_path}" alt="Image Unavailable">
                  </div>
                  <div class="movie-info">
                    <h3 class="movie-title">${title}</h3>
                    <p class="duration">${runtime + "m"}</p>
                    <span class="dot"></span>
                    <p class="release-year">${release_date.substring(0, 4)}</p>
                    <p class="rating ${setColor(
                      vote_average
                    )}">${vote_average}</p>
                  </div>
                  <div class="movie-overview">
                    <p class="blurb">${overview}</p>
                    <a href="#">Click To See More</a>
                  </div>`;
          movieList.appendChild(movieCard);
          // Set localstorage for movie id for details page
          movieCard.addEventListener("click", () => {
            localStorage.setItem("movieId", id);
            localStorage.setItem("clicked", "movie");
            window.location.href = "details.html";
          });
        })
        .catch((err) => {
          alert("Detail error" + err);
        });
    });
  }
}
function displayAsideMovies(data) {
  data.forEach((movie) => {
    const { id } = movie;
    fetch(`https://api.themoviedb.org/3/movie/${id}?${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const { title, poster_path, release_date } = data;
        const movieAsideLi = document.createElement("li");
        const movieAsideCard = document.createElement("div");
        movieAsideCard.classList.add("movie-card-aside");
        movieAsideCard.innerHTML = `                 
                    <img src="${IMG_URL + poster_path}" alt="">
                    <div class="movie-info">
                      <h3>${title}</h3>
                      <p>${release_date}</p>
                    </div>
               `;
        movieAsideLi.appendChild(movieAsideCard);
        upcomingList.appendChild(movieAsideLi);
        movieAsideCard.addEventListener("click", () => {
          localStorage.setItem("movieId", id);
          localStorage.setItem("clicked", "movie");
          window.location.href = "details.html";
        });
      });
  });
}

// Set visual color for movie rating
function setColor(rating) {
  if (rating < 5) return "red";
  if (rating < 5.9 && rating > 4.9) return "orange";
  return "green";
}
