class Tools {
  constructor(linkAppView) {
    this.linkAppView = linkAppView;
    this.tools = document.createElement('div');
    this.indexTool = 0;
  }

  init(parent) {
    this.tools.classList.add('tools-box');

    const styleButton = 'tool';
    const nameButton = '';

    let tool = Tools.createButton(this.tools, { styleButton, nameButton });
    tool.setAttribute('data-tool', 'pen');
    Tools.createFontAwesome(tool, 'fas', 'fa-pen');

    tool = Tools.createButton(this.tools, { styleButton, nameButton });
    tool.setAttribute('data-tool', 'line');
    Tools.createFontAwesome(tool, 'fas', 'fa-slash');

    tool = Tools.createButton(this.tools, { styleButton, nameButton });
    tool.setAttribute('data-tool', 'fill');
    Tools.createFontAwesome(tool, 'fas', 'fa-fill-drip');

    tool = Tools.createButton(this.tools, { styleButton, nameButton });
    tool.setAttribute('data-tool', 'square');
    Tools.createFontAwesome(tool, 'fas', 'fa-square-full');

    tool = Tools.createButton(this.tools, { styleButton, nameButton });
    tool.setAttribute('data-tool', 'eraser');
    Tools.createFontAwesome(tool, 'fas', 'fa-eraser');

    tool = Tools.createButton(this.tools, { styleButton, nameButton });
    tool.setAttribute('data-tool', 'circle');
    Tools.createFontAwesome(tool, 'fas', 'fa-circle');

    parent.appendChild(this.tools);

    this.makeToolActive(0);
  }

  makeToolActive(indexTool) {
    for (let i = 0; i < this.tools.children.length; i += 1) {
      if (this.tools.children[i].classList.contains('tool-active')) {
        this.tools.children[i].classList.remove('tool-active');
      }
    }
    this.tools.children[indexTool].classList.add('tool-active');
  }

  choiceTool(indexTool, tool) {
    this.indexTool = indexTool;
    const { drawViewer } = this.linkAppView;
    drawViewer.tool = tool;
    this.makeToolActive(this.indexTool);
    this.linkAppView.canvasControlPanel.coordShowArea.children[2].innerText = `Tool: ${drawViewer.tool}`;
  }

  addListeners() {
    this.tools.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-tool')) {
        const { tool } = e.target.dataset;
        let selectedTool = 'pen';
        let indexTool = 0;
        switch (tool) {
          case 'pen':
            selectedTool = tool;
            indexTool = 0;
            break;
          case 'line':
            selectedTool = tool;
            indexTool = 1;
            break;
          case 'fill':
            selectedTool = tool;
            indexTool = 2;
            break;
          case 'square':
            selectedTool = tool;
            indexTool = 3;
            break;
          case 'eraser':
            selectedTool = tool;
            indexTool = 4;
            break;
          case 'circle':
            selectedTool = tool;
            indexTool = 5;
            break;
          default:
            selectedTool = 'pen';
            indexTool = 0;
        }
        this.choiceTool(indexTool, selectedTool);
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

  static createFontAwesome(elemParent, styleFont, font) {
    const elemFont = document.createElement('i');
    elemFont.classList.add(styleFont);
    elemFont.classList.add(font);
    elemParent.appendChild(elemFont);
  }
}

export default Tools;
