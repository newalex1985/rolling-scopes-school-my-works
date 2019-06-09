class FpsBar {
  constructor(styleFpsBar) {
    this.fpsBar = document.createElement('div');
    this.styleFpsBar = styleFpsBar;
    this.fpsUpButton = '';
    this.fpsDownButton = '';
    this.fpsContainer = '';
    this.fpsValue = 1;
  }

  init(parent) {
    this.fpsBar.classList.add(this.styleFpsBar);

    let styleButton = 'fps-up';
    let nameButton = '+';
    this.fpsUpButton = FpsBar.createButton(this.fpsBar, { styleButton, nameButton });

    styleButton = 'fps-down';
    nameButton = '-';
    this.fpsDownButton = FpsBar.createButton(this.fpsBar, { styleButton, nameButton });

    this.fpsContainer = document.createElement('div');
    this.fpsContainer.classList.add('fps-value');
    this.fpsContainer.innerText = this.fpsValue;
    this.fpsBar.appendChild(this.fpsContainer);

    parent.appendChild(this.fpsBar);
  }

  addListeners() {
    this.fpsUpButton.addEventListener('click', () => {
      if (this.fpsValue !== 24) {
        this.fpsValue += 1;
        this.fpsContainer.innerText = this.fpsValue;
      }
    });

    this.fpsDownButton.addEventListener('click', () => {
      if (this.fpsValue !== 1) {
        this.fpsValue -= 1;
        this.fpsContainer.innerText = this.fpsValue;
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

export default FpsBar;
