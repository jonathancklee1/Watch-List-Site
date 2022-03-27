const closeBtn = document.getElementById("mobile-close-icon");
const mobileNav = document.querySelector(".mobile-nav-bar");
const hamburgerIcon = document.querySelector(".hamburger-icon");
const movieTab = document.querySelector(".movie-tab");
const tvTab = document.querySelector(".tv-tab");
const animeTab = document.querySelector(".anime-tab");
const movieList = document.querySelector(".movie-list");
const tvList = document.querySelector(".tv-list");
const animeList = document.querySelector(".anime-list");

let movieArr = [];
let tvArr = [];
let animeArr = [];

//Function Invocation

getLS();
renderLists();
addListeners();

// Event listeners
hamburgerIcon.addEventListener("click", () => {
  mobileNav.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  mobileNav.classList.remove("open");
});

movieTab.addEventListener("click", () => {
  //Current Tab
  movieTab.classList.add("selected");
  tvTab.classList.remove("selected");
  animeTab.classList.remove("selected");
  //Current List
  movieList.classList.add("selected");
  tvList.classList.remove("selected");
  animeList.classList.remove("selected");
});
tvTab.addEventListener("click", () => {
  //Current Tab
  movieTab.classList.remove("selected");
  tvTab.classList.add("selected");
  animeTab.classList.remove("selected");
  //Current List
  movieList.classList.remove("selected");
  tvList.classList.add("selected");
  animeList.classList.remove("selected");
});
animeTab.addEventListener("click", () => {
  //Current Tab
  movieTab.classList.remove("selected");
  tvTab.classList.remove("selected");
  animeTab.classList.add("selected");
  //Current List
  movieList.classList.remove("selected");
  tvList.classList.remove("selected");
  animeList.classList.add("selected");
});

function addListeners() {
  const deleteBtn = document.querySelectorAll(".delete-div");
  const watchedBtn = document.querySelectorAll(".watched-div");
  const clearbtn = document.querySelector(".clear-btn");

  watchedBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      btn.parentElement.classList.toggle("watched");
      const selectedTitle = btn.parentNode.children[1].children[0].textContent;
      getLS();
      if (btn.parentNode.parentNode.classList.contains("movie-list")) {
        toggleLSWatched("movieArr", movieArr, selectedTitle);
      } else if (btn.parentNode.parentNode.classList.contains("tv-list")) {
        toggleLSWatched("tvArr", tvArr, selectedTitle);
      } else {
        toggleLSWatched("animeArr", animeArr, selectedTitle);
      }
    });
  });
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedTitle = btn.parentNode.children[1].children[0].textContent;
      getLS();
      // console.log(btn.parentNode.parentNode.classList);
      if (btn.parentNode.parentNode.classList.contains("movie-list")) {
        removeFromLS("movieArr", movieArr, selectedTitle);
      } else if (btn.parentNode.parentNode.classList.contains("tv-list")) {
        removeFromLS("tvArr", tvArr, selectedTitle);
      } else {
        removeFromLS("animeArr", animeArr, selectedTitle);
      }
      btn.parentNode.remove();
    });
  });

  clearbtn.addEventListener("click", () => {
    const listItem = document.querySelectorAll(".list-item");
    listItem.forEach((item) => {
      getLS();
      if (item.classList.contains("watched")) {
        const selectedTitle = item.children[1].children[0].textContent;
        if (item.parentNode.classList.contains("movie-list")) {
          removeFromLS("movieArr", movieArr, selectedTitle);
        } else if (item.parentNode.classList.contains("tv-list")) {
          removeFromLS("tvArr", tvArr, selectedTitle);
        } else {
          removeFromLS("animeArr", animeArr, selectedTitle);
        }
        item.remove();
      }
    });
  });
}

//Functions
function getLS() {
  movieArr = JSON.parse(localStorage.getItem("movieArr"));
  tvArr = JSON.parse(localStorage.getItem("tvArr"));
  animeArr = JSON.parse(localStorage.getItem("animeArr"));
}

function renderLists() {
  renderMovieList();
  renderTvList();
  renderAnimeList();
}
function renderMovieList() {
  for (i in movieArr) {
    let movieItem = document.createElement("div");
    movieItem.innerHTML = `
                     <div class="poster-div">
                        <img src="${movieArr[i].poster_path}" alt="" class="poster">
                     </div>
                     <div class="movie-title">
                        <p>${movieArr[i].title}</p>
                     </div>
                     <div class="watched-div">
                        <i class="fa fa-check"></i>
                     </div>
                     <div class="delete-div">
                        <i class="fa fa-trash"></i>
                     </div>
                  `;
    movieItem.classList.add("list-item", "movie-item");
    movieList.appendChild(movieItem);
    if (movieArr[i].watched === true) {
      movieItem.classList.add("watched");
    }
  }
}

function renderTvList() {
  for (i in tvArr) {
    let tvItem = document.createElement("div");
    tvItem.innerHTML = `
                     <div class="poster-div">
                        <img src="${tvArr[i].poster_path}" alt="" class="poster">
                     </div>
                     <div class="tv-title">
                        <p>${tvArr[i].title}</p>
                     </div>
                     <div class="watched-div">
                        <i class="fa fa-check"></i>
                     </div>
                     <div class="delete-div">
                        <i class="fa fa-trash"></i>
                     </div>
                  `;
    tvItem.classList.add("list-item", "tv-item");
    tvList.appendChild(tvItem);
    if (tvArr[i].watched === true) {
      tvItem.classList.add("watched");
    }
  }
}

function renderAnimeList() {
  for (i in animeArr) {
    let animeItem = document.createElement("div");
    animeItem.innerHTML = `
                     <div class="poster-div">
                        <img src="${animeArr[i].poster_path}" alt="" class="poster">
                     </div>
                     <div class="anime-title">
                        <p>${animeArr[i].title}</p>
                     </div>
                     <div class="watched-div">
                        <i class="fa fa-check"></i>
                     </div>
                     <div class="delete-div">
                        <i class="fa fa-trash"></i>
                     </div>
                 `;
    animeItem.classList.add("list-item", "anime-item");
    animeList.appendChild(animeItem);
    if (animeArr[i].watched === true) {
      animeItem.classList.add("watched");
    }
  }
}

function removeFromLS(arrName, arr, title) {
  arr = arr.filter((item) => item.title !== title);
  localStorage.setItem(arrName, JSON.stringify(arr));
  console.log("item removed");
}

function toggleLSWatched(arrName, arr, title) {
  console.log(arr);
  for (item in arr) {
    console.log(item);
    if (arr[item].title == title) {
      arr[item].watched = !arr[item].watched;
    }
  }
  localStorage.setItem(arrName, JSON.stringify(arr));
  console.log("watched toggled");
}
