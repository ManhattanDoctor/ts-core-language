import { Destroyable } from '@ts-core/common';
import { ILanguageLoader } from '../ILanguageLoader';
import axios from 'axios';
import * as _ from 'lodash';

export class LanguageUrlLoader<T = any> extends Destroyable implements ILanguageLoader<T> {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    public url: string;
    private _translation: T;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(url: string) {
        super();
        this.url = url;
    }
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async load(locale: string): Promise<T> {
        this._translation = await axios.get(`${this.url}${locale}`);
        return this.translation;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this._translation = null;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get translation(): T {
        return this._translation;
    }
}
