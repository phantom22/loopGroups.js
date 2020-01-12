let bg = new loopGroup([".element"]);

bg.setProperties({
	width:{
	    starting:        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	    final:           [100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
	    changeSpeed:     [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
	    initialDelay:    [0,500,100,600,0,500,1000,1500,1100,1600,1000,1500,2000,2500,2100,2600,2000,2500,3000,3500],
	    rest:            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	},
	height:{
	    starting:        [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
	    final:           [159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159,159],
	    changeSpeed:     [75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75],
	    initialDelay:    [0,500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6000,6500,7000,7500,8000,8500,9000,9500],
	    rest:            [1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000]
	}
});

bg.startLoop(62.51);