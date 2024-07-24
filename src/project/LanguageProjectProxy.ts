
import { Destroyable } from '@ts-core/common';
import { LanguageProjects } from './LanguageProjects';
import * as _ from 'lodash';

export class LanguageProjectProxy extends Destroyable {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    protected name: string;
    protected projects: LanguageProjects;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(name: string, projects: LanguageProjects) {
        super();
        this.name = name;
        this.projects = projects;
    }

    //--------------------------------------------------------------------------
    //
    // 	Proxy Methods
    //
    //--------------------------------------------------------------------------

    public compile<T = any>(key: string, params?: T, locale?: string): string {
        return this.projects.compile(key, params, this.name, locale);
    }

    public translate<T = any>(key: string, params?: T, locale?: string): string {
        return this.projects.translate(key, params, this.name, locale);
    }

    public isHasTranslation(key: string, isOnlyIfNotEmpty?: boolean, locale?: string): boolean {
        return this.projects.isHasTranslation(key, isOnlyIfNotEmpty, this.name, locale);
    }

    public getRawTranslation<T = any>(locale?: string): T {
        return this.projects.getRawTranslation(this.name, locale);
    }

    public getRawTranslated<T = any>(locale?: string): T {
        return this.projects.getRawTranslated(this.name, locale);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.projects = null;
    }
}

