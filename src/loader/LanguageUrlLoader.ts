import { LanguageDelegateLoader } from './LanguageDelegateLoader';
import axios from 'axios';
import * as _ from 'lodash';

export class LanguageUrlLoader<T = any> extends LanguageDelegateLoader<T> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(url: string) {
        super((locale: string) => axios.get(`${url}${locale}`));
    }
}
