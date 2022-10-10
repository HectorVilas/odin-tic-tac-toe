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
  //phone related
  const cellPhone = document.querySelectorAll(".cell-phone");
  const messages = document.querySelectorAll(".messages");
  const time = document.querySelectorAll(".cell-phone-time");
  const nameOnPhone = document.querySelectorAll(".cell-phone-name");
  const nameChangeModal = document.querySelectorAll(".cell-phone-modal");
  const nameChangeTextArea = document.querySelectorAll(".new-name");
  const btnNameChangeCancel = document.querySelectorAll(".btn-new-name-cancel");
  const btnNameChangeConfirm = document.querySelectorAll(".btn-new-name-confirm");
  const cellphones = document.querySelectorAll(".cell-phone");
  const keychains = document.querySelectorAll(".keychain");
  //phone message
  const phoneMsg = document.querySelectorAll(".cell-phone-msg");
  const phoneMsgSender = document.querySelectorAll(".cell-phone-msg-sender");
  //phone AI activator
  const aiCheckboxes = document.querySelectorAll(`[type="checkbox"]`);
  const aiSliders = document.querySelectorAll(`[type="range"]`);

  let messageCount = 0;
  let playersTalking = false;
  
  const startListenersAndFunctions = () => {
    handP1.addEventListener("animationend", () => {
      handP1.className = "hand player1"; //remove all anim classes except this one
    });
    handP2.addEventListener("animationend", () => {
      handP2.className = "hand player2"; //remove all anim classes except this one
    });
    
    cells.forEach( cell => {
      cell.addEventListener("click", clickCell);
    });

    keychains.forEach(chain => {
      chain.addEventListener("touchstart", showPhone);
    })

    nameOnPhone.forEach(n => {
      n.addEventListener("click", changeName);
    });

    btnNameChangeCancel.forEach(c => {
      c.addEventListener("click", closeModal);
    })
    btnNameChangeConfirm.forEach(c => {
      c.addEventListener("click", acceptNameChange);
    })

    setInterval(() => {
      const date = new Date();
      time.forEach(t => {
        t.innerText = `${
          date.getHours() < 10 ? "0"+date.getHours() : date.getHours()}:${
          date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes()}:${
          date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds()}`;
      })
    }, 1000);
    
    setInterval(() => {
      randomPhoneMessage();
    }, 30000);

    aiCheckboxes.forEach(checkbox => {
      checkbox.addEventListener("click", changeAiCheckbox);
    });

    aiSliders.forEach(slider => {
      slider.addEventListener("change", changeAiLevel);
    });
  };
  
  function clickCell(cell) {
    if(typeof cell === "object"){ //if function is called by dom
      if(gameFlow.getCurrentPlayer() && aiCheckboxes[0].checked
      || !gameFlow.getCurrentPlayer() && aiCheckboxes[1].checked) return;
    };

    const idx = this?.dataset?.idx || cell;
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
          gameFlow.playDelay(3000);
        }, 1200);
      };
    };
    
  };

  const newMatch = () => {
    talk("new game");
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
      createCard(gameFlow.getCurrentPlayer(), noMoreTurns[i]);
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
    } else if (action.includes("name change")){
      const player = action.at(-1) === "0" ? "p1" : "p2";
      const theOtherPlayer = action.at(-1) === "0" ? "p2" : "p1";
      const currentName = player === "p1" ? player1.getName() : player2.getName();
      const previoustName = player === "p1" ? player1.getPreviousName() : player2.getPreviousName();
      
      if(currentName === previoustName) return
      
      const nameChange = [`Stop calling me ${previoustName}, I prefer ${currentName}.`,
      `Can you call me ${currentName} instead of ${previoustName}?`,
      `I don't like ${previoustName}, call me ${currentName}.`];
      const answer = [`Okay, ${currentName}.`, `Whatever you say, ${currentName}.`,
      "Okay.", "Okay, no problem.", `${currentName}? really? Okay, I won't laugh`,
      "As you wish.", "Yeah, why not?"];
      playersTalking = true;
      let i = Math.floor(Math.random()*nameChange.length);
      createCard(player, nameChange[i])
      setTimeout(() => {
        let i = Math.floor(Math.random()*answer.length);
        createCard(theOtherPlayer, answer[i])
        setTimeout(() => {
          playersTalking = false;
        }, 1000);
      }, 1500);

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

  function changeName(){
    const i = this.className.includes("player1") ? 0 : 1;
    
    nameChangeTextArea[i].value = this.className.includes("player1") ? player1.getName() : player2.getName();
    nameChangeModal[i].classList.remove("hidden");
  };

  function closeModal(){
    const i = this.className.includes("player1") ? 0 : 1;
    nameChangeModal[i].classList.add("hidden");
  };
  
  function acceptNameChange(){
    const i = this.className.includes("player1") ? 0 : 1;
    
    if(nameChangeTextArea[i].value.length === 0) return;

    if(this.className.includes("player1")){
      player1.changeName(nameChangeTextArea[i].value);
    } else {
      player2.changeName(nameChangeTextArea[i].value);
    };

    nameOnPhone[i].innerText = nameChangeTextArea[i].value
    + `${nameChangeTextArea[i].value.at(-1).toLowerCase() === "s" ? "'" : "'s"}`;
    nameChangeModal[i].classList.add("hidden");

    talk(`name change ${i}`);
  };

  const randomPhoneMessage = () => {
    const messages = [
      {sender: "Enlarge your duck!", message: "Do you want to get better at rubberducking? Check this awesome website to know more about it."},
      {sender: "Steve", message: "Are you guys still playing tic-tac-toe?"},
      {sender: "Nigerian Prince", message: "Dear {first_name}, it is a great pleasure to write to you this letter, which I believe..."},
      {sender: "Steve", message: "Dude, get home, let's play some Mineshaft"},
      {sender: "Candy Crunch", message: "You received 25.000 candy coins! Open the game to claim your prize."},
      {sender: "Dolphin", message: "Wanna get rich? Download this app and discover how. Trust me."},
      {sender: "Mom", message: "Don't forget to walk the dog when you get home."},
      {sender: "Dad", message: "Hey, champ. What is an NFT? Should I buy one? Do you like monkey drawings?"},
      {sender: "You won the lottery!", message: "Congratulations! You won 20.000.000 usd! Your phone number has been randomly chosen..."},
      {sender: "Suzanne", message: "I heard you are a programmer. I have this crazy idea for an app..."},
      {sender: "Suzanne", message: "Can you fix my printer?"},
      {sender: "Rick", message: "Are those rumors about Half-Life 2: Episode 3 confirmed? Do you know something about it?"},
      {sender: "W.W.", message: "Jesse, we need to cook. \n ___________________ \n\n Sorry, wrong number."},
      {sender: "Isaac", message: "Do you know who ate all the donuts?"},
      {sender: "System update available", message: "Droid v15.0.2 System Update."},
      {sender: "Hot Shingles in your area", message: "Blistering? Curling? Mold? Check this awesome solution."},
    ];
    const playerIdx = Math.floor(Math.random() * 2);
    const i = Math.floor(Math.random() * messages.length);
    phoneMsgSender[playerIdx].innerText = messages[i].sender;
    phoneMsg[playerIdx].innerText = messages[i].message;

    cellPhone[playerIdx].classList.add("vibrate");
    setTimeout(() => {
      cellPhone[playerIdx].classList.remove("vibrate");
    }, 500);
  };

  const getAiStatus = (player) => {
    return player === "p1" || player === true ? aiCheckboxes[0].checked : aiCheckboxes[1].checked;
  };

  function showPhone(){
    const idx = this.className.includes("player1") ? 0 : 1;
    const otherIdx = this.className.includes("player1") ? 1 : 0;
    cellphones[idx].classList.toggle("active");
    if(cellphones[otherIdx].className.includes("active")){
      cellphones[otherIdx].classList.remove("active");
    };
  };

  function changeAiCheckbox(){
    let i = this.id === "ai1" ? 0 : 1;
    this.checked ? aiSliders[i].removeAttribute("disabled")
    : aiSliders[i].setAttribute("disabled","");
  };
  
  function changeAiLevel(){
    const newValue = parseInt(this.value);
    this.id === "ai1-level" ? player1.setAiLevel(newValue)
    : player2.setAiLevel(newValue);
  }

  function getSliderValue(player){
    i = player === "p1" ? 0 : 1;
    return parseInt(aiSliders[i].value);
  }
return { startListenersAndFunctions, strikeLine, newMatch,
    clickCell, getAiStatus, getSliderValue };
})();


//manages the game rules
const gameFlow = (() => {
  let gameInProcess = false;
  let playerOneTurn = true;
  let turnsRemaining = 9;
  let gameOver = false;
  let board = new Array(9).fill(0);
  const validLines = [
    [0,1,2], [3,4,5], [6,7,8], //horizontal
    [0,3,6], [1,4,7], [2,5,8], //vertical
    [0,4,8], [2,4,6], //diagonal
  ];
  function swapPlayer(){
    setTimeout(() => {
      playerOneTurn = !playerOneTurn;
    }, 100);
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
    let wonGame = false;
    const strikeLines = [
      "h1", "h2", "h3", //horizontal
      "v1", "v2", "v3", //vertical
      "d1", "d2", //diagonal
    ];
    validLines.forEach((line, lineIdx) => {
      const cellsOnBoard = [board[line[0]], board[line[1]], board[line[2]]];
      const noEmptyCells = !cellsOnBoard.includes(0);
      const ThreeEqualMarks = gameFlow.getCurrentPlayer() ?
      cellsOnBoard.every(c => c == "X") : cellsOnBoard.every(c => c == "O");

      if(noEmptyCells && ThreeEqualMarks){
        if(!gameOver) winGame(strikeLines[lineIdx]);
        wonGame = true;
      };
    });
    return wonGame;
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
  const getValidLines = () => validLines;
  const playDelay = (time) => {
    gameInProcess = false;
    setTimeout(() => {
      if(!gameOver) {
        gameInProcess = true;
      }
    }, time || 500);
  };

  return {winConditions, board, swapPlayer, placeMark, getCurrentPlayer,
    matchStart, matchStatus, turnsMinusOne, getTurns, resetTurns,
    playDelay, getValidLines};
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
  let previousName = name;
  let aiLevel = 80;

  const getName = () => name ;
  const getPreviousName = () => previousName ;
  const getMark = () => mark;
  const getScore = () => score;
  const addScore = () => ++score;
  const getAiLevel = () => aiLevel;
  const setAiLevel = (n) => aiLevel = n;
  const changeName = (newName) => {
    previousName = name;
    name = newName;
  };

  return { getName, getPreviousName, getMark, getScore, addScore,
    changeName, getAiLevel, setAiLevel };
}

const aI = (() => {
  const run = () => {
    setInterval(() => {

      if(gameFlow.getCurrentPlayer() && !displayController.getAiStatus("p1") ||
        !gameFlow.getCurrentPlayer() && !displayController.getAiStatus("p2") ) return

      let freeSpaces = [];
      gameFlow.board.forEach((cell, i) => {
        if(cell === 0) {
          let weight = 1;
          //more chances for most valuable cells
          if(i%2 === 0) weight++; //corners and center
          if(i === 4) weight++; //center
          //more weight for corners if center is occupied on first play
          if(i%2 === 0 && gameFlow.board[4] !== 0
            && gameFlow.getTurns === 8) weight += 3;

            for(let idx = 0; idx < weight; idx++){
              freeSpaces.push(i);
            };
          };
        });
        //block or finish line
        const validLines = gameFlow.getValidLines();
        let toCompleteLines = [];
        let toWinLine = [];
      validLines.forEach((line, i) => {
        let thisLine = [];
        for(idx = 0; idx < 3; idx++){
          thisLine.push(gameFlow.board[line[idx]]);
        };
        if(thisLine.includes(0) &&
        (thisLine.includes("X") && !thisLine.includes("O") ||
        thisLine.includes("O") && !thisLine.includes("X"))){
          let symbolCount = 0;
          thisLine.forEach(cell => { if(cell !== 0) symbolCount++ });
          if(symbolCount === 2) {
            toCompleteLines.push({i, thisLine});
            //add lines that only gets a win
            if(gameFlow.getCurrentPlayer() && thisLine.includes("X") && !thisLine.includes("O")
            || !gameFlow.getCurrentPlayer() && thisLine.includes("O") && !thisLine.includes("X")){
              toWinLine.push({i, thisLine});
            }
          };
        };
      });
      if(toCompleteLines.length > 0){
        let rand = Math.floor(Math.random() * toCompleteLines.length);
        toCompleteLines[rand].thisLine.forEach((c, cIdx) => {
          const chance = Math.floor(Math.random() * 100);
          const playerWit = gameFlow.getCurrentPlayer() ? player1.getAiLevel() : player2.getAiLevel();
          const willNotice = chance <= playerWit;
          const emptyCell = c === 0;
          if(emptyCell && willNotice){
            //play with the winning line, or add a rival line to block
            if(toWinLine.length > 0){
              freeSpaces = [validLines[toWinLine[0].i][cIdx]];
              console.log(gameFlow.getCurrentPlayer() ? "p1" : "p2", "using win line on cell index", validLines[toWinLine[0].i][cIdx]);
            } else {
              freeSpaces = [validLines[toCompleteLines[rand].i][cIdx]];
            };
          };
        });
      };
      const rand = Math.floor(Math.random()*freeSpaces.length);
      displayController.clickCell(freeSpaces[rand]);
    }, 900);
  };
  return { run };
})();



//run on start
displayController.startListenersAndFunctions();

const player1 = Player("Jason", "X");
const player2 = Player("Tom", "O");

player1.setAiLevel(displayController.getSliderValue("p1"));
player2.setAiLevel(displayController.getSliderValue("p2"));

displayController.newMatch();
aI.run();

//for testing

//get left and top percentages for board on click position
// const board = document.querySelector(".board");
// board.addEventListener("click", (e) => {
//   console.log(
//     Math.floor((e.clientX - board.offsetLeft) * 100 / board.clientWidth),
//     Math.floor((e.clientY-board.offsetTop) * 100 / board.clientHeight)
//   );
// })