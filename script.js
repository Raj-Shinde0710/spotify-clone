console.log("raj shinde");
let songs
let currentsong = new Audio;
let currfolder;

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

  const totalSeconds = Math.floor(seconds); // Remove milliseconds
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}



async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://192.168.125.13:5500/${folder}/`);
  let response = await a.text();
  // console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
    songul.innerHTML = ""
  for (const song of songs) {
    songul.innerHTML =
      songul.innerHTML +
      `
        
        
        <li>
        <img class="invert" src="music.svg" alt="">
              <div class="info">
                <div>
                  ${song.replaceAll("%20", " ")}
                </div>
                <div>
                  raj shinde 
                </div>
              </div>
              <div class="playnow">
                <span>Play Now </span>
                <img class="invert" src="play.svg" alt="">
              </div>
            </li>
        
        
        
        
         `;
  }

  //   var audio = new Audio(songs[1]);
  //   audio.play();

  //   audio.addEventListener("loadeddata", () => {

  // console.log(audio.duration , audio.currentSrc , audio.currentTime)
  // })

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach(e => {  
    e.addEventListener("click" , element =>{
      // console.log(e.querySelector(".info"))
      // console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  });
}
const playmusic = (track , pause = false) =>{
  // let audio = new Audio(``/${folder}/${track}`)
  currentsong.src =`/${currfolder}/${track}`
  if(!pause){

    currentsong.play()
    play.src = "pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)  
  document.querySelector(".songtime").innerHTML = "00:00/00:00"
  
}

async function displayalbums(){
  let a = await fetch(`http://192.168.125.13:5500/songs/`);
  let response = await a.text();
  // console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")


  Array.from(anchors).forEach(async e =>{
  if(e.href.includes("/songs")){
      let folder = e.href.split("/").slice(-1)[0]
     
       let a = await fetch(`http://192.168.125.13:5500/songs/${folder}/info.json`);
       if (!a.ok) throw new Error(`Failed to fetch info.json: ${a.status}`);
  let response = await a.json();
  console.log(response)
  cardcontainer.innerHTML = cardcontainer.innerHTML + `<svg class="greencircle" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#00FF00" stroke="#00FF00" stroke-width="4" />
              <polygon points="40,30 70,50 40,70" fill="#000000" />
            </svg>
            <img src="card.webp" alt="" />
            <h3>${response.title}</h3>
            <p>${response.description}</p>`
  }
})
}
async function main() {

  
await getsongs("songs/krsna2");
  // console.log(songs);
  playmusic(songs[0] , true)
  
  displayalbums()
  play.addEventListener("click" , () =>{ 
    if(currentsong.paused){
      currentsong.play()
      play.src = "pause.svg"
    }
    
    else{
      currentsong.pause()
      play.src = "play.svg"
    }
  })
  currentsong.addEventListener("timeupdate" , () =>{
    // console.log(currentsong.currentTime , currentsong.duration)
    document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime) + "/" + formatTime(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) *100 + "%"
  })
  document.querySelector(".seekbar").addEventListener("click" , e =>{
    let percent = (e.offsetX /e.target.getBoundingClientRect().width) * 100 
    document.querySelector(".circle").style.left  = percent + "%"
    currentsong.currentTime = ((currentsong.duration) * percent) /100
  })
  document.querySelector(".hamburger").addEventListener("click" , () =>{
      document.querySelector(".left").style.left = "0%"
    
  })
  document.querySelector(".close").addEventListener("click" , () =>{
      document.querySelector(".left").style.left = "-110%"
    
  })
previous.addEventListener("click" , () =>{
      
    let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
      if((index-1) > 0){

        playmusic(songs[index-1])
      }
      // console.log(songs , index)
  })
next.addEventListener("click" , () =>{
  let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
      if((index+1) < songs.length -1){

        playmusic(songs[index+1])
      }
      // console.log(songs , index)
    
  })
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e) => {
  currentsong.volume = parseInt(e.target.value)/100
})
Array.from(document.getElementsByClassName("card")).forEach(e =>{
  // console.log(e)
  e.addEventListener("click" , async item => {
    // console.log(item , item.currentTarget.dataset)
    songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
    

  })
})
}
main();
