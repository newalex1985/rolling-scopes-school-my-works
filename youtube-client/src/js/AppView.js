class AppView {
  constructor(clips) {
    this.clips = clips;
    // this.content = '';
  }

  // // must be in init View
  // init() {
  //   document.body.appendChild(this.content);
  // }

  render() {
    // document.body - root
    const content = document.createElement('ul');
    content.innerHTML = this.clips.map(clip => `<li>${clip.title}</li>`).join('');
    // must be root
    const container = document.body.querySelector('ul');
    if (container === null) {
      document.body.appendChild(content);
    } else {
      // document.body.replaceChild(content, this.content);
      document.body.replaceChild(content, container);
    }

    // this.content = content;
  }
}

export default AppView;
