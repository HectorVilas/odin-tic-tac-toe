const
  line1 = document.querySelector(".line.l1"),
  line2 = document.querySelector(".line.l2"),
  line3 = document.querySelector(".line.l3"),
  line4 = document.querySelector(".line.l4"),
  hand = document.querySelector(".hand"),
  btnStartGame = document.querySelector(".btn-start-game"),
  pageTurn = document.querySelector(".page-turn");

  btnStartGame.addEventListener("click", () => {
  pageTurn.classList.add("animate");
  btnStartGame.classList.add("hidden");
});

pageTurn.addEventListener("transitionend", (e) => {
  if(e.propertyName === "left"){
    [line1,line2,line3,line4,hand,].forEach(line => {
      line.classList.add("animate")
    });
  };
});
