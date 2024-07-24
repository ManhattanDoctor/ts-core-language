
import { Destroyable, ExtendedError } from '@ts-core/common';
import { ILanguageTranslator, LanguageTranslator } from '../translator';
import { LanguageLoadTranslationRawFunction } from './LanguageProjects';
import { LanguageLocale } from '../LanguageLocale';
import * as _ from 'lodash';

export class LanguageProject extends Destroyable {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    protected _name: string;

    protected locales: Map<string, ILanguageTranslator>;
    protected defaultLocale: string;
    protected loadTranslationRawFunction: LanguageLoadTranslationRawFunction;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(name: string, loadRawFunction: LanguageLoadTranslationRawFunction) {
        super();
        this._name = name;
        this.locales = new Map();
        this.loadTranslationRawFunction = loadRawFunction;
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected async createLocale(path: string, locale: string, prefixes: Array<string>): Promise<LanguageLocale> {
        return new LanguageLocale(locale, await this.loadTranslationRawFunction(path, this.name, locale, prefixes));
    }

    protected async createTranslator(path: string, locale: string, prefixes: Array<string>): Promise<ILanguageTranslator> {
        let item = new LanguageTranslator();
        item.locale = await this.createLocale(path, locale, prefixes);
        return item;
    }

    protected getTranslator(locale?: string): ILanguageTranslator {
        if (_.isNil(locale)) {
            locale = this.defaultLocale;
        }
        let item = this.locales.get(locale);
        if (_.isNil(item)) {
            throw new ExtendedError(`Unable to find "${locale}" locale`);
        }
        return item;
    }

    //--------------------------------------------------------------------------
    //
    // 	Proxy Methods
    //
    //--------------------------------------------------------------------------

    public compile<T = any>(key: string, params?: T, locale?: string): string {
        return this.getTranslator(locale).compile(key, params);
    }

    public translate<T = any>(key: string, params?: T, locale?: string): string {
        return this.getTranslator(locale).translate(key, params);
    }

    public isHasTranslation(key: string, isOnlyIfNotEmpty?: boolean, locale?: string): boolean {
        return this.getTranslator(locale).isHasTranslation(key, isOnlyIfNotEmpty);
    }

    public getRawTranslated<T = any>(locale?: string): T {
        return this.getTranslator(locale).getRawTranslated();
    }

    public getRawTranslation<T = any>(locale?: string): T {
        return this.getTranslator(locale).getRawTranslation();
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public async load(path: string, locales: Array<string>, prefixes: Array<string>): Promise<void> {
        this.defaultLocale = _.first(locales);
        for (let locale of locales) {
            this.locales.set(locale, await this.createTranslator(path, locale, prefixes));
        }
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.locales.clear();
        this.locales = null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get name(): string {
        return this._name;
    }
}

