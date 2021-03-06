const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const songList = $(".song-list")
const audioElements = $(".main-audio")
const volumeSlider = $(".volume__bar-level")
const playBtn = $$(".play-btn")


// fetch JSON data from directory
async function getJSON() {

    const res = await fetch("./songs_lib.JSON");
    const json = await res.json();
    app.songs = json
}

function timeFormatter(timeDuration) {
    let min = Math.floor(timeDuration / 60)
    let sec = (timeDuration - Math.floor(timeDuration / 60) * 60).toFixed(0)

    if (min < 10 && min >= 0) {
        min = `0${min}`
    }

    if (sec < 10 && sec >= 0) {
        sec = `0${sec}`
    }

    let output = `${min}:${sec}`

    return output;
}



const app = {
    currentSongIndex: -1,
    shuffleSongIndex: -1,
    songs: [],
    shuffleSongs: [],
    songsNumber: 0,
    isShuffle: false,
    isMute: false,
    repeatState: [0,1,2],
    audioVolume: .7,


    render: async function () {
        await getJSON()

        this.songsNumber = this.songs.length
        //create html elements
        let songItems = this.songs.map((song, index) => {
            return element = `<li class="song-item">
            
            <span class="song-item__index">${index + 1
                }</span>
            <img src="data:${song.coverArt.format
                };base64,${song.coverArt.image
                }" alt="" class="song-item__art">
            <div class="song-item__title">${song.title
                }</div>
            <div class="song-item__artist">${song.artist
                }</div>
            <div class="song-item__album">${song.album
                }</div>
            <div class="song-item__genre">${song.genre
                }</div>
            <span class="song-item__duration">
                ${timeFormatter(song.duration)}
            </span>
            </li>`
        })

        //create html elements
        songList.innerHTML += songItems.join('')

    },

    addEvent: function () {
        
        //click events for songs in library
        let songItems = $$(".song-item")
        songItems.forEach(element => {
            element.addEventListener(
                "click", function (e) {
                    app.currentSongIndex = Array.from(element.parentElement.children).indexOf(element) - 1
                    if (app.isShuffle) { app.shufflePlaylist() }
                    app.changeUI()
                    app.updateAudio()
                }
            )
        })

        //click events for play button
        playBtn[0].parentNode.addEventListener("click", (e) => {

            if (app.currentSongIndex >= 0) {
                if (audioElements.paused) {
                    app.playAudio()
                }
                else {
                    app.pauseAudio()
                }
            }

            else {
                app.nextSong()
            }

        })

        //click events for next button
        $(".player__fwrd").addEventListener("click", (e) => {
            this.nextSong()
        })

        //click events for prev button
        $(".player__prev").addEventListener("click", (e) => {
            this.prevSong()
        })

        //click event for Reapeat button
        $(".player__repeat").addEventListener("click", () => {
            $(".player__repeat").children[this.repeatState[0]].classList.remove("btn-active")
            let tmp = this.repeatState.shift()
            this.repeatState.push(tmp)
            $(".player__repeat").children[this.repeatState[0]].classList.add("btn-active")

        })

        //click event for Shuffle button
        $(".player__shuffle").addEventListener("click", (e) => {
            this.isShuffle = !this.isShuffle
            
            $(".player__shuffle").children[0].classList.toggle("btn-active")
            $(".player__shuffle").children[1].classList.toggle("btn-active")

            if (this.isShuffle) {
                this.shufflePlaylist()
            }

            else {
                this.shuffleSongs = []
            }

        })

        //click event for mute button
        $(".volume__toggle").addEventListener("click", (e) => {
            this.muteVolume(e.target.parentNode)

        })

        //change volume on click
        $(".volume__bar").addEventListener("click", (e) => {
            this.setVolume(e)
            this.updateVolume()
        })

        //click event for progress bar
        $(".player__progress").addEventListener("click", (e) => {
            this.setProgress(e)
            this.updateProgress()
            this.updateTime()
        })

    },

    nextSong: function () {
        if (!this.isShuffle && this.currentSongIndex >= -1 && this.currentSongIndex < this.songsNumber - 1) {
            this.currentSongIndex++
            this.changeUI()
            this.updateAudio()
        }

        else if (!this.isShuffle && this.currentSongIndex == this.songsNumber - 1) {
            this.currentSongIndex = 0
            this.changeUI()
            this.updateAudio()
        }


        else if (this.isShuffle && this.shuffleSongIndex >= -1 && this.shuffleSongIndex < this.songsNumber - 1) {
            this.shuffleSongIndex++
            this.currentSongIndex = this.shuffleSongs[this.shuffleSongIndex]
            this.changeUI()
            this.updateAudio()
        }

        else if (this.isShuffle && this.shuffleSongIndex == this.songsNumber - 1) {
            this.shufflePlaylist()
            this.shuffleSongIndex++
            this.currentSongIndex = this.shuffleSongs[this.shuffleSongIndex]
            this.changeUI()
            this.updateAudio()
        }

    },

    prevSong: function () {
        if (!this.isShuffle && this.currentSongIndex > 0 && this.currentSongIndex <= this.songsNumber - 1) {
            this.currentSongIndex--
            this.changeUI()
            this.updateAudio()
        }

        else if (!this.isShuffle && this.currentSongIndex == 0) {
            this.currentSongIndex = this.songsNumber - 1
            this.changeUI()
            this.updateAudio()
        }

        if (this.isShuffle && this.shuffleSongIndex > 0 && this.shuffleSongIndex <= this.songsNumber - 1) {
            this.shuffleSongIndex--
            this.currentSongIndex = this.shuffleSongs[this.shuffleSongIndex]
            this.changeUI()
            this.updateAudio()
        }

        else if (this.isShuffle && this.shuffleSongIndex == 0) {
            this.shufflePlaylist()
            this.shuffleSongIndex = this.songsNumber - 2
            this.currentSongIndex = this.shuffleSongs[this.shuffleSongIndex]
            this.changeUI()
            this.updateAudio()
        }
    },

    
    changeUI: function () {//update UI after a new song is selected

        //reveal songs on player
        if (this.currentSongIndex >= 0) {
            $(".player__song-info").style.opacity = 1
            $(".player__progress").style.opacity = 1
            $(".player__time").style.display = "flex"
        }


        //put html inside varibles 
        const playerTitle = $(".player__song-title")
        const playerArt = $(".player__song-art")
        const playerArtist = $(".player__song-artist")
        const playerSongsDuration = $(".player__time-total")

        let songItems = $$(".song-item")
        currentSongInfo = app.songs[app.currentSongIndex]

        //change text content of UI elements
        playerArtist.textContent = currentSongInfo.artist
        playerTitle.textContent = currentSongInfo.title
        playerArt.src = `data:${currentSongInfo.coverArt.format};base64,${currentSongInfo.coverArt.image}`
        playerSongsDuration.textContent = `${timeFormatter(currentSongInfo.duration)}`

        //change active state for songs
        songItems.forEach(function (e) {
            e.classList.remove("song-active")
        })
        songItems[app.currentSongIndex].classList.add("song-active")

    },

    updateAudio: function () { //plays audio after changing songs
        audioElements.src = app.songs[this.currentSongIndex].path
        this.playAudio()
        

    },

    playAudio: function () {
        audioElements.play()
        playBtn[0].classList.remove("btn-active")
        playBtn[1].classList.add("btn-active")
        this.updateProgress()
        this.updateTime()
        
    },

    pauseAudio: function () {
        audioElements.pause()
        playBtn[0].classList.add("btn-active")
        playBtn[1].classList.remove("btn-active")
    },

    updateTime: function () {
        let playerTime = $(".player__time-current")
        audioElements.addEventListener("timeupdate", (e) => {
            let currentTime = timeFormatter(audioElements.currentTime)
            playerTime.textContent = `${currentTime} `
        })
    },

    updateProgress: function () {
        let currentProgress = $(".player__progress-current")
        audioElements.addEventListener("timeupdate", (e) => {
            let currentPercentage = audioElements.currentTime / app.songs[app.currentSongIndex].duration * 100
            currentProgress.style.width = `${currentPercentage}%`
        })
    },

    songEnds: function(){
        audioElements.addEventListener("ended", () => {
            
            if (this.repeatState[0] == 0){
                this.nextSong()
                if( !this.isShuffle && this.currentSongIndex == 0 ||
                     this.isShuffle && this.shuffleSongIndex == this.songsNumber - 1 ){
                         this.pauseAudio()
                     }
            }

            else if (this.repeatState[0] == 1){
                this.nextSong()
            }

            else if(this.repeatState[0] == 2){
                this.playAudio()
            }
        })
    },

    setProgress: function (e) {
        let mainProgress = $(".player__progress")
        let newProgress = ((e.pageX - e.target.offsetLeft) / mainProgress.offsetWidth) * 100
        audioElements.currentTime = (app.songs[app.currentSongIndex].duration * newProgress / 100)
    },

    muteVolume: function (btn) {
        audioElements.muted = !audioElements.muted
        btn.children[0].classList.toggle("volume-state-active")
        btn.children[1].classList.toggle("volume-state-active")

    },

    updateVolume: function () {
        audioElements.volume = this.audioVolume
        volumeSlider.style.width = `${this.audioVolume * 100}%`

    },

    setVolume: function (e) {
        let volumeBar = $(".volume__bar")
        this.audioVolume = (e.pageX - e.target.offsetLeft) / volumeBar.offsetWidth
    },

    shufflePlaylist: function () {

        for (var array = [], i = 0; i < this.songsNumber; i++) {
            array.push(i)
        }

        for (var newArray = [], i = this.songsNumber, tmp, removed; i > 0; i--) {
            tmp = Math.floor(Math.random() * i)
            removed = array.splice(tmp, 1)[0]
            newArray.push(removed)
        }

        newArray.push(this.currentSongIndex)
        dupEl = newArray.findIndex(el => el === this.currentSongIndex)
        newArray.splice(dupEl, 1)

        this.shuffleSongs = newArray
        this.shuffleSongIndex = -1
        
    },

  

    start: async function () {

        //render songs
        await this.render()

        //create click events for elements
        this.addEvent()

        //update volume
        this.updateVolume()

        //update songs when ended
        this.songEnds()
    },



}


app.start()

