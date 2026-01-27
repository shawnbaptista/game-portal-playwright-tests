import { expect, test } from '@playwright/test'
import { CheckersPage, Coordinates } from '../CheckersPage'

test.describe('Checkers gameplay', () => {
    let checkersPage: CheckersPage

    test.beforeEach(async ({ page }) => {
        checkersPage = new CheckersPage(page)
        await checkersPage.goto()
    })

    test('Board has 32 playable squares', { tag: '@smoke' }, async () => {
        await expect(checkersPage.board.playableSquares).toHaveCount(32)
    })

    test('DEV - Automated game', { tag: '@dev' }, async () => {
        let pieceCount: number = 24
        for (let index = 0; index < 20; index++) {
            let boardState = await checkersPage.board.getBoardState()
            let boardSummary = checkersPage.board.getBoardSummary(boardState)
            if (boardSummary.playerPieceCount < pieceCount) {
                console.log("Piece was captured!")
                pieceCount = boardSummary.playerPieceCount
            }
            await checkersPage.board.makeLegalMove(boardState)
            await checkersPage.board.waitForComputerMove()
        }


    })

    test('Player can move a piece to a valid position', { tag: '@debug'}, async () => {
        const startingPosition: Coordinates = new Coordinates(0, 2)
        const endingPosition: Coordinates = new Coordinates(1, 3)

        // GIVEN: It is the player's turn
        // WHEN: A player's piece is selected
        await checkersPage.board.clickOnSquareByCoordinates(startingPosition)
        const selectedSquare = await checkersPage.board.getSquareStateByCoordinates(startingPosition)
        expect(selectedSquare).toMatchObject({ valid: true, piece: {type: 'man', player: 'user'}, selected: true})

        //   AND: A valid location for movement is clicked
        await checkersPage.board.clickOnSquareByCoordinates(endingPosition)

        // THEN: The starting square should be empty
        let startingSquare = await checkersPage.board.getSquareStateByCoordinates(startingPosition)
        expect(startingSquare).toMatchObject({ valid: true, piece: null, selected: false })

        //   AND: The ending square should have the moved piece
        let endingSquare = await checkersPage.board.getSquareStateByCoordinates(endingPosition)
        expect(endingSquare).toMatchObject({ valid: true, piece: {type: 'man', player: 'user'}, selected: true })

        // DEBUG
        let boardState = await checkersPage.board.getBoardState()
        checkersPage.board.getBoardSummary(boardState);

    })

    test('Player cannot move backwards', () => {

    })

    test('Player cannot move horizontally', () => {

    })


})