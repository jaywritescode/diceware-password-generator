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

        const stubFnForGetRandomValues = () => {
          const arrs = [
            Uint8Array.of(0, 0, 0, 0, 0),
            Uint8Array.of(0, 1, 2, 3, 4),
            Uint8Array.of(1, 2, 3, 4, 5),
            Uint8Array.of(5, 4, 3, 2, 1),
            Uint8Array.of(5, 5, 5, 5, 5)
          ];
        
          return (arr) => {
            const replacement = arrs.shift();
            for (let i = replacement.length - 1; i >= 0; --i) {
              arr[i] = replacement[i];
            };
          };
        };
        cy.stub(win.crypto, 'getRandomValues').callsFake(stubFnForGetRandomValues());
      }
    });
  });

  it('renders', function() {
    cy.get('#app').should('exist');
    cy.get('[data-test=password-field]').should('exist');
  });
});