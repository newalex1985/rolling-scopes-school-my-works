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
    this.maxNumPagesToView = 12;
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
    this.carouselState.right = this.carouselState.left + this.numPerFrame - 1;
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
      this.carouselState.right = this.carouselState.left + this.numPerFrame - 1;
    }
  }

  resize(numPerFrame) {
    this.numPerFrame = numPerFrame;
    this.carouselState.right = this.carouselState.left + this.numPerFrame - 1;
    this.gallery.style.width = `${this.numPerFrame * this.width}px`;
    console.log(`resizing carousel, numPerFrame: ${this.numPerFrame}, right: ${this.carouselState.right}`);
  }

  static swipe(eventMousedown) {
    const { target } = eventMousedown;
    if (target.hasAttribute('swipe')) {
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

  createClipCard(width) {
    const containerClipCard = document.createElement('div');
    const clipPrewiew = document.createElement('a');
    //  transfer from parametr
    clipPrewiew.setAttribute('href', `https://www.youtube.com/watch?v=${this.clip.id}`);
    const clipPicture = document.createElement('img');
    clipPicture.setAttribute('src', `${this.clip.clipPreview.medium.url}`);
    clipPicture.classList.add('clip-picture');
    clipPicture.style.width = `${width - 10 * 2}px`;
    clipPrewiew.appendChild(clipPicture);
    const information = document.createElement('div');
    information.classList.add('clip-information');
    const detalInfo = document.createElement('div');
    detalInfo.classList.add('clip-detal-info');
    const channelName = document.createElement('div');
    channelName.setAttribute('swipe', 'true');
    channelName.classList.add('center-style');
    const channelNameAws = document.createElement('div');
    ClipCard.createFontAwesome(channelNameAws, 'fas', 'fa-male');
    const channelNameValue = document.createElement('div');
    channelNameValue.classList.add('indent-style');
    channelNameValue.innerHTML = `${this.clip.author}`;
    channelName.appendChild(channelNameAws);
    channelName.appendChild(channelNameValue);
    const uploadDate = document.createElement('div');
    uploadDate.setAttribute('swipe', 'true');
    uploadDate.classList.add('center-style');
    const uploadDateAws = document.createElement('div');
    ClipCard.createFontAwesome(uploadDateAws, 'fas', 'fa-calendar-alt');
    const uploadDateValue = document.createElement('div');
    uploadDateValue.classList.add('indent-style');
    uploadDateValue.innerHTML = `${this.clip.uploadDate.substring(0, 10)}`;
    uploadDate.appendChild(uploadDateAws);
    uploadDate.appendChild(uploadDateValue);
    const viewCount = document.createElement('div');
    viewCount.setAttribute('swipe', 'true');
    viewCount.classList.add('center-style');
    const viewCountAws = document.createElement('div');
    ClipCard.createFontAwesome(viewCountAws, 'fas', 'fa-eye');
    const viewCountValue = document.createElement('div');
    viewCountValue.classList.add('indent-style');
    viewCountValue.innerHTML = `${this.clip.viewCount}`;
    viewCount.appendChild(viewCountAws);
    viewCount.appendChild(viewCountValue);
    detalInfo.appendChild(channelName);
    detalInfo.appendChild(uploadDate);
    detalInfo.appendChild(viewCount);
    const description = document.createElement('div');
    description.setAttribute('swipe', 'true');
    description.classList.add('clip-description');
    description.innerHTML = `${this.clip.videoDescription}`;
    information.appendChild(detalInfo);
    information.appendChild(description);
    containerClipCard.appendChild(clipPrewiew);
    containerClipCard.appendChild(information);
    const title = document.createElement('a');
    title.setAttribute('href', `https://www.youtube.com/watch?v=${this.clip.id}`);
    title.innerText = this.clip.title;
    title.classList.add('clip-title');
    containerClipCard.appendChild(title);
    containerClipCard.classList.add('clip-card');
    containerClipCard.style.margin = '10px';
    containerClipCard.style.width = `${width - 10 * 2}px`;
    return containerClipCard;
  }

  static createFontAwesome(elemParent, styleFont, font) {
    const elemFont = document.createElement('i');
    elemFont.classList.add(styleFont);
    elemFont.classList.add(font);
    elemParent.appendChild(elemFont);
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
    this.renderPagination();
  }
}

export default AppView;
