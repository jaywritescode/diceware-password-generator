import _ from 'lodash';
import { LOCAL_STORAGE_KEY, WORD_LIST_FILENAMES } from './shared/constants';

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%O", new value is "%O".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});

const handleInstalled = async () => {
  
  const installWordList = async (filename, path = 'data') => {
    const words = await getWordList(`${path}/${filename}`);
    return {
      [filename]: words,
    };
  };

  const getWordList = async (file) => {
    const response = await fetch(file);
    const text = await response.text();

    return _(text).split("\n").map(line => line.split(' ')).fromPairs().value();
  };

  Promise.all(WORD_LIST_FILENAMES.map(filename => installWordList(filename)))
    .then(entries => chrome.storage.local.set({
      [LOCAL_STORAGE_KEY]: Object.assign({}, ...entries),
    }));
};

chrome.runtime.onInstalled.addListener(handleInstalled);