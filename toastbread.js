(function () {
	var Toastbread = {
		SHUFFLE_ON: true, 
		SHUFFLE_OFF: false,
		
		REPEAT_ONE: 'tb_repeat_one', 
		REPEAT_ALL: 'tb_repeat_all', 
		REPEAT_OFF: 'tb_repeat_off',
	
		init: function() {
			
			console.log('Toastbread loaded');
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
			init: function() {
			
			},
			addSong: function(song_id, position) {
				if (position == null) {
					position = this.POSITION_LAST;
				}
			},
			clear: function() {
			
			}
		}
	}
	
	window.Toastbread = Toastbread;
	Toastbread.init();
})();
