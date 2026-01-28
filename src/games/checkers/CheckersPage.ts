import { Page, Locator, expect } from "@playwright/test";
import { GamePage } from "../GamePage";

export type Player = "user" | "computer"; // Alternatively could be 'red' vs. 'black' as per wiki doc

export type PieceType = "man" | "king";

export type PieceState = {
  type: PieceType;
  player: Player;
} | null; // Used in conjunction with SquareState, where if null that implies there is no piece in the location

export type SquareState = {
  valid: boolean;
  piece: PieceState;
  selected: boolean;
  coordinates: Coordinates;
};

export type LegalMove = {
  startingPosition: Coordinates;
  endingPosition: Coordinates;
};

export type BoardState = SquareState[];

export class Coordinates {
  /**
   * (y, x) coordinates representing the (column, row) on an inverted grid (bottom-right is (0,0); top-left is (7,7))
   *
   * @param y the column
   * @param x the row
   */
  constructor(
    public readonly y: number,
    public readonly x: number,
  ) {
    if (y > 7 || y < 0 || x > 7 || x < 0) {
      throw new RangeError(
        `Must provide coordinates representing a column and row that is within the 8X8 board: ${y},${x}`,
      );
    }
  }
}

export class CheckersPage extends GamePage {
  readonly board: CheckersBoard;
  readonly url: string = "https://www.gamesforthebrain.com/game/checkers/";

  constructor(page: Page) {
    super(page);
    this.board = new CheckersBoard(page);
  }

  async goto() {
    await this.page.goto("game/checkers/");
  }

  get rulesLink() {
    return this.page.getByRole("link", { name: "Rules" });
  }

  get restartLink() {
    return this.page.getByRole("link", { name: "Restart..." });
  }

  get messageText() {
    return this.page.locator("#message").textContent();
  }

  async clickOnRulesLink() {
    return await this.rulesLink.click();
  }

  async clickOnRestartLink() {
    return await this.restartLink.click();
  }
}

class CheckersBoard {
  private readonly board: Locator;

  constructor(private readonly page: Page) {
    this.board = this.page.locator("#board");
  }

  get playableSquares() {
    return this.board.locator("img[onClick]");
  }

  get rows() {
    return this.board.locator("div.line");
  }

  async getBoardState(): Promise<BoardState> {
    const boardState: BoardState = [];
    // The game has 0,0 as the bottom-left position, whereas if we start from the first row, 0,0 would be the top-left position
    // Note: This means the board is actually inverted from what the user actually sees on the webpage
    for (let row_index = 7; row_index >= 0; row_index--) {
      const row = this.rows.nth(row_index);
      const imgs = row.locator("img");
      for (let column_index = 7; column_index >= 0; column_index--) {
        const img = imgs.nth(column_index);
        const squareState: SquareState =
          await this.parseSquareByImgLocator(img);
        boardState.push(squareState);
      }
    }
    return boardState;
  }

  async clickOnSquareByCoordinates(coordinates: Coordinates) {
    await this.getSquareLocatorByCoordinates(coordinates).click();
  }

  async getSquareStateByCoordinates(coordinates: Coordinates) {
    const square: Locator = this.getSquareLocatorByCoordinates(coordinates);
    return await this.parseSquareByImgLocator(square);
  }

  private getSquareLocatorByCoordinates(coordinates: Coordinates) {
    const square = this.page.locator(
      `img[name="space${coordinates.y}${coordinates.x}"]`,
    );
    if (square === null) {
      throw new Error(
        `No square was found based on the provided coordinates: ${coordinates}`,
      );
    }
    return square;
  }

  private async parseSquareByImgLocator(
    imgLocator: Locator,
  ): Promise<SquareState> {
    // If 'onclick' is missing, the square is not valid for play
    const imgOnclick = await imgLocator.getAttribute("onclick");
    let valid: boolean;
    if (imgOnclick === null) {
      valid = false;
    } else {
      valid = true;
    }

    // Obtain coordinates from the `name` attribute
    const imgName = await imgLocator.getAttribute("name");
    if (imgName === null) {
      throw new Error('Every square should have an img "src" attribute.');
    }
    const rawCoordinates = imgName.split("space")[1];
    const coordinates: Coordinates = new Coordinates(
      Number(rawCoordinates[0]),
      Number(rawCoordinates[1]),
    );

    // Piece types and player are determined by the `src` attribute
    const imgSrc = await imgLocator.getAttribute("src");
    if (imgSrc === null) {
      throw new Error(`Every square should have an image src attribute.`);
    }
    if (!imgSrc.includes(".gif")) {
      throw new Error(
        `Images in the board are expected to be of file format .gif: ${imgSrc}`,
      );
    }

    // Code smell in the application -- there should be a better determiner of selection instead of using img src attribute
    let selected: boolean = false;
    if (imgSrc.includes("2")) {
      selected = true;
    }

    // Invalid location for play -- no pieces can touch/land on this position
    if (imgSrc.includes("black")) {
      return {
        valid: valid,
        piece: null,
        selected: selected,
        coordinates: coordinates,
      };
    }
    // Valid location for play; empty position
    if (imgSrc.includes("gray")) {
      return {
        valid: valid,
        piece: null,
        selected: selected,
        coordinates: coordinates,
      };
    }
    // Remaining squares should include pieces, now that empty and invalid positions have been checked
    let player: Player;
    if (imgSrc.includes("you")) {
      player = "user";
    } else if (imgSrc.includes("me")) {
      player = "computer";
    } else {
      throw new Error(
        `Unable to determine player based on img src of ${imgSrc}`,
      );
    }

    // The only other img src that contains 'k' is 'black' and that has already been returned -- ideally we'd have an attribute on img other than src for determining piece type.
    let pieceType: PieceType;
    if (imgSrc.includes("k.gif")) {
      pieceType = "king";
    } else {
      pieceType = "man";
    }

    return {
      valid: valid,
      piece: { type: pieceType, player: player },
      selected: selected,
      coordinates: coordinates,
    };
  }

  getBoardSummary(boardState: BoardState) {
    // Using a 2D array makes finding counts more difficult, consider flattening -- add coordinates to the `type` for SquareState, easier to calculate distance from pieces, jumps, etc.

    // Pieces
    const playerPieces = boardState.filter((square) => square.piece !== null);
    const playerPieceCount = playerPieces.length;
    const computerPieces = playerPieces.filter(
      (square) => square.piece?.player === "computer",
    );
    const computerPieceCount = computerPieces.length;
    const userPieces = playerPieces.filter(
      (square) => square.piece?.player === "user",
    );
    const userPieceCount = userPieces.length;

    // Empty
    const emptyValidSquares = boardState.filter(
      (square) => square.valid === true && square.piece === null,
    );

    return {
      playerPieces: playerPieces,
      playerPieceCount: playerPieceCount,
      computerPieces: computerPieces,
      computerPieceCount: computerPieceCount,
      userPieces: userPieces,
      userPieceCount: userPieceCount,
      emptyValidSquares: emptyValidSquares,
    };
  }

  private findLegalMove(boardState: BoardState): LegalMove {
    const boardSummary = this.getBoardSummary(boardState);

    // Select a piece and calculate which legal moves can be executed
    const emptyValidSquares = boardSummary.emptyValidSquares;
    const userPieces = boardSummary.userPieces;

    // Iterate through the empty valid squares until there is a player piece that can land on it, then move that piece
    for (let s = 0; s < emptyValidSquares.length; s++) {
      const validSquare = emptyValidSquares[s];
      const validSquareCoordinates = validSquare.coordinates;
      for (let p = 0; p < userPieces.length; p++) {
        const userPiece = userPieces[p];
        const userPieceCoordinates = userPiece.coordinates;
        // Must be one column less; one row less than the position of the empty square
        if (
          userPieceCoordinates.y == validSquareCoordinates.y - 1 &&
          userPieceCoordinates.x == validSquareCoordinates.x - 1
        ) {
          return {
            startingPosition: userPieceCoordinates,
            endingPosition: validSquareCoordinates,
          };
        }
      }
    }

    throw new Error("Legal move was not found");
  }

  async makeLegalMove(boardState: BoardState) {
    const { startingPosition, endingPosition } = this.findLegalMove(boardState);
    await this.clickOnSquareByCoordinates(startingPosition);
    await this.clickOnSquareByCoordinates(endingPosition);
  }

  async waitForComputerMove() {
    const selectedComputerPiece = this.page.locator('img[src$="2.gif"]'); // technically this handles the user's turns, as well -- could rename the method
    await expect(selectedComputerPiece).toBeVisible();
    await expect(selectedComputerPiece).toHaveCount(0);
  }
}
