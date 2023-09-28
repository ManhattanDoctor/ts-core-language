import { IDestroyable } from '@ts-core/common';
import { ExtendedError, ObservableData } from '@ts-core/common';
import { Observable } from 'rxjs';
import { LanguageLocale } from './LanguageLocale';

export interface ILanguageTranslator extends IDestroyable {
    compile(item: ILanguageTranslatorItem): string;
    translate(item: ILanguageTranslatorItem): string;
    isHasTranslation(key: string, isOnlyIfNotEmpty?: boolean): boolean;
    locale: LanguageLocale;
    readonly events: Observable<ObservableData<LanguageTranslatorEvent, ExtendedError>>;
}
export interface ILanguageTranslatorItem<T = any> {
    key?: string;
    params?: T;
}

export enum LanguageTranslatorEvent {
    KEY_INVALID = 'KEY_INVALID',
    KEY_UNDEFINED = 'KEY_UNDEFINED',
    KEY_NOT_FOUND = 'KEY_NOT_FOUND',
    LOCALE_UNDEFINED = 'LOCALE_UNDEFINED'
}
