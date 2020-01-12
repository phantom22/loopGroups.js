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

  /**
   * @param  {Object}  args                         Encapsulates all the parameters.
   * @param  {Object}  <CSS property>               Defines the animation values of a certain property *defined in the "properties" Array.
   * @param  {Array}   <CSS property>.starting      Starting value of a property.
   * @param  {Array}   <CSS property>.final         Final value of a property (the animation will start another loop after reaching it).
   * @param  {Array}   <CSS property>.changeSpeed   This defines how fast a property will change ( this number will be added to the current property value each second ).
   * @param  {Array}   <CSS property>.initialDelay  Defines how much time (in milliseconds) the elements animation will wait before starting.
   * @param  {Array}   <CSS property>.rest          Defines how much time (in milliseconds) the elements animation will wait before re-starting.    
   */
  setProperties( args ) {

    const t = this,
    elementQuantity = Object.keys(t.elements).length,
    validate = (arr) => typeof arr !== "undefined" && Array.isArray(arr) && arr.length === elementQuantity && typeof arr.reduce((a,b)=>a+b) === "number",
    properties = Object.keys(args);

    for ( let i = 0; i < properties.length; i++ ) {

      const property = properties[i],
      values = args[property],
      { starting, final, changeSpeed, initialDelay, rest } = values;

      if ( validate(starting) && validate(final) && validate(changeSpeed) && validate(initialDelay) && validate(rest) ) {

        if ( t.properties.includes(properties[i]) === false )  { t.properties.push(properties[i]); }

        for ( let I = 0; I < elementQuantity; I++ ) {
        
          let currentValue = t.elements[I].element.style[property];
          currentValue = currentValue.replace(/\D/g,""),
          currentValue = currentValue === "" ? 0 : currentValue;

          // [ starting, final, changeSpeed, initialDelay, rest, onpause, verse ]
          t.elements[I].values[property] = [starting[I], final[I], changeSpeed[I], initialDelay[I], rest[I], initialDelay[I] > 0 ? true : false, 0];
          t.elements[I].style[property] = { value: starting[I], measure: "%" };
          t.elements[I].cache[property] = [];
          t.elements[I].cache._cached[property] = false;
          t.elements[I].cache._cacheIndex[property] = 0;
          t.elements[I].cache._pause[property] = [];

        }

      }

      else { console.warn(`The "${property}" is invalid.`); }

    }

  }

  HTMLUpdate() {

    const t = this,
    elementQuantity = Object.keys(t.elements).length,
    properties = t.properties;
  
    for ( let i = 0; i < elementQuantity; i++ ) {

      for ( let I = 0; I < properties.length; I++ ) {

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

      for ( let i = 0; i < Object.keys(elements).length; i++ ) {

        for ( let I = 0; I < properties.length; I++ ) {

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

                t.elements[i].values[property][6] = verse === 0 ? 1 : 0;
                t.rest(i,property);
                t.elements[i].cache._pause[property].push(cache.length);

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

                t.elements[i].style[property].value = cache[cacheIndex];
                t.elements[i].cache._cacheIndex[property] = cacheIndex + 1;

              }

              else if ( onpause === false && pause.includes(k) ) {
                
                t.elements[i].style[property].value = cache[cacheIndex];
                t.elements[i].cache._cacheIndex[property] = cacheIndex + 1;

              }

              if ( pause.includes(t.elements[i].cache._cacheIndex[property]) ) {

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

      const elementQuantity = Object.keys(elements).length;

      for ( let i = 0; i < elementQuantity; i++ ) {

        for ( let I = 0; I < properties.length; I++ ) {

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