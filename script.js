//user interface and listeners related
const displayController = (() => {
  
  const lines = document.querySelectorAll(".line");
  const cells = document.querySelectorAll(".cell");
  const Strikethrough = document.querySelectorAll(".Strikethrough");
  const symbolX1 = document.querySelectorAll(".x1");
  const symbolX2 = document.querySelectorAll(".x2");
  const circles = document.querySelectorAll(".circle");
  const handP1 = document.querySelector(".hand.player1");
  const handP2 = document.querySelector(".hand.player2");
  const pageTurn = document.querySelector(".page-turn");
  const messages = document.querySelectorAll(".messages");
  const btnStartGame = document.querySelector(".btn-start-game");
  let messageCount = 0;
  let playersTalking = false;
  
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
      talk("played");
      gameFlow.winConditions();
      gameFlow.swapPlayer();
      if(gameFlow.getTurns() === 0 && !gameFlow.winConditions()){
        talk("tie");
        setTimeout(() => {
          newMatch();
        }, 1200);
      };
    };
    
  };

  const newMatch = () => {
    talk("new game");
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
        [...lines,handP1,handP2].forEach(line => {
          line.classList.add("animate");
        });
      }, 100);
    }, 300);
  };

  const strikeLine = (l) => {
    const line = (l, i) => {
      //check which hand must strike a line
      gameFlow.getCurrentPlayer() ? handP2.classList.add(`strike${l}`)
      : handP1.classList.add(`strike${l}`);

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
      setTimeout(() => {
        sound.draw();
        setTimeout(() => {
          sound.draw();
        }, 175);
      }, 250);

    } else { // draws O
      handP2.classList.add(`o${pos}`);
      circles[pos].classList.add("animate");
      setTimeout(() => {
        sound.draw();
      }, 250);
    };
  };

  const talk = (action) => {
    const currentPlayerName = !gameFlow.getCurrentPlayer() ? player2.getName() : player1.getName();
    const theOtherPlayerName = !gameFlow.getCurrentPlayer() ? player1.getName() : player2.getName();
    const chance = Math.floor(Math.random()*100);
    const played = ["Done.", "Your turn.", "Top this!", "Let's try this.",
    "Hmm... here?", "Now you.", "Done, go.", "Here.", "This one."];
    const noMoreTurns = ["Ah, crap.", "Darn.", "A tie.", "Damn.", "Aw.",
    "Let's try again.", "Oh, well.", "Damn, again.", "Welp.", "Ah, heck.",
    "Hmm..."];
    const win = ["Aw, yeah.", `Take that, ${theOtherPlayerName}!`, "Hahaaa!",
    "Hahahaha!", `In yor face, ${theOtherPlayerName}!`, "That was easy.",
    "Heh!", "You know how to play, right?", "See? This is how you play.",
    `You need more practice, ${theOtherPlayerName}`, "Get rekt!"];
    const loserAnswer = [`Oh, screw you, ${currentPlayerName}.`,
    "Time to get serious.", "Now I'm mad.", "Come on, really?",
    `You got lucky, ${currentPlayerName}.`, "Go suck a lemon.",
    "don't celebrate yet."];
    const center = ["Getting the center, huh?", "Come on, That's cheating!",
    "Center, huh?", "Center start is for losers.", "Desperate for win?",
    "Somebody doesn't want to lose."];

    //prevent new dialogues until current event ends
    if(playersTalking) return;

    //dialogues for each play
    if(gameFlow.getTurns() === 8 && gameFlow.board[4] !== 0 ){
      let i = Math.floor(Math.random()*center.length);
      createCard(!gameFlow.getCurrentPlayer(), center[i])
    //a player wins, the loser answers
    }else if(gameFlow.winConditions()) {
      let i = Math.floor(Math.random()*win.length);
      let j = Math.floor(Math.random()*loserAnswer.length);
      createCard(gameFlow.getCurrentPlayer(), win[i]);
      //store the other player before swap, answer for player who loses
      let theOtherPlayer = !gameFlow.getCurrentPlayer(); 
      setTimeout(() => {
        createCard(theOtherPlayer, loserAnswer[j]);
      }, 1000);
    //no more free spaces, a tie
    } else if(action === "tie"){
      let i = Math.floor(Math.random()*noMoreTurns.length);
      createCard(!gameFlow.getCurrentPlayer(), noMoreTurns[i]);
    //regular play, no tie or win
    } else if(action === "played" && gameFlow.getTurns() !== 0){
      let i = Math.floor(Math.random()*played.length);
      createCard(gameFlow.getCurrentPlayer(), played[i]);
    
    //dialogues for special events, won't let the others play until finished
    //on each new game
    } else if (action === "new game" && chance < 10){
      playersTalking = true;
      setTimeout(() => {
        createCard("p2", "Those lines can't be more crooked.");
        setTimeout(() => {
          createCard("p1", `oh, shut up, ${player2.getName()}.`);
          playersTalking = false;
        }, 1500);
      }, 1000);
    
    } else if (action == "new game" && chance > 10 && chance < 30
    && (player1.getScore() > 1 || player2.getScore() > 1)){
      setTimeout(() => {
        playersTalking = true;
        createCard("p1", "What are the scores?");
        setTimeout(() => {
          createCard("p2", "Let me check...");
          setTimeout(() => {
            sound.paper();
            setTimeout(() => {
              createCard("p2", `${player2.getScore()} me, ${player1.getScore()} you. ${player2.getScore() > player1.getScore() ? "I'm winning" : player1.getScore() > player2.getScore() ? "You are winning." : "Same score."}`);
              setTimeout(() => {
                playersTalking = false;
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1500);
      }, 1000);
    };
  };

  const createCard = (player, message) => {
    let id = messageCount;

    let playerTalking = player === true || player === "p1" ?
    messages[0] : messages[1];
    let playerTalkingName = playerTalking === messages[0] ? player1.getName()
    : player2.getName();

    const card = document.createElement("div");
    card.id = `msg${id}`;
    card.classList.add("card", "collapsed");
    const para = document.createElement("p");
    para.innerText = `${playerTalkingName}: ${message}`;


    card.appendChild(para);
    playerTalking.appendChild(card);

    setTimeout(() => {
      card.classList.remove("collapsed");
    }, 200);

    setTimeout(() => {
      card.classList.add("collapsed");
      setTimeout(() => {
        let childToKill = document.querySelector(`#msg${id}`);
        childToKill.parentNode.removeChild(childToKill);
      }, 250);
    }, 2500);
    messageCount++;
  };

  return { addListeners, strikeLine, newMatch };
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
      if(!gameOver) winGame("h1");
      return true;
    } else if(board[3] === board[4] && board[4] === board[5] && board[3] !== 0){
      if(!gameOver) winGame("h2");
      return true;
    } else if(board[6] === board[7] && board[7] === board[8] && board[6] !== 0){
      if(!gameOver) winGame("h3");
      return true;
    } else if(board[0] === board[3] && board[3] === board[6] && board[0] !== 0){
      if(!gameOver) winGame("v1");
      return true;
    } else if(board[1] === board[4] && board[4] === board[7] && board[1] !== 0){
      if(!gameOver) winGame("v2");
      return true;
    } else if(board[2] === board[5] && board[5] === board[8] && board[2] !== 0){
      if(!gameOver) winGame("v3");
      return true;
    } else if(board[0] === board[4] && board[4] === board[8] && board[0] !== 0){
      if(!gameOver) winGame("d1");
      return true;
    } else if(board[2] === board[4] && board[4] === board[6] && board[2] !== 0){
      if(!gameOver) winGame("d2");
      return true;
    } else {
      return false;
    };
  };

  function winGame(pos){
    matchEnd();
    setTimeout(() => { //delay so win condition can be checked first
      board.fill(0); //prevents adding extra points while animations plays
    }, 100);
    playerOneTurn ? player1.addScore() : player2.addScore();
    setTimeout(() => {
      displayController.strikeLine(pos);
      setTimeout(() => {
        displayController.newMatch();
      }, 1000);
      resetTurns();
    }, 1200);
  };

  const turnsMinusOne = () => turnsRemaining--;
  const getTurns = () => turnsRemaining;
  const resetTurns = () => turnsRemaining = 9;
  const getCurrentPlayer = () => playerOneTurn;
  const playDelay = () => {
    gameInProcess = false;
    setTimeout(() => {
      if(!gameOver) {
        gameInProcess = true;
      }
    }, 500);
  };

  return {winConditions, board, swapPlayer, placeMark, getCurrentPlayer,
    matchStart, matchStatus, turnsMinusOne, getTurns, resetTurns,
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

const player1 = Player("player 1", "X");
const player2 = Player("player 2", "O");



//for testing

//get left and top percentages for board on click position
// const board = document.querySelector(".board");
// board.addEventListener("click", (e) => {
//   console.log(
//     Math.floor((e.clientX - board.offsetLeft) * 100 / board.clientWidth),
//     Math.floor((e.clientY-board.offsetTop) * 100 / board.clientHeight)
//   );
// })