export default class TemplateHTML {
  getGallery({ results: arrayDataElement, listGenge, configImage }) {
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
      genres,
      original_title,
      original_name,
      poster_path,
      release_date,
      title,
      media_type,
    } = dataElement;

    //Name maybe in different places
    const name_film = original_title || original_name;

    const webformatURL = this.getUrlImage(poster_path, configImage);

    const year = this.getYear(release_date);

    const textGenre = this.getTextGenre(genres, genre_ids, listGenge);

    const new_media_type = media_type || 'movie';

    const imgText =
      poster_path !== null
        ? `<img src="${webformatURL}" alt="${name_film}" loading="lazy" width="375"/>`
        : '';

    return `
        <div class="photo-card" data-id_film="${id}" data-media_type="${new_media_type}">
           ${imgText}          
          
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

  getTextGenre(genres, genre_ids, listGenge) {
    if (genres) {
      const result = genres.reduce((textGenre, elem) => {
        return (textGenre += (textGenre ? ', ' : '') + elem.name);
      }, '');
      return result;
    } else {
      const result = genre_ids.reduce((textGenre, elem) => {
        return (textGenre += (textGenre ? ', ' : '') + listGenge[elem]);
      }, '');
      return result;
    }
  }

  //MODAL

  getTextSectionTrailers(informationTrailers) {
    let result = '';

    return result;

    for (
      let index = 0;
      index < Math.min(3, informationTrailers.length);
      index++
    ) {
      const { key, name } = informationTrailers[index];

      result += `
              <iframe
                width="120"
                src="https://www.youtube.com/embed/${key}"
                title="${name}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              >
              </iframe>
              `;
    }
    return result;
  }

  getModalWindow({
    informationFromFilm,
    informationTrailers,
    listGenge,
    configImage,
  }) {
    const {
      poster_path,
      vote_average,
      vote_count,
      title,
      popularity,
      original_title,
      genres,
      overview,
      id,
    } = informationFromFilm;

    const name_film = title || original_title;

    const webformatURL = this.getUrlImage(poster_path, configImage);
    const textGenre = this.getTextGenre(genres, genres, listGenge);

    return `
          <div class="wrap__image-video">
            <div class="modal__image-container">
              <img
                class="modal__image"
                src="${webformatURL}"
                alt="${name_film}"
                loading="lazy"
                width="375"
              /> 
            </div>

            <div class="wrap__trailler">
              ${this.getTextSectionTrailers(informationTrailers)}
              
            </div>
          </div>

          <div class="modal__wrap-information-film">
            <h2>${name_film}</h2>
            <p><span>Vote / Votes</span> ${vote_average} / ${vote_count}</p>
            <p><span>Popularity</span>${popularity}</p>
            <p><span>Original Title</span>${original_title}</p>
            <p><span>Genre</span>${textGenre}</p>
            <p>About</p>
            <p>
              ${overview}
            </p>

            <div class="wrap__model-button">
              <button type="button" data-id_film="${id}" data-state="Watched">add to Watched</button>
              <button type="button" data-id_film="${id}" data-state="Queue">add to queue</button>
            </div>
          </div>
        `;
  }
}
