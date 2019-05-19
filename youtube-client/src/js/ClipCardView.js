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

export default ClipCard;
