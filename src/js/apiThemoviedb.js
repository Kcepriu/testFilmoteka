import axios from 'axios';

// https://api.themoviedb.org/3/movie/550?api_key=6a47f8c83e830bed78d4a1e11118c2d0
export default class ApiThemoviedb {
  #KEY = '6a47f8c83e830bed78d4a1e11118c2d0';
  #URL = 'https://api.themoviedb.org/3/';

  constructor() {
    this.API = axios.create({
      baseURL: this.#URL,
      header: {},
      params: {
        api_key: this.#KEY,
      },
    });

    this.configImages = null;
    this.listGenge = null;
  }

  async searchFilm(nameFilm) {
    const result = await this.API.get(`search/movie`, {
      params: {
        query: nameFilm,
      },
    });

    return result?.data;
  }
  // search/movie?api_key=6a47f8c83e830bed78d4a1e11118c2d0&query=greyhound

  async fetchTrending({ media_type = 'all', time_window = 'day' } = {}) {
    const result = await this.API.get(`/trending/${media_type}/${time_window}`);
    return result?.data;
  }

  async fetchFullInformationFromFilm(movie_id, media_type) {
    const result = await this.API.get(`/${media_type}/${movie_id}`);

    return result?.data;
  }

  async fetchTrailersFromFilm(movie_id, media_type) {
    const result = await this.API.get(`/${media_type}/${movie_id}/videos`);
    //https://youtu.be/-3qs-SxF8uw

    return result?.data?.results;
  }

  // * Work from configuration Images
  async getConfigurationImages() {
    if (this.configImages) return this.configImages;

    this.configImages = await this.fetchConfiguration();

    return this.configImages;
  }

  async fetchConfiguration() {
    const result = await this.API.get('/configuration');
    return result?.data?.images;
  }

  // * Work from Genge
  async getListGenge() {
    if (this.listGenge) return this.listGenge;

    const arrayGenreMove = await this.fetchArrayGenre('movie');
    const arrayGenreTv = await this.fetchArrayGenre('tv');

    this.listGenge = await this.convertArrayGenreToObject([
      ...arrayGenreMove,
      ...arrayGenreTv,
    ]);

    return this.listGenge;
    //movie
  }

  async fetchArrayGenre(media_type) {
    const result = await this.API.get(`/genre/${media_type}/list`);
    return result?.data?.genres;
  }

  async convertArrayGenreToObject(arrayGenre) {
    const result = {};
    arrayGenre.map(elem => (result[elem.id] = elem.name));
    return result;
  }
}
