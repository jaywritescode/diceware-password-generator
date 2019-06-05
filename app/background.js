import _ from 'lodash';

const NS = 'jaywritescode';
const EXT_NAME = 'diceware-password';
const LOCAL_STORAGE_KEY = `${NS}:${EXT_NAME}`;

chrome.runtime.onInstalled.addListener(() => getWordList(`data/${WORD_LIST_FILENAMES[0]}`))

const WORD_LIST_FILENAMES = ['eff_large_wordlist.txt', 'eff_short_wordlist_1.txt'];

const getWordList = (url) => {
  fetch(url)
    .then(response => response.text()
      .then(text => {
        const words = _(text.split("\n")).map(line => line.split(' ')).fromPairs;
        chrome.storage.local.set({
          [LOCAL_STORAGE_KEY]: {
            large_wordlist: words,
          },
        }, () => chrome.storage.local.get(LOCAL_STORAGE_KEY, (x) => console.log(x)));
      }))
    .catch(console.log)
}