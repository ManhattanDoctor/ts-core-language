export interface ILanguageLoader<T> {
    load(locale: string): Promise<T>;
    readonly translation: T;
}
