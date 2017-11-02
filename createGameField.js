'use strict';

let SIZE,
    NUMBEROFBOMBS,
    ISEND,
    bombsLeft,
    body,
    divParent,
    bombsCoordinates;

// Надлежащее окончания для вывода количества бомб
function getNumEnding(iNumber) {   
    let aEndings = ['у','ы',''];
    var sEnding, i;
    iNumber = iNumber % 100;
    if (iNumber>=11 && iNumber<=19) {
        sEnding=aEndings[2];
    }
    else {
        i = iNumber % 10;
        switch (i)
        {
            case (1): sEnding = aEndings[0]; break;
            case (2):
            case (3):
            case (4): sEnding = aEndings[1]; break;
            default: sEnding = aEndings[2];
        }
    }
    return sEnding;
}

// Разный цвет для числа бомб
function selectColorForNumber(number) {
    switch(number){
        case 1:
            return '#0000FF';
        case 2:
            return '#008000';
        case 3:
            return '#FF0000';
        case 4:
            return '#00008B';
        case 5:
            return '#8B0000';    
    }
}

// Установка класса всех ячеек таблицы как clicked
// Необходимо в конце игры
function setAllClicked() {
    let tds = document.getElementsByTagName('td');
    for (let i = 0; i < tds.length; ++i) {
        if (!tds[i].classList.contains('clicked')){
            tds[i].classList.add('clicked');
        }
    }
}

// Проверка условия выигрыша
function checkIfWin() {
    let clickedElements = document.getElementsByClassName("clicked");
	//console.log(SIZE*SIZE - clickedElements.length, NUMBEROFBOMBS);
    if (SIZE*SIZE - clickedElements.length  ===  NUMBEROFBOMBS) return true;
    return false;
}

// Удаления из DOM всплывающего окна о выигрыше/проигрыше
function deletePopUpMenu() {
    body.removeChild(document.getElementById('popup-div'));
    newGame();
}

// Добавление в DOM всплывающего окна о выигрыше/проигрыше
function showPopUpMenu(text) {
    setAllClicked();
    ISEND = true;
    let template = document.getElementById('template-popup');
    let div = document.createElement('div');
    div.setAttribute('id', 'popup-div');
    div.setAttribute('class', 'absolute');
    div.innerHTML = template.textContent.replace("{{text}}", text); 
    body.appendChild(div);
}

// Установка флага на ячейку
function setFlag(cell){
    //console.log(checkIfWin());
    if (!ISEND && (cell.tagName === 'TD') ) {
        if  (!cell.classList.contains('flag') && !cell.classList.contains('clicked')&& bombsLeft>0){
                cell.innerHTML += '&#9873';
                cell.classList.add('flag');
                //cell.classList.add('clicked');

                bombsLeft-=1;
                updateBombsNumber(bombsLeft);
            }
        else if(cell.classList.contains('flag') && !checkIfWin()) {
                cell.innerHTML = '';
                cell.classList.remove('flag');
                //cell.classList.remove('clicked');
                bombsLeft+=1;
                updateBombsNumber(bombsLeft);
            }

    }
}

// На правый клик - установка флажка
function rightclick(cell) {
    let rightclick;
    let e = window.event;
    if (e.which) rightclick = (e.which === 3);
    else if (e.button) rightclick = (e.button === 2);
    setFlag(cell);
}

// Вызывается при клике на ячейку
function cellClicked(cell){
    if (!cell.classList.contains('clicked') && (cell.tagName === 'TD')
		&& (!cell.classList.contains('flag'))){
        if (find(bombsCoordinates, [cell.cellIndex, cell.parentNode.rowIndex])){
            cell.innerHTML += '&#9881';
            cell.className = "red";
            cell.classList.add('clicked');
                    // GAME OVER
            showPopUpMenu('Вы проиграли!');
        } else {
                let bombNumber = numberOfBombsNear(cell);
                if (bombNumber === 0) {
                    cell.className = 'grey';
                    cell.classList.add('clicked');
                    emptyCell(cell);
                }
                else {
					cell.style.color = selectColorForNumber(bombNumber);
                    cell.innerHTML += bombNumber;
                    cell.style.color = selectColorForNumber(bombNumber);
                    cell.classList.add('clicked');
                    }
                if (checkIfWin()) {
                    showPopUpMenu('Вы выиграли!');
                }
            }

        }
}

// Если бомб рядом с ячейкой не оказалось
function emptyCell(cell){

    for (let i = cell.cellIndex-1; i <= cell.cellIndex + 1; i++) {
        for (let j = cell.parentNode.rowIndex-1; j <= cell.parentNode.rowIndex + 1; j++) {
            if ((i >=0 && i < SIZE) && (j >=0 && j < SIZE) ) {
                let newCell = document.getElementById('myTable').rows[j].cells[i];
                let neWbombNumber = numberOfBombsNear(newCell);

                if (!newCell.classList.contains('clicked') && (!newCell.classList.contains('flag'))) {
                    if (neWbombNumber === 0) {
                        newCell.className = 'grey';
                        newCell.classList.add('clicked');
                        emptyCell(newCell);
                    }
                    else {
                        newCell.classList.add('clicked');
						
                        //newCell.classList.add(selectColorForNumber(neWbombNumber));
						newCell.style.color = selectColorForNumber(neWbombNumber);
                        newCell.innerHTML += neWbombNumber;
                        
						

                    }

                }
            }
        }

    }
}

// Вычисляет число бомб рядом с ячейкой
function numberOfBombsNear(cell){
    let count = 0;
    for (let i = cell.cellIndex-1; i <= cell.cellIndex + 1; i++) {
        for (let j = cell.parentNode.rowIndex-1; j <= cell.parentNode.rowIndex + 1; j++) {
            if ((i >=0 && i <= SIZE) && (j >=0 && j <= SIZE) ) {
                if (find(bombsCoordinates, [i, j])){
                    count+=1;
                }
            }
        }
        
    }
    return count;
}

// Отрисовка оставшегося числа бомб 
function showBombsNumber(bombs) {
    let template = document.getElementById('template-bomb-number');
    let div = document.createElement('div');
    div.setAttribute('id', 'div-bomb-message');
    div.innerHTML = template.textContent.replace("{{bomb_number}}", bombs).replace("{{end}}", getNumEnding(bombs));
    //div.innerHTML = template.textContent.replace("{{end}}", getNumEnding(bombs));
    divParent.insertBefore(div, document.getElementById('myTable'))
    //divParent.appendChild(div);
}

// Обновление числа оставшихся бомб
function updateBombsNumber(bombs) {
    let div = document.getElementById('div-bomb-message');
    if (div) divParent.removeChild(div);
    
    showBombsNumber(bombs)
}

// Создание поля
function tableCreate(n) {
    
    divParent = document.createElement('div');
    divParent.setAttribute('id', 'container-table-bomb-messege');

    let tbl = document.createElement('table');

    divParent.appendChild(tbl);

    tbl.setAttribute('id', 'myTable');
    tbl.setAttribute('onclick', 'cellClicked(event.target)');
    //tbl.setAttribute('onmousedown', 'rightclick(event.target)');
    tbl.setAttribute('oncontextmenu', 'setFlag(event.target);return false;');
    for (let i = 0; i < n; i++) {
        let tr = document.createElement('tr');
        
        for (let j = 0; j < n; j++) {
            let td = document.createElement('td');
            tr.appendChild(td);
            td.classList.add('t');
            //td.innerHTML += '⚑';

        }
        tbl.appendChild(tr);
    }
    body.appendChild(divParent);
}

// Ищет элемент в массиве
function find(array, value) {
    for (let i = 0; i < array.length; i++) {
        if ((array[i][0] === value[0]) && (array[i][1] === value[1])) return true;
    }

      return false;
    }

// Генерация случайной координаты
function getRandomCoordinate() {
  return [Math.floor(Math.random() * (SIZE)), Math.floor(Math.random() * (SIZE))];
}

// Генерация неповторяющихся случайных координат
function generateBombsCoordinates () {
    let arrayRandomNumbers = [],
        N = NUMBEROFBOMBS;
    while (N){
        let coordinate = getRandomCoordinate();
        if (find(arrayRandomNumbers, coordinate) !== true ){
            N -=1;
            arrayRandomNumbers.push(coordinate)
        }
    }
    return arrayRandomNumbers;
}

// Для каждой новой игры
function newGame() {
    SIZE = Number(prompt('Введите размер поля ', 10));
    NUMBEROFBOMBS = Number(prompt('Введите количество бомб', 8));
    //if (SIZE < 5 || SIZE > 10) SIZE = 10;
    //if (NUMBEROFBOMBS < 1 || NUMBEROFBOMBS > 10) NUMBEROFBOMBS = 5;
    bombsCoordinates = generateBombsCoordinates();
    body = document.getElementsByTagName('body')[0];

    bombsLeft = NUMBEROFBOMBS;
    divParent = document.getElementById('container-table-bomb-messege');
    ISEND = false;
    if (divParent) body.removeChild(divParent);

    //bombsCoordinates = generateBombsCoordinates();
    tableCreate(SIZE);
    updateBombsNumber(NUMBEROFBOMBS);
}

newGame();
//console.log(selectColorForNumber(1));
