# pass-the-dice
See, because it's a <i><strong>pass</strong></i>word generator that uses the <i><strong>Dice</strong></i>ware algorithm. The name's funny that way.

---

These websites I'm signing into for the first time are always asking me for a new username and password. My password manager has this feature where you can click a button and get a random password, a string of numbers and letters, upper and lowercase, and sometimes those "special characters" too. And that's ~~great~~ okay and all, but the gibberish character string is hard to type in on a mobile device and it's impossible to remember.

#### There has to be a better way!

There's [Diceware](http://world.std.com/~reinhold/diceware.html). The Diceware algorithm requires five casino-grade dice, which is (a) not something I have handy and (b) massively inconvenient. C'mon Diceware, join the computing revolution already! 

Actually there's an abundance of websites that run a pseudo-random version of Diceware, but even those are inconvenient when some dumb bank website makes its users rotate their passwords every few months. That's why I decided to put Diceware at my fingertips, or at least in my Chrome's extension bar.

## How it works

You install it, you open it, and it shows you some randomly-chosen words from one of [EFF's word lists](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases). (Actually, I modified the "long" word list slightly. There are four hyphenated words in the list: `drop-down`, `felt-tip`, `yo-yo`, and `t-shirt`. I removed the hyphen from the first three because hyphens are hard to type on a mobile device, and I replaced the last one with `syzygy` because it's a cooler word.)

You can copy the passphrase to your clipboard, if that's the sort of thing you're into.

There are 6<sup>5</sup> = 7776 words in the long list, which is about log<sub>2</sub>(7776) &approx; 12.9 bits of entropy per word in the passphrase. The standard five-word passphrase is chosen from 28,430,288,029,929,701,376 possible permutations. That means you could give an attacker the word list, and even testing a million combinations per second, it would take the attacker somewhere around 160 million years to have a fifty-fifty chance of guessing your passphrase.

I bring up all that math because of...

## The "Advanced" button

...websites out in the wild designed by nimrods who insist you include a digit or a capital letter or some other nonsense to make your password "harder to guess". Anyway, there's a switch that capitalizes the first letter of the passphrase and another one that prepends a digit — not a random one, mind you — to the passphrase. You can also switch to the "short" word list (only 6<sup>4</sup> = 1296 words, &approx; 10.3 bits of entropy per word).

## Version 1.0.1: I surrender...

There are still product managers out in the world &mdash; actual live professionals who are paid money to make sure websites are usable &mdash; who haven't realized what a pain in the ass it is to type a non-alphanumeric character on a mobile device and who insist you include one in your password. It's now clear to me that the world will never be a well-designed place, so I added a switch to the password generator that does that. It hurt me so much to type that sentence.

## Development

I included a webpack build that sets up a development environment.

~~~sh
npm run dev
~~~

The extension isn't packed yet, so the only way to run it in Chrome is by setting the Extensions page to developer mode and then loading the unpacked extension.

## Roadmap in my mind

* Clean up the interface.
* Zip the damn thing and put it into the Chrome Web Store.
* Make a Firefox version, so I can switch to Firefox. (Actually, the current version seems to work on Firefox despite the error messages.)
* Deal with garbage websites that limit your password length.
