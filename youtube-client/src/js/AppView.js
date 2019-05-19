import '../css/style.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import Carousel from './CarouselView';
import ClipCard from './ClipCardView';

class AppView {
  constructor() {
    this.root = document.querySelector('body');
    this.searchBox = document.createElement('div');
    this.searchInput = document.createElement('input');
    this.searchButton = document.createElement('button');
    this.showBox = document.createElement('div');
    this.carouselViewer = '';
  }

  addSearchInterface() {
    this.searchInput.setAttribute('placeholder', 'Place your request here...');
    this.searchButton.innerHTML = 'Search';
    this.searchBox.appendChild(this.searchInput);
    this.searchBox.appendChild(this.searchButton);
    this.searchBox.classList.add('search-box');
    this.root.appendChild(this.searchBox);
  }

  addShowInterface() {
    this.showBox.classList.add('show-box');
    this.carouselViewer = new Carousel();
    this.carouselViewer.init(this.showBox);
    this.root.appendChild(this.showBox);
  }

  renderSlider(clips, renderMode) {
    console.log(clips);
    this.showBox.style.display = 'flex';
    const clipsContainer = this.carouselViewer.clips;
    if (renderMode !== 'continuation') {
      this.carouselViewer.clear();
    }

    clips.forEach((clip) => {
      const clipCard = new ClipCard(clip).createClipCard(this.carouselViewer.width);
      const list = document.createElement('li');
      list.appendChild(clipCard);
      clipsContainer.appendChild(list);
    });
    this.carouselViewer.carouselState.total += clips.length;
  }

  renderPagination() {
    const {
      carouselState, numPerFrame, maxNumPagesToView, pagination,
    } = this.carouselViewer;
    const { left, right, total } = carouselState;
    const numPagesPag = Math.ceil(total / this.carouselViewer.numPerFrame);
    while (pagination.firstChild) {
      pagination.firstChild.remove();
    }

    console.log(`removed all pages, right now is: ${right}`);

    if (right <= (maxNumPagesToView * numPerFrame)) {
      const numPgToView = (numPagesPag <= maxNumPagesToView) ? numPagesPag : maxNumPagesToView;
      for (let i = 0; i < numPgToView; i += 1) {
        const page = document.createElement('div');
        page.classList.add('pagination-page');
        pagination.appendChild(page);
      }
      console.log(`added pages: ${numPgToView}`);
      console.log(right);
      console.log(`prev num act pag: ${carouselState.numActivePage}`);
      if (pagination.children.length > 0) {
        if (pagination.children.length >= carouselState.numActivePage) {
          const elemPrev = pagination.children[carouselState.numActivePage - 1];
          elemPrev.innerHTML = '';
          elemPrev.classList.remove('pagination-page-active');
        }
        carouselState.numActivePage = Math.ceil(right / numPerFrame);
        console.log(`current num act pag: ${carouselState.numActivePage}`);
        const elemCur = pagination.children[carouselState.numActivePage - 1];
        elemCur.innerHTML = `${carouselState.numActivePage}`;
        elemCur.classList.add('pagination-page-active');
      }
    } else {
      const representation = document.createElement('div');
      const innerRp = `${(numPerFrame > 1) ? `[${left} - ${right}] ` : `${left}`} of ${total}`;
      representation.innerHTML = innerRp;
      representation.classList.add('pagination-representation');
      pagination.appendChild(representation);
    }
  }

  resize() {
    const { carouselViewer } = this;
    const { clientWidth } = this.root;
    const style = getComputedStyle(carouselViewer.buttonPrev);
    const { width, marginLeft, marginRight } = style;
    const buttonWidth = parseInt(width, 10) + parseInt(marginLeft, 10) + parseInt(marginRight, 10);
    const compareValue4perFrame = 2 * buttonWidth + 4 * carouselViewer.width;
    const compareValue3perFrame = 2 * buttonWidth + 3 * carouselViewer.width;
    const compareValue2perFrame = 2 * buttonWidth + 2 * carouselViewer.width;
    let numPerFrame;
    if (clientWidth >= compareValue4perFrame) {
      console.log(`4: >=${compareValue4perFrame}: ${clientWidth}`);
      numPerFrame = 4;
    } else if (clientWidth >= compareValue3perFrame) {
      console.log(`3: >=${compareValue3perFrame}: ${clientWidth}`);
      numPerFrame = 3;
    } else if (clientWidth >= compareValue2perFrame) {
      console.log(`2: >=${compareValue2perFrame}: ${clientWidth}`);
      numPerFrame = 2;
    } else {
      console.log(`1: < ${compareValue2perFrame}: ${clientWidth}`);
      numPerFrame = 1;
    }
    carouselViewer.resize(numPerFrame);
    // this.renderPagination();
  }
}

export default AppView;
