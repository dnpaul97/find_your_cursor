// Define study
const study = lab.util.fromObject({
  "title": "root",
  "type": "lab.flow.Sequence",
  "parameters": {},
  "plugins": [
    {
      "type": "lab.plugins.Metadata",
      "path": undefined
    },
    {
      "type": "lab.plugins.Transmit",
      "url": "\u002Fsave",
      "encoding": "form",
      "updates": {
        "incremental": false
      },
      "callbacks": {
        "setup": function(){this.headers["X-CSRFToken"]=window.csrf_token},
        "full": function(e){e&&e.ok&&(window.location="/next")}
      },
      "path": undefined
    }
  ],
  "metadata": {
    "title": "Rotation animation",
    "description": "",
    "repository": "",
    "contributors": ""
  },
  "files": {},
  "responses": {},
  "content": [
    {
      "type": "lab.canvas.Screen",
      "content": [
        {
          "type": "i-text",
          "left": 0,
          "top": -150,
          "angle": 0,
          "width": 306.83,
          "height": 18.08,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "Here is some text on the underlying canvas",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "16",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        }
      ],
      "viewport": [
        800,
        600
      ],
      "files": {},
      "responses": {},
      "parameters": {},
      "messageHandlers": {
        "before:prepare": function anonymous(
) {
let currentAngle = 0
const width = 40
const height = 80

this.options.events['mousemove'] = (e) => {
  // relative position of the mouse in relation to screen center
  relX = e.clientX - document.documentElement.clientWidth/2;
  relY = e.clientY - document.documentElement.clientHeight/2;
  //console.log(relX, relY)  
  angle = getDirection(relX,relY);
  // because of the way the triangle drawing is oriented, position is always at 90 degrees offset
  currentAngle = (angle+90)%360;   
}

function getDirection(x1, y1) {
    angle = Math.atan2(y1, x1) * 180 / Math.PI;
    if(angle < 0){angle += 360}    
    return (angle);
}

// Function to draw the content as defined via the visual builder
// (this is digging in the lab.js internals, which may change
// sometime)
const baseRenderFunction = lab.util.canvas.makeRenderFunction(
  this.options.content.filter(c => c.type !== 'aoi'),
  this.internals.controller.cache
)

this.options.renderFunction = function(ts, canvas, ctx, obj) {
  // Render the base layer
  baseRenderFunction(ts, canvas, ctx, obj)

  // Render the triangle
  ctx.save() // Save the current rotation before applying tranformations
  ctx.rotate(lab.util.geometry.toRadians(currentAngle))
  
  ctx.moveTo(-width / 2,  height / 2)
  ctx.lineTo(         0, -height / 2)
  ctx.lineTo( width / 2,  height / 2)
  
  ctx.fillStyle = 'black'
  ctx.fill()
  
  ctx.restore() // Restore previous transformation

  // Queue rerender on next frame
  this.queueAnimationFrame()
}
}
      },
      "title": "Rotating_Triangle"
    }
  ]
})

// Let's go!
study.run()