import '../components/flex-tabs/components-list.js';
import '../components/flex-tabs/symbols-list.js';

TabBar.addButton({
	groups: ['circuit'],
	id: 'add-element',
	i18nTitle: 'Add_Element',
	icon: 'icon-add',
	template: 'Components_list',
	order: 1
});

TabBar.addButton({
	groups: ['circuit', 'symbols'],
	id: 'view-symbols',
	i18nTitle: 'View_symbols',
	icon: 'icon-cog',
	template: 'Symbols_list',
	order: 2
});
/*
TabBar.addButton({
	groups: ['circuit', 'privategroup', 'directmessage'],
	id: 'message-search',
	i18nTitle: 'Search',
	icon: 'octicon octicon-search',
	template: 'messageSearch',
	order: 2
});

TabBar.addButton({
	groups: ['circuit', 'privategroup'],
	id: 'members-list',
	i18nTitle: 'Members_List',
	icon: 'octicon octicon-organization',
	template: 'membersList',
	order: 3
});

TabBar.addButton({
	groups: ['circuit', 'privategroup', 'directmessage'],
	id: 'uploaded-files-list',
	i18nTitle: 'Room_uploaded_file_list',
	icon: 'octicon octicon-file-symlink-directory',
	template: 'uploadedFilesList',
	order: 4
});
*/
