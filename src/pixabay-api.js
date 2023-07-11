import axios from 'axios';

export default class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/?';
  #API_KEY = '32972843-1350190d1db701aee5ffa1a73';

  query = '';
  page = 1;
  perPage = 40;

  async fetchPhotos() {
    try {
      const config = {
        params: {
          key: this.#API_KEY,
          q: this.query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: this.page,
          per_page: this.perPage,
        },
      };

      const response = await axios.get(this.#BASE_URL, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  }

  resetPage() {
    this.page = 1;
  }
}
