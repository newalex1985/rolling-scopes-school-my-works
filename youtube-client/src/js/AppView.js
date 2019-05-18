import '../css/style.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';

class Carousel {
  constructor() {
    this.carouselState = {
      left: 1,
      right: 4,
      dir: '',
      total: 0,
      numActivePage: 1,
    };
    this.position = 0;
    this.width = 250;
    this.numPerFrame = 4;
    this.carousel = document.createElement('div');
    this.slider = document.createElement('div');
    this.buttonPrev = document.createElement('div');
    this.buttonNext = document.createElement('div');
    this.gallery = document.createElement('div');
    this.clips = document.createElement('ul');
    this.pagination = document.createElement('div');
  }

  init(parent) {
    this.carousel.classList.add('carousel');
    this.slider.classList.add('slider');
    this.buttonPrev.classList.add('arrow');
    Carousel.createFontAwesome(this.buttonPrev, 'fas', 'fa-arrow-left');
    this.buttonNext.classList.add('arrow');
    Carousel.createFontAwesome(this.buttonNext, 'fas', 'fa-arrow-right');
    this.gallery.classList.add('gallery');
    this.pagination.classList.add('pagination');
    this.slider.appendChild(this.buttonPrev);
    this.slider.appendChild(this.gallery);
    this.slider.appendChild(this.buttonNext);
    this.gallery.appendChild(this.clips);
    this.carousel.appendChild(this.slider);
    this.carousel.appendChild(this.pagination);
    parent.appendChild(this.carousel);
  }

  clear() {
    while (this.clips.firstChild) {
      this.clips.firstChild.remove();
    }
    this.position = 0;
    this.move(this.position);
    this.carouselState.left = 1;
    this.carouselState.right = 4;
    this.carouselState.dir = '';
    this.carouselState.total = 0;
    this.carouselState.numActivePage = 1;
  }

  moveLeft(count) {
    const numItems = this.clips.children.length;
    // think about this limit right side of slider (will be continuous load of cards)
    this.position = Math.max(this.position - this.width * count, -this.width * (numItems - count));
    this.move(this.position);
    this.carouselState.dir = 'left';
    this.carouselState.left += count;
    this.carouselState.right += count;
  }

  moveRight(count) {
    this.position = Math.min(this.position + this.width * count, 0);
    this.move(this.position);
    this.carouselState.dir = 'right';
    this.carouselState.left -= count;
    this.carouselState.right -= count;
    if (this.carouselState.right < 4) {
      this.carouselState.left = 1;
      this.carouselState.right = 4;
    }
  }

  static swipe(eventMousedown) {
    const { target } = eventMousedown;
    if (target.classList.contains('clip-card')) {
      const targetCoords = Carousel.getCoords(target);
      const targetCoordLeft = targetCoords.left;
      const targetCoordRight = targetCoords.left + target.offsetWidth;
      return {
        targetCoordLeft,
        targetCoordRight,
      };
    }
    return undefined;
  }

  move(position) {
    this.clips.style.marginLeft = `${position}px`;
  }

  static createFontAwesome(elemParent, styleFont, font) {
    const elemFont = document.createElement('i');
    elemFont.classList.add(styleFont);
    elemFont.classList.add(font);
    elemParent.appendChild(elemFont);
  }

  static getCoords(elem) {
    const box = elem.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset,
    };
  }
}

class ClipCard {
  constructor(clip) {
    this.clip = clip;
  }

  createClipCard() {
    const containerClipCard = document.createElement('div');
    containerClipCard.innerText = this.clip.title;
    containerClipCard.classList.add('clip-card');
    containerClipCard.style.backgroundImage = `url(${this.clip.clipPreview.medium.url})`;
    containerClipCard.style.backgroundRepeat = 'no-repeat';
    containerClipCard.style.backgroundSize = '100% 100%';
    return containerClipCard;
  }
}

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
    //  переделать потом на форму
    // this.searchInput.value = 'Place your request here...';
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
      const clipCard = new ClipCard(clip).createClipCard();
      const list = document.createElement('li');
      list.appendChild(clipCard);
      clipsContainer.appendChild(list);
    });
    this.carouselViewer.carouselState.total += clips.length;
  }

  renderPagination() {
    // must to check on num of numPagesPagination for pagination [25-29]
    // --
    const { carouselState, pagination } = this.carouselViewer;
    const { total } = carouselState;
    const numPagesPagination = Math.ceil(total / this.carouselViewer.numPerFrame);
    while (pagination.firstChild) {
      pagination.firstChild.remove();
    }

    console.log('removed all pages');

    for (let i = 0; i < numPagesPagination; i += 1) {
      const page = document.createElement('div');
      page.classList.add('pagination-page');
      pagination.appendChild(page);
    }
    console.log(`added pages: ${numPagesPagination}`);
    // --
    const { right } = carouselState;
    console.log(right);
    const { numPerFrame } = this.carouselViewer;
    console.log(`prev num act pag: ${carouselState.numActivePage}`);
    let elem = pagination.children[carouselState.numActivePage - 1];
    elem.classList.remove('pagination-page-active');
    carouselState.numActivePage = Math.ceil(right / numPerFrame);
    console.log(`current num act pag: ${carouselState.numActivePage}`);
    elem = pagination.children[carouselState.numActivePage - 1];
    elem.classList.add('pagination-page-active');
    // --
  }
}

export default AppView;
