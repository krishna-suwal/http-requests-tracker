import React from 'react';

interface Props {}

const MainLayout: React.FC<Props> = (props) => {
	return (
		<div className="mto-container mto-mx-auto mto-py-12">
			<div className="mto-p-10 mto-bg-white mto-shadow-lg mto-mt-10">
				{props.children}
			</div>
		</div>
	);
};

export default MainLayout;
