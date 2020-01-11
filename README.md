# loopGroups.js

A tool to easily group objects and creating animation loops by adding multiple parameters.


### CSS property parameters

| Arrays        |  Types of Numbers  |  Description                                                                  |
|:-------------:|:------------------:|:------------------------------------------------------------------------------|
| starting      |  Percentage        |  starting value of an elements property at the beginning of the animation     |
| final         |  Percentage        |  property value of an element at the end of the animation                     |
| changeSpeed   |  Percentage        |  defines how much a property gains or loses each second                       |
| initialDelay  |  milliseconds      |  the time before an element starts moving, therefore starting its animation   |
| rest          |  milliseconds      |  the time that an element will wait before moving after each animation cycle  | 

### Syntax

```javascript
const background = new loopGroup(["#elem1","#elem2",".groupOfElements"]);

background.setProperties({

/* all the arrays lengths must match the number of the elements found with their respective css queries.
   the index of each value corresponds to an element; 
   if a property is not declared inside the "properties" array it will be ignored
*/
  properties: ["width"],
  width:{
    starting:      [0,0,0,0,0], // in this case all the elements start with 0% width property
    final:         [100,90,80,70,60], // when an element reaches this value it will restart the animation loop
    changeSpeed:   [2,4,8,16,32], // in this case the width of the first element will gain 2% each second
    initialDelay:  [100,200,300,400,500], // each element start moving 100ms apart from each other
    rest:          [1000,2000,0,0,0] // the first two stop for 1s and 2s respectively after finishing one cycle of animation
  }
  
})

background.startLoop(62.51) // the number indicates the refresh rate of the animation

// pausing an animation, to restart it you need to re-call the function
background.pause();

// resetting an animation, the object will preserve its parameters but in order to re-activate it you need to call the .startLoop() function again
background.reset();
```
