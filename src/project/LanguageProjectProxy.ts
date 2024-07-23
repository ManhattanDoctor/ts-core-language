
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
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public translate(key: string, params?: any, locale?: string): string {
        return this.projects.translate(key, params, this.name, locale);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.projects = null;
    }
}

