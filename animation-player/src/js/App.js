import AppView from './AppView';

class App {
  constructor() {
    this.viewer = '';
  }

  start() {
    this.viewer = new AppView();
    this.viewer.addCommonInterface();
  }
}

export default App;
