import api from './services.js';
import gif from './gif.js';

const sectionGifs = document.getElementById('gifs-section');
const containerGifs = document.getElementById('gifs-results');
const btnSeeMore = document.getElementById('btn-rounded');
let dataGifs = [];


const handleDataMyGifs = (seeMore = false) => {
	if (!seeMore) {
		gif.setTotalGifs(0);
		dataGifs = [];
	}
	const offset = gif.totalGifs || 0;
	const myGifos = api.getPageMyGifsLocal(12, offset);
	const totalAllGifs = api.getAllMyGifsLocal();

	let templateGifs = '';

	myGifos.forEach((item) => {
		dataGifs.push(item);
		templateGifs += gif.maskGifs(item, 'heart', true);
	});
	containerGifs.insertAdjacentHTML('beforeend', templateGifs);

	gif.setTotalGifs(document.querySelectorAll('#gifs-results .gif-container').length);

	gif.addEventDeleteMyGifo(dataGifs.map((i) => i.id));
	gif.addEventDownloadGif(dataGifs.map((i) => i.id));
	gif.addEventFullScreenGif(dataGifs);
	gif.totalGifs < totalAllGifs.length ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');

	showSectionData(myGifos.length ? true : false);
};

const showSectionData = (validateData) => {
	if (validateData) {
		sectionGifs.classList.add('active-data');
		sectionGifs.classList.remove('active-no-data');
	} else {
		sectionGifs.classList.add('active-no-data');
		sectionGifs.classList.remove('active-data');
	}
};

btnSeeMore.addEventListener('click', () => handleDataMyGifs(true));

handleDataMyGifs();
