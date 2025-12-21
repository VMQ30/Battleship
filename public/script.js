import { Ship , Gameboard , Player} from './class.js'

( function() {
    const playerOne = createPlayer()
    openShipPlacement()
    renderingBoardCells()
    toggleOrientationButton()
    hoverShip( playerOne )
})()

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

    if ( i === 0 && j !== 0 ){
        const letterHeader = document.createElement('p')
        letterHeader.textContent = String.fromCharCode( 65 + (j - 1) )
        cell.appendChild(letterHeader)
        cell.classList.add('game-header')
    }

    if ( i !== 0 && j === 0 ){
        const letterHeader = document.createElement('p')
        letterHeader.textContent = i
        cell.appendChild(letterHeader)
        cell.classList.add('game-header')
    }

    if ( i !== 0 && j !== 0 ) {
        cell.dataset.row = i - 1
        cell.dataset.col = j - 1
        cell.classList.add('cell')
    } 

    if ( i === 0 && j === 0 ) cell.classList.add('game-header')
    
    grid.appendChild(cell)
}

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

function highlightSelectedShip( ships , ship ){
    removeSelectedShip( ships )
    ship.classList.add('selected-ship')
}

function removeSelectedShip( ships ){
    ships.forEach( ( ship ) => {
        ship.classList.remove('selected-ship')
    })
}

function disableShip( ship ){
    ship.classList.add('disable-ship')
    ship.style.pointerEvents = 'none'
}

function getShipDetails( ship ){
    const shipSize =  Number(ship.getAttribute('data-ship'))
    const shipName = ship.getAttribute('data-name')
    return { shipSize , shipName }
}

function hoverShip( playerOne ){
    const ships = document.querySelectorAll('.ships')
    const currentGrid = document.querySelector('.place-ships')
    const cells = currentGrid.querySelectorAll('.cell')
    let shipSize = 0
    let shipName = ''
    
    ships.forEach( ( ship ) => {
        ship.addEventListener('click' , () => {
            highlightSelectedShip( ships , ship );
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
            if(shipSize === 0) { alert('Pick a Ship') }
            else{ 
                placeShip( shipSize , cell , playerOne , shipName) 
                const shipButton = document.querySelector(`[data-name='${shipName}']`)
                disableShip(shipButton)
                shipSize = 0
            }
        })
    })
}

function placeShip( shipSize , cell , player , shipName ){
    const colCords = Number(cell.getAttribute('data-col'))
    const rowCords = Number(cell.getAttribute('data-row'))
    const toggleButton = document.querySelector('.ship-orientation')
    const orientation = (toggleButton.getAttribute('data-orientation'))

    const newShip = new Ship( shipSize , shipName )
    player.gameboard.placeShip( newShip , rowCords , colCords , orientation)

    console.log(player)

    markShipCells( rowCords , colCords , orientation , shipSize )
    checkIfAllShipsArePlaced( player )
}

function markShipCells( rowCords , colCords , orientation , shipSize ){
    const currentGrid = document.querySelector('.place-ships')

    for(let i = 0 ; i < shipSize ; i++ ){
        const newCells = orientation === 'vertical' ? getCell( rowCords + i , colCords , currentGrid ) : getCell( rowCords , colCords + i , currentGrid )
        newCells.classList.add('has-ship')
    }
}

function highlightCell( cell , currentGrid , shipSize ){
    const colCords = Number(cell.getAttribute('data-col'))
    const rowCords = Number(cell.getAttribute('data-row'))
    const toggleButton = document.querySelector('.ship-orientation')
    const orientation = (toggleButton.getAttribute('data-orientation'))

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

function getCell( row , col , grid){
    return  grid.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`)
}

function createPlayer( name ){
    const playerOne = new Player( name )
    return playerOne
}

function checkIfAllShipsArePlaced( player ){
    if ((player.gameboard.ships).length === 5){
        const beginButton = document.querySelector('.begin-game')
        beginButton.disabled = false
    }
}