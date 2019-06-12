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


let target1 = new animation(D.gE("element1"));
let target2 = new animation(D.gE("element2"));
let target3 = new animation(D.gE("element3"));
let target4 = new animation(D.gE("element4"));
let target5 = new animation(D.gE("element5"));
let target6 = new animation(D.gE("element6"));
let target7 = new animation(D.gE("element7"));
let target8 = new animation(D.gE("element8"));
let target9 = new animation(D.gE("element9"));
let target10 = new animation(D.gE("element10"));
let target11 = new animation(D.gE("element11"));
let target12 = new animation(D.gE("element12"));
let target13 = new animation(D.gE("element13"));
let target14 = new animation(D.gE("element14"));
let target15 = new animation(D.gE("element15"));
let target16 = new animation(D.gE("element16"));
let target17 = new animation(D.gE("element17"));
let target18 = new animation(D.gE("element18"));
let target19 = new animation(D.gE("element19"));
let target20 = new animation(D.gE("element20"));

let macros1 = new multiAnimation(target1,target2,target3,target4);
let macros2 = new multiAnimation(target5,target6,target7,target8);
let macros3 = new multiAnimation(target9,target10,target11,target12);
let macros4 = new multiAnimation(target13,target14,target15,target16);
let macros5 = new multiAnimation(target17,target18,target19,target20);
/*let macros6 = new multiAnimation(target6);
let macros7 = new multiAnimation(target7);
let macros8 = new multiAnimation(target8);
let macros9 = new multiAnimation(target9);
let macros10 = new multiAnimation(target10);
let macros11 = new multiAnimation(target11);
let macros12 = new multiAnimation(target12);
let macros13 = new multiAnimation(target13);
let macros14 = new multiAnimation(target14);
let macros15 = new multiAnimation(target15);
let macros16 = new multiAnimation(target16);
let macros17 = new multiAnimation(target17);
let macros18 = new multiAnimation(target18);
let macros19 = new multiAnimation(target19);
let macros20 = new multiAnimation(target20);*/

let manager = new animationManager();

let m = 17.5;
let macrosArr = [macros1,macros2,macros3,macros4,macros5/*,macros6,macros7,macros8,macros9,macros10,macros11,macros12,macros13,macros14,macros15,macros16,macros17,macros18,macros19,macros20*/];
let animationArr = [[0,100,20],[0,100,20],[0,100,20],[0,100,20],[0,100,20]/*,[0,100,15+m],[0,100,17.5+m],[0,100,20+m],[0,100,22.5+m],[0,100,25+m],[0,100,27.5+m],[0,100,30+m],[0,100,32.5+m],[0,100,35+m],[0,100,37.5+m],[0,100,40+m],[0,100,42.5+m],[0,100,45+m],[0,100,47.5+m],[0,100,50+m]*/];
let delres = [[0,1000],[2000,1000],[1000,1000],[3000,1000],[2000,1000]/*,[500,5000],[600,5000],[700,5000],[800,5000],[900,5000],[1000,5000],[1100,5000],[1200,5000],[1300,5000],[1400,5000],[1500,5000],[1600,5000],[1700,5000],[1800,5000],[1900,5000]*/];

manager.loopDelay(macrosArr,"stretch",animationArr,"x",delres);