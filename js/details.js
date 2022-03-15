const closeBtn = document.getElementById("mobile-close-icon");
const mobileNav = document.querySelector(".mobile-nav-bar");
const hamburgerIcon = document.querySelector(".hamburger-icon");
const movieDetailsSection = document.querySelector(".movie-details");

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
getDetails();
// Event listeners
hamburgerIcon.addEventListener("click", () => {
  mobileNav.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  mobileNav.classList.remove("open");
});
function getDetails() {
  if (localStorage.getItem("clicked") === "movie") {
    getMovieDetails();
  } else {
    // getAnimeDetails();
  }
}
function getMovieID() {
  return localStorage.getItem("movieId");
}

function getMovieDetails() {
  const id = getMovieID();
  fetch(`https://api.themoviedb.org/3/movie/${id}?${API_KEY}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let {
        title,
        poster_path,
        vote_average,
        overview,
        release_date,
        runtime,
        budget,
        genres,
        production_companies,
        original_language,
      } = data;
      // const productionNames=
      movieDetailsSection.innerHTML = `
          <div class="poster-div">
               <img class="poster-img" src="${IMG_URL + poster_path}" alt="">
          </div>
            <h2 class="movie-title">${title}</h2>
            <div class="genre-wrapper">
            </div>
            <p class="release-date">Released on ${release_date}</p>
            <p class="production"></p>
            <p class="language">Language: ${String(
              original_language
            ).toUpperCase()}</p>
            <p class="budget">Budget: $${budget}</p>
            <p class="runtime">Runtime: ${runtime} minutes</p>
            <p class="rating">Rating: ${vote_average}</p>
            <h3 class="overview-heading">Overview</h3>
            <p class="overview">${overview}</p>
      `;

      // Add production companies as comma delimited list
      displayProdCompanies(production_companies);
      // Add individual genre tag
      displayGenres(genres);
    })
    .catch((err) => {
      alert("Detail error" + err);
    });
}

function displayGenres(arr) {
  const genreWrapper = document.querySelector(".genre-wrapper");
  for (genre in arr) {
    console.log(arr[genre].name);
    const span = document.createElement("span");
    span.classList.add("genres");
    span.innerHTML = arr[genre].name;
    genreWrapper.appendChild(span);
  }
}
function displayProdCompanies(arr) {
  const productionEl = document.querySelector(".production");
  for (company in arr) {
    productionEl.innerHTML += " " + arr[company].name + ",";
  }
  productionEl.innerHTML = productionEl.innerHTML.slice(0, -1);
}
