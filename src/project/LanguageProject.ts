
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

    public translate(key: string, params?: any, locale?: string): string {
        if (_.isNil(locale)) {
            locale = this.defaultLocale;
        }
        let translator = this.locales.get(locale);
        if (_.isNil(translator)) {
            throw new ExtendedError(`Unable to find "${locale}" locale`);
        }
        return translator.translate(key, params);
    }

    public getRawTranslated<T = any>(locale?: string): T {
        if (_.isNil(locale)) {
            locale = this.defaultLocale;
        }
        let translator = this.locales.get(locale);
        if (_.isNil(translator)) {
            throw new ExtendedError(`Unable to find "${locale}" locale`);
        }
        return translator.getRawTranslated();
    }

    public getRawTranslation<T = any>(locale?: string): T {
        if (_.isNil(locale)) {
            locale = this.defaultLocale;
        }
        let translator = this.locales.get(locale);
        if (_.isNil(translator)) {
            throw new ExtendedError(`Unable to find "${locale}" locale`);
        }
        return translator.getRawTranslation();
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

