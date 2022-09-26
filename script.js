//user interface and listeners related
const displayController = (() => {
  
  const lines = document.querySelectorAll(".line");
  const cells = document.querySelectorAll(".cell");
  //animation related
  const hand = document.querySelector(".hand");
  const pageTurn = document.querySelector(".page-turn");
  //buttons
  const btnStartGame = document.querySelector(".btn-start-game");
  
  const addListeners = () => {
    btnStartGame.addEventListener("click", newMatch);
    
    cells.forEach( cell => {
      cell.addEventListener("click", clickCell);
    });
  };
  
  function clickCell() {
    const idx = this.dataset.idx;
    if(gameFlow.board[idx] === 0 && gameFlow.matchStatus()){
      gameFlow.board[idx] = gameFlow.placeMark();
      this.innerText = gameFlow.placeMark();
      gameFlow.winConditions();
      gameFlow.swapPlayer();
    };
  };

  const newMatch = () => {
    
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
      [...lines,hand].forEach(line => {
        line.classList.remove("animate")
      });
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

  return { addListeners };
})();


//manages the game rules
const gameFlow = (() => {
  let gameInProcess = false;
  let playerOneTurn = true;
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
  const matchStart = () => gameInProcess = true;
  const matchEnd = () => gameInProcess = false;
  const matchStatus = () => gameInProcess;
  function winConditions(){
    if(
      //horizontal
      board[0] === board[1] && board[1] === board[2] && board[0] !== 0 ||
      board[3] === board[4] && board[4] === board[5] && board[3] !== 0 ||
      board[6] === board[7] && board[7] === board[8] && board[6] !== 0 ||
      //vertical
      board[0] === board[3] && board[3] === board[6] && board[0] !== 0 ||
      board[1] === board[4] && board[4] === board[7] && board[1] !== 0 ||
      board[2] === board[5] && board[5] === board[8] && board[2] !== 0 ||
      //diagonal
      board[0] === board[4] && board[4] === board[8] && board[0] !== 0 ||
      board[2] === board[4] && board[4] === board[6] && board[2] !== 0 
    ){
      matchEnd();
      let winner;
      if(playerOneTurn){
        winner = player1.getName();
        player1.addWin();
      } else {
        winner = player2.getName();
        player2.addWin();
      };
      console.log(`${winner} wins! Flawless victory.`);
      console.log(`${player1.getName()} score: ${player1.getWin()}`);
      console.log(`${player2.getName()} score: ${player2.getWin()}`);
    }
  };
  
  return {winConditions, board, swapPlayer, placeMark,
    matchStart, matchEnd, matchStatus};
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
  let win = 0;

  const getName = () => name ;
  const getMark = () => mark;
  const getWin = () => win;
  const addWin = () => ++win;

  return { getName, getMark, getWin, addWin };
}



//run on start
displayController.addListeners();

const player1 = Player("p1", "X");
const player2 = Player("p2", "O");