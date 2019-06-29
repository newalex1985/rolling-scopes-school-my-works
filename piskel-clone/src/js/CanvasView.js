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
    // temp
    this.xSart = 0;
    this.xStop = 0;
    this.yStart = 0;
    this.yStop = 0;
    this.arrayPrimitiveCoordToClear = [];
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

  clearPrimitiveLoacal() {
    this.arrayPrimitiveCoordToClear.forEach((elem) => {
      this.clearPrimitive(elem.xBegin, elem.yBegin);
    });
  }

  lineBresenham(x0, y0, x1, y1) {
    const arrayPrimitiveCoord = [];
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;
    let x0Current = x0;
    let y0Corrent = y0;

    while (!((x0Current === x1) && (y0Corrent === y1))) {
      const {
        xBegin, yBegin,
      } = this.getPrimitiveCoord(x0Current + y0Corrent * this.canvasResolution);
      this.drawPrimitive(xBegin, yBegin);
      arrayPrimitiveCoord.push({ xBegin, yBegin });
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0Current += sx; }
      if (e2 < dx) { err += dx; y0Corrent += sy; }
    }
    return arrayPrimitiveCoord;
  }

  circleBresenham(X1, Y1, R) {
    const arrayPrimitiveCoord = [];
    let x = 0;
    let y = R;
    let delta = 1 - 2 * R;
    let error = 0;
    while (y >= 0) {
      let {
        xBegin, yBegin,
      } = this.getPrimitiveCoord(X1 + x + (Y1 + y) * this.canvasResolution);
      this.drawPrimitive(xBegin, yBegin);
      arrayPrimitiveCoord.push({ xBegin, yBegin });
      ({ xBegin, yBegin } = this.getPrimitiveCoord(X1 + x + (Y1 + y) * this.canvasResolution));
      this.drawPrimitive(xBegin, yBegin);
      arrayPrimitiveCoord.push({ xBegin, yBegin });
      ({ xBegin, yBegin } = this.getPrimitiveCoord(X1 + x + (Y1 - y) * this.canvasResolution));
      this.drawPrimitive(xBegin, yBegin);
      arrayPrimitiveCoord.push({ xBegin, yBegin });
      ({ xBegin, yBegin } = this.getPrimitiveCoord(X1 - x + (Y1 + y) * this.canvasResolution));
      this.drawPrimitive(xBegin, yBegin);
      arrayPrimitiveCoord.push({ xBegin, yBegin });
      ({ xBegin, yBegin } = this.getPrimitiveCoord(X1 - x + (Y1 - y) * this.canvasResolution));
      this.drawPrimitive(xBegin, yBegin);
      arrayPrimitiveCoord.push({ xBegin, yBegin });

      error = 2 * (delta + y) - 1;
      if (delta < 0 && error <= 0) {
        x += 1;
        delta += 2 * x + 1;
        // eslint-disable-next-line no-continue
        continue;
      }
      error = 2 * (delta - x) - 1;
      if (delta > 0 && error > 0) {
        y -= 1;
        delta += 1 - 2 * y;
        // eslint-disable-next-line no-continue
        continue;
      }
      x += 1;
      delta += 2 * (x - y);
      y -= 1;
    }
    return arrayPrimitiveCoord;
  }

  square(xStart, yStart, width, height) {
    const arrayPrimitiveCoord = [];
    const res = this.canvasResolution;
    let widthCoeff = 1;
    let heightCoeff = 1;
    let widthCurrent = width;
    let heightCurrent = height;
    if (widthCurrent < 0) {
      widthCoeff = -1;
      widthCurrent *= widthCoeff;
    }
    if (heightCurrent < 0) {
      heightCoeff = -1;
      heightCurrent *= heightCoeff;
    }
    for (let i = 0; i < widthCurrent; i += 1) {
      const {
        xBegin, yBegin,
      } = this.getPrimitiveCoord((xStart + i * widthCoeff) + yStart * res);
      this.drawPrimitive(xBegin, yBegin);
      arrayPrimitiveCoord.push({ xBegin, yBegin });
    }

    for (let i = 0; i < heightCurrent; i += 1) {
      const {
        xBegin, yBegin,
      } = this.getPrimitiveCoord((xStart + width) + (yStart + i * heightCoeff) * res);
      this.drawPrimitive(xBegin, yBegin);
      arrayPrimitiveCoord.push({ xBegin, yBegin });
    }

    for (let i = 0; i < widthCurrent; i += 1) {
      const {
        xBegin, yBegin,
      } = this.getPrimitiveCoord((xStart + width - i * widthCoeff) + (yStart + height) * res);
      this.drawPrimitive(xBegin, yBegin);
      arrayPrimitiveCoord.push({ xBegin, yBegin });
    }

    for (let i = 0; i < heightCurrent; i += 1) {
      const {
        xBegin, yBegin,
      } = this.getPrimitiveCoord(xStart + (yStart + height - i * heightCoeff) * res);
      this.drawPrimitive(xBegin, yBegin);
      arrayPrimitiveCoord.push({ xBegin, yBegin });
    }

    return arrayPrimitiveCoord;
  }

  static calculatePrimitivePos(indexPrimitive, canvasResolution) {
    const y = Math.floor(indexPrimitive / canvasResolution);
    const x = indexPrimitive % canvasResolution;
    return { x, y };
  }

  calculateStartPrimitivePos(indexPrimitive, canvasResolution) {
    const coord = DrawView.calculatePrimitivePos(indexPrimitive, canvasResolution);
    this.xStart = coord.x;
    this.yStart = coord.y;
  }

  calculateStopPrimitivePos(indexPrimitive, canvasResolution) {
    const coord = DrawView.calculatePrimitivePos(indexPrimitive, canvasResolution);
    this.xStop = coord.x;
    this.yStop = coord.y;
  }

  addListeners() {
    this.area.addEventListener('mousemove', (e) => {
      const { x, y } = this.getCanvasCoord(e);
      const { tool } = this;
      if (e.buttons > 0) {
        const indexPrimitive = this.findPrimitive(x, y);
        if (tool === 'pen') {
          this.context.fillStyle = this.colorPickerLink.currentColor;
          this.drawPrimitive(x, y);
        } else if (tool === 'line') {
          if (indexPrimitive !== undefined) {
            this.calculateStopPrimitivePos(indexPrimitive, this.canvasResolution);
            const {
              xStart, yStart, xStop, yStop,
            } = this;
            this.clearPrimitiveLoacal();
            this.context.fillStyle = this.colorPickerLink.currentColor;
            this.arrayPrimitiveCoordToClear = this.lineBresenham(xStart, yStart, xStop, yStop);
          }
        } else if (tool === 'circle') {
          if (indexPrimitive !== undefined) {
            this.calculateStopPrimitivePos(indexPrimitive, this.canvasResolution);
            const {
              xStart, yStart, xStop, yStop,
            } = this;
            const width = xStop - xStart;
            const height = yStop - yStart;
            let radius = Math.floor(Math.sqrt((width ** 2) + (height ** 2)));
            let threshold = Math.min(this.canvasResolution - xStart, xStart);
            radius = Math.min(radius, threshold);
            threshold = Math.min(this.canvasResolution - yStart, yStart);
            radius = Math.min(radius, threshold);
            this.clearPrimitiveLoacal();
            this.context.fillStyle = this.colorPickerLink.currentColor;
            this.arrayPrimitiveCoordToClear = this.circleBresenham(xStart, yStart, radius);
          }
        } else if (tool === 'square') {
          if (indexPrimitive !== undefined) {
            this.calculateStopPrimitivePos(indexPrimitive, this.canvasResolution);
            const {
              xStart, yStart, xStop, yStop,
            } = this;
            const width = xStop - xStart;
            const height = yStop - yStart;
            this.clearPrimitiveLoacal();
            this.context.fillStyle = this.colorPickerLink.currentColor;
            this.arrayPrimitiveCoordToClear = this.square(xStart, yStart, width, height);
          }
        } else if (tool === 'eraser') {
          this.clearPrimitive(x, y);
        }
      }
      this.movePositioner(x, y);
    });

    this.area.addEventListener('mousedown', (e) => {
      console.log('downMouse');
      console.log('this.colorPickerLink.currentColor', this.colorPickerLink.currentColor);
      const { x, y } = this.getCanvasCoord(e);
      const { tool } = this;
      const indexPrimitive = this.findPrimitive(x, y);
      if (tool === 'pen') {
        // this.context.strokeStyle = this.colorPickerLink.currentColor;
        this.context.fillStyle = this.colorPickerLink.currentColor;
        this.drawPrimitive(x, y);
      } else if (tool === 'fill') {
        // this.paintBucket.floodFill(x, y, [255, 0, 0, 255]);
        // this.paintBucket.floodFill(x, y, [255, 0, 0]);
        // eslint-disable-next-line array-callback-return
        // eslint-disable-next-line arrow-parens
        // eslint-disable-next-line radix
        const color = this.colorPickerLink.currentColor.match(/\d+/g).map(elem => parseInt(elem));
        // color[3] = 255;
        console.log(color);
        this.paintBucket.floodFill(x, y, color);
      } else if (tool === 'eraser') {
        this.clearPrimitive(x, y);
      } else if (tool === 'line') {
        if (indexPrimitive !== undefined) {
          this.calculateStartPrimitivePos(indexPrimitive, this.canvasResolution);
        }
      } else if (tool === 'circle') {
        if (indexPrimitive !== undefined) {
          this.calculateStartPrimitivePos(indexPrimitive, this.canvasResolution);
        }
      } else if (tool === 'square') {
        if (indexPrimitive !== undefined) {
          this.calculateStartPrimitivePos(indexPrimitive, this.canvasResolution);
        }
      }
    });

    this.area.addEventListener('mouseup', (e) => {
      console.log('mouse up');
      const { x, y } = this.getCanvasCoord(e);
      const { tool } = this;
      const indexPrimitive = this.findPrimitive(x, y);
      if (tool === 'line') {
        if (indexPrimitive !== undefined) {
          this.calculateStopPrimitivePos(indexPrimitive, this.canvasResolution);
          const {
            xStart, yStart, xStop, yStop,
          } = this;
          this.context.fillStyle = this.colorPickerLink.currentColor;
          this.arrayPrimitiveCoordToClear = this.lineBresenham(xStart, yStart, xStop, yStop);
          this.arrayPrimitiveCoordToClear = [];
        }
      } else if (tool === 'circle') {
        if (indexPrimitive !== undefined) {
          this.calculateStopPrimitivePos(indexPrimitive, this.canvasResolution);
          const {
            xStart, yStart, xStop, yStop,
          } = this;
          const width = xStop - xStart;
          const height = yStop - yStart;
          let radius = Math.floor(Math.sqrt((width ** 2) + (height ** 2)));
          let threshold = Math.min(this.canvasResolution - xStart, xStart);
          radius = Math.min(radius, threshold);
          threshold = Math.min(this.canvasResolution - yStart, yStart);
          radius = Math.min(radius, threshold);
          this.context.fillStyle = this.colorPickerLink.currentColor;
          this.arrayPrimitiveCoordToClear = this.circleBresenham(xStart, yStart, radius);
          this.arrayPrimitiveCoordToClear = [];
        }
      } else if (tool === 'square') {
        if (indexPrimitive !== undefined) {
          this.calculateStopPrimitivePos(indexPrimitive, this.canvasResolution);
          const {
            xStart, yStart, xStop, yStop,
          } = this;
          const width = xStop - xStart;
          const height = yStop - yStart;
          this.context.fillStyle = this.colorPickerLink.currentColor;
          this.arrayPrimitiveCoordToClear = this.square(xStart, yStart, width, height);
          this.arrayPrimitiveCoordToClear = [];
        }
      }
    });
  }
}

export { AnimationView, DrawView };
