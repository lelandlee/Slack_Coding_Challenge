function onImageClick(item) {
	// Below uses - https://github.com/GoogleChrome/dialog-polyfill
	var dialog = document.querySelector('dialog');
	if (typeof HTMLDialogElement !== 'function') {
  	dialogPolyfill.registerDialog(dialog);
	}

	document.getElementById('modal-photo').src = '';
	document.getElementById('title').innerHTML = item.name;
	currentItem = item.id;
	document.getElementById('modal-photo').src = item.media.images[1].mediumHdUrl;

	if (!dialog.open) {
		dialog.showModal();
	}
}

function onImageMouseOver(item) {
	console.log('item is hovered on');

	//Choose between showing more images vs some css stuff
	//More images is better for UX, rather than a description -> image shows more value
	//Or could do an internet speed check...
}

//This is to close the modal when clicking outside of it
document.querySelector('#modal').addEventListener('click', function(e){
	if (e.target.id === "modal") {
		document.getElementById("modal").close();
	}
})