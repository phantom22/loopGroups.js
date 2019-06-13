let t1 = new animation(D.gE("element1"));
let t2 = new animation(D.gE("element2"));
let t3 = new animation(D.gE("element3"));
let t4 = new animation(D.gE("element4"));
let t5 = new animation(D.gE("element5"));
let t6 = new animation(D.gE("element6"));
let t7 = new animation(D.gE("element7"));
let t8 = new animation(D.gE("element8"));
let t9 = new animation(D.gE("element9"));
let t10 = new animation(D.gE("element10"));
let t11 = new animation(D.gE("element11"));
let t12 = new animation(D.gE("element12"));
let t13 = new animation(D.gE("element13"));
let t14 = new animation(D.gE("element14"));
let t15 = new animation(D.gE("element15"));
let t16 = new animation(D.gE("element16"));
let t17 = new animation(D.gE("element17"));
let t18 = new animation(D.gE("element18"));
let t19 = new animation(D.gE("element19"));
let t20 = new animation(D.gE("element20"));

let m1 = new multiAnimation(t1);
let m2 = new multiAnimation(t2);
let m3 = new multiAnimation(t3);
let m4 = new multiAnimation(t4);
let m5 = new multiAnimation(t5);
let m6 = new multiAnimation(t6);
let m7 = new multiAnimation(t7);
let m8 = new multiAnimation(t8);
let m9 = new multiAnimation(t9);
let m10 = new multiAnimation(t10);
let m11 = new multiAnimation(t11);
let m12 = new multiAnimation(t12);
let m13 = new multiAnimation(t13);
let m14 = new multiAnimation(t14);
let m15 = new multiAnimation(t15);
let m16 = new multiAnimation(t16);
let m17 = new multiAnimation(t17);
let m18 = new multiAnimation(t18);
let m19 = new multiAnimation(t19);
let m20 = new multiAnimation(t20);

let manager = new animationManager();

(function(){

let macrosArr = [m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12,m13,m14,m15,m16,m17,m18,m19,m20];
let animationArr = [[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5],[0,100,5]];
let delres = [[0,500],[500,500],[1000,500],[1500,500],[2000,500],[2500,500],[3000,500],[3500,500],[4000,500],[4500,500],[5000,500],[5500,500],[6000,500],[6500,500],[7000,500],[7500,500],[8000,500],[8500,500],[9000,500],[9500,500]];

manager.loopDelay(macrosArr,"stretch",animationArr,"x",delres);

})()