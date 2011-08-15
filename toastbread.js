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
			"setSeek": [],
			"pause": [],
			"play": [],
			
			"Queue_addSongs": [],
			"Queue_clear": [],
			"Queue_setActiveSong": [],
			"Queue_removeSongs": [],
			"Queue_moveSongs": []
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
		queueNS: function() {
			return window.GS.player.queue;
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
				{"name": "previousSong", "callbacks": "previous"},
				{"name": "seekTo", "callbacks": "setSeek"},
				{"name": "pauseSong", "callbacks": "pause"},
				{"name": "playSong", "callbacks": "play"},
				{"name": "resumeSong", "callbacks": "play"}
			]);
			this.Queue.init(this);
			this.Updater.init(this);
			this.Notification.init(this);
		},
		
		addEventListener: function(event, callback) {
			this.eventCallbacks[event].push(callback);
		},
		
		play: function(queueSongID) {
			if (queueSongID) {
				this.playerNS().tb_playSong(queueSongID);
			} else if (this.isPlaying()) {
				this.playerNS().tb_pauseSong();
			} else if (this.isPaused()) {
				this.playerNS().tb_resumeSong();
			}
		},
		pause: function() {
			this.playerNS().tb_pauseSong();
		},
		next: function() {
			this.playerNS().tb_nextSong();
		},
		previous: function() {
			this.playerNS().tb_previousSong();
		},

		isPlaying: function() {
			return window.GS.player.isPlaying;
		},
		isPaused: function() {
			return window.GS.player.isPaused;
		},
		
		setSeek: function(position) {
			this.playerNS().tb_seekTo(position);
		},
		getSeek: function() {
			return (this.playerNS().getPlaybackStatus() ? this.playerNS().getPlaybackStatus().position : null);
		},

		setShuffle: function(shuffle) {
			this.playerNS().tb_setShuffle(shuffle);
		},
		getShuffle: function() {
			return this.playerNS().getShuffle();
		},
		
		setRepeat: function(repeat) {
			this.playerNS().tb_setRepeat(repeat);
		},
		getRepeat: function() {
			return window.GS.player.repeatMode;
		},
		
		setVolume: function(volume) {
			this.playerNS().tb_setVolume(volume);
		},
		getVolume: function() {
			return this.playerNS().getVolume();
		},

		setIsMuted: function(muted) {
			this.playerNS().tb_setIsMuted(muted);
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
					}},
					{"name": "setActiveSong", "callbacks": "Queue_setActiveSong"},
					{"name": "removeSongs", "callbacks": "Queue_removeSongs"},
					{"name": "moveSongsTo", "callbacks": "Queue_moveSongs"}
				]);
			},

			addEventListener: function(event, callback) {
				this.parent.eventCallbacks["queue_"+event].push(callback);
			},
			clear: function() {
				Toastbread.pause();
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
			getSongs: function() {
				return this.parent.queueNS().songs;
			},
			removeSongs: function(queueSongIDs) {
				this.parent.playerNS().tb_removeSongs(queueSongIDs);
			},
			moveSongs: function(songIDs, index) {
				this.parent.playerNS().tb_moveSongsTo(songIDs, index);
			},
			setActiveSong: function(queueSongID) {
				this.parent.playerNS().tb_setActiveSong(queueSongID);
			},
			getActiveSong: function() {
				return window.GS.player.currentSong != undefined ? window.GS.player.currentSong.queueSongID : null;
			}
		},
		Notification: {
			parent: {},
			init: function(parent) {
				var that = this;
				this.parent = parent;
			},
			publish: function(type, msg) {
				$.publish('gs.notification', { 'type': type, 'message': msg });
			},
			error: function(msg) {
				this.publish('error', msg);
			},
			info: function(msg) {
				this.publish('info', msg);
			}
		},
		Updater: {
			parent: {},
			init: function(parent) {
				var that = this;
				this.parent = parent;

				window.GS.player._currentSong = window.GS.player.currentSong;
				window.GS.player.__defineGetter__('currentSong', function() {
					return window.GS.player._currentSong;
				});
				window.GS.player.__defineSetter__('currentSong', function(value) {
					if (window.GS.player._currentSong && value && window.GS.player._currentSong.queueSongID != value.queueSongID) {
						window.GS.player.player.playSong(value.queueSongID);
					}
					
					return window.GS.player._currentSong = value;
				});
			}
		}
	}
	
	window.Toastbread = Toastbread;
	Toastbread.init();
})();
