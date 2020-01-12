class Controller {

  constructor( root ) {

    const t = this;

    if ( Array.isArray(root) && root.length >= 1 ) {

      root.forEach( root => {

      const e = document.querySelectorAll(root);

      if ( e.length >= 1 ) {

        let elements = {};
        t.properties = [];

        for ( let i = 0; i < e.length; i++ ) {

          const styles = getComputedStyle(e[i]);

          elements[i] = { element: e[i], style: {}, values: {}, cache: { _cached: {}, _cacheIndex: {}, _pause: {} } };

        }

        t.elements = elements;

      }

    })}

  }

}

class loopGroup extends Controller {

  constructor( root ) {

    if ( Array.isArray(root) && root.length >= 1 ) {

      super( root );

    }

  }

  setProperties( args ) {

    const t = this,
    elementQuantity = Object.keys(t.elements).length,
    elements = t.elements,
    validate = (arr) => typeof arr !== "undefined" && Array.isArray(arr) && arr.length === elementQuantity && typeof arr.reduce((a,b)=>a+b) === "number",
    properties = Object.keys(args),
    err = (property) => { delete t.elements; delete t.properties; throw `The "${property}" is invalid.` };

    for ( let i in properties ) {

      const property = properties[i],
      values = args[property],
      { starting, final, changeSpeed, initialDelay, rest } = values;

      let measure = values.measure;
      measure = typeof measure === "string" && measure.length !== 0 ? measure : "%"

      if ( validate(starting) && validate(final) && validate(changeSpeed) && validate(initialDelay) && validate(rest) ) {

        if ( t.properties.includes(properties[i]) === false )  { t.properties.push(properties[i]); }

        for ( let I in elements ) {
        
          let currentValue = t.elements[I].element.style[property];
          currentValue = currentValue.replace(/\D/g,""),
          currentValue = currentValue === "" ? 0 : currentValue;

          if ( starting[I] < final[I] && changeSpeed[I] > 0 && initialDelay[I] >= 0 && rest[I] >= 0 ) {
 
           t.elements[I].values[property] = [starting[I], final[I], changeSpeed[I], initialDelay[I], rest[I], initialDelay[I] > 0 ? true : false, 0];
           t.elements[I].style[property] = { value: starting[I], measure: measure };
           t.elements[I].cache[property] = [];
           t.elements[I].cache._cached[property] = false;
           t.elements[I].cache._cacheIndex[property] = 0;
           t.elements[I].cache._pause[property] = [];

      	  }

      	  else { err(property) }

        }

      }

      else { err(property) }

    }

  }

  HTMLUpdate() {

    const t = this,
    elements = t.elements,
    elementQuantity = Object.keys(t.elements).length,
    properties = t.properties;
  
    for ( let i in elements ) {

      for ( let I in properties ) {

        const property = properties[I],
        { value, measure } = t.elements[i].style[property];

        t.elements[i].element.style[property] = `${value}${measure}`;

      }

    }

  }

  calculateObjectsProperties() {

    const t = this,
    a = t.animation,
    elements = t.elements,
    properties = t.properties;

    if ( typeof a !== "undefined" ) {

      for ( let i in elements ) {

        for ( let I in properties ) {

          const element = elements[i],
          property = properties[I],
          v = element.values[property],
          s = element.style[property],
          [ starting, final, changeSpeed, initialDelay, rest, onpause, verse ] = v,
          { refreshRate } = a,
          measure = s.measure,
          cSpeed = verse === 0 ? changeSpeed : -changeSpeed,
          cache = element.cache[property],
          _cached =  element.cache._cached[property];

          let { value } = s;

          if ( onpause === false ) {

            if ( _cached === false ) {

              value += (cSpeed / refreshRate);

              value = value < starting && verse === 1 ? starting : value;
              value = value > final && verse === 0 ? final : value;

              t.elements[i].style[property].value = value;

              t.elements[i].cache[property].push(value);

              if ( value >= final && verse === 0 || value <= starting && verse === 1 ) {

              	const p = cache.length - 1;

                t.elements[i].values[property][6] = verse === 0 ? 1 : 0;
                t.rest(i,property);
                t.elements[i].cache._pause[property].push(p);

              }

              if (value <= starting && verse === 1) {

                t.elements[i].cache._cached[property] = true;

              }

            }

            else {

              const cacheQuantity = cache.length,
              pause = element.cache._pause[property],
              k = element.cache._cacheIndex[property];
              
              let cacheIndex = k;
              cacheIndex = cacheIndex < cacheQuantity ? cacheIndex : 0;

              if ( !pause.includes(cacheIndex) ) {

              	t.elements[i].cache._cacheIndex[property] = cacheIndex + 1;
                t.elements[i].style[property].value = cache[cacheIndex];

              }

              else if ( onpause === false && pause.includes(k) ) {
                
                t.elements[i].style[property].value = cache[cacheIndex];
                t.elements[i].cache._cacheIndex[property] = cacheIndex + 1;

              }

              if ( pause.includes(t.elements[i].cache._cacheIndex[property] - 1) ) {

                t.rest(i,property);

              }

            }

          }

        }

      }

    }

  }

  initialDelays() {

    const t = this,
    elements = t.elements,
    a = t.animation,
    properties = t.properties;

    if ( typeof a !== "undefined" ) {

      for ( let i in elements ) {

        for ( let I in properties ) {

          const element = elements[i],
          property = properties[I],
          v = element.values[property],
          onpause = v[5],
          initialDelay = v[3];

          if ( onpause === true && initialDelay > 0 ) {

            setTimeout(function(A,B,C){

              A.elements[B].values[C][5] = false;

            }, initialDelay, t, i, property);

          }

        }

      }

      t.animation.initialDelays = true;

    }

  }

  startLoop( refreshRate ) {

    const t = this;

    if ( typeof refreshRate === "number" && refreshRate >= 1 ) {

      t.animation = { onpause: false, refreshRate: refreshRate, initialDelays: false };

      t.animation.display = setInterval(function(A){

        if ( A.animation.initialDelays === false ) {

          A.initialDelays();
        }

        if ( A.animation.onpause === false ) {

          A.HTMLUpdate();
          A.calculateObjectsProperties();

        }

      }, (1000 / refreshRate), t);
    
    }

  }

  pause() {

    const t = this,
    animation = t.animation,
    onpause = animation.onpause;

    if ( typeof animation !== "undefined" ) {

      t.animation.onpause = onpause === false ? true : false;

    }

  }

  reset() {

    const t = this,
    animation = t.animation,
    display  = animation.display;

    if ( typeof animation !== "undefined" ) {

      clearInterval( display );
      delete t.animation;

    }

  }

  rest( elementIndex, property ) {

    const t = this,
    element = t.elements[elementIndex];

    if ( typeof element !== "undefined" && typeof property === "string" && t.properties.includes(property) ) {

      t.elements[elementIndex].values[property][5] = true;

      setTimeout(function(A,B,C){

        A.elements[B].values[C][5] = false;

      }, element.values[property][4], t, elementIndex, property);


    }

  }

}