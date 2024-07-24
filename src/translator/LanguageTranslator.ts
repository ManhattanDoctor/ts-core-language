import { ObjectUtil, ObservableData, DestroyableContainer, ExtendedError } from '@ts-core/common';
import { ILanguageTranslator } from './ILanguageTranslator';
import { LanguageTranslatorEvent } from './LanguageTranslatorEvent';
import { LanguageLocale } from '../LanguageLocale';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

export class LanguageTranslator extends DestroyableContainer implements ILanguageTranslator {
    // --------------------------------------------------------------------------
    //
    // 	Constants
    //
    // --------------------------------------------------------------------------

    public static DEFAULT_LINK_SYMBOL = '⇛';

    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _locale: LanguageLocale;

    protected observer: Subject<ObservableData<LanguageTranslatorEvent, ExtendedError>>;
    protected linkSymbol: string;
    protected rawTranslated: any;

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    constructor(linkSymbol?: string, locale?: LanguageLocale) {
        super();
        
        this.locale = locale;
        this.observer = new Subject();
        this.linkSymbol = !_.isNil(linkSymbol) ? linkSymbol : LanguageTranslator.DEFAULT_LINK_SYMBOL;
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitLocaleProperties(): void { }

    protected getUniqueKey<T>(key: string, params?: T): string {
        return !_.isNil(params) ? `${key}_${JSON.stringify(ObjectUtil.sortKeys(params))}` : key;
    }

    protected validate<T>(key: string, params?: T): string {
        let text = null;
        let type = null;
        if (_.isNil(this.locale)) {
            text = `${key} (locale is undefined)`;
            type = LanguageTranslatorEvent.LOCALE_UNDEFINED;
        } else if (_.isNil(key)) {
            text = `Key is undefined`;
            type = LanguageTranslatorEvent.KEY_UNDEFINED;
        } else if (!_.isString(key)) {
            text = `Key must be string`;
            type = LanguageTranslatorEvent.KEY_INVALID;
        }

        if (!_.isNil(text)) {
            this.observer.next(new ObservableData(type, null, new ExtendedError(text, null, { key, params })));
        }

        return text;
    }

    protected translateLinks<T>(item: T, path?: string): T {
        for (let [key, value] of Object.entries(item)) {
            let rootKey = !_.isNil(path) ? `${path}.${key}` : key;
            if (this.isLink(rootKey)) {
                item[key] = this.translate(rootKey);
                continue;
            }
            if (_.isObject(value)) {
                this.translateLinks(value, rootKey);
                continue;
            }
            if (_.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                    let linkKey = this.getLinkKey(value[i]);
                    if (!_.isNil(linkKey)) {
                        value.splice(i, 1, this.translate(linkKey));
                    }
                }
            }
        }
        return item;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public translate<T>(key: string, params?: T): string {
        let text = this.validate(key, params);
        if (!_.isNil(text)) {
            return text;
        }

        let uniqueKey = this.getUniqueKey(key, params);
        text = this.locale.getFromHistory(uniqueKey);
        if (!_.isNil(text)) {
            return text;
        }

        if (this.isHasTranslation(key)) {
            text = this.locale.translate(key, params);
            let link = this.getLinkKey(text);
            if (!_.isNil(link)) {
                return this.translate(link, params);
            }
        } else {
            text = key;
            this.observer.next(new ObservableData(LanguageTranslatorEvent.KEY_NOT_FOUND, null, new ExtendedError(text, null, { key, params })));
        }
        this.locale.addToHistory(uniqueKey, text);
        return text;
    }

    public compile<T>(key: string, params?: T): string {
        let text = this.validate(key, params);
        return !_.isNil(text) ? text : this.locale.compile(key, params);
    }

    public isHasTranslation(key: string, isOnlyIfNotEmpty?: boolean): boolean {
        return !_.isNil(this.locale) ? this.locale.isHasTranslation(key, isOnlyIfNotEmpty) : false;
    }

    public getRawTranslated<T = any>(): T {
        if (_.isNil(this.rawTranslated)) {
            this.rawTranslated = this.translateLinks(_.cloneDeep(this.getRawTranslation()));
        }
        return this.rawTranslated;
    }

    public getRawTranslation<T = any>(): T {
        return this.locale.rawTranslation;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.locale = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Link Methods
    //
    // --------------------------------------------------------------------------

    public getLinkKey(item: string): string {
        if (!_.isString(item) || _.isNil(this.linkSymbol) || item.indexOf(this.linkSymbol) !== 0) {
            return null;
        }
        return item.substr(1).trim();
    }

    public isLink(key: string): boolean {
        return !_.isNil(this.getLinkKey(_.get(this.getRawTranslation(), key)));
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get locale(): LanguageLocale {
        return this._locale;
    }
    public set locale(value: LanguageLocale) {
        if (value === this._locale) {
            return;
        }
        this._locale = value;
        this.rawTranslated = null;
        if (!_.isNil(value)) {
            this.commitLocaleProperties();
        }
    }

    public get events(): Observable<ObservableData<LanguageTranslatorEvent, ExtendedError>> {
        return this.observer.asObservable();
    }
}
