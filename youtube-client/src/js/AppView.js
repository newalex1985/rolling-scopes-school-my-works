import '../css/style.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';

class Carousel {
  constructor() {
    this.position = 0;
    this.width = 250;
    this.count = 4;
    this.carousel = document.createElement('div');
    // this.buttonPrev = document.createElement('button');
    // this.buttonNext = document.createElement('button');
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

    this.buttonPrev.addEventListener('click', () => {
      this.position = Math.min(this.position + this.width * this.count, 0);
      this.gallery.firstChild.style.marginLeft = `${this.position}px`;
    });
    this.buttonNext.addEventListener('click', () => {
      // split: numItems, width, count -> cause: Eslint max lenght line requirement
      const numItems = this.gallery.firstChild.children.length;
      const { width, count } = this;
      this.position = Math.max(this.position - width * count, -width * (numItems - count));
      this.gallery.firstChild.style.marginLeft = `${this.position}px`;
    });
  }

  static createFontAwesome(elemParent, styleFont, font) {
    const elemFont = document.createElement('i');
    elemFont.classList.add(styleFont);
    elemFont.classList.add(font);
    elemParent.appendChild(elemFont);
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
    this.searchInput = document.createElement('input');
    this.searchButton = document.createElement('button');
    this.showBox = document.createElement('div');
  }

  addSearchInterface() {
    this.searchButton.innerHTML = 'Search';
    this.root.appendChild(this.searchInput);
    this.root.appendChild(this.searchButton);
  }

  addShowInterface() {
    this.showBox.classList.add('show-box');
    const carousel = new Carousel();
    carousel.init(this.showBox);
    this.root.appendChild(this.showBox);
  }

  render(clips) {
    console.log(clips);
    const contentNew = document.createElement('ul');
    const contentCurrent = this.showBox.querySelector('ul');
    clips.forEach((clip) => {
      // put in function
      const clipCard = new ClipCard(clip).createClipCard();
      const list = document.createElement('li');
      list.appendChild(clipCard);
      contentNew.appendChild(list);
    });
    contentCurrent.parentElement.replaceChild(contentNew, contentCurrent);
  }
}

export default AppView;
