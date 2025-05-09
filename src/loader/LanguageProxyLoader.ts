import { ILanguageLoader } from '../loader';
import { LanguageLoader } from './LanguageLoader';
import * as _ from 'lodash';

export class LanguageProxyLoader<T = any> extends LanguageLoader implements ILanguageLoader<T> {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    public loadFunction: LanguageLoadFunction<T>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(loadFunction?: LanguageLoadFunction<T>) {
        super();
        this.loadFunction = loadFunction;
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async loadLocale(locale: string): Promise<T> {
        return this.loadFunction(locale);
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
        this.loadFunction = null;
    }
}

export type LanguageLoadFunction<T> = (locale: string) => Promise<T>; 
