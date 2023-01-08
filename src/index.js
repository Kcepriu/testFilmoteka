import './css/styles.css';
import ApiThemoviedb from './js/apiThemoviedb';
import TemplateHTML from './js/templateHTML';
import Pagination from './js/pagination';

const refs = {
  inputNameSearchFilm: document.querySelector('.search-box'),
  formSearchFilm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  backdropModal: document.querySelector('.backdrop'),
  btnCloseModal: document.querySelector('.modal-window__btn-close'),
};

const apiThemoviedb = new ApiThemoviedb();
const templateHTML = new TemplateHTML();

refs.formSearchFilm.addEventListener('submit', submitSearchForm);
refs.gallery.addEventListener('click', onClickElementGallery);

refs.btnCloseModal.addEventListener('click', closeModal);
refs.backdropModal.addEventListener('click', onClickBackdropModal);

goToHome();

// apiThemoviedb.fetchTrending({ time_window: 'week' });

// apiThemoviedb.fetchTrending();

//id: 593643

// apiThemoviedb.fetchFullInformationFromFilm(593643);
// apiThemoviedb.fetchTrailersFromFilm(593643);

async function submitSearchForm(event) {
  event.preventDefault();
  //   const result = await apiThemoviedb.fetchTrending({ time_window: 'week' });
  //   console.log(result);
}

async function goToHome() {
  const { page, total_pages, total_results, results } =
    await apiThemoviedb.fetchTrending({ time_window: 'week' });

  // console.log(results);

  const htmlText = templateHTML.getGallery({
    arrayDataElement: results,
    listGenge: await apiThemoviedb.getListGenge(),
    configImage: await apiThemoviedb.getConfigurationImages(),
  });

  refs.gallery.insertAdjacentHTML('beforeend', htmlText);

  //RenderNavigation
}

function onClickElementGallery(event) {
  event.preventDefault();

  const swatchElement = event.target;
  let parentCard = swatchElement;

  if (swatchElement.nodeName !== 'DIV') {
    parentCard = swatchElement.closest('.photo-card');
  }

  openModal(parentCard.dataset.id_film, parentCard.dataset.media_type);
  //event.currentTarget
}

function openModal(filmId, media_type) {
  //
  renderModalWindow(filmId, media_type);

  //Show window
  refs.backdropModal.classList.remove('is-hidden');

  //add even that close window from ESC
  document.addEventListener('keydown', closeModal);
}

function closeModal() {
  //Clowe Windows
  refs.backdropModal.classList.add('is-hidden');

  //Delete Event that close window from ESC
  document.removeEventListener('keydown', closeModal);
}

function onClickBackdropModal(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

async function renderModalWindow(filmId, media_type) {
  const informationFromFilm = await apiThemoviedb.fetchFullInformationFromFilm(
    filmId,
    media_type
  );

  const informationTrailers = await apiThemoviedb.fetchTrailersFromFilm(
    filmId,
    media_type
  );

  console.log(informationFromFilm);
  console.log('Trailers', informationTrailers);
}
