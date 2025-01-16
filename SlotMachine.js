class SlotMachine {
  constructor(houseEdge = 0.1) {
    this.houseEdge = houseEdge;
    this.rtp = 1 - houseEdge;
    this.balance = 500; //?initialisiere Geld
    this.teachers = [
      //! add better songs for each teacher, spinning music, payment system also needs rework
      {
        name: "Dro",
        image: "./images/csm_Droegsler_d0469e0697.png",
        audio: "./synthesized_audio.mp3",
        text: "DroDro",
        multiplier: 5,
      },
      {
        name: "Fuchs",
        image: "./images/csm_Fuchs_Harald_bf3d5a4181.jpg",
        audio: "./music/i don't wanna be me best part.mp3",
        text: "MAGNETO FUCHS",
        multiplier: 2,
      },
      {
        name: "hx05",
        image: "./images/csm_Personal_Hoedl_Josef_b82544fee5.jpg",
        audio: "./music/i don't wanna be me best part.mp3",
        text: "HX05 GANG",
        multiplier: 3,
      },
      {
        name: "masswohl",
        image: "./images/masswohl.jpg",
        audio: "./music/i don't wanna be me best part.mp3",
        text: "maswohl",
        multiplier: 1.5,
      },
      {
        name: "Grabner",
        image: "./images/csm_Personal_Matschir_Michael_1a719685e0.jpg",
        audio: "./music/50Cent - P.I.M.P..mp3",
        text: "Michael G",
        multiplier: 2,
      },
      {
        name: "Pein",
        image: "./images/csm_Personal_Pein_Markus_2972cb20f7.jpg",
        audio: "./music/50Cent - P.I.M.P..mp3",
        text: "Liegestützen Markus",
        multiplier: 2,
      },
    ];

    this.reelStates = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    this.randomizeReels();
  }

  randomizeReels() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.reelStates[i][j] = Math.floor(
          Math.random() * this.teachers.length
        );
      }
    }
  }

  //? Funktion zum drehen des Slots
  spin(bet) {
    if (this.balance < bet) {
      //? überprüfe ob genug Geld vorhanden ist
      return {
        message: "hamma kein geld ha?",
        payout: 0,
        balance: this.balance,
      };
    }
    this.balance -= bet;
    this.randomizeReels();
    //? Zufällige Auswahl von Lehrern

    const middleRow = this.reelStates.map((reel) => reel[1]);
    const reelImages = this.getCurrentImages();

    let payout = 0;
    let message = "gschissn gschmissn";
    let audio = null;

    if (middleRow[0] === middleRow[1] && middleRow[1] === middleRow[2]) {
      //? checke über leherer gleich
      const teacher = this.teachers[middleRow[0]];
      payout = bet * teacher.multiplier * (1 + Math.random()); //? multipliziere den Gewinn
      message = teacher.text;
      audio = teacher.audio;
      // reel.classList.add("won");  //!add effect when won something
    } else if (
      //? checke ob 2 Lehrer gleich sind
      middleRow[0] === middleRow[1] ||
      middleRow[1] === middleRow[2] ||
      middleRow[2] === middleRow[0]
    ) {
      payout = bet * (1.5 + Math.random() * 0.5); //? multipliziere den Gewinn
      message = "nicht ganz";
      // reel.classList.add("won");
    } else {
      message = "gschissn gschmissn";
    }

    const adjustedPayout = Math.round(payout * this.rtp * 100) / 100; //? runde den Gewinn ab
    this.balance += adjustedPayout;

    return {
      message,
      payout: adjustedPayout,
      reelImages,
      audio,
      balance: this.balance,
    };
  }

  getCurrentImages() {
    return this.reelStates.map((reel) => {
      return reel.map((index) => this.teachers[index].image);
    });
  }

  getBalance() {
    return this.balance;
  }
}

export default SlotMachine;
