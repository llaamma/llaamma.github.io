import SlotMachine from "./slotMachine";

const slotMachine = new SlotMachine();
const reel1 = document.getElementById("reel1");
const reel2 = document.getElementById("reel2");
const reel3 = document.getElementById("reel3");
const spinBtn = document.getElementById("spin");
const balanceDisplay = document.getElementById("score");
const result = document.getElementById("result");
const autospin = document.getElementById("autospin");
let currentAudio = null;
let autoSpinInterval = null;

function updateReel(reelImages) {
  [reel1, reel2, reel3].forEach((reel, index) => {
    reel.style.backgroundImage = `url('${reelImages[index]}')`;
    reel.style.backgroundSize = "cover";
    reel.style.backgroundPosition = "center";
  });
}

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

  [reel1, reel2, reel3].forEach((reel) => {
    reel.style.transition = `spinReel 500ms linear infinite`;
    reel.classList.add("spinning");
  });

  let spins = 0;
  const spinInterval = setInterval(() => {
    const randomReels = slotMachine.teachers.map((teacher) => teacher.image);
    updateReel(randomReels.sort(() => Math.random() - 0.5));
    spins++;

    if (spins >= 10) {
      clearInterval(spinInterval);
      const spinResult = slotMachine.spin(10);

      [reel1, reel2, reel3].forEach((reel, index) => {
        reel.classList.remove("spinning");
        reel.style.backgroundImage = `url('${spinResult.reels[index]}')`;
      });

      result.textContent = spinResult.message;
      balanceDisplay.textContent = `Balance: €${spinResult.balance.toFixed(2)}`;

      if (spinResult.audio) {
        currentAudio = new Audio(spinResult.audio);
        currentAudio.play();
      }
      spinBtn.disabled = slotMachine.getBalance() < 10;
    }
  }, 1000);
};

const startAuto = () => {
  if (autoSpinInterval) {
    stopAutoSpin();
  } else {
    autoSpinInterval = setInterval(spin, 3000);
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

updateReel(slotMachine.teachers.slice(0, 3).map((teacher) => teacher.image));
balanceDisplay.textContent = `Balance: €${slotMachine.getBalance().toFixed(2)}`;
