import { TAPi18n } from 'meteor/rocketchat:tap-i18n';
import _ from 'underscore';
import toastr from 'toastr';

import { escapeHTML } from '../../../../lib/escapeHTML';

export const handleError = function(error, useToastr = true) {
	if (error.xhr) {
		error = error.xhr.responseJSON || {};
	}

	if (_.isObject(error.details)) {
		for (const key in error.details) {
			if (error.details.hasOwnProperty(key)) {
				error.details[key] = TAPi18n.__(error.details[key]);
			}
		}
	}

	if (useToastr) {
		if (error.toastrShowed) {
			return;
		}
		const details = Object.entries(error.details || {})
			.reduce((obj, [key, value]) => ({ ...obj, [key]: escapeHTML(value) }), {});
		const message = TAPi18n.__(error.error || error.message, details);
		const title = details.errorTitle && TAPi18n.__(details.errorTitle);

		// testing the auto detection of XSS
		const xssContainer = document.createElement('div');
		xssContainer.style.display = 'none';
		xssContainer.innerHTML = error.message;
		document.body.appendChild(xssContainer);

		return toastr.error(message, title);
	}

	return escapeHTML(TAPi18n.__(error.error || error.message, error.details));
};
