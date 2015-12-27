# Slack Image Presentation Challenge:
This is my approach to Slack's Intern Technical Challenge for their Summer 2016 prospective interns.

### The Challenge:
Create a web page that shows a grid of photo thumbnails; when a thumbnail is clicked, the photo should be displayed in a lightbox view, with the ability to move to the next / previous photos and display the photo title.

* The ability to access a public API and successfully retrieve data from it;
* The ability to display that data on a page;
* The ability to update the UI of a page without refreshing; and
* The ability to do all of the above using only native JavaScript (no libraries such as jQuery).

#### My Response:
Yaaay Vanilla.js, the pain is real without JavaScript libraries, new found respect for libraries. And no CSS libraries, though in retrospect I believed that I could have used Bootstrap or Semantic UI as it is a CSS library rather than a JS one.... Found an open photo API with a search functionality. Rather it is actually a clothing API (Zalando), but its full text search along with images fits the bill. Plus no need to do Oath2, which allows me focus on building the core product, and use semi-relevant web APIs!!

#### Features
Implemented:
 * JavaScript is separated into different files mimicking how code would be organized if modules are supported in Vanilla.js
 * When the end user scrolls down to the bottom of the webpage an API request is kicked off to display more photos. To prevent too many images from being loaded into the webpage at once, after the X amount of elements have been rendered, images from the top are removed to keep the webpage performant. If the user scrolls to the top then the images are repopulated. Using raw number of images is rather crude, could also look at `window.performance.memory`
 * Using `localStorage` to store historic searches.
 * I've taken the liberty to use a [dialog-polyfill](https://github.com/GoogleChrome/dialog-polyfill), in retrospect after I sent the email asking about polyfills I realised that there are other ways to create modals... But the [<dialog>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) tag makes it very convenient.....
 * There is a datalist to show recently searched items (uses local storage to save history)... but there is a need to use a polyfill for Safari support...but then again if it is missing it is not terrible....
 * For much of the CSS styling I've taken inspiration from a variety of sources and they are cited where they are used
 * Used promises accessing the **Zalando API**, I've taken inspiration from elsewhere and I have cited when appropriate.
 * Used the `Battery Status API` to determine the refresh rate of checking whether there are items rendered on the DOM.

Product Backlog:
 * Some sort of tests.... using console.assert() in webworkers (because there is more support there than in browser or at least according to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/console/assert))
 * Multi sized images? Some will be taller (2x1) and larger (2x2)
 * For the stickyscroll, rather than listing the number of items, have a progress bar on the number of items. Similar to what Bloomberg Businessweek does for their articles, but in this case only show the portion that is currently being viewed.
 * Update URL on seach
 * Prompt users to seach again or suggested searches when search comes up empty
 * Add loading icons
 * Have some action when hovering over photos, show different images or other meta data, preferably controlled by CSS.

Notes: Have to admit, this project was very enjoyable. My goal was to use as many relevant web APIs as possible and I somewhat achieved that goal: **Battery Status API** + **Web Storage API**. Unfortunately could not find a reasonable way to use webworkers...
