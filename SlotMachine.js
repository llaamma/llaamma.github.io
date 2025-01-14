class SlotMachine {
  constructor(houseEdge = 0.1) {
    this.houseEdge = houseEdge;
    this.rtp = 1 - houseEdge;
    this.balance = 500; //!initialisiere Geld
    this.teachers = [
      //! Array mit Lehrern mit Bildern, Audios, multipliere und Texte
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
        audio: "./music/i don't wanna be me best part.mp3 ",
        text: "MAGNETO FUCHS",
        multiplier: 2,
      },
      {
        name: "hx05",
        image: "./images/csm_Personal_Hoedl_Josef_b82544fee5.jpg",
        audio: "./music/i don't wanna be me best part.mp3 ",
        text: "HX05 GANG",
        multiplier: 3,
      },
      {
        name: "masswohl",
        image: "./images/masswohl.jpg",
        audio: "./music/i don't wanna be me best part.mp3 ",
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

    //? Zufällige Auswahl von Lehrern
    const outcome = [
      Math.floor(Math.random() * this.teachers.length),
      Math.floor(Math.random() * this.teachers.length),
      Math.floor(Math.random() * this.teachers.length),
    ];
    const reels = outcome.map((index) => this.teachers[index].image); //? Array mit Bildern der Lehrer
    let payout = 0;
    let message = "gschissn gschmissn";
    let audio = null;

    if (outcome[0] === outcome[1] && outcome[1] === outcome[2]) {
      //? checke über leherer gleich
      const teacher = this.teachers[outcome[0]];
      payout = bet * teacher.multiplier * (1 + Math.random()); //? multipliziere den Gewinn
      message = teacher.text;
      audio = teacher.audio;
    } else if (
      //? checke ob 2 Lehrer gleich sind
      outcome[0] === outcome[1] ||
      outcome[1] === outcome[2] ||
      outcome[2] === outcome[0]
    ) {
      payout = bet * (1.5 + Math.random() * 0.5); //? multipliziere den Gewinn
      message = "nicht ganz";
    } else {
      message = "gschissn gschmissn";
    }

    const adjustedPayout = Math.round(payout * this.rtp * 100) / 100; //? runde den Gewinn ab
    this.balance += adjustedPayout;

    return {
      message,
      payout: adjustedPayout,
      reels,
      audio,
      balance: this.balance,
    };
  }

  getBalance() {
    return this.balance;
  }
}

export default SlotMachine;
