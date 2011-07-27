(function () {
	var Toastbread = {
		SHUFFLE_ON: true, 
		SHUFFLE_OFF: false,
		
		REPEAT_ONE: 2, 
		REPEAT_ALL: 1, 
		REPEAT_OFF: 0,
		
		eventCallbacks: {
			"setVolume": [],
			"setShuffle": [],
			"setRepeat": []
		},
	
		hijack: function (namespace, methods) {
			var that = this;
			_.forEach(methods, function (method) {
				window.GS[namespace]["tb_"+method.name] = window.GS[namespace][method.name];
				
				window.GS[namespace][method.name] = function() {
					var args = Array.prototype.slice.call(arguments);
					var processedArgs = args;
					var callbackName = method.callbacks || method.name;
					
					if (that.eventCallbacks[callbackName].length) {
						_.forEach(that.eventCallbacks[callbackName], function (callback) {
							callback.apply(callback, processedArgs);
						});
					}
					
					return window.GS[namespace]["tb_"+method.name].apply(window.GS[namespace]["tb_"+method.name], args);
				}
			});
		},
		init: function() {	
			var that = this;
			console.log('Toastbread loaded');
			
			this.Queue.init();

			this.hijack("player", [
				{"name": "setVolume", "callbacks": "setVolume"},
				{"name": "setShuffle", "callbacks": "setShuffle"},
				{"name": "setRepeat", "callbacks": "setRepeat"}
			]);
		},
		
		addEventListener: function(event, callback) {
			this.eventCallbacks[event].push(callback);
		},
		
		play: function() {
			//if (GS.player && GS.player.queue && GS.player.queue.activeSong)GS.player.isPaused?GS.player.resumeSong(): GS.player.playSong(GS.player.queue.activeSong.queueSongID)
		},
		pause: function() {
		
		},
		next: function() {
		
		},
		previous: function() {
		
		},

		setShuffle: function(shuffle) {
			window.GS.player.tb_setShuffle(shuffle);
		},
		onSetShuffle: function(callback) {
			this.eventCallbacks["setShuffle"].push(callback);
		},
		getShuffle: function() {
			return window.GS.player.getShuffle();
		},
		
		setRepeat: function(repeat) {
			window.GS.player.tb_setRepeat(repeat);
		},
		onSetRepeat: function(callback) {
			this.eventCallbacks["setRepeat"].push(callback);
		},
		getRepeat: function() {
			return window.GS.player.getRepeat();
		},
		
		setVolume: function(volume) {
			window.GS.player.tb_setVolume(volume);
		},
		onSetVolume: function(callback) {
			this.eventCallbacks["setVolume"].push(callback);
		},
		getVolume: function() {
			return window.GS.player.getVolume();
		},
		
		Queue: {
			POSITION_FIRST: 'tb_queue_position_first',
			POSITION_LAST: 'tb_queue_position_last', 
			POSITION_RANDOM: 'tb_queue_position_random',
			
			onAddSongCallbacks: [],
			currentPosition: 0,
			
			init: function() {
				var that = this;
				
				window.GS.player.tb_addSongsToQueueAt = window.GS.player.addSongsToQueueAt;
				window.GS.player.addSongsToQueueAt = function(songs, index, playOnAdd, h) {
					var result;
					
					console.log(songs);
					console.log(index);
					console.log(playOnAdd);

					result = window.GS.player.tb_addSongsToQueueAt(songs, index, playOnAdd, h);
					console.log(window.GS.player.queue);
					console.log(window.GS.player.getCurrentQueue());
					return result;
				}
			},
			addSong: function(song_id, position) {
				if (position == null) {
					position = this.POSITION_LAST;
				}
			},
			onAddSong: function(callback) {
				this.onAddSongCallbacks.push(callback);
			},
			
			getCurrentPosition: function() {
				return this.currentPosition;
			},
			
			clear: function() {
			
			}
		}
	}
	
	window.Toastbread = Toastbread;
	Toastbread.init();
})();

// javascript:void((a = (b=document).createElement('script')).src='http://localhost:8888/toastbread/toastbread.js',b.body.appendChild(a))
