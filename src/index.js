import './css/styles.css';
import ApiThemoviedb from './js/apiThemoviedb';
import TemplateHTML from './js/templateHTML';
import WorkWithStorage from './js/workWithStorage';

import { getFirebaseConfig } from './js/firebase-config.js';
import { getPerformance } from 'firebase/performance';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const COUNT_ELEMENT_FROM_PAGE = 20;

const refs = {
  inputNameSearchFilm: document.querySelector('.search-box'),
  formSearchFilm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  backdropModal: document.querySelector('.backdrop'),
  btnCloseModal: document.querySelector('.modal-window__btn-close'),
  contentModalWindow: document.querySelector('.modal__wrap-content'),
  btnWatched: document.querySelector('.watched'),
  btnQueue: document.querySelector('.queue'),

  userPicElement: document.getElementById('user-pic'),
  userNameElement: document.getElementById('user-name'),
  signInButtonElement: document.getElementById('sign-in'),
  signOutButtonElement: document.getElementById('sign-out'),
};

const apiThemoviedb = new ApiThemoviedb();
const templateHTML = new TemplateHTML();
const workWithStorage = new WorkWithStorage(COUNT_ELEMENT_FROM_PAGE);
let curentFilm = {};

refs.formSearchFilm.addEventListener('submit', submitSearchForm);
refs.gallery.addEventListener('click', onClickElementGallery);

refs.btnCloseModal.addEventListener('click', closeModal);
refs.backdropModal.addEventListener('click', onClickBackdropModal);
refs.contentModalWindow.addEventListener('click', onClickBtnFromModal);

refs.btnWatched.addEventListener('click', goToWatched);
refs.btnQueue.addEventListener('click', goToQueue);

//! ---------------------------------------
//! ---------------------------------------
//! ---------------------------------------
// Signs-in Friendly Chat.
async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  console.log('signIn');

  const provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

// Signs-out of Friendly Chat.
function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
}

// Initialize firebase auth
function initFirebaseAuth() {
  // Listen to auth state changes.
  onAuthStateChanged(getAuth(), authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return getAuth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  return getAuth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!getAuth().currentUser;
}

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

function authStateObserver(user) {
  if (user) {
    // User is signed in!
    // Get the signed-in user's profile pic and name.
    const profilePicUrl = getProfilePicUrl();
    const userName = getUserName();

    // Set the user's profile pic and name.
    refs.userPicElement.style.backgroundImage =
      'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    refs.userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    refs.userNameElement.removeAttribute('hidden');
    refs.userPicElement.removeAttribute('hidden');
    refs.signOutButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    refs.signInButtonElement.setAttribute('hidden', 'true');

    // We save the Firebase Messaging Device token and enable notifications.
    //TODO
    // saveMessagingDeviceToken();
  } else {
    // User is signed out!
    // Hide user's profile and sign-out button.
    refs.userNameElement.setAttribute('hidden', 'true');
    refs.userPicElement.setAttribute('hidden', 'true');
    refs.signOutButtonElement.setAttribute('hidden', 'true');

    // Show sign-in button.
    refs.signInButtonElement.removeAttribute('hidden');
  }
}

refs.signOutButtonElement.addEventListener('click', signOutUser);
refs.signInButtonElement.addEventListener('click', signIn);

const firebaseApp = initializeApp(getFirebaseConfig());
getPerformance();
initFirebaseAuth();

//! ---------------------------------------
//! ---------------------------------------
//! ---------------------------------------
goToHome();

// Fetch data
async function goToHome() {
  // const { page, total_pages, total_results, results } =

  const responseToRequest = await apiThemoviedb.fetchTrending({
    time_window: 'week',
  });

  await inputGallaryToWindow(responseToRequest);
}

async function goToWatched(event) {
  event.preventDefault();
  const responseToRequest = workWithStorage.getDataPageWatched();

  await inputGallaryToWindow(responseToRequest);
}

async function goToQueue(event) {
  event.preventDefault();
  const responseToRequest = workWithStorage.getDataPageQueue();

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
  if (event.target === event.currentTarget) return;

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
    workWithStorage.addToQueue(curentFilm);
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
