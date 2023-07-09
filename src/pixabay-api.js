export default class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/?';
  #API_KEY = '32972843-1350190d1db701aee5ffa1a73';

  query = '';
  page = 1;
  perPage = 40;

  async fetchPhotos() {
    const response = await fetch(
      `${this.#BASE_URL}key=${this.#API_KEY}&q=${
        this.query
      }&image_type=photo&orientation=horizontal&safesearch=true&page=${
        this.page
      }&per_page=${this.perPage}`
    );
    return response.json();
  }

  resetPage() {
    this.page = 1;
  }
}
