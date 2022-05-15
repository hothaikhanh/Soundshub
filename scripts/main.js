const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const songList = $(".song-list")
const audioElements = $(".main-audio")
const playBtn = $$(".play-state")



// fetch JSON data from directory
async function getJSON() {
    const res = await fetch("./songs_lib.JSON");
    const json = await res.json();
    app.songs = json

}


const app = { 
    currentSongIndex: -1,
    songs: [],
    songsNumber: 0,
    isShuffle: false,
    isRepeat: false,

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
            <span class="song-item__duration">${Math.floor(song.duration / 60)
                }:${(song.duration - Math.floor(song.duration / 60) * 60).toFixed(0)
                }</span>
            </li>`
        })
        songList.innerHTML += songItems.join('')
        //create html elements

        //create click events for elements
        this.addEvent()
        //create click events for elements
        this.changeUI()
    },

    addEvent: function () {
        let songItems = $$(".song-item")

        //click for songs in library
        songItems.forEach(element => {
            element.addEventListener(
                "click", function (e) {
                    app.currentSongIndex = Array.from(element.parentElement.children).indexOf(element) - 1
                    app.changeUI()
                    app.updateAudio()
                }
            )
        })

        //click events for play button
        playBtn[0].parentNode.addEventListener("click", (e) => {
            if(app.currentSongIndex >= 0){
                if(audioElements.paused){
                    app.playAudio()
                }
                else{
                    app.pauseAudio()
                }
            }
        })
          
        //click events for next button
        $(".player__fwrd").addEventListener("click",(e) =>{
            this.nextSong()
        })

        //click events for prev button
        $(".player__prev").addEventListener("click",(e) =>{
            this.prevSong()
        })

        //click event for Reapeat button
        $(".player__repeat").addEventListener("click",(e) =>{
            this.isRepeat = !this.isRepeat
            $(".player__repeat").classList.toggle("player--active")
        })

        //click event for Shuffle button
        $(".player__shuffle").addEventListener("click",(e) =>{
            this.isShuffle = !this.isShuffle
            $(".player__shuffle").classList.toggle("player--active")
        })

    },

    nextSong: function (){
        if(!this.isShuffle){
            if(this.currentSongIndex >= 0 && this.currentSongIndex < this.songsNumber - 1){
                this.currentSongIndex++
                this.changeUI()
                this.updateAudio()
            }

            else if(this.currentSongIndex == this.songsNumber - 1){
                this.currentSongIndex = 0
                this.changeUI()
                this.updateAudio()
            }
        }

        else{
            this.playShuffle()
        }
    },


    prevSong: function (){
        if(!this.isShuffle){
            if(this.currentSongIndex > 0 && this.currentSongIndex <= this.songsNumber - 1){
                this.currentSongIndex--
                this.changeUI()
                this.updateAudio()
            }

            else if(this.currentSongIndex == 0){
                this.currentSongIndex = 9
                this.changeUI()
                this.updateAudio()
            }
        }

        else{
            this.playShuffle()
        }
    },

    playShuffle: function (){
        //todo
    },

    playLoop: function () {
        //todo
    },

    changeUI: function () {

        //display current song on player
        if(this.currentSongIndex >= 0){
            $(".player__song").style.opacity = 1
            $(".player__progress").style.display = "flex"
        }




        //set varibles for html elements
        const headerArtist = $(".current-song__artist")
        const headertitle = $(".current-song__title")
        const headerAlbum = $(".current-song__album")
        const headerArt = $(".current-song__art")

        const playerTitle = $(".player__song-title")
        const playerArt = $(".player__song-art")
        const playerArtist = $(".player__song-artist")

        let currentSongInfo = this.songs[app.currentSongIndex]
        let songItems = $$(".song-item")

        //change text content of UI elements
        headerArtist.textContent = currentSongInfo.artist
        playerArtist.textContent = currentSongInfo.artist

        headertitle.textContent = currentSongInfo.title
        playerTitle.textContent = currentSongInfo.title

        headerAlbum.textContent = currentSongInfo.album

        headerArt.src = `data:${currentSongInfo.coverArt.format};base64,${currentSongInfo.coverArt.image}`
        playerArt.src = `data:${currentSongInfo.coverArt.format};base64,${currentSongInfo.coverArt.image}`


        //change active state for songs
        songItems.forEach(function(e){
            e.classList.remove("song-active")
        })
        songItems[app.currentSongIndex].classList.add("song-active")

    },

    updateAudio: function() { //plays audio after changing songs
        audioElements.src = app.songs[this.currentSongIndex].path
        this.playAudio()
    },


    playAudio: function() {
        audioElements.play()
        playBtn[0].classList.remove("play-state-active")
        playBtn[1].classList.add("play-state-active")
        this.updateProgressBar()
        

    },

    pauseAudio: function(){
        audioElements.pause()
        playBtn[1].classList.remove("play-state-active")
        playBtn[0].classList.add("play-state-active")
    },

    updateProgressBar: function(){
        let seekbar = $(".player__progress-current")
        let currentPercentage = 0 
        setInterval(function(){
            currentPercentage = audioElements.currentTime / app.songs[app.currentSongIndex].duration * 100
            seekbar.style.width = `${currentPercentage}%`
        }, 100)

        
    },

    start: async function () {
        await this.render()
    },


}


app.start()

