import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';

class Frame {
  constructor(frameContent) {
    this.frame = document.createElement('div');
    this.buttonNum = document.createElement('div');
    this.buttonDelete = document.createElement('div');
    this.buttonCopy = document.createElement('div');
    this.frameContent = frameContent;
  }

  add(parent, frameNum) {
    this.frame.classList.add('frame');
    this.frame.setAttribute('data-purpose', 'show');

    this.buttonNum.classList.add('button-frame');
    this.buttonNum.style.top = 0;
    this.buttonNum.style.left = 0;
    this.buttonNum.innerText = frameNum;
    this.frame.appendChild(this.buttonNum);

    this.buttonDelete.classList.add('button-frame');
    this.buttonDelete.style.top = 0;
    this.buttonDelete.style.right = 0;
    Frame.createFontAwesome(this.buttonDelete, 'fas', 'fa-archive');
    this.buttonDelete.firstChild.setAttribute('data-purpose', 'delete');
    this.frame.appendChild(this.buttonDelete);

    this.buttonCopy.classList.add('button-frame');
    this.buttonCopy.style.bottom = 0;
    this.buttonCopy.style.right = 0;
    Frame.createFontAwesome(this.buttonCopy, 'fas', 'fa-copy');
    this.buttonCopy.firstChild.setAttribute('data-purpose', 'copy');
    this.frame.appendChild(this.buttonCopy);

    const sceleton = document.createElement('div');
    sceleton.classList.add('sceleton');
    parent.appendChild(sceleton);
    sceleton.appendChild(this.frame);

    // parent.appendChild(this.frame);
  }

  fillContent(frameContent) {
    const style = getComputedStyle(this.frame);
    const { width, height } = style;
    const img = document.createElement('img');
    img.style.width = width;
    img.style.height = height;
    img.src = frameContent;
    this.frame.appendChild(img);
  }

  // class?
  static createFontAwesome(elemParent, styleFont, font) {
    const elemFont = document.createElement('i');
    elemFont.classList.add(styleFont);
    elemFont.classList.add(font);
    elemParent.appendChild(elemFont);
  }
}

export default Frame;
