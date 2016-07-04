import { TAPi18n } from 'meteor/tap:i18n';

export const displayError = (error) => {
  if (error) {
    // It would be better to not alert the error here but inform the user in some
    // more subtle way
    console.log( error );
    console.error(TAPi18n.__(error.message)); // eslint-disable-line no-alert
  }
};
