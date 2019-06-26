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
    this.framesArea.children[this.drawViewLink.indexCurrentFrame].firstChild.children[4].src = data;
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
      frames[i].firstChild.firstChild.innerText = i + 1;
    }
  }

  copyFrame(frame) {
    const clone = frame.cloneNode(true);
    clone.firstChild.firstChild.innerText = `${this.frames.length + 1}`;
    this.framesArea.appendChild(clone);
    const frameContent = clone.firstChild.lastChild.getAttribute('src');
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
    const self = this;
    function canvasMosedown(e) {
      // console.log('mousedown');
      const sceletons = document.querySelector('.frames-area').children;
      function getCoords(elem) {
        const box = elem.getBoundingClientRect();
        return {
          // eslint-disable-next-line no-restricted-globals
          top: box.top + pageYOffset,
          // eslint-disable-next-line no-restricted-globals
          // left: box.left + pageXOffset,
        };
      }

      function getFramesPosition() {
        const sceletonsArray = Array.prototype.slice.call(sceletons);
        const framesPosition = sceletonsArray.map((elem) => {
          const startY = getCoords(elem).top + elem.offsetHeight / 2 - 30;
          const endY = startY + 30;
          return [startY, endY];
        });
        return framesPosition;
      }

      const elmnt = e.target.parentNode;
      // console.log(elmnt);
      const positions = getFramesPosition();

      function findFrame(coord) {
        let num;
        positions.forEach((elem, index) => {
          if ((coord > elem[0]) && (coord < elem[1])) {
            num = index;
          }
        });
        return num;
      }

      // eslint-disable-next-line max-len
      // let movePositionX = 0; let movePositionY = 0; let startPositionX = 0; let startPositionY = 0;
      let movePositionY = 0; let startPositionY = 0;
      // eslint-disable-next-line no-shadow
      function elementDrag(ee) {
        // console.log('move');
        // calculate the new cursor position:
        // movePositionX = startPositionX - ee.pageX;
        movePositionY = startPositionY - ee.pageY;
        // startPositionX = ee.pageX;
        startPositionY = ee.pageY;
        // set the element's new position:

        // elmnt.style.top = `${elmnt.offsetTop - movePositionY}px`;
        elmnt.parentNode.parentNode.style.top = `${getCoords(elmnt.parentNode.parentNode).top - movePositionY}px`;
        // elmnt.style.left = `${elmnt.offsetLeft - movePositionX}px`;

        for (let i = 0; i < sceletons.length; i += 1) {
          if (sceletons[i].classList.contains('frame-potential')) {
            sceletons[i].classList.remove('frame-potential');
          }
        }

        const numCoverFrame = findFrame(ee.pageY);
        if (numCoverFrame !== undefined) {
          sceletons[numCoverFrame].classList.add('frame-potential');
        }
      }

      // eslint-disable-next-line no-unused-vars
      function closeDragElement(eee) {
        // console.log('MOUSEUP stop');
        elmnt.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);

        const numCoverFrame = findFrame(eee.pageY);
        const movingFrame = elmnt.parentNode.parentNode.parentNode;
        // console.log('movingFrame, num', movingFrame, movingFrame.firstChild.innerText);
        const arraySceletons = Array.prototype.slice.call(sceletons);

        const numMovingFrame = arraySceletons.indexOf(movingFrame);
        // console.log('numMovingFrame', numMovingFrame);
        // console.log('numCoverFrame', numCoverFrame);
        // const target = eee.target.parentNode;
        // console.log('close drag target', target);
        // eslint-disable-next-line max-len
        if (numCoverFrame !== undefined && numMovingFrame !== -1 && numCoverFrame !== numMovingFrame) {
          const elemCopyTo = sceletons[numCoverFrame].cloneNode(true);
          const contentCopyTo = self.frames[numCoverFrame];
          // const elemCopyFrom = elmnt.parentNode.parentNode.parentNode.cloneNode(true);
          const elemCopyFrom = sceletons[numMovingFrame].cloneNode(true);
          const contentCopyFrom = self.frames[numMovingFrame];
          sceletons[numCoverFrame].parentNode.replaceChild(elemCopyFrom, sceletons[numCoverFrame]);
          self.frames[numCoverFrame] = contentCopyFrom;
          sceletons[numCoverFrame].firstChild.style.position = 'relative';
          sceletons[numCoverFrame].firstChild.style.top = '';
          sceletons[numCoverFrame].firstChild.style.zIndex = '';
          // eslint-disable-next-line max-len
          // sceletons[numCoverFrame].parentNode.replaceChild(elemCopyTo, elmnt.parentNode.parentNode.parentNode);
          sceletons[numCoverFrame].parentNode.replaceChild(elemCopyTo, sceletons[numMovingFrame]);
          self.frames[numMovingFrame] = contentCopyTo;
          self.renumerationFrames();
          self.drawViewLink.indexCurrentFrame = numCoverFrame;
          self.commonFrameClickHandler(self.drawViewLink.indexCurrentFrame);
          // console.log('change');
        } else {
          elmnt.parentNode.parentNode.style.position = 'relative';
          elmnt.parentNode.parentNode.style.top = '';
          elmnt.parentNode.parentNode.style.zIndex = '';
          // sceletons[numMovingFrame].firstChild.style.position = 'relative';
          // sceletons[numMovingFrame].firstChild.style.top = '';
          // sceletons[numMovingFrame].firstChild.style.zIndex = '';
          // console.log('not change');
        }

        for (let i = 0; i < sceletons.length; i += 1) {
          if (sceletons[i].classList.contains('frame-potential')) {
            sceletons[i].classList.remove('frame-potential');
          }
        }
      }

      if (elmnt.hasAttribute('data-purpose')) {
        const { purpose } = elmnt.dataset;
        if (purpose === 'move') {
          // console.log('purpose', purpose);
          // console.log('start down');
          const coords = getCoords(elmnt.parentNode.parentNode);
          // const shiftX = e.pageX - coords.left;
          const shiftY = e.pageY - coords.top;

          elmnt.parentNode.parentNode.style.position = 'absolute';
          elmnt.parentNode.parentNode.style.zIndex = 1000;

          // elmnt.style.left = `${e.pageX - shiftX}px`;
          elmnt.parentNode.parentNode.style.top = `${e.pageY - shiftY}px`;

          // get the mouse cursor position at startup:
          // startPositionX = e.pageX;
          startPositionY = e.pageY;

          elmnt.parentNode.parentNode.addEventListener('mouseup', closeDragElement);
          // call a function whenever the cursor moves:
          document.addEventListener('mousemove', elementDrag);
        }
      }
    }

    this.framesArea.addEventListener('mousedown', canvasMosedown);
    this.framesArea.addEventListener('dragstart', () => false);

    this.framesArea.addEventListener('click', (e) => {
      // console.log('click');
      const { target } = e;
      if (target.parentNode.hasAttribute('data-purpose')) {
        const { purpose } = target.parentNode.dataset;
        if (purpose === 'delete') {
          // check: don't allow delete the last frame
          if (target.parentNode.parentNode.parentNode.parentNode.parentNode.children.length === 1) {
            return;
          }
          let indexFrame = this.deleteFrame(target.parentNode.parentNode.parentNode.parentNode);
          this.renumerationFrames();
          indexFrame -= 1;
          this.drawViewLink.indexCurrentFrame = (indexFrame === -1) ? 0 : indexFrame;
        } else if (purpose === 'copy') {
          this.copyFrame(target.parentNode.parentNode.parentNode.parentNode);
          this.drawViewLink.indexCurrentFrame = this.frames.length - 1;
        } else if (purpose === 'show') {
          const frame = target.parentNode.parentNode;
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
