import '../css/style.css';

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
    // put in separate class
    let position = 0;
    const width = 130;
    const count = 3;

    // may be put this in fuction like makeContainer
    this.showBox.classList.add('show-box');
    const carousel = document.createElement('div');
    carousel.classList.add('carousel');
    const buttonPrev = document.createElement('button');
    buttonPrev.innerHTML = '<-';
    buttonPrev.classList.add('arrow');
    buttonPrev.classList.add('prev');
    const buttonNext = document.createElement('button');
    buttonNext.innerHTML = '->';
    buttonNext.classList.add('arrow');
    buttonNext.classList.add('next');
    const gallery = document.createElement('div');
    gallery.classList.add('gallery');
    const clips = document.createElement('ul');
    gallery.appendChild(clips);
    gallery.appendChild(buttonPrev);
    gallery.appendChild(buttonNext);
    carousel.appendChild(gallery);
    this.showBox.appendChild(carousel);
    this.root.appendChild(this.showBox);

    buttonPrev.onclick = function () {
      position = Math.min(position + width * count, 0);
      gallery.firstChild.style.marginLeft = `${position}px`;
    };

    buttonNext.onclick = function () {
      const numItems = gallery.firstChild.children.length;
      position = Math.max(position - width * count, -width * (numItems - count));
      gallery.firstChild.style.marginLeft = `${position}px`;
    };
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

  // render() {
  //   // document.body - root
  //   const content = document.createElement('ul');
  //   content.innerHTML = this.clips.map(clip => `<li>${clip.title}</li>`).join('');
  //   // must be root
  //   const container = document.body.querySelector('ul');
  //   if (container === null) {
  //     document.body.appendChild(content);
  //   } else {
  //     // document.body.replaceChild(content, this.content);
  //     document.body.replaceChild(content, container);
  //   }

  //   // this.content = content;
  // }
}

export default AppView;
