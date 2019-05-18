import AppModel from './AppModel';
import AppView from './AppView';

class App {
  constructor() {
    this.searchString = '';
    this.links = '';
    this.state = {
      url: 'https://www.googleapis.com/youtube/v3/',
      key: 'AIzaSyCzlEk4X-i9xvRqcShxiJ7DTcSmwmRbMcw',
      // key: 'AIzaSyB8u3qcbdYyO1F2n8mwkRYc5nZBtztmOcU',
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
      carouselView.moveRight(carouselView.numPerFrame);
      this.reloadCheck(carouselView);
      // this.viewer.renderPagination();
    });
    carouselView.buttonNext.addEventListener('click', () => {
      carouselView.moveLeft(carouselView.numPerFrame);
      this.reloadCheck(carouselView);
      // this.viewer.renderPagination();
    });
    carouselView.gallery.addEventListener('mousedown', (eventMousedown) => {
      const result = carouselView.constructor.swipe(eventMousedown);
      if (result !== undefined) {
        const mouseupHandler = (eventMouseup) => {
          document.removeEventListener('mouseup', mouseupHandler);
          const { targetCoordLeft, targetCoordRight } = result;
          const currentCoordX = eventMouseup.pageX;
          if (currentCoordX > targetCoordRight) {
            carouselView.moveRight(1);
          } else if (currentCoordX < targetCoordLeft) {
            carouselView.moveLeft(1);
          }
          console.log(`Enter: ${this}`);
          this.reloadCheck(carouselView);
          // this.viewer.renderPagination();
        };
        document.addEventListener('mouseup', mouseupHandler);
      }
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
      this.viewer.renderSlider(clips.data, 'start');
      this.viewer.renderPagination();
    }
  }

  async reloadCheck(view) {
    console.log(`${view.carouselState.left} - ${view.carouselState.right}`);
    const { total } = view.carouselState;
    const { numPerFrame } = view;
    const numToCatch = total - (total % numPerFrame);
    console.log(total);
    console.log(`numToCatch: ${numToCatch}`);
    const reload = ((total - numToCatch) < numPerFrame);
    if (view.carouselState.dir === 'left' && view.carouselState.right >= numToCatch && reload) {
      const model = new AppModel(this.state);
      const clips = await model.getClips(this.searchString, this.links.nextPageToken);
      this.links = clips.links;
      this.viewer.renderSlider(clips.data, 'continuation');
      console.log(clips);
    }

    // // !!! must to read actualy value of total after potential request "getClips"
    // ({ total } = view.carouselState);
    // // !!! necessary put this check, because possible delay response from the youtube server
    // if (view.carouselState.right > total) {
    // } else {
    //   this.viewer.renderPagination();
    // }

    // re-write the code above from async to prommises beaause
    //  possible delay response from the youtube server ???
    //  must check more carefully
    // let it be so...
    this.viewer.renderPagination();
  }
}

export default App;
