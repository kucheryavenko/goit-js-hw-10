// Импортируем библиотекы и доп. файлы
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import getRefs from './js/getRefs';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = getRefs();

// Вешаем слушателя на инпут и запускаем ф-цию поиска страны
refs.inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

// Ф-ция ищет страну по значению инпута
function onSearch() {
    const searchName = refs.inputEl.value;

    if (!searchName) {
        refs.countryCardEl.innerHTML = '';
        refs.countryListEl.innerHTML = '';
        return;
    }

    fetchCountries(searchName.trim())
        .then(renderCountriesMarkup)
        .catch(onFechError);
}

// Ф-ция рендерит разметку в зависимости от условия
function renderCountriesMarkup(country) {
    const cardMarkup = country.map(({ name, capital, population, flags, languages }) => {
        return `<ul class="card-list list">
                <li class="card-item accent"><img class="card-img" src="${flags.svg}" alt="flag" width="40">${name.official}</li>
                <li class="card-item">Capital:&nbsp<span class="card-style">${capital}</span></li>
                <li class="card-item">Population:&nbsp<span class="card-style">${population}</span></li>
                <li class="card-item">Languages:&nbsp<span class="card-style">${Object.values(languages).join(', ')}</span></li>
            </ul>`
        }).join('');

    const listMarkup = country.map(({ name, flags }) => {
        return `<li class="country-item"><img class="country-img" src="${flags.svg}" alt="flag" width="30">${name.official}</li>`
        }).join('');

    if (country.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (country.length >= 2 && country.length < 10) {
        refs.countryListEl.innerHTML = listMarkup;
        refs.countryCardEl.innerHTML = '';
    } else if (country.length === 1) {
        refs.countryListEl.innerHTML = '';
        refs.countryCardEl.innerHTML = cardMarkup;
    }   
}

// Ф-ция отвечает за ошибку поиска
function onFechError() {
    Notify.failure('Oops, there is no country with that name');
    refs.countryCardEl.innerHTML = '';
    refs.countryListEl.innerHTML = '';
}
