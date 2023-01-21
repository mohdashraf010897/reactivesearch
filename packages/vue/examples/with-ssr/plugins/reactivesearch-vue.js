// eslint-disable-next-line
import Vue from 'vue';
import {
	ReactiveBase,
	ReactiveGoogleMap,
	SelectedFilters,
	SingleList,
} from '@appbaseio/reactivesearch-vue';

Vue.use(ReactiveBase);
Vue.use(SingleList);
Vue.use(SelectedFilters);
Vue.use(ReactiveGoogleMap, {
	key: 'AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU',
});
