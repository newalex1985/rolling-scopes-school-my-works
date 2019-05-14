import AppModel from './AppModel';
import AppView from './AppView';

class App {
  constructor() {
    this.searchString = '';
    this.state = {
      url: 'https://www.googleapis.com/youtube/v3/',
      key: 'AIzaSyCzlEk4X-i9xvRqcShxiJ7DTcSmwmRbMcw',
      modeSearch: {
        mode: 'search',
        param: {
          type: 'video',
          part: 'snippet',
          maxResults: '15',
        },
      },
      modeStatistics: {
        mode: 'videos',
        param: {
          // think about explode
          part: 'snippet,statistics',
        },
      },
    };
    this.viewer = '';
  }

  start() {
    this.viewer = new AppView();
    this.viewer.addSearchInterface();
    this.addListeners(this.viewer);
    this.viewer.addShowInterface();
  }

  addListeners(appView) {
    appView.searchInput.addEventListener('change', (event) => {
      this.saveSearchString(event.target.value);
    });
    appView.searchInput.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.search();
      }
    });
    appView.searchButton.addEventListener('click', () => {
      this.search();
    });
  }

  saveSearchString(string) {
    this.searchString = string.trim();
  }

  async search() {
    if (this.searchString !== '') {
      const model = new AppModel(this.state);
      const clips = await model.getClips(this.searchString);
      this.viewer.render(clips);
    }
  }
}

export default App;
