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
    };
    this.position = 0;
    this.width = 250;
    this.numPerFrame = 4;
    this.carousel = document.createElement('div');
    this.buttonPrev = document.createElement('div');
    this.buttonNext = document.createElement('div');
    this.gallery = document.createElement('div');
    this.clips = document.createElement('ul');
  }

  init(parent) {
    this.carousel.classList.add('carousel');
    this.buttonPrev.classList.add('arrow');
    Carousel.createFontAwesome(this.buttonPrev, 'fas', 'fa-arrow-left');
    this.buttonNext.classList.add('arrow');
    Carousel.createFontAwesome(this.buttonNext, 'fas', 'fa-arrow-right');
    this.gallery.classList.add('gallery');
    this.carousel.appendChild(this.buttonPrev);
    this.carousel.appendChild(this.gallery);
    this.carousel.appendChild(this.buttonNext);
    this.gallery.appendChild(this.clips);
    parent.appendChild(this.carousel);
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

  swipe(eventMousedown) {
    const { target } = eventMousedown;
    if (target.classList.contains('clip-card')) {
      const targetCoords = Carousel.getCoords(target);
      const targetCoordLeft = targetCoords.left;
      const targetCoordRight = targetCoords.left + target.offsetWidth;
      // think about if use addEventListener - > how to remove handler? ( if
      // try use function name handler -> truoble with scope (targetCoordLeft, targetCoordRight),
      // ok, if set listener like Class property function or static function -> same truoble
      // with targetCoordLeft, targetCoordRight), must or transfer targetCoordLeft,
      // targetCoordRight in listener like Class property function or static function (how?)
      // or maybe use closures (how?). Don't want use property of class like this.targetCoordLeft,
      // this.targetCoordRight
      // so, let it be for now...
      document.onmouseup = (eventMouseup) => {
        document.onmouseup = null;
        const currentCoordX = eventMouseup.pageX;
        if (currentCoordX > targetCoordRight) {
          this.moveRight(1);
        } else if (currentCoordX < targetCoordLeft) {
          this.moveLeft(1);
        }
      };
    }
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

  render(clips, renderMode) {
    console.log(clips);
    this.showBox.style.display = 'flex';
    const clipsContainer = this.carouselViewer.clips;
    //  put in function
    if (renderMode !== 'continuation') {
      while (clipsContainer.firstChild) {
        clipsContainer.firstChild.remove();
      }
      // put in function clear
      this.carouselViewer.carouselState.left = 1;
      this.carouselViewer.carouselState.right = 4;
      this.carouselViewer.carouselState.dir = '';
      this.carouselViewer.carouselState.total = 0;

      // marginleft clear
      this.carouselViewer.position = 0;
      this.carouselViewer.move(this.carouselViewer.position);
    }

    clips.forEach((clip) => {
      const clipCard = new ClipCard(clip).createClipCard();
      const list = document.createElement('li');
      list.appendChild(clipCard);
      clipsContainer.appendChild(list);
    });
    this.carouselViewer.carouselState.total += clips.length;
  }
}

export default AppView;
