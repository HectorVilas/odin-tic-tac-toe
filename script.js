const gameBoard = (() => {
  let playerOneTurn = true;
  let board = new Array(9).fill(0);
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
        if(board[i] === 0){
          let num;
          playerOneTurn ? num = 1 : num = 2;
          board[i] = num;
          cell.innerText = num;
          playerOneTurn = !playerOneTurn;
          console.log(board);
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
      board.fill(0);
      playerOneTurn = true;

      setTimeout(() => {
        [...lines,hand].forEach(line => {
          line.classList.add("animate")
        });
      }, 100);
    }, 300);
  };

  return { addListeners }
})();



//run on start
gameBoard.addListeners();
