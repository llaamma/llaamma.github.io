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
  const initialImages = slotMachine.reelStates.map((reel) =>
    reel.map((index) => slotMachine.teachers[index].image)
  );
  updateReel(initialImages);
});

//? Initialisierung der Variablen
const slotMachine = new SlotMachine();

const spinBtn = document.getElementById("spin");
const balanceDisplay = document.getElementById("score");
const result = document.getElementById("result");
const autospin = document.getElementById("autospin");
var currentAudio = null;
var autoSpinInterval = null;

//? Funktion zum aktualisieren der Reels
function updateReel(reelImages) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const reel = document.getElementById(
        `reel${i + 1}-${j === 0 ? "top" : j === 1 ? "middle" : "bottom"}`
      );
      reel.style.backgroundImage = `url('${reelImages[i][j]}')`;
      reel.style.backgroundSize = "cover";
      reel.style.backgroundPosition = "center";
    }
  }
}

//? Funktion zum stoppen des aktuellen Musik
function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
}

const spin = () => {
  if (spinBtn.disabled || slotMachine.getBalance() <= 10) {
    return;
  }

  stopCurrentAudio();

  spinBtn.disabled = true;
  result.textContent = "Spinning....";
  var audio = new Audio("./music/mixkit-slot-machine-random-wheel-1930.wav");
  audio.play();
  document.querySelectorAll(".reel").forEach((reel) => {
    if (reel.id.includes("top") || reel.id.includes("bottom")) {
      reel.style.opacity = "0.5";
      reel.style.filter = "brightness(0.7)";
    }
  });

  document.querySelectorAll(".reel").forEach((reel, index) => {
    setTimeout(() => {
      reel.classList.remove("stopping");
      reel.classList.add("spinning");
    }, index * 100);
  });

  const spinResult = slotMachine.spin(10);

  const stopReel = (reelNumber) => {
    const reelPositions = ["top", "middle", "bottom"];
    reelPositions.forEach((pos) => {
      const reel = document.getElementById(`reel${reelNumber}-${pos}`);
      reel.classList.remove("spinning");
      void reel.offsetWidth;
      reel.classList.add("stopping");
    });
    updateReel(spinResult.reelImages);
  };

  setTimeout(() => stopReel(1), 1500);
  setTimeout(() => stopReel(2), 2000);
  setTimeout(() => {
    stopReel(3);

    result.textContent = spinResult.message;
    balanceDisplay.textContent = `Balance: €${spinResult.balance.toFixed(2)}`;
    setTimeout(() => {
      if (spinResult.audio) {
        stopCurrentAudio();
        currentAudio = new Audio(spinResult.audio.src);
        currentAudio.play();
      }
    }, 300);

    setTimeout(() => {
      spinBtn.disabled = slotMachine.getBalance() <= 10;
    }, 500);
  }, 2500);
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
