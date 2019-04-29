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

        if (state == 4) {
            target.classList.toggle('circle');
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


function canvasMosedown(e) {
    
    var elmnt = e.target;
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (elmnt.hasAttribute('data-figure')) {
        if (state == 3) {
            var coords = getCoords(elmnt);
            var shiftX = e.pageX - coords.left;
            var shiftY = e.pageY - coords.top;
            
            elmnt.style.position = 'absolute';
            elmnt.style.zIndex = 1000;

            elmnt.style.left = e.pageX - shiftX + "px";
            elmnt.style.top = e.pageY - shiftY + "px";

            // get the mouse cursor position at startup:
            pos3 = e.pageX;
            pos4 = e.pageY;

            elmnt.addEventListener('mouseup', closeDragElement);
            // call a function whenever the cursor moves:
            document.addEventListener('mousemove', elementDrag);
        }
    }

    function elementDrag(e) {
        // calculate the new cursor position:
        pos1 = pos3 - e.pageX;
        pos2 = pos4 - e.pageY;
        pos3 = e.pageX;
        pos4 = e.pageY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
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


init();

var divTools = document.querySelector('.tools');
divTools.addEventListener('click', toolsClick);

var divChooseColor = document.querySelector('.choose-color');
divChooseColor.addEventListener('click', chooseColorClick);

var divCanvas = document.querySelector('.canvas');
divCanvas.addEventListener('click', canvasClick);
divCanvas.addEventListener('mousedown', canvasMosedown);
divCanvas.addEventListener('dragstart', () => false);
