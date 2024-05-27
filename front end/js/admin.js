async function searchUser() {
  let cards = document.querySelector(".cards");
  let search = document.querySelector(".search").value;
  cards.innerHTML = "";

  let find = {
    user: search,
  };

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(find),
  };

  const apiRequest = await fetch("http://localhost:3007/searchUser", request);

  let response = await apiRequest.json();

  response.forEach((element) => {
    let thread = "";
    for (let i = 0; i < element.threadsComment.length; i++) {
      const elementPseudo = element.threadsComment[i].pseudo;
      const elementThread = element.threadsComment[i].threadsPost;
      const elementDate = element.threadsComment[i].created_at;
      const elementPics = element.threadsComment[i].userPics;
      thread += ` <div class="flex flex-row items-center "> <div class="mr-4 w-12 h-12 rounded-full overflow-hidden border-2 dark:border-white border-gray-900">
            <img src="http://localhost:3007/imageFile/${elementPics}" alt="" class="w-full h-full object-cover">
          </div><div class="flex flex-row justify-between align "> <p class"">${elementPseudo}</p><p class="ml-10">${new Date(
        elementDate
      ).toLocaleDateString("fr")}</p></div></div><p class="mb-5 mt-3 text-lg
">${elementThread}</p>`;
    }

    cards.innerHTML += `<div class="  bg-white w-4/6 shadow rounded-lg overflow-hidden flex flex-col ">

            <h3 class="m-3 font-bold text-lg">${element.comment}</h3>
            <h6 class=" m-3 block text-slate-400 font-semibold text-sm mb-3">${element.pseudo}</h3>
            <div class=" media-${element._id}   h-auto overflow-hidden flex flex-col "></div>
            <div class="p-6 flex flex-col flex-1">

            </div>
            
            <div class="flex flex-row justify-center mx-2 flex-wrap" >
                                        <button onclick="deletePost('${element._id}')" class="mx-2  w-1/10  flex  justify-center rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>

            <div class=' from-teal-100 via-teal-300 to-teal-500 bg-gradient-to-br' x-data="{ reportsOpen: false }">
    <div class='w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl'>
        <div class='max-w-md mx-auto space-y-6'>

    
            <div @click="reportsOpen = !reportsOpen" class='flex items-center text-gray-600 w-full border-b overflow-hidden mt-32 md:mt-0 mb-5 mx-auto'>
            <div class='w-10 border-r px-2 transform transition duration-300 ease-in-out' :class="{'rotate-90': reportsOpen,' -translate-y-0.0': !reportsOpen }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>          
            </div>
            <div class='flex items-center px-2 py-3'>
            <div class='mx-3'>
                <button class="hover:underline">thread</button>
            </div>
            </div>
            </div>

            
            <div class=" flex flex-col p-5 md:p-0 w-full transform transition duration-300 ease-in-out border-b pb-10"
            x-cloak x-show="reportsOpen" x-collapse x-collapse.duration.500ms >


   <div class="w-full max-w-xl bg-white rounded-lg px-4 pt-2 ">
      <div class="flex flex-wrap justify-center -mx-3 mb-6">
         <h2 class="px-4 pt-3 pb-2 text-gray-800 text-lg">Add a new comment</h2>
         <div class="w-full md:w-full px-3 mb-2 mt-2">
            <textarea class=" thread-${element._id} bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white" name="body" placeholder='Type Your Comment' required></textarea>
         </div>
         <div class="w-full md:w-full flex justify-center items-start md:w-full px-3">

            <div class="-mr-1 ">
               <button onclick=" getComment('${element._id}')" class="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100">Add comment</button>
            </div>
         </div>
      </div>


            
            
       <div class="mb-5 "> ${thread}  </div>

        </div>
    </div>
</div>
          </div>             
          <div class=" modale-${element._id} hidden  flex min-h-full justify-center align px-6 py-12 lg:px-8">
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

async function getAllPost() {
  let cards = document.querySelector(".cards");
  cards.innerHTML = "";
  console.log("titi");
  const apiRequest = await fetch("http://localhost:3007/allPost");

  let response = await apiRequest.json();

  console.log(response);

  response.forEach((element) => {
    let thread = "";
    for (let i = 0; i < element.threadsComment.length; i++) {
      const elementPseudo = element.threadsComment[i].pseudo;
      const elementThread = element.threadsComment[i].threadsPost;
      const elementDate = element.threadsComment[i].created_at;
      const elementPics = element.threadsComment[i].userPics;
      thread += ` <div class="flex flex-row items-center "> <div class="mr-4 w-12 h-12 rounded-full overflow-hidden border-2 dark:border-white border-gray-900">
            <img src="http://localhost:3007/imageFile/${elementPics}" alt="" class="w-full h-full object-cover">
          </div><div class="flex flex-row justify-between align "> <p class"">${elementPseudo}</p><p class="ml-10">${new Date(
        elementDate
      ).toLocaleDateString("fr")}</p></div></div><p class="mb-5 mt-3 text-lg
">${elementThread}</p>`;
    }

    cards.innerHTML += `<div class="  bg-white w-4/6 shadow rounded-lg overflow-hidden flex flex-col ">

            <h3 class="m-3 font-bold text-lg">${element.comment}</h3>
           <div class="flex flex-row justify-between"> <h6 class=" m-3 block text-slate-400 font-semibold text-sm mb-3">${element.pseudo}</h3><p class="mt-1 mr-2">like: ${element.like.length}</p></div>
            <div class=" media-${element._id}   h-auto overflow-hidden flex flex-col "></div>
            <div class="p-6 flex flex-col flex-1">

            </div>
            
            <div class="flex flex-row justify-center mx-2 flex-wrap" >

                <button onclick="deletePost('${element._id}')" class="mx-2  w-1/10  flex  justify-center rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>

            <div class=' from-teal-100 via-teal-300 to-teal-500 bg-gradient-to-br' x-data="{ reportsOpen: false }">
    <div class='w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl'>
        <div class='max-w-md mx-auto space-y-6'>

    
            <div @click="reportsOpen = !reportsOpen" class='flex items-center text-gray-600 w-full border-b overflow-hidden mt-32 md:mt-0 mb-5 mx-auto'>
            <div class='w-10 border-r px-2 transform transition duration-300 ease-in-out' :class="{'rotate-90': reportsOpen,' -translate-y-0.0': !reportsOpen }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>          
            </div>
            <div class='flex items-center px-2 py-3'>
            <div class='mx-3'>
                <button class="hover:underline">thread</button>
            </div>
            </div>
            </div>

            
            <div class=" flex flex-col p-5 md:p-0 w-full transform transition duration-300 ease-in-out border-b pb-10"
            x-cloak x-show="reportsOpen" x-collapse x-collapse.duration.500ms >


   <div class="w-full max-w-xl bg-white rounded-lg px-4 pt-2 ">
      <div class="flex flex-wrap justify-center -mx-3 mb-6">
         <h2 class="px-4 pt-3 pb-2 text-gray-800 text-lg">Add a new comment</h2>
         <div class="w-full md:w-full px-3 mb-2 mt-2">
            <textarea class=" thread-${element._id} bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white" name="body" placeholder='Type Your Comment' required></textarea>
         </div>
         <div class="w-full md:w-full flex justify-center items-start md:w-full px-3">

            <div class="-mr-1 ">
               <button onclick=" getComment('${element._id}')" class="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100">Add comment</button>
            </div>
         </div>
      </div>


            
            
       <div class="mb-5 "> ${thread}  </div>

        </div>
    </div>
</div>



          </div>

          
        
          <div class=" modale-${element._id} hidden  flex min-h-full justify-center align px-6 py-12 lg:px-8">


            <div class=" sm:mx-auto sm:w-full sm:max-w-sm">
              <dcommentaire-${element.id}v class="sm:mx-auto sm:w-full sm:max-w-sm">

                <div class="space-y-6" action="#" method="POST">
                  

                  <div>
                    <div class="flex items-center justify-between">
                      <label for="picture"
                       class="block text-sm font-medium leading-6 text-gray-900"
                        >Picture</label
                      >
                    </div>
                    <div class="mt-2">
                      <input
                        name="picture"
                        type="file"
                        required
                        value = ""
                        class=" block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 indent-3 picture-${element._id}"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium leading-6 text-gray-900"
                      >comment</label
                    >
                    <div class="mt-2">
                      <input
                        type="text"
                        required,
                        value = "${element.comment}"
                        placeholder="Marque model"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 indent-3 comment-${element._id}"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      onclick="getUpdatePost('${element._id}')"
                      class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                    Update
                    </button>
                  </div>
                </div>
            </div>
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

async function deletePost(postId) {
  let jwt = window.localStorage.getItem("jwt");

  console.log(postId);

  let request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ _id: postId }),
  };
  console.log("builded");

  let apiRequest = await fetch("http://localhost:3007/adminDelete", request);
  let response = await apiRequest.json();
  console.log(response);

  getAllPost();
}

async function searchProfile() {
  let profile = document.querySelector(".profile");
  let search = document.querySelector(".search").value;
  profile.innerHTML = "";

  let find = {
    user: search,
  };

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(find),
  };

  const apiRequest = await fetch(
    "http://localhost:3007/searchProfile",
    request
  );

  let response = await apiRequest.json();

  console.log(response);

  response.forEach((element) => {
    profile.innerHTML += `            <div class="flex flex-row items-center "> <div class="mr-4 w-12 h-12 rounded-full overflow-hidden border-2 dark:border-white border-gray-900">
            <img src="http://localhost:3007/imageFile/${element.picture}" alt="" class="w-full h-full object-cover">
          </div>
            <h3 class="m-3 font-bold text-lg">${element.pseudo}</h3>
            <h3 class="m-3 font-bold text-lg">${element.email}</h3>
            <h3 class="m-3 font-bold text-lg">Is active: ${element.isActive}</h3>
            

            
            <div class="p-6 flex flex-col flex-1">

            </div>
            
            <div class="flex flex-row justify-center mx-2 flex-wrap" >
                                        <button onclick="disableUser('${element.id_user}')" class="mx-2  w-1/10  flex  justify-center rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                Disable user
              </button>
            </div>`;
  });
}

async function disableUser(userId) {
  let request = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ id_user: userId }),
  };

  let apiRequest = await fetch("http://localhost:3007/userDisable", request);
  let response = await apiRequest.json();
  console.log(response);

  window.location.reload();
}

getAllPost();
