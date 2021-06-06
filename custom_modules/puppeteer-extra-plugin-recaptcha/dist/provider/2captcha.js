"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROVIDER_ID = '2captcha';
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default(`puppeteer-extra-plugin:recaptcha:${exports.PROVIDER_ID}`);
// const solver = require('./2captcha-api')
const solver = __importStar(require("./2captcha-api"));
const secondsBetweenDates = (before, after) => (after.getTime() - before.getTime()) / 1000;
async function decodeRecaptchaAsync(token, sitekey, url, opts = { pollingInterval: 2000 }) {
    return new Promise(resolve => {
        const cb = (err, result, invalid) => resolve({ err, result, invalid });
        try {
            solver.setApiKey(token);
            solver.decodeReCaptcha(sitekey, url, opts, cb);
        }
        catch (error) {
            return resolve({ err: error });
        }
    });
}
async function getSolutions(captchas = [], token) {
    const solutions = await Promise.all(captchas.map(c => getSolution(c, token || '')));
    return { solutions, error: solutions.find(s => !!s.error) };
}
exports.getSolutions = getSolutions;
async function getSolution(captcha, token) {
    const solution = {
        provider: exports.PROVIDER_ID
    };
    try {
        if (!captcha || !captcha.sitekey || !captcha.url || !captcha.id) {
            throw new Error('Missing data in captcha');
        }
        solution.id = captcha.id;
        solution.requestAt = new Date();
        debug('Requesting solution..', solution);
        const { err, result, invalid } = await decodeRecaptchaAsync(token, captcha.sitekey, captcha.url);
        debug('Got response', { err, result, invalid });
        if (err)
            throw new Error(`${exports.PROVIDER_ID} error: ${err}`);
        if (!result || !result.text || !result.id) {
            throw new Error(`${exports.PROVIDER_ID} error: Missing response data: ${result}`);
        }
        solution.providerCaptchaId = result.id;
        solution.text = result.text;
        solution.responseAt = new Date();
        solution.hasSolution = !!solution.text;
        solution.duration = secondsBetweenDates(solution.requestAt, solution.responseAt);
    }
    catch (error) {
        debug('Error', error);
        solution.error = error.toString();
    }
    return solution;
}
//# sourceMappingURL=2captcha.js.map