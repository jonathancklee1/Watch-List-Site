const closeBtn = document.getElementById("mobile-close-icon");
const mobileNav = document.querySelector(".mobile-nav-bar");
const hamburgerIcon = document.querySelector(".hamburger-icon");
const navDownBtn = document.querySelector(".nav-down-btn");
const movieListSection = document.querySelector(".movie-list-section");
const movieList = document.querySelector(".movie-list");
const upcomingList = document.querySelector(".upcoming-list");

const API_KEY = "api_key=42c15f29217106b8f3f7867104c1fc6a";
const BASE_URL = "https://api.themoviedb.org/3";
const MAIN_API_URL =
  BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const ASIDE_API_URL =
  BASE_URL + "/movie/upcoming?sort_by=popularity.desc&" + API_KEY;

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

// Functions
function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      displayMainMovies(data.results);
    })
    .catch((err) => alert(err));
}
function getAsideMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      displayAsideMovies(data.results);
    })
    .catch((err) => alert(err));
}

function displayMainMovies(data) {
  data.forEach((movie) => {
    const { id } = movie;
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
                    <img src="${IMG_URL + poster_path}" alt="">
                  </div>
                  <div class="movie-info">
                    <h3 class="movie-title">${title}</h3>
                    <p class="duration">${runtime + " mins"}</p>
                    <p class="release-year">${release_date.substring(0, 4)}</p>
                    <p class="rating">${vote_average}</p>
                  </div>
                  <div class="movie-overview">
                    <p class="blurb">${overview}</p>
                    <a href="#">Click To See More</a>
                  </div>`;
        movieList.appendChild(movieCard);
      });
  });
}
function displayAsideMovies(data) {
  data.forEach((movie) => {
    const { id } = movie;
    fetch(`https://api.themoviedb.org/3/movie/${id}?${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const { title, poster_path, vote_average } = data;
        const movieAsideLi = document.createElement("li");
        const movieAsideCard = document.createElement("div");
        movieAsideCard.classList.add("movie-card-aside");
        movieAsideCard.innerHTML = `
                  
                    <img src="${IMG_URL + poster_path}" alt="">
                    <div class="movie-info">
                      <h3>${title}</h3>
                    </div>
                  
               `;
        movieAsideLi.appendChild(movieAsideCard);
        upcomingList.appendChild(movieAsideLi);
      });
  });
}
