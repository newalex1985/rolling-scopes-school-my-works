import FpsBar from './FpsBar';

class AnimationControlPanel {
  constructor(linkAppView) {
    this.linkAppView = linkAppView;
    this.animationControlPanel = document.createElement('div');
    this.startStopAnimationButton = '';
    this.animationSetting = {
      state: 'stop',
      timerId: '',
    };
    this.fpsBarLink = '';
    this.fullScreenButton = '';
    // this.canvasSize = document.createElement('div');
    // this.coordShowArea = document.createElement('div');
  }

  init(parent) {
    this.animationControlPanel.classList.add('animation-control-panel');
    let styleButton = 'start-stop-animation';
    let nameButton = 'Start/stop animation';
    // eslint-disable-next-line max-len
    this.startStopAnimationButton = AnimationControlPanel.createButton(this.animationControlPanel, { styleButton, nameButton });

    this.fpsBarLink = new FpsBar('fps');
    this.fpsBarLink.init(this.animationControlPanel);
    this.fpsBarLink.addListeners();

    styleButton = 'full-screen';
    nameButton = 'Full screen';
    // eslint-disable-next-line max-len
    this.fullScreenButton = AnimationControlPanel.createButton(this.animationControlPanel, { styleButton, nameButton });

    // this.canvasSize.classList.add('canvas-size-box');

    // const styleButton = 'canvas-size-but';
    // let nameButton = '32x32';

    // let size = CanvasControlPanel.createButton(this.canvasSize, { styleButton, nameButton });
    // size.setAttribute('data-size', '32');

    // nameButton = '64x64';
    // size = CanvasControlPanel.createButton(this.canvasSize, { styleButton, nameButton });
    // size.setAttribute('data-size', '64');

    // nameButton = '128x128';
    // size = CanvasControlPanel.createButton(this.canvasSize, { styleButton, nameButton });
    // size.setAttribute('data-size', '128');

    // this.canvasControlPanel.appendChild(this.canvasSize);

    // this.coordShowArea.classList.add('coord-show-area');
    // const coord = document.createElement('div');
    // coord.classList.add('box-show-area');
    // this.coordShowArea.appendChild(coord);
    // const penUnit = document.createElement('div');
    // penUnit.classList.add('box-show-area');
    // this.coordShowArea.appendChild(penUnit);
    // const tool = document.createElement('div');
    // tool.classList.add('box-show-area');
    // this.coordShowArea.appendChild(tool);
    // this.canvasControlPanel.appendChild(this.coordShowArea);

    parent.appendChild(this.animationControlPanel);

    // this.makeSizeActive(0);
  }

  // makeSizeActive(indexSize) {
  //   for (let i = 0; i < this.canvasSize.children.length; i += 1) {
  //     if (this.canvasSize.children[i].classList.contains('canvas-size-active')) {
  //       this.canvasSize.children[i].classList.remove('canvas-size-active');
  //     }
  //   }
  //   this.canvasSize.children[indexSize].classList.add('canvas-size-active');
  // }

  addStartStopAnimationButtonListener() {
    this.startStopAnimationButton.addEventListener('click', () => {
      if (this.animationSetting.state === 'stop') {
        this.animationSetting.state = 'start';
        let count = 0;
        this.animationSetting.timerId = setInterval(() => {
          const frameData = this.linkAppView.frameBar.frames[count];
          this.linkAppView.animationViewer.draw(frameData);
          count += 1;
          if (count === this.linkAppView.frameBar.frames.length) {
            count = 0;
          }
        }, 1000 / this.fpsBarLink.fpsValue);
      } else {
        this.animationSetting.state = 'stop';
        clearInterval(this.animationSetting.timerId);
        this.linkAppView.animationViewer.draw();
      }
    });
  }

  addFullScreenButtonListener() {
    this.fullScreenButton.addEventListener('click', () => {
      this.linkAppView.animationViewer.fullScreenMode();
    });
  }

  addListeners() {
    this.addStartStopAnimationButtonListener();
    this.addFullScreenButtonListener();
  }

  static createButton(parrent, { styleButton, nameButton }) {
    const button = document.createElement('div');
    button.classList.add(styleButton);
    button.innerText = nameButton;
    parrent.appendChild(button);
    return button;
  }
}

export default AnimationControlPanel;
