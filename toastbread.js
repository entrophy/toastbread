(function () {
	var Toastbread = {
		SHUFFLE_ON: true, 
		SHUFFLE_OFF: false,
		
		REPEAT_ONE: 2, 
		REPEAT_ALL: 1, 
		REPEAT_OFF: 0,
		
		onSetVolumeCallbacks: [],
		onSetShuffleCallbacks: [],
		onSetRepeatCallbacks: [],
	
		init: function() {	
			var that = this;
			console.log('Toastbread loaded');

			
			this.Queue.init();
			
			window.GS.player.tb_setVolume = window.GS.player.setVolume;
			window.GS.player.setVolume = function(volume) {
				if (that.onSetVolumeCallbacks.length) {
					_.forEach(that.onSetVolumeCallbacks, function (callback) {
						callback.call(callback, volume);
					});
				}
				return window.GS.player.tb_setVolume(volume);
			}

			window.GS.player.tb_setShuffle = window.GS.player.setShuffle;
			window.GS.player.setShuffle = function(shuffle) {
				if (that.onSetShuffleCallbacks.length) {
					_.forEach(that.onSetShuffleCallbacks, function (callback) {
						callback.call(callback, shuffle);
					});
				}
				return window.GS.player.tb_setShuffle(shuffle);
			}

			window.GS.player.tb_setRepeat = window.GS.player.setRepeat;
			window.GS.player.setRepeat = function(repeat) {
				if (that.onSetRepeatCallbacks.length) {
					_.forEach(that.onSetRepeatCallbacks, function (callback) {
						callback.call(callback, repeat);
					});
				}
				return window.GS.player.tb_setRepeat(repeat);
			}
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
			this.onSetShuffleCallbacks.push(callback);
		},
		getShuffle: function() {
			return window.GS.player.getShuffle();
		},
		
		setRepeat: function(repeat) {
			window.GS.player.tb_setRepeat(repeat);
		},
		onSetRepeat: function(callback) {
			this.onSetRepeatCallbacks.push(callback);
		},
		getRepeat: function() {
			return window.GS.player.getRepeat();
		},
		
		setVolume: function(volume) {
			window.GS.player.tb_setVolume(volume);
		},
		onSetVolume: function(callback) {
			this.onSetVolumeCallbacks.push(callback);
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
