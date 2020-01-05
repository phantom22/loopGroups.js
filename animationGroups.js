/**
 * container for animated groups of elements
 * @constructor
 * @param {Array}            root            array of HTMLElement query 
 */
class Controller {

	constructor( ...root ) {

  if ( Array.isArray(root) && root.length >= 1 ) {

  	root.forEach( root => {

    const e = document.querySelectorAll(root);

    if ( e.length >= 1 ) {

    	let elements = {};

    	for ( let i = 0; i < e.length; i++ ) {

      const styles = getComputedStyle(e[i]);

      elements[i] = { element: e[i], style: { width: Number(styles.width.replace("px","")) }, values: { verse: 0, onpause: false } };

    	}

    	this.elements = elements;

    }

  	})

  }

	}

}

class stretchAnimation extends Controller {

	constructor( ...root ) {

  if ( Array.isArray(root) && root.length >= 1 ) {

  	super( root );

  }

	}

	setProperties( properties = { sWidth, fWidth, stretchSpeed, initialDelay, rest } ) {

  const eLength = Object.keys(this.elements).length,
  validate = (arr) => Array.isArray(arr) && arr.length === eLength,
  { sWidth, fWidth, stretchSpeed, initialDelay, rest } = properties;

  if ( validate(sWidth) && validate(fWidth) && validate(stretchSpeed) && validate(initialDelay) && validate(rest) ) {

  	const p = Object.keys(properties);

  	for ( let i = 0; i < p.length; i++ ) {

    const property = p[i];

    for ( let I = 0; I < properties[property].length; I++ ) {

    	if ( property === "sWidth" ) { this.elements[I].values.starting = { width: properties[property][I] }; this.elements[I].style.width = properties[property][I] }
    	else if ( property === "fWidth" ) { this.elements[I].values.final = { width: properties[property][I] } }
    	else if ( property === "initialDelay" ) { this.elements[I].values[property] = properties[property][I]; this.elements[I].values.onpause = properties[property][I] > 0 ? true : false; }
    	else { this.elements[I].values[property] = properties[property][I] }

    }

  	}

  }

	}

	HTMLUpdate() {

  const eLength = Object.keys(this.elements).length;
  
  for ( let i = 0; i < eLength; i++ ) {

  	this.elements[i].element.style.width = `${this.elements[i].style.width}%`;
  	this.elements[i].element.style.height = `${this.elements[i].style.height}px`;

  }

	}

	calculateObjectsWidth() {

  if ( typeof this.animation !== "undefined" ) {

  	for ( let i = 0; i < Object.keys(this.elements).length; i++ ) {

    if ( this.elements[i].values.onpause === false ) {

    	let verse = this.elements[i].values.verse,
    	width = this.elements[i].style.width;

    	const speed = verse === 0 ? this.elements[i].values.stretchSpeed : -this.elements[i].values.stretchSpeed,
    	fWidth = this.elements[i].values.final.width,
    	sWidth = this.elements[i].values.starting.width,
    	fps = this.animation.fps;

    	width += (speed / fps);

    	width = width < sWidth ? sWidth : width;
    	width = width > fWidth ? fWidth : width;

    	this.elements[i].style.width = width;

    	if ( verse === 0 && width >= fWidth ) {

      this.elements[i].values.verse = 1;
      this.rest(i);

    	}

    	else if ( verse === 1 && width <= sWidth ) {

      this.elements[i].values.verse = 0;
      this.rest(i);

    	}

    }

  	}

  }

	}

	initialDelays() {

  if ( typeof this.animation !== "undefined" ) {

  	const eLength = Object.keys(this.elements).length;

  	for ( let i = 0; i < eLength; i++ ) {

    if ( this.elements[i].values.onpause === true && this.elements[i].values.initialDelay > 0 ) {

    	setTimeout(function(A,B){

      A.elements[B].values.onpause = false;

    	}, this.elements[i].values.initialDelay, this, i)

    }

  	}

  	this.animation.initialDelays = true;

  }

	}

	startLoop( fps ) {

  if ( typeof fps === "number" && fps >= 1 ) {

  	this.animation = { onpause: false, fps: fps, initialDelays: false };

  	this.animation.display = setInterval(function(A){

    if ( A.animation.initialDelays === false ) {

    	A.initialDelays();
    }

    if ( A.animation.onpause === false ) {

    	A.HTMLUpdate();
    	A.calculateObjectsWidth();

    }

  	}, (1000 / fps), this)
  	
  }

	}

	pause() {

  if ( typeof this.animation !== "undefined" ) {

  	this.animation.onpause = this.animation.onpause === false ? true : false;

  }

	}

	reset() {

  if ( typeof this.animation !== "undefined" ) {

  	clearInterval( this.animation.display );
  	delete this.animation;

  }

	}

	rest( element ) {

  if ( typeof this.elements[element] !== "undefined" ) {

  	this.elements[element].values.onpause = true;

  	setTimeout(function(A,B){

    A.elements[B].values.onpause = false;

  	}, this.elements[element].values.rest, this, element)


  }

	}

}