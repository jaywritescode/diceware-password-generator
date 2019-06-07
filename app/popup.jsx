import './styles/popup.scss';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

import { Field, Control, Input } from 'react-bulma-components/lib/components/form';
import Section from 'react-bulma-components/lib/components/section';
import Container from 'react-bulma-components/lib/components/container';

import { LOCAL_STORAGE_KEY, WORD_LIST_FILENAMES } from './shared/constants';

class PasswordDisplay extends React.Component {
  render() {
    return (
      <Field kind='addons'>
        <Control>
          <Input type='text' value={this.props.passphrase} readOnly={true} />
        </Control>
      </Field>
    )
  }
}

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'wordlist': WORD_LIST_FILENAMES[0],
    };
    this.fetchWords();
  }

  /**
   * Chooses words at random from the word list.
   * 
   * @param {function(string[]):void} callback - the consumer for the randomly chosen words
   * @param {integer} count - the number of words in the passphrase 
   */
  fetchWords(count = 5) {
    chrome.storage.local.get(LOCAL_STORAGE_KEY, result => {
      const wordMap = result[LOCAL_STORAGE_KEY][this.state.wordlist];
      const words = _.times(count, () => wordMap[this.roll()]);
      this.setState({
        passphrase: words
      });
    });
  }

  /**
   * Simulates rolling a given number of six-sided dice.
   * 
   * @param {integer} [dice=5] - the number of dice to roll
   * @return {integer[]} an array of d6 rolls  
   */
  roll(dice = 5) {
    let array = new Uint8Array(dice);
    window.crypto.getRandomValues(array);
    return array.map(i => (i % 6) + 1).join('');
  }

  render() {
    return (
      <Section>
        <Container>
          <PasswordDisplay passphrase={this.state.passphrase} />
        </Container>
      </Section>
    );
  }
}

// const init = () => {
  
//   // add event listeners
//   document.querySelector('#refresh').addEventListener('click', () => getWords(setPasswordField));
//   document.querySelector('#copy').addEventListener('click', () => {
//     window.navigator.clipboard.writeText(document.getElementById('password').value);
//   });

//   // TODO: format the text appropriately somewhere else
//   const setPasswordField = (text) => {
//     const passwordEl = document.querySelector('#password');
//     passwordEl.value = text;
//   }
// };

document.addEventListener(
  'DOMContentLoaded', () => ReactDOM.render(<Popup />, document.body));