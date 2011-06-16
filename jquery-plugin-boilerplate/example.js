$(document).ready(function() {

	// attach the plugin to an element
	$('#element').pluginName({
		'foo': 'bar'
	});

	// call a public method
	$('#element').data('pluginName').foo_public_method();

	// get the value of a property
	$('#element').data('pluginName').settings.foo;

});