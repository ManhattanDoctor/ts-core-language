import { IDestroyable, ExtendedError } from '@ts-core/common';
import { Language } from './Language';
import MessageFormat, * as MESSAGE_FORMAT from '@messageformat/core';
import * as _ from 'lodash';
export class LanguageLocale<T = any> extends IDestroyable {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _locale: string;
    protected _rawTranslation: T;

    protected history: Map<string, string>;
    protected formatter: MessageFormat;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(locale: string | Language, rawTranslation?: any) {
        super();
        this._locale = _.isString(locale) ? locale : locale.locale;
        this._rawTranslation = rawTranslation;

        this.history = new Map();
        this.formatter = LanguageLocale.create(this._locale);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public translate(key: string, params?: any): string {
        if (_.isNil(this.rawTranslation)) {
            throw new ExtendedError('Unable to translate "rawTranslation" is undefined');
        }
        return this.compile(_.get(this.rawTranslation, key), params);
    }

    public compile(phrase: string, params?: any): string {
        return this.formatter.compile(phrase)(!_.isNil(params) ? params : {});
    }

    public isHasTranslation(key: string, isOnlyIfNotEmpty?: boolean): boolean {
        let value = _.get(this.rawTranslation, key);
        if (!_.isString(value)) {
            return false;
        }
        return isOnlyIfNotEmpty ? !_.isEmpty(value) : true;
    }

    public destroy(): void {
        this._locale = null;
        this._rawTranslation = null;

        this.formatter = null;
        if (!_.isNil(this.history)) {
            this.history.clear();
            this.history = null;
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public getFromHistory(key: string): string {
        return this.history.get(key);
    }

    public addToHistory(key: string, value: string): void {
        this.history.set(key, value);
    }

    public removeFromHistory(key: string): void {
        this.history.delete(key);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get locale(): string {
        return this._locale;
    }

    public get rawTranslation(): T {
        return this._rawTranslation;
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Properties
    //
    // --------------------------------------------------------------------------

    public static create(locale: string): MessageFormat {
        let Constructor: any = !_.isNil(MESSAGE_FORMAT.default) ? MESSAGE_FORMAT.default : MESSAGE_FORMAT;
        return new Constructor(locale);
    }
}
