// Might want to use imports if there is a natural split in the code
//import screenLoading from 'screenLoading.js'

const baseURL = 'https://api.zalando.com/articles/?fullText=';
var content = [];
var currentItem = "";

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

//Need to do pagination later to load more images

//Note that the fullText search is not the greatest
function searchFor(item) {
	const url = baseURL + encodeURIComponent(item)
	removeOldContent(document.getElementById('photo-loc'));

	get(url).then(function(response) {
		response = JSON.parse(response);
		content = response.content;
	  renderContent(response.content);
	}, function(error) {
	  console.error("Failed!", error);
	});
}

function removeOldContent(items) {
	while (items.firstChild) {
    items.removeChild(items.firstChild);
	}
}


function renderContent(content) {
	if (content.length === 0) {
		console.log('No Images')
		//Render something that prompts the end user to search again
		var err = document.createElement('div');
		err.innerHTML = 'Search Again'
		document.getElementById('photo-loc').appendChild(err)
		return
	}

	content.forEach(function(item) {
		imageURL = item.media.images[0].smallHdUrl;

		var img = document.createElement('img');
		img.className = 'preview';
		img.src = imageURL;
		img.onclick = function() { onImageClick(item); }
		document.getElementById('photo-loc').appendChild(img)
	})
}

function onImageClick(item) {
	document.getElementById('title').innerHTML = item.name;
	currentItem = item.id;
	document.getElementById('modal-photo').src = item.media.images[0].mediumHdUrl;

	if (!document.getElementById("modal").open) {
		document.getElementById("modal").showModal();
	}
}

function next(goBackwards) {
	var index = 0;
	content.find(function(item, i) { //Is this efficient using vanilla js...
		index = i
		return item.id === currentItem;
	})

	//Need to loop when get to the end of content or trigger another api call to get more content
	//Might also want to pass in parameters to limit the amount of the data coming back

	const nextItem = !goBackwards ? content[index + 1] : content[index - 1] || content[0];
	console.log(nextItem)
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
window.onscroll = (function() {
 	if(window.scrollY + window.innerHeight == getDocHeight()) {
   	console.log('hit bottom')
   	//Set off another api call once get here
 	}
});

//Look into this - http://blog.grayghostvisuals.com/js/detecting-scroll-position/

//This is to close the modal when clicking outside of it
document.querySelector('#modal').addEventListener('click', function(e){
	if (e.target.id === "modal") {
		document.getElementById("modal").close();
	}
})
