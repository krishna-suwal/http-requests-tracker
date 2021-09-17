import 'focus-visible';
import React from 'react';
import ReactDom from 'react-dom';
import App from './App';

const appRoot = document.getElementById('hrt-backend');

if (appRoot) {
	// Remove wp default form css to avoid conflict.
	document.getElementById('forms-css')?.remove();

	// Render app.
	ReactDom.render(<App />, appRoot);
}
