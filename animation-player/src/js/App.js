import '../css/style.css';

class App {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
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
      const style = getComputedStyle(frame);
      const { width, height } = style;
      const img = document.createElement('img');
      img.style.width = width;
      img.style.height = height;
      img.src = this.canvas.toDataURL('image/png');
      frame.appendChild(img);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      const dx = e.movementX;
      const dy = e.movementY;

      // if any botton pressing - > drowing
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
  }

  static generatePalette(palette) {
    // generarion pallete, total 3^3 colors = 81
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
}

export default App;
