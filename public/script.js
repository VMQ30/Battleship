import { Ship , Player} from './class.js'

( function() {
    const playerOne = createPlayer( 'Player One' )
    setUpGame( playerOne )
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

function beginGame(){
    const beginGame = document.querySelector('.begin-game')
    beginGame.addEventListener('click' , () => {
        openMainGame()
    })
}

//Ship Placements

function hoverShip( player ){
    const ships = document.querySelectorAll('.ships')
    const currentGrid = document.querySelector('.place-ships')
    const cells = currentGrid.querySelectorAll('.cell')
    let shipSize = 0
    let shipName = ''
    
    ships.forEach( ( ship ) => {
        ship.addEventListener('click' , () => {
            highlightSelectedShip( ship );
            ({ shipSize, shipName } = getShipDetails(ship))
        })
    })

    cells.forEach( ( cell ) => {
        cell.addEventListener( 'mouseenter' , () => {
            highlightCell( cell , currentGrid , shipSize )
        })

        cell.addEventListener( 'mouseleave' , () => {
            removeHighlight( cells )
        })

        cell.addEventListener( 'click' , () => {
            if(shipSize === 0) return alert('Pick a Ship')
            
            const colCords = Number(cell.getAttribute('data-col'))
            const rowCords = Number(cell.getAttribute('data-row'))
            const orientation = document.querySelector('.ship-orientation').getAttribute('data-orientation')

            const isShipPlaced = placeShip( shipSize , rowCords , colCords , orientation , player , shipName) 
            
            if(isShipPlaced){
                shipSize = 0
                shipName = ''
            }
            
        })
    })
}

function placeShip( shipSize , rowCords , colCords , orientation , player , shipName ){
    const newShip = new Ship( shipSize , shipName )
    const isShipPlaced = player.gameboard.placeShip( newShip , rowCords , colCords , orientation)

    if(isShipPlaced){
        markShipCells( rowCords , colCords , orientation , shipSize )
        checkIfAllShipsArePlaced( player )
        const shipButton = document.querySelector(`[data-name='${shipName}']`)
        disableShip(shipButton)
        return true
    }

    console.log(player)
    return false
}  

function enableAutoDeploy( player ){
    const autoDeployButton = document.querySelector('.auto-deploy')
    autoDeployButton.addEventListener('click' , () => {
        clearBoard( player )
        clearMarkedShippCells()
        autoDeploy( player )
    })
}

function getShipDetails( ship ){
    const shipSize =  Number(ship.getAttribute('data-ship'))
    const shipName = ship.getAttribute('data-name')
    return { shipSize , shipName }
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

function markShipCells( rowCords , colCords , orientation , shipSize ){
    const currentGrid = document.querySelector('.place-ships')

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

function autoDeploy( player ){
    const shipInfo = {'Carrier' : 5 , 'Battleship' : 4 , 'Cruiser' : 3 , 'Submarine' : 3 , 'Destroyer' : 2 }
    const orientation = [ 'vertical' , 'horizontal' ]

    for( const shipName in shipInfo ){
        const shipSize = shipInfo[shipName]
        let isShipPlaced = false

        while(!isShipPlaced){
            const randomCol = randomNum( 10 )
            const randomRow = randomNum( 10 )
            const randomOrientation = orientation[(randomNum( 2 )) % 2]
            isShipPlaced = placeShip( shipSize , randomRow , randomCol , randomOrientation , player , shipName)
        }
    }
}

function randomNum( max ){
    return Math.floor(Math.random() * max )
} 

//Game Control

function checkIfAllShipsArePlaced( player ){
    if ((player.gameboard.ships).length === 5){
        document.querySelector('.begin-game').disabled = false
        beginGame()
    }
}

function clearBoard( player ){
    player.gameboard.clearPlayerBoard()
}

function resetGame( player ){
    const resetButtons = document.querySelectorAll('.reset')
    resetButtons.forEach((resetButton) => {
        resetButton.addEventListener('click' , () => {
            console.log('hi')
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








