import * as assert from 'assert';
import { HandlerImplementationLineLocator } from '../../providers/handlerImplementationProvider/handlerImplementationLineLocator';

suite('HandlerImplementationLineLocator Test Suite', () => {
	test('Empty content should return null', () => {
		// assert
		var query = "TestCommand";
		var content = "";

		// act
		var result = new HandlerImplementationLineLocator().getImplementationLine(query, content);

		// assert
		assert.equal(result, null);
	});

	test('Single-lined content should return first line', () => {
		// assert
		var query = "TestCommand";
		var content = "public Handle(TestCommand cmd)";

		// act
		var result = new HandlerImplementationLineLocator().getImplementationLine(query, content);

		// assert
		assert.equal(result, 0);
	});

	test('Multi-lined content should return proper line', () => {
		// assert
		var query = "TestCommand";
		var content = [
			"public SampleClass { ",
			"   public bool Handle(TestCommand cmd)",
			"   {",
			"      return true;",
			"   }",
			"}"
		].join('\n');

		// act
		var result = new HandlerImplementationLineLocator().getImplementationLine(query, content);

		// assert
		assert.equal(result, 1);
	});

	test('Should return proper line when there are many handlers in content', () => {
		// assert
		var query = "TestCommand";
		var content = [
			"public SampleClass { ",
			"   public bool Handle(UntestCommand cmd)",
			"   {",
			"      return true;",
			"   }",
			"}",
			"   public bool Handle(TestCommand cmd)",
			"   {",
			"      return true;",
			"   }",
			"}"
		].join('\n');

		// act
		var result = new HandlerImplementationLineLocator().getImplementationLine(query, content);

		// assert
		assert.equal(result, 6);
	});

	test('Should return null when there is no handler in content', () => {
		// assert
		var query = "InvalidCommand";
		var content = [
			"public SampleClass { ",
			"   public bool Handle(UntestCommand cmd)",
			"   {",
			"      return true;",
			"   }",
			"}",
			"   public bool Handle(TestCommand cmd)",
			"   {",
			"      return true;",
			"   }",
			"}"
		].join('\n');

		// act
		var result = new HandlerImplementationLineLocator().getImplementationLine(query, content);

		// assert
		assert.equal(result, null);
	});

	test('Should ignore whitespaces when locating handler', () => {
		// assert
		var query = "TestCommand";
		var content = "public Handle    ( TestCommand cmd)";

		// act
		var result = new HandlerImplementationLineLocator().getImplementationLine(query, content);

		// assert
		assert.equal(result, 0);
	});

	// test('Should ignore commented handlers', () => {
	// 	// assert
	// 	var query = "TestCommand";
	// 	var content = [
	// 		"public SampleClass { ",
	// 		"// public bool Handle(TestCommand cmd)",
	// 		"   {",
	// 		"      return true;",
	// 		"   }",
	// 		"}",
	// 		"   public bool Handle(TestCommand cmd)",
	// 		"   {",
	// 		"      return true;",
	// 		"   }",
	// 		"}"
	// 	].join('\n');

	// 	// act
	// 	var result = new HandlerImplementationLineLocator().getImplementationLine(query, content);

	// 	// assert
	// 	assert.equal(result, 6);
	// });
});
