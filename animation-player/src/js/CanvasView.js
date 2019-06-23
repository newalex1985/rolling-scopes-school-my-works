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
    // new
    this.areaPositioner = document.createElement('canvas');
    this.contextPositioner = this.area.getContext('2d');
    this.sizeAreaPositioner = {
      width,
      heigth,
    };

    this.stepsX = 32;
    this.stepsY = 32;
    // this.primitivePositions = this.getPrimitivePositions();
    this.primitivePositions = this.getPrimitivePositionsPositioner();
    this.previosPrimitive = {
      xBeginPr: 0,
      yBeginPr: 0,
      widthPr: 0,
      heightPr: 0,
    };
  }

  init(parrent) {
    super.init(parrent);
    this.context.lineCap = 'square';
    this.context.lineWidth = this.sizeArea.width / this.stepsX;
    // lineWidth?
    this.context.strokeStyle = this.colorPickerLink.currentColor;
    // new
    this.areaPositioner.setAttribute('width', this.sizeArea.width);
    this.areaPositioner.setAttribute('height', this.sizeArea.heigth);
    this.areaPositioner.style.position = 'absolute';
    this.areaPositioner.style.top = 0;
    this.areaPositioner.style.left = 0;
    this.areaPositioner.style.zIndex = 10;
    this.areaPositioner.innerText = 'Ваш браузер устарел!';
    parrent.appendChild(this.areaPositioner);

    // new
    this.positioner = document.createElement('div');
    this.positioner.classList.add('positioner');
    this.positioner.style.width = `${this.sizeAreaPositioner.width / this.stepsX}px`;
    this.positioner.style.height = `${this.sizeAreaPositioner.heigth / this.stepsY}px`;
    this.positioner.style.position = 'absolute';
    this.positioner.style.top = 0;
    this.positioner.style.left = 0;
    this.positioner.style.zIndex = 5;
    parrent.appendChild(this.positioner);

    // new
    this.area.style.position = 'absolute';
    this.area.style.top = 0;
    this.area.style.left = 0;
    this.area.style.zIndex = 10;
  }

  draw(frame = undefined) {
    super.draw(frame);
  }

  // new
  drawPrimintive(xBegin, yBegin, xEnd, yEnd) {
    this.context.beginPath();
    this.context.moveTo(xBegin, yBegin);
    this.context.lineTo(xEnd, yEnd);
    this.context.stroke();
    this.context.closePath();
  }

  drawPrimintivePositioner(x, y) {
    const indexPrimitive = this.findPrimitive(x, y);
    console.log('indexPrimitive positioner', indexPrimitive);
    if (indexPrimitive !== undefined) {
      const {
        xBegin, yBegin, xEnd, yEnd,
      } = this.primitivePositions[indexPrimitive];
      const width = xEnd - xBegin;
      const height = yEnd - yBegin;
      // this.contextPositioner.fillStyle = 'grey';
      this.contextPositioner.fillRect(xBegin, yBegin, width, height);
    }
  }

  // getPrimitivePositions() {
  //   const primitivePisitions = [];
  //   const width = this.sizeArea.width / this.stepsX;
  //   const heigth = this.sizeArea.heigth / this.stepsY;
  //   for (let i = 0; i < this.stepsX; i += 1) {
  //     for (let j = 0; j < this.stepsY; j += 1) {
  //       primitivePisitions.push({
  //         xBegin: j * width,
  //         yBegin: i * heigth,
  //         xEnd: j * width + width,
  //         yEnd: i * heigth + heigth,
  //       });
  //     }
  //   }
  //   return primitivePisitions;
  // }

  getPrimitivePositionsPositioner() {
    const primitivePisitions = [];
    const width = this.sizeAreaPositioner.width / this.stepsX;
    const heigth = this.sizeAreaPositioner.heigth / this.stepsY;
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


  // highlightPrimitive(x, y) {
  //   const indexPrimitive = this.findPrimitive(x, y);
  //   const {
  //     xBeginPr, yBeginPr, widthPr, heightPr,
  //   } = this.previosPrimitive;
  //   if (indexPrimitive !== undefined) {
  //     const {
  //       xBegin, yBegin, xEnd, yEnd,
  //     } = this.primitivePositions[indexPrimitive];

  //     this.context.clearRect(xBeginPr - 1, yBeginPr - 1, widthPr + 2, heightPr + 2);

  //     const width = xEnd - xBegin;
  //     const height = yEnd - yBegin;
  //     this.context.fillRect(xBegin, yBegin, width, height);

  //     this.previosPrimitive.xBeginPr = xBegin;
  //     this.previosPrimitive.yBeginPr = yBegin;
  //     this.previosPrimitive.widthPr = width;
  //     this.previosPrimitive.heightPr = height;
  //   }
  // }

  // highlightPrimitivePositioner(x, y) {
  //   const indexPrimitive = this.findPrimitive(x, y);
  //   const {
  //     xBeginPr, yBeginPr, widthPr, heightPr,
  //   } = this.previosPrimitive;
  //   if (indexPrimitive !== undefined) {
  //     const {
  //       xBegin, yBegin, xEnd, yEnd,
  //     } = this.primitivePositions[indexPrimitive];

  //     // eslint-disable-next-line max-len
  // eslint-disable-next-line max-len
  //     // Здесь затирается объединенный слой, что с этим делать? перерисовывать слой рисования сразу же?
  //     this.contextPositioner.clearRect(xBeginPr - 1, yBeginPr - 1, widthPr + 2, heightPr + 2);

  //     const width = xEnd - xBegin;
  //     const height = yEnd - yBegin;
  //     this.contextPositioner.fillStyle = 'grey';
  //     this.contextPositioner.fillRect(xBegin, yBegin, width, height);

  //     this.previosPrimitive.xBeginPr = xBegin;
  //     this.previosPrimitive.yBeginPr = yBegin;
  //     this.previosPrimitive.widthPr = width;
  //     this.previosPrimitive.heightPr = height;
  //   }
  // }

  // drawPixelPrimitive(xBegin, yBegin, xEnd, yEnd) {
  //   // this.context.clearRect(0, 0, this.sizeArea.width, this.sizeArea.heigth);
  //   // const img = new Image();
  //   // img.src = frame;
  //   // const pattern = this.context.createPattern(img, 'no-repeat');
  //   // this.context.fillStyle = pattern;
  //   // this.context.fillRect(0, 0, this.sizeArea.width, this.sizeArea.heigth);
  //   this.context.fillRect(xBegin, yBegin, xEnd, yEnd);
  // }

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
      const dx = e.movementX;
      const dy = e.movementY;

      // new
      // this.highlightPrimitive(x, y);
      // if any button pressing - > drawing
      if (e.buttons > 0) {
        this.context.strokeStyle = this.colorPickerLink.currentColor;
        this.drawPrimintive(x, y, x - dx, y - dy);
      }
    });

    // new
    this.area.addEventListener('mousedown', (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      this.context.strokeStyle = this.colorPickerLink.currentColor;
      this.drawPrimintive(x, y, x, y);
    });

    // new
    this.areaPositioner.addEventListener('mousemove', (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      // fot Positioner remake
      // this.highlightPrimitivePositioner(x, y);
      // тест убрать потом
      if (e.buttons > 0) {
        console.log('downPositioner');
        this.contextPositioner.fillStyle = this.colorPickerLink.currentColor;
        this.drawPrimintivePositioner(x, y);
      }

      // тест убрать потом
      this.movePositioner(x, y);
    });

    this.areaPositioner.addEventListener('mousedown', (e) => {
      // const x = e.offsetX;
      // const y = e.offsetY;
      // // fot Positioner remake
      // // this.highlightPrimitivePositioner(x, y);
      // // тест убрать потом
      // if (e.buttons > 0) {
      //   console.log('downPositioner');
      //   this.contextPositioner.fillStyle = this.colorPickerLink.currentColor;
      //   this.drawPrimintivePositioner(x, y);
      // }

      // // тест убрать потом
      // this.movePositioner(x, y);
      console.log('downMosePositioner');
      const x = e.offsetX;
      const y = e.offsetY;
      this.contextPositioner.fillStyle = this.colorPickerLink.currentColor;
      this.drawPrimintivePositioner(x, y);
    });
  }
}

export { AnimationView, DrawView };
