const spinBtn = document.getElementById("spin");

class SlotMachine {
  constructor(houseEdge = 0.1) {
    this.houseEdge = houseEdge;
    this.rtp = 1 - houseEdge;
    this.balance = 500;
    this.teachers = [
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
        audio: " ",
        text: "MAGNETO FUCHS",
        multiplier: 2,
      },
      {
        name: "hx05",
        image: "./images/csm_Personal_Hoedl_Josef_b82544fee5.jpg",
        audio: " ",
        text: "HX05 GANG",
        multiplier: 3,
      },
      {
        name: "masswohl",
        image: "./images/masswohl.jpg",
        audio: " ",
        text: "MJ the GOAT",
        multiplier: 2,
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
        audio: "",
        text: "Liegesützen Markus",
        multiplier: 2,
      },
    ];
  }

  spin(bet) {
    if (this.balance < bet) {
      return {
        message: "hamma kein geld ha?",
        payout: 0,
        balance: this.balance,
      };
    }
    this.balance -= bet;

    const outcome = [
      Math.floor(Math.random() * this.teachers.length),
      Math.floor(Math.random() * this.teachers.length),
      Math.floor(Math.random() * this.teachers.length),
    ];
    const reels = outcome.map((index) => this.teachers[index].image);
    let payout = 0;
    let message = "gschissn gschmissn";
    let audio = null;

    if (outcome[0] === outcome[1] && outcome[1] === outcome[2]) {
      const teacher = this.teachers[outcome[0]];
      payout = bet * teacher.multiplier * (1 + Math.random());
      message = teacher.text;
      audio = teacher.audio;
    } else if (
      outcome[0] === outcome[1] ||
      outcome[1] === outcome[2] ||
      outcome[2] === outcome[0]
    ) {
      payout = bet * (1.5 + Math.random() * 0.5);
      message = "nicht ganz";
    } else {
      message = "gschissn gschmissn";
    }

    const adjustedPayout = Math.round(payout * this.rtp * 100) / 100;
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
