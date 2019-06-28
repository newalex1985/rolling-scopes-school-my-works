import '../css/style.css';
import ColorPickerView from './ColorPickerView';
import FrameBar from './FrameBar';
import { AnimationView, DrawView } from './CanvasView';
import PenUnit from './PenUnit';
import CanvasSize from './CanvasSize';
import Tools from './Tools';

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
    this.penUnit = '';
    this.canvasSize = '';
    this.tools = '';
  }

  addCommonInterface() {
    this.commonContainer.classList.add('common-container');
    // tool-section
    this.toolSection.classList.add('tool-section');
    // canvas-size-toll
    this.penUnit = new PenUnit(this);
    this.penUnit.init(this.toolSection);
    this.penUnit.addListeners();
    // tools
    this.tools = new Tools(this);
    this.tools.init(this.toolSection);
    this.tools.addListeners();
    // color-picker-tool
    const colorPicker = new ColorPickerView(3, 'button');
    colorPicker.init(this.toolSection);
    colorPicker.addListeners();
    // frame-section
    this.frameSection.classList.add('frame-section');
    const frameBar = new FrameBar();
    frameBar.init(this.frameSection);
    // draw-section
    this.drawSection.classList.add('draw-section');
    this.drawViewer = new DrawView(this, colorPicker, 512, 512);
    // this.drawViewer = new DrawView(this, colorPicker, 500, 500);
    this.drawViewer.init(this.drawSection);
    this.drawViewer.addListeners();
    this.canvasSize = new CanvasSize(this);
    this.canvasSize.init(this.drawSection);
    this.canvasSize.addListeners();
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

    frameBar.bindingCanvas(this.drawViewer);
  }
}

export default AppView;
