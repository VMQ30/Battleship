const { Ship , Gameboard , Player } = require('./classes.cjs.js')

test('ship is not sunk' , () => {
    const ship = new Ship(4)
    expect(ship.isSunk()).toBeFalsy()
})

test('gameboard is able to place ship properly' , () => {
    const ship = new Ship(4)
    const gameboard = new Gameboard()
    expect(gameboard.placeShip(ship , 0 , 0 , 'vertical')).toBeTruthy()
})

test('gameboard is able to register hit on ship properly' , () => {
    const ship = new Ship(4)
    const gameboard = new Gameboard()
    gameboard.placeShip(ship , 0 , 0 , 'vertical')
    expect(gameboard.receiveAttack( 0 , 0)).toBeTruthy()
})

test('gameboard has no ships on the board' , () => {
    const ship = new Ship(4)
    const gameboard = new Gameboard()
    gameboard.placeShip(ship , 0 , 0 , 'vertical')
    gameboard.receiveAttack( 0 , 0)
    gameboard.receiveAttack( 1 , 0)
    gameboard.receiveAttack( 2 , 0)
    gameboard.receiveAttack( 3 , 0)
    expect(gameboard.noShips()).toBeTruthy()
})

test('player puts a ship on the gameboard' , () => {
    const player = new Player( 'A' )
    const ship = new Ship(4)
    expect(player.gameboard.placeShip( ship , 0 , 0 , 'vertical' )).toBeTruthy

})