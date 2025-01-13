import SlotMachine from "./slotMachine";

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
    //? drehen der Reels
    reel.style.transition = `spinReel 500ms linear infinite`;
    reel.classList.add("spinning");
  });

  let spins = 0;
  const spinInterval = setInterval(() => {
    const randomReels = slotMachine.teachers.map((teacher) => teacher.image); //? Zufällige Auswahl von Lehrern
    updateReel(randomReels.sort(() => Math.random() - 0.5)); //? Sortieren der Lehrer
    spins++;

    //? Überprüfung ob genug gedreht wurde
    if (spins >= 10) {
      clearInterval(spinInterval);
      const spinResult = slotMachine.spin(10);

      [reel1, reel2, reel3].forEach((reel, index) => {
        //? Drehen der Reels
        reel.classList.remove("spinning"); //? Entfernen des Spinning Effekts
        reel.style.backgroundImage = `url('${spinResult.reels[index]}')`; //? Anzeigen der Lehrer
      });

      result.textContent = spinResult.message;
      balanceDisplay.textContent = `Balance: €${spinResult.balance.toFixed(2)}`;

      if (spinResult.audio) {
        //? Abspielen der Musik
        currentAudio = new Audio(spinResult.audio);
        currentAudio.play();
      }
      spinBtn.disabled = slotMachine.getBalance() < 10;
    }
  }, 200);
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
