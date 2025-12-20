( function() {
    openShipPlacement()
    renderingBoardCells()
})()

function renderingBoardCells(){
    const grids = document.querySelectorAll('.game-grid')
    grids.forEach( ( grid ) => {
        for( let i = 0 ; i < 11 ; i++ ){
            for( let j = 0 ; j < 11 ; j++ ){
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

                if ( i === 0 && j === 0 ) cell.classList.add('game-header')
                grid.appendChild(cell)

            }
        }
    })
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
