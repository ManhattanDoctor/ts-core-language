import { LanguageLoader } from "./LanguageLoader";

export class LanguagePreloadLoader<T = any> extends LanguageLoader {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    public locale: string;
    public locales: Map<string, T>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(locales: Map<string, T>) {
        super();
        this.locales = locales;
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async loadLocale(locale: string): Promise<T> {
        return this.locales.get(locale);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    
    public async load(locale: string): Promise<T> {
        this.locale = locale;
        return super.load(locale);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.locale = null;
        this.locales = null;
    }
}

