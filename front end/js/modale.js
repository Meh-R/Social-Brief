function modaleCreatePoste() {
  let modaleVar = document.querySelector(`.modaleCreatePost`);
  modaleVar.style.display =
    modaleVar.style.display == "contents" ? "none" : "contents";
}

function modalefunction(element) {
  let modaleVar = document.querySelector(`.modale-${element}`);
  modaleVar.style.display =
    modaleVar.style.display == "contents" ? "none" : "contents";
}
