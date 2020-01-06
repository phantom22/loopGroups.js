# animationGroup.js

A tool to easily group objects and creatig animation loops by adding multiple parameters.

Current avaiable animation: **Stretching**

### Stretching parameters

| Parameters   | Description                                                                         |
|--------------|-------------------------------------------------------------------------------------|
| sWidth       |  starting width of an element at the beginning of the animation                     |
| fWidth       |  width at of an element at the end of the animation                                 |
| stretchSpeed |  amount of width in % that will affect an element each second                       |
| initialDelay |  timeout function to unpause an element at the start of the animation               |
| rest         |  timeout function to unpause an element after it reaches its sWidth or fWidth value |   

### Syntax

```javascript
const background = new stretchAnimation(["#elem1","#elem2",".groupOfElements"]);

background.setProperties({

/* all the arrays lengths must match the number of the elements found with their respective css queries.
   the index of each value corresponds to an element ( the elements order is created when making a new class )
*/
	sWidth:          [0,0,0,0,0], // all the elements start with 0% width property
	fWidth:          [100,90,80,70,60], // each element will stop after they reach their destination width in % and return to the sWidth
	stretchSpeed:    [2,4,8,16,32], // each second an element will gain additional width in %
	initialDelay:    [100,200,300,400,500], // each element start moving 100ms apart from each other
	rest:            [1000,2000,0,0,0] // element 1 and 2 will rest for 1s and 2s respectively after reaching their sWidth or fWidth

})

background.startLoop(62.51) // the number indicates the refresh rate of the animation

```
