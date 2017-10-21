function init() {
  var $ = go.GraphObject.make;
  myDiagram =
    $(go.Diagram, "myDiagramDiv",
    {
      initialContentAlignment: go.Spot.Left,
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
      "undoManager.isEnabled": true
    });
  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, "RoundedRectangle",
        {
          parameter1: 20,  // the corner has a large radius
          fill: $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }),
          stroke: null,
          portId: "",  // this Shape is the Node's port, not the whole Node
          fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
          toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
          cursor: "pointer"
        }),
      $(go.TextBlock,
        {
          font: "bold 11pt helvetica, bold arial, sans-serif",
          editable: true  // editing the text automatically updates the model data
        },
        new go.Binding("text").makeTwoWay())
    );
  myDiagram.linkTemplate =
    $(go.Link,  // the whole link panel
      {
        curve: go.Link.Bezier, adjusting: go.Link.Stretch,
        reshapable: true, relinkableFrom: true, relinkableTo: true,
        toShortLength: 3
      },
      new go.Binding("points").makeTwoWay(),
      new go.Binding("curviness"),
      $(go.Shape,  // the link shape
        { strokeWidth: 1.5 }),
      $(go.Shape,  // the arrowhead
        { toArrow: "standard", stroke: null }),
      $(go.Panel, "Auto",
        $(go.Shape,  // the label background, which becomes transparent around the edges
          {
            fill: $(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
            stroke: null
          }),
        $(go.TextBlock, "transition",  // the label text
          {
            textAlign: "center",
            font: "9pt helvetica, arial, sans-serif",
            margin: 4,
            editable: true  // enable in-place editing
          },
          new go.Binding("text").makeTwoWay())
      )
    );
}

var cantidad_ejecuciones = 0;

jQuery(document).ready(function(){
  jQuery.get("/executions/").done(function(data){
    cantidad_ejecuciones = data.length;
  });

  jQuery("#loadbtn").on('click', function(){
    myDiagram.model = go.Model.fromJson({});
    var execution = jQuery("#execution option:selected").val();

    var start_year = jQuery("#start_year").val();
    var end_year = jQuery("#end_year").val();
    var start_month = jQuery("#start_month option:selected").val();
    var end_month = jQuery("#end_month option:selected").val();

    if(start_year ==null || start_year=="" || end_year ==null || end_year==""){
      alert("Ingresa una fecha válida");
      return false;
    }

    var start_date = start_year + start_month;
    var end_date = end_year + end_month ;

    if(execution=="0"){
      jQuery.get("/executions/run/" + start_date + "/" + end_date).done(function(data){
        alert("Consulta Ejecutada!");
      }).fail(function(){
        alert("Error de Ejecución!");
      });
    }
    else{
      var fact = jQuery("#fact").val();
      var place = jQuery("#place").val();
      var person = jQuery("#person").val();
      if(!person){
        $.get( "/facts", {
          start_date: start_date,
          end_date: end_date,
          code: execution,
          historical_fact: fact,
          place: place
         }).done(function(data) {
          myDiagram.model = go.Model.fromJson(data);
        });
      }
      else{
        $.get( "/persons", {
          code: execution,
          historical_fact: fact,
          person: person
         }).done(function(data) {
          myDiagram.model = go.Model.fromJson(data);
        });
      }
    }
  });

  jQuery("#verifybtn").on('click', function(){
    jQuery.get("/executions/").done(function(data){
      if(data.length > cantidad_ejecuciones){
        alert("Ejecución Con Resultados!");
        $("#execution").append(new Option(data[0].start_date.substring(0, 4) + "/" + data[0].start_date.substring(4, 6) + " al " + data[0].end_date.substring(0, 4) + "/" + data[0].end_date.substring(4, 6), data[0].code));
        $('#execution option[value=' + data[0].code + ']').attr('selected','selected');
        $("#loadbtn").trigger( "click" );
      }
      else{
        alert("Ejecución sin resultados por el momento...");
      }
    });
  });
});
