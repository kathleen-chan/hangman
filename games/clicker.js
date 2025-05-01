const scoreBox = document.getElementById("points");
const flavorBox = document.getElementById("flavor");
const clickImage = document.getElementById("clickImage");
scoreBox.style.display = "block";
let points = 0;
let start = false;

//help i cant figure out how to add upgrades ashdhfn
function clickStart() {
    flavorBox.textContent = ``;
    start = true;
    points++;
//    clickImage.removeEventListener("click", clickStart);
    scoreBox.textContent = `Points: ${points}`;
}




function friend() {
    points++;
    points++;
    scoreBox.textContent = `Points: ${points}`;
}

clickImage.addEventListener("click", clickStart);
if (points > 20) {
    clickImage.addEventListener("click", friend);
}
scoreBox.textContent = "Points: 0";


