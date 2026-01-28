### Scratch Notes

There are multiple games on the website: gamesforthebrain.com -- soooo that means the repo could be for testing the website, and therefore any of the games

Board: class="boardWrapper"

User King: src="you1k.gif"
User: src="you1.gif"
Enemy King: src="me1k.gif"
Enemy: src="me1.gif"
Empty Square: src="https://www.gamesforthebrain.com/game/checkers/gray.gif"
Invalid Square / Black: src="black.gif"
Selected User piece: "you2.gif"


- Found that the game is loaded via `game/checkers/default.js` -- found in Dev Tools `Source` -> `Page`
  - Source code says "red" is the player, yet the UI shows "orange" -- also in the messages
  - Source code says "black" is the computer, yet the UI shows "black" as the actual black squares that cannot be touched/landed on
   - With the images (.gif files), they are labelled as "you_", "me\*", or "black.gif" -- set the variables in the test repo as "player" vs. "computer" especially when the source code commented vars say:
   - var black = -1; // computer is black
    - var red = 1; // visitor is red
    - Global variables used in the `default.js` game logic -- risk as they can be overridden  
    

￼
Invariants
Movement:

- Pieces can move diagonally to a blank square
- Pieces can never move to black squares ("Move diagonally only" appears)
- Pieces can never move backwards
- Moving a piece to the oppose side of the board results in the piece becoming a "king" piece
  Capture:
- Pieces can move two spaces if an enemy piece is in between, and only if that space is clicked, not if the enemy piece is clicked
- "Complete the double jump or click on your piece to stay still." -- when capturing a single piece, but can do double-capture
  When your turn: Clicking an opponent's piece does nothing; clicking your own piece highlights it
- Restart button refreshes the board

Messages:

- Start: "Select an orange piece to move."
- "Make a move."
- "Please wait."
- "You win" ??
- "You lose. Game over."
- "Move diagonally only." -- after clicking your piece and clicking on an empty space in the same row
  Game Ends:
- Win if all enemy pieces are removed from board
- Lose if all user pieces are removed from board

Each valid square has an "onclick" attribute; e.g. onclick="didclick(2, 4)"

### Computer Strategy

Game is loaded via `game/checkers/default.js` -- found in Dev Tools `Source` -> `Page`

`default.js::computer()`
```
{
    // step one - prevent any jumps
    for (var j=0;j<8;j++) {
         for(var i=0;i<8;i++) {
            if (integ(board[i][j]) == 1) {
             if ((legal_move(coord(i,j),coord(i+2,j+2))) && (prevent(coord(i+2,j+2),coord(i+1,j+1)))) {
              return true;
             } if ((legal_move(coord(i,j),coord(i-2,j+2))) && (prevent(coord(i-2,j+2),coord(i-1,j+1)))) {
              return true;
             }
            } if (board[i][j] == 1.1) {
             if ((legal_move(coord(i,j),coord(i-2,j-2))) && (prevent(coord(i-2,j-2),coord(i-1,j-1)))) {
              return true;
             } if ((legal_move(coord(i,j),coord(i+2,j-2))) && (prevent(coord(i+2,j-2),coord(i+1,j-1)))) {
              return true;
             }
            }
         }
    }

    // step two - if step one not taken, look for jumps
    for (var j=7;j>=0;j--) {
         for(var i=0;i<8;i++) {
            if (jump(i,j))
             return true;
         }
    }
    safe_from = null;

    // step three - if step two not taken, look for safe single space moves
    for (var j=0;j<8;j++) {
         for(var i=0;i<8;i++) {
            if (single(i,j))
             return true;
         }
    }

    // if no safe moves, just take whatever you can get
    if (safe_from != null) {
         move_comp(safe_from,safe_to);
    } else {
         message("You have won!");
         game_is_over = true;
    }
    safe_from = safe_to = null;
    return false;
}
```
