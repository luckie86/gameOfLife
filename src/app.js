(function() {
    /*
     * Implement Game of Life
     * Rules: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
     * no jquery
     *
     ******
     * buttons:
     * start: start the game (when game is started button is disabled)
     * stop: stops the game (when game is stopped button is disabled)
     * reset: clear the board
     *
     */

    var cells;   // array of all the cell DOM items, used for UI manipulation. TODO: Implement (hint: research how to select elements with javascript)

    var intervalTimer = 500; // how often does a game tick happen. TODO: make this customisable from the UI (dropdown, slider, etc.) e.g. SLOW, NORMAL, FAST
    
    var boardHeight = 50; // number of cells verticaly
    var boardWidth = 50; // number of cells horizontaly 
    var gameBoard = []; // 2d array that represents the game board, used for logic. TODO: Implement
    var interval;
    var x;
    var y;
    
    var LWSS = [[0,1,1], [1,2,1], [2,0,1], [2,1,1], [2,2,1]]
    var MWSS = [[0,3,1], [1,1,1], [1,5,1], [2,0,1], [3,0,1], [3,5,1], [4,0,1], [4,1,1], [4,2,1], [4,3,1], [4,4,1]]
    var HWSS = [[0,3,1], [0,4,1], [1,1,1], [1,6,1], [2,0,1], [3,0,1], [3,6,1], [4,0,1], [4,1,1], [4,2,1], [4,3,1], [4,4,1], [4,5,1],]

    var GLIDER = {
        width: 3,
        height: 3,
        design: [
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 1]
        ]
    };

    /*
     * This is the game init function. It adds an integer value to the id attribute of all the given elements.
     * TODO: It should add click handling for every given cell
     */

    function generateTable () {
        let divToAppend = document.getElementById("table");
        let table = document.createElement("table");

        for (let i = 0; i < boardHeight; i++) {
            let row = document.createElement("tr");

            for (let j = 0; j < boardWidth; j++) {
                var cell = document.createElement("td");
                cell.className = "cell";
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        divToAppend.appendChild(table);
        table.classList.add("gameboard");
    }

    function setupGameBoard(cells) {
        var counter = 0;
        cells.forEach(function(cell) {
            cell.id = counter++;
            
            cell.addEventListener("click", onCellClick)
        });
    }

    /*
     * This function initialises the game board. It sets up the 2d array and prefills it with 0.
     */
    function initGameBoard(boardHeight, boardWidth) {  
        let array = new Array(boardHeight);
        for (let i=0; i<array.length; i++) {
            array[i] = new Array(boardWidth);
        }
        return array;    
    }
    
    function setUpGrid() {
        gameBoard = initGameBoard(boardHeight, boardWidth);
        for(let i=0; i<boardHeight; i++) {
            for(let j=0; j<boardWidth; j++){
                gameBoard[i][j] = 0;
            }
        }
    }
    // Callback that is called when a single cell is clicked.
    function onCellClick(event) {
        // If empty cell is clicked it gets the 'active' class, if a full cell is clicked the 'active' class is removed
        // ...
        let cellNumber = this.id;
        x = cellNumber % boardWidth;
        y = Math.floor(cellNumber / boardWidth);
        if (!this.classList.contains("active")) {
            this.classList.add("active");
            gameBoard[y][x] = 1;
        } else {
            this.classList.remove("active");
            gameBoard[y][x] = 0;
        }

        if (gameBoard[x][y] == 1 ) {
            let cell = document.getElementById((x)+(y)*boardWidth);
            console.log("je šlo v if");
            cell.classList.remove("active")
            gameBoard[x][y] = 0;
        }

        console.log("pred handle");
        handleSpaceShips();

    }


    function startGame() {
        // start the game
        // set an interval that runs every 'intervalTimer' milliseconds.
        interval = setInterval(function(){            
            tick();
        }, intervalTimer);
    }

    // Callback that is called on every game tick.
    function tick() {

        // Compute next
        let next = initGameBoard(boardHeight,boardWidth);
        for (let i = 0; i < boardHeight; i++) {
            for (let j = 0; j < boardWidth; j++) {
                let state = gameBoard[i][j];
                // Count live neighbors!
                let neighbors = countNeighbors(gameBoard, i, j);

                if (state == 0 && neighbors == 3) {
                    next[i][j] = 1;
                } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                    next[i][j] = 0;
                } else {
                    next[i][j] = state;
                }
            }
        }
        gameBoard = next;

        function countNeighbors(gameBoard, x, y) {
            let sum = 0;
            for (let i = -1; i < 2; i++) {
              for (let j = -1; j < 2; j++) {
                let col = (x + i + boardHeight) % boardHeight;
                let row = (y + j + boardWidth) % boardWidth;
                sum += gameBoard[col][row];
              }
            }
            sum -= gameBoard[x][y];
            return sum;
        }

        // Draw
        for (let i = 0; i < boardHeight; i++) {
            for (let j = 0; j < boardWidth; j++) {
                let cell = document.getElementById(j+i*boardWidth);
                if (gameBoard[i][j] == 1) {
                    if (!cell.classList.contains("active")) {
                        cell.classList.add("active");
                  } 
                  } else if (gameBoard[i][j] == 0) {
                      cell.classList.remove("active");
                  }
              }
          }
    }

    let button = document.getElementById("resizeGameboard");
    button.addEventListener("click", gameBoardCreation);

    function gameBoardCreation(callback) {
    // ...
        document.getElementById("table").innerHTML= "";
        boardHeight = parseInt(document.getElementById("boardHeight").value);
        boardWidth = parseInt(document.getElementById("boardWidth").value);   
        handleIntervalTimer();
        generateTable(callback);
        event.preventDefault();
        cells = document.querySelectorAll(".cell");
        setupGameBoard(cells);
        setUpGrid();
    }

    function onGameStart() {
        // ...
        let button = document.getElementById("Start");
        button.addEventListener("click", function () {
            startGame();
            setGameIndicator(true);
            //button.disabled = true;
        });
    }

    function onGameStop() {
        // ...
        let button = document.getElementById("Stop");
        button.addEventListener("click", function () {
            clearInterval(interval);
            setGameIndicator(false);
        });
    }

    function onGameReset() {
        // ...
        let button = document.getElementById("Reset");
        button.addEventListener("click", function () {
            setUpGrid();
            tick();
            setGameIndicator(false);
        });
    }

    function handleIntervalTimer () {
        let dropdown = document.getElementById("Dropdown");
        dropdown.addEventListener("change", function(event){
            if (dropdown.options[dropdown.selectedIndex].text === "Slow") {
                intervalTimer = 1000;
            } else if (dropdown.options[dropdown.selectedIndex].text === "Normal") {
                intervalTimer = 500;
            } else if (dropdown.options[dropdown.selectedIndex].text === "Fast") {
                intervalTimer = 250;
            }
        }, false);
    }

    function handleSpaceShips () {
        let dropdown = document.getElementById("dropDown2");
        //dropdown.addEventListener("change", function(){
            if (dropdown.options[dropdown.selectedIndex].text === "LWSS") {
                createGlider(x,y,true);
                console.log("je šlo");
            } else if (dropdown.options[dropdown.selectedIndex].text === "MWSS") {
                createMWSS();
            } else if (dropdown.options[dropdown.selectedIndex].text === "HWSS") {
                createHWSS();
            }
        //}, false);
    }
   
    function createGlider(x,y, condition) {
        if(condition) {
            console.log(gameBoard[x][y]);
        for (let i = 0; i < GLIDER.width; i++) {
            for (let j = 0; j < GLIDER.height; j++) {
                let cell = document.getElementById((j+x)+(i+y)*boardWidth);
                
                    if (GLIDER.design[i][j] == 1) {
                        if (!cell.classList.contains("active")) {
                            cell.classList.add("active");
                            gameBoard[i+y][j+x]=1;
                        }   
                    }
                }
            } 
        }   
    }

    function createLWSS() {
        for (let i = 0; i < LWSS.length; i++) {
            let x = LWSS[i][1];
            let y = LWSS[i][0];
            let cell = document.getElementById(x+y*boardWidth);
            cell.classList.add("active");
            gameBoard[x][y] = 1;
        }
    }
    
    function createMWSS() {
        for (let i = 0; i < MWSS.length; i++) {
            let x = MWSS[i][1];
            let y = MWSS[i][0];
            let cell = document.getElementById(x+y*boardWidth);
            cell.classList.add("active");
            gameBoard[x][y] = 1;
        }
    }

    function createHWSS() {
        for (let i = 0; i < HWSS.length; i++) {
            let x = HWSS[i][1];
            let y = HWSS[i][0];
            let cell = document.getElementById(x+y*boardWidth);
            cell.classList.add("active");
            gameBoard[x][y] = 1;
        }
    }

    function defaultGameBoardCreation(boardHeight,boardWidth) {
        // ... 
            handleIntervalTimer();
            generateTable();
            cells = document.querySelectorAll(".cell");
            setupGameBoard(cells);
            setUpGrid();
        }

    function setGameIndicator(status) {
        if (status) {
            let ledlight = document.getElementById("led");
            console.log(ledlight);
            ledlight.classList.remove("led-red");
            ledlight.classList.add("led-green");
        } else {
            let ledlight = document.getElementById("led");
            ledlight.classList.remove("led-green");
            ledlight.classList.add("led-red");
        }
    } 

    /////////////////////////////////////

    defaultGameBoardCreation();

    onGameStart();

    onGameReset();

    onGameStop();

  
})();

