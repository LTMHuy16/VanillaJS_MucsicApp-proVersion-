const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-detail .name"),
musicArtist = wrapper.querySelector(".song-detail .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
nextBtn = wrapper.querySelector("#next"),
prevBtn = wrapper.querySelector("#prev"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
repeatList = wrapper.querySelector("#repeatList"),
showMoreBtn = wrapper.querySelector("#more-music"),
musicList = wrapper.querySelector(".music-list"),
hideMusicBtn = musicList.querySelector("#close");


let musicIndex = 1;


/*=============================================*/
/*=============== LOAD MUSIC =================*/
window.addEventListener("load", function () {
  loadMusic(musicIndex);
})

function loadMusic(index) {
  musicName.innerText =  allMusic[index - 1].name;
  musicArtist.innerText =  allMusic[index - 1].artist;
  musicImg.src =  `imgs/${allMusic[index - 1].img}.jpg`;
  mainAudio.src =  `songs/${allMusic[index - 1].src}.mp3`;
}


/*=============================================*/
/*============ PLAY AND PAUSE MUSIC ==========*/
/*=============================================*/
playPauseBtn.addEventListener('click', function (e) {
  const isMusicPaused = wrapper.classList.contains("paused");
  // pause or play music
  isMusicPaused ? pauseMusic() : playMusic();
})

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

/*=============================================*/
/*============ NEXT PREV BUTTONS ==============*/
/*=============================================*/
nextBtn.addEventListener('click', function () {
  nextMusic();
})

prevBtn.addEventListener('click', function () {
  prevMusic();
})

function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  activePlayingSong(); // show which song is playing in list songs
  loadMusic(musicIndex);
  playMusic();
}

function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  activePlayingSong(); // show which song is playing in list songs
  loadMusic(musicIndex);
  playMusic();
}

/*=============================================*/
/*============ PROGRESS BAR TIME ==============*/
/*=============================================*/
mainAudio.addEventListener('timeupdate', function (e) {
  const duration = e.target.duration;
  const currentTime = e.target.currentTime;
  let musicCurrentTime = wrapper.querySelector(".current"),
  musicDurationTime = wrapper.querySelector(".duration"),
  progressWidth =  (currentTime / duration) * 100;

  // update current time in progress, currentTime and total duration number
  progressBar.style.width = `${progressWidth}%`;

  //update total duration
  mainAudio.addEventListener('loadeddata', function () {
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.ceil(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDurationTime.innerHTML = `${totalMin}:${totalSec}`;
  });

  //update current time
  let audioCurrent = mainAudio.currentTime;
  let currentMin = Math.floor(audioCurrent / 60);
  let currentSec = Math.ceil(audioCurrent % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerHTML = `${currentMin}:${currentSec}`;
});

/*========= Update playing song current time flowing progress width ========= */
progressArea.addEventListener('click', function (e) {
  let currentProgressWidth = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;
  
  mainAudio.currentTime = (clickedOffsetX / currentProgressWidth) * songDuration;
});
//  NGHIÊN CỨU LÀM CÁI SỰ KIỆN KÉO THẢ


/*=============================================*/
/*========= REPEAT LIST AND LIST SONG ========*/
/*===========================================*/
repeatList.addEventListener('click', function () {
  // change Icon repeatList
  let repeatListText = repeatList.innerText;
  switch(repeatListText) {
    case "repeat":
      repeatList.innerText = "repeat_one";
      repeatList.setAttribute("title", "Song Looped")
      break;
    case "repeat_one":
      repeatList.innerText = "shuffle";
      repeatList.setAttribute("title", "Playback shuffle")
      break;
    case "shuffle":
      repeatList.innerText = "repeat";
      repeatList.setAttribute("title", "Playlist Looped")
      break;
  }
});

/*=============================================*/
/*========= EVENTS WHEN THE SONG END =========*/
/*===========================================*/
mainAudio.addEventListener('ended', function () {
  let repeatListText = repeatList.innerText;

  switch(repeatListText) {
    // If user choose simple repeat
    case "repeat":
      nextMusic();
      break;
    // If user choose repeat one song
    case "repeat_one":
      mainAudio.currentTime = "0";
      playMusic();
      break;
    // If user choose random repeat songs
    case "shuffle":
      let randomIndex;
      do {
        randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
      } while (randomIndex == musicIndex);
      musicIndex = randomIndex;
      loadMusic(musicIndex);
      playMusic();
      break;
  }
})


/*=============================================*/
/*=== LOAD LIST SONGS SHOW/HIDE SONG LISTS ===*/
/*===========================================*/

/* ===== show/hide song lists =====*/
showMoreBtn.addEventListener('click', function () {
  musicList.classList.add("show");
});

hideMusicBtn.addEventListener('click', function () {
  musicList.classList.remove("show");
});

/* ===== Load list song ===== */
const ulTag = musicList.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
  let liTag = `
              <li song-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <audio class="song_${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                <span id="song_${allMusic[i].src}" class="audio-duration"></span>
                <span class="playing" style="display: none;">Playing</span>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  // load song's duration
  let liAudioTag = ulTag.querySelector(`.song_${allMusic[i].src}`);
  let liAudioDuration = ulTag.querySelector(`#song_${allMusic[i].src}`);

  liAudioTag.addEventListener('loadeddata', function () {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.ceil(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerHTML = `${totalMin}:${totalSec}`;
  })
};

/* ===== Play songs when click in list songs =====*/
const allLiTags = ulTag.querySelectorAll("li");

// Show the song which is playing
function activePlayingSong() {
  for (let i = 0; i < allLiTags.length; i++) {
    // Show the song which is playing
    if (allLiTags[i].className == "playing") {
      allLiTags[i].classList.remove("playing")
    }
    if (allLiTags[i].getAttribute("song-index") == musicIndex) {
      allLiTags[i].classList.add("playing");
    }
  }
}

// run activePlayingSong()
activePlayingSong();

// Add event onclick in each li element
for (let i = 0; i < allLiTags.length; i++) {
  allLiTags[i].setAttribute("onclick", "clickedSong(this)");
}

function clickedSong(element) {
  let getLiIndex = element.getAttribute("song-index");
  musicIndex = getLiIndex;
  activePlayingSong();
  loadMusic(musicIndex);
  playMusic();
}
