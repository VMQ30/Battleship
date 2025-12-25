class Ship{
    constructor( length , name , orientation){
        this.sunk = false,
        this.numOfTimesHit = 0
        this.length = length
        this.name = name
        this.coordinates = []
        this.orientation = orientation
    }

    hit() { 
        if( this.sunk === true ) return
        return ++this.numOfTimesHit
    }

    placeCoords( row , col ){
        this.coordinates = [ row , col ]
    }

    isSunk() { return this.numOfTimesHit >= this.length ? this.sunk = true : this.sunk = false }
}

class Gameboard{
    constructor(){
        this.board = Array.from( { length : 10 } , () => Array(10).fill(null) )
        this.ships = []
        this.missedAttacks = []
    }

    noShips(){ return ( this.ships.length === 0 ? true : false )}

    placeShip(ship , startRow , startCol , direction ){
        if( direction === 'horizontal' && startCol + ship.length > 10 ) return false
        if( direction === 'vertical' && startRow + ship.length > 10 ) return false

        for( let i = 0 ; i < ship.length ; i++ ){
            const row = direction === 'vertical' ? startRow + i : startRow
            const column = direction === 'horizontal' ? startCol + i : startCol

            if( this.board[row][column] !== null ) return false
        }

        for( let i = 0 ; i < ship.length ; i++ ){
            const row = direction === 'vertical' ? startRow + i : startRow
            const column = direction === 'horizontal' ? startCol + i : startCol

            this.board[row][column] = ship
        }

        ship.placeCoords( startRow , startCol )

        this.ships.push(ship)
        return true
    }

    receiveAttack( row , col ){
        const cell = this.board[row][col]
        if( cell === 'miss' || cell === 'hit' ) return false
        if( cell !== null ){
            cell.hit()
            this.board[row][col] = 'hit'
            if(cell.isSunk()){ this.removeShip() }
            return true
        }
        else{
            this.missedAttacks.push( [ row , col ] )
            this.board[row][col] = 'miss'
            return false
        }
    }

    removeShip(cell){
        const index = this.ships.indexOf(cell)
        this.ships.splice(index , 1)
    }

    clearPlayerBoard(){
        this.board = Array.from( { length : 10 } , () => Array(10).fill(null) )
        this.ships = []
    }
}

class Player{
    constructor( name ){
        this.name = name
        this.gameboard = new Gameboard()
    }
}

export { Ship , Gameboard , Player }