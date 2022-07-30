import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputEl: document.querySelector('#search-box'),
    countryListEl: document.querySelector('.country-list'),
    countryCardEl: document.querySelector('.country-info'),
}

refs.inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
    const searchName = refs.inputEl.value;

    if (!searchName) {
        refs.countryCardEl.innerHTML = '';
        refs.countryListEl.innerHTML = '';
        return;
    }

    fetchCountries(searchName.trim())
        .then(renderCountriesMarkup)
        .catch(error => {
            Notify.failure('Oops, there is no country with that name');
            refs.countryCardEl.innerHTML = '';
            refs.countryListEl.innerHTML = '';
        });
}

function renderCountriesMarkup(country) {
    const cardMarkup = country.map(({ name, capital, population, flags, languages }) => {
        return `<ul class="card">
                <li class="card-item"><img class="card-img" src="${flags.svg}" alt="flag" width="20">${name.official}</li>
                <li class="card-item">Capital: ${capital}</li>
                <li class="card-item">Population: ${population}</li>
                <li class="card-item">Languages: ${Object.values(languages).join(', ')}</li>
            </ul>`
        }).join('');

    const listMarkup = country.map(({ name, flags }) => {
        return `<li class="country-item"><img class="country-img" src="${flags.svg}" alt="flag" width="20">${name.official}</li>`
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

console.log('Test commit and push');
