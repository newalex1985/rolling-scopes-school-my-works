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
    this.indexCurrentFrame = '';
    this.emptyContent = '';
    this.stepsX = 32;
    this.stepsY = 32;
    this.primitivePositions = this.getPrimitivePositions();
  }

  init(parrent) {
    super.init(parrent);
    this.area.style.position = 'relative';
    this.area.style.zIndex = 10;
    this.context.lineCap = 'square';
    this.context.lineWidth = this.sizeArea.width / this.stepsX;
    // lineWidth?
    // dell?
    this.context.strokeStyle = this.colorPickerLink.currentColor;

    this.positioner = document.createElement('div');
    this.positioner.classList.add('positioner');
    this.positioner.style.width = `${this.sizeArea.width / this.stepsX}px`;
    this.positioner.style.height = `${this.sizeArea.heigth / this.stepsY}px`;
    this.positioner.style.position = 'absolute';
    this.positioner.style.top = 0;
    this.positioner.style.left = 0;
    this.positioner.style.zIndex = 5;
    parrent.appendChild(this.positioner);
  }

  draw(frame = undefined) {
    super.draw(frame);
  }

  drawPrimitive(x, y) {
    const indexPrimitive = this.findPrimitive(x, y);
    console.log('indexPrimitive', indexPrimitive);
    if (indexPrimitive !== undefined) {
      const {
        xBegin, yBegin, xEnd, yEnd,
      } = this.primitivePositions[indexPrimitive];
      const width = xEnd - xBegin;
      const height = yEnd - yBegin;
      this.context.fillRect(xBegin, yBegin, width, height);
    }
  }

  getPrimitivePositions() {
    const primitivePisitions = [];
    const width = this.sizeArea.width / this.stepsX;
    const heigth = this.sizeArea.heigth / this.stepsY;
    for (let i = 0; i < this.stepsX; i += 1) {
      for (let j = 0; j < this.stepsY; j += 1) {
        primitivePisitions.push({
          xBegin: j * width,
          yBegin: i * heigth,
          xEnd: j * width + width,
          yEnd: i * heigth + heigth,
        });
      }
    }
    return primitivePisitions;
  }

  findPrimitive(x, y) {
    let num;
    this.primitivePositions.forEach((elem, index) => {
      if ((x > elem.xBegin) && (x < elem.xEnd) && (y > elem.yBegin) && (y < elem.yEnd)) {
        num = index;
      }
    });
    return num;
  }

  movePositioner(x, y) {
    const indexPrimitive = this.findPrimitive(x, y);
    if (indexPrimitive !== undefined) {
      const {
        xBegin, yBegin,
      } = this.primitivePositions[indexPrimitive];
      this.positioner.style.left = `${xBegin}px`;
      this.positioner.style.top = `${yBegin}px`;
    }
  }

  addListeners() {
    this.area.addEventListener('mousemove', (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      if (e.buttons > 0) {
        console.log('move');
        this.context.fillStyle = this.colorPickerLink.currentColor;
        this.drawPrimitive(x, y);
      }
      this.movePositioner(x, y);
    });

    this.area.addEventListener('mousedown', (e) => {
      console.log('downMouse');
      const x = e.offsetX;
      const y = e.offsetY;
      this.context.fillStyle = this.colorPickerLink.currentColor;
      this.drawPrimitive(x, y);
    });
  }
}

export { AnimationView, DrawView };
