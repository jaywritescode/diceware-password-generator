import './styles/popup.scss';
import _ from 'lodash';

import { LOCAL_STORAGE_KEY } from './shared/constants';

const init = () => {
  
  // add event listeners
  document.querySelector('#refresh').addEventListener('click', () => getWords(setPasswordField));
  document.querySelector('#copy').addEventListener('click', () => {
    window.navigator.clipboard.writeText(document.getElementById('password').value);
  });

  const roll = (dice = 5) => {
    let array = new Uint8Array(dice);
    window.crypto.getRandomValues(array);
    return array.map(i => (i % 6) + 1).join('');
  }
  
  const getWords = (callback, count = 5) => {
    chrome.storage.local.get(LOCAL_STORAGE_KEY, result => {
      const wordMap = result[LOCAL_STORAGE_KEY]['large_wordlist'];
      const words = _.times(count, () => wordMap[roll()]);
      callback.call(null, words);
    });
  }

  // TODO: format the text appropriately somewhere else
  const setPasswordField = (text) => {
    const passwordEl = document.querySelector('#password');
    passwordEl.value = text;
  }

  getWords(setPasswordField);
};

document.addEventListener('DOMContentLoaded', init);