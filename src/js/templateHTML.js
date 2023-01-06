export default class TemplateHTML {
  getGallery({ arrayDataElement, listGenge, configImage }) {
    console.log(listGenge);

    return arrayDataElement.reduce((textHTML, dataElement) => {
      return (
        textHTML +
        this.getElementGallery({ dataElement, listGenge, configImage })
      );
    }, '');
  }

  getElementGallery({ dataElement, listGenge, configImage }) {
    // adult: false;
    // backdrop_path: '/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg';
    // genre_ids: (3)[(878, 12, 28)];
    // id: 76600;
    // media_type: 'movie';
    // original_language: 'en';
    // original_title: 'Avatar: The Way of Water';
    // overview: 'Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.';
    // popularity: 4718.023;
    // poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg';
    // release_date: '2022-12-14';
    // title: 'Avatar: The Way of Water';
    // video: false;
    // vote_average: 7.7;
    // vote_count: 3578;

    const {
      id,
      backdrop_path,
      genre_ids,
      original_title,
      original_name,
      poster_path,
      release_date,
      title,
    } = dataElement;

    const name_film = original_title || original_name;

    const webformatURL = this.getUrlImage(poster_path, configImage);

    const year = this.getYear(release_date);

    const textGenre = this.getTextGenre(genre_ids, listGenge);

    return `
        <div class="photo-card" data-id_film="${id}">
           <img src="${webformatURL}" alt="${name_film}" loading="lazy" width="375"/>          
          
            <p class="info-item">${name_film}</p>            
            <div class="info">
            <p class="info-item">${textGenre}</p>            
            <p class="info-item">${year}</p>            
          </div>
        </div>
        `;
  }

  getUrlImage(path, configImage) {
    return `${configImage.base_url}${
      configImage.poster_sizes[configImage.poster_sizes.length - 1]
    }${path}`;
  }

  getYear(textData) {
    if (!textData) return '';

    return textData.slice(0, 4);
  }

  getTextGenre(genre_ids, listGenge) {
    const result = genre_ids.reduce((textGenre, elem) => {
      return (textGenre += (textGenre ? ', ' : '') + listGenge[elem]);
    }, '');

    return result;
  }
}
