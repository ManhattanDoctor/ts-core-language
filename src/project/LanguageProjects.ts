import { Destroyable, ExtendedError } from '@ts-core/common';
import { LanguageProject } from './LanguageProject';
import * as _ from 'lodash';

export abstract class LanguageProjects extends Destroyable {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    protected projects: Map<string, LanguageProject>;
    protected defaultProject: string;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor() {
        super();
        this.projects = new Map();
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected abstract createProject(path: string, project: ILanguageProjectSettings): Promise<LanguageProject>;

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public async load(path: string, projects: Array<ILanguageProjectSettings>): Promise<void> {
        this.defaultProject = _.first(projects).name;
        for (let item of projects) {
            this.projects.set(item.name, await this.createProject(path, item));
        }
    }

    public translate(key: string, params?: any, project?: string, locale?: string): string {
        if (_.isNil(project)) {
            project = this.defaultProject;
        }
        let item = this.projects.get(project);
        if (_.isNil(item)) {
            throw new ExtendedError(`Unable to find "${project}" project`);
        }
        return item.translate(key, params, locale);
    }

    public getRawTranslation<T = any>(project?: string, locale?: string): Promise<T> {
        if (_.isNil(project)) {
            project = this.defaultProject;
        }
        let item = this.projects.get(project);
        if (_.isNil(item)) {
            throw new ExtendedError(`Unable to find "${project}" project`);
        }
        return item.getRawTranslation(locale);
    }

    public getRawTranslated<T = any>(project?: string, locale?: string): T {
        if (_.isNil(project)) {
            project = this.defaultProject;
        }
        let item = this.projects.get(project);
        if (_.isNil(item)) {
            throw new ExtendedError(`Unable to find "${project}" project`);
        }
        return item.getRawTranslated(locale);
    }
}

export interface ILanguageProjectSettings {
    name: string;
    locales: Array<string>;
    prefixes: Array<string>
}
