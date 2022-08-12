import { ExtendedError, CloneUtil, PromiseReflector } from '@ts-core/common';
import { LanguageLoader } from './LanguageLoader';
import axios from 'axios';
import * as _ from 'lodash';

export class LanguageFileLoader<T = any> extends LanguageLoader<T> {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    public url: string;
    public prefixes: Array<string>;

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
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async loadLocale(locale: string): Promise<T> {
        let files = this.prefixes.map(item => PromiseReflector.create(axios.get(this.url + locale + item)));
        let items = await Promise.all(files);

        items = items.filter(item => item.isComplete);
        if (_.isEmpty(items)) {
            throw new ExtendedError(`Unable to load "${locale}" locale`);
        }

        let item = {} as any;
        items.forEach(item => CloneUtil.deepExtend(item, item.value.data));
        return item;
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
        this.url = null;
        this.prefixes = null;
    }
}
