var Onodes = [];
var Oedges = [];
nodes();
function nodes() {
  axios
    .get("http://freshvegges.pics:40020/mppolice/public/api/nodes")
    .then(data => {
      data.data.forEach(result => {
      let img = result.image.replace('/var/www/freshvegges.pics/public/mppolice/public', '');
     
        Onodes.push({
          id: result.id,
          shape: "circularImage",
          label: result.label,
          title: `<img width="300" height="300" src="http://freshvegges.pics:40020/mppolice/public/${img}" alt='notavailable'>`,
          image: `http://freshvegges.pics:40020/mppolice/public/${img}`
        });
      });
    });
  edges();
}
function edges() {
  axios
    .get("http://freshvegges.pics:40020/mppolice/public/api/edges")
    .then(data => {
      data.data.forEach(result => {
        Oedges.push({
          from: Number(result.from),
          to: Number(result.to)
        });
      });
    });
   setTimeout(() => {
draw()
}, 10000)
}
function draw() {
  var nodes = Onodes;

  

  var edges = Oedges;

  console.log(edges);
console.log(nodes);
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges
  };
  var options = {
edges: {
arrows: {
to: {
 scaleFactor: 1,
}
}
}, 
   nodes: {
      shape: "circularImage"
    },
    layout: {
      randomSeed: 34
    },
    interaction: {
      hover: true,
      dragNodes: true,
      dragView: true,
      keyboard: {
        enabled: true,
        bindToWindow: false
      },
      navigationButtons: true,
      hideEdgesOnDrag: true,
      zoomView: false
    },
    physics: {
      forceAtlas2Based: {
        gravitationalConstant: -26,
        centralGravity: 0.005,
        springLength: 230,
        springConstant: 0.18
      },
      maxVelocity: 146,
      solver: "forceAtlas2Based",
      timestep: 0.35,
      stabilization: {
        enabled: true,
        iterations: 2000,
        updateInterval: 25
      }
    }
  };
  var network = new vis.Network(container, data, options);

  network.on("stabilizationProgress", function(params) {
    var maxWidth = 496;
    var minWidth = 20;
    var widthFactor = params.iterations / params.total;
    var width = Math.max(minWidth, maxWidth * widthFactor);

    document.getElementById("bar").style.width = width + "px";
    document.getElementById("text").innerHTML =
      Math.round(widthFactor * 100) + "%";
  });
  network.once("stabilizationIterationsDone", function() {
    document.getElementById("text").innerHTML = "100%";
    document.getElementById("bar").style.width = "496px";
    document.getElementById("loadingBar").style.opacity = 0;
    // really clean the dom element
    setTimeout(function() {
      document.getElementById("loadingBar").style.display = "none";
    }, 500);
    network.setOptions( { physics: false } );

  });
}

