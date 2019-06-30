class CanvasControlPanel {
  constructor(linkAppView) {
    this.linkAppView = linkAppView;
    this.canvasControlPanel = document.createElement('div');
    this.canvasSize = document.createElement('div');
    this.coordShowArea = document.createElement('div');
    this.fileArea = document.createElement('div');
    this.downloadElem = document.createElement('input');
    this.downloadLabel = document.createElement('label');
    this.saveElem = document.createElement('a');
    this.indexSize = 0;
  }

  init(parent) {
    this.canvasControlPanel.classList.add('canvas-control-panel');
    this.canvasSize.classList.add('canvas-size-box');

    const styleButton = 'canvas-size-but';
    let nameButton = '32x32';

    let size = CanvasControlPanel.createButton(this.canvasSize, { styleButton, nameButton });
    size.setAttribute('data-size', '32');

    nameButton = '64x64';
    size = CanvasControlPanel.createButton(this.canvasSize, { styleButton, nameButton });
    size.setAttribute('data-size', '64');

    nameButton = '128x128';
    size = CanvasControlPanel.createButton(this.canvasSize, { styleButton, nameButton });
    size.setAttribute('data-size', '128');

    this.canvasControlPanel.appendChild(this.canvasSize);

    this.coordShowArea.classList.add('coord-show-area');
    const coord = document.createElement('div');
    coord.classList.add('box-show-area');
    this.coordShowArea.appendChild(coord);
    const penUnit = document.createElement('div');
    penUnit.classList.add('box-show-area');
    this.coordShowArea.appendChild(penUnit);
    const tool = document.createElement('div');
    tool.classList.add('box-show-area');
    this.coordShowArea.appendChild(tool);
    this.canvasControlPanel.appendChild(this.coordShowArea);

    this.fileArea.classList.add('file-area');
    this.downloadElem.setAttribute('type', 'file');
    this.downloadElem.setAttribute('id', 'file-input');
    this.downloadLabel.setAttribute('for', 'file-input');
    this.downloadLabel.innerText = 'Choose File';
    this.downloadLabel.classList.add('file-button');
    this.fileArea.appendChild(this.downloadElem);
    this.fileArea.appendChild(this.downloadLabel);
    // this.saveElem.setAttribute('href', '');
    this.saveElem.href = '';
    this.saveElem.innerText = 'Save File';
    this.saveElem.classList.add('file-button');
    this.fileArea.appendChild(this.saveElem);
    this.canvasControlPanel.appendChild(this.fileArea);

    parent.appendChild(this.canvasControlPanel);

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

  choiceSize(indexSize, canvasResolution) {
    this.indexSize = indexSize;
    const { drawViewer } = this.linkAppView;
    drawViewer.canvasResolution = canvasResolution;
    this.makeSizeActive(indexSize);
    drawViewer.resizeCanvas();
    drawViewer.resizePositioner();
  }

  getSaveObjectJSON() {
    const { drawViewer, tools } = this.linkAppView;
    const saveObject = {
      penUnit: drawViewer.penUnit,
      toolParam: { tool: drawViewer.tool, indexTool: tools.indexTool },
      sizeParam: { resolution: drawViewer.canvasResolution, indexSize: this.indexSize },
      frames: this.linkAppView.frameBar.frames,
    };
    const saveObjectJSON = JSON.stringify(saveObject);
    return saveObjectJSON;
  }

  restoreStateApp(saveObjectJSON) {
    const saveObject = JSON.parse(saveObjectJSON);
    const { penUnit, tools, frameBar } = this.linkAppView;
    penUnit.choisePen(saveObject.penUnit);
    const { toolParam, sizeParam } = saveObject;
    tools.choiceTool(toolParam.indexTool, toolParam.tool);
    this.choiceSize(sizeParam.indexSize, sizeParam.resolution);
    frameBar.rewriteFrames(saveObject.frames);
  }

  addListeners() {
    this.canvasSize.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-size')) {
        const { size } = e.target.dataset;
        let selectedCanvasResolution = 32;
        let indexSize = 0;
        switch (size) {
          case '32':
            selectedCanvasResolution = 32;
            indexSize = 0;
            break;
          case '64':
            selectedCanvasResolution = 64;
            indexSize = 1;
            break;
          case '128':
            selectedCanvasResolution = 128;
            indexSize = 2;
            break;
          default:
            selectedCanvasResolution = 32;
            indexSize = 0;
        }
        this.choiceSize(indexSize, selectedCanvasResolution);
      }
    });

    this.downloadElem.addEventListener('change', () => {
      const fileList = this.downloadElem.files;
      const textFile = fileList[0];
      if (textFile.type === 'text/plain') {
        const reader = new FileReader();
        reader.addEventListener('loadend', (event) => {
          const saveObjectJSON = event.target.result;
          this.restoreStateApp(saveObjectJSON);
        });
        reader.addEventListener('error', () => {
          alert('Error reading file!');
        });
        reader.readAsText(textFile);
      } else {
        alert('This is not a text file!');
      }
    });

    this.saveElem.addEventListener('click', () => {
      const saveObjectJSON = this.getSaveObjectJSON();
      const blob = new Blob([saveObjectJSON], { type: 'text/plain' });
      this.saveElem.href = URL.createObjectURL(blob);
      this.saveElem.download = 'file';
      // event.preventDefault();
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

export default CanvasControlPanel;
