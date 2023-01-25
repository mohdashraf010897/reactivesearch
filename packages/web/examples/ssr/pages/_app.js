/* eslint-disable react/prop-types */
import React from 'react';
import './styles/airbnb.css';
import './styles/index.css';

export default function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} />;
}
