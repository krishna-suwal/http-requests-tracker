import 'focus-visible';
import React from 'react';
import ReactDom from 'react-dom';
import App from './App';

const appRoot = document.getElementById('masteriyo');

if (appRoot) {
	ReactDom.render(<App />, appRoot);
}
