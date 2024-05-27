handleClick = () => {
  let icon = document.getElementById("chevronDown1");
  let icon2 = document.getElementById("chevronUp1");
  let menu = document.getElementById("menu1");

  menu.classList.toggle("hidden");
  icon.classList.toggle("hidden");
  icon2.classList.toggle("hidden");
};
