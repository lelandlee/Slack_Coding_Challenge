function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}

function storeHistory(search) {
	if (storageAvailable('localStorage')) {
		var history = localStorage.getItem('history')
		const toAdd = {
			search: search.toLocaleLowerCase(),
			date: Date.now(),
		};

		//Have the feeling that this is unperformant
		//might be better to only pull at the begining and push at the end..
		// Performance -> http://www.stevesouders.com/blog/2014/02/11/measuring-localstorage-performance/
		//plus using an array too...... linked list might be better? 
		// --> But that is difficult to impliment for localStorage as everything is a string
		if (history !== null) {
			history = JSON.parse(history);
			history.push(toAdd)
			localStorage.setItem('history', JSON.stringify(history));
		}
		else {
			localStorage.setItem('history', JSON.stringify([toAdd]))
		}
	}
}

function getHistory(justSeachItems) {
	if (storageAvailable('localStorage')) {
		const history = JSON.parse(localStorage.getItem('history')) || []
		if (justSeachItems) {
			return history.map(function(d) { return d.search; });
		}
		return history;
	}
	return []
}