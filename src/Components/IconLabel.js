import React from 'react';
import './IconLabel.css'
const iconLabel = ({ icon, className, style, onClick, onMouseEnter, onMouseLeave }) => {
	return (
		<svg onClick={onClick} style={style} className={`icon ${className}`} aria-hidden="true" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<use xlinkHref={`#${icon}`}></use>
		</svg>
	);
};

export default iconLabel;
