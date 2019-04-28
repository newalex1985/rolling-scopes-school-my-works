var state;
var currentColor;
var prevColor;

function init() {
    
    state = 1;
    currentColor = "green";
    prevColor = "red";

    var divCurrentColor = document.querySelector('.current-color');
    var divPrevColor = document.querySelector('.prev-color');
    divCurrentColor.style.backgroundColor = currentColor;
    divCurrentColor.setAttribute('title', currentColor);
    divPrevColor.style.backgroundColor = prevColor;
    divPrevColor.setAttribute('title', prevColor);

}

function toolsClick(e) {
    
    var tool = e.target.getAttribute('data-tool');

    switch (tool) {
        case 'paint-bucket':
            state = 1;
            break;
        case 'choose-color':
            state = 2;
            break;
        case 'move':
            state = 3;
            break;
        case 'transform':
            state = 4;
            break;
        default:
            state = 1;
    }
}

function canvasClick(e) {

    target = e.target;

    if (target.hasAttribute('data-figure')) {

        if (state == 1) {
            target.style.backgroundColor = currentColor;
        }

    }
}

function chooseColorClick(e) {

    target = e.target;
    
    if (target.hasAttribute('data-color')) {
        if (state == 2) {
            prevColor = currentColor;
            currentColor = target.getAttribute('data-color');
            var divCurrentColor = document.querySelector('.current-color');
            var divPrevColor = document.querySelector('.prev-color');
            divCurrentColor.style.backgroundColor = currentColor;
            divCurrentColor.setAttribute('title', currentColor);
            divPrevColor.style.backgroundColor = prevColor;
            divPrevColor.setAttribute('title', prevColor);
        }
    }
}

init();

var divTools = document.querySelector('.tools');
divTools.addEventListener('click', toolsClick);

var divChooseColor = document.querySelector('.choose-color');
divChooseColor.addEventListener('click', chooseColorClick);

var divCanvas = document.querySelector('.canvas');
divCanvas.addEventListener('click', canvasClick);
