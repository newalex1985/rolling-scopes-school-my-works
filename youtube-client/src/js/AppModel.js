class Clip {
  constructor(id, title, clipPreview, videoDescription, author, uploadDate) {
    this.id = id;
    this.title = title;
    this.clipPreview = clipPreview;
    this.videoDescription = videoDescription;
    this.author = author;
    this.uploadDate = uploadDate;
    this.viewCount = '';
  }
}

class AppModel {
  constructor(state) {
    this.state = state;
  }

  static getLinks(data) {
    const links = {
      prevPageToken: '',
      nextPageToken: '',
    };
    if (Object.prototype.hasOwnProperty.call(data, 'prevPageToken')) {
      links.prevPageToken = data.prevPageToken;
    }
    if (Object.prototype.hasOwnProperty.call(data, 'nextPageToken')) {
      links.nextPageToken = data.nextPageToken;
    }
    return links;
  }

  static parseData(data) {
    return data.items.map((elem) => {
      const id = elem.id.videoId;
      const sn = elem.snippet;
      return new Clip(id, sn.title, sn.thumbnails, sn.description, sn.channelTitle, sn.publishedAt);
    });
  }

  static getTemplateParam(param) {
    let templateParam = '';
    Object.entries(param).forEach((elem) => {
      templateParam += `&${elem[0]}=${elem[1]}`;
    });
    return templateParam;
  }

  async getClips(searchString, addParam = '') {
    const clips = {
      links: undefined,
      data: undefined,
    };
    let addParamLink = addParam;
    if (addParamLink !== '') {
      addParamLink = `&pageToken=${addParamLink}`;
    }
    const { url, key } = this.state;
    let { mode } = this.state.modeSearch;
    let templateParam = AppModel.getTemplateParam(this.state.modeSearch.param);
    let templateQuery = `${url}${mode}?key=${key}${templateParam}&q=${searchString}${addParamLink}`;
    // fetch(`${templateQuery}`)
    //   .then(response => response.json())
    //   .then(data => console.log(data));

    let response = await fetch(templateQuery);
    let data = await response.json();

    clips.links = AppModel.getLinks(data);
    clips.data = AppModel.parseData(data);

    const idClips = clips.data.map(elem => elem.id).join(',');

    ({ mode } = this.state.modeStatistics);
    templateParam = AppModel.getTemplateParam(this.state.modeStatistics.param);
    templateQuery = `${url}${mode}?key=${key}&id=${idClips}${templateParam}`;
    response = await fetch(templateQuery);
    data = await response.json();

    clips.data.forEach((clipEl, i) => {
      clips.data[i].viewCount = data.items.find(item => item.id === clipEl.id).statistics.viewCount;
    });

    return clips;
  }
}

export default AppModel;
