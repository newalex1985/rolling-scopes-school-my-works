import PaintBucket from './PaintBucket';

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
  constructor(linkAppView, colorPickerLink, width, heigth) {
    super(width, heigth);
    this.linkAppView = linkAppView;
    this.colorPickerLink = colorPickerLink;
    this.indexCurrentFrame = '';
    this.emptyContent = '';
    this.canvasResolution = 32;
    this.primitivePositions = this.getPrimitivePositions();
    this.penUnit = 1;
    this.tool = 'pen';
    this.paintBucket = new PaintBucket(this.context);
  }

  init(parrent) {
    super.init(parrent);
    this.area.style.position = 'relative';
    this.area.style.zIndex = 10;
    this.positioner = document.createElement('div');
    this.positioner.classList.add('positioner');
    this.positioner.style.width = `${(this.sizeArea.width / this.canvasResolution) * this.penUnit}px`;
    this.positioner.style.height = `${(this.sizeArea.heigth / this.canvasResolution) * this.penUnit}px`;
    // eslint-disable-next-line max-len
    // this.positioner.style.width = `${Math.floor(this.sizeArea.width / this.canvasResolution) * this.penUnit}px`;
    // eslint-disable-next-line max-len
    // this.positioner.style.height = `${Math.floor(this.sizeArea.heigth / this.canvasResolution) * this.penUnit}px`;
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
    // console.log('indexPrimitive x y', indexPrimitive, x, y);
    if (indexPrimitive !== undefined) {
      const {
        xBegin, yBegin, xEnd, yEnd,
      } = this.getPrimitiveCoord(indexPrimitive);
      const width = (xEnd - xBegin) * this.penUnit;
      const height = (yEnd - yBegin) * this.penUnit;
      this.context.fillRect(xBegin, yBegin, width, height);
    }
  }

  clearPrimitive(x, y) {
    const indexPrimitive = this.findPrimitive(x, y);
    console.log('indexPrimitive', indexPrimitive);
    if (indexPrimitive !== undefined) {
      const {
        xBegin, yBegin, xEnd, yEnd,
      } = this.getPrimitiveCoord(indexPrimitive);
      const width = (xEnd - xBegin) * this.penUnit;
      const height = (yEnd - yBegin) * this.penUnit;
      this.context.clearRect(xBegin, yBegin, width, height);
    }
  }

  resizeCanvas() {
    this.primitivePositions = this.getPrimitivePositions();
  }

  getPrimitivePositions() {
    const primitivePisitions = [];
    const width = this.sizeArea.width / this.canvasResolution;
    const heigth = this.sizeArea.heigth / this.canvasResolution;
    // const width = Math.floor(10 * this.sizeArea.width / this.canvasResolution) / 10;
    // const heigth = Math.floor(10 * this.sizeArea.heigth / this.canvasResolution) / 10;
    // const width = Math.floor(this.sizeArea.width / this.canvasResolution);
    // const heigth = Math.floor(this.sizeArea.heigth / this.canvasResolution);
    for (let i = 0; i < this.canvasResolution; i += 1) {
      for (let j = 0; j < this.canvasResolution; j += 1) {
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
    const { width, heigth } = this.sizeArea;
    const res = this.canvasResolution;
    return Math.floor(x / (width / res)) + Math.floor(y / (heigth / res)) * res;
  }

  getPrimitiveCoord(indexPrimitive) {
    let {
      xBegin, xEnd, yBegin, yEnd,
    } = this.primitivePositions[indexPrimitive];
    const width = xEnd - xBegin;
    const height = yEnd - yBegin;
    if ((this.sizeArea.width - xBegin) < width * this.penUnit) {
      xBegin = this.sizeArea.width - width * this.penUnit;
      xEnd = xBegin + width * this.penUnit;
    }
    if ((this.sizeArea.heigth - yBegin) < height * this.penUnit) {
      yBegin = this.sizeArea.heigth - height * this.penUnit;
      yEnd = yBegin + height * this.penUnit;
    }
    return {
      xBegin, xEnd, yBegin, yEnd,
    };
  }

  getCanvasCoord(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    if (x < 0) {
      x = 0;
    } else if (x > this.sizeArea.width - 1) {
      x = this.sizeArea.width - 1;
    }
    if (y < 0) {
      y = 0;
    } else if (y > this.sizeArea.heigth - 1) {
      y = this.sizeArea.heigth - 1;
    }
    return { x, y };
  }

  movePositioner(x, y) {
    const indexPrimitive = this.findPrimitive(x, y);
    // console.log('indexPrimitive x y', indexPrimitive, x, y);
    if (indexPrimitive !== undefined) {
      const { xBegin, yBegin } = this.getPrimitiveCoord(indexPrimitive);
      this.positioner.style.left = `${xBegin}px`;
      this.positioner.style.top = `${yBegin}px`;
    }
  }

  resizePositioner() {
    this.positioner.style.width = `${(this.sizeArea.width / this.canvasResolution) * this.penUnit}px`;
    this.positioner.style.height = `${(this.sizeArea.heigth / this.canvasResolution) * this.penUnit}px`;
  }

  addListeners() {
    this.area.addEventListener('mousemove', (e) => {
      const { x, y } = this.getCanvasCoord(e);

      if (e.buttons > 0) {
        // console.log('move x y', x, y);
        this.context.fillStyle = this.colorPickerLink.currentColor;
        this.drawPrimitive(x, y);
      }
      this.movePositioner(x, y);
    });

    this.area.addEventListener('mousedown', (e) => {
      console.log('downMouse');
      console.log('this.colorPickerLink.currentColor', this.colorPickerLink.currentColor);
      const { x, y } = this.getCanvasCoord(e);
      const { tool } = this;
      if (tool === 'pen') {
        this.context.strokeStyle = this.colorPickerLink.currentColor;
        this.context.fillStyle = this.colorPickerLink.currentColor;
        this.drawPrimitive(x, y);
      } else if (tool === 'fill') {
        console.log(this.colorPickerLink.currentColor.match(/\d+/g));
        // this.paintBucket.floodFill(x, y, [255, 0, 0, 255]);
        // this.paintBucket.floodFill(x, y, [255, 0, 0]);
        this.paintBucket.floodFill(x, y, this.colorPickerLink.currentColor.match(/\d+/g));
      } else if (tool === 'eraser') {
        this.clearPrimitive(x, y);
      }
    });
  }
}

export { AnimationView, DrawView };
