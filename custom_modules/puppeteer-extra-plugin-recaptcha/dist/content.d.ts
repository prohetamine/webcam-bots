import * as types from './types';
export declare const ContentScriptDefaultOpts: types.ContentScriptOpts;
export declare const ContentScriptDefaultData: types.ContentScriptData;
/**
 * Content script for Recaptcha handling (runs in browser context)
 * @note External modules are not supported here (due to content script isolation)
 */
export declare class RecaptchaContentScript {
    private opts;
    private data;
    constructor(opts?: types.ContentScriptOpts, data?: types.ContentScriptData);
    private _pick;
    private _flattenObject;
    private _getKeyByValue;
    private _waitUntilDocumentReady;
    private _paintCaptchaBusy;
    private _paintCaptchaSolved;
    private _findVisibleIframeNodes;
    private _findVisibleIframeNodeById;
    private getClients;
    private getVisibleIframesIds;
    private getResponseInputById;
    private getClientById;
    private extractInfoFromClient;
    findRecaptchas(): Promise<{
        captchas: types.CaptchaInfo[];
        error: any;
    }>;
    enterRecaptchaSolutions(): Promise<{
        solved: types.CaptchaSolved[];
        error: any;
    }>;
}
