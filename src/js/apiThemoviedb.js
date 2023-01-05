import axios from 'axios';

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

  async configurationImages() {
    this.configImages = await this.fetchConfiguration();
  }

  async fetchConfiguration() {
    const result = await this.API.get('/configuration');
    return result?.data?.images;
  }
}
