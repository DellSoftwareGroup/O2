/**
 * Created by jleon on 7/31/2015.
 */
$(function () {

	// detect browser properties using bower plugin: https://github.com/ded/bowser

	if (bowser !== null) {
		if (bowser.name === "Chrome" || (bowser.name === "Internet Explorer" &&  bowser.version === "9.0") ) {
			return true;
		} else {
			$('.browser-warning').show();
		}
	}

	//remove alert
	$('body').on('click', '.icon-ui-closecircle', function () {
		$('.alert').remove();
	})

});
