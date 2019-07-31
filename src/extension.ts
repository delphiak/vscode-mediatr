import * as vsc from 'vscode';
import { HandlerImplementationProvider } from './providers/handlerImplementationProvider';
import { ExtensionConfigProvider } from './config/extensionConfig';

export class Extension {

	private configProvider = new ExtensionConfigProvider();
	private handlerImplementationProvider = new HandlerImplementationProvider(this.configProvider);

	public activate(context: vsc.ExtensionContext) {
		const subscriptions = this.getSubscriptions();
		context.subscriptions.push.apply(context.subscriptions, subscriptions);
	}

	public deactivate(context: vsc.ExtensionContext) {
		// nothing to do here, yet
	}

	private getSubscriptions() {
		return [
			vsc.languages.registerImplementationProvider('csharp', this.handlerImplementationProvider)
		];
	}

}