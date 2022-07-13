import { ExtendedError } from '@ts-core/common';
import * as _ from 'lodash';

export class TemplateError<U = any, V = number> extends ExtendedError<U, V> {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected template: string;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(message: string, code?: V, details?: U, isFatal?: boolean) {
        super(message, code, details, isFatal);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Message
    //
    // --------------------------------------------------------------------------

    public translate(locale?: string): void {
        if (_.isNil(this.template)) {
            return;
        }
    }
}
