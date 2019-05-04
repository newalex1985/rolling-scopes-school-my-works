var state = {
    id: 1,
    name: 'paint-bucket' 
};
var currentColor = 'green';
var prevColor = 'red';

init();
window.addEventListener('unload', exit);

var divTools = document.querySelector('.tools');
divTools.addEventListener('click', toolsClick);

var divChooseColor = document.querySelector('.choose-color');
divChooseColor.addEventListener('click', chooseColorClick);

var divCanvas = document.querySelector('.canvas');
divCanvas.addEventListener('click', canvasClick);
divCanvas.addEventListener('mousedown', canvasMosedown);
divCanvas.addEventListener('dragstart', () => false);

function CreateFigureObject(id = '', position = '', left = '', top = '', backgroundColor = '', circle = '') {
    this.id = id;
    this.position = position;
    this.left = left;
    this.top = top;
    this.backgroundColor = backgroundColor;
    this.circle = circle;
}

function fillFigureState(figureState) {

    for (var i = 0; i < 9; i++) {
        figureState.push(new CreateFigureObject());
    }
}

function exit() {
    saveLS();
}

function saveLS() {

    var figureState = [];
    fillFigureState(figureState);

    var serialState = JSON.stringify(state);
    localStorage.setItem('state', serialState);

    localStorage.setItem('currentColor', currentColor);
    localStorage.setItem('prevColor', prevColor);

    var localFigState = [].slice.call(document.querySelectorAll('.sceleton > div'));

    figureState.forEach(function (item, i, arr) {
        item.id = localFigState[i].dataset.figure;
        item.position = localFigState[i].style.position;
        item.left = localFigState[i].style.left;
        item.top = localFigState[i].style.top;
        item.backgroundColor = localFigState[i].style.backgroundColor;
        item.circle = localFigState[i].classList.contains('circle');
    });

    var serialFigureState = JSON.stringify(figureState);
    localStorage.setItem("figureState", serialFigureState);

}

function loadLS() {
    
    var serialState = localStorage.getItem('state');

    state = (serialState === null) ? state : JSON.parse(serialState);
    currentColor = localStorage.getItem('currentColor');
    currentColor = (currentColor === null) ? 'green' : currentColor;
    prevColor = localStorage.getItem('prevColor');
    prevColor = (prevColor === null) ? 'red' : prevColor;

    var serialFigureState = localStorage.getItem("figureState");

    var localFigState = document.querySelectorAll('.sceleton > div');

    //- chek on null
    if (serialFigureState === null) {

        for (var i = 0; i < 9; i++) {
            //id - possibly for the future
            localFigState[i].style.position = 'static';
            localFigState[i].style.backgroundColor = '#dddddd';

            if (localFigState[i].classList.contains('circle')) {
                localFigState[i].classList.remove('circle');
            }

            if (i == 6) {
                localFigState[i].classList.add('circle');
            }
        }

        return;
    }

    var figureState = JSON.parse(serialFigureState);

    for (var i = 0; i < 9; i++) {
        //id - possibly for the future
        localFigState[i].style.position = figureState[i].position;
        localFigState[i].style.left = figureState[i].left;
        localFigState[i].style.top = figureState[i].top;
        localFigState[i].style.backgroundColor = figureState[i].backgroundColor;

        if (figureState[i].circle) {
            localFigState[i].classList.add('circle');
        }
    }
}

function styleButtons(num) {

    for (var i = 1; i < 5; i++) {
        var but = document.querySelector(`.tools > div:nth-child(${i}) > button`);
        if (i == num) {
            but.style.opacity = '1';
            but.disabled = true;
        } else {
            but.style.opacity = '.4';
            but.disabled = false;
        }
    }
}

function init() {

    loadLS();
    styleButtons(state.id);

    var divCurrentColor = document.querySelector('.current-color');
    var divPrevColor = document.querySelector('.prev-color');
    divCurrentColor.style.backgroundColor = currentColor;
    divCurrentColor.setAttribute('title', currentColor);
    divPrevColor.style.backgroundColor = prevColor;
    divPrevColor.setAttribute('title', prevColor);

}

function toolsClick(e) {

    var target = e.target;

    if (target.hasAttribute('data-tool')) {
        var tool = target.dataset.tool;
        switch (tool) {
            case 'paint-bucket':
                state.id = 1;
                state.name = tool;
                break;
            case 'choose-color':
                state.id = 2;
                state.name = tool;
                break;
            case 'move':
                state.id = 3;
                state.name = tool;
                break;
            case 'transform':
                state.id = 4;
                state.name = tool;
                break;
            default:
                state.id = 1;
                state.name = 'paint-bucket';
        }

        styleButtons(state.id);
    }

    if (target.hasAttribute('data-reset')) {
        state.id = 1;
        currentColor = 'green';
        prevColor = 'red';
        styleButtons(state.id);
        var divCurrentColor = document.querySelector('.current-color');
        var divPrevColor = document.querySelector('.prev-color');
        divCurrentColor.style.backgroundColor = currentColor;
        divCurrentColor.setAttribute('title', currentColor);
        divPrevColor.style.backgroundColor = prevColor;
        divPrevColor.setAttribute('title', prevColor);

        var localFigState = document.querySelectorAll('.sceleton > div');

        for (var i = 0; i < 9; i++) {
            //id - possibly for the future
            localFigState[i].style.position = 'static';
            localFigState[i].style.backgroundColor = '#dddddd';

            if (localFigState[i].classList.contains('circle')) {
                localFigState[i].classList.remove('circle');
            }

            if (i == 6) {
                localFigState[i].classList.add('circle');
            }
        }
    }
}

function canvasClick(e) {

    var target = e.target;

    if (target.hasAttribute('data-figure')) {

        if (state.id == 1) {
            target.style.backgroundColor = currentColor;
        }

        if (state.id == 4) {
            target.classList.toggle('circle');
        }

    }
}

function chooseColorClick(e) {

    var target = e.target;

    if (target.hasAttribute('data-color')) {
        if (state.id == 2) {
            prevColor = currentColor;
            currentColor = target.dataset.color;
            var divCurrentColor = document.querySelector('.current-color');
            var divPrevColor = document.querySelector('.prev-color');
            divCurrentColor.style.backgroundColor = currentColor;
            divCurrentColor.setAttribute('title', currentColor);
            divPrevColor.style.backgroundColor = prevColor;
            divPrevColor.setAttribute('title', prevColor);
        }
    }
}


function canvasMosedown(e) {

    var elmnt = e.target;
    var movePositionX = 0, movePositionY = 0, startPositionX = 0, startPositionY = 0;

    if (elmnt.hasAttribute('data-figure')) {
        if (state.id == 3) {
            var coords = getCoords(elmnt);
            var shiftX = e.pageX - coords.left;
            var shiftY = e.pageY - coords.top;

            elmnt.style.position = 'absolute';
            elmnt.style.zIndex = 1000;

            elmnt.style.left = e.pageX - shiftX + "px";
            elmnt.style.top = e.pageY - shiftY + "px";

            // get the mouse cursor position at startup:
            startPositionX = e.pageX;
            startPositionY = e.pageY;

            elmnt.addEventListener('mouseup', closeDragElement);
            // call a function whenever the cursor moves:
            document.addEventListener('mousemove', elementDrag);
        }
    }

    function elementDrag(e) {
        // calculate the new cursor position:
        movePositionX = startPositionX - e.pageX;
        movePositionY = startPositionY - e.pageY;
        startPositionX = e.pageX;
        startPositionY = e.pageY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - movePositionY) + "px";
        elmnt.style.left = (elmnt.offsetLeft - movePositionX) + "px";
    }

    function closeDragElement() {
        //stop moving when mouse button is released:
        elmnt.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
    }
}

function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}
