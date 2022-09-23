const gameBoard = (() => {
  const
    board = [
      [0,1,0],
      [1,2,2],
      [0,1,2],
    ],
    //lines
    line1 = document.querySelector(".line.l1"),
    line2 = document.querySelector(".line.l2"),
    line3 = document.querySelector(".line.l3"),
    line4 = document.querySelector(".line.l4"),
    //play area spaces
    cell00 = document.querySelector(".c1"),
    cell01 = document.querySelector(".c2"),
    cell02 = document.querySelector(".c3"),
    cell10 = document.querySelector(".c4"),
    cell11 = document.querySelector(".c5"),
    cell12 = document.querySelector(".c6"),
    cell20 = document.querySelector(".c7"),
    cell21 = document.querySelector(".c8"),
    cell22 = document.querySelector(".c9"),
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
      [line1,line2,line3,line4,hand].forEach(line => {
        line.classList.remove("animate")
      });
      setTimeout(() => {
        [line1,line2,line3,line4,hand].forEach(line => {
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
