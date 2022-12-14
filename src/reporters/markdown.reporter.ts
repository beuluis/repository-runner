import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { Liquid } from 'liquidjs';
import type { Reporter, RepositoryReport } from '../shared/repositoryRunner';

export class MarkdownReporter implements Reporter {
    private readonly outputDirectory: string;

    private readonly filename: string;

    public constructor(outputDirectory: string, filename = 'report') {
        this.outputDirectory = outputDirectory;
        this.filename = filename;
    }

    public async report(repositoryReports: RepositoryReport[]): Promise<void> {
        // Use liquid to handle all the templating
        const engine = new Liquid({
            root: resolve(__dirname, '..', '..', 'templates', 'markdown', 'views'),
            extname: '.liquid',
            jsTruthy: true,
        });

        const fileContent = await engine.renderFile('report', { repositoryReports });

        // Write the resulting file
        await writeFile(resolve(this.outputDirectory, `${this.filename}.md`), fileContent, 'utf8');
    }
}
