import { DestroyableContainer } from '@ts-core/common';
import { ExtendedError } from '@ts-core/common/error';
import { ObservableData } from '@ts-core/common/observer';
import { ObjectUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { ILanguageTranslator, LanguageTranslatorEvent, ILanguageTranslatorItem } from '../ILanguageTranslator';
import { LanguageLocale } from '../LanguageLocale';

export class LanguageTranslator extends DestroyableContainer implements ILanguageTranslator {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _locale: LanguageLocale;

    protected linkSymbol: string;
    protected observer: Subject<ObservableData<LanguageTranslatorEvent, ExtendedError>>;

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    constructor(linkSymbol?: string) {
        super();
        this.observer = new Subject();
        this.linkSymbol = !_.isNil(linkSymbol) ? linkSymbol : '⇛';
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitLocaleProperties(): void {}

    protected getLink(text: string): string {
        if (_.isNil(text) || _.isNil(this.linkSymbol) || text.indexOf(this.linkSymbol) !== 0) {
            return null;
        }
        return text.substr(1).trim();
    }

    protected getUniqueKey(item: ILanguageTranslatorItem): string {
        return !_.isNil(item.params) ? `${item.key}_${JSON.stringify(ObjectUtil.sortKeys(item.params))}` : item.key;
    }

    protected validate(item: ILanguageTranslatorItem): string {
        let text = null;
        let type = null;
        if (_.isNil(this.locale)) {
            text = `Locale is undefined`;
            type = LanguageTranslatorEvent.LOCALE_UNDEFINED;
        } else if (_.isNil(item.key)) {
            text = `Key is undefined`;
            type = LanguageTranslatorEvent.KEY_UNDEFINED;
        } else if (!_.isString(item.key)) {
            text = `Key must be string`;
            type = LanguageTranslatorEvent.KEY_INVALID;
        }

        if (!_.isNil(text)) {
            this.observer.next(new ObservableData(type, null, new ExtendedError(text, null, item)));
        }

        return text;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public translate(item: ILanguageTranslatorItem): string {
        let text = this.validate(item);
        if (!_.isNil(text)) {
            return text;
        }

        let uniqueKey = this.getUniqueKey(item);
        text = this.locale.getFromHistory(uniqueKey);
        if (!_.isNil(text)) {
            return text;
        }

        let { key, params } = item;
        if (this.isHasTranslation(key)) {
            text = this.locale.translate(key, params);
            let link = this.getLink(text);
            if (!_.isNil(link)) {
                return this.translate({ key: link, params });
            }
        } else {
            text = key;
            this.observer.next(new ObservableData(LanguageTranslatorEvent.KEY_NOT_FOUND, null, new ExtendedError(text, null, item)));
        }
        this.locale.addToHistory(uniqueKey, text);
        return text;
    }

    public compile(item: ILanguageTranslatorItem): string {
        let text = this.validate(item);
        return !_.isNil(text) ? text : this.locale.compile(item.key, item.params);
    }

    public isHasTranslation(key: string, isOnlyIfNotEmpty?: boolean): boolean {
        return !_.isNil(this.locale) ? this.locale.isHasTranslation(key, isOnlyIfNotEmpty) : false;
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
        if (!_.isNil(value)) {
            this.commitLocaleProperties();
        }
    }

    public get events(): Observable<ObservableData<LanguageTranslatorEvent, ExtendedError>> {
        return this.observer.asObservable();
    }
}
