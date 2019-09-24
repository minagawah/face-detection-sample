# face-detection-sample

Playing with Face Detection API **(+ React Hooks!!!)**

    "react-use": "^12.2.0",

[1. About](#about)  
[2. Usage](#usage)  
[3. What I Did](#what-i-did)  
[4. Available Scripts](#avail)  
[5. Notes](#notes)  
&nbsp; [5-1. emotion.styled + useRef](#notes-emotion-useref)  
[6. LICENSE](#license)  

![screenshot](screenshot.png "Screenshot")

[View Demo](http://tokyo800.jp/minagawah/face-detection-sample/)  
***In order to view the demo, you need to enable some of the Chrome's developer features.  
See the instructions in ["2. Usage"](#usage) for how.***


<a id="about"></a>
## 1. About

Chrome browser has
[Face Detection API](https://www.chromestatus.com/feature/4757990523535360)
as an experimental feature, so I gave a try.  
It turned out, it was ridiculously easy.

Also, this sample project uses
[React Hooks](https://reactjs.org/docs/hooks-intro.html)
because I believe the time is ripe.  
(most of the hooks are of
[streamich/react-use](https://github.com/streamich/react-use))

For long, what has always been troubling me  
**was that Redux states management in many of my projects  
tend to turn into chaos when it comes to managing actual files in the projects.**  
So, when
[ducks](https://github.com/erikras/ducks-modular-redux)
came out, it was a life saver.  
With [ducks](https://github.com/erikras/ducks-modular-redux),
files in my projects were no longer messy.

Back at that time I was also looking for
FP way of implementing React apps.  
[redux-observable](https://github.com/redux-observable/redux-observable)
was one of the choices
but I knew it would become much messier.  
I knew it from the experience of using
[RxJS](https://github.com/ReactiveX/rxjs)
and
[MobX](https://github.com/mobxjs/mobx)
with which  
you tend to forget in your project
where you placed your pub/subs.  
[recompose](https://github.com/acdlite/recompose)
was another, and I chose it for most of my projects.

I vividly remember when
[proppy](https://github.com/fahad19/proppy)
came out last year.  
That was the time the nightmere has ended.  
It was beautiful and I instantly fell in love with it.

Then, finally came
[React Hooks](https://reactjs.org/docs/hooks-intro.html)
!!!  
To me, it was a big deal.  
You have no idea how long have I been waiting
for a legitimate way of applying FP,  
which also enables me to neatly place actual files.  
[React Hooks](https://reactjs.org/docs/hooks-intro.html)
made my codes cleaner and more explicit.  
Compare to
[the mess I made last year](https://github.com/minagawah/react-proppy-deckgl-sample),
notice how it become cleaner!  
Honestly, I am so glad to be born into this right moment.  

*Note: However, I recently feel a bit perplexed when I have  
odd and unexpected behaviors, mostly due to my wrongly  
wired dependencies for effect hooks...*


<a id="usage"></a>
## 2. Usage

First of all, you need to enable Chrome's experimental features, so that Face Detection API would work.  
Type the following on Chrome browser's URL:

```
chrome://flags/#enable-experimental-web-platform-features
```

Switch it to `Enabled`:

![chrome_experimental_features](chrome_experimental_features.png "chrome_experimental_features")

Secondly, while this is optional,
and is **only required [to view my demo](http://tokyo800.jp/minagawah/face-detection-sample/).**  
In order for `navigator.mediaDevices` to work without `https`,
you need to tell Chrome browser to ignore the security policy:

```
chrome://flags/#unsafely-treat-insecure-origin-as-secure
```

In the example bellow, you need to add `http://tokyo800.jp`.  
Add it.

![chrome_secure_origin](chrome_secure_origin.png "chrome_secure_origin")

When all is done, relaunch your Chrome browser, and you should be able to see the
[demo](http://tokyo800.jp/minagawah/face-detection-sample/)!




<a id="what-i-did"></a>
## 3. What I Did

Creating the app.

```shell
cd face-detection-sample
yarn create react-app . --typescript
```

For types required for React App:
- typescript
- @types/node
- @types/react
- @types/react-dom
- @types/react-router-dom
- @types/jest
- prop-types

For ESLint (for TSLint will be soon deprecated):
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- eslint-config-react

For React Router:
- react-router-dom

For CSS-in-JS. Note that `autoplefixer` is already included in CRA.  
Also, `normalized.css` is in `tailwindcss`.
- customize-cra
- react-app-rewired
- emotion
- @emotion/core
- @emotion/styled
- @emotion/babel-preset-css-prop
- tailwindcss
- tailwind.macro@next

For commonly used React Hooks:
- react-use

For service use:
- ramda


Which makes as a whole...

```shell
yarn add --dev typescript @types/node @types/react @types/react-dom @types/react-router-dom @types/jest prop-types @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-react customize-cra react-app-rewired emotion @emotion/core @emotion/styled @emotion/babel-preset-css-prop tailwindcss tailwind.macro@next

yarn add react-router-dom react-use ramda --dev
```


<a id="avail"></a>
## 4. Available Scripts

In the project directory, you can run:

`yarn run start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

`yarn run test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

`yarn run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

`yarn run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

<a id="notes"></a>
## 5. Notes

<a id="notes-emotion-useref"></a>
### 5-1. emotion.styled + useRef issue

Say, I use have a custom component
defined inline using `emotion.styled`.

```js
import styled from '@emotion/styled';

const Row = styled.div`
  margin-top: 0.2em;
`;

return (
  <Row>
    <video ref="videoRef" />
  </Row>
);
```

then, I found out the `ref` for the video tag
seems to show an odd behavior.
Even if I assign the media stream to `videoRef.srcObject`,
in the next tick whe React renders the DOM,
`srcObject` is no longer there...  
So it behaves the same when attaching
other attributes like `width` or `height` to the DOM.

For the workaround, you should consider
not using a custom component with `emotion.styled`,
but use a plain old `div`:

```js
return (
  <div css={tw`mt-4`}>
    <video ref="videoRef" />
  </div>
);
```

<a href="license"></a>
## 6. License

Provided under [WTFPL](./LICENSE).  
However, some NPM dependencies have license restrictions.
