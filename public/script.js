( function() {
    openShipPlacement()
    renderingBoardCells()
    toggleOrientationButton()
    placeShip()
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

                if ( i !== 0 && j !== 0 ) {
                    cell.dataset.row = i - 1
                    cell.dataset.col = j - 1
                    cell.classList.add('cell')
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

function placeShip(){
    const currentGrid = document.querySelector('.place-ships')
    const cells = currentGrid.querySelectorAll('.cell')
    const toggleButton = document.querySelector('.ship-orientation')
    cells.forEach( ( cell ) => {
        cell.addEventListener( 'mouseenter' , () => {
            const colCords = Number(cell.getAttribute('data-col'))
            const rowCords = Number(cell.getAttribute('data-row'))
            const orientation = (toggleButton.getAttribute('data-orientation'))

            if(orientation === 'vertical'){
                let selectedCells = []
                
                for(let i = 0 ; i < 5 ; i++ ){
                    const newCells = getCell( rowCords + i , colCords , currentGrid )
                    selectedCells.push( newCells )
                }

                selectedCells.forEach( ( selectedCell ) => {
                    selectedCell.classList.add('selected')
                })
            }

            else{
                let selectedCells = []
                
                for(let i = 0 ; i < 5 ; i++ ){
                    const newCells = getCell( rowCords , colCords + i , currentGrid )
                    selectedCells.push( newCells )
                }

                console.log(selectedCells)

                selectedCells.forEach( ( selectedCell ) => {
                    selectedCell.classList.add('selected')
                })
            }

        })

        cell.addEventListener( 'mouseleave' , () => {
            cells.forEach((selectedCell) => {
                selectedCell.classList.remove('selected')
            })
            
        })
    })
}

function getCell( row , col , grid){
    return  grid.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`)
}