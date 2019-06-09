class AnimationView {
  constructor(width, heigth) {
    this.area = document.createElement('canvas');
    this.context = this.area.getContext('2d');
    this.sizeArea = {
      width,
      heigth,
    };
  }

  init(parrent) {
    this.area.setAttribute('width', this.sizeArea.width);
    this.area.setAttribute('height', this.sizeArea.heigth);
    this.area.innerText = 'Ваш браузер устарел!';
    parrent.appendChild(this.area);
  }

  draw(frame = undefined) {
    if (frame !== undefined) {
      this.context.clearRect(0, 0, this.sizeArea.width, this.sizeArea.heigth);
      const img = new Image();
      img.src = frame;
      const pattern = this.context.createPattern(img, 'no-repeat');
      this.context.fillStyle = pattern;
      this.context.fillRect(0, 0, this.sizeArea.width, this.sizeArea.heigth);
    } else {
      this.context.clearRect(0, 0, this.sizeArea.width, this.sizeArea.heigth);
    }
  }

  fullScreenMode() {
    if (this.area.requestFullscreen) {
      this.area.requestFullscreen();
    } else if (this.area.webkitrequestFullscreen) {
      this.area.webkitRequestFullscreen();
    } else if (this.area.mozRequestFullscreen) {
      this.area.mozRequestFullScreen();
    }
  }
}

class DrawView extends AnimationView {
  constructor(colorPickerLink, width, heigth) {
    super(width, heigth);
    this.colorPickerLink = colorPickerLink;
  }

  init(parrent) {
    super.init(parrent);
    this.context.lineCap = 'round';
    this.context.lineWidth = 8;
    this.context.strokeStyle = this.colorPickerLink.currentColor;
  }

  clear() {
    this.context.clearRect(0, 0, this.sizeArea.width, this.sizeArea.heigth);
  }

  addListeners() {
    this.area.addEventListener('mousemove', (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      const dx = e.movementX;
      const dy = e.movementY;

      // if any button pressing - > drawing
      if (e.buttons > 0) {
        this.context.strokeStyle = this.colorPickerLink.currentColor;
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x - dx, y - dy);
        this.context.stroke();
        this.context.closePath();
      }
    });
  }
}

export { AnimationView, DrawView };
