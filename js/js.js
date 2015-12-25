//Try to reduce the overal number of global variables if possible, use something similar to a store

const baseURL = 'https://api.zalando.com/articles/?fullText=';
var viewOrder = []; // Order in which items are posted to DOM
var currentItem = "";
var pageNumber = 1;
var currentSearchItem = "";
var removedContent = []; // Removed items

populateDatalist();
searchFor('jogger');

//Note that the fullText search is not the greatest
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

// Consider adding a timer delay (Several seconds)?
window.onscroll = (function() {
 	if (window.scrollY + window.innerHeight == getDocHeight()) {
   	addImages();
 	}
 	if (window.scrollY < height('header')) {
 		addOldImages();
 	}
});

function addImages() {
	checkIfNeedToRemove()
	pageNumber += 1
  searchFor(currentSearchItem, pageNumber, true);
}

function checkIfNeedToRemove() {
	//Could also use memory remaining to decide whether to reduce listed elements
	//const memory = window.performance.memory;
	//const memoryRemaining = memory.totalJSHeapSize - memory.usedJSHeapSize;

	// The limit is set artificially low to showcase it
	if (viewOrder.length > 60) {
		const removed = viewOrder.splice(0, viewOrder.length - 40); // This is expensive no? Depends on browser...
		removedContent.push(removed)
		removeContent(removed)
		console.log('Removed old content')
	}
}

function addOldImages() {
	if (removedContent.length > 0) {
		// Items are removed from removedContent as LIFO (stack)
		const toAdd = removedContent.pop().reverse(); //Adding 40 items at a time
		console.log('toAdd', toAdd);
		renderContent(toAdd, true, true);
		checkIfNeedToRemove();

		//checkIfNeedToRemove creates issues as it is removing from the bottom and pasting back into array
		// -> need to change the behaviour slighly differently....append vs prepend
	}
}

