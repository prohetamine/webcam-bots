const test = require('tape');
const { generateEmail, getInbox } = require('../index');


test('Create a new email', (t) => {
  generateEmail()
    .then((email) => {
      t.equal(typeof email, 'string', 'email is a string');
      t.notEqual(email.indexOf('@'), -1, 'email contains at-mark');

      return email;
    })
    .then(getInbox)
    .catch((err) => {
      t.equal(err.message, 'Request failed: 404', 'inbox is empty');
      t.end();
    });
});
