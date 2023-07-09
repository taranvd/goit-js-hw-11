import PixabayAPI from './pixabay-api';
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabayAPIinstance = new PixabayAPI();
let lightbox = null;

const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const loaderEl = document.querySelector('.loader');

const searchInputForm = searchForm.firstElementChild;

searchForm.addEventListener('submit', onSearch);
loadMoreButton.addEventListener('click', onClickLoadMore);

function onSearch(e) {
  e.preventDefault();
  pixabayAPIinstance.query = searchInputForm.value;

  loadMoreButton.classList.add('is-hidden');
  loaderEl.classList.remove('is-hidden');

  pixabayAPIinstance.resetPage();
  clearGallery();

  fetchPhotos().then(data => {
    displayTotalHits(data.totalHits);
  });
}

function onClickLoadMore() {
  loaderEl.classList.remove('is-hidden');
  pixabayAPIinstance.page += 1;
  fetchPhotos();
}

function fetchPhotos() {
  return pixabayAPIinstance.fetchPhotos().then(data => {
    loaderEl.classList.add('is-hidden');
    handleFetchPhotoRespone(data);

    return data;
  });
}

function handleFetchPhotoRespone(data) {
  if (data.hits.length === 0) {
    displayNoResults();
    return;
  }

  if (data.totalHits <= pixabayAPIinstance.page * pixabayAPIinstance.perPage) {
    displayEndOfSearchResults();
    return;
  }

  renderPhoto(data.hits);
  loadMoreButton.classList.remove('is-hidden');

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
  loadMoreButton.classList.add('is-hidden');
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
