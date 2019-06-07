import './styles/popup.scss';
import _ from 'lodash';
import React from 'react';
import { Field, Control, Input } from 'react-bulma-components/lib/components/form';

import { LOCAL_STORAGE_KEY, WORD_LIST_FILENAMES } from './shared/constants';

const init = () => {
  
  // add event listeners
  document.querySelector('#refresh').addEventListener('click', () => getWords(setPasswordField));
  document.querySelector('#copy').addEventListener('click', () => {
    window.navigator.clipboard.writeText(document.getElementById('password').value);
  });

  /**
   * Simulates rolling a given number of six-sided dice.
   * 
   * @param {integer} [dice=5] - the number of dice to roll
   * @return {integer[]} an array of d6 rolls  
   */
  const roll = (dice = 5) => {
    let array = new Uint8Array(dice);
    window.crypto.getRandomValues(array);
    return array.map(i => (i % 6) + 1).join('');
  }
  
  /**
   * Chooses words at random from the word list.
   * 
   * @param {function(string[]):void} callback - the consumer for the randomly chosen words
   * @param {integer} count - the number of words in the passphrase 
   */
  const getWords = (callback, count = 5) => {
    chrome.storage.local.get(LOCAL_STORAGE_KEY, result => {
      const wordMap = result[LOCAL_STORAGE_KEY][WORD_LIST_FILENAMES[0]];
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