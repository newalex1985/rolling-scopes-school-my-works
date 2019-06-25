class CanvasSize {
  constructor(linkAppView) {
    this.linkAppView = linkAppView;
    this.canvasSize = document.createElement('div');
  }

  init(parent) {
    this.canvasSize.classList.add('canvas-size-box');

    const styleButton = 'canvas-size-but';
    let nameButton = '32x32';

    let size = CanvasSize.createButton(this.canvasSize, { styleButton, nameButton });
    size.setAttribute('data-size', '32');

    nameButton = '64x64';
    size = CanvasSize.createButton(this.canvasSize, { styleButton, nameButton });
    size.setAttribute('data-size', '64');

    nameButton = '128x128';
    size = CanvasSize.createButton(this.canvasSize, { styleButton, nameButton });
    size.setAttribute('data-size', '128');

    parent.appendChild(this.canvasSize);

    this.makeSizeActive(0);
  }

  makeSizeActive(indexSize) {
    for (let i = 0; i < this.canvasSize.children.length; i += 1) {
      if (this.canvasSize.children[i].classList.contains('canvas-size-active')) {
        this.canvasSize.children[i].classList.remove('canvas-size-active');
      }
    }
    this.canvasSize.children[indexSize].classList.add('canvas-size-active');
  }

  addListeners() {
    this.canvasSize.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-size')) {
        const { size } = e.target.dataset;
        const { drawViewer } = this.linkAppView;
        let indexSize = 0;
        switch (size) {
          case '32':
            drawViewer.canvasResolution = 32;
            indexSize = 0;
            break;
          case '64':
            drawViewer.canvasResolution = 64;
            indexSize = 1;
            break;
          case '128':
            drawViewer.canvasResolution = 128;
            indexSize = 2;
            break;
          default:
            drawViewer.canvasResolution = 32;
            indexSize = 0;
        }
        this.makeSizeActive(indexSize);
        drawViewer.resizeCanvas();
        drawViewer.resizePositioner();
      }
    });
  }

  static createButton(parrent, { styleButton, nameButton }) {
    const button = document.createElement('div');
    button.classList.add(styleButton);
    button.innerText = nameButton;
    parrent.appendChild(button);
    return button;
  }
}

export default CanvasSize;
