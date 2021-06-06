"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const index_1 = __importDefault(require("./index"));
// import * as types from './types'
// import { Puppeteer } from './puppeteer-mods'
const puppeteer_extra_1 = require("puppeteer-extra");
const PUPPETEER_ARGS = ['--no-sandbox', '--disable-setuid-sandbox'];
ava_1.default('will detect captchas', async (t) => {
    // const puppeteer = require('puppeteer-extra')
    const puppeteer = puppeteer_extra_1.addExtra(require('puppeteer'));
    const recaptchaPlugin = index_1.default();
    puppeteer.use(recaptchaPlugin);
    const browser = await puppeteer.launch({
        args: PUPPETEER_ARGS,
        headless: true
    });
    const page = await browser.newPage();
    const url = 'https://www.google.com/recaptcha/api2/demo';
    await page.goto(url, { waitUntil: 'networkidle0' });
    const { captchas, error } = await page.findRecaptchas();
    t.is(error, null);
    t.is(captchas.length, 1);
    const c = captchas[0];
    t.is(c.callback, 'onSuccess');
    t.is(c.hasResponseElement, true);
    t.is(c.url, url);
    t.true(c.sitekey && c.sitekey.length > 5);
    await browser.close();
});
// TODO: test/mock the rest
//# sourceMappingURL=index.test.js.map