function init() {
  var $ = go.GraphObject.make;
  myDiagram =
    $(go.Diagram, "myDiagramDiv",
    {
      initialContentAlignment: go.Spot.Left,
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom
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

  load();
}
function load() {
  myDiagram.model = go.Model.fromJson(
    {
    "nodeKeyProperty": "id",
    "nodeDataArray": [
        {
            "id": "59e56ef4c2dc1045a476e4ba",
            "loc": "0 0",
            "text": "Battle of Poznań (1704)"
        },
        {
            "id": "59e56ef4c2dc1045a476e4bb",
            "loc": "100 50",
            "text": "Battle of Bazeilles"
        },
        {
            "id": "59e56ef4c2dc1045a476e4bc",
            "loc": "200 0",
            "text": "Warsaw Pact invasion of Czechoslovakia"
        },
        {
            "id": "59e56ef4c2dc1045a476e4bd",
            "loc": "300 50",
            "text": "Siege of Dunkirk (1944–45)"
        },
        {
            "id": "59e56ef4c2dc1045a476e4be",
            "loc": "400 0",
            "text": "Battle of Hannut"
        },
        {
            "id": "59e56ef4c2dc1045a476e4bf",
            "loc": "500 50",
            "text": "Siege of Kumamoto Castle"
        },
        {
            "id": "59e56ef4c2dc1045a476e4c0",
            "loc": "600 0",
            "text": "Somaliland campaign (1920)"
        },
        {
            "id": "59e56ef4c2dc1045a476e4c1",
            "loc": "700 50",
            "text": "Intercommunal conflict in Mandatory Palestine"
        },
        {
            "id": "59e56ef4c2dc1045a476e4c2",
            "loc": "800 0",
            "text": "Spanish–Portuguese War (1735–37)"
        },
        {
            "id": "59e56ef4c2dc1045a476e4c3",
            "loc": "900 50",
            "text": "Croisière du Grand Hiver"
        },
        {
            "id": "59e56ef4c2dc1045a476e4c4",
            "loc": "1000 0",
            "text": "Operation Phantom Phoenix"
        },
        {
            "id": "59e56ef4c2dc1045a476e4c5",
            "loc": "1100 50",
            "text": "1991 uprising in Karbala"
        },
        {
            "id": "59e56ef4c2dc1045a476e4c6",
            "loc": "1200 0",
            "text": "Battle of Marj Dabiq"
        },
        {
            "id": "59e56ef4c2dc1045a476e4c7",
            "loc": "0 100",
            "text": "Operation Camargue"
        },
        {
            "id": "59e56ef4c2dc1045a476e4c8",
            "loc": "100 150",
            "text": "Battle of Calderón Bridge"
        },
        {
            "id": "59e56ef4c2dc1045a476e4c9",
            "loc": "200 100",
            "text": "Shinpūren rebellion"
        },
        {
            "id": "59e56ef4c2dc1045a476e4ca",
            "loc": "300 150",
            "text": "Hagi Rebellion"
        },
        {
            "id": "59e56ef4c2dc1045a476e4cb",
            "loc": "400 100",
            "text": "Egyptian raid on Larnaca International Airport"
        },
        {
            "id": "59e56ef4c2dc1045a476e4cc",
            "loc": "500 150",
            "text": "Battle of Poznań (1945)"
        },
        {
            "id": "59e56ef4c2dc1045a476e4cd",
            "loc": "600 100",
            "text": "Air raid on Bari"
        },
        {
            "id": "59e56ef4c2dc1045a476e4ce",
            "loc": "700 150",
            "text": "14 July Revolution"
        },
        {
            "id": "59e56ef4c2dc1045a476e4cf",
            "loc": "800 100",
            "text": "Granville raid"
        },
        {
            "id": "59e56ef4c2dc1045a476e4d0",
            "loc": "900 150",
            "text": "Battle of Dombås"
        },
        {
            "id": "59e56ef4c2dc1045a476e4d1",
            "loc": "1000 100",
            "text": "Action at Mount Zion Church"
        },
        {
            "id": "59e56ef4c2dc1045a476e4d2",
            "loc": "1100 150",
            "text": "Battle of Irún"
        },
        {
            "id": "59e56ef4c2dc1045a476e4d3",
            "loc": "1200 100",
            "text": "Campaign of Gipuzkoa"
        },
        {
            "id": "59e56ef4c2dc1045a476e4d4",
            "loc": "0 200",
            "text": "Battle of Quifangondo"
        },
        {
            "id": "59e56ef4c2dc1045a476e4d5",
            "loc": "100 250",
            "text": "2007–08 Kenyan crisis"
        },
        {
            "id": "59e56ef4c2dc1045a476e4d6",
            "loc": "200 200",
            "text": "Battle of the Göhrde"
        },
        {
            "id": "59e56ef4c2dc1045a476e4d7",
            "loc": "300 250",
            "text": "Battle of Usagre"
        },
        {
            "id": "59e56ef4c2dc1045a476e4d8",
            "loc": "400 200",
            "text": "Battle of Basya"
        },
        {
            "id": "59e56ef4c2dc1045a476e4d9",
            "loc": "500 250",
            "text": "Battle of García Hernández"
        },
        {
            "id": "59e56ef4c2dc1045a476e4da",
            "loc": "600 200",
            "text": "Battle of Kirbekan"
        },
        {
            "id": "59e56ef4c2dc1045a476e4db",
            "loc": "700 250",
            "text": "Siege of Tarragona (1813)"
        },
        {
            "id": "59e56ef4c2dc1045a476e4dc",
            "loc": "800 200",
            "text": "Short Hills raid"
        },
        {
            "id": "59e56ef4c2dc1045a476e4dd",
            "loc": "900 250",
            "text": "Battle of Noemfoor"
        },
        {
            "id": "59e56ef4c2dc1045a476e4de",
            "loc": "1000 200",
            "text": "Battle of Poniec"
        },
        {
            "id": "59e56ef4c2dc1045a476e4df",
            "loc": "1100 250",
            "text": "Battle of Delft"
        },
        {
            "id": "59e56ef4c2dc1045a476e4e0",
            "loc": "1200 200",
            "text": "Battle of Horodok"
        },
        {
            "id": "59e56ef4c2dc1045a476e4e1",
            "loc": "0 300",
            "text": "Battle of Shklow (1654)"
        },
        {
            "id": "59e56ef4c2dc1045a476e4e2",
            "loc": "100 350",
            "text": "Battle of Werki"
        },
        {
            "id": "59e56ef4c2dc1045a476e4e3",
            "loc": "200 300",
            "text": "Battle of Rogersville"
        },
        {
            "id": "59e56ef4c2dc1045a476e4e4",
            "loc": "300 350",
            "text": "Western Sahara War"
        },
        {
            "id": "59e56ef4c2dc1045a476e4e5",
            "loc": "400 300",
            "text": "Blockade of Almeida"
        },
        {
            "id": "59e56ef4c2dc1045a476e4e6",
            "loc": "500 350",
            "text": "Battle of Olompali"
        },
        {
            "id": "59e56ef4c2dc1045a476e4e7",
            "loc": "600 300",
            "text": "Fourth Army (Romania)"
        },
        {
            "id": "59e56ef4c2dc1045a476e4e8",
            "loc": "700 350",
            "text": "Second Battle of Passchendaele"
        },
        {
            "id": "59e56ef4c2dc1045a476e4e9",
            "loc": "800 300",
            "text": "Operation Beit ol"
        },
        {
            "id": "59e56ef4c2dc1045a476e4ea",
            "loc": "900 350",
            "text": "Abu Musa and the Greater and Lesser Tunbs dispute"
        },
        {
            "id": "59e56ef4c2dc1045a476e4eb",
            "loc": "1000 300",
            "text": "Operation Valiant Guardian"
        },
        {
            "id": "59e56ef4c2dc1045a476e4ec",
            "loc": "1100 350",
            "text": "Operation Dragon Fire East"
        },
        {
            "id": "59e56ef4c2dc1045a476e4ed",
            "loc": "1200 300",
            "text": "Battle of Sculeni"
        },
        {
            "id": "59e56ef4c2dc1045a476e4ee",
            "loc": "0 400",
            "text": "Battle of Guzów"
        },
        {
            "id": "59e56ef4c2dc1045a476e4ef",
            "loc": "100 450",
            "text": "Operation Steinbock"
        },
        {
            "id": "59e56ef4c2dc1045a476e4f0",
            "loc": "200 400",
            "text": "Operation Hoover"
        },
        {
            "id": "59e56ef4c2dc1045a476e4f1",
            "loc": "300 450",
            "text": "Operation Able Rising Force"
        },
        {
            "id": "59e56ef4c2dc1045a476e4f2",
            "loc": "400 400",
            "text": "Operation Forsythe Park"
        },
        {
            "id": "59e56ef4c2dc1045a476e4f3",
            "loc": "500 450",
            "text": "Bombing of Treviso in World War II"
        },
        {
            "id": "59e56ef4c2dc1045a476e4f4",
            "loc": "600 400",
            "text": "Battle of Dragashani"
        },
        {
            "id": "59e56ef4c2dc1045a476e4f5",
            "loc": "700 450",
            "text": "Wallachian Revolution of 1848"
        },
        {
            "id": "59e56ef4c2dc1045a476e4f6",
            "loc": "800 400",
            "text": "Operation Catechism"
        },
        {
            "id": "59e56ef4c2dc1045a476e4f7",
            "loc": "900 450",
            "text": "Operation Obviate"
        },
        {
            "id": "59e56ef4c2dc1045a476e4f8",
            "loc": "1000 400",
            "text": "Operation Paravane"
        },
        {
            "id": "59e56ef4c2dc1045a476e4f9",
            "loc": "1100 450",
            "text": "Operation Game Warden"
        },
        {
            "id": "59e56ef4c2dc1045a476e4fa",
            "loc": "1200 400",
            "text": "Bolton massacre"
        },
        {
            "id": "59e56ef4c2dc1045a476e4fb",
            "loc": "0 500",
            "text": "Operation Lucky Alphonse"
        },
        {
            "id": "59e56ef4c2dc1045a476e4fc",
            "loc": "100 550",
            "text": "Battle of Lindley's Mill"
        },
        {
            "id": "59e56ef4c2dc1045a476e4fd",
            "loc": "200 500",
            "text": "French Fury"
        },
        {
            "id": "59e56ef4c2dc1045a476e4fe",
            "loc": "300 550",
            "text": "2007 Lebanon conflict"
        },
        {
            "id": "59e56ef4c2dc1045a476e4ff",
            "loc": "400 500",
            "text": "Battle of Nà Sản"
        },
        {
            "id": "59e56ef4c2dc1045a476e500",
            "loc": "500 550",
            "text": "Battle of San Marcial"
        },
        {
            "id": "59e56ef4c2dc1045a476e501",
            "loc": "600 500",
            "text": "Operation Dawn 8"
        },
        {
            "id": "59e56ef4c2dc1045a476e502",
            "loc": "700 550",
            "text": "Battle of the Nive"
        },
        {
            "id": "59e56ef4c2dc1045a476e503",
            "loc": "800 500",
            "text": "Lublin–Brest Offensive"
        },
        {
            "id": "59e56ef4c2dc1045a476e504",
            "loc": "900 550",
            "text": "Battle of Cabezón"
        },
        {
            "id": "59e56ef4c2dc1045a476e505",
            "loc": "1000 500",
            "text": "Battle of Kombi"
        },
        {
            "id": "59e56ef4c2dc1045a476e506",
            "loc": "1100 550",
            "text": "Battle of Sendaigawa"
        },
        {
            "id": "59e56ef4c2dc1045a476e507",
            "loc": "1200 500",
            "text": "Great Swamp Fight"
        },
        {
            "id": "59e56ef4c2dc1045a476e508",
            "loc": "0 600",
            "text": "Siege of Baler"
        },
        {
            "id": "59e56ef4c2dc1045a476e509",
            "loc": "100 650",
            "text": "Battle of Polesella"
        },
        {
            "id": "59e56ef4c2dc1045a476e50a",
            "loc": "200 600",
            "text": "Siege of Tripolitsa"
        },
        {
            "id": "59e56ef4c2dc1045a476e50b",
            "loc": "300 650",
            "text": "1992 Yugoslav People's Army column incident in Sarajevo"
        },
        {
            "id": "59e56ef4c2dc1045a476e50c",
            "loc": "400 600",
            "text": "Las Cuevas War"
        },
        {
            "id": "59e56ef4c2dc1045a476e50d",
            "loc": "500 650",
            "text": "Battle of El Brazito"
        },
        {
            "id": "59e56ef4c2dc1045a476e50e",
            "loc": "600 600",
            "text": "Battle of Diwaniya"
        },
        {
            "id": "59e56ef4c2dc1045a476e50f",
            "loc": "700 650",
            "text": "Fall of Mazar"
        },
        {
            "id": "59e56ef4c2dc1045a476e510",
            "loc": "800 600",
            "text": "Battle of Kemp's Landing"
        },
        {
            "id": "59e56ef4c2dc1045a476e511",
            "loc": "900 650",
            "text": "Relief of Newark"
        },
        {
            "id": "59e56ef4c2dc1045a476e512",
            "loc": "1000 600",
            "text": "Machurucuto Incident"
        },
        {
            "id": "59e56ef4c2dc1045a476e513",
            "loc": "1100 650",
            "text": "Operation Baja California"
        },
        {
            "id": "59e56ef4c2dc1045a476e514",
            "loc": "1200 600",
            "text": "Battle of Piva Forks"
        },
        {
            "id": "59e56ef4c2dc1045a476e515",
            "loc": "0 700",
            "text": "Battle of Dalnaspidal"
        },
        {
            "id": "59e56ef4c2dc1045a476e516",
            "loc": "100 750",
            "text": "Akizuki rebellion"
        },
        {
            "id": "59e56ef4c2dc1045a476e517",
            "loc": "200 700",
            "text": "Operation Samen"
        },
        {
            "id": "59e56ef4c2dc1045a476e518",
            "loc": "300 750",
            "text": "Battle of Blair's Landing"
        },
        {
            "id": "59e56ef4c2dc1045a476e519",
            "loc": "400 700",
            "text": "Federal War"
        },
        {
            "id": "59e56ef4c2dc1045a476e51a",
            "loc": "500 750",
            "text": "Battle of Petra"
        },
        {
            "id": "59e56ef4c2dc1045a476e51b",
            "loc": "600 700",
            "text": "Operation Gallop"
        },
        {
            "id": "59e56ef4c2dc1045a476e51c",
            "loc": "700 750",
            "text": "Battle of Calumpit"
        },
        {
            "id": "59e56ef4c2dc1045a476e51d",
            "loc": "800 700",
            "text": "Battle of Acapulco"
        },
        {
            "id": "59e56efac2dc1045a47706fb",
            "loc": "900 750",
            "text": "Ali"
        },
        {
            "id": "59e56efac2dc1045a47706fc",
            "loc": "1000 700",
            "text": "Henry Mordaunt (Royal Navy officer)"
        },
        {
            "id": "59e56efac2dc1045a47706fd",
            "loc": "1100 750",
            "text": "Peter McAulay"
        },
        {
            "id": "59e56efac2dc1045a47706fe",
            "loc": "1200 700",
            "text": "Pyotr Lushev"
        },
        {
            "id": "59e56efac2dc1045a47706ff",
            "loc": "0 800",
            "text": "Nikolai Lyashchenko"
        },
        {
            "id": "59e56efac2dc1045a4770700",
            "loc": "100 850",
            "text": "Salvador Estrella"
        },
        {
            "id": "59e56efac2dc1045a4770701",
            "loc": "200 800",
            "text": "Leonid Petrovsky"
        },
        {
            "id": "59e56efac2dc1045a4770702",
            "loc": "300 850",
            "text": "Iosif Apanasenko"
        },
        {
            "id": "59e56efac2dc1045a4770703",
            "loc": "400 800",
            "text": "Draft:Syed Jafar Hussain Shah Shaheed"
        },
        {
            "id": "59e56efac2dc1045a4770704",
            "loc": "500 850",
            "text": "Vahideh Taleghani"
        },
        {
            "id": "59e56efac2dc1045a4770705",
            "loc": "600 800",
            "text": "Abul Kalam Azad (officer)"
        },
        {
            "id": "59e56efac2dc1045a4770706",
            "loc": "700 850",
            "text": "David Urban"
        },
        {
            "id": "59e56efac2dc1045a4770707",
            "loc": "800 800",
            "text": "Mikhail Hatskilevich"
        },
        {
            "id": "59e56efac2dc1045a4770708",
            "loc": "900 850",
            "text": "Riad Darar"
        },
        {
            "id": "59e56efac2dc1045a4770709",
            "loc": "1000 800",
            "text": "Raj Shah"
        },
        {
            "id": "59e56efac2dc1045a477070a",
            "loc": "1100 850",
            "text": "Jean"
        },
        {
            "id": "59e56efac2dc1045a477070b",
            "loc": "1200 800",
            "text": "Mohammad"
        },
        {
            "id": "59e56efac2dc1045a477070c",
            "loc": "0 900",
            "text": "Alexander Petrovich Barklai de"
        },
        {
            "id": "59e56efac2dc1045a477070d",
            "loc": "100 950",
            "text": "William Wyllie (British Army officer)"
        },
        {
            "id": "59e56efac2dc1045a477070e",
            "loc": "200 900",
            "text": "Lee Fu"
        },
        {
            "id": "59e56efac2dc1045a477070f",
            "loc": "300 950",
            "text": "Ahmad Salek"
        },
        {
            "id": "59e56efac2dc1045a4770710",
            "loc": "400 900",
            "text": "Henry Curtis (British Army officer)"
        },
        {
            "id": "59e56efac2dc1045a4770711",
            "loc": "500 950",
            "text": "Mohammad"
        },
        {
            "id": "59e56efac2dc1045a4770712",
            "loc": "600 900",
            "text": "Abu Umar al"
        },
        {
            "id": "59e56efac2dc1045a4770713",
            "loc": "700 950",
            "text": "Erich Friderici"
        },
        {
            "id": "59e56efac2dc1045a4770714",
            "loc": "800 900",
            "text": "Franz von Roques"
        },
        {
            "id": "59e56efac2dc1045a4770715",
            "loc": "900 950",
            "text": "Giuseppe Arimondi"
        },
        {
            "id": "59e56efac2dc1045a4770716",
            "loc": "1000 900",
            "text": "Hossein Tala"
        },
        {
            "id": "59e56efac2dc1045a4770717",
            "loc": "1100 950",
            "text": "Seyyed Mehdi Hashemi"
        },
        {
            "id": "59e56efac2dc1045a4770718",
            "loc": "1200 900",
            "text": "Marcian Germanovich"
        },
        {
            "id": "59e56efac2dc1045a4770719",
            "loc": "0 1000",
            "text": "Johannes Raudmets"
        },
        {
            "id": "59e56efac2dc1045a477071a",
            "loc": "100 1050",
            "text": "Pyotr Solodukhin"
        },
        {
            "id": "59e56efac2dc1045a477071b",
            "loc": "200 1000",
            "text": "Alexander Todorsky"
        },
        {
            "id": "59e56efac2dc1045a477071c",
            "loc": "300 1050",
            "text": "Pierre Yang"
        },
        {
            "id": "59e56efac2dc1045a477071d",
            "loc": "400 1000",
            "text": "Bernard Gaines Farrar Jr"
        },
        {
            "id": "59e56efac2dc1045a477071e",
            "loc": "500 1050",
            "text": "Ali"
        },
        {
            "id": "59e56efac2dc1045a477071f",
            "loc": "600 1000",
            "text": "Mahmoud Nabavian"
        },
        {
            "id": "59e56efac2dc1045a4770720",
            "loc": "700 1050",
            "text": "Stanisław Karczewski"
        },
        {
            "id": "59e56efac2dc1045a4770721",
            "loc": "800 1000",
            "text": "Georges Cabanier"
        },
        {
            "id": "59e56efac2dc1045a4770722",
            "loc": "900 1050",
            "text": "Georgy Bazilevich"
        },
        {
            "id": "59e56efac2dc1045a4770723",
            "loc": "1000 1000",
            "text": "Mateo Aquino Febrillet"
        },
        {
            "id": "59e56efac2dc1045a4770724",
            "loc": "1100 1050",
            "text": "Kheiredine Zetchi"
        },
        {
            "id": "59e56efac2dc1045a4770725",
            "loc": "1200 1000",
            "text": "Mildmay Fane (British Army officer)"
        },
        {
            "id": "59e56efac2dc1045a4770726",
            "loc": "0 1100",
            "text": "Ivan Vasilievich Dubovoy"
        },
        {
            "id": "59e56efac2dc1045a4770727",
            "loc": "100 1150",
            "text": "Ivan Naumovich Dubovoy"
        },
        {
            "id": "59e56efac2dc1045a4770728",
            "loc": "200 1100",
            "text": "Saleh Alrasheed"
        },
        {
            "id": "59e56efac2dc1045a4770729",
            "loc": "300 1150",
            "text": "Earle M. Brown"
        },
        {
            "id": "59e56efac2dc1045a477072a",
            "loc": "400 1100",
            "text": "Thomas R. Glass"
        },
        {
            "id": "59e56efac2dc1045a477072b",
            "loc": "500 1150",
            "text": "Mikhail Batorsky"
        },
        {
            "id": "59e56efac2dc1045a477072c",
            "loc": "600 1100",
            "text": "Alexander Sirotkin"
        },
        {
            "id": "59e56efac2dc1045a477072d",
            "loc": "700 1150",
            "text": "Jan Latsis"
        },
        {
            "id": "59e56efac2dc1045a477072e",
            "loc": "800 1100",
            "text": "Harold B. Singleton"
        },
        {
            "id": "59e56efac2dc1045a477072f",
            "loc": "900 1150",
            "text": "Mohammed bin Jasim Alghatam"
        },
        {
            "id": "59e56efac2dc1045a4770730",
            "loc": "1000 1100",
            "text": "Hmayak Babayan"
        },
        {
            "id": "59e56efac2dc1045a4770731",
            "loc": "1100 1150",
            "text": "Tommaso Condulmier"
        },
        {
            "id": "59e56efac2dc1045a4770732",
            "loc": "1200 1100",
            "text": "Lotfollah Forouzandeh"
        },
        {
            "id": "59e56efac2dc1045a4770733",
            "loc": "0 1200",
            "text": "Sumner Gerard"
        },
        {
            "id": "59e56efac2dc1045a4770734",
            "loc": "100 1250",
            "text": "Reza Shiran"
        },
        {
            "id": "59e56efac2dc1045a4770735",
            "loc": "200 1200",
            "text": "Javad Karimi"
        },
        {
            "id": "59e56efac2dc1045a4770736",
            "loc": "300 1250",
            "text": "Henry Bates (British Army officer)"
        },
        {
            "id": "59e56efac2dc1045a4770737",
            "loc": "400 1200",
            "text": "Fyodor Remezov"
        },
        {
            "id": "59e56efac2dc1045a4770738",
            "loc": "500 1250",
            "text": "William Crosbie (British Army officer)"
        },
        {
            "id": "59e56efac2dc1045a4770739",
            "loc": "600 1200",
            "text": "Patrick Macnamara"
        },
        {
            "id": "59e56efac2dc1045a477073a",
            "loc": "700 1250",
            "text": "Sue Wah Chin"
        },
        {
            "id": "59e56efac2dc1045a477073b",
            "loc": "800 1200",
            "text": "John Evans (Royal Navy Officer)"
        },
        {
            "id": "59e56efac2dc1045a477073c",
            "loc": "900 1250",
            "text": "Matthew Buckle"
        },
        {
            "id": "59e56efac2dc1045a477073d",
            "loc": "1000 1200",
            "text": "Philip Patton"
        },
        {
            "id": "59e56efac2dc1045a477073e",
            "loc": "1100 1250",
            "text": "Nayeem Ahmad Khan"
        },
        {
            "id": "59e56efac2dc1045a477073f",
            "loc": "1200 1200",
            "text": "Edward Henry Delafield"
        },
        {
            "id": "59e56efac2dc1045a4770740",
            "loc": "0 1300",
            "text": "Edward Henry Windley"
        },
        {
            "id": "59e56efac2dc1045a4770741",
            "loc": "100 1350",
            "text": "Sugianto Sabran"
        },
        {
            "id": "59e56efac2dc1045a4770742",
            "loc": "200 1300",
            "text": "Moore Disney"
        },
        {
            "id": "59e56efac2dc1045a4770743",
            "loc": "300 1350",
            "text": "Ludwig August von Stutterheim"
        },
        {
            "id": "59e56efac2dc1045a4770744",
            "loc": "400 1300",
            "text": "Karl Friedrich von Moller"
        },
        {
            "id": "59e56efac2dc1045a4770745",
            "loc": "500 1350",
            "text": "Ellen Kettle"
        },
        {
            "id": "59e56efac2dc1045a4770746",
            "loc": "600 1300",
            "text": "Said Assagaff"
        },
        {
            "id": "59e56efac2dc1045a4770747",
            "loc": "700 1350",
            "text": "Peter von Pennavaire"
        },
        {
            "id": "59e56efac2dc1045a4770748",
            "loc": "800 1300",
            "text": "Yen Chin"
        },
        {
            "id": "59e56efac2dc1045a4770749",
            "loc": "900 1350",
            "text": "Innokenty Khalepsky"
        },
        {
            "id": "59e56efac2dc1045a477074a",
            "loc": "1000 1300",
            "text": "Jean"
        },
        {
            "id": "59e56efac2dc1045a477074b",
            "loc": "1100 1350",
            "text": "Alexander Sedyakin"
        },
        {
            "id": "59e56efac2dc1045a477074c",
            "loc": "1200 1300",
            "text": "Grigory Kireyev"
        },
        {
            "id": "59e56efac2dc1045a477074d",
            "loc": "0 1400",
            "text": "Ivan Gryaznov"
        },
        {
            "id": "59e56efac2dc1045a477074e",
            "loc": "100 1450",
            "text": "Patrick Edmonstone Craigie"
        },
        {
            "id": "59e56efac2dc1045a477074f",
            "loc": "200 1400",
            "text": "Nikolai Kashirin"
        },
        {
            "id": "59e56efac2dc1045a4770750",
            "loc": "300 1450",
            "text": "Thomas Clarke (British Army officer)"
        },
        {
            "id": "59e56efac2dc1045a4770751",
            "loc": "400 1400",
            "text": "Ivan Belov (commander)"
        },
        {
            "id": "59e56efac2dc1045a4770752",
            "loc": "500 1450",
            "text": "Ivan Smolin"
        },
        {
            "id": "59e56efac2dc1045a4770753",
            "loc": "600 1400",
            "text": "Nikanor Zakhvatayev"
        },
        {
            "id": "59e56efac2dc1045a4770754",
            "loc": "700 1450",
            "text": "Pyotr Sobennikov"
        },
        {
            "id": "59e56efac2dc1045a4770755",
            "loc": "800 1400",
            "text": "Ivan Bogdanov"
        },
        {
            "id": "59e56efac2dc1045a4770756",
            "loc": "900 1450",
            "text": "Konstantin Golubev"
        },
        {
            "id": "59e56efac2dc1045a4770757",
            "loc": "1000 1400",
            "text": "Sergei Ulagay"
        },
        {
            "id": "59e56efac2dc1045a4770758",
            "loc": "1100 1450",
            "text": "Nikolay Kuibyshev"
        },
        {
            "id": "59e56efac2dc1045a4770759",
            "loc": "1200 1400",
            "text": "Sahbirin Noor"
        },
        {
            "id": "59e56efac2dc1045a477075a",
            "loc": "0 1500",
            "text": "Mikhail Lewandowski"
        },
        {
            "id": "59e56efac2dc1045a477075b",
            "loc": "100 1550",
            "text": "Ivan Fedko"
        },
        {
            "id": "59e56efac2dc1045a477075c",
            "loc": "200 1500",
            "text": "Peter Ludwig du Moulin"
        },
        {
            "id": "59e56efac2dc1045a477075d",
            "loc": "300 1550",
            "text": "Kevin R. Wendel"
        },
        {
            "id": "59e56efac2dc1045a477075e",
            "loc": "400 1500",
            "text": "Daniel Hösli"
        }
    ],
    "linkDataArray": [
        {
            "from": "59e56ef4c2dc1045a476e4bd",
            "to": "59e56effc2dc1045a4772b91",
            "text": "Participant"
        },
        {
            "from": "59e56ef4c2dc1045a476e4bf",
            "to": "59e56effc2dc1045a4772dc6",
            "text": "Participant"
        },
        {
            "from": "59e56ef4c2dc1045a476e4c0",
            "to": "59e56efcc2dc1045a4771473",
            "text": "Participant"
        },
        {
            "from": "59e56ef4c2dc1045a476e4c4",
            "to": "59e56effc2dc1045a4772dd2",
            "text": "Participant"
        },
        {
            "from": "59e56ef4c2dc1045a476e4cc",
            "to": "59e56efbc2dc1045a47711ae",
            "text": "Participant"
        },
        {
            "from": "59e56ef4c2dc1045a476e4cc",
            "to": "59e56f01c2dc1045a4773836",
            "text": "Participant"
        },
        {
            "from": "59e56ef4c2dc1045a476e4dd",
            "to": "59e56efcc2dc1045a47713a2",
            "text": "Participant"
        },
        {
            "from": "59e56ef4c2dc1045a476e4dd",
            "to": "59e56f02c2dc1045a47741b5",
            "text": "Participant"
        },
        {
            "from": "59e56ef4c2dc1045a476e4fe",
            "to": "59e56efbc2dc1045a4771202",
            "text": "Participant"
        },
        {
            "from": "59e56ef4c2dc1045a476e50a",
            "to": "59e56f00c2dc1045a477307a",
            "text": "Participant"
        },
        {
            "from": "59e56ef4c2dc1045a476e50b",
            "to": "59e56efbc2dc1045a4770f41",
            "text": "Participant"
        },
        {
            "from": "59e56ef4c2dc1045a476e514",
            "to": "59e56effc2dc1045a4772ddb",
            "text": "Participant"
        },
        {
            "from": "59e56ef4c2dc1045a476e514",
            "to": "59e56efbc2dc1045a477133a",
            "text": "Participant"
        },
        {
            "from": "59e56efac2dc1045a47706ff",
            "to": "59e56ef8c2dc1045a476ff9b",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770700",
            "to": "59e56ef9c2dc1045a477034d",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770701",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770701",
            "to": "59e56ef5c2dc1045a476ea10",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770702",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770702",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770707",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770707",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770710",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770718",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770718",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770719",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770719",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477071a",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477071a",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477071b",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477071b",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477071d",
            "to": "59e56ef5c2dc1045a476ea2d",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770722",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770722",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770725",
            "to": "59e56ef7c2dc1045a476f827",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770726",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770727",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770727",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477072b",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477072b",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477072c",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477072c",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477072d",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477072d",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770730",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770737",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770738",
            "to": "59e56ef5c2dc1045a476ea0d",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477073d",
            "to": "59e56ef5c2dc1045a476ea0d",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770742",
            "to": "59e56ef5c2dc1045a476ee0d",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477074b",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477074b",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477074c",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477074e",
            "to": "59e56ef7c2dc1045a476f827",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477074e",
            "to": "59e56ef5c2dc1045a476e8d0",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770751",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770751",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770752",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770752",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770753",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770753",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770754",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770754",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770755",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770755",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770756",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770756",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770756",
            "to": "59e56ef5c2dc1045a476ea10",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770757",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770757",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770758",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a4770758",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477075a",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477075a",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477075b",
            "to": "59e56ef7c2dc1045a476f756",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477075b",
            "to": "59e56ef7c2dc1045a476f844",
            "text": "Historical Fact"
        },
        {
            "from": "59e56efac2dc1045a477075c",
            "to": "59e56ef7c2dc1045a476f822",
            "text": "Historical Fact"
        }
    ]
}
  );
}
