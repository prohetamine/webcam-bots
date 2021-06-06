import { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin';
import { Browser, Frame, Page } from 'puppeteer';
import * as types from './types';
export declare const BuiltinSolutionProviders: types.SolutionProvider[];
/**
 * A puppeteer-extra plugin to automatically detect and solve reCAPTCHAs.
 * @noInheritDoc
 */
export declare class PuppeteerExtraPluginRecaptcha extends PuppeteerExtraPlugin {
    constructor(opts: Partial<types.PluginOptions>);
    get name(): string;
    get defaults(): types.PluginOptions;
    get contentScriptOpts(): types.ContentScriptOpts;
    private _generateContentScript;
    findRecaptchas(page: Page | Frame): Promise<types.FindRecaptchasResult>;
    getRecaptchaSolutions(captchas: types.CaptchaInfo[], provider?: types.SolutionProvider): Promise<any>;
    enterRecaptchaSolutions(page: Page | Frame, solutions: types.CaptchaSolution[]): Promise<types.EnterRecaptchaSolutionsResult>;
    solveRecaptchas(page: Page | Frame): Promise<types.SolveRecaptchasResult>;
    private _addCustomMethods;
    onPageCreated(page: Page): Promise<void>;
    /** Add additions to already existing pages and frames */
    onBrowser(browser: Browser): Promise<void>;
}
/** Default export, PuppeteerExtraPluginRecaptcha  */
declare const defaultExport: (options?: Partial<types.PluginOptions>) => PuppeteerExtraPluginRecaptcha;
export default defaultExport;
