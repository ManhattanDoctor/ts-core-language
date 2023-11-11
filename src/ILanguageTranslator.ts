import { IDestroyable } from '@ts-core/common';
import { ExtendedError, ObservableData } from '@ts-core/common';
import { Observable } from 'rxjs';
import { LanguageLocale } from './LanguageLocale';

export interface ILanguageTranslator extends IDestroyable {
    compile<T = any>(key: string, params?: T): string;
    translate<T = any>(key: string, params?: T): string;
    isHasTranslation(key: string, isOnlyIfNotEmpty?: boolean): boolean;
    locale: LanguageLocale;
    readonly events: Observable<ObservableData<LanguageTranslatorEvent, ExtendedError>>;
}

export enum LanguageTranslatorEvent {
    KEY_INVALID = 'KEY_INVALID',
    KEY_UNDEFINED = 'KEY_UNDEFINED',
    KEY_NOT_FOUND = 'KEY_NOT_FOUND',
    LOCALE_UNDEFINED = 'LOCALE_UNDEFINED'
}
