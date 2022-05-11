const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const songList = $(".song-list")


// fetch JSON data from directory
async function getJSON() {
    const res = await fetch("./songs_lib.JSON");
    const json = await res.json();
    app.songs = json
    console.log("fetched")
}



// main app
const app = { // var songsNumber = songLibrary.length //not necessary

    render:  async function (){
        await getJSON()
        console.log("rendering")
          let songItems = this.songs.map(function(song,index){
            return element = 
            `<li class="song-item">
            <audio class = "song-item__mp3"  src="${song.path}"></audio>
            <span class="song-item__index">${index+1}</span>
            <img src="data:${song.coverArt.format};base64,${song.coverArt.image}" alt="" class="song-item__art">
            <div class="song-item__title">${song.title}</div>
            <div class="song-item__artist">${song.artist}</div>
            <div class="song-item__album">${song.album}</div>
            <div class="song-item__genre">${song.genre}</div>
            <span class="song-item__duration">${Math.floor(song.duration/60)}:${(song.duration - Math.floor(song.duration / 60)*60).toFixed(0)}</span>
            </li>`
        })

        songList.innerHTML += songItems.join('')
    }



}


app.render()