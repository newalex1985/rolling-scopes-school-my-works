import FpsBar from './FpsBar';
import Frame from './Frame';

class FrameBar {
  constructor() {
    this.frameBar = document.createElement('div');
    this.clearButton = '';
    this.addFrameButton = '';
    this.startStopAnimationButton = '';
    this.fullScreenButton = '';
    this.framesArea = document.createElement('div');
    this.fpsBarLink = '';
    this.drawViewLink = '';
    this.animationViewLink = '';
    this.frames = [];
    this.animationSetting = {
      state: 'stop',
      timerId: '',
    };
    this.timerIdFramePreview = '';
  }

  init(parent) {
    let styleButton = 'clear';
    let nameButton = 'Clear';
    this.clearButton = FrameBar.createButton(this.frameBar, { styleButton, nameButton });

    styleButton = 'add-frame';
    nameButton = 'Add frame';
    this.addFrameButton = FrameBar.createButton(this.frameBar, { styleButton, nameButton });

    styleButton = 'start-stop-animation';
    nameButton = 'Start/stop animation';
    // eslint-disable-next-line max-len
    this.startStopAnimationButton = FrameBar.createButton(this.frameBar, { styleButton, nameButton });

    styleButton = 'full-screen';
    nameButton = 'Full screen';
    this.fullScreenButton = FrameBar.createButton(this.frameBar, { styleButton, nameButton });

    this.fpsBarLink = new FpsBar('fps');
    this.fpsBarLink.init(this.frameBar);
    this.fpsBarLink.addListeners();

    this.framesArea.classList.add('frames-area');
    this.frameBar.appendChild(this.framesArea);

    parent.appendChild(this.frameBar);
  }

  bindingCanvas(link) {
    this.drawViewLink = link;
    this.drawViewLink.emptyContent = this.drawViewLink.area.toDataURL('image/png');

    const frame = new Frame(this.drawViewLink.emptyContent);
    frame.add(this.framesArea, this.frames.length + 1);
    frame.fillContent(this.drawViewLink.emptyContent);
    this.frames.push(this.drawViewLink.emptyContent);

    this.drawViewLink.indexCurrentFrame = 0;
    this.makeFrameActive(this.drawViewLink.indexCurrentFrame);

    this.drawViewLink.area.addEventListener('mouseover', () => {
      this.timerIdFramePreview = setInterval(() => {
        this.drawFramePreview();
      }, 250);
    });
    this.drawViewLink.area.addEventListener('mouseout', () => {
      clearInterval(this.timerIdFramePreview);
    });
  }

  drawFramePreview() {
    const data = this.drawViewLink.area.toDataURL('image/png');
    this.frames[this.drawViewLink.indexCurrentFrame] = data;
    this.framesArea.children[this.drawViewLink.indexCurrentFrame].children[3].src = data;
  }

  deleteFrame(frame) {
    const arrayFrames = Array.prototype.slice.call(this.framesArea.children);
    const indexFrame = arrayFrames.indexOf(frame);
    frame.remove();
    this.frames.splice(indexFrame, 1);
    return indexFrame;
  }

  renumerationFrames() {
    const frames = this.framesArea.children;
    for (let i = 0; i < frames.length; i += 1) {
      frames[i].firstChild.innerText = i + 1;
    }
  }

  copyFrame(frame) {
    const clone = frame.cloneNode(true);
    clone.firstChild.innerText = `${this.frames.length + 1}`;
    this.framesArea.appendChild(clone);
    const frameContent = clone.lastChild.getAttribute('src');
    this.frames.push(frameContent);
  }

  makeFrameActive(indexFrame) {
    for (let i = 0; i < this.framesArea.children.length; i += 1) {
      if (this.framesArea.children[i].classList.contains('frame-active')) {
        this.framesArea.children[i].classList.remove('frame-active');
      }
    }
    this.framesArea.children[indexFrame].classList.add('frame-active');
  }

  commonFrameClickHandler(indexCurrentFrame) {
    this.makeFrameActive(indexCurrentFrame);
    const frameData = this.frames[indexCurrentFrame];
    this.drawViewLink.draw(frameData);
  }

  addClearButtonListener() {
    this.clearButton.addEventListener('click', () => {
      this.drawViewLink.draw();
      this.drawFramePreview();
    });
  }

  addAddFrameButtonListener() {
    this.addFrameButton.addEventListener('click', () => {
      const frameContent = this.drawViewLink.emptyContent;

      // this.drawViewLink.draw(frameContent);
      this.drawViewLink.draw();

      const frame = new Frame(frameContent);
      frame.add(this.framesArea, this.frames.length + 1);
      frame.fillContent(frameContent);
      this.frames.push(frameContent);
      this.drawViewLink.indexCurrentFrame = this.frames.length - 1;
      this.makeFrameActive(this.drawViewLink.indexCurrentFrame);
    });
  }

  addStartStopAnimationButtonListener() {
    this.startStopAnimationButton.addEventListener('click', () => {
      if (this.animationSetting.state === 'stop') {
        this.animationSetting.state = 'start';
        let count = 0;
        this.animationSetting.timerId = setInterval(() => {
          const frameData = this.frames[count];
          this.animationViewLink.draw(frameData);
          count += 1;
          if (count === this.frames.length) {
            count = 0;
          }
        }, 1000 / this.fpsBarLink.fpsValue);
      } else {
        this.animationSetting.state = 'stop';
        clearInterval(this.animationSetting.timerId);
        this.animationViewLink.draw();
      }
    });
  }

  addFullScreenButtonListener() {
    this.fullScreenButton.addEventListener('click', () => {
      this.animationViewLink.fullScreenMode();
    });
  }

  addframesAreaListeners() {
    this.framesArea.addEventListener('click', (e) => {
      const { target } = e;
      if (target.parentNode.hasAttribute('data-purpose')) {
        const { purpose } = target.parentNode.dataset;
        if (purpose === 'delete') {
          // check: don't allow delete the last frame
          if (target.parentNode.parentNode.parentNode.parentNode.children.length === 1) {
            return;
          }
          let indexFrame = this.deleteFrame(target.parentNode.parentNode.parentNode);
          this.renumerationFrames();
          indexFrame -= 1;
          this.drawViewLink.indexCurrentFrame = (indexFrame === -1) ? 0 : indexFrame;
        } else if (purpose === 'copy') {
          this.copyFrame(target.parentNode.parentNode.parentNode);
          this.drawViewLink.indexCurrentFrame = this.frames.length - 1;
        } else if (purpose === 'show') {
          const frame = target.parentNode;
          const arrayFrames = Array.prototype.slice.call(this.framesArea.children);
          this.drawViewLink.indexCurrentFrame = arrayFrames.indexOf(frame);
        }
        this.commonFrameClickHandler(this.drawViewLink.indexCurrentFrame);
      }
    });
  }

  addListeners() {
    this.addClearButtonListener();
    this.addAddFrameButtonListener();
    this.addStartStopAnimationButtonListener();
    this.addFullScreenButtonListener();
    this.addframesAreaListeners();
  }

  static createButton(parrent, { styleButton, nameButton }) {
    const button = document.createElement('div');
    button.classList.add(styleButton);
    button.innerText = nameButton;
    parrent.appendChild(button);
    return button;
  }
}

export default FrameBar;
