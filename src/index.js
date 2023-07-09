import PixabayAPI from './pixabay-api';

const pixabayAPIinstance = new PixabayAPI();

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
  fetchPhotos();
}

function onClickLoadMore() {
  loaderEl.classList.remove('is-hidden');
  pixabayAPIinstance.page += 1;
  fetchPhotos();
}

function fetchPhotos() {
  pixabayAPIinstance.fetchPhotos().then(data => {
    loaderEl.classList.add('is-hidden');

    handleFetchPhotoRespone(data);
  });
}

function handleFetchPhotoRespone(data) {
  if (data.totalHits <= pixabayAPIinstance.page * pixabayAPIinstance.perPage) {
    displayEndOfSearchResults();
    return;
  } else if (data.hits.length === 0) {
    galleryList.innerHTML = 'No results';
    return;
  }

  renderPhoto(data.hits);
  loadMoreButton.classList.remove('is-hidden');
}

function displayEndOfSearchResults() {
  loadMoreButton.classList.add('is-hidden');
  galleryList.innerHTML =
    "We're sorry, but you've reached the end of search results.";
}

function renderPhoto(photos) {
  photos.forEach(photo => {
    galleryList.insertAdjacentHTML('beforeend', createMarkup(photo));
  });
}

function clearGallery() {
  galleryList.innerHTML = '';
}

function createMarkup(data) {
  return `<div class="photo-card">
      <img
        src="${data.webformatURL}"
        alt="${data.tags}"
        loading="lazy"
        width="350"
      />
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
    </div>
  `;
}
