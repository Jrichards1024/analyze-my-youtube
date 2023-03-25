

/**
 * 	Explode the page
 */
function explodeThePage() {

	// all possible html5 nodes
	let nodes = ['a', 'a[href]', 'b', 'blockquote', 'br', 'button', 'canvas', 'code', 'dd', 'dl', 'dt',
		'em', 'embed', 'footer', 'frame', 'form', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
		'iframe', 'img', 'input', 'label', 'nav', 'ol', 'ul', 'li', 'option', 'p', 'pre', 'section', 'span',
		'strong', 'sup', 'svg', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'textarea', 'text', 'u', 'video'
	];
	// add any exclusions
	for (let i = 0, l = nodes.length; i < l; i++) {
		nodes[i] = nodes[i] + ':not(.tally):not([class*="explode-"])';
	}
	// run animation
	anime({
		targets: document.querySelectorAll(nodes.toString()),
		rotate: function() {
			return Math.random() * randomRange(-360, 360);
		},
		translateX: function() {
			return Math.random() * randomRange(-50,50);
		},
		translateY: function() {
			return Math.random() * randomRange(-50,50);
		},
		scale: function() {
			return Math.random() * 2;
		}
	});
	// explode main nodes just a little
	anime({
		targets: document.querySelectorAll('div:not(.tally):not([class*="explode-"])'),
		rotate: function() {
			return Math.random() * 2;
		},
		translateX: function() {
			return Math.random() * 40;
		},
		translateY: function() {
			return Math.random() * 40;
		}
	});
	// add audio to play explosion sound
	var audio = new Audio(chrome.runtime.getURL('assets/sounds/explode.mp3'));
	// create promise / attempt to play
	var promise = audio.play();
	// if play fails then catch error
	if (promise !== undefined) {
		promise.then(_ => {
			// console.log("Autoplay started!");
		}).catch(err => {
			// console.log("Autoplay prevented!", err);
		});
	}
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function randomRange(min, max) {
	return Math.random() * (max - min) + min;
}
