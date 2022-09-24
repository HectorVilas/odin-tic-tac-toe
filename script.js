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
    
    cells.forEach((cell, i) => {
      cell.addEventListener("click", () => {
        if(gameFlow.board[i] === 0){
          gameFlow.board[i] = gameFlow.placeSymbol();
          cell.innerText = gameFlow.placeSymbol();
          gameFlow.winConditions();
          gameFlow.swapPlayer();
        };
      });
    });
  };
  
  const newMatch = () => {
    pageTurn.classList.remove("animate")
    setTimeout(() => { pageTurn.classList.add("animate") }, 100);
  
    setTimeout(() => {
      [...lines,hand].forEach(line => {
        line.classList.remove("animate")
      });
      //reset game board
      cells.forEach(c => c.innerText = "");
      gameFlow.board.fill(0);
      // gameFlow.playerOneTurn = true;

      setTimeout(() => {
        [...lines,hand].forEach(line => {
          line.classList.add("animate");
        });
      }, 100);
    }, 300);
  };

  return { addListeners };
})();

const gameFlow = (() => {
  let playerOneTurn = true;
  let board = new Array(9).fill(0);

  function swapPlayer(){
    playerOneTurn = !playerOneTurn;
  }
  function placeSymbol(){
    if(playerOneTurn) {
      return 1;
    } else {
      return 2;
    };
    
  }
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
      let winner;
      playerOneTurn ? winner = "player 1" : winner = "player 2";
      console.log(`${winner} wins! Flawless victory.`);
    }
  };
  
  return {winConditions, board, swapPlayer, placeSymbol};
})()


//run on start
displayController.addListeners();
