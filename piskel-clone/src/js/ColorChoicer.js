import img from '../img/palette120_120.jpg';

class ColorChoicer {
  constructor(linkAppView) {
    this.linkAppView = linkAppView;
    this.colorChoicer = document.createElement('div');
    this.canvasChoicer = document.createElement('canvas');
    this.resultcolorChoicerR = document.createElement('div');
    this.resultcolorChoicerL = document.createElement('div');
    this.stateColor = 'L';
    this.curentColorL = `rgb(${0}, ${0}, ${0})`;
    this.curentColorR = `rgb(${255}, ${255}, ${255})`;
  }

  init(parent) {
    this.colorChoicer.classList.add('color-choicer');
    this.canvasChoicer.setAttribute('width', '120');
    this.canvasChoicer.setAttribute('height', '120');
    this.canvasChoicer.setAttribute('id', 'canvas');
    this.colorChoicer.appendChild(this.canvasChoicer);
    this.resultcolorChoicerL.classList.add('result-color-choicer');
    this.resultcolorChoicerL.classList.add('result-color-choicer-active');
    this.resultcolorChoicerR.classList.add('result-color-choicer');
    this.resultcolorChoicerL.style.backgroundColor = this.curentColorL;
    this.resultcolorChoicerR.style.backgroundColor = this.curentColorR;
    parent.appendChild(this.colorChoicer);
    parent.appendChild(this.resultcolorChoicerL);
    parent.appendChild(this.resultcolorChoicerR);
    const ctxPalette = this.canvasChoicer.getContext('2d');

    const paletteImg = new Image();
    paletteImg.src = img;
    paletteImg.onload = () => {
      ctxPalette.drawImage(paletteImg, 0, 0);
    };
  }

  addListeners() {
    this.canvasChoicer.addEventListener('mousemove', (event) => {
      if (event.buttons > 0) {
        const x = event.pageX - event.currentTarget.offsetLeft;
        const y = event.pageY - event.currentTarget.offsetTop;
        const ctx = this.canvasChoicer.getContext('2d');
        const imgd = ctx.getImageData(x, y, 1, 1);
        const { data } = imgd;
        const color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
        let result;
        if (this.stateColor === 'L') {
          result = this.resultcolorChoicerL;
          this.curentColorL = color;
        } else {
          result = this.resultcolorChoicerR;
          this.curentColorR = color;
        }
        result.style.backgroundColor = color;
      }
    });

    this.canvasChoicer.addEventListener('mouseup', (event) => {
      if (event.buttons === 0) {
        const x = event.pageX - event.currentTarget.offsetLeft;
        const y = event.pageY - event.currentTarget.offsetTop;
        const ctx = this.canvasChoicer.getContext('2d');
        const imgd = ctx.getImageData(x, y, 1, 1);
        const { data } = imgd;
        const color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
        let result;
        if (this.stateColor === 'L') {
          result = this.resultcolorChoicerL;
          this.curentColorL = color;
        } else {
          result = this.resultcolorChoicerR;
          this.curentColorR = color;
        }
        result.style.backgroundColor = color;
      }
    });

    this.resultcolorChoicerL.addEventListener('click', () => {
      this.stateColor = 'L';
      this.resultcolorChoicerL.classList.add('result-color-choicer-active');
      this.resultcolorChoicerR.classList.remove('result-color-choicer-active');
    });
    this.resultcolorChoicerR.addEventListener('click', () => {
      this.stateColor = 'R';
      this.resultcolorChoicerR.classList.add('result-color-choicer-active');
      this.resultcolorChoicerL.classList.remove('result-color-choicer-active');
    });
  }
}

export default ColorChoicer;
