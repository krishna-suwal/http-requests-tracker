import clsx from 'clsx';
import React from 'react';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
	{
		title: 'Easy to Use',
		Svg: require('../../static/img/undraw_easy.svg').default,
		description: (
			<>
				You can easily setup your site to start tracking any type of http
				requests.
			</>
		),
	},
	{
		title: 'Customizable',
		Svg: require('../../static/img/undraw_customizable.svg').default,
		description: <>Define what type of http requests you want to track.</>,
	},
	{
		title: 'Statistics',
		Svg: require('../../static/img/undraw_charts.svg').default,
		description: <>Get logs and statistics of the requests that you track.</>,
	},
];

function Feature({ Svg, title, description }) {
	return (
		<div className={clsx('col col--4')}>
			<div className="text--center">
				<Svg className={styles.featureSvg} alt={title} />
			</div>
			<div className="text--center padding-horiz--md">
				<h3>{title}</h3>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default function HomepageFeatures() {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, idx) => (
						<Feature key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	);
}
