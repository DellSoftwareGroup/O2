
var templateLoader = (function($,host){

	return{
		loadExtTemplate: function(path, target){

			var tmplLoader = $.get(path)
					.success(function(result){

						if(target === undefined || target === ''){
							$(".wrapper").append(result);
						}else {
							$(target).html(result);
						}

					})
					.error(function(result){
						alert("Error Loading Templates -- TODO: Better Error Handling");
					})
			tmplLoader.complete(function(){

				$(host).trigger("TEMPLATE_LOADED", [path]);
			});
		}
	};
})(jQuery, document);