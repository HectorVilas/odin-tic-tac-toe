const displayController = (() => {
  const
    line1 = document.querySelector(".line.l1"),
    line2 = document.querySelector(".line.l2"),
    line3 = document.querySelector(".line.l3"),
    line4 = document.querySelector(".line.l4"),
    hand = document.querySelector(".hand"),
    btnStartGame = document.querySelector(".btn-start-game"),
    pageTurn = document.querySelector(".page-turn");
  
  function addListeners(){
    btnStartGame.addEventListener("click", newMatch);
  };
  
  
  function newMatch(){
    pageTurn.classList.remove("animate")
    setTimeout(() => {
      pageTurn.classList.add("animate")
      
    }, 100);
  
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
    // btnStartGame.classList.add("hidden");
  };
  
  return {addListeners}
})();

//run on start
displayController.addListeners();
