import '../css/style.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';

class App {
  constructor() {
    this.canvas = document.getElementById('canvas-draw');
    this.context = this.canvas.getContext('2d');
    this.frames = [];
  }

  start() {
    // generation Palette
    App.generatePalette(document.getElementById('palette'));

    this.context.lineCap = 'round';
    this.context.lineWidth = 8;

    document.getElementById('clear').addEventListener('click', () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    });

    document.getElementById('save-frame').addEventListener('click', () => {
      const frame = document.createElement('div');
      frame.classList.add('frame');
      document.getElementById('frames').appendChild(frame);

      const buttonNum = document.createElement('div');
      buttonNum.classList.add('button-frame');
      buttonNum.style.top = 0;
      buttonNum.style.left = 0;
      buttonNum.innerHTML = `${this.frames.length + 1}`;
      frame.appendChild(buttonNum);

      const buttonDelete = document.createElement('div');
      buttonDelete.classList.add('button-frame');
      buttonDelete.style.top = 0;
      buttonDelete.style.right = 0;
      App.createFontAwesome(buttonDelete, 'fas', 'fa-archive');
      buttonDelete.firstChild.setAttribute('data-purpose', 'delete');
      frame.appendChild(buttonDelete);

      const buttonCopy = document.createElement('div');
      buttonCopy.classList.add('button-frame');
      buttonCopy.style.bottom = 0;
      buttonCopy.style.right = 0;
      App.createFontAwesome(buttonCopy, 'fas', 'fa-copy');
      buttonCopy.firstChild.setAttribute('data-purpose', 'copy');
      frame.appendChild(buttonCopy);

      const style = getComputedStyle(frame);
      const { width, height } = style;
      const img = document.createElement('img');
      img.style.width = width;
      img.style.height = height;
      const src = this.canvas.toDataURL('image/png');
      img.src = src;
      frame.appendChild(img);

      this.frames.push(src);
    });

    document.getElementById('start-animation').addEventListener('click', () => {
      let count = 0;
      setInterval(() => {
        const frame = this.frames[count % 3];
        App.draw(frame);
        count += 1;
      }, 1000 / 1);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      const dx = e.movementX;
      const dy = e.movementY;

      // if any botton pressing - > drawing
      if (e.buttons > 0) {
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x - dx, y - dy);
        this.context.stroke();
        this.context.closePath();
      }
    });

    document.getElementById('palette').addEventListener('click', (e) => {
      if (e.target.hasAttribute('paletteColor')) {
        this.context.strokeStyle = e.target.style.backgroundColor;
      }
    });

    document.getElementById('frames').addEventListener('click', (e) => {
      const { target } = e;
      if (target.parentNode.hasAttribute('data-purpose')) {
        const { purpose } = target.parentNode.dataset;
        if (purpose === 'delete') {
          const nodes = Array.prototype.slice.call(document.querySelectorAll('.frame'));
          const index = nodes.indexOf(target.parentNode.parentNode.parentNode);
          target.parentNode.parentNode.parentNode.remove();
          this.frames.splice(index, 1);
        } else if (purpose === 'copy') {
          const clone = target.parentNode.parentNode.parentNode.cloneNode(true);
          clone.firstChild.innerHTML = `${this.frames.length + 1}`;
          target.parentNode.parentNode.parentNode.parentNode.appendChild(clone);
          const src = clone.lastChild.getAttribute('src');
          this.frames.push(src);
        }
      }
    });
  }

  static draw(frame) {
    const canvas = document.getElementById('canvas-animation');
    if (canvas.getContext) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, 500, 500);
      const img = new Image();
      img.src = frame;
      const pattern = context.createPattern(img, 'no-repeat');
      context.fillStyle = pattern;
      context.fillRect(0, 0, 500, 500);
    }
  }

  static generatePalette(palette) {
    // generarion pallete, total 3*3*3 colors = 27
    const max = 2;
    for (let r = 0; r <= max; r += 1) {
      for (let g = 0; g <= max; g += 1) {
        for (let b = 0; b <= max; b += 1) {
          const paletteColor = document.createElement('div');
          paletteColor.className = 'button';
          paletteColor.setAttribute('paletteColor', true);
          const rCh = Math.round(r * 255 / max);
          const gCh = Math.round(g * 255 / max);
          const bCh = Math.round(b * 255 / max);
          paletteColor.style.backgroundColor = `rgb(${rCh}, ${gCh}, ${bCh})`;
          palette.appendChild(paletteColor);
        }
      }
    }
  }

  static createFontAwesome(elemParent, styleFont, font) {
    const elemFont = document.createElement('i');
    elemFont.classList.add(styleFont);
    elemFont.classList.add(font);
    elemParent.appendChild(elemFont);
  }
}

export default App;
