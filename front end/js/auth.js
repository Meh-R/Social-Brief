async function insertUser() {
  let picture = document.querySelector(".picture");
  let pseudo = document.querySelector(".pseudo").value;
  let email = document.querySelector(".email").value;
  let password = document.querySelector(".password").value;

  const formData = new FormData();

  console.log(picture);
  console.log(pseudo);

  formData.append("image", picture.files[0]);
  formData.append("pseudo", pseudo);
  formData.append("email", email);
  formData.append("password", password);

  let request = {
    method: "POST",
    body: formData,
  };

  const response = await fetch("http://localhost:3007/addUser", request);

  let data = await response.json();

  if (response.status === 201) {
    window.alert("A validation e-mail has been sent to you");
  } else if (response.status === 400) {
    window.alert("pseudo or email already exist");
  }
}

async function handleLogin() {
  let email = document.querySelector(".email").value;
  let password = document.querySelector(".password").value;

  let user = {
    email: email,
    password: password,
  };

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(user),
  };

  let apiRequest = fetch("http://localhost:3007/login", request);
  let response = await apiRequest;
  let data = await response.json();

  if (response.status === 200) {
    let jwt = data.jwt;
    window.localStorage.setItem("jwt", jwt);
    let role = data.role;

    setTimeout(() => {
      if (role === "admin") {
        window.location.href = "../Views/admin.html";
      } else if (role === "user") {
        window.location.href = "../Views/user.html";
      }
    }, 1000);
  } else {
  }
}

async function recoveryMessage() {
  let email = document.querySelector(".email").value;

  let user = {
    email: email,
  };

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(user),
  };

  const response = await fetch("http://localhost:3007/sendRecovery", request);

  let data = await response.json();

  if (response.status === 201) {
    window.alert("A e-mail has been sent to you");
  }
}

async function validNewpassword() {
  let newPassword = document.querySelector(".newPassword").value;
  let confirmPassword = document.querySelector(".confirmPassword").value;
  let params = new URLSearchParams(window.location.search);
  let token = params.get("token");

  let password = {
    newPassword: newPassword,
    confirmPassword: confirmPassword,
    token: token,
  };

  let request = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(password),
  };

  const apiRequest = await fetch("http://localhost:3007/newPassword", request);
  let response = await apiRequest.json();

  console.log(apiRequest.status);

  if (apiRequest.status === 200) {
    console.log("tutu");
    window.location.href = "../Views/login.html";
  } else {
  }
}

function verifName(event) {
  let errorText = document.querySelectorAll(".error-text");
  let pseudo = document.getElementById("pseudo");
  let mail = document.getElementById("email");
  let picture = document.getElementById("picture");
  let password = document.getElementById("password");

  let regex = new RegExp(/^[A-Za-z]{2,13}$/);

  let regexMail = new RegExp(
    /^([a-z0-9]{2,13})@([a-z0-9]{2,13})([\.]{1})([a-z0-9]{2,13})$/
  );

  let regexFile =
    /^([a-zA-Z0-9\s_\.\-\(\):])+\.((jpeg|jpg|png|gif|avif|svg|webp|webm))$/;

  let regexPassword =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  if (pseudo.value === "") {
    errorText[0].innerHTML = `rentre ton prénom`;
    pseudo.style.border = "2px solid red";
  } else if (regex.test(pseudo.value)) {
    errorText[0].innerHTML = `ca fonctionne`;
  } else {
    errorText[0].innerHTML = `Votre prénom doit étre compris entre 2 et 13 lettres`;
    pseudo.style.border = "2px solid red";
  }

  if (picture.files[0] === undefined) {
    errorText[1].innerHTML = `pas de fichier image`;
    picture.style.border = "2px solid red";
  } else if (regexFile.test(picture.files[0].name)) {
    errorText[1].innerHTML = `ca fonctionne`;
  } else {
    errorText[1].innerHTML = `vous devez inserez un fichier jpeg, jpg, png, gif, avif, svg, webp, webm`;
    picture.style.border = "2px solid red";
  }

  if (mail.value === "") {
    errorText[2].innerHTML = `rentre ton email`;
    mail.style.border = "2px solid red";
  } else if (regexMail.test(mail.value)) {
    errorText[2].innerHTML = `ca fonctionne`;
    mail.style.border = "1px solid black";
  } else {
    errorText[2].innerHTML = `ceci n'est pas une adresse mail `;
    mail.style.border = "2px solid red";
  }

  if (password.value === "") {
    errorText[3].innerHTML = `pas de password`;
    password.style.border = "2px solid red";
  } else if (regexPassword.test(password.value)) {
    errorText[3].innerHTML = `ca fonctionne`;
    password.style.border = "1px solid black";
  } else {
    errorText[3].innerHTML = `le password doit contenir 8 caractère min 1 majuscule, 1 minuscule, 1 caractére spécial et 1 chiffre `;
    password.style.border = "2px solid red";
  }
}

async function onchangePseudo() {
  let search = document.getElementById("pseudo").value;

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

  if (apiRequest.status === 200) {
    let pseudo = document.getElementById("pseudo");
    let errorText = document.querySelectorAll(".error-text2");
    errorText[0].innerHTML = `Ce pseudo existe deja ou ne doit contenir que des lettres 4 caractères min`;
    pseudo.style.border = "2px solid red";
  } else if (apiRequest.status === 500) {
    let pseudo = document.getElementById("pseudo");
    let errorText = document.querySelectorAll(".error-text2");
    errorText[0].innerHTML = `pseudo disponible`;
    pseudo.style.border = "2px solid grey";
  }
}
