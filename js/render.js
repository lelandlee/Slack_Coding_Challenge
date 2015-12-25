function removeOldContent(items) {
	while (items.firstChild) {
    items.removeChild(items.firstChild);
	}
}

function renderContent(content, keepExistingContent, prepend) {
	if (content.length === 0 && !keepExistingContent) {
		errorMessage()
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
			const parentNode = document.getElementById('photo-loc');
			if (!prepend) {
				viewOrder.push(item); // Should be accessing via an object store....
				parentNode.appendChild(img);
			}
			if (prepend) {
				viewOrder.unshift(item); // Is this expensive...?
				parentNode.insertBefore(img, parentNode.firstChild);
			}
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

function errorMessage() {
	//Render text that prompts the end user to search again
	var err = document.createElement('h2');
	err.className = 'error'
	err.innerHTML = 'Search Again'
	document.getElementById('photo-loc').appendChild(err)
	//Could also suggest other fields to the end user as examples
}

function removeContent(items) {
	const parentNode = document.getElementById('photo-loc');
	items.forEach(function(item) {
		var element = document.getElementById(item.id);
		parentNode.removeChild(element);
	})
}

// This lists the remaining number of items
function setRemainingItems(count) {
	document.querySelector('#count').innerHTML = count + " Items";
}

function populateDatalist() {
	var dataList = document.querySelector('#historicSearches');
	const history = getHistory(true);
	history.forEach(function(hist) {
		var option = document.createElement('option');
		option.value = hist
		dataList.appendChild(option)
	})
}