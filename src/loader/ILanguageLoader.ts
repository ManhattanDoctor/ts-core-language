export interface ILanguageLoader<T> {
    load(locale: string): Promise<T>;
    
    readonly locale: string;
    readonly translation: T;
}
