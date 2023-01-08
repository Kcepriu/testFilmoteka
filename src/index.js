import './css/styles.css';
import ApiThemoviedb from './js/apiThemoviedb';
import TemplateHTML from './js/templateHTML';
import WorkWithStorage from './js/workWithStorage';

import Pagination from './js/pagination';
const COUNT_ELEMENT_FROM_PAGE = 20;

const refs = {
  inputNameSearchFilm: document.querySelector('.search-box'),
  formSearchFilm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  backdropModal: document.querySelector('.backdrop'),
  btnCloseModal: document.querySelector('.modal-window__btn-close'),
  contentModalWindow: document.querySelector('.modal__wrap-content'),
};

const apiThemoviedb = new ApiThemoviedb();
const templateHTML = new TemplateHTML();
const workWithStorage = new WorkWithStorage(COUNT_ELEMENT_FROM_PAGE);
const curentFilm = {};

refs.formSearchFilm.addEventListener('submit', submitSearchForm);
refs.gallery.addEventListener('click', onClickElementGallery);

refs.btnCloseModal.addEventListener('click', closeModal);
refs.backdropModal.addEventListener('click', onClickBackdropModal);
refs.contentModalWindow.addEventListener('click', onClickBtnFromModal);

goToHome();

// Fetch data
async function goToHome() {
  // const { page, total_pages, total_results, results } =

  const responseToRequest = await apiThemoviedb.fetchTrending({
    time_window: 'week',
  });

  await inputGallaryToWindow(responseToRequest);
}

//greyhound
async function submitSearchForm(event) {
  event.preventDefault();

  if (!refs.inputNameSearchFilm.value) {
    goToHome();
    return;
  }

  const responseToRequest = await apiThemoviedb.searchFilm(
    refs.inputNameSearchFilm.value
  );

  await inputGallaryToWindow(responseToRequest);
}

async function inputGallaryToWindow(responseToRequest) {
  //add system fields
  responseToRequest.listGenge = await apiThemoviedb.getListGenge();
  responseToRequest.configImage = await apiThemoviedb.getConfigurationImages();

  refs.gallery.innerHTML = templateHTML.getGallery(responseToRequest);

  await renderPAgination(responseToRequest);
}

async function renderPAgination(responseToRequest) {
  // const { page, total_pages, total_results} =
}

// * Evens
function onClickElementGallery(event) {
  event.preventDefault();

  const swatchElement = event.target;
  let parentCard = swatchElement;

  if (swatchElement.nodeName !== 'DIV') {
    parentCard = swatchElement.closest('.photo-card');
  }

  openModal(parentCard.dataset.id_film, parentCard.dataset.media_type);
}

function openModal(filmId, media_type) {
  renderModalWindow(filmId, media_type);

  //Show window
  refs.backdropModal.classList.remove('is-hidden');

  //add even that close window from ESC
  document.addEventListener('keydown', closeModal);
}

function onClickBtnFromModal(event) {
  if (event.target.nodeName !== 'BUTTON') {
    return;
  }

  if (event.target.dataset.state === 'Watched') {
    workWithStorage.addToWatch(curentFilm);
  } else if (event.target.dataset.state === 'Queue') {
    addToQueue.addToWatch(curentFilm);
  }
}

function closeModal() {
  //Clowe Windows
  refs.backdropModal.classList.add('is-hidden');

  curentFilm = {};

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
  curentFilm = informationFromFilm;

  const informationTrailers = await apiThemoviedb.fetchTrailersFromFilm(
    filmId,
    media_type
  );

  const textHTML = templateHTML.getModalWindow({
    informationFromFilm,
    informationTrailers,
    listGenge: await apiThemoviedb.getListGenge(),
    configImage: await apiThemoviedb.getConfigurationImages(),
  });

  refs.contentModalWindow.innerHTML = textHTML;
}
