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
			search:search;
			date: Date.now();
		};

		//Have the feeling that this is unperformant
		//might be better to only pull at the begining and push at the end?
		if (history !== null) {
			history = JSON.parse(history);
			history.push(toAdd)
			localStorage.setItem('history') = JSON.stringify(history);
		}
		else {
			localStorage.setItem('history') = JSON.stringify([toAdd])
		}
	}
}

function getHistory() {
	if (storageAvailable('localStorage')) {
		return JSON.parse(localStorage.getItem('history'));
	}
	return []
}