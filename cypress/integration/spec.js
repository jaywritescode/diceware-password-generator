import chrome from 'sinon-chrome';

describe('App', function() {
  before(function() {
    cy.visit('dist/popup.html', {
      onBeforeLoad(win) {
        win.chrome = chrome;
        win.chrome.storage.local.get.yields({
          'jaywritescode:diceware-password': {
            'eff_large_wordlist.txt': {
              11111: 'aardvark',
              12345: 'barnacle',
              23456: 'diameter',
              65432: 'youngster',
              66666: 'zygote'
            },
          },
        });

        cy.stub(win.crypto, 'getRandomValues').callsFake(function(array) {
          // this does nothing
          array = Uint8Array.of(1,2,3,4,5);
        });
      }
    });
  });

  it('does something', function() {
    
  });
});