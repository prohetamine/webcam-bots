const crypto = require('crypto');
const https = require('https');


/**
 * @type {string}
 * @const
 */
const API_URL = 'https://api4.temp-mail.org';

/**
 * Makes GET request
 * @param {string} url
 * @returns {Promise}
 */
function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode < 200 || res.statusCode > 299) {
          reject(new Error(`Request failed: ${res.statusCode}`));
        }

        let data = '';

        res
          .on('data', (chunk) => { data += chunk; })
          .on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

/**
 * Generates MD5 hash from email
 * @param {string} email
 * @returns {string}
 */
function getEmailHash(email) {
  return crypto.createHash('md5').update(email).digest('hex');
}

/**
 * Generates random email in given domains
 * @param {Array} domains
 * @param {number} [len=7]
 * @returns {string}
 */
function getRandomEmail(domains, len = 7) {
  const name = Math.random().toString(36).substring(len);
  const domain = domains[Math.floor(Math.random() * domains.length)];

  return name + domain;
}

/**
 * Receives available domains
 * @returns {Promise.<Array, Error>}
 */
function getAvailableDomains() {
  return get(`${API_URL}/request/domains/format/json/`).then(JSON.parse);
}

/**
 * Generates email on temp-mail.ru
 * @param {number} [len]
 * @returns {Promise.<String, Error>}
 */
function generateEmail(len) {
  return getAvailableDomains()
    .then(availableDomains => getRandomEmail(availableDomains, len));
}

/**
 * Receives inbox from temp-mail.ru
 * @param {string} email
 * @returns {Promise.<(Object|Array), Error>}
 */
function getInbox(email) {
  if (!email) {
    throw new Error('Please specify email');
  }

  return get(`${API_URL}/request/mail/id/${getEmailHash(email)}/format/json/`).then(JSON.parse);
}

module.exports = { generateEmail, getInbox };
