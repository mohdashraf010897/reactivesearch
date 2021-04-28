import styled from '@emotion/styled';
import { css } from '@emotion/core';

const IconGroup = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	grid-gap: 6px;
	margin: 0 10px;

	${({ positionType }) => {
		if (positionType === 'absolute') {
			return css`
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
			`;
		}
		return null;
	}};

	${({ groupPosition }) => {
		return groupPosition === 'right'
			? css`
					right: 0;
			  `
			: css`
					left: 0;
			  `;
	}};
`;

export default IconGroup;
