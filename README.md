# Slack Image Presentation Challenge:
This is my approach to Slack's Intern Technical Challenge for their Summer 2016 prospective interns.

### The Challenge:
Create a web page that shows a grid of photo thumbnails; when a thumbnail is clicked, the photo should be displayed in a lightbox view, with the ability to move to the next / previous photos and display the photo title.

* The ability to access a public API and successfully retrieve data from it;
* The ability to display that data on a page;
* The ability to update the UI of a page without refreshing; and
* The ability to do all of the above using only native JavaScript (no libraries such as jQuery).

#### My Response:
Yaaay Vanilla.js, the pain is real without JavaScript libraries, new found respect for libraries. And no CSS libraries, though in retrospect I believed that I could have used Bootstrap or Semantic UI as it is a CSS library rather than a JS one.... Found an open photo API with a search functionality. Rather it is actually a clothing API (Zalando), but its full text search along with images is rather idea.

#### Features
Implimented:
 * JavaScript is seperated into different files minicking how code would be organised if modules are supported in Vanilla.js
 * When the end user scrolls down to the button an API request is kicked off to add more photos viewable. [Once the user has scrolled far enough (used x amount of memory?), images are removed from the top to keep the web page performant. If the user scrolls to the top then the images are repopulated]
 * Use localStorage to store historic searches.
 * I've taken the liberty to use a [dialog-polyfill](https://github.com/GoogleChrome/dialog-polyfill), in retrospect after I sent the emailing asking about polyfills I realised that there are other ways to create modals...

To Impliment:

Notes: