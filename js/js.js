//Try to reduce the overal number of global variables if possible, use something similar to a store

const baseURL = 'https://api.zalando.com/articles/?fullText=';
var viewOrder = []; // Order in which items are posted to DOM
var currentItem = "";
var pageNumber = 1;
var currentSearchItem = "";
var removedContent = {
	top: [],
	bottom: []
}
var refreshRate = 1000;


populateDatalist();
searchFor('jogger');

function searchFor(item, pageNumber, keepExistingContent) {
	currentSearchItem = item;
	const url = baseURL + encodeURIComponent(item) + '&page=' + (pageNumber || 1)
	
	if (!keepExistingContent) {
		removeOldContent(document.getElementById('photo-loc'));
		pageNumber = 1;
	}

	get(url).then(function(response) {
		response = JSON.parse(response);
	  renderContent(response.content, keepExistingContent);
	  setRemainingItems(response.totalElements)
	}, function(error) {
	  console.error("Failed!", error);
	});
}

function next(goBackwards) {
	var index = 0;
	viewOrder.find(function(item, i) { //Is this efficient using vanilla js...
		index = i
		return item.id === currentItem;
	})

	if (goBackwards) {
		var nextItem = viewOrder[index - 1] || viewOrder[0];
		onImageClick(nextItem);
		return
	}

	//Trigger another api call to get more images to populate viewOrder
	if (index === viewOrder.length - 1) {
		addImages()
		setTimeout(function() { //Would be better to use a promise or something similar...
			var nextItem = viewOrder[index + 1]
			onImageClick(nextItem);
			return
		}, 1000)
	}
	var nextItem = viewOrder[index + 1]
	onImageClick(nextItem);
}

function previous() {
	next(true)
}

function startSearch(i) {
	const searchText = document.querySelector('#seach-query').value;
	storeHistory(searchText)
	searchFor(searchText)
	populateDatalist();
}

function addImages() {
	checkIfNeedToRemove(true)
	pageNumber += 1
  searchFor(currentSearchItem, pageNumber, true);
}

function checkIfNeedToRemove(isBottom) {
	//Could also use memory remaining to decide whether to reduce listed elements
	//const memory = window.performance.memory;
	//const memoryRemaining = memory.totalJSHeapSize - memory.usedJSHeapSize;

	// The limit is set artificially low to showcase it
	if (viewOrder.length > 60) {
		// Removing 40 items at a time
		const removed = viewOrder.splice(0, viewOrder.length - 40); // This is expensive no? Depends on browser...
		
		if (!isBottom) {
			removedContent.bottom.push(removed);
			removeContent(removed);
		}
		if (isBottom) {
			removedContent.top.push(removed);
			removeContent(removed);
		}
		
		console.log('Removed old content')
	}
}

function addOldImages() {
	if (removedContent.top.length > 0) {
		// Items are removed from removedContent as LIFO (stack)
		const toAdd = removedContent.top.pop().reverse(); //Adding 40 items at a time
		console.log('toAdd', toAdd);
		renderContent(toAdd, true, true);
		checkIfNeedToRemove(false);
	}
}

// Consider adding a timer delay (Several seconds)?
window.onscroll = (function() {
 	if (window.scrollY + window.innerHeight == utils.getDocHeight()) {
   	addImages();
 	}
 	if (window.scrollY < utils.height('header')) {
 		addOldImages();
 	}
});

function determineRefreshRate() {
	navigator.getBattery().then(function(battery) {
		if (battery.charging) {
			refreshRate = 1000;
		}
		else if (battery.level < .30) {
			refreshRate = 3000;
		}
	})
}
determineRefreshRate()
setInterval(determineRefreshRate, 1000*60);

// Continously checking to see if there is content presented
// Check rate is reduced if low battery
setInterval(function() {
	if (document.getElementsByClassName('preview').length === 0
		&& document.getElementsByClassName('error').length < 1) {
		errorMessage()
	} else {
		clearErrorMessage()
	}
}, refreshRate)
