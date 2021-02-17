import { IDestroyable } from '@ts-core/common';
import { ExtendedError } from '@ts-core/common/error';
import * as _ from 'lodash';
import * as MessageFormat from 'messageformat';

export class LanguageLocale extends IDestroyable {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _locale: string;
    protected _rawTranslation: any;

    protected history: Map<string, string>;
    protected formatter: any;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(locale: string, rawTranslation?: any) {
        super();
        this._locale = locale;
        this._rawTranslation = rawTranslation;

        this.history = new Map();
        this.formatter = new MessageFormat(locale);
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

    public compile(expression: string, params?: any): string {
        return this.formatter.compile(expression)(!_.isNil(params) ? params : {});
    }

    public isHasTranslation(key: string): boolean {
        return _.isString(_.get(this.rawTranslation, key));
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

    public get rawTranslation(): any {
        return this._rawTranslation;
    }
}
