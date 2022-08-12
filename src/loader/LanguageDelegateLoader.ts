import { ILanguageLoader } from '../ILanguageLoader';
import { LanguageLoader } from './LanguageLoader';
import * as _ from 'lodash';

export class LanguageDelegateLoader<T = any> extends LanguageLoader implements ILanguageLoader<T> {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    public delegate: LanguageDelegateFunction<T>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(delegate?: LanguageDelegateFunction<T>) {
        super();
        this.delegate = delegate;
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async loadLocale(locale: string): Promise<T> {
        return this.delegate(locale);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.delegate = null;
    }
}

export type LanguageDelegateFunction<T> = (locale: string) => Promise<T>; 
