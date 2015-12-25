//Try to reduce the overal number of global variables if possible, use something similar to a store

const baseURL = 'https://api.zalando.com/articles/?fullText=';
var content = [];
var viewOrder = []; // Order in which items are posted to DOM
var currentItem = "";
var stepCount = 1;
var currentSearchItem = "";
var removedContent = []; // Removed items

populateDatalist();
searchFor('jogger');


// Function inpired from - http://www.html5rocks.com/en/tutorials/es6/promises/#toc-javascript-promises
// Might want to add more error handling, etc
function get(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      if (req.status == 200) {
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };

    req.send();
  });
}

//Note that the fullText search is not the greatest
function searchFor(item, pageNumber, keepExistingContent) {
	currentSearchItem = item;
	const url = baseURL + encodeURIComponent(item) + '&page=' + (pageNumber || 1) // + '&pageSize=20'
	
	if (!keepExistingContent) {
		removeOldContent(document.getElementById('photo-loc'));
		stepCount = 1;
	}

	get(url).then(function(response) {
		response = JSON.parse(response);
		keepExistingContent ? content.push(response.content) : content = response.content;
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

	//Trigger another api call to get more viewOrder
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

//add a timer delay (Several seconds)
//Remove top icons if there are too many -> might hinder performance
//Then need to do the same when going to top..
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
	stepCount += 1
  searchFor(currentSearchItem, stepCount, true);
}

function checkIfNeedToRemove() {
	//Could also use memory remaining to decide whether to reduce listed elements
	//const memory = window.performance.memory;
	//const memoryRemaining = memory.totalJSHeapSize - memory.usedJSHeapSize;

	// The limit is set artificially low to emphasize what it does
	if (viewOrder.length > 60) {
		// Keeps the maximum amount of items at 80
		const removed = viewOrder.splice(0, viewOrder.length - 40); // This is expensive no? Depends on browser...
		removedContent.push(removed)
		removeContent(removed)
		console.log('Removed old content')
	}
}

function addOldImages() {
	if (removedContent.length > 0) {
		// Need to remove items from removedContent is LIFO (stack)
		const toAdd = removedContent.pop().reverse();
		console.log('toAdd', toAdd);
		renderContent(toAdd, true, true);
		checkIfNeedToRemove();
	}
}

