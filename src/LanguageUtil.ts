import * as _ from 'lodash';

export class LanguageUtil {
    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private static isSimple(item: any): item is string {
        return _.isString(item) || _.isNumber(item);
    }

    private static addDotIfNeed(item: string): string {
        if (_.isEmpty(item)) {
            return item;
        }
        let last = _.last(item);
        if (last === '.' || last === '!' || last === '?') {
            return item;
        }
        return `${item}.`;
    }

    private static addItems(items: Array<string>, item: any, options?: ILanguageTranslationOptions): Array<string> {
        if (_.isNil(item)) {
            return items;
        }
        let entries = Object.entries(item);
        if (_.isEmpty(entries)) {
            return items;
        }
        if (_.isNil(options)) {
            options = {};
        }
        for (let [key, value] of entries) {
            if (!_.isEmpty(options.exclude) && options.exclude.includes(key)) {
                continue;
            }
            if (LanguageUtil.isSimple(value)) {
                items.push(options.isAddDot ? LanguageUtil.addDotIfNeed(value) : value);
                continue;
            }
            if (options.isDeep && _.isObject(value)) {
                LanguageUtil.addItems(items, value, options);
                continue;
            }
            if (_.isArray(value)) {
                if (options.isAddDot) {
                    items.push(...value.map(item => LanguageUtil.addDotIfNeed(item)));
                }
                else {
                    items.push(...value);
                }
                continue;
            }
        }
        return items;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public static getByPaths<T>(raw: T, paths: Array<string>, options?: ILanguageTranslationOptions): Array<string> {
        let items = new Array();
        for (let path of paths) {
            LanguageUtil.addItems(items, !_.isEmpty(path) ? _.get(raw, path) : raw, options);
        }
        return items;
    }

    public static getByPath<T>(raw: T, path: string, options?: ILanguageTranslationOptions): Array<string> {
        return LanguageUtil.addItems(new Array(), !_.isEmpty(path) ? _.get(raw, path) : raw, options);
    }
}

export interface ILanguageTranslationOptions {
    isDeep?: boolean;
    isAddDot?: boolean;
    exclude?: Array<string>;
}