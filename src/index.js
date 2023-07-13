import axios from 'axios';
import { pixabayAPIinstance } from './pixabay-api';
import debounce from 'lodash.debounce';
import SimpleLightbox from 'simplelightbox';
import { createMarkup } from './create-markup';
import {
  displayEndOfSearchResults,
  displayNoResults,
  displayTotalHits,
} from './notify-alert';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const upButton = document.querySelector('.up');
const loaderEl = document.querySelector('.loader');
const searchInputForm = searchForm.firstElementChild;

let lightbox = null;

searchForm.addEventListener('submit', onSearch);
document.addEventListener('scroll', debounce(onScrollPage, 1000));

async function onSearch(e) {
  e.preventDefault();

  pixabayAPIinstance.query = searchInputForm.value.trim();

  if (pixabayAPIinstance.query === '') {
    displayNoResults();
    return;
  }

  loaderEl.classList.remove('is-hidden');

  pixabayAPIinstance.resetPage();
  clearGallery();

  const data = await fetchPhotos();

  if (data.totalHits) {
    displayTotalHits(data.totalHits);
    return;
  }
}

function handleLoadMore() {
  loaderEl.classList.remove('is-hidden');
  pixabayAPIinstance.page += 1;

  fetchPhotos();
}

async function fetchPhotos() {
  const data = await pixabayAPIinstance.fetchPhotos();
  loaderEl.classList.add('is-hidden');
  handleFetchPhotoRespone(data);

  return data;
}

function handleFetchPhotoRespone(data) {
  if (data.hits.length === 0) {
    displayNoResults();
    return;
  }

  if (
    data.totalHits <= pixabayAPIinstance.page * pixabayAPIinstance.perPage &&
    pixabayAPIinstance.page > 1
  ) {
    displayEndOfSearchResults();
    return;
  }

  upButton.classList.remove('is-hidden');
  renderPhoto(data.hits);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      onComplete: () => {
        lightbox.refresh();
      },
    });
  } else {
    lightbox.refresh();
  }
}

function renderPhoto(photos) {
  const markup = photos.map(photos => createMarkup(photos)).join('');

  galleryList.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  galleryList.innerHTML = '';
}

function onScrollPage(e) {
  const { bottom } = document.documentElement.getBoundingClientRect();
  const clientHeight = document.documentElement.clientHeight;

  if (bottom <= clientHeight + 400) {
    handleLoadMore();
    return;
  }
}
