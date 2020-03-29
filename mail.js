jQuery(document).ready(function($){
	var defaultTextSubmit = 'Спасибо, ваше сообщение отправлено!';
	var defaultTextErr = 'Ой, что-то пошло не так!';
	var defaultTextWait = 'ожидайте..';
	$('form').each(function(){
		if($(this).attr('action') === undefined){
			$(this).attr('action','mail.php');
			var titlePage = '<input type="hidden" class="exclude" name="Страница" value="'+location.href+'">';
			$(this).prepend('<input type="hidden" class="exclude" name="Форма" value="'+$(this).data('name')+'">'+titlePage);
			$(this).find('input, textarea').not('input[type="submit"]').each(function(){
				if(!$(this).attr('name')){
					$(this).attr('name',$(this).data('name'))
				}
			});
		}
		var wFormDone = $(this).next();
		if($(wFormDone).hasClass('w-form-done') && $(wFormDone).html().indexOf('Thank you! Your submission has been received!') > 0){
			$(wFormDone).children().html(defaultTextSubmit);
		}
		var wFormFail = $(this).next().next();
		if($(wFormFail).hasClass('w-form-fail') && $(wFormFail).html().indexOf('Oops! Something went wrong while submitting the form.') > 0){
			$(wFormFail).children().html(defaultTextErr);
		}
		var pleaseWait = $(this).children('[type="submit"]');
		if($(pleaseWait).hasClass('w-button') && $(pleaseWait).data('wait').trim() === 'Please wait...'){
			$(pleaseWait).attr('data-wait',defaultTextWait);
		}
	});
	
	$('form[action="mail.php"]').submit(function(e){
		e.preventDefault();
		$(this).find('input[type="checkbox"]').each(function(){
			if(!$(this).is(':checked')){
				$(this).after('<input type="hidden" class="exclude" name="'+$(this).attr('name')+'" value="off">');
			}
		});
		var radioButton = 0;
		$(this).find('input[type="radio"]').each(function(){
			if($(this).is(':checked')){
				radioButton++;
			}
		});
		if(radioButton === 0){
			$(this).find('input[type="radio"]').last().after('<input type="hidden" class="exclude" name="'+$(this).attr('name')+'" value="-">');
		}
		$(this).find('input,textarea').each(function(){
			if($(this).val() === ''){
				$(this).val('-');
			}
		});
		var form = $(this);
		var str = $(this).serialize();
		var butSubmit = $(form).find('[type="submit"]');
		var defaultTextButton = $(butSubmit).val();
		
		frName = $(form).attr('data-name');
		if(!frName || frName.length < 1){
			frName = $(form).attr('name');
		}
		
		var fields = [];
		
		$(form).find('input[type="radio"]').addClass('rdUnInp');
		
		$(form).find('input[type="checkbox"]').addClass('chUnInp');
		
		$(form).find('input,textarea,select').each(function(){
			if(($(this).attr('type') != 'tel') && ($(this).attr('type') != 'email') && ($(this).attr('type') != 'submit') && (!$(this).hasClass('exclude'))){
				if($(this).hasClass('rdUnInp') || $(this).hasClass('chUnInp')){
					if($(this)[0].checked === true){
						fields.push($(this).attr('name')+': '+$(this).val()+'<br>');
					}
				}else{
					fields.push($(this).attr('name')+': '+$(this).val()+'<br>');
				}
			}
		});
		
		$(butSubmit).val($(butSubmit).data('wait'));
		$.ajax({
			type: "POST",
			url: "mail.php",
			data: str,
			success: function(msg) {
				if(msg == 'ok') {
					$(form).next().next('.w-form-fail').hide();
					$(form).next('.w-form-done').show();
					$(form).hide();
					$(':input',form).not(':button, :submit, :reset, :hidden').val('');
					$.ajax({
						type: "POST",
						url: "google.php",
						data: str,
						success: function(msg) {
							//console.log('google result: '+msg);
						}
					});
					
					$.ajax({
						type: "POST",
						url: "bitrix.php",
						data: {
							phone: $(form).find('input[type="tel"]').val(),
							formname: frName,
							email: $(form).find('input[type="email"]').val(),
							url: location.href,
							comment: fields
						},
						success: function(msg) {
							//console.log('bitrix result: '+msg);
						}
					});
				}
				else {
					$(butSubmit).val(defaultTextButton);
					$(form).next().next('.w-form-fail').show();
				}
			}
		});
		return false;
	});
});