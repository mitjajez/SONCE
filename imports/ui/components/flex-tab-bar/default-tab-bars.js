import { TabBar } from 'meteor/flextab';

import '../flex-tabs/about.js';
import '../flex-tabs/circuit-info.js';
import '../flex-tabs/netlist.js';
import '../flex-tabs/circuit-graph.js';
import '../flex-tabs/components-list.js';
import '../flex-tabs/symbols-list.js';

TabBar.addButton({
  groups: ['circuit', 'circuit-edit'],
  id: 'about',
  i18nTitle: 'About',
  icon: 'icon-info-circled',
  template: 'About',
  order: 1,
});

TabBar.addButton({
  groups: ['circuit'],
  id: 'circuit-info',
  i18nTitle: 'Circuit info',
  icon: 'icon-cog',
  template: 'Circuit_info',
  order: 2,
});

TabBar.addButton({
  groups: ['circuit', 'circuit-edit'],
  id: 'add-element',
  i18nTitle: 'Add_Element',
  icon: 'icon-plus',
  template: 'Components_list',
  order: 3,
});

TabBar.addButton({
  groups: ['circuit', 'circuit-edit'],
  id: 'wire',
  i18nTitle: 'Wire',
  icon: 'icon-chart',
  template: 'Circuit_info',
  order: 4,
});

TabBar.addButton({
  groups: ['circuit'],
  id: 'netlist',
  i18nTitle: 'Netlist',
  icon: 'icon-list',
  template: 'Netlist',
  order: 5,
});

TabBar.addButton({
  groups: ['circuit'],
  id: 'circuit-graph',
  i18nTitle: 'Circuit graph',
  icon: 'icon-diagram',
  template: 'Circuit_graph',
  order: 6,
});

TabBar.addButton({
  groups: ['circuit', 'circuit-edit', 'symbols'],
  id: 'view-symbols',
  i18nTitle: 'View_symbols',
  icon: 'icon-vector',
  template: 'Symbols_list',
  order: 7,
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
