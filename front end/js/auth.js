async function insertUser() {
  let picture = document.querySelector(".picture");
  let pseudo = document.querySelector(".pseudo").value;
  let email = document.querySelector(".email").value;
  let password = document.querySelector(".password").value;

  const formData = new FormData();

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
    // window.location.href = "./login.html";
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

  let apiRequest = fetch("http://localhost:3001/user/login", request);
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
