import './styles/popup.scss';
import _ from 'lodash';

import { LOCAL_STORAGE_KEY } from './shared/constants';

function roll(dice = 5) {
  let array = new Uint8Array(dice);
  window.crypto.getRandomValues(array);
  return array.map(i => (i % 6) + 1).join('');
};

function getWords(cb) {
  chrome.storage.local.get(LOCAL_STORAGE_KEY, result => {
    const wordMap = result[LOCAL_STORAGE_KEY]['large_wordlist'];
    const words = _.times(5, () => wordMap[roll()]);
    cb.call(null, words);
  });
}

// TODO: format the text appropriately somewhere else
function setPasswordField(text) {
  const passwordEl = document.querySelector('#password');
  passwordEl.value = text;
}

document.addEventListener('DOMContentLoaded', () => getWords(setPasswordField));