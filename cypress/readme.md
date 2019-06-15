Cypress notes
=============

Setting up Cypress to integration test a Chrome extension was a bit non-intuitive, despite the relatively thorough Cypress documentation.

### Loading the extension

Cypress starts up a Chrome-like browser with a clean user profile and no extensions loaded. You can load a Chrome extension at startup by attaching an event handler to the Cypress-specific `before:browser:launch` event. Cypress invokes the browser from the command line, so the event handler gets passed the command line arguments as an array:

~~~js
// cypress/plugins/index.js

module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {

      // --load-extension is the name of the command line argument for loading a particular extension.
      // Its value is the relative path to the directory with the extension's manifest.json file.
      args.push('--load-extension="./dist"');
    }

    // don't forget to return args
    return args;
  });
};
~~~

In this case, I'm not sure that loading the extension is actually necessary. Loading the extension invokes the code in `app/background.js` (`background.scripts` in the `manifest.json` file), which reads the word lists into local storage. However, the tests themselves don't have access to `chrome.storage` (see below), so I'm not sure there's any real benefit to loading the extension.

### Invoking the extension

In normal usage, the extension is invoked by clicking its icon in the toolbar (`browser_action.default_popup` in `manifest.json`). It appears that the URI of `popup.html` is `chrome-extension://blahblahblah/popup.html`, where `blahblahblah` is the extension's ID. Cypress won't handle the `chrome-extension://` protocol, so we need a different way to open this page.

Our workaround is using a local http server to serve `popup.html`. We're using [`serve`](https://www.npmjs.com/package/serve) as our server and we're using [`start-server-and-test`](https://www.npmjs.com/package/start-server-and-test) to make sure that the server is actually running before we run our tests. We have the following:

~~~json
// package.json

{
  "scripts": {
    "cypress:open": "cypress open",
    "test:open": "start-test serve 5000 cypress:open"
  }
}
~~~

* `start-test` is an alias for `start-server-and-test`
* `serve` is described above. `serve` runs on port 5000 by default.
* `cypress open` starts up Cypress but doesn't run any tests.

Cypress gives us a menu of integration tests. When we choose `spec.js`, the setup above lets us access `popup.html`.

### Interacting with `chrome.storage`

On installation, the extension reads the (modified) Diceware word lists from text files and saves them to Chrome's local storage. However, our test `popup.html` and `popup.js` can't access that `chrome.storage`, so we need to mock out calls to it. For that, we're using [`sinon-chrome`](https://www.npmjs.com/package/sinon-chrome).

Note the structure of the tests:

~~~js
describe('App', function() {
  // The global Window object here is *not* the same window that our tests will run in,
  // so if we set up mocks here, they won't be passed on to our tests.

  before(function() {
    // we load (visit) the page under test in the test set-up, and pass in an event handler
    cy.visit('popup.html', {
      // onBeforeLoad is a page event that's specific to Cypress
      onBeforeLoad(win) {
        // here we've injected the actual window that our tests will run in
        win.chrome = require('sinon-chrome');

        win.chrome.storage = // some mock
      }
    })
  })

  it('test', function() {
    // this test will have access to our mocks
  })
})
~~~

#### Mocking `chrome.storage.local.get`

`chrome.storage.local.get` is a function that takes two parameters: the key(s) to look up in local storage and a single-argument callback. `get` will look up the given keys and resolve them into an associative array. It then invokes the callback passing in that associative array as its argument. For example:

~~~js
// assume chrome.storage.local looks like { a: 1, b: 2 }

chrome.storage.local.get('a', (result) => {
  console.log(result);
});
// => console.log({ a: 1 })
~~~

What we want is a stub method that will (a) not look up anything and (b) invoke the callback to `get` with the argument that we provide. In Sinon, that method is `yields`, so:

~~~js
chrome.storage.local.get.yields({ a: 1, b: 2 });

chrome.storage.local.get(LOCAL_STORAGE_KEY, function foo(result) => {
  // consume result
});
~~~

will execute `foo({a: 1, b: 2})`. This is the first half of what we need.

#### Mocking `window.crypto.getRandomValues`

`window.crypto.getRandomValues` takes a `TypedArray` as a parameter and returns void. You give it an array of length `n` and it replaces each of the `n` elements in the array with a random value. Note that it passes the array by reference, not the array pointer by reference, so you can't do

~~~js
// bad!

cy.stub(window.crypto, 'getRandomValues').callsFake((arr) => { arr = Uint8Array.of(1,2,3,4,5); })
~~~

because the reference you passed into the function remains unchanged. We pointed the old _variable_ to the new array, not the old _reference_. Instead, you need a consumer that changes each element of the passed array individually:

~~~js
cy.stub(window.crypto, 'getRandomValues').callsFake((arr) => {
  const newArray = [1, 2, 3, 4, 5];
  for (let i = 0; i < arr.length; ++i) {
    arr[i] = newArray[i];
  }
});
~~~