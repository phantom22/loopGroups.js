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

    if (verse&&verse=="x"||verse=="y"&&d&&s&&!isNaN(p+d)&&p>=0&&p<100&&d>1&&d<=100&&speed>0||speed=="auto") {

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

      let animation = setInterval(function(startSec,startMin,verse,fWidth){

        if (p < d && !isNaN(speed)) {

          p = p + (speed / pr);
          p = p > d ? d : p;
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

      },(1000/pr), startSec, startMin, verse, fWidth);

      this.results.push(results);

    }

  }

  test(animation,[sWidth,fWidth,speed,freq],tests,...args) {

    freq = !freq ? undefined : freq;

    if (animation && typeof animation == "string" && tests && !isNaN(tests) && typeof args[0] == "string") {

      this.results = []; let safeTime = (((fWidth - sWidth) / speed) * 1000 + (tests * 25) + 500); let verse;

      console.log(`safeTime: ${safeTime / 1000}s`);

      if (animation == "stretch") {

        verse = args[0];

      }

      for (let i = 0; i < tests; i++) {

        this.stretch(verse,[sWidth,fWidth,speed,freq],true);

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

    this.elements = [];

    elems.forEach(v => {

      if (v instanceof animation) {

        this.elements.push(v);

      }
      
    });

  }

  animate(animation,[sWidth,fWidth,speed,freq],...args) {

    if (animation && typeof animation == "string" && !isNaN(sWidth+fWidth) && typeof args[0] == "string" && speed > 0 || speed == "auto") {

      let elems = this.elements;

      if (animation == "stretch") {

        let verse = args[0];

        Object.keys(elems).forEach(v => {

          elems[v].stretch(verse,[sWidth,fWidth,speed,freq]);

        });

      }

    }

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

let macros1 = new multiAnimation(target1,target3,target5,target7,target9,target11,target13,target15,target17,target19);

macros1.animate("stretch",[0,100,"auto"],"x");
target2.stretch("x",[0,100,1.4]);
target4.stretch("x",[0,100,1.9599999999999997]);
target6.stretch("x",[0,100,2.7439999999999993]);
target8.stretch("x",[0,100,3.841599999999999]);
target10.stretch("x",[0,100,5.378239999999998]);
target12.stretch("x",[0,100,7.529535999999997]);
target14.stretch("x",[0,100,10.541350399999995]);
target16.stretch("x",[0,100,14.757890559999993]);
target18.stretch("x",[0,100,20.66104678399999]);
target20.stretch("x",[0,100,28.925465497599983]);