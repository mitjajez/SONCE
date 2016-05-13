import '../components/flex-tabs/circuit-info.js';
import '../components/flex-tabs/components-list.js';
import '../components/flex-tabs/symbols-list.js';

TabBar.addButton({
	groups: ['circuit'],
	id: 'circuit-info',
	i18nTitle: 'Circuit info',
	icon: 'octicon octicon-info',
	template: 'Circuit_info',
	order: 1
});

TabBar.addButton({
	groups: ['circuit'],
	id: 'add-element',
	i18nTitle: 'Add_Element',
	icon: 'icon-add',
	template: 'Components_list',
	order: 2
});

TabBar.addButton({
	groups: ['circuit', 'symbols'],
	id: 'view-symbols',
	i18nTitle: 'View_symbols',
	icon: 'icon-cog',
	template: 'Symbols_list',
	order: 3
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
