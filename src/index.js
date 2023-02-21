import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchData } from './js/fetchData';
import { createMarkup } from './js/createMarkup';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';

const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-button');
const form = document.getElementById('search-form');

const lightBox = new SimpleLightbox('.photo-card a', {
  captionPosition: 'bottom',
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let inputValue = '';

form.addEventListener('submit', OnSubmitButton);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onLoadMoreBtnClick() {
  nextPage();
  try {
    const response = await fetchData(inputValue, currentPage);
    const hits = response.data.hits;

    renderMoreMarkup(hits);
    lightBox.refresh();
    if (hits.length === 0) {
      hideLoadMoreBtn();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch {
    throw new Error('Error');
  }
}

async function OnSubmitButton(evt) {
  evt.preventDefault();

  inputValue = evt.currentTarget.searchQuery.value.trim();

  if (inputValue === '') {
    return;
  }

  try {
    updatePage();
    const response = await fetchData(inputValue, currentPage);
    const hits = response.data.hits;
    const totalHits = response.data.totalHits;
    if (totalHits > 0) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (totalHits === 0) {
      clearMarkup();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      renderNewMarkup(hits);
      lightBox.refresh();
      showLoadMoreBtn();
    }
  } catch {
    throw new Error('Error');
  }

  form.reset();
}

function renderNewMarkup(data) {
  gallery.innerHTML = createMarkup(data);
}
function renderMoreMarkup(data) {
  gallery.insertAdjacentHTML('beforeend', createMarkup(data));
}

function nextPage() {
  currentPage += 1;
}
function updatePage() {
  currentPage = 1;
}
function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('is-hidden');
}
function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('is-hidden');
}
function clearMarkup() {
  gallery.innerHTML = '';
}
