import 'focus-visible';
import React from 'react';
import ReactDom from 'react-dom';
import App from './App';

const appRoot = document.getElementById('hrt-backend');

if (appRoot) {
	// Render app.
	ReactDom.render(<App />, appRoot);
}
