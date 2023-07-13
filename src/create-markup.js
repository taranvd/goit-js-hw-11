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

export { createMarkup };
