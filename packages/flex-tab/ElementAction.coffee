ElementAction = new class
	buttons = new ReactiveVar {}

	###
	config expects the following keys (only id is mandatory):
		id (mandatory)
		icon: string
		i18nLabel: string
		action: function(event, instance)
		validation: function(element)
		order: integer
	###
	addButton = (config) ->
		unless config?.id
			throw new Meteor.Error "ElementAction-addButton-error", "Button id was not informed."

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

	getButtons = (element) ->
		allButtons = _.toArray buttons.get()
		if element
			allowedButtons = _.compact _.map allButtons, (button) ->
				if not button.validation? or button.validation(element)
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
	ElementAction.addButton
		id: 'delete-element'
		icon: 'operation-delete'
		i18nLabel: 'Delete'
		action: (event, instance) ->
			@setSelected false
			instance.$(".element-edit-menu").hide()
			instance.removeElement @element._id
			###
			element = @_arguments[1]
			msg = $(event.currentTarget).closest('.element')[0]
			$("\##{msg.id} .element-dropdown").hide()
			return if msg.classList.contains("system")
			swal {
				title: t('Are_you_sure')
				text: t('You_will_not_be_able_to_recover')
				type: 'warning'
				showCancelButton: true
				confirmButtonColor: '#DD6B55'
				confirmButtonText: t('Yes_delete_it')
				cancelButtonText: t('Cancel')
				closeOnConfirm: false
				html: false
			}, ->
				swal
					title: t('Deleted')
					text: t('Your_entry_has_been_deleted')
					type: 'success'
					timer: 1000
					showConfirmButton: false

				if chatMessages[Session.get('openedCircuit')].editing.id is element._id
					chatMessages[Session.get('openedCircuit')].clearEditing(element)
				chatMessages[Session.get('openedCircuit')].deleteMsg(element)
				###
		validation: (element) ->
		#			return authz.hasAtLeastOnePermission('delete-element', element.cid ) or settings.get('Message_AllowDeleting') and element.u?._id is Meteor.userId()
		  return true
		order: 1

	ElementAction.addButton
		id: 'move-element'
		icon: 'operation-move'
		i18nLabel: 'Move'
		action: (event, instance) ->
			###
			element = @_arguments[1]
			msg = $(event.currentTarget).closest('.element')[0]
			$("\##{msg.id} .element-dropdown").hide()
			return if msg.classList.contains("system")
			swal {
				title: t('Are_you_sure')
				text: t('You_will_not_be_able_to_recover')
				type: 'warning'
				showCancelButton: true
				confirmButtonColor: '#DD6B55'
				confirmButtonText: t('Yes_delete_it')
				cancelButtonText: t('Cancel')
				closeOnConfirm: false
				html: false
			}, ->
				swal
					title: t('Deleted')
					text: t('Your_entry_has_been_deleted')
					type: 'success'
					timer: 1000
					showConfirmButton: false

				if chatMessages[Session.get('openedCircuit')].editing.id is element._id
					chatMessages[Session.get('openedCircuit')].clearEditing(element)
				chatMessages[Session.get('openedCircuit')].deleteMsg(element)
			###
		validation: (element) ->
      return true
#			return authz.hasAtLeastOnePermission('delete-element', element.cid ) or settings.get('Message_AllowDeleting') and element.u?._id is Meteor.userId()
#      return true
		order: 2

	ElementAction.addButton
		id: 'rotate-element'
		icon: 'operation-rotate'
		i18nLabel: 'Rotate'
		action: (event, instance) ->
			eid = @element._id
			allowedRotateStep = 90
			rot = allowedRotateStep
			if @element.transform.rot?
				rot += @element.transform.rot
			if rot > 360
				rot -= 360
			instance.rotateElement(eid, rot)
			###
			element = $(event.currentTarget).closest('.element')[0]
			chatMessages[Session.get('openedCircuit')].edit(element)
			$("\##{element.id} .element-dropdown").hide()
			input = instance.find('.input-element')
			Meteor.setTimeout ->
				input.focus()
			, 200
			###
		validation: (element) ->
			return true
			###
			hasPermission = authz.hasAtLeastOnePermission('edit-element', element.cid)
			isEditAllowed = settings.get 'Message_AllowEditing'
			editOwn = element.u?._id is Meteor.userId()
			return unless hasPermission or (isEditAllowed and editOwn)

			blockEditInMinutes = settings.get 'Message_AllowEditing_BlockEditInMinutes'
			if blockEditInMinutes? and blockEditInMinutes isnt 0
				msgTs = moment(element.ts) if element.ts?
				currentTsDiff = moment().diff(msgTs, 'minutes') if msgTs?
				return currentTsDiff < blockEditInMinutes
			else
				return true
			###
		order: 3
