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

import { LOCAL_STORAGE_KEY, WORD_LISTS } from './shared/constants';
import { roll } from './shared/utils';

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

function Radio(props) {
  const { name, value, checked, onChange, children } = props;

  return (
    <>
      <input type="radio" id={value} className="is-checkradio" name={name} checked={checked} onChange={onChange} />
      <label htmlFor={value}>
        {children}
      </label>
    </>
  );
}

class Popup extends React.Component {
  constructor(props) {
    super(props);
    
    const { name: wordsFile, dice, } = WORD_LISTS[0];
    this.state = {
      chosenWords: [],
      passphrase: '',
      wordsFile,
      dice
    };
  }

  componentDidMount() {
    this.fetchWords();
  }

  /**
   * Chooses words at random from the word list.
   * 
   * @param {function(string[]):void} callback - the consumer for the randomly chosen words
   * @param {integer} count - the number of words in the passphrase 
   */
  fetchWords(count = 5) {
    const { wordsFile, dice } = this.state;

    chrome.storage.local.get(LOCAL_STORAGE_KEY, result => {
      const wordsMap = result[LOCAL_STORAGE_KEY][wordsFile];
      const words = _.times(count, () => wordsMap[roll(dice)]);

      this.setState({
        chosenWords: words,
        passphrase: this.transform(words),
      });
    });
  }

  transform(words) {
    return words.join(' ');
  }

  handleRadioChange(evt) {
    const { name, id } = evt.target;
    this.setState({
      [name]: id
    });
  }

  render() {
    const { passphrase, wordsFile } = this.state;

    return (
      <Section>
        <Container>
          <PasswordDisplay passphrase={passphrase} />

          <Columns breakpoint='mobile'>
            <Columns.Column>
              <Field>
                <Control>
                  <Button onClick={() => this.fetchWords()}>Get Password</Button>
                </Control>
              </Field>  
            </Columns.Column>
            <Columns.Column>
              <Field>
                <Control>
                  {WORD_LISTS.map(({ text, name, dice }) => {
                    return (
                      <Radio
                        name="wordsFile"
                        onChange={() => this.setState({
                          wordsFile: name,
                          dice,
                        })}
                        checked={wordsFile === name}
                        value={name}
                        key={name}
                      >
                        {text}
                      </Radio>
                    );
                  })}
                </Control>
              </Field>
            </Columns.Column>
          </Columns>
        </Container>
      </Section>
    );
  }
}

document.addEventListener(
  'DOMContentLoaded', () => ReactDOM.render(<Popup />, document.getElementById('app')));