class GameOfLife {
  constructor(width, height) {
    this.canvas = new Canvas()
    this.canvas.canvas.addEventListener('click', (e) => this.mouseClick(e))
    this.lastExecute = Date.now()
    this.colorAlive = 'rgb(0, 219, 0)'
    this.bordeSize = {
      width: width,
      height: height,
    }
    this.CellSize = {
      width: this.canvas.width / this.bordeSize.width,
      height: this.canvas.height / this.bordeSize.height,
    }
    this.Cells = []
    this.startCells()
    this.startNears()
  }

  mouseClick(e) {
    let positionX = Math.trunc(e.layerX / this.CellSize.width)
    let positionY = Math.trunc(e.layerY / this.CellSize.height)
    let cell = this.Cells[positionY][positionX]
    cell.alive = +!cell.alive
    this.renderCell(cell)
  }

  startCells() {
    for (var y = 0; y < this.bordeSize.width; y++) {
      let line = []
      this.Cells.push(line)
      for (var x = 0; x < this.bordeSize.width; x++) {
        let cell = {
          alive: getRandomInt(0, 2),
          x: x * this.CellSize.width,
          y: y * this.CellSize.height,
          next: 0,
        }
        line.push(cell)
      }
    }
  }
  startNears() {
    this.Cells.forEach((line, y) => {
      line.forEach((cell, x) => {
        cell.nears = []
        for (var deltaY = -1; deltaY <= 1; deltaY++) {
          for (var deltaX = -1; deltaX <= 1; deltaX++) {
            if (deltaX !== 0 || deltaY !== 0) {
              let nearX = x + deltaX
              let nearY = y + deltaY
              if (
                nearX >= 0 &&
                nearX < this.bordeSize.width &&
                nearY >= 0 &&
                nearY < this.bordeSize.height
              ) {
                let nearCell = this.Cells[nearY][nearX]
                cell.nears.push(nearCell)
              }
            }
          }
        }
      })
    })
  }
  clearCells() {
    this.Cells.forEach((line) => {
      line.forEach((cell) => {
        cell.alive = 0
      })
    })
  }

  calculateCell() {
    this.Cells.forEach((line) => {
      line.forEach((cell) => {
        let near = 0
        cell.nears.forEach((nearCell) => {
          near += nearCell.alive
        })
        if (cell.alive) {
          cell.next = +(near >= 2 && near <= 3)
        } else {
          cell.next = +(near == 3)
        }
      })
    })
  }
  update() {
    this.Cells.forEach((line) => {
      line.forEach((cell) => {
        cell.alive = cell.next
      })
    })
  }

  render() {
    this.Cells.forEach((line) => {
      line.forEach((cell) => {
        this.renderCell(cell)
      })
    })
  }
  renderCell(cell) {
    this.canvas.rectangle(
      cell.x,
      cell.y,
      this.CellSize.width,
      this.CellSize.height,
      'black',
      'white',
    )
    if (cell.alive) {
      let x = cell.x + 1
      let y = cell.y + 1
      this.canvas.rectangle(
        x,
        y,
        this.CellSize.width - 2,
        this.CellSize.height - 2,
        this.colorAlive,
        this.colorAlive,
      )
    }
  }
  execute() {
    let time = Date.now() - this.lastExecute

    if (time >= 50) {
      this.lastExecute = Date.now()
      this.calculateCell()
      this.update()
      this.render()
    }
  }
}

var game = new GameOfLife(30, 30)
var idAnimation

function executeGame() {
  game.execute()
  idAnimation = requestAnimationFrame(executeGame)
}

// Buttons start,stop,clear //
let btnStart = document.getElementById('start')
btnStart.onclick = () => {
  if (!idAnimation) idAnimation = requestAnimationFrame(executeGame)
}

let btnStop = document.getElementById('stop')
btnStop.onclick = () => {
  if (idAnimation) cancelAnimationFrame(idAnimation)
  idAnimation = 0
}

let btnClear = document.getElementById('clear')
btnClear.onclick = () => {
  if (idAnimation) cancelAnimationFrame(idAnimation)
  idAnimation = 0
  game.clearCells()
  game.render()
}
// Buttons start,stop,clear //
game.render()
