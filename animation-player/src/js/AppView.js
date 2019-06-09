import '../css/style.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import ColorPickerView from './ColorPickerView';
import FrameBar from './FrameBar';
import { AnimationView, DrawView } from './CanvasView';

class AppView {
  constructor() {
    this.root = document.querySelector('body');
    this.commonContainer = document.createElement('div');
    this.toolSection = document.createElement('div');
    this.frameSection = document.createElement('div');
    this.drawSection = document.createElement('div');
    this.animationSection = document.createElement('div');
    this.drawViewer = '';
    this.animationViewer = '';
  }

  addCommonInterface() {
    this.commonContainer.classList.add('common-container');
    // tool-section
    this.toolSection.classList.add('tool-section');
    const colorPickerContainer = document.createElement('div');
    const colorPicker = new ColorPickerView(3, 'button');
    colorPicker.init(colorPickerContainer);
    colorPicker.addListeners();
    this.toolSection.appendChild(colorPickerContainer);
    // frame-section
    this.frameSection.classList.add('frame-section');
    const frameBar = new FrameBar();
    frameBar.init(this.frameSection);
    // draw-section
    this.drawSection.classList.add('draw-section');
    this.drawViewer = new DrawView(colorPicker, 500, 500);
    this.drawViewer.init(this.drawSection);
    this.drawViewer.addListeners();

    frameBar.drawViewLink = this.drawViewer;

    // animation-section
    this.animationSection.classList.add('animation-section');
    this.animationViewer = new AnimationView(500, 500);
    this.animationViewer.init(this.animationSection);

    frameBar.animationViewLink = this.animationViewer;
    frameBar.addListeners();

    this.commonContainer.appendChild(this.toolSection);
    this.commonContainer.appendChild(this.frameSection);
    this.commonContainer.appendChild(this.drawSection);
    this.commonContainer.appendChild(this.animationSection);
    this.root.appendChild(this.commonContainer);
  }
}

export default AppView;
