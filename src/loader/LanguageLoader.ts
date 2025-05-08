import { Destroyable } from '@ts-core/common';
import { ILanguageLoader } from './ILanguageLoader';
import * as _ from 'lodash';

export abstract class LanguageLoader<T = any> extends Destroyable implements ILanguageLoader<T> {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    public locale: string;
    public translation: T;

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected abstract loadLocale(locale: string): Promise<T>;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async load(locale: string): Promise<T> {
        this.translation = await this.loadLocale(locale);
        this.locale = locale;
        return this.translation;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.locale = null;
        this.translation = null;
    }
}
