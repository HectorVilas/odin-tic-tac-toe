const gameBoard = (() => {
  const
    board = [
      [0,1,0],
      [1,2,2],
      [0,1,2],
    ],
    lines = document.querySelectorAll(".line"),
    cells = document.querySelectorAll(".cell"),
    //animation related
    hand = document.querySelector(".hand"),
    pageTurn = document.querySelector(".page-turn"),
    //buttons
    btnStartGame = document.querySelector(".btn-start-game");
  
  function addListeners(){
    btnStartGame.addEventListener("click", newMatch);
  };
  
  function newMatch(){
    pageTurn.classList.remove("animate")
    setTimeout(() => { pageTurn.classList.add("animate") }, 100);
  
    setTimeout(() => {
      [...lines,hand].forEach(line => {
        line.classList.remove("animate")
      });
      setTimeout(() => {
        [...lines,hand].forEach(line => {
          line.classList.add("animate")
        });
      }, 100);
    }, 300);
  };

  function placeSymbols(){
    
  }
  
  return { addListeners, placeSymbols }
})();



//run on start
gameBoard.addListeners();
