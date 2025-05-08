import { LanguageProxyLoader } from './LanguageProxyLoader';
import axios from 'axios';
import * as _ from 'lodash';

export class LanguageUrlLoader<T = any> extends LanguageProxyLoader<T> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(url: string) {
        super((locale: string) => axios.get(`${url}${locale}`));
    }
}
