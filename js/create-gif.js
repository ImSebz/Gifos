import api from './services.js';
import gif from './gif.js';

const tagVideo = document.getElementById('video-camera');
const imgRecording = document.getElementById('img-recording');
const btnStart = document.getElementById('btn-start');
const btnPlay = document.getElementById('btn-play');
const btnReplay = document.getElementById('btn-replay');
const btnUpload = document.getElementById('btn-upload');
const btnTransparent = document.getElementById('btn-transparent');
const textInfo = document.getElementById('text-info');
const labelTimer = document.getElementById('timer');
const overflowGif = document.getElementById('overflow-gif');
const btnActionsGifo = document.querySelector('.btn-actions');
const btnActions = document.querySelectorAll('.btn-actions .btn-action');
const infoStatusGifo = document.querySelectorAll('.status-gifo');
const titlesTextInfo = document.querySelectorAll('#text-info p');
const steps = document.querySelectorAll('.steps span');
const imgCamera = document.querySelectorAll('#img-camera-container div');
const CONFIG_RECORDRTC = {
	type: 'gif',
	frameRate: 1,
	quality: 10,
	width: 360,
	hidden: 240,
	onGifRecordingStarted: function () {
		console.log('started');
	},
};
let stateRecording = false;
let timer = null;
let stream = null;
let recorder = null;
let blob = null;


const hiddenElement = (element) => {
	element.classList.add('d-none');
};

const showElement = (element) => {
	element.classList.remove('d-none');
};

const activeAnimationCamera = (active) => {
	if (active) {
		imgCamera[1].classList.add('visible');
		imgCamera[2].classList.remove('paused');
		imgCamera[3].classList.remove('paused');
	} else {
		imgCamera[1].classList.remove('visible');
		imgCamera[2].classList.add('paused');
		imgCamera[3].classList.add('paused');
	}
};

const parseTime = function (time) {
	const hours = Math.floor(time / 3600);
	time %= 3600;
	const minutes = Math.floor(time / 60);
	time %= 60;
	const seconds = time;

	const strHours = ('00' + hours).substr(-2, 2);
	const strMinutes = ('00' + minutes).substr(-2, 2);
	const strSeconds = ('00' + seconds).substr(-2, 2);

	return `${strHours}:${strMinutes}:${strSeconds}`;
};

const startTimer = () => {
	let counter = 0;

	timer = setInterval(() => {
		counter++;
		labelTimer.textContent = parseTime(counter);
	}, 1000);
};

const getStreamAndRecord = () => {
	const constraints = {
		audio: false,
		video: {
			height: { max: 480 },
		},
	};

	return navigator.mediaDevices.getUserMedia(constraints);
};

const startCreateGif = () => {
	hiddenElement(btnStart);
	titlesTextInfo[0].innerHTML = `¿Nos das acceso <br />a tu cámara?`;
	titlesTextInfo[1].innerHTML = `El acceso a tu camara será válido sólo <br />por el tiempo en el que estés creando el GIFO.`;
	steps[0].classList.add('active');
	startGettingPermissions();
};

const startGettingPermissions = async () => {
	try {
		stream = await getStreamAndRecord();
		tagVideo.srcObject = stream;
		tagVideo.play();
		showElement(tagVideo);
		showElement(btnPlay);
		showElement(labelTimer);
		hiddenElement(textInfo);
		steps[0].classList.remove('active');
		steps[1].classList.add('active');
	} catch (err) {
		alert('La aplicacion necesita obtener permisos de la cámara para poder grabar el gifo.');
		resetCreateGif();
	}
};

const toggleRecording = () => {
	if (!stateRecording) {
		btnPlay.innerText = 'FINALIZAR';
		stateRecording = true;
		recorder = RecordRTC(stream, CONFIG_RECORDRTC);
		recorder.startRecording();
		startTimer();
		activeAnimationCamera(true);
	} else {
		stopRecordingGif();
		activeAnimationCamera(false);
		hiddenElement(btnPlay);
		hiddenElement(labelTimer);
		showElement(btnReplay);
		showElement(btnUpload);
		btnPlay.innerText = 'GRABAR';
		stateRecording = false;
	}
};

const stopRecordingGif = () => {
	recorder.stopRecording(() => {
		clearInterval(timer);
		blob = recorder.getBlob();
		imgRecording.src = URL.createObjectURL(blob);
		hiddenElement(tagVideo);
		showElement(imgRecording);
	});
};

const uploadGifo = () => {
	hiddenElement(btnUpload);
	hiddenElement(btnReplay);
	showElement(btnTransparent);
	showElement(overflowGif);
	steps[1].classList.remove('active');
	steps[2].classList.add('active');

	api.postUploadGif(blob)
		.then((res) => {
			api.getApiGifByID(res.data.id)
				.then((res) => {
					btnActions[0].id = `download-${res.data.id}`;
					btnActions[1].id = `link-${res.data.id}`;

					const myGifs = api.getAllMyGifsLocal();
					myGifs.push(res.data);
					api.setMyGifsLocal(myGifs);
				})
				.catch((err) => {
					console.log('Error al hacer la peticion getApiGifByID() ', err);
				});
		})
		.catch((err) => {
			console.log('Error al hacer la peticion postUploadGif() ', err);
			alert('No se pudo subir tu Gif :(');
		})
		.finally(() => {
			showElement(btnActionsGifo);
			infoStatusGifo[0].classList.remove('icon-loader');
			infoStatusGifo[0].classList.remove('animate-rotate');
			infoStatusGifo[0].classList.add('icon-check');
			infoStatusGifo[1].innerText = 'GIFO subido con éxito';
		});
};

const resetPlayGif = () => {
	labelTimer.innerText = '00:00:00';
	showElement(btnPlay);
	showElement(labelTimer);
	showElement(tagVideo);
	hiddenElement(btnReplay);
	hiddenElement(btnUpload);
	hiddenElement(imgRecording);
};

const resetCreateGif = () => {
	showElement(btnStart);
	hiddenElement(btnPlay);
	titlesTextInfo[0].innerHTML = `Aquí podrás <br />crear tus propios <span class="color-secundary">GIFOS</span>`;
	titlesTextInfo[1].innerHTML = `¡Crea tu GIFO en sólo 3 pasos! <br />(sólo necesitas una cámara para grabar un video)`;
	steps[0].classList.remove('active');
	steps[1].classList.remove('active');
	steps[2].classList.remove('active');
};

const downloadGif = () => {
	gif.downloadGif(true, btnActions[0].id);
};

const shareGif = () => {
	gif.shareGif(btnActions[1].id.replace('link-', ''));
};


btnStart.addEventListener('click', startCreateGif);
btnPlay.addEventListener('click', toggleRecording);
btnReplay.addEventListener('click', resetPlayGif);
btnUpload.addEventListener('click', uploadGifo);
btnActions[0].addEventListener('click', downloadGif);
btnActions[1].addEventListener('click', shareGif);
