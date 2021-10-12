import api from './services.js';
const sectionGifs = document.getElementById('gifs-section');
const containerGifs = document.getElementById('gifs-results');
const btnSeeMore = document.getElementById('btn-rounded');
const modal = document.getElementById('modal');
let validateEvent = true;
let positionGif = 0;

export default {
	totalGifs: 0,
	setTotalGifs(totalGifs) {
		this.totalGifs = totalGifs;
	},
	maskGifs(gif, iconFav = 'heart', myGif = false) {
		const icon = myGif ? `<i class="trash-${gif.id} icon-trash-normal"></i>` : `<i class="fav-${gif.id} icon-${iconFav}"></i>`;

		return `
			<div class="gifId-${gif.id} gif-container" data-target="gif">
				<video class="gifId-${gif.id} gif" height="${gif.images.original.height}" autoplay loop muted playsinline>
					<source src="${gif.images.original.mp4}" type="video/mp4">
					Gif...
				</video>
				<div class="hover-gif">
					<div class="gif-actions">
						${icon}
						<i class="download-${gif.id} icon-download-hover"></i>
						<i class="show-${gif.id} icon-max-screen"></i>
					</div>
					<div class="gif-info">
						<p class="gif-user">${gif.username}</p>
						<p class="gif-title">${gif.title}</p>
					</div>
				</div>
			</div>
		`;
	},
	maskGifFullScreen(gif, iconFav = 'heart', myGif = false) {
		const icon = myGif ? `<i class="trash-${gif.id} icon-trash-normal"></i>` : `<i class="fav-${gif.id} icon-${iconFav}"></i>`;

		return `
			<i id="close-modal" class="close-modal icon-close"></i>
			<div class="view-gif-max">
				<div class="content-arrow-left">
					<div id="btn-arrow-left-max" class="btn-arrow-left">
						<i class="icon-arrow-left"></i>
					</div>
				</div>
				<div id="view-gif">
					<video class="gif" autoplay="" loop="" muted="" playsinline="">
						<source src="${gif.images.original.mp4}" type="video/mp4" />
						Gif...
					</video>
					<div class="gif-container-max">
						<div class="gif-info-max">
							<p class="gif-user">${gif.username}</p>
							<p class="gif-title">${gif.title}</p>
						</div>

						<div class="gif-action-max">
							${icon}
							<i class="download-${gif.id} icon-download-hover"></i>
						</div>
					</div>
				</div>
				<div class="content-arrow-right">
					<div id="btn-arrow-right-max" class="btn-arrow-right">
						<i class="icon-arrow-right"></i>
					</div>
				</div>
			</div>
		`;
	},

	addEventMobile(arrGifs, ids) {
		ids.forEach((id) => {
			const btnFavorites = document.querySelectorAll(`.gifId-${id}`);
			btnFavorites.forEach((btn) => {
				btn.addEventListener('click', () => {
					const widthScreen = screen.width;
					if (widthScreen < 767) {
						this.fullScreenGif(arrGifs);
					}
				});
			});
		});
	},

	addEventFavorites(ids) {
		ids.forEach((id) => {
			const btnFavorites = document.querySelectorAll(`.fav-${id}`);
			btnFavorites.forEach((btn) => {
				btn.addEventListener('click', () => this.addGifFavorites());
			});
		});
	},

	addEventDeleteMyGifo(ids) {
		ids.forEach((id) => {
			const btnFavorites = document.querySelectorAll(`.trash-${id}`);
			btnFavorites.forEach((btn) => {
				btn.addEventListener('click', () => this.deleteMyGifo(id));
			});
		});
	},

	addEventDownloadGif(ids) {
		ids.forEach((id) => {
			const btnDownloads = document.querySelectorAll(`.download-${id}`);
			btnDownloads.forEach((btn) => {
				btn.addEventListener('click', () => this.downloadGif());
			});
		});
	},

	addEventFullScreenGif(arrGifs) {
		const ids = arrGifs.map((i) => i.id);

		ids.forEach((id) => {
			const btnDownloads = document.querySelectorAll(`.show-${id}`);
			btnDownloads.forEach((btn) => {
				btn.addEventListener('click', () => this.fullScreenGif(arrGifs));
			});
		});
	},

	getGifsContainer() {
		return document.querySelectorAll('#gifs-results .gif-container');
	},

	reloadPageGif(arrGifs, gifId, myGifos = false) {
		let gifsContainer = this.getGifsContainer();
		const gifRemove = document.querySelector(`#gifs-results .gifId-${gifId}`) || null;
		if (arrGifs.length <= gifsContainer.length || !!gifRemove) {
			if (!!gifRemove) gifRemove.remove();
		}


		gifsContainer = this.getGifsContainer();
		if (arrGifs.length > gifsContainer.length && (gifsContainer.length % 12 !== 0 || gifsContainer.length == 0)) {
			const gifNew = arrGifs[gifsContainer.length];
			const templateGifs = this.maskGifs(gifNew);
			containerGifs.insertAdjacentHTML('beforeend', templateGifs);

			if (myGifos) {
				this.addEventDeleteMyGifo([gifNew.id]);
			} else {
				this.addEventFavorites([gifNew.id], true);
			}
			this.addEventDownloadGif([gifNew.id]);
			this.addEventFullScreenGif(arrGifs);
		}

		const gifs = this.getGifsContainer();
		this.setTotalGifs(gifs.length);
		arrGifs.length > gifs.length ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');
	},

	addGifFavorites() {
		if (validateEvent) {
			validateEvent = false;
			const gifId = event.target.classList[0].replace('fav-', '');
			const iconsGif = document.querySelectorAll(`.fav-${gifId}`);

			api.getApiGifByID(gifId)
				.then((res) => {
					const { data } = res;
					const favorites = api.getAllFavoritesLocal();
					let iconFav = '';
					let iconRem = '';

					if (favorites.some((fav) => fav.id === gifId)) {
						this.removeItemObjFromArr(favorites, gifId);
						iconFav = 'icon-heart-outline';
						iconRem = 'icon-heart';
					} else {
						favorites.push(data);
						iconFav = 'icon-heart';
						iconRem = 'icon-heart-outline';
					}


					iconsGif.forEach((btnFav) => {
						btnFav.classList.add(iconFav);
						btnFav.classList.remove(iconRem);
					});

					api.setFavoritesLocal(favorites);


					if (window.location.pathname == '/views/favoritos.html') {
						if (favorites.length) {
							sectionGifs.classList.add('active-data');
							sectionGifs.classList.remove('active-no-data');
						} else {
							sectionGifs.classList.add('active-no-data');
							sectionGifs.classList.remove('active-data');
						}

						this.reloadPageGif(favorites, gifId);
					}
				})
				.catch((err) => {
					console.log('Error al hacer la petición getApiGifByID en la API: ', err);
				})
				.finally(() => {
					validateEvent = true;
				});
		}
	},

	deleteMyGifo(id) {
		const myGifos = api.getAllMyGifsLocal();
		this.removeItemObjFromArr(myGifos, id);
		api.setMyGifsLocal(myGifos);
		this.reloadPageGif(myGifos, id);
	},

	downloadGif(createGif = false, id = null) {
		const gifId = createGif ? id : event.target.classList[0];

		api.getApiGifByID(gifId.replace('download-', ''))
			.then((res) => {
				const { data } = res;

				api.downloadGif(data.images.original.url)
					.then((response) => {

						response
							.blob()
							.then((file) => {
								const a = document.createElement('a');
								a.download = data.id;
								a.href = window.URL.createObjectURL(file);
								a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
								a.click();
							})
							.catch((err) => {
								console.error('Error al crear descargable: ', err);
							});
					})
					.catch((err) => {
						console.error('Error al descargar el gif: ', err);
					});
			})
			.catch((err) => {
				console.error('Error al hacer la petición getApiGifByID en la API: ', err);
			});
	},

	shareGif(id) {
		api.getApiGifByID(id)
			.then((res) => {
				const { data } = res;
				alert(data.url);
			})
			.catch((err) => {
				console.error('Error al hacer la petición shareGif() en la API: ', err);
			});
	},

	fullScreenGif(arrGifs) {
		if (validateEvent) {
			validateEvent = false;
			let gifId = null;
			if (event.target.classList[0].includes('show-')) {
				gifId = event.target.classList[0].replace('show-', '');
			} else {
				gifId = event.target.classList[0].replace('gifId-', '');
			}

			api.getApiGifByID(gifId)
				.then((res) => {
					const { data } = res;

					positionGif = arrGifs.map((item) => item.id).indexOf(data.id);

					document.getElementById('modal').classList.remove('modal-closed');
					document.body.style.overflow = 'hidden';


					const gifsFav = api.getAllFavoritesLocal();
					const iconFav = gifsFav.some((fav) => fav.id === data.id) ? 'heart' : 'heart-outline';
					modal.innerHTML = this.maskGifFullScreen(data, iconFav);

					this.addEventChangeGif(arrGifs);
					this.addEventFavorites([data.id]);
					this.addEventDownloadGif([data.id]);
				})
				.catch((err) => {
					console.error('Error al hacer la petición getApiGifByID en la API: ', err);
				})
				.finally(() => {
					validateEvent = true;
				});
		}
	},

	addEventChangeGif(arrGifs) {

		document.getElementById('close-modal').addEventListener('click', this.closeModal);
		document.getElementById('btn-arrow-left-max').addEventListener('click', () => this.reloadGifFullScreen(arrGifs, true));
		document.getElementById('btn-arrow-right-max').addEventListener('click', () => this.reloadGifFullScreen(arrGifs, false));
	},

	reloadGifFullScreen(arrGifs, direction) {
		if (direction) {
			if (positionGif == 0) {
				positionGif = arrGifs.length - 1;
			} else {
				positionGif--;
			}
		} else {
			if (positionGif == arrGifs.length - 1) {
				positionGif = 0;
			} else {
				positionGif++;
			}
		}

		const gifsFav = api.getAllFavoritesLocal();
		const iconFav = gifsFav.some((fav) => fav.id === arrGifs[positionGif].id) ? 'heart' : 'heart-outline';
		modal.innerHTML = this.maskGifFullScreen(arrGifs[positionGif], iconFav);
		this.addEventChangeGif(arrGifs);
		this.addEventFavorites([arrGifs[positionGif].id]);
		this.addEventDownloadGif([arrGifs[positionGif].id]);
	},

	closeModal() {
		document.body.style.overflow = 'auto';
		document.getElementById('modal').classList.add('modal-closed');
	},

	removeItemObjFromArr(arr, id) {
		const i = arr.map((itemArray) => itemArray.id).indexOf(id);

		if (i !== -1) {
			arr.splice(i, 1);
		}
	},
};
