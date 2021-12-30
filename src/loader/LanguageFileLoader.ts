import { Destroyable } from '@ts-core/common';
import { ExtendedError } from '@ts-core/common/error';
import { PromiseReflector } from '@ts-core/common/promise';
import { CloneUtil } from '@ts-core/common/util';
import { ILanguageLoader } from '../ILanguageLoader';
import axios from 'axios';
import * as _ from 'lodash';

export class LanguageFileLoader<T = any> extends Destroyable implements ILanguageLoader<T> {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    public url: string;
    public prefixes: Array<string>;

    private _translation: T;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(url: string, prefixes?: Array<string>) {
        super();
        this.url = url;
        this.prefixes = !_.isEmpty(prefixes) ? prefixes : ['.json', 'Custom.json'];
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async load(locale: string): Promise<T> {
        let files = this.prefixes.map(item => PromiseReflector.create(axios.get(this.url + locale + item)));
        let items = await Promise.all(files);

        items = items.filter(item => item.isComplete);
        if (_.isEmpty(items)) {
            throw new ExtendedError(`Unable to load "${locale}" locale`);
        }

        this._translation = {} as any;
        items.forEach(item => CloneUtil.deepExtend(this._translation, item.value.data));

        return this.translation;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.url = null;
        this.prefixes = null;
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
