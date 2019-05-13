import '../css/style.css';
import AppModel from './AppModel';
import AppView from './AppView';

class App {
  constructor(root) {
    this.root = root;
    this.searchString = '';
    this.searchInput = document.createElement('input');
    this.searchButton = document.createElement('button');
    // this.url = 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyCzlEk4X-i9xvRqcShxiJ7DTcSmwmRbMcw&type=video&part=snippet&maxResults=15&q=js';
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
  }

  addSearchInterface() {
    // this.searchButton.classList.add('button');
    this.searchButton.innerHTML = 'Search';
    this.root.appendChild(this.searchInput);
    this.root.appendChild(this.searchButton);
    this.addListeners();
  }

  addListeners() {
    this.searchInput.addEventListener('change', (event) => {
      this.saveSearchString(event.target.value);
    });
    this.searchButton.addEventListener('click', () => {
      this.search();
    });
  }

  saveSearchString(string) {
    this.searchString = string;
    console.log(this.searchString);
  }

  // add in Model
  // search() {
  //   const { url, key } = this.state;
  //   let templateParam = '';
  //   Object.entries(this.state.param).forEach((elem) => {
  //     templateParam += `&${elem[0]}=${elem[1]}`;
  //   });
  //   const templateQuery = `${url}?key=${key}${templateParam}&q=${this.searchString}`;
  //   fetch(`${templateQuery}`)
  //     .then(response => response.json())
  //     .then(data => console.log(data));
  // }

  async search() {
    // think about to call AppModel once
    const model = new AppModel(this.state);
    // may be put searchString in state?
    const clips = await model.getClips(this.searchString);
    console.log(clips);

    const view = new AppView(clips);
    view.render();
  }
}

export default App;
