import * as vsc from 'vscode';
import * as cfg from '../config/extensionConfig';
import * as fs from 'fs';

export class HandlerImplementationProvider implements vsc.ImplementationProvider {

	constructor(
		private configProvider: cfg.ExtensionConfigProvider
	) { }

	get config() { return this.configProvider.get(); }

	public async provideImplementation(document: vsc.TextDocument, position: vsc.Position, _token: vsc.CancellationToken): Promise<vsc.Location[]> {
		const locations: vsc.Location[] = [];
		const queryItem = this.getQueryItem(document, position);
		const triggerRegex = new RegExp(this.config.handlerImplementationTrigger);

		if (triggerRegex.test(queryItem)) {
			var files = await vsc.workspace.findFiles("**/*.cs");
			
			for (const fileUri of files) {
				var location = this.getLocation(queryItem, fileUri);
				if (location) {
					locations.push(location);
				}
			}				
		}

		return locations;
	}

	private getQueryItem(document: vsc.TextDocument, position: vsc.Position) {
		const range = document.getWordRangeAtPosition(position);
		return document.getText(range);
	}
	
	private getContent(fileUri: vsc.Uri) {
		const res = fs.readFileSync(fileUri.path);
		const buffer = Buffer.from(res);
		return buffer.toString();
	}
	
	private getLocation(item: string, fileUri: vsc.Uri) {
		const content = this.getContent(fileUri);
		const implementationLine = this.getImplementationLine(item, content);
		if (implementationLine) {
			const position = new vsc.Position(implementationLine, 0);
			return new vsc.Location(fileUri, position);	
		} else {
			return null;
		}
	}
	
	private getImplementationLine(item: string, content: string) {
		const basicRegex = "Handle\\s*\\(\\s*";
		const handleRegex = new RegExp(basicRegex + item, "gm");
		const match = handleRegex.exec(content);
		if (match) {
			const until = content.substr(0, match.index);
			const linesMatch = until.match(/\n/gi);
			return linesMatch ? linesMatch.length : null;
		}
	}
}