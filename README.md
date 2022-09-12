# odin-tic-tac-toe

# Live: https://hectorvilas.github.io/odin-tic-tac-toe/

Welcome to my new project! This time I'm doing another practice from The Odin Project ([This one](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe)), a classic Tic-Tac-Toe, involving factory functions and the module pattern.

I've been reading and watching videos about patterns and this kind of functions, other than the ones provided by Odin, and I can see the great potential and practicality of this, so I'm going to implement them in future projects. Still, this is the first time using them, other than some basic functions I wrote in the browser's console for testing, so I'm not yet sure how I'm going to approach this practice. Maybe I can come up with an idea after writing a roadmap.


## Requisites by Odin:

- ❌store the gameboard as an array inside of a Gameboard object
- ❌players are also going to be stored in objects
- ❌an object to control the flow of the game itself
- ❌have as little global code as possible
- - ❌tuck everything away inside of a module or factory
- ❌write a JS function that will render the contents of the gameboard array to the webpage
- ❌functions to allow players to add marks to a specific spot on the board, and then tie it to the DOM, letting players click on the gameboard to place their marker
- ❌build the logic that checks for when the game is over
- ❌allow players to put in their names
- ❌include a button to start/restart the game
- ❌add a display element that congratulates the winning player
- ❓optional - create an AI so that a player can play against the computer
- - ❓get the computer to make a random legal move
- - ❓work on making the computer smart

## Roadmap

<!-- ❌ ✔️ ⭕ ❓ -->

The page:

- ❌a way to write and edit player names (modal?)
- ❌a play area in the center
- - ❌made with grid
- - ❌size adjusted by viewport
- - ❌9 `div`s autofilling the cells
- ❌a reset button

The code:

- ❌function factory for players
- - ❌store name
- - ❌store cross or circle for play area
- ❌module pattern for board
- ❓module pattern for rules (or in board too)

The game:
- ❌start asking for players names (player1 and player2 at default)
- ❌draw the board, empty
- ❌at random one of the player starts
- ❌player1 places circles and player2 crosses
- ❌each time a player places a mark, it's the other player's turn
- ❌marks can only be placed at empty spaces
- ❌each play, the win condition checks the board
- - ❌3 marks of the same player must form an horizontal, vertical or diagonal line
- - ❌if there's a line, the game ends, the player that made the line wins
- - ❓when another game starts, first play is for the player that lost
- - ❓on a tie, the starting player is chosen at random
