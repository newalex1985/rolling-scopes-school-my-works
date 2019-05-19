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

export default Carousel;
