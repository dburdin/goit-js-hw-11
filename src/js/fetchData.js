import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';

const searchParams = new URLSearchParams({
  key: '33817014-37e84f29bfd059e4d23607e0d',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
});

async function fetchData(inputValue, page) {
  return axios.get(`${BASE_URL}/?${searchParams}&q=${inputValue}&page=${page}`);
}

export { fetchData };
