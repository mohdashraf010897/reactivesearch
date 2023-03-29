/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import {
	AI_LOCAL_CACHE_KEY,
	AI_ROLES,
	componentTypes,
} from '@appbaseio/reactivecore/lib/utils/constants';
import hoistNonReactStatics from 'hoist-non-react-statics';
import types from '@appbaseio/reactivecore/lib/utils/types';
import {
	fetchAIResponse,
	setQueryOptions,
	updateQuery,
} from '@appbaseio/reactivecore/lib/actions/query';
import { setAIResponse, setDefaultQuery } from '@appbaseio/reactivecore/lib/actions/misc';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import {
	getClassName,
	getObjectFromLocalStorage,
	getQueryOptions,
	setObjectInLocalStorage,
} from '@appbaseio/reactivecore/lib/utils/helper';

import { Chatbox } from '../../../styles/AIAnswer';
import { connect } from '../../../utils';
import PreferencesConsumer from '../../basic/PreferencesConsumer';
import ComponentWrapper from '../../basic/ComponentWrapper';
import HOOKS from '../../../utils/hooks';
import Chat from './Chat';
import Title from '../../../styles/Title';

const { useConstructor } = HOOKS;

const AIAnswer = (props) => {
	const { componentId, AIConfig } = props;
	const [messages, setMessages] = React.useState([]);

	const internalComponent = useRef(null);
	const AISessionId = useRef(null);
	const options = getQueryOptions(props);

	const handleSendMessage = (text) => {
		setMessages([...messages, { content: text, role: AI_ROLES.USER }]);
		if (AISessionId.current) {
			props.getAIResponse(AISessionId.current, props.componentId, text);
		} else {
			console.error(
				`AISessionId for ${props.componentId} is missing! AIAnswer component requires an AISession to function. Trying reloading the App.`,
			);
		}
	};
	useConstructor(() => {
		if (!props.clearSessionOnDestroy) {
			const localCache = (getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {})[
				props.componentId
			];
			if (localCache) {
				AISessionId.current
					= ((getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {})[props.componentId] || {})
						.sessionId || null;

				props.updateAIResponse(props.componentId, localCache);
			}
		}
		internalComponent.current = getInternalComponentID(componentId);

		// execute is set to false at the time of mount
		// to avoid firing (multiple) partial queries.
		// Hence we are building the query in parts here
		// and only executing it with setReact() at core
		const execute = false;
		props.setQueryOptions(
			componentId,
			{
				...options,
				...(AIConfig && AIConfig.topDocsForContext
					? { size: AIConfig.topDocsForContext }
					: {}),
			},
			execute,
		);
		props.updateQuery(
			{
				componentId: internalComponent.current,
				query: null,
			},
			execute,
		);
	});

	useEffect(() => {
		if (props.AIResponse) {
			AISessionId.current
				= ((getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {})[props.componentId] || {})
					.sessionId || null;
			const { request, response } = props.AIResponse;

			const finalMessages = [];

			// pushing message history so far
			if (request && request.messages && Array.isArray(request.messages)) {
				finalMessages.push(
					...request.messages.filter(msg => msg.role !== AI_ROLES.SYSTEM),
				);
			}

			// pushing fresh response
			if (
				response
				&& response.choices
				&& Array.isArray(response.choices)
				&& response.choices.length > 0
			) {
				finalMessages.push(response.choices[0].message);
			}

			setMessages(finalMessages);
		}
	}, [props.AIResponse]);

	useEffect(
		() => () => {
			if (props.clearSessionOnDestroy) {
				// cleanup logic
				// final Object to store in local storage cache
				const finalCacheObj = getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {};
				// delete current component's cache
				delete finalCacheObj[props.componentId];
				// update local cache
				setObjectInLocalStorage(AI_LOCAL_CACHE_KEY, finalCacheObj);
			}
		},
		[],
	);

	return (
		<Chatbox>
			{' '}
			{props.title && (
				<Title className={getClassName(props.innerClass, 'ai-title') || null}>
					{props.title}
				</Title>
			)}
			<Chat
				messages={messages}
				onSendMessage={handleSendMessage}
				iconPosition={props.iconPosition}
				showIcon={props.showIcon}
				themePreset={props.themePreset}
				icon={props.icon}
				iconURL={props.iconURL}
				showVoiceInput={props.showVoiceInput}
				renderMic={props.renderMic}
				getMicInstance={props.getMicInstance}
				innerClass={props.innerClass}
				placeholder={props.placeholder}
				componentId={props.componentId}
				isAIResponseLoading={props.isAIResponseLoading}
				AIResponse={props.AIResponse}
				AIResponseError={props.AIResponseError}
				enterButton={props.enterButton}
				renderEnterButton={props.renderEnterButton}
				showInput={props.showInput}
			/>
		</Chatbox>
	);
};

AIAnswer.propTypes = {
	componentId: types.string.isRequired,
	showVoiceInput: PropTypes.bool,
	showIcon: PropTypes.bool,
	onData: PropTypes.func.isRequired,
	react: types.react,
	AIConfig: types.AIConfig,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	setDefaultQuery: types.funcRequired,
	iconPosition: types.iconPosition,
	themePreset: types.themePreset,
	icon: types.children,
	iconURL: types.string,
	showVoiceSearch: types.bool,
	renderMic: types.func,
	getMicInstance: types.func,
	innerClass: types.style,
	placeholder: types.string,
	title: types.title,
	AIResponse: types.componentObject,
	isAIResponseLoading: types.bool,
	AIResponseError: types.componentObject,
	getAIResponse: types.func.isRequired,
	enterButton: types.bool,
	renderEnterButton: types.title,
	showInput: types.bool,
	clearSessionOnDestroy: types.bool,
	updateAIResponse: types.func.isRequired,
};

AIAnswer.defaultProps = {
	placeholder: 'Ask a question',
	showVoiceInput: false,
	showIcon: true,
	showVoiceSearch: false,
	iconPosition: 'left',
	enterButton: true,
	renderEnterButton: null,
	showInput: true,
	clearSessionOnDestroy: true,
};

const mapStateToProps = (state, props) => ({
	AIResponse:
		state.AIResponses[props.componentId] && state.AIResponses[props.componentId].response,
	isAIResponseLoading:
		state.AIResponses[props.componentId] && state.AIResponses[props.componentId].isLoading,
	AIResponseError:
		state.AIResponses[props.componentId] && state.AIResponses[props.componentId].error,
});

const mapDispatchtoProps = dispatch => ({
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	updateQuery: (updateQueryObject, execute) => dispatch(updateQuery(updateQueryObject, execute)),
	getAIResponse: (sessionId, componentId, message) =>
		dispatch(fetchAIResponse(sessionId, componentId, message)),
	updateAIResponse: (componentId, payload) => dispatch(setAIResponse(componentId, payload)),
});

// Add componentType for SSR
AIAnswer.componentType = componentTypes.AIAnswer;

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(props => <AIAnswer ref={props.myForwardedRef} {...props} />));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{preferenceProps => (
			<ComponentWrapper
				{...preferenceProps}
				internalComponent
				componentType={componentTypes.AIAnswer}
				mode={preferenceProps.testMode ? 'test' : ''}
				{...(preferenceProps.AIConfig && preferenceProps.AIConfig.topDocsForContext
					? { size: preferenceProps.AIConfig.topDocsForContext }
					: {})}
			>
				{componentProps => (
					<ConnectedComponent
						{...preferenceProps}
						{...componentProps}
						myForwardedRef={ref}
					/>
				)}
			</ComponentWrapper>
		)}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, AIAnswer);

ForwardRefComponent.displayName = 'AIAnswer';
export default ForwardRefComponent;
