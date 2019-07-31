import * as vsc from 'vscode';

export interface IExtensionConfig {
	handlerImplementationTrigger: string;
}

export class ExtensionConfigProvider {

	public get() {
		var cfg: any = vsc.workspace.getConfiguration("mediatr");
		return <IExtensionConfig>cfg;
	}

}