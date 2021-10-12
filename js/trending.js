import api from './services.js';
import gif from './gif.js';

const containerTrending = document.getElementById('gifs-trending'); 
const btnLeft = document.getElementById('btn-arrow-left');
const btnRight = document.getElementById('btn-arrow-right');
let gifsId = [];
let offset = 2;

const handleDataTrending = () => {
	api.getApiTrending(36, 0)
		.then((res) => {
			const { data, pagination } = res;
			containerTrending.innerHTML = '';

			if (data.length) {
				const gifsFav = api.getAllFavoritesLocal();
				let templateGifs = '';

				data.forEach((item) => {
					const iconFav = gifsFav.some((fav) => fav.id === item.id) ? 'heart' : 'heart-outline';
					templateGifs += gif.maskGifs(item, iconFav);
				});
				containerTrending.insertAdjacentHTML('beforeend', templateGifs);

				gifsId = data.map((i) => i.id);
				btnLeft.setAttribute('style', 'display: none');
				gif.addEventMobile(
					data,
					data.map((i) => i.id),
				);
				gif.addEventFavorites(data.map((i) => i.id));
				gif.addEventDownloadGif(data.map((i) => i.id));
				gif.addEventFullScreenGif(data);
			}
		})
		.catch((err) => {
			console.warn('Error al hacer la petición getApiSearch en la API: ', err);
		});
};


const rightMove = () => {
	btnLeft.setAttribute('style', '');
	offset += 1;
	const gifs = document.querySelectorAll(`.gifId-${gifsId[offset]}`);
	gifs[gifs.length > 1 ? 1 : 0].scrollIntoView();

	if (offset == 35) {
		btnRight.setAttribute('style', 'display: none');
	}
};

const leftMove = () => {
	btnRight.setAttribute('style', '');
	offset -= 3;
	const gifs = document.querySelectorAll(`.gifId-${gifsId[offset]}`);
	gifs[gifs.length > 1 ? 1 : 0].scrollIntoView();

	if (offset == 0) {
		offset = 2;
		btnLeft.setAttribute('style', 'display: none');
	} else {
		offset += 2;
	}
};

btnLeft.addEventListener('click', leftMove);
btnRight.addEventListener('click', rightMove);

handleDataTrending();
