import api from './services.js';
import gif from './gif.js';

const sectionGifs = document.getElementById('gifs-section');
const containerGifs = document.getElementById('gifs-results');
const btnSeeMore = document.getElementById('btn-rounded');
let dataGifs = [];


const handleDataFav = (seeMore = false) => {
	if (!seeMore) {
		gif.setTotalGifs(0);
		dataGifs = [];
	}
	const offset = gif.totalGifs || 0;
	const gifFav = api.getPageFavoritesLocal(12, offset);
	const totalAllGifs = api.getAllFavoritesLocal();

	let templateGifs = '';

	gifFav.forEach((item) => {
		dataGifs.push(item);
		templateGifs += gif.maskGifs(item);
	});
	containerGifs.insertAdjacentHTML('beforeend', templateGifs);

	gif.setTotalGifs(document.querySelectorAll('#gifs-results .gif-container').length);

	gif.addEventMobile(
		dataGifs,
		dataGifs.map((i) => i.id),
	);
	gif.addEventFavorites(dataGifs.map((i) => i.id));
	gif.addEventDownloadGif(dataGifs.map((i) => i.id));
	gif.addEventFullScreenGif(dataGifs);
	gif.totalGifs < totalAllGifs.length ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');

	showSectionSearch(gifFav.length ? true : false);
};

const showSectionSearch = (validateData) => {
	if (validateData) {
		sectionGifs.classList.add('active-data');
		sectionGifs.classList.remove('active-no-data');
	} else {
		sectionGifs.classList.add('active-no-data');
		sectionGifs.classList.remove('active-data');
	}
};

btnSeeMore.addEventListener('click', () => handleDataFav(true));

handleDataFav();
