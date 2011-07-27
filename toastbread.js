(function () {
	if (!window.console) {
		console = {
			"log": function() {},
			"error": function() {}
		}
	}

	var Toastbread = {
		SHUFFLE_ON: true, 
		SHUFFLE_OFF: false,

		MUTE_ON: true,
		MUTE_OFF: false,
		
		REPEAT_ONE: 2, 
		REPEAT_ALL: 1, 
		REPEAT_OFF: 0,
		
		eventCallbacks: {
			"setVolume": [],
			"setIsMuted": [],
			"setShuffle": [],
			"setRepeat": [],
			"next": [],
			"previous": [],
			
			"Queue_addSongs": [],
			"Queue_clear": []
		},
	
		hijack: function (namespace, methods) {
			var that = this;
			
			if (namespace == "player") {
				namespace = this.playerNS();
			} else {
				namespace = window.GS[namespace];
			}
			
			_.forEach(methods, function (method) {
				namespace["tb_"+method.name] = namespace[method.name];
				
				namespace[method.name] = function() {
					var args = Array.prototype.slice.call(arguments);
					var processedArgs = args;
					var callbackName = method.callbacks || method.name;
					
					if (method.before) {
						processedArgs = method.before.apply(method.before, processedArgs);
					}
					
					if (that.eventCallbacks[callbackName] && that.eventCallbacks[callbackName].length) {
						_.forEach(that.eventCallbacks[callbackName], function (callback) {
							callback.apply(callback, processedArgs);
						});
					}
					
					return namespace["tb_"+method.name].apply(namespace["tb_"+method.name], args);
				}
			});
		},
		playerNS: function() {
			return window.GS.player.player;
		},
		init: function() {	
			var that = this;
			console.log('Toastbread loaded');

			this.hijack("player", [
				{"name": "setVolume", "callbacks": "setVolume"},
				{"name": "setIsMuted", "callbacks": "setIsMuted"},
				{"name": "setShuffle", "callbacks": "setShuffle"},
				{"name": "setRepeat", "callbacks": "setRepeat"},
				{"name": "nextSong", "callbacks": "next"},
				{"name": "previousSong", "callbacks": "previous"}
			]);
			this.Queue.init(this);
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
			this.playerNS().tb_nextSong();
		},
		onNext: function(callback) {
			this.eventCallbacks["next"].push(callback);
		},
		
		previous: function() {
			this.playerNS().tb_previousSong();
		},
		onPrevious: function(callback) {
			this.eventCallbacks["previous"].push(callback);
		},

		setShuffle: function(shuffle) {
			this.playerNS().tb_setShuffle(shuffle);
		},
		onSetShuffle: function(callback) {
			this.eventCallbacks["setShuffle"].push(callback);
		},
		getShuffle: function() {
			return this.playerNS().getShuffle();
		},
		
		setRepeat: function(repeat) {
			this.playerNS().tb_setRepeat(repeat);
		},
		onSetRepeat: function(callback) {
			this.eventCallbacks["setRepeat"].push(callback);
		},
		getRepeat: function() {
			return this.playerNS().getRepeat();
		},
		
		setVolume: function(volume) {
			this.playerNS().tb_setVolume(volume);
		},
		onSetVolume: function(callback) {
			this.eventCallbacks["setVolume"].push(callback);
		},
		getVolume: function() {
			return this.playerNS().getVolume();
		},

		setIsMuted: function(muted) {
			this.playerNS().tb_setIsMuted(muted);
		},
		onSetIsMuted: function(callback) {
			this.eventCallbacks["setIsMuted"].push(callback);
		},
		getIsMuted: function() {
			return this.playerNS().getIsMuted();
		},
		
		Queue: {
			POSITION_FIRST: 'tb_queue_position_first',
			POSITION_NEXT: 'tb_queue_position_next',
			POSITION_LAST: 'tb_queue_position_last', 
			POSITION_RANDOM: 'tb_queue_position_random',
			
			parent: {},
			
			init: function(parent) {
				var that = this;
				this.parent = parent;
				
				this.parent.hijack("player", [
					{"name": "clearQueue", "callbacks": "Queue_clear"},
					{"name": "addSongsToQueueAt", "callbacks": "Queue_addSongs", "before": function (songs, index, playOnAdd, h) {
						var position;
						if (index == -3) {
							position = that.POSITION_LAST;
							index = GS.player.queue.songs.length;
						} else if (index == -2) {
							position = that.POSITION_NEXT;
							index = GS.player.queue.activeSong.index + 1;
						} else if (index == -1) {
							if (playOnAdd) {
								if (GS.player.queue.activeSong) {
									index = GS.player.queue.activeSong.index + 1;
									position = index;
								} else {
									index = 0;
									position = that.POSITION_FIRST;
								}
							} else {
								position = that.POSITION_LAST;
								index = GS.player.queue.songs.length;
							}
						} else if (index == 0) {
							position = that.POSITION_FIRST;
						} else {
							position = index;
						}
						
						return [songs, playOnAdd, position, index];
					}}
				]);
			},

			addEventListener: function(event, callback) {
				this.parent.eventCallbacks["queue_"+event].push(callback);
			},
			
			clear: function() {
				this.parent.playerNS().tb_clearQueue();
			},
			addSongs: function(songs, play, position) {
				if (position == null) {
					position = this.POSITION_LAST;
				}
				
				if (isNaN(position)) {
					switch (position) {
						case this.POSITION_FIRST:
							position = 0;
							break;
						case this.POSITION_NEXT:
							position = GS.player.queue.activeSong.index + 1;
							break;
						case this.POSITION_LAST:
							position = GS.player.queue.songs.length;
							break;
					}
				}
				
				this.parent.playerNS().tb_addSongsToQueueAt(songs, position, play, null, null);
			},
			
			getCurrentPosition: function() {
			}
		}
	}
	
	window.Toastbread = Toastbread;
	Toastbread.init();
})();
