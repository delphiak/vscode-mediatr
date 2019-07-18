// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const fs = require('fs').promises;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mediatr-navigator" is now active!');



	const disposable = vscode.languages.registerImplementationProvider('csharp', {		
		async provideImplementation(document, position) {
			const locations: vscode.Location[] = [];
			const queryItem = getQueryItem(document, position);
			const config = vscode.workspace.getConfiguration("mediatr");
			const triggerRegex = new RegExp(config.goToImplementationTrigger);

			if (triggerRegex.test(queryItem)) {
				var files = await vscode.workspace.findFiles("**/*.cs");
				
				for (const fileUri of files) {
					var location = await getLocation(queryItem, fileUri);
					if (location) {
						locations.push(location);
					}
				}				
			}

			return locations;
		}
	});

	context.subscriptions.push(disposable);
}

function getQueryItem(document: vscode.TextDocument, position: vscode.Position) {
	const range = document.getWordRangeAtPosition(position);
	return document.getText(range);
}

async function getContent(fileUri: vscode.Uri) {
	const res = await fs.readFile(fileUri.path);
	const buffer = new Buffer(res);
	return buffer.toString();
}

export async function getLocation(item: string, fileUri: vscode.Uri) {
	const content = await getContent(fileUri);
	const implementationLine = getImplementationLine(item, content);
	if (implementationLine) {
		const position = new vscode.Position(implementationLine, 0);
		return new vscode.Location(fileUri, position);	
	} else {
		return null;
	}
}

export function getImplementationLine(item: string, content: string) {
	const basicRegex = "Handle\\s*\\(\\s*";
	const handleRegex = new RegExp(basicRegex + item, "gm");
	const match = handleRegex.exec(content);
	if (match) {
		const until = content.substr(0, match.index);
		const linesMatch = until.match(/\n/gi);
		return linesMatch ? linesMatch.length : null;
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
