(function () {
	var Toastbread = {
		SHUFFLE_ON: true, 
		SHUFFLE_OFF: false,
		
		REPEAT_ONE: 'tb_repeat_one', 
		REPEAT_ALL: 'tb_repeat_all', 
		REPEAT_OFF: 'tb_repeat_off',
	
		init: function() {	
			console.log('Toastbread loaded');
			this.Queue.init();
		},
		
		play: function() {
		
		},
		pause: function() {
		
		},
		next: function() {
		
		},
		previous: function() {
		
		},

		setShuffle: function(shuffle) {
			
		},
		getShuffle: function() {
		
		},
		
		setRepeat: function(repeat) {
		
		},
		getRepeat: function() {
		
		},
		
		setVolume: function(volume) {
		
		},
		getVolume: function() {
		
		},
		
		Queue: {
			POSITION_FIRST: 'tb_queue_position_first',
			POSITION_LAST: 'tb_queue_position_last', 
			POSITION_RANDOM: 'tb_queue_position_random',
			
			onAddSongCallbacks: [],
			currentPosition: 0,
			
			init: function() {
				var self = this;
				
				window.GS.player.tb_addSongsToQueueAt = window.GS.player.addSongsToQueueAt;
				window.GS.player.addSongsToQueueAt = function(songs, index, playOnAdd, h) {
					var result;
					
					console.log(songs);
					console.log(index);
					console.log(playOnAdd);

					result = window.GS.player.tb_addSongsToQueueAt(songs, index, playOnAdd, h);
					console.log(window.GS.player.queue);
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
