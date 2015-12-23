function removeOldContent(items) {
	while (items.firstChild) {
    items.removeChild(items.firstChild);
	}
}

function renderContent(content, keepExistingContent) {
	if (content.length === 0 && !keepExistingContent) {
		//Render something that prompts the end user to search again
		var err = document.createElement('h2');
		err.className = 'error'
		err.innerHTML = 'Search Again'
		document.getElementById('photo-loc').appendChild(err)
		//Can also suggest other fields to the end user as examples
		return
	}

	content.forEach(function(item) {
		const modelImages = item.media.images.filter(function(image) {
			return image.type !== 'NON_MODEL'
		})
		if (modelImages.length === 0) {
			return //because images are not presentable
		}
		const imageURL = modelImages[0].smallHdUrl

		var tries = 1;
		var img = new Image();
		img.className = 'preview';
		img.id = item.id;
		img.src = imageURL;
		img.onclick = function() { onImageClick(item); }
		img.onmouseover = function() { onImageMouseOver(item); }
		img.onload = function() {
			viewOrder.push(item)
			document.getElementById('photo-loc').appendChild(img);
		}
		//Loading alternative images if photos are missing, mainly because hitting the API too quickly..
		img.onerror = function() {
			if (tries < modelImages.length) {
    		this.src = item.media.images[tries].smallHdUrl;
    		tries++;
    	}
		}
	})
}

// This lists the remaining number of items
// Might want to have a visualisation of it too? a horizontal bar??
// On something like this => http://blog.grayghostvisuals.com/js/detecting-scroll-position/
function setRemainingItems(count) {

}