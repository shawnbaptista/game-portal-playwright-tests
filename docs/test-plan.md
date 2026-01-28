# Test Plan for Checkers

## Glossary

* Board -- gameplay grid for playing checkers, composed of squares
* Piece -- unit of gameplay that can be moved
* Capture -- the removal of a piece from the opposite player jumping over the piece diagonally
* Multi-capture -- the removal of multiple pieces from the opposite player by jumping over the pieces diagonally in a chain
* Player -- user or computer
* User -- the individual controlling the webpage's elements
* Man -- the basic piece that all players start with -- can only move forward and diagonally
* King -- the promotion of a 'man' results in it becoming a 'king' piece -- can move forward or backward diagonally

## Tests and Invariants

1. Board specifics:
    1. The board is an 8X8 grid
    2. There are 24 pieces on the board; each player has 12; each player is a different color, typically red or black
    3. Pieces start on black squares
    4. Black moves first
2. Gameplay:
    1. Legal moves -- position changes
        1. Player can make legal moves as a 'man' -- moving forward only by one square
        2. Player can make legal moves as a 'king' -- moving forward OR backward by one square
        3. Player can capture an opponent's piece by jumping over the piece diagonally
        4. When a capture is possible, it must be made, no other move should be possible
        5. Player can promote a 'man' to a 'king' upon reaching the opposite end of the board
        6. Player can capture multiple pieces from the opponent in a single turn
        7. If multi-capture is possible on a single turn, the player's turn does not end until no further captures are possible for that piece
    2. Invalid moves -- position remains unchanged
        1. Player cannot move a 'man' to a row behind where the piece started
        2. Player cannot move any piece onto an invalid square (opposite color of where the pieces start)
        3. Player cannot move their piece to another column of the same row -- horizontal movement not allowed
        4. Player cannot move their piece to another row of the same column -- vertical movement not allowed
        5. Player cannot move a piece while the opponent is in turn
        6. Player cannot move a piece onto another piece -- checkers, not chess
    3. End state -- game ends
        1. Player wins by capturing all of the opponent's pieces -- 0 pieces remaining for the opponent
        2. Player loses when all of their pieces have been captured -- 0 pieces remaining for the player
        3. Player loses when they cannot make any legal moves
3. Navigation:
    1. User can click on the logo for navigation to the home page
    2. User can click on any of the game links for navigation to the specified game
    3. User can view rules by clicking on a link
    4. User can restart the game by clicking on a link
    5. User can navigate away from the game and restore state by clicking the back button in their browser -- preserve game state
4. Security: 
    1. User cannot view the game's logic
    2. User cannot manipulate the game's state
5. Messages:
    1. User can see a message telling them it is their turn
    2. User can see a message telling them it is not their turn
    3. User can see a message telling them they are attempting an illegal move
    4. User can see a message that they have won the game
    5. User can see a message that they have lost the game
6. UI indicators:
    1. Visual UI indicator appears upon piece selection by player
    2. The piece selected is the only piece with the indicator at a time
    3. A piece can only move if it is in the selected state with the visual UI indicator
7. Computer strategy: (see `testing-notes.md`)
    1. Deterministic strategy -- computer will make the same moves based on user's moves
    2. Computer follows the same priority order of...
        1. Prevent the user from capturing any pieces
        2. Look for captures
        3. Look for legal moves
        4. Game ends and the user wins

## Defects

* Note on priority: Since this application is not storing sensitive data, security is not a high concern. There is no login, there are no credentials. The site is driven by ad-revenue, so we can imagine the priority for the experience is in enjoyment to the user, which means the mechanics of the game should be clear.

| Priority | Severity | Invariant Type | Invariant | Defect | Resolved |
| :---     | :---        | :---           |:---:      |:---    | :---:    |
| P2 | Low      | Board specifics| 1.3       | Pieces start on white | No |
| P2| Low  | Board specifics | 1.4 | Red moves first | No |
| P1 | High | Gameplay - end state | 2.3.3 | Game does not end when legal moves are unavailable | No |
| P1 | Medium | Navigation | 3.3 | Link for Rules is out-of-date | No |
| P3 | Low | Security | 4.1 | Game logic can be viewed via DevTools, unminified JS | No |
| P3 | Low | Security | 4.2 | Game state can potentially be modified via DevTools as global variables are available | No |
| P1 | High| Messages | 5.1 | 'Please wait' can appear during the user's turn | No | 
| P1 | High| Messages | 5.2 | 'Make a move' can appear during the computer's turn | No |

* DEFECT 1.3: Based on the Checkers rules page on Wikipedia, the pieces start on the black squares, yet the game starts on the white squares: https://en.wikipedia.org/wiki/Checkers

* DEFECT 1.4: Black should move first -- either the computer needs to move first, or the 'user' should be using the black pieces

* DEFECT 2.3.3: Locked -- "In almost all variants, a player with no valid move remaining loses. This occurs if the player has no pieces left, or if all the player's pieces are obstructed from moving by opponent pieces" -- game SHOULD end here, but does not

* DEFECT 3.3: "Rules" link goes to invalid page, redirects to a link that doesn't exist anymore -- also, shouldn't the link open in another tab instead of directing AWAY from the game page? The user would not know how to get to the game intuitively, other than clicking the back button -- also, what if they are checking the rules mid-game, they'll lose their progress (Ah! They do not lose their progress... maybe local storage?). With the broken redirect, the user is dropped onto the top of the page, and has to figure out _which_ rules to follow -- not specified which variant of checkers is being played

* DEFECTS 4.1 & 4.2: The game is loaded via `game/checkers/default.js` -- found in Dev Tools `Source` -> `Page`

* DEFECT 5.1 & 5.2: Clicking around quickly and not making an immediate move with the first selected piece can put the system in a state where messages are inconsistent 

## Development Improvements

* Add static `data-*` attributes to the img tags for representing the playable squares and their coordinates 
(https://www.browserstack.com/guide/playwright-best-practices)
  * e.g., `data-row=0 data-column=2 data-testid=square-0-2 data-playable=true`
* Add dynamic `data-*` attributes to the img tags for representing the square's state, such as if the square has a piece, from which player, and which piece -- these dynamic attributes should only be present if a piece is on the square
  * e.g., `data-player=red data-piece=man data-selected=true`
* Add `data-turn=red` or `data-turn=black` on a dedicated persistent element displayed in the UI
* Add state injection for beginning tests with a board set in a specific state

## Product Improvements

* 2.1.4: Forced capture should be implemented, or documented
* 3.3: Include the rules of the game on the game page itself instead of dropping the user onto wikipedia on a page where there are multiple variants of the game
* 5.1 & 5.2: The messages need to be standardized as to what should appear and when -- in relation to defects 5.1 and 5.2
* Add settings for game mechanics such as forced captures and which color to play
* Add an undo button to be used after making a turn
* Add display for points -- count of captured pieces per player

