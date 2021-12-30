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

    private _translation: T;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async load(url: string): Promise<T> {
        this._translation = await axios.get(url);
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
