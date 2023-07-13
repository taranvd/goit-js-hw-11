import Notiflix from 'notiflix';

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

export { displayTotalHits, displayNoResults, displayEndOfSearchResults };
