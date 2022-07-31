const BASE_URL = 'https://restcountries.com/v3.1';
const FILTER_URL = 'fields=name,capital,population,flags,languages';

export function fetchCountries(countryName) {
    if (countryName) {
        return fetch(`${BASE_URL}/name/${countryName}?${FILTER_URL}`).then(response => {
            if (response.ok) return response.json();
            throw new Error('Error fetching data');
        }).catch(error => {
            console.error('Error: ', error);
        });
    }
}
