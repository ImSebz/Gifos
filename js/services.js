import pathsApi from './paths-api.js';

export default {

	getApiTrending(limit, offset) {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_TRENDING}?api_key=${pathsApi.API_KEY}&limit=${limit}&offset=${offset}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},

	getApiAutocomplete(search) {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_AUTOCOMPLETE}?api_key=${pathsApi.API_KEY}&q=${search}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},

	getApiSearch(search, limit, offset) {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_SEARCH}?api_key=${pathsApi.API_KEY}&q=${search}&limit=${limit}&offset=${offset}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},

	getApiTrendingSearch() {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_SEARCH_TRENDING}?api_key=${pathsApi.API_KEY}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},

	getApiGifByID(id) {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_GIF_BY_ID}${id}?api_key=${pathsApi.API_KEY}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
	postUploadGif(blob) {
		const url = `${pathsApi.API_UPLOAD_GIFO}?api_key=${pathsApi.API_KEY}`;

		const form = new FormData();
		form.append('file', blob, 'myGif.gif');

		return new Promise((resolve, reject) => {
			fetch(url, { method: 'POST', body: form })
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},

	getAllFavoritesLocal() {
		if (!!localStorage.getItem('favorites')) {
			return JSON.parse(localStorage.getItem('favorites'));
		} else {
			return [];
		}
	},

	getPageFavoritesLocal(limit = 12, offset = 0) {
		if (!!localStorage.getItem('favorites')) {
			const favorites = JSON.parse(localStorage.getItem('favorites'));
			return favorites.slice(offset, offset + limit);
		} else {
			return [];
		}
	},

	setFavoritesLocal(array) {
		localStorage.setItem('favorites', JSON.stringify(array));
	},

	getAllMyGifsLocal() {
		if (!!localStorage.getItem('myGifs')) {
			return JSON.parse(localStorage.getItem('myGifs'));
		} else {
			return [];
		}
	},

	getPageMyGifsLocal(limit = 12, offset = 0) {
		if (!!localStorage.getItem('myGifs')) {
			const myGifs = JSON.parse(localStorage.getItem('myGifs'));
			return myGifs.slice(offset, offset + limit);
		} else {
			return [];
		}
	},

	setMyGifsLocal(array) {
		localStorage.setItem('myGifs', JSON.stringify(array));
	},

	downloadGif(url) {
		return new Promise((resolve, reject) => {
			fetch(url)
				.then((res) => res)
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
};
