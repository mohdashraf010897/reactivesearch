import * as React from 'react';

import { CommonProps } from '../..';
import * as types from '../../types';

export interface DataSearchProps extends CommonProps {
	autoFocus?: boolean;
	autosuggest?: boolean;
	beforeValueChange?: (...args: any[]) => any;
	children?: (data: any) => any;
	customHighlight?: (...args: any[]) => any;
	customQuery?: (...args: any[]) => any;
	defaultQuery?: (...args: any[]) => any;
	excludeFields?: Array<string>;
	getMicInstance?: (...args: any[]) => any;
	renderMic?: (...args: any[]) => any;
	dataField?: types.dataFieldArray;
	enableSynonyms?: boolean;
	queryString?: boolean;
	// TODO: Remove in v4
	enableQuerySuggestions?: boolean;
	enablePopularSuggestions?: boolean;
	aggregationField?: string;
	size?: number;
	debounce?: number;
	defaultValue?: string;
	value?: string;
	defaultSuggestions?: types.suggestions;
	downShiftProps?: types.props;
	fieldWeights?: types.fieldWeights;
	filterLabel?: string;
	fuzziness?: types.fuzziness;
	highlight?: boolean;
	highlightField?: types.stringOrArray;
	icon?: types.children;
	iconPosition?: types.iconPosition;
	includeFields?: Array<string>;
	innerClass?: types.style;
	nestedField?: string;
	onBlur?: (...args: any[]) => any;
	onError?: (...args: any[]) => any;
	onFocus?: (...args: any[]) => any;
	onKeyDown?: (...args: any[]) => any;
	onKeyPress?: (...args: any[]) => any;
	onKeyUp?: (...args: any[]) => any;
	onSuggestions?: (...args: any[]) => any;
	onValueChange?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	onValueSelected?: (...args: any[]) => any;
	placeholder?: string;
	queryFormat?: types.queryFormatSearch;
	react?: types.react;
	render?: (data: any) => any;
	// TODO: Remove in v4
	renderQuerySuggestions?: (data: any) => any;
	renderPopularSuggestions?: (data: any) => any;
	parseSuggestion?: (...args: any[]) => any;
	renderNoSuggestion?: types.title;
	renderError?: types.title;
	showFilter?: boolean;
	showIcon?: boolean;
	title?: types.title;
	theme?: types.style;
	loader?: types.title;
	themePreset?: types.themePreset;
	clearIcon?: types.children;
	showClear?: boolean;
	strictSelection?: boolean;
	searchOperators?: boolean;
	showVoiceSearch?: boolean;
	showDistinctSuggestions?: boolean;
	enablePhraseSuggestions?: boolean;
}
declare const DataSearch: React.ComponentClass<DataSearchProps>;

export default DataSearch;
