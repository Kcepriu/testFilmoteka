import './css/styles.css';
import ApiThemoviedb from './js/apiThemoviedb';
import TemplateHTML from './js/templateHTML';

const refs = {
  inputNameSearchFilm: document.querySelector('.search-box'),
  formSearchFilm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const apiThemoviedb = new ApiThemoviedb();
const templateHTML = new TemplateHTML();

refs.formSearchFilm.addEventListener('submit', submitSearchForm);
refs.gallery.addEventListener('click', onClickElementGallery);

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

  const htmlText = templateHTML.getGallery({
    arrayDataElement: results,
    listGenge: await apiThemoviedb.getListGenge(),
    configImage: await apiThemoviedb.getConfigurationImages(),
  });

  refs.gallery.insertAdjacentHTML('beforeend', htmlText);

  console.log(results);

  //RenderNavigation
}

function onClickElementGallery(event) {
  event.preventDefault();

  const swatchElement = event.target;
  let parentCard = swatchElement;

  if (swatchElement.nodeName !== 'DIV') {
    parentCard = swatchElement.closest('.photo-card');
  }
  console.log(parentCard);
  console.log(parentCard.dataset.id_film);

  //event.currentTarget
}
