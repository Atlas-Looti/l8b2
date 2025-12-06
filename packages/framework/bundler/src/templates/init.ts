// L8B Runtime Initialization
export const INIT_TEMPLATE = `
(function() {
	'use strict';
	
	// Wait for DOM ready
	function init() {
		// Create player instance
		const listener = {
			log: function(text) {
				console.log('[Game]', text);
			},
			error: function(err) {
				console.error('[Game Error]', err);
			}
		};
		
		window.player = new Player(listener);
	}
	
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
`;
