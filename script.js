//user interface and listeners related
const displayController = (() => {
  
  const lines = document.querySelectorAll(".line");
  const cells = document.querySelectorAll(".cell");
  const Strikethrough = document.querySelectorAll(".Strikethrough");
  const symbolX1 = document.querySelectorAll(".x1");
  const symbolX2 = document.querySelectorAll(".x2");
  const circles = document.querySelectorAll(".circle");
  //animation related
  const handP1 = document.querySelector(".hand.player1");
  const handP2 = document.querySelector(".hand.player2");
  const pageTurn = document.querySelector(".page-turn");
  //buttons
  const btnStartGame = document.querySelector(".btn-start-game");
  
  const addListeners = () => {
    btnStartGame.addEventListener("click", newMatch);
    handP1.addEventListener("animationend", () => {
      handP1.className = "hand player1"; //remove all anim classes except this one
    });
    handP2.addEventListener("animationend", () => {
      handP2.className = "hand player2"; //remove all anim classes except this one
    });
    
    cells.forEach( cell => {
      cell.addEventListener("click", clickCell);
    });
  };
  
  function clickCell() {
    const idx = this.dataset.idx;
    if(gameFlow.board[idx] === 0 && gameFlow.matchStatus()){
      gameFlow.playDelay();
      gameFlow.board[idx] = gameFlow.placeMark();
      // this.innerText = gameFlow.placeMark();
      drawSymbol(idx);
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
    
      }, 3000);
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
      //reset game board
      [...lines,...Strikethrough,...symbolX1,
        ...symbolX2,...circles].forEach(line => {
        line.classList.remove("animate")
      });
      gameFlow.board.fill(0);
      gameFlow.matchStart();
      
      //random line rotation
      lines[0].style.rotate = `${Math.random()*(3-(-3))+(-3)}deg`; //0
      lines[1].style.rotate = `${Math.random()*(183-177)+177}deg`; //180
      lines[2].style.rotate = `${Math.random()*(93-87)+87}deg`; //90
      lines[3].style.rotate = `${Math.random()*(273-267)+267}deg`; //270

      setTimeout(() => {
        [...lines,handP1].forEach(line => {
          line.classList.add("animate");
        });
      }, 100);
    }, 300);
  };

  const strikeLine = (l) => {
    const line = (l, i) => {
      handP1.classList.add(`strike${l}`);
      Strikethrough[i].classList.add("animate");
      setTimeout(() => {
        sound.draw();
      }, 250); 
    }
    l === "h1" ? line(l, 0) :
    l === "h2" ? line(l, 1) :
    l === "h3" ? line(l, 2) :
    l === "v1" ? line(l, 3) :
    l === "v2" ? line(l, 4) :
    l === "v3" ? line(l, 5) :
    l === "d1" ? line(l, 6) :
    l === "d2" ? line(l, 7) :
    console.log("Strikethrough invalid value");
  }

  const drawSymbol = (pos) => {
    if(gameFlow.getCurrentPlayer()){ // draws X
      handP1.classList.add(`x${pos}`);
      symbolX1[pos].classList.add("animate");
      symbolX2[pos].classList.add("animate");
    } else { // draws O
      handP2.classList.add(`o${pos}`);
      circles[pos].classList.add("animate");
    };
  };
  return { addListeners, strikeLine, newMatch, cellHover, drawSymbol };
})();


//manages the game rules
const gameFlow = (() => {
  let gameInProcess = false;
  let playerOneTurn = true;
  let turnsRemaining = 9;
  let gameOver = false;
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
      gameInProcess = true;
      gameOver = false;
    }, 3000);
  };
  const matchEnd = () => {
    gameOver = true;
    gameInProcess = false
  };
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
    board.fill(0); //prevents adding extra points while animations plays
    setTimeout(() => {
      displayController.cellHover(false);
      displayController.strikeLine(pos);
      playerOneTurn ? player1.addScore() : player2.addScore();
      setTimeout(() => {
        displayController.newMatch();
      }, 1000);
      resetTurns();
    }, 1200);
  };

  const turnsMinusOne = () => turnsRemaining--;
  const getTurns = () => turnsRemaining;
  const resetTurns = () => {turnsRemaining = 9; displayController.cellHover(false)};
  const getCurrentPlayer = () => playerOneTurn;
  const playDelay = () => {
    gameInProcess = false;
    displayController.cellHover(false);
    setTimeout(() => {
      if(!gameOver) {
        gameInProcess = true;
      }
      displayController.cellHover(true);
    }, 1000);
  };

  return {winConditions, board, swapPlayer, placeMark, getCurrentPlayer,
    matchStart, matchEnd, matchStatus, turnsMinusOne, getTurns, resetTurns,
    playDelay};
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



//for testing

//get left and top percentages for board on click position
const board = document.querySelector(".board");
board.addEventListener("click", (e) => {
  console.log(
    Math.floor((e.clientX - board.offsetLeft) * 100 / board.clientWidth),
    Math.floor((e.clientY-board.offsetTop) * 100 / board.clientHeight)
  );
})