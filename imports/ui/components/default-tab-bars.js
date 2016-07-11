import { TabBar } from 'meteor/flextab';

import '../components/flex-tabs/circuit-info.js';
import '../components/flex-tabs/netlist.js';
import '../components/flex-tabs/circuit-graph.js';
import '../components/flex-tabs/components-list.js';
import '../components/flex-tabs/symbols-list.js';

TabBar.addButton({
	groups: ['circuit'],
	id: 'circuit-info',
	i18nTitle: 'Circuit info',
	icon: 'icon-info-circled',
	template: 'Circuit_info',
	order: 1
});

TabBar.addButton({
	groups: ['circuit'],
	id: 'netlist',
	i18nTitle: 'Netlist',
	icon: 'icon-list',
	template: 'Netlist',
	order: 2
});

TabBar.addButton({
	groups: ['circuit'],
	id: 'circuit-graph',
	i18nTitle: 'Circuit graph',
	icon: 'icon-diagram',
	template: 'Circuit_graph',
	order: 3
});

TabBar.addButton({
	groups: ['circuit'],
	id: 'add-element',
	i18nTitle: 'Add_Element',
	icon: 'icon-plus',
	template: 'Components_list',
	order: 4
});

TabBar.addButton({
	groups: ['circuit', 'symbols'],
	id: 'view-symbols',
	i18nTitle: 'View_symbols',
	icon: 'icon-vector',
	template: 'Symbols_list',
	order: 5
});
/*
TabBar.addButton({
	groups: ['circuit', 'privategroup'],
	id: 'members-list',
	i18nTitle: 'Members_List',
	icon: 'octicon octicon-organization',
	template: 'membersList',
	order: 3
});

*/
