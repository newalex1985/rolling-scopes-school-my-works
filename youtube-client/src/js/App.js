import AppModel from './AppModel';
import AppView from './AppView';

class App {
  constructor() {
    this.searchString = '';
    this.links = '';
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
    this.addSearchListeners(this.viewer);
    this.viewer.addShowInterface();
    this.addShowListeneres(this.viewer.carouselViewer);
  }

  addSearchListeners(appView) {
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

  addShowListeneres(carouselView) {
    carouselView.buttonPrev.addEventListener('click', () => {
      carouselView.moveRight(carouselView.count);
      this.reloadChek(carouselView);
    });
    carouselView.buttonNext.addEventListener('click', () => {
      carouselView.moveLeft(carouselView.count);
      this.reloadChek(carouselView);
    });
    carouselView.gallery.addEventListener('mousedown', (eventMousedown) => {
      carouselView.swipe(eventMousedown);
      this.reloadChek(carouselView);
    });
  }

  saveSearchString(string) {
    this.searchString = string.trim();
  }

  async search() {
    if (this.searchString !== '') {
      const model = new AppModel(this.state);
      const clips = await model.getClips(this.searchString);
      this.links = clips.links;
      this.viewer.render(clips.data);
    }
  }

  async reloadChek(view) {
    console.log(view.currentCard);
    if (view.currentCard >= 12) {
      const model = new AppModel(this.state);
      const clips = await model.getClips(this.searchString, this.links.nextPageToken);
      console.log(clips);
    }
  }
}

export default App;
