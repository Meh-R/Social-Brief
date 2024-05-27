async function getAllPost() {
  let cards = document.querySelector(".cards");
  cards.innerHTML = "";
  console.log("titi");
  const apiRequest = await fetch("http://localhost:3007/allPost");

  let response = await apiRequest.json();

  console.log(response);

  response.forEach((element) => {
    cards.innerHTML += `<div class="  bg-white w-3/6 shadow rounded-lg overflow-hidden flex flex-col ">

            <h3 class="m-3 font-bold text-lg">${element.comment}</h3>
           
            <div class=" media-${element._id}   h-auto overflow-hidden flex flex-col "></div>
            <div class="p-6 flex flex-col flex-1">
            </div>`;

    let media = document.querySelector(`.media-${element._id}`);

    const pics = element.picture.split(".");
    const extend = pics[1];

    if (extend == "webm") {
      let video = document.createElement("video");
      video.classList.add(`video-${element._id}`);
      video.classList.add(`object-cover`);
      video.classList.add(`h-auto`);
      video.classList.add(`w-full`);
      video.classList.add(`videoPlayer`);
      video.setAttribute("autoplay", "");
      video.setAttribute("loop", "");
      video.setAttribute("muted", "");
      media.appendChild(video);

      let baliseVideo = document.querySelector(`.video-${element._id}`);
      let source = document.createElement("source");
      source.setAttribute("type", "video/webm ");
      source.setAttribute(
        "src",
        `http://localhost:3007/imageFile/${element.picture}`
      );
      source.classList.add("object-cover", "h-auto", "w-full");
      baliseVideo.appendChild(source);
    } else {
      media.innerHTML += `<img src="http://localhost:3007/imageFile/${element.picture}" class="object-cover h-auto w-full" alt="">`;
    }
  });

  let videoPlayers = document.querySelectorAll(".videoPlayer");
  videoPlayers.forEach((vid) => {
    vid.muted = true;
    vid.play();
  });
}
getAllPost();
