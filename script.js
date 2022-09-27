//user interface and listeners related
const displayController = (() => {
  
  const lines = document.querySelectorAll(".line");
  const cells = document.querySelectorAll(".cell");
  const Strikethrough = document.querySelectorAll(".Strikethrough");
  //animation related
  const hand = document.querySelector(".hand");
  const pageTurn = document.querySelector(".page-turn");
  //buttons
  const btnStartGame = document.querySelector(".btn-start-game");
  
  const addListeners = () => {
    btnStartGame.addEventListener("click", newMatch);
    hand.addEventListener("animationend", () => {
      hand.classList.remove("animate");
    });
    
    cells.forEach( cell => {
      cell.addEventListener("click", clickCell);
    });
  };
  
  function clickCell() {
    const idx = this.dataset.idx;
    if(gameFlow.board[idx] === 0 && gameFlow.matchStatus()){
      gameFlow.board[idx] = gameFlow.placeMark();
      this.innerText = gameFlow.placeMark();
      gameFlow.turnsMinusOne();
      gameFlow.winConditions();
      gameFlow.swapPlayer();
      if(gameFlow.getTurns() === 0){
        setTimeout(() => {
          newMatch();
        }, 500);
      };
    };
    
  };

  function cellHover(bool){
    if(bool){
      setTimeout(() => {
        cells.forEach(c => c.classList.add("can-play"))
    
      }, 2750);
    } else {
      cells.forEach(c => c.classList.remove("can-play"));
    }
  };

  const newMatch = () => {
    cellHover(true);
    btnStartGame.classList.add("hidden");
    gameFlow.resetTurns();
    
    sound.paper();
    const sndDelay = 600;
    setTimeout(() => {
      sound.draw();
      setTimeout(() => {
        sound.draw();
        setTimeout(() => {
          sound.draw();
          setTimeout(() => {
            sound.draw();
          }, sndDelay);
        }, sndDelay);
      }, sndDelay);
    }, 750);

    pageTurn.classList.remove("animate")
    setTimeout(() => { pageTurn.classList.add("animate") }, 100);
  
    setTimeout(() => {
      [...lines,hand,...Strikethrough].forEach(line => {
        line.classList.remove("animate")
      });
      hand.classList.remove("strikeh1","strikeh2","strikeh3",
        "strikev1","strikev2","strikev3","striked1","striked2");
      //reset game board
      cells.forEach(c => c.innerText = "");
      gameFlow.board.fill(0);
      gameFlow.matchStart();
      
      //random line rotation
      lines[0].style.rotate = `${Math.random()*(3-(-3))+(-3)}deg`; //0
      lines[1].style.rotate = `${Math.random()*(183-177)+177}deg`; //180
      lines[2].style.rotate = `${Math.random()*(93-87)+87}deg`; //90
      lines[3].style.rotate = `${Math.random()*(273-267)+267}deg`; //270

      setTimeout(() => {
        [...lines,hand].forEach(line => {
          line.classList.add("animate");
        });
      }, 100);
    }, 300);
  };

  const strikeLine = (l) => {
    setTimeout(() => {
      sound.draw();
    }, 250); 
    switch (l) {
      case "h1":
        hand.classList.add("strikeh1");
        Strikethrough[0].classList.add("animate");
        break;
      case "h2":
        hand.classList.add("strikeh2");
        Strikethrough[1].classList.add("animate");
        break;
      case "h3":
        hand.classList.add("strikeh3");
        Strikethrough[2].classList.add("animate");
        break;
      case "v1":
        hand.classList.add("strikev1");
        Strikethrough[3].classList.add("animate");
        break;
      case "v2":
        hand.classList.add("strikev2");
        Strikethrough[4].classList.add("animate");
        break;
      case "v3":
        hand.classList.add("strikev3");
        Strikethrough[5].classList.add("animate");
        break;
      case "d1":
        hand.classList.add("striked1");
        Strikethrough[6].classList.add("animate");
        break;
      case "d2":
        hand.classList.add("striked2");
        Strikethrough[7].classList.add("animate");
        break;
        default: //for testing
        const list = ["h1","h2","h3","v1","v2","v3","d1","d2"];
        let idx = 0;
        for(i = 0; i < 8; i++){
          setTimeout(() => {
            hand.classList.add(`strike${list[idx]}`);
            Strikethrough[idx].classList.add("animate");
            idx++;
          }, 1000*(i+1));
        }
        break;
    }
  }
  return { addListeners, strikeLine, newMatch, cellHover };
})();


//manages the game rules
const gameFlow = (() => {
  let gameInProcess = false;
  let playerOneTurn = true;
  let turnsRemaining = 9;
  let board = new Array(9).fill(0);

  function swapPlayer(){
    playerOneTurn = !playerOneTurn;
  }
  function placeMark(){
    if(playerOneTurn) {
      return player1.getMark();
    } else {
      return player2.getMark();
    };
  }
  const matchStart = () => {
    setTimeout(() => {
      gameInProcess = true
    }, 3000);
  };
  const matchEnd = () => gameInProcess = false;
  const matchStatus = () => gameInProcess;
  function winConditions(){
    if(board[0] === board[1] && board[1] === board[2] && board[0] !== 0){
      winGame("h1");
    } else if(board[3] === board[4] && board[4] === board[5] && board[3] !== 0){
      winGame("h2");
    } else if(board[6] === board[7] && board[7] === board[8] && board[6] !== 0){
      winGame("h3");
    } else if(board[0] === board[3] && board[3] === board[6] && board[0] !== 0){
      winGame("v1");
    } else if(board[1] === board[4] && board[4] === board[7] && board[1] !== 0){
      winGame("v2");
    } else if(board[2] === board[5] && board[5] === board[8] && board[2] !== 0){
      winGame("v3");
    } else if(board[0] === board[4] && board[4] === board[8] && board[0] !== 0){
      winGame("d1");
    } else if(board[2] === board[4] && board[4] === board[6] && board[2] !== 0){
      winGame("d2");
    }
  };

  function winGame(pos){
    matchEnd();
    displayController.cellHover(false);
    displayController.strikeLine(pos);
    playerOneTurn ? player1.addScore() : player2.addScore();
    setTimeout(() => {
      displayController.newMatch();
    }, 1000);
    resetTurns();
  };

  const turnsMinusOne = () => turnsRemaining--;
  const getTurns = () => turnsRemaining;
  const resetTurns = () => turnsRemaining = 9;

  return {winConditions, board, swapPlayer, placeMark,
    matchStart, matchEnd, matchStatus, turnsMinusOne, getTurns, resetTurns};
})()


//manage anything audio related
const sound = (() => {
  const paperSnd = document.querySelectorAll(`[data-sound="paper"]`);
  const drawSnd = document.querySelectorAll(`[data-sound="draw"]`);
  
  const paper = () => {
    const randNum = Math.floor(Math.random()*paperSnd.length);
    paperSnd[randNum].play();
  }
  const draw = () => {
    const randNum = Math.floor(Math.random()*drawSnd.length);
    drawSnd[randNum].play();
  }

  return { paper, draw };
})();


//player constructor, name, mark and score
const Player = (name, mark) => {
  let score = 0;

  const getName = () => name ;
  const getMark = () => mark;
  const getScore = () => score;
  const addScore = () => ++score;

  return { getName, getMark, getScore, addScore };
}



//run on start
displayController.addListeners();

const player1 = Player("p1", "X");
const player2 = Player("p2", "O");
