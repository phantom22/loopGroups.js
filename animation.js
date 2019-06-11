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

	stretch(verse,sWidth,fWidth,speed,debug,freq) {

		let startTime;

		let p = sWidth; let d = fWidth; let s = speed; 
		let pr = !isNaN(freq) && freq > 0 ? freq : 62.51; 
		let time = 0; let results = [];

		let O1 = this.O1;
		let O2 = this.O2;
		let O3 = this.O3;

		if (verse&&verse=="x"||verse=="y"&&d&&s&&!isNaN(p+d+s)&&p>=0&&p<100&&d>1&&d<=100&&speed>0) {

			let startDate; let startMin; let startSec;

			if (debug) {

				startDate = new Date();
				startMin = startDate.getMinutes();
				startSec = Number(startDate.toISOString().slice(17, -1));

			}

			let t = time;

			let animation = setInterval(function(startSec,startMin,verse){

				if (p < d) {

					p = p + (speed / pr);
					p = p > d ? d : p;
					t = t + (1000 / pr);
					t = t > (d / s) * 1000 ? (d / s) * 1000 : t;

					if (O1 && O1 instanceof HTMLElement) {
						if (verse == "x") {
							O1.style.width = p + "%";
						}
						else if (verse == "y") {
							O1.style.height = p + "%";
						}
					}
					if (O2 && O2 instanceof HTMLElement) {
						O2.textContent = `${(t / 1000).toFixed(1)}s`;
					}
					if (O3 && O3 instanceof HTMLElement) {
						O3.textContent = `${p.toFixed(2)}%`;
					}

				}

				else {

					if (debug) {

						let finalDate = new Date();
						let finalMin = finalDate.getMinutes();
						let finalSec = Number(finalDate.toISOString().slice(17, -1));
						let result = startMin == finalMin ? finalSec - startSec : (60 - startSec) + finalSec + (60* (finalMin - startMin)) - 60;
						results.push(pr,result,t);

					}

					clearInterval(animation);

				}

			},(1000 / pr),startSec,startMin,verse);

			this.results.push(results);

		}

	}

	test(animation,sWidth,fWidth,speed,freq,tests,...args) {

		let pr = !freq ? undefined : freq;

		if (animation && typeof animation == "string" && tests && !isNaN(tests) && typeof args[0] == "string") {

			this.results = []; let safeTime = (((fWidth - sWidth) / speed) * 1000 + (tests * 25) + 500); let verse;

			console.log(`safeTime: ${safeTime / 1000}s`);

			if (animation == "stretch") {

				verse = args[0];

			}

			for (let i = 0; i < tests; i++) {

				this.stretch(verse,0,100,50,true,pr);

			}

			setTimeout(function(results){

				let differences = []; let avg; let tTime; let latency;

				results.forEach(v=>differences.push(v[1]));
				tTime = results[0][2] / 1000;
				avg = differences.reduce((a,b)=>a+b) / differences.length;
				latency = avg - tTime;

				console.table(differences);
				console.log(`avg: ${avg}, latency: ${latency}, simultaneous animations: ${differences.length}`);

			},safeTime,this.results);

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

target1.stretch("x",0,100,1600);
target2.stretch("x",0,100,800);
target3.stretch("x",0,100,400);
target4.stretch("x",0,100,200);
target5.stretch("x",0,100,100);
target6.stretch("x",0,100,50);
target7.stretch("x",0,100,25);
target8.stretch("x",0,100,12.5);
target9.stretch("x",0,100,6.25);

//target.stretch("y",0,100,10)
//target.test("stretch",0,100,50,false,2,"x");