const reel1 = document.getElementById("reel1");
const reel2 = document.getElementById("reel2");
const reel3 = document.getElementById("reel3");
const spinBtn = document.getElementById("spin");
const displayScore = document.getElementById("score");
const result = document.getElementById("result");
const autospin = document.getElementById("autospin");
let currentAudio = null;
let score = 100;
let autoSpinInterval = null;

const images = [
  "./images/csm_Droegsler_d0469e0697.png",
  "./images/csm_Fuchs_Harald_bf3d5a4181.jpg",
  "./images/csm_Personal_Hoedl_Josef_b82544fee5.jpg",
  "./images/csm_Personal_Matschir_Michael_1a719685e0.jpg",
  "./images/csm_Personal_Pein_Markus_2972cb20f7.jpg",
  "./images/masswohl.jpg",
];
const dro = `url("./images/csm_Droegsler_d0469e0697.png")`;

function getRandSymbol() {
  return images[Math.floor(Math.random() * images.length)];
}

function updateReel(reel) {
  reel.style.backgroundImage = `url('${getRandSymbol()}')`;
  reel.style.backgroundSize = "cover";
  reel.style.backgroundPosition = "center";
}
function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
}

const spin = () => {
  stopCurrentAudio();
  if (score < 10) {
    result.textContent = "You outta money";
    return;
  }

  score -= 10;
  displayScore.textContent = `Score: ${score}`;
  spinBtn.disabled = true;
  result.textContent = "Spinning...";

  let spins = 0;
  const spinInterval = setInterval(() => {
    updateReel(reel1);
    updateReel(reel2);
    updateReel(reel3);
    spins++;

    if (spins >= 20) {
      clearInterval(spinInterval);
      checkResult();
      spinBtn.disabled = false;
    }
  }, 100);
};

const checkResult = () => {
  const symbols = [
    reel1.style.backgroundImage,
    reel2.style.backgroundImage,
    reel3.style.backgroundImage,
  ];

  console.log("Symbols:", symbols);
  if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
    if (symbols[0] === dro && symbols[1] === dro && symbols[2] === dro) {
      //? plays specific audio when the reels are all dro_pic
      currentAudio = new Audio("./synthesized_audio.mp3");
      currentAudio.play();

      result.textContent = "DröDrö";
      score += 200;
    } else {
      result.textContent = "Gewonnen!";
      score += 100;
      currentAudio = new Audio("./i don't wanna be me best part.mp3");
      currentAudio.play();
    }
  } else if (
    symbols[0] === symbols[1] ||
    symbols[1] === symbols[2] ||
    symbols[2] === symbols[0]
  ) {
    result.textContent = "Nicht alle, aber fast!";
    score += 20;
  } else {
    result.textContent = "verloren!";
  }
  displayScore.textContent = `Score: ${score}`;
};

const startAuto = () => {
  if (autoSpinInterval) {
    stopAutoSpin();
  } else {
    autoSpinInterval = setInterval(spin, 1000);
    autospin.textContent = "Stop Auto Spin";
  }
};

const stopAutoSpin = () => {
  clearInterval(autoSpinInterval);
  autoSpinInterval = null;
  autospin.textContent = "Start Auto Spin";
};

spinBtn.addEventListener("click", spin);
autospin.addEventListener("click", startAuto);
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    spin();
  }
});

updateReel(reel1);
updateReel(reel2);
updateReel(reel3);
