import App from 'next/app'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import { createStore } from '@reatom/core'
import { context } from '@reatom/react'
import slider from 'rc-slider/assets/index.css';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap');
  
 
  html, body, #__next {
    min-height: 100vh;
  }
  body {
    background-color: #CCCCCC;
    font-family: 'Roboto Condensed', sans-serif;
  }
  /* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default padding */
ul[class],
ol[class] {
  padding: 0;
}

/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p,
ul[class],
ol[class],
figure,
blockquote,
dl,
dd {
  margin: 0;
}

/* Set core root defaults */
html {
  scroll-behavior: smooth;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}

/* Remove list styles on ul, ol elements with a class attribute */
ul[class],
ol[class] {
  list-style: none;
}

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img {
  max-width: 100%;
  display: block;
}

/* Natural flow and rhythm in articles by default */
article > * + * {
  margin-top: 1em;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}

/* Blur images when they have no alt attribute */
img:not([alt]) {
  filter: blur(10px);
}

/* Remove all animations and transitions for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
${slider}
.rc-slider-handle {
  width: 15px;
    height: 16px;
    border: 1px solid #666666 !important;
    background-color: #ffffff !important;
    box-shadow: none !important;
}
`;

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

const WithStore = ({children}) => {
  const store = createStore();

  return (
      <context.Provider value={store}>
        {children}
      </context.Provider>
  )
};

export default class MyApp extends App {

  render() {
    const { Component, pageProps } = this.props
    return (
      <ThemeProvider theme={theme}>
        <WithStore>
          <Component {...pageProps} />
        </WithStore>
        <GlobalStyle/>
      </ThemeProvider>
    )
  }
}
