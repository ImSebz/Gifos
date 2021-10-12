import api from './services.js';
import gif from './gif.js';

const containerSearch = document.getElementById('search-input');
const searchInput = document.getElementById('search');
const searchList = document.getElementById('list-search');
const searchTrendings = document.getElementById('search-trending span');
const btnSeeMore = document.getElementById('btn-rounded');
const searchIconLeft = document.getElementById('icon-search-left');
const searchIconRight = document.getElementById('icon-search-right');
const sectionInfoSearch = document.getElementById('info-search');
const sectionDataSearch = document.getElementById('gifs-section');
const containerGifsSearch = document.getElementById('gifs-results');
const titleSearch = document.getElementById('title-search');
let totalGifs = 0;
let dataGifs = [];


const handleDataAutocomplete = () => {
	const search = searchInput.value;
	toggleIconsSearch();

	api.getApiAutocomplete(search)
		.then((res) => {
			const { data } = res;
			searchList.innerHTML = ''; 
			let lista = '';

			if (data.length) {
				data.forEach((item) => {
					lista += `<li class="item-list-autocomplete" id="value-${item.name}"><i class="icon-search"></i>${item.name}</li>`;
				});
				searchList.innerHTML = lista;
				addEventAutocomplete();
				containerSearch.classList.add('active');
			} else {
				containerSearch.classList.remove('active');
			}
		})
		.catch((err) => {
			console.warn('Error al hacer la petición handleDataAutocomplete en la API: ', err);
		});
};

const handleDataSearch = (seeMore = false) => {
	if (!seeMore) {
		totalGifs = 0;
		dataGifs = [];
	}
	const search = searchInput.value;
	const offset = totalGifs || 0;
	titleSearch.innerText = search.toUpperCase();

	api.getApiSearch(search, 12, offset)
		.then((res) => {
			const { data, pagination } = res;
			if (!seeMore) containerGifsSearch.innerHTML = '';

			if (data.length) {
				
				totalGifs += data.length;
				const gifsFav = api.getAllFavoritesLocal();
				let templateGifs = '';

				data.forEach((item) => {
					dataGifs.push(item);
					const iconFav = gifsFav.some((fav) => fav.id === item.id) ? 'heart' : 'heart-outline';
					templateGifs += gif.maskGifs(item, iconFav);
				});
				containerGifsSearch.insertAdjacentHTML('beforeend', templateGifs);
				gif.addEventMobile(
					dataGifs,
					dataGifs.map((i) => i.id),
				);
				gif.addEventFavorites(dataGifs.map((i) => i.id));
				gif.addEventDownloadGif(dataGifs.map((i) => i.id));
				gif.addEventFullScreenGif(dataGifs);
				totalGifs < pagination.total_count ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');
			}

			containerSearch.classList.remove('active');
			toggleIconsSearch();
			showSectionSearch(data.length ? true : false);
		})
		.catch((err) => {
			console.warn('Error al hacer la petición getApiSearch en la API: ', err);
		});
};


const addEventAutocomplete = () => {
	const itemsListAutocomplete = document.querySelectorAll('.item-list-autocomplete');

	itemsListAutocomplete.forEach((item) => {
		item.addEventListener('click', handleSearchByAutocomplete);
	});
};

const handleSearchByAutocomplete = () => {
	searchInput.value = event.target.id.replace('value-', '');
	handleDataSearch();
};

const showSectionSearch = (validateData) => {
	if (validateData) {
		sectionInfoSearch.classList.remove('active');
		sectionDataSearch.classList.add('active-data');
		sectionDataSearch.classList.remove('active-no-data');
	} else {
		sectionInfoSearch.classList.add('active');
		sectionDataSearch.classList.add('active-no-data');
		sectionDataSearch.classList.remove('active-data');
	}
};

const toggleIconsSearch = () => {
	if (searchInput.value) {
		searchIconRight.classList.add('icon-close');
		searchIconRight.classList.remove('icon-search');
	} else {
		searchIconRight.classList.add('icon-search');
		searchIconRight.classList.remove('icon-close');
	}
};

const handleResetSearch = () => {
	if (searchInput.value) {
		containerSearch.classList.remove('active');
		sectionInfoSearch.classList.add('active');
		sectionDataSearch.classList.remove('active-no-data');
		sectionDataSearch.classList.remove('active-data');
		searchInput.value = '';
		searchList.innerHTML = '';
		searchIconRight.classList.add('icon-search');
		searchIconRight.classList.remove('icon-close');
	}
};

const getTrendingSearch = () => {
	api.getApiTrendingSearch()
		.then((res) => {
			const trendings = res.data.slice(0, 5);

			trendings.forEach((text, key) => {
				searchTrendings[key].innerText = text;
			});
		})
		.catch((err) => {
			console.log('Error al hacer consulta getApiTrendingSearch() ', err);
		});
};

const addEventSearchTrendings = () => {
	searchTrendings.forEach((element) => {
		element.addEventListener('click', autocompleteTrending);
	});
};

const autocompleteTrending = () => {
	searchInput.value = event.target.innerText;
	handleDataSearch();
};

searchInput.addEventListener('keyup', (event) => {
	if (event.keyCode === 13 && searchInput.value.length) {
		event.preventDefault();
		handleDataSearch();
	}
});
searchIconLeft.addEventListener('click', handleDataSearch);
btnSeeMore.addEventListener('click', () => handleDataSearch(true));
searchInput.addEventListener('input', handleDataAutocomplete);
searchIconRight.addEventListener('click', handleResetSearch);

addEventSearchTrendings();
getTrendingSearch();
