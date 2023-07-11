import axios from 'axios';
import PixabayAPI from './pixabay-api';
import Notiflix from 'notiflix';
import throttle from 'lodash.throttle';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const upButton = document.querySelector('.up');
const loaderEl = document.querySelector('.loader');
const searchInputForm = searchForm.firstElementChild;

const pixabayAPIinstance = new PixabayAPI();
let lightbox = null;

searchForm.addEventListener('submit', throttle(onSearch, 1000));
window.addEventListener('scroll', throttle(onScrollPage, 2000));

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

  console.log(data);
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

function displayTotalHits(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function displayNoResults() {
  return Notiflix.Notify.failure(
    '"Sorry, there are no images matching your search query. Please try again."'
  );
}

function displayEndOfSearchResults() {
  // loadMoreButton.classList.add('is-hidden');
  Notiflix.Notify.warning(
    "We're sorry, but you've reached the end of search results."
  );
}

function renderPhoto(photos) {
  photos.forEach(photo => {
    const markup = createMarkup(photo);
    galleryList.insertAdjacentHTML('beforeend', markup);
  });
}

function clearGallery() {
  galleryList.innerHTML = '';
}

function createMarkup(data) {
  return `<div class="photo-card">
      <a href="${data.largeImageURL}">
        <img
          src="${data.webformatURL}"
          alt="${data.tags}"
          loading="lazy"
          width="350"
        />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <span>${data.likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b>
          <span>${data.views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span>${data.comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <span>${data.downloads}</span>
        </p>
      </div>
    </div>`;
}

function onScrollPage(e) {
  const { bottom } = document.documentElement.getBoundingClientRect();
  const clientHeight = document.documentElement.clientHeight;

  if (bottom <= clientHeight + 150) {
    handleLoadMore();
    return;
  }
}
