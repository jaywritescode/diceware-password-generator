const NS = 'jaywritescode';
const EXT_NAME = 'diceware-password';
const LOCAL_STORAGE_KEY = `${NS}:${EXT_NAME}`;

const WORD_LISTS = [
  {
    'name': 'eff_large_wordlist.txt',
    'dice': 5,
    'text': 'standard'
  }, {
    'name': 'eff_short_wordlist_1.txt',
    'dice': 4,
    'text': 'short'
  }];

export { NS, EXT_NAME, LOCAL_STORAGE_KEY, WORD_LISTS };