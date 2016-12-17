$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];
  
  var options = {
  //year: 'numeric',
  //month: 'numeric',
  //day: 'numeric',
  timezone: 'UTC',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
	};

  // Initialize varibles
  var $window = $(window);
  var $usernameInput = $('.h3_main'); // Input for username
  var alertStat = $('#h3_alert');
  //$usernameInput.html('assssssss');
  //var socket = io.connect('http://85.175.227.245:8081');//Alfa
  var socket = null;
  var auth = false;
  var activeClient = true;
  var deactCounter = 0;
  //var
  
  startSocket();
  
  if (!localStorage.tdClientId)
	localStorage.tdClientId="0";
  //$.mobile.changePage('#popupDialog','pop', true, true);	
  
  setInterval(function()	{
	  if(auth&&socket)
		socket.emit('status', { cid: localStorage.tdClientId, clphone: localStorage.tdClientPhone });
  }, 30000 )
  
  setInterval(function()	{
	if(!auth)	{  
		if (!localStorage.tdClientPhone)			
			$("#phoneDialog").popup("open");
		else	{
			$("#reg_info").html('Заказ для '+localStorage.tdClientPhone);
			$("#uname").val(localStorage.tdClientPhone);
		}
		if 	(localStorage.tdClientPhone&&socket)
			socket.emit('ident', 
			  { id: localStorage.tdClientId, phone: localStorage.tdClientPhone});
	}
  }, 3000 );
  
  setInterval(function()	{
	if(deactCounter>600)	{
		closeSocket();
	}
	if(deactCounter<=600)	{
		deactCounter++;
	}
  }, 1000 );

  function closeSocket()	{
	  try	{
		socket.disconnect();//'server overload');
	  } catch(e)	{
		  console.log('error socket disconnect'); 
	  }
	  try	{
		socket.close();
	  } catch(e)	{
		  console.log('error socket close'); 
	  }
	  alertStat.html('ОТКЛЮЧЕН ОТ СЕРВЕРА, НАЖМИТЕ НА ЛЮБУЮ КНОПКУ ДЛЯ ПОДКЛЮЧЕНИЯ!');
	  socket=null;
	  //return;
  }
  
  function startSocket()	{
  
  socket = io.connect('http://85.175.219.200:8081');
  deactCounter=0;
  
  socket.on('connect', function () {
	  alertStat.html('Найден сервер!');
	  auth=false;
	  socket.on('disconnected', function () {
		    auth=false;
			alertStat.html('Связь прервана!');
		  });
	});
  
  socket.on('auth', function (data) {
	  console.log(data.client_id);
	  localStorage.tdClientId=data.client_id;
	  if(data.client_id>0)
	        auth=true;
			var date = new Date();
			alertStat.html(date.toLocaleString("ru", options)+': Связь установлена!');
			socket.emit('status', { cid: localStorage.tdClientId, clphone: localStorage.tdClientPhone });
	  });
  
	socket.on('news', function (data) {
		//console.log(data);
		if(data.dr_count<0)
			$usernameInput.hide();
		$usernameInput.html('Машин на линии - '+data.dr_count);
		socket.emit('my other event', { my: 'data' });
	});
	
	socket.on('req_decline', function (data) {
		if(data['status'].indexOf('many_new_order_req')!=-1)	{
			alert('Запрос не чаще раза в минуту!');
		}
	});
	
	socket.on('req_decline', function (data) {
		if(data['status'].indexOf('many_new_order_req')!=-1)	{
			alertStat.html('ДЕЙСТВИЕ ОТКЛОНЕНО!');
		}
	});
	
	socket.on('server overload', function (data) {
		//if(data['status'].indexOf('many_new_order_req')!=-1)	{
			alertStat.html('СЕРВИС ПЕРЕГРУЖЕН, ПОДОЖДИТЕ И НАЖМИТЕ НА ЛЮБУЮ КНОПКУ ДЛЯ ПОДКЛЮЧЕНИЯ!');
		//}
	});
	
	socket.on('clstat', function (data) {
		try
		{
			csjson = JSON.parse(data.cl_status);
			ords_dt = '';
			for (var i = 0; i < csjson['ocn']; i++) {
				ords_dt = ords_dt + '<hr/>'+(i+1)+'. '+csjson['odt'+i];
				if(csjson['ors'+i]==0)
					ords_dt = ords_dt + ', принят'
				if(csjson['ors'+i]==8)
					ords_dt = ords_dt + ', назначен'
				if(csjson['opl'+i]==1&&csjson['ors'+i]==8)
					ords_dt = ords_dt + ', ожидает выходите'
				if(csjson['ors'+i]==26)
					ords_dt = ords_dt + ', дан отчет '+csjson['osumm'+i]
				if(csjson['tmh'+i].length>0&&csjson['ors'+i]==8)
					ords_dt = ords_dt + ', на выполнении (таксометр активен)'
			}
			var date = new Date();
			alertStat.html('(Обновлен в '+date.toLocaleString("ru", options)+')<br/> У вас Заказов всего '+csjson['ocn']+ords_dt);

		}
		catch (e)
		{
			console.log(e.name+'---'+e.message);
			alertStat.html('ОШИБКА ОТВЕТА СЕРВЕРА ТАКСИ!');
		}
		$.mobile.loading( "hide" );
		
	});
	
   }
	
   $('#enter-start-adr').click(function () {
	   //alert('ddggd');
	deactCounter=0;
    $('#enter-stadr-menu').html('Указать адрес ('+
		$('#start-adr-entered').val()+')');
		//alert('ddd');
		$("#popupDialog").popup("close");
		//$("#popupDialog").hide();
	});
	
	$('#enter-end-adr').click(function () {
	   //alert('ddggd');
	deactCounter=0;
    $('#enter-end-menu').html('Указать адрес ('+
		$('#end-adr-entered').val()+')');
		//alert('ddd');
		$("#endAdrDialog").popup("close");
		//$("#popupDialog").hide();
	});
	
	$('#enter-reg-phone').click(function () {
		deactCounter=0;
		if($('#reg-phone-entered').val().length==10)
		localStorage.tdClientPhone = 
			$('#reg-phone-entered').val();
		$("#phoneDialog").popup("close");
		if($('#reg-phone-entered').val().length!=10)
			alert('Длина телефона должна быть 10 цифр! Пример 9001234567.');
	});
	
	$('#send-order').click(function () {
		if(socket)	{
		deactCounter=0;
		socket.emit('new order', 
			{ stadr: $('#start-adr-entered').val(), 
			enadr:$('#end-adr-entered').val(),
			id: localStorage.tdClientId, phone: localStorage.tdClientPhone  });
		}	else	{
			startSocket();
		}
		
	});
	
	$('#cancel-order').click(function () {
		if(socket)	{
		deactCounter=0;
		socket.emit('cancel order', 
			{ id: localStorage.tdClientId, phone: localStorage.tdClientPhone  });
		}	else	{
			deactCounter=0;
			startSocket();
		}	
		
	});
	
});
