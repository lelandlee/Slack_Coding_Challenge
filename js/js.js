// Might want to use imports if there is a natural split in the code
//import screenLoading from 'screenLoading.js'

const baseURL = 'https://api.zalando.com/articles/?fullText=';
var content = [];
var viewOrder = []; // Order in which items are posted to DOM
var currentItem = "";
var stepCount = 1;
var currentSearchItem = "";
//import {onImageClick, onImageMouseOver} from './onImage'

//Might want to present a number of items somewhere at the top or bottom
// -> data is contained within the API reponse

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
	searchFor(searchText)
}

searchFor('jogger')

//Below inspiration - http://stackoverflow.com/questions/3898130/how-to-check-if-a-user-has-scrolled-to-the-bottom
function getDocHeight() {
  var D = document;
  return Math.max(
    D.body.scrollHeight, D.documentElement.scrollHeight,
    D.body.offsetHeight, D.documentElement.offsetHeight,
    D.body.clientHeight, D.documentElement.clientHeight
  );
}

//add a timer delay (Several seconds)
//Remove top icons if there are too many -> might hinder performance
//Then need to do the same when going to top..
window.onscroll = (function() {
 	if(window.scrollY + window.innerHeight == getDocHeight()) {
   	addImages();
 	}
});

function addImages() {
	// How to check memory usage rather than size of array?
	if (viewOrder.length > 300) {

	}
	stepCount += 1
  searchFor(currentSearchItem, stepCount, true);
}

//Look into this - http://blog.grayghostvisuals.com/js/detecting-scroll-position/

//This is to close the modal when clicking outside of it
document.querySelector('#modal').addEventListener('click', function(e){
	if (e.target.id === "modal") {
		document.getElementById("modal").close();
	}
})
