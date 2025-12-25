import { Ship , Player} from './class.js'

( function() {
    const player = createPlayer( 'Player One' )
    setUpGame( player )

})()

//Setup
function setUpGame( player ){
    setUpUI()
    setUpShipPlacement( player )
    setUpGameControls( player )
}

function setUpUI(){
    openShipPlacement()
    renderingBoardCells()
    toggleOrientationButton()
}

function setUpShipPlacement( player ){
    hoverShip( player )
    enableAutoDeploy( player )
}

function setUpGameControls( player ){
    resetGame( player )
}

//Board Rendering

function renderingBoardCells(){
    const gridSize = 11
    const grids = document.querySelectorAll('.game-grid')
    grids.forEach( ( grid ) => {
        for( let i = 0 ; i < gridSize ; i++ ){
            for( let j = 0 ; j < gridSize ; j++ ){
                createCell( i , j , grid )
            }
        }
    })
}

function createCell( i , j , grid ){
    const cell = document.createElement('div')

    if ( i === 0 && j === 0 ) cell.classList.add('game-header')

    else if ( i === 0 ){
        const letterHeader = document.createElement('p')
        letterHeader.textContent = String.fromCharCode( 65 + (j - 1) )
        cell.appendChild(letterHeader)
        cell.classList.add('game-header')
    }

    else if ( j === 0 ){
        const letterHeader = document.createElement('p')
        letterHeader.textContent = i
        cell.appendChild(letterHeader)
        cell.classList.add('game-header')
    }

    else {
        cell.dataset.row = i - 1
        cell.dataset.col = j - 1
        cell.classList.add('cell')
    } 
    
    grid.appendChild(cell)
}

//UI Controls

function openMainGame(){
    const mainGameScreen = document.querySelector('.main-game')
    const shipPlacementScreen = document.querySelector('.ship-placement')
    mainGameScreen.style.display = 'flex'
    shipPlacementScreen.style.display = 'none'
}

function openShipPlacement(){
    const mainGameScreen = document.querySelector('.main-game')
    const shipPlacementScreen = document.querySelector('.ship-placement')
    mainGameScreen.style.display = 'none'
    shipPlacementScreen.style.display = 'flex'
}

function toggleOrientationButton(){
    const toggleButton = document.querySelector('.ship-orientation')
    toggleButton.addEventListener( 'click' , () => {
        const orientation = toggleButton.getAttribute('data-orientation')
        if( orientation === 'horizontal' ){
            toggleButton.dataset.orientation = 'vertical'
            toggleButton.textContent = 'Vertical'
        }
        else{
            toggleButton.dataset.orientation = 'horizontal'
            toggleButton.textContent = 'Horizontal'
        }
    })
}

function beginGame( player ){
    const beginGame = document.querySelector('.begin-game')
    const playerOneMainGrid = document.querySelector('.player-one .game-grid')

    beginGame.addEventListener('click' , () => {
        openMainGame()
        setUpEnemyGrid()
        styleAllShipsOnGrid(player, playerOneMainGrid)
    })
}

function styleAllShipsOnGrid( player , grid ){
    player.gameboard.ships.forEach( ( ship ) => {
        const { length , coordinates , orientation } = ship
        markShipCells( coordinates[0] , coordinates[1] , orientation , length , grid )
    })
}

//Ship Placements

function hoverShip( player ){
    const ships = document.querySelectorAll('.ships')
    const currentGrid = document.querySelector('.place-ships')
    const cells = currentGrid.querySelectorAll('.cell')

    let selectedShip = { size: 0, name: '' }
    
    ships.forEach( ( ship ) => {
        ship.addEventListener('click' , () => {
            highlightSelectedShip( ship );
            selectedShip = getShipDetails(ship)
        })
    })

    cells.forEach( ( cell ) => {
        cell.addEventListener( 'mouseenter' , () => {
            highlightCell( cell , currentGrid , selectedShip.size )
        })

        cell.addEventListener( 'mouseleave' , () => {
            removeHighlight( cells )
        })

        cell.addEventListener( 'click' , () => {
            const isShipPlaced = cellClicked( selectedShip.size , player , selectedShip.name , cell )
            if(isShipPlaced){
                selectedShip = { size : 0 , name : '' }
            }
        })
    })
}

function getOrientation(){
    return document.querySelector('.ship-orientation').getAttribute('data-orientation')
}

function getPlacementGrid(){
    return document.querySelector('.place-ships')
}

function cellClicked( shipSize , player , shipName , cell ){
    if(shipSize === 0) return alert('Pick a Ship')
            
    const colCords = Number(cell.getAttribute('data-col'))
    const rowCords = Number(cell.getAttribute('data-row'))
    const orientation = getOrientation()
    const grid = getPlacementGrid()

    const isPlaced = placeShip( shipSize , rowCords , colCords , orientation , player , shipName) 
    
    if(isPlaced){
        styleShipPlaced( rowCords , colCords , orientation , shipSize , shipName , player , grid )
    }
    
    return isPlaced
}

function styleShipPlaced( rowCords , colCords , orientation , shipSize , shipName , player , grid){
    markShipCells( rowCords , colCords , orientation , shipSize , grid )
    checkIfAllShipsArePlaced( player )
    const shipButton = document.querySelector(`[data-name='${shipName}']`)
    disableShip(shipButton)
}

function placeShip( shipSize , rowCords , colCords , orientation , player , shipName ){
    const newShip = new Ship( shipSize , shipName , orientation)
    return player.gameboard.placeShip( newShip , rowCords , colCords , orientation)
}  

function enableAutoDeploy( player ){
    const autoDeployButton = document.querySelector('.auto-deploy')
    const grid = getPlacementGrid()
    autoDeployButton.addEventListener('click' , () => {
        clearBoard( player )
        clearMarkedShippCells()
        autoDeploy( player , true , grid )
    })
}

function getShipDetails( ship ){
    return { 
        size : Number(ship.getAttribute('data-ship')), 
        name : ship.getAttribute('data-name')
    }
}

//Ship Highlighting / Styling

function highlightSelectedShip( ship ){
    removeSelectedShip()
    ship.classList.add('selected-ship')
}

function removeSelectedShip(){
    const ships = document.querySelectorAll('.ships')
    ships.forEach( ( ship ) => {
        ship.classList.remove('selected-ship')
        ship.style.pointerEvents = 'all'
    })
}

function disableShip( ship ){
    ship.classList.add('disable-ship')
    ship.style.pointerEvents = 'none'
}

function removeDisableShip(){
    const ships = document.querySelectorAll('.ships')
    ships.forEach((ship) =>{
        ship.classList.remove('disable-ship')
    })
}

function highlightCell( cell , currentGrid , shipSize ){
    const colCords = Number(cell.getAttribute('data-col'))
    const rowCords = Number(cell.getAttribute('data-row'))
    const orientation = document.querySelector('.ship-orientation').getAttribute('data-orientation')

    let selectedCells = []
    
    for(let i = 0 ; i < shipSize ; i++ ){
        const newCells = orientation === 'vertical' ? getCell( rowCords + i , colCords , currentGrid ) : getCell( rowCords , colCords + i , currentGrid )
        selectedCells.push( newCells )
    }

    selectedCells.forEach( ( selectedCell ) => {
        selectedCell.classList.add('selected')
    })
}

function removeHighlight( cells ){
    cells.forEach((selectedCell) => {
        selectedCell.classList.remove('selected')
    })
}

function markShipCells( rowCords , colCords , orientation , shipSize , currentGrid ){
    for(let i = 0 ; i < shipSize ; i++ ){
        const newCells = orientation === 'vertical' ? getCell( rowCords + i , colCords , currentGrid ) : getCell( rowCords , colCords + i , currentGrid )
        newCells.classList.add('has-ship')
    }
}

function clearMarkedShippCells(){
    const currentGrid = document.querySelector('.place-ships')
    const cells = currentGrid.querySelectorAll('.has-ship')

    cells.forEach((cell) => {
        cell.classList.remove('has-ship')
    })
}

function getCell( row , col , grid){
    return  grid.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`)
}

//Auto Deploy

function getRandomOrientation(){
    const orientation = [ 'vertical' , 'horizontal' ]
    return orientation[(randomNum( 2 )) % 2]
}

function autoDeploy( player , style = true , grid ){
    const shipInfo = {'Carrier' : 5 , 'Battleship' : 4 , 'Cruiser' : 3 , 'Submarine' : 3 , 'Destroyer' : 2 }

    for( const shipName in shipInfo ){
        const shipSize = shipInfo[shipName]
        let isShipPlaced = false

        while(!isShipPlaced){
            const randomCol = randomNum( 10 )
            const randomRow = randomNum( 10 )
            const randomOrientation = getRandomOrientation()

            isShipPlaced = placeShip( shipSize , randomRow , randomCol , randomOrientation , player , shipName)
            if( isShipPlaced && style ){
                styleShipPlaced( randomRow , randomCol , randomOrientation , shipSize , shipName , player , grid)
            }
        }
    }
    console.log(player)
}

function randomNum( max ){
    return Math.floor(Math.random() * max )
} 

//Game Control

function checkIfAllShipsArePlaced( player ){
    if ((player.gameboard.ships).length === 5){
        document.querySelector('.begin-game').disabled = false
        beginGame( player )
    }
}

function clearBoard( player ){
    player.gameboard.clearPlayerBoard()
}

function resetGame( player ){
    const resetButtons = document.querySelectorAll('.reset')
    resetButtons.forEach((resetButton) => {
        resetButton.addEventListener('click' , () => {
            player.gameboard.clearPlayerBoard()
            clearMarkedShippCells()
            openShipPlacement()
            removeSelectedShip()
            removeDisableShip()
        })
    })
}

//Game Setup

function createPlayer( name ){
    const playerOne = new Player( name )
    return playerOne
}








//begin game

function getEnemyGrid(){
    return document.querySelector('.player-two-grid')
}

function setUpEnemyGrid(){
    const grid = getEnemyGrid()
    const enemy = createPlayer('Enemy')
    autoDeploy( enemy , false , grid )
    



    //Remember to remove later
    console.log(enemy)
    styleAllShipsOnGrid(enemy, grid)
    enemyGrid( enemy )
}

function enemyGrid( enemy ){
    const enemyGrid = getEnemyGrid()
    const cells = enemyGrid.querySelectorAll('.cell')

    cells.forEach((cell) => {
        cell.addEventListener('click' , () => {
            const col = Number(cell.getAttribute('data-col'))
            const row = Number(cell.getAttribute('data-row'))

            const isHit = enemy.gameboard.receiveAttack( row , col )

            if( isHit ) console.log(enemy)
            else console.log('Miss')
        })
    })
}

