import SlotMachine from "./SlotMachine.js";

//! alter überprüft und
document.addEventListener("DOMContentLoaded", () => {
  const over = document.getElementById("over");
  const ageVerification = document.getElementById("ageVerification");
  const mainContent = document.getElementById("mainContent");

  //? Eventlistener für das Klicken auf den Button
  over.addEventListener("click", () => {
    ageVerification.style.display = "none";
    mainContent.style.display = "block";
  });
});

//? Initialisierung der Variablen
const slotMachine = new SlotMachine();
const reel1 = document.getElementById("reel1");
const reel2 = document.getElementById("reel2");
const reel3 = document.getElementById("reel3");
const spinBtn = document.getElementById("spin");
const balanceDisplay = document.getElementById("score");
const result = document.getElementById("result");
const autospin = document.getElementById("autospin");
var currentAudio = null;
var autoSpinInterval = null;

//? Funktion zum aktualisieren der Reels
function updateReel(reelImages) {
  [reel1, reel2, reel3].forEach((reel, index) => {
    reel.style.backgroundImage = `url('${reelImages[index]}')`;
    reel.style.backgroundSize = "cover";
    reel.style.backgroundPosition = "center";
  });
}

//? Funktion zum stoppen des aktuellen Musik
function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
}

//? Funktionen zum drehen des Slots
const spin = () => {
  if (spinBtn.disabled || slotMachine.getBalance() <= 10) {
    return;
  }

  stopCurrentAudio();
  spinBtn.disabled = true;
  result.textContent = "Spinning....";

  [reel1, reel2, reel3].forEach((reel) => {
    reel.classList.add("spinning");
  });

  const spinResult = slotMachine.spin(10);

  setTimeout(() => {
    reel1.classList.remove("spinning");
    reel1.classList.add("stopping");
    reel1.style.backgroundImage = `url('${spinResult.reels[0]}')`;
  }, 1500);

  setTimeout(() => {
    reel2.classList.remove("spinning");
    reel2.classList.add("stopping");
    reel2.style.backgroundImage = `url('${spinResult.reels[1]}')`;
  }, 2300);

  setTimeout(() => {
    reel3.classList.remove("spinning");
    reel3.classList.add("stopping");
    reel3.style.backgroundImage = `url('${spinResult.reels[2]}')`;

    setTimeout(() => {
      [reel1, reel2, reel3].forEach((reel) => {
        reel.classList.remove("stopping");
      });

      result.textContent = spinResult.message;
      balanceDisplay.textContent = `Balance: €${spinResult.balance.toFixed(2)}`;

      //? spiele musik
      if (spinResult.audio) {
        currentAudio = new Audio(spinResult.audio);
        currentAudio.play();
      }

      spinBtn.disabled = slotMachine.getBalance() < 10;
    }, 500);
  }, 2700);
};

//? Funktion zum starten des Auto Spins
const startAuto = () => {
  if (autoSpinInterval) {
    stopAutoSpin();
  } else {
    autoSpinInterval = setInterval(spin, 3000);
    autospin.textContent = "Stop Auto Spin";
  }
};

//? Funktion zum stoppen des Auto Spins
const stopAutoSpin = () => {
  clearInterval(autoSpinInterval);
  autoSpinInterval = null;
  autospin.textContent = "Start Auto Spin";
};

//? Eventlistener für das Klicken auf den Button
spinBtn.addEventListener("click", spin);
autospin.addEventListener("click", startAuto);
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "Space":
      event.preventDefault();
      spin();
      break;
    case "F1":
      event.preventDefault();
      window.location.href = "/help.html";
      break;
  }
});

updateReel(slotMachine.teachers.slice(0, 3).map((teacher) => teacher.image)); //? Initialisierung der Reels
balanceDisplay.textContent = `Balance: €${slotMachine.getBalance().toFixed(2)}`; //? Initialisierung des Balances
