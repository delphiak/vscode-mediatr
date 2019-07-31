export class HandlerImplementationLineLocator {
	
	public getImplementationLine(item: string, content: string) {
		const basicRegex = "Handle\\s*\\(\\s*";
		const handleRegex = new RegExp(basicRegex + item, "gm");
		const match = handleRegex.exec(content);
		if (match) {
			const until = content.substr(0, match.index);
			const linesMatch = until.match(/\n/gi);
			return linesMatch ? linesMatch.length : 0;
		} else {
			return null;
		}
	}

}