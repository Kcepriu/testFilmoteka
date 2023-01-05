import './css/styles.css';
import ApiThemoviedb from './js/apiThemoviedb';

// https://api.themoviedb.org/3/movie/550?api_key=6a47f8c83e830bed78d4a1e11118c2d0

const apiThemoviedb = new ApiThemoviedb();

// apiThemoviedb.fetchTrending({ time_window: 'week' });

// apiThemoviedb.fetchTrending();

//id: 593643

// apiThemoviedb.fetchFullInformationFromFilm(593643);
apiThemoviedb.fetchTrailersFromFilm(593643);
