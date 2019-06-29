class PenUnit {
  constructor(linkAppView) {
    this.linkAppView = linkAppView;
    this.penUnit = document.createElement('div');
  }

  init(parent) {
    this.penUnit.classList.add('pen-unit-box');

    const styleButton = 'unit-pen';
    const nameButton = '';

    let unit = PenUnit.createButton(this.penUnit, { styleButton, nameButton });
    unit.style.padding = '5px';
    unit.setAttribute('data-unit', 'one');

    unit = PenUnit.createButton(this.penUnit, { styleButton, nameButton });
    unit.style.padding = '4px';
    unit.setAttribute('data-unit', 'two');

    unit = PenUnit.createButton(this.penUnit, { styleButton, nameButton });
    unit.style.padding = '3px';
    unit.setAttribute('data-unit', 'three');

    unit = PenUnit.createButton(this.penUnit, { styleButton, nameButton });
    unit.style.padding = '2px';
    unit.setAttribute('data-unit', 'four');

    parent.appendChild(this.penUnit);

    this.makePenActive(0);
  }

  makePenActive(indexPen) {
    for (let i = 0; i < this.penUnit.children.length; i += 1) {
      if (this.penUnit.children[i].classList.contains('unit-pen-active')) {
        this.penUnit.children[i].classList.remove('unit-pen-active');
      }
    }
    this.penUnit.children[indexPen].classList.add('unit-pen-active');
  }

  addListeners() {
    this.penUnit.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-unit')) {
        const { unit } = e.target.dataset;
        const { drawViewer } = this.linkAppView;
        let indexPen = 0;
        switch (unit) {
          case 'one':
            drawViewer.penUnit = 1;
            indexPen = 0;
            break;
          case 'two':
            drawViewer.penUnit = 2;
            indexPen = 1;
            break;
          case 'three':
            drawViewer.penUnit = 3;
            indexPen = 2;
            break;
          case 'four':
            drawViewer.penUnit = 4;
            indexPen = 3;
            break;
          default:
            drawViewer.penUnit = 1;
            indexPen = 0;
        }
        this.makePenActive(indexPen);
        drawViewer.resizePositioner();
        this.linkAppView.canvasControlPanel.coordShowArea.children[1].innerText = `Pen unit: ${drawViewer.penUnit}`;
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

export default PenUnit;
