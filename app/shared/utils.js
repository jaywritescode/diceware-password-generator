/**
 * Simulates rolling a given number of six-sided dice.
 * 
 * @param {integer} - the number of dice to roll
 * @return {integer[]} an array of d6 rolls  
 */
export function roll(dice) {
 let array = new Uint8Array(dice);
 window.crypto.getRandomValues(array);
 // this method returns Uint8Array.from([1, 1, 1, 1, 1]) via the stub
 return array.map(i => (i % 6) + 1).join('');
}