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

  async fetchTrending({ media_type = 'all', time_window = 'day' } = {}) {
    const result = await this.API.get(`/trending/${media_type}/${time_window}`);
    return result?.data;
  }

  async fetchFullInformationFromFilm(movie_id) {
    const result = await this.API.get(`/movie/${movie_id}`);

    console.log(result?.data);

    return result?.data;
  }

  async fetchTrailersFromFilm(movie_id) {
    const result = await this.API.get(`/movie/${movie_id}/videos`);
    //https://youtu.be/-3qs-SxF8uw

    console.log(result?.data);

    return result?.data;
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

    const arrayGenreMove = await this.fetchArrayGenreMove();
    const arrayGenreTv = await this.fetchArrayGenreTv();

    this.listGenge = await this.convertArrayGenreToObject([
      ...arrayGenreMove,
      ...arrayGenreTv,
    ]);

    return this.listGenge;
  }

  async fetchArrayGenreMove() {
    const result = await this.API.get('/genre/movie/list');
    return result?.data?.genres;
  }

  async fetchArrayGenreTv() {
    const result = await this.API.get('/genre/tv/list');
    return result?.data?.genres;
  }

  async convertArrayGenreToObject(arrayGenre) {
    const result = {};
    arrayGenre.map(elem => (result[elem.id] = elem.name));
    return result;
  }
}
