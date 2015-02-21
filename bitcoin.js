// Here is a utility function.
	 function findANDsort(items, symbols){
	 	var processedData = []
	 	try{
	 		items = JSON.parse(items);
	 		symbols.forEach(function(symbol){
	 			if(items[symbol]){
	 				var item = {'symbol': items[symbol].display_name,'bid':items[symbol].rates.bid,
	 				'ask':items[symbol].rates.ask,'high':items[symbol].rates.last, 'low':items[symbol].rates.bid};
	 				processedData.push(item);
	 			}
	 		});
	 		return processedData;
	 	}
	 	catch(e){
	 		console.log('This is the inner try catch block :' + e);
	 		return [];
	 	};
	 }
// Here is the service
	 function exchangeService(resolve, reject) {
	 	var xhr = new XMLHttpRequest();
	 	xhr.open('get', 'https://api.bitcoinaverage.com/exchanges/USD');
				// xhr.onreadystatechange = handler; refactor here ..
				xhr.send();
				xhr.addEventListener('load',
					function () {
						if (this.status == 200) {
							resolve(this.response);
						}
						else if (this.status == 403) {
							reject('error: Unauthorized');
						}
						else if (this.status == 404) {
							reject('error: Not Found');
						}
						else if (this.status == 500) {
							reject('error: Internal Server Error');
						}
						else {
							reject('error: Unknown');
						}
					});
				xhr.addEventListener('error',
					function () {
						reject('error');

					});
			}
// Here is the controller.
			function exchangeController(uitems){

				var pstats = new Promise(exchangeService);
				pstats.then(function (result) {
					// ['bitstamp','btce','bitfinex','bitex','coinmate','itbit','hitbtc','campbx'] is hardcoded for now.
					var processedData = findANDsort(result,['bitstamp','btce','bitfinex','bitex','coinmate','itbit','hitbtc','campbx']);
					uitems.forEach(function(uitem, index){
						var green = 'linear-gradient(to right, #eeeeee, #009977, #eeeeee)';
						var orange = 'linear-gradient(to right, #eeeeee, #ff9900, #eeeeee)';
						var blue = 'linear-gradient(to right, #0099ff, #eeeeee, #0099ff)';
						var item = processedData[index];
						if(item != undefined){
							(uitem.getElementsByClassName("market"))[0].innerHTML = item.symbol;
							(uitem.getElementsByClassName("buy"))[0].innerHTML = item.bid;
							(uitem.getElementsByClassName("sell"))[0].innerHTML = item.ask;
							(uitem.getElementsByClassName("high"))[0].innerHTML = item.high;
							(uitem.getElementsByClassName("low"))[0].innerHTML = item.low;
							if(cookie == null || cookie == undefined){
									 cookie = JSON.stringify(processedData);
							}
							else{
								try{
							  cookie = eval(cookie);
								// cookie = findANDsort(cookie, ['bitstamp','btce','bitfinex','bitex','coinmate','itbit','hitbtc','campbx']);
								if(index < cookie.length){
									var itembc = '(uitem.getElementsByClassName("buy"))[0].style.background = (cookie[index].bid < item.bid? green : (cookie[index].bid > item.bid?orange : blue))';
									eval(itembc);
									eval(itembc.replace('buy','sell'));
									eval(itembc.replace('buy','high'));
									eval(itembc.replace('buy','low'));
									setTimeout(function(){
										var itembc  = '(uitem.getElementsByClassName("buy"))[0].style.background = blue';
										eval(itembc);
										eval(itembc.replace('buy','sell'));
										eval(itembc.replace('buy','high'));
										eval(itembc.replace('buy','low'));
									},500);
								}
							} catch(e){ console.log('This is the outer try catch block :' + e)}
						}
					}
				});
	}, function (reason) {
		for(var i = 0; i < data.length; i++){
			data[i].innerHTML = reason;
			data[i].style.background = 'linear-gradient(to right, #eeeeee, #ff9900, #eeeeee)';
		}
		console.log('the reason is:' + reason);
		setTimeout(function(){
			for(var i = 0; i < data.length; i++){
				data[i].style.background = 'linear-gradient(to right, #0099ff, #eeeeee, #0099ff)';
			}
		},500);
	});
	}
// Here is the program entry point.
	HTMLCollection.prototype.forEach = Array.prototype.forEach;
	var items = document.getElementsByClassName('item');
	// A fake cookie for now, Chrome doesn't allow cookies for local files.
	var cookie = null;
	exchangeController(items);
	setInterval(function(){exchangeController(items);},60000);
