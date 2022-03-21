const closeBtn = document.getElementById("mobile-close-icon");
const mobileNav = document.querySelector(".mobile-nav-bar");
const hamburgerIcon = document.querySelector(".hamburger-icon");
const mediaDetailsSection = document.querySelector(".media-details");

const API_KEY = "api_key=42c15f29217106b8f3f7867104c1fc6a";
const BASE_URL = "https://api.themoviedb.org/3";
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
  } else if (localStorage.getItem("clicked") === "tv") {
    getTvDetails();
  } else {
    getAnimeDetails();
  }
}
function getMovieID() {
  return localStorage.getItem("movieId");
}
function getAnimeID() {
  return localStorage.getItem("animeId");
}
function getTvID() {
  return localStorage.getItem("tvId");
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
        status,
        genres,
        production_companies,
        original_language,
        imdb_id,
        homepage,
        backdrop_path,
      } = data;
      let backdropSource = IMG_URL + backdrop_path;
      // const productionNames=
      mediaDetailsSection.innerHTML = `
            <div class="backdrop">
               <div class="backdrop-img-div">
                  <img src="./img/movies-cover.jpg" alt="" class="backdrop-img">
               </div>

               <div class="media-info">
                <div class="poster-div">
                    <img class="poster-img" src="${
                      IMG_URL + poster_path
                    }" alt="">
                </div>
                <div class="media-content">
                    <h2 class="media-title">${title}</h2>
                    <div class="genre-wrapper">
                    </div>
                    <p class="release-date detail"> <span class="bold">Release Date:</span> ${release_date}</p>
                    <p class="production detail"><span class="bold">Studios:</span> </p>
                    <p class="language detail"><span class="bold">Language:</span> ${String(
                      original_language
                    ).toUpperCase()}</p>
                    <p class="status detail"><span class="bold">Status: </span> ${status}</p>
                    <p class="runtime detail"><span class="bold">Runtime: </span> ${runtime} minutes</p>
                    <p class="rating detail"><span class="bold">Rating: </span> ${vote_average}</p>
                    <p class="links detail"><span class="bold">Links: </span> <span><a
                            href="https://www.imdb.com/title/${imdb_id}/">IMBD Page,</a></span> <span><a
                            href="${homepage}">Homepage</a></span></p>
                  </div>
               </div>
            </div>
               
               
            
            <h3 class="overview-heading">Overview</h3>
               <p class="overview">${overview}</p>
      `;
      const backdropImg = document.querySelector(".backdrop-img");
      backdropImg.src = backdropSource;
      // Add production companies as comma delimited list
      displayProdCompanies(production_companies);
      // Add individual genre tag
      displayGenres(genres);
    })
    .catch((err) => {
      alert("Detail error" + err);
    });
}

function getTvDetails() {
  const id = getTvID();
  fetch(`https://api.themoviedb.org/3/tv/${id}?${API_KEY}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let {
        name,
        poster_path,
        vote_average,
        overview,
        first_air_date,
        episode_run_time,
        type,
        genres,
        production_companies,
        original_language,
        homepage,
        number_of_seasons,
        number_of_episodes,
        backdrop_path,
      } = data;
      let backdropSource = IMG_URL + backdrop_path;
      mediaDetailsSection.innerHTML = `
      <div class="backdrop">
              <div class="backdrop-img-div">
                  <img src="" alt="" class="backdrop-img">
              </div>

              <div class="media-info">
                <div class="poster-div">
                    <img class="poster-img" src="${
                      IMG_URL + poster_path
                    }" alt="">
                </div>

                <div class="media-content">
                  <h2 class="media-title">${name}</h2>
                  <div class="genre-wrapper">
                  </div>
                  <p class="release-date detail"> <span class="bold">First Aired:</span> ${first_air_date}</p>
                  <p class="production detail"><span class="bold">Producers:</span> </p>
                  <p class="language detail"><span class="bold">Language:</span> ${String(
                    original_language
                  ).toUpperCase()}</p>
                  <p class="type detail"><span class="bold">Type: </span>  ${type}</p>
                  <p class="seasons detail"><span class="bold">Number of Seasons: </span>  ${number_of_seasons} </p>
                  <p class="episodes detail"><span class="bold">Number of Episodes: </span>  ${number_of_episodes} </p>
                  <p class="ep-runtime detail"><span class="bold">Episode Runtime: </span>  ${
                    episode_run_time[0]
                  } minutes</p>
                  <p class="rating detail"><span class="bold">Rating: </span> ${vote_average}</p>
                  <p class="links detail"><span class="bold">Links: </span> <span><a href="${homepage}">Homepage</a></span></p>  
                </div>

              </div>

            </div>

            <h3 class="overview-heading">Overview</h3>
            <p class="overview">${overview}</p>
      `;

      const backdropImg = document.querySelector(".backdrop-img");
      backdropImg.src = backdropSource;
      // Add production companies as comma delimited list
      displayProdCompanies(production_companies);
      // Add individual genre tag
      displayGenres(genres);
    })
    .catch((err) => {
      alert("Detail error" + err);
    });
}

function getAnimeDetails() {
  const id = getAnimeID();
  fetch(`https://api.jikan.moe/v4/anime/${id}`)
    .then((res) => res.json())
    .then((obj) => {
      // console.log(data);
      const image_path = obj.data.images.jpg.image_url;
      const backdropSource = obj.data.images.jpg.large_image_url;
      const trailer_path = obj.data.trailer.url;
      const {
        title,
        status,
        synopsis,
        score,
        studios,
        episodes,
        year,
        genres,
        type,
        url,
      } = obj.data;
      // const productionNames=
      mediaDetailsSection.innerHTML = `
            <div class="backdrop">
               <div class="backdrop-img-div">
                  <img src="" alt="" class="backdrop-img">
               </div>

               <div class="media-info">
                <div class="poster-div">
                  <img class="poster-img" src="${image_path}" alt="">
               </div>
                <div class="media-content">
                    <h2 class="media-title">${title}</h2>
              <div class="genre-wrapper">
              </div>
              <p class="type detail">Type: ${checkInfo(type)}</p>
              <p class="release-date detail">Released year: ${checkInfo(
                year
              )}</p>
              <p class="production detail">Producers: </p>
              <p class="status detail">Status: ${checkInfo(status)}</p>
              <p class="runtime detail">Episodes: ${checkInfo(episodes)}</p>
              <p class="rating detail">MAL Rating: ${checkInfo(score)}</p>  
              <p class="links detail">Links: <span><a href="${url}">MyAnimeList Page,</a></span> <span><a href="${trailer_path}">Trailer</a></span></p> 
                  </div>
               </div>
            </div>
          <h3 class="overview-heading">Synopsis</h3>
          <p class="overview">${checkInfo(synopsis)}</p>
      `;
      const backdropImg = document.querySelector(".backdrop-img");
      backdropImg.src = backdropSource;
      // Add production companies as comma delimited list
      displayProdCompanies(studios);
      // Add individual genre tag
      displayGenres(genres);
    })
    .catch((err) => {
      alert("Detail error " + err);
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

function checkInfo(data) {
  if (data === null) return "Unknown";
  return data;
}
