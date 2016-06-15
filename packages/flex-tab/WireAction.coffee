WireAction = new class
	buttons = new ReactiveVar {}

	###
	config expects the following keys (only id is mandatory):
		id (mandatory)
		icon: string
		i18nLabel: string
		action: function(event, instance)
		validation: function(wire)
		order: integer
	###
	addButton = (config) ->
		unless config?.id
			throw new Meteor.Error "WireAction-addButton-error", "Button id was not informed."

		Tracker.nonreactive ->
			btns = buttons.get()
			btns[config.id] = config
			buttons.set btns

	removeButton = (id) ->
		Tracker.nonreactive ->
			btns = buttons.get()
			delete btns[id]
			buttons.set btns

	updateButton = (id, config) ->
		Tracker.nonreactive ->
			btns = buttons.get()
			if btns[id]
				btns[id] = _.extend btns[id], config
				buttons.set btns

	getButtonById = (id) ->
		allButtons = buttons.get()
		return allButtons[id]

	getButtons = (wire) ->
		allButtons = _.toArray buttons.get()
		if wire
			allowedButtons = _.compact _.map allButtons, (button) ->
				if not button.validation? or button.validation(wire)
					return button
		else
			allowedButtons = allButtons

		return _.sortBy allowedButtons, 'order'

	resetButtons = ->
		buttons.set {}

	addButton: addButton
	removeButton: removeButton
	updateButton: updateButton
	getButtons: getButtons
	getButtonById: getButtonById
	resetButtons: resetButtons

Meteor.startup ->
	WireAction.addButton
		id: 'edit-wire'
		icon: 'operation-edit'
		i18nLabel: 'Edit'
		action: (event, instance) ->
			wire = $(event.currentTarget).closest('.wire')[0]
			chatMessages[Session.get('openedCircuit')].edit(wire)
			$("\##{wire.id} .wire-dropdown").hide()
			input = instance.find('.input-wire')
			Meteor.setTimeout ->
				input.focus()
			, 200
		validation: (wire) ->
			hasPermission = authz.hasAtLeastOnePermission('edit-wire', wire.wid)
			isEditAllowed = settings.get 'Message_AllowEditing'
			editOwn = wire.u?._id is Meteor.userId()

			return unless hasPermission or (isEditAllowed and editOwn)

			blockEditInMinutes = settings.get 'Message_AllowEditing_BlockEditInMinutes'
			if blockEditInMinutes? and blockEditInMinutes isnt 0
				msgTs = moment(wire.ts) if wire.ts?
				currentTsDiff = moment().diff(msgTs, 'minutes') if msgTs?
				return currentTsDiff < blockEditInMinutes
			else
				return true
		order: 1

	WireAction.addButton
		id: 'delete-wire'
		icon: 'operation-delete'
		i18nLabel: 'Delete'
		action: (event, instance) ->
			@setSelected false
			instance.$(".wire-edit-menu").hide()
#			instance.$(".edit-menu").hide()
			instance.remove @selection

		validation: (wire) ->
#			return authz.hasAtLeastOnePermission('delete-wire', wire.cid ) or settings.get('Message_AllowDeleting') and wire.u?._id is Meteor.userId()
      return true
		order: 2
