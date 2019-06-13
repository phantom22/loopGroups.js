let T = TOOL; let D = T.DOM;

class animation {

  constructor(object,timer,progress) {

    this.results = [];

    let O1 = object;
    let O2 = timer;
    let O3 = progress;

    if (O1 && O1 instanceof HTMLElement) {
      this.O1 = object;
    }
    if (O2 && O2 instanceof HTMLElement) {
      this.O2 = timer;
    }
    if (O3 && O3 instanceof HTMLElement) {
      this.O3 = progress;
    }

  }

  stretch(verse,[sWidth,fWidth,speed,freq],debug) {

    let startTime;

    let p = sWidth; let d = fWidth; let s = speed; 
    let pr = !isNaN(freq) && freq > 0 ? freq : 62.51; 
    let time = 0; let results = [];

    let O1 = this.O1;
    let O2 = this.O2;
    let O3 = this.O3;

    if (verse&&verse=="x"||verse=="y"&&d&&s&&!isNaN(p+d)&&p>=0&&p<=100&&d>1&&d<=100&&speed>0||speed=="auto") {

      let startDate; let startMin; let startSec;

      if (debug) {

        startDate = new Date();
        startMin = startDate.getMinutes();
        startSec = Number(startDate.toISOString().slice(17, -1));

      }

      let t = time;

      if (verse == "x") {

        verse = "width";
      }

      else if (verse == "y") {

        verse = "height";

      }

      let animation = setInterval(function([startSec,startMin],verse,[sWidth,fWidth]){

        if (Math.abs(p - d) !== 0 && !isNaN(speed)) {

          p = sWidth < fWidth ? p + (speed / pr) : p - (speed / pr);
          p = p > d && sWidth < fWidth ? d : p;
          p = p < d && sWidth > fWidth ? d : p;
          t = t + (1000 / pr);
          t = t > (d / s) * 1000 ? (d / s) * 1000 : t;

          if (O1 && O1 instanceof HTMLElement) {
            O1.style[verse] = p + "%";
          }
          if (O2 && O2 instanceof HTMLElement) {
            O2.textContent = `${(t / 1000).toFixed(1)}s`;
          }
          if (O3 && O3 instanceof HTMLElement) {
            O3.textContent = `${p.toFixed(2)}%`;
          }

        }

        else {

          if (speed == "auto") {

            p = fWidth;
            O1.style[verse] = fWidth + "%";

          }

          if (debug) {

            let finalDate = new Date();
            let finalMin = finalDate.getMinutes();
            let finalSec = Number(finalDate.toISOString().slice(17, -1));
            let result = startMin == finalMin ? finalSec - startSec : (60 - startSec) + finalSec + (60* (finalMin - startMin)) - 60;
            results.push(pr,result,t);

          }

          clearInterval(animation);

        }

      },(1000/pr), [startSec, startMin], verse, [sWidth, fWidth]);

      this.results.push(results);

    }

  }

  test(animation,[sWidth,fWidth,speed,freq],tests,verse) {

    freq = !freq ? undefined : freq;

    if (animation && typeof animation == "string" && tests && !isNaN(tests) && verse && typeof verse == "string") {

      this.results = []; let safeTime = (((fWidth - sWidth) / speed) * 1000 + (tests * 25) + 500); let verse;

      console.log(`safeTime: ${safeTime / 1000}s`);

      for (let i = 0; i < tests; i++) {

        this[animation](verse,[sWidth,fWidth,speed,freq],true);

      }

      setTimeout(function(results){

        let differences = []; let avg; let tTime; let latency;

        results.forEach(v => differences.push(v[1]));
        tTime = results[0][2] / 1000; // theorical time
        avg = differences.reduce((a,b) => a + b) / differences.length; // average
        latency = avg - tTime; // average - theorical time

        console.table(differences);
        console.log(`avg: ${avg}, latency: ${latency}, simultaneous animations: ${differences.length}`);

      }, safeTime, this.results);

    }

  }

}

class multiAnimation {

  constructor(...elems) {

    this.elements = []; this.currentAnimation = "";

    elems.forEach(v => {

      if (v instanceof animation) {

        this.elements.push(v);

      }
      
    });

  }

  animate(animation,[sWidth,fWidth,speed,freq],verse) {

    if (animation && typeof animation == "string" && !isNaN(sWidth+fWidth) && typeof verse == "string" && speed > 0 || speed == "auto") {

      let elems = this.elements;

      if (animation == "stretch") {

        Object.keys(elems).forEach(v => {

          elems[v][animation](verse,[sWidth,fWidth,speed,freq]);

        });

      }

    }

  }

  loop(animation,[sWidth,fWidth,speed,freq],verse,[delay,rest]) {

    if (animation && typeof animation == "string" && !isNaN(sWidth+fWidth) && typeof verse == "string" && speed > 0 || speed == "auto") {

      let state = 0; let t = this; let osWidth = Math.abs(sWidth-100); let ofWidth = Math.abs(fWidth-100); rest = rest && !isNaN(rest) ? rest : 0; delay = delay && !isNaN(delay) ? delay : 0;

      function lp(){

        if (state == 0) {

          state = 1;
          t.animate("stretch",[sWidth,fWidth,speed,freq],verse);

        }

        else {

          state = 0;
          t.animate("stretch",[osWidth,ofWidth,speed,freq],verse);

        }

      }

      setTimeout(function(){

	      lp();

	      t.currentAnimation = setInterval(function([osWidth,ofWidth],verse){

	        lp();

	      },((Math.abs(sWidth - fWidth) / speed) * 1000 + rest),[osWidth,ofWidth],verse);

      }, delay)

    }

  }

  clearAnimation() {

  	clearInterval(this.currentAnimation);

  }

}

class animationManager {

  constructor() {

    this.animations = [];

  }

  loopDelay(multiAnimations,animation,animationData,verse,delres){

    if (multiAnimations && animation && typeof animation == "string" && animationData && delres && typeof Array.isArray(multiAnimations.concat(animationData).concat(delres)) && typeof verse == "string" && multiAnimations.length == animationData.length && multiAnimations.length == delres.length) {

      multiAnimations.forEach(v => {

        if (v instanceof multiAnimation) {

          this.animations.push(v);

        }

      });

      if (this.animations.length == multiAnimations.length) {
      	
      	for (let i = 0; i < this.animations.length; i++) {

      		this.animations[i].loop(animation,animationData[i],verse,[delres[i][0],delres[i][1]]);

      	}

      }

    }

  }

  clearAnimations() {

  	this.animations.forEach(v => {

  		v.clearAnimation();

  	});

  }

}

Document.addEventListener("visibilitychange",function(){

}, false);