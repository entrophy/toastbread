(function () {
	var Toastbread = {
		SHUFFLE_ON: true, 
		SHUFFLE_OFF: false,
		
		SHUFFLE_ONE: 'tb_shuffle_one', 
		SHUFFLE_ALL: 'tb_shuffle_all', 
		SHUFFLE_OFF: 'tb_shuffle_off',
	
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
		
		setVolume: function(volumn) {
		
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
