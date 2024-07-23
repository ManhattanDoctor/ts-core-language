import { IDestroyable, ExtendedError, ObservableData } from '@ts-core/common';
import { LanguageTranslatorEvent } from './LanguageTranslatorEvent';
import { LanguageLocale } from '../LanguageLocale';
import { Observable } from 'rxjs';

export interface ILanguageLocaleTranslator extends IDestroyable {
    compile<T = any>(key: string, params?: T): string;
    translate<T = any>(key: string, params?: T): string;
    getRawTranslated<T = any>(): T;
    getRawTranslation<T = any>(): T;
    isHasTranslation(key: string, isOnlyIfNotEmpty?: boolean): boolean;

    locale: LanguageLocale;
    readonly events: Observable<ObservableData<LanguageTranslatorEvent, ExtendedError>>;
}