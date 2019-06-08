import './styles/popup.scss';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { Field, Control, Input } from 'react-bulma-components/lib/components/form';
import Section from 'react-bulma-components/lib/components/section';
import Container from 'react-bulma-components/lib/components/container';
import Button from 'react-bulma-components/lib/components/button';
import Icon from 'react-bulma-components/lib/components/icon';
import Columns from 'react-bulma-components/lib/components/columns';

import { LOCAL_STORAGE_KEY, WORD_LIST_FILENAMES } from './shared/constants';

function PasswordDisplay(props) {
  const { passphrase } = props;

  return (
    <Field kind='addons'>
      <Control>
        <Input type='text' value={passphrase} readOnly={true} id='password' />
      </Control>
      <Control>
        <CopyButton passphrase={passphrase} />
      </Control>
    </Field>
  )
}

PasswordDisplay.propTypes = {
  passphrase: PropTypes.string.isRequired,
};

function CopyButton(props) {
  const { passphrase } = props;

  const handleClick = () => {
    window.navigator.clipboard.writeText(passphrase);
  }

  return (
    <Button id='copy' renderAs='a' onClick={handleClick}>
      <Icon>
        <span className="far fa-copy" />
      </Icon>
    </Button>
  )
}

CopyButton.propTypes = {
  passphrase: PropTypes.string.isRequired,
};

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wordlist: WORD_LIST_FILENAMES[0],
      chosenWords: [],
      passphrase: '',
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
        chosenWords: words,
        passphrase: this.transform(words),
      });
    });
  }

  transform(words) {
    return words.join(' ');
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

          <Columns>
            <Columns.Column>
              <Field>
                <Control>
                  <Button onClick={() => this.fetchWords()}>Get Password</Button>
                </Control>
              </Field>  
            </Columns.Column>
            <Columns.Column>
              <p>test test</p>
            </Columns.Column>
          </Columns>
          
        </Container>
      </Section>
    );
  }
}

document.addEventListener(
  'DOMContentLoaded', () => ReactDOM.render(<Popup />, document.getElementById('app')));