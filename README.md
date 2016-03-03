# jOrgChart-Vertical
A jQuery plugin to draw tree-like structures such as OrgCharts in both vertical and horizontal modes

#Readme


jQuery OrgChart vertical is a plugin that allows you to render structures with nested elements in a easy-to-read tree structure. To build the tree all you need is to make a single line call to the plugin and supply the HTML element Id for a nested unordered list element that is representative of the data you'd like to display. If drag-and-drop is enabled you'll be able to reorder the tree which will also change the underlying list structure. 
This orgChart will support drag and drop on mobile devices


Features include:

* Very easy to use given a nested unordered list element.
* Drag-and-drop functionality allows reordering of the tree and underlying `<ul>` structure.
* Showing/hiding a particular branch of the tree by clicking on the respective node.
* Nodes can contain any amount of HTML except `<li>` and `<ul>`.
* Easy to style.
* Vertical and horizontal modes


----

##Expected Markup & Example Usage

To get up and running you'll need a few things. 

-----

###The JavaScript Libraries & CSS

You need to include the jQuery as well as the jOrgChart libraries. For example:

	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
	<script type="text/javascript" src="js/jquery.jOrgChart.js"></script>

If you want to use the drag-and-drop functionality you'll need to include jQuery UI too:

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js"></script>
	
If you want to use the drag-and-drop functionality on mobile devices you'll need to include jquery.ui.touch-punch.min.js too:

	<script type="text/javascript" src="https://github.com/furf/jquery-ui-touch-punch/blob/master/jquery.ui.touch-punch.min.js"></script>
	
The core CSS is necessary to perform some of the basic styling i.e.

    <link rel="stylesheet" href="css/jquery.jOrgChart.css"/>

----

###The HTML

You'll need to construct a nest unordered list that represents your node nesting. For example:

	<ul id="org" style="display:none">
	<li class='root'>
	  <div class='listContent'><span class='listName'>Food</span></div>
	  <ul>
		<li><div class='listContent'><span class='listName'>Beer</span></div></li>
		<li id="veg"><div class='listContent'><span class='listName'>Vegetables</span></div>
		  <ul>
			<li id="pum"><div class='listContent'><span class='listName'>Pumpkin</span></div>
			<ul>
				<li id="tro"><div class='listContent'><span class='listName'>Tro</span></div></li>
				<li id="aub"><div class='listContent'><span class='listName'>Aubergine</span></div></li>
			</ul>
			</li>
			<li id="ght"><div class='listContent'><span class='listName'>ght</span></div></li>
		  </ul>
		</li>
		<li><div class='listContent'><span class='listName'>Bread</span></div>
		<ul>
			<li id="bread2"><div class='listContent'><span class='listName'>bread2</span></div>
			<ul>
				<li id="tro"><div class='listContent'><span class='listName'>Tro</span></div></li>
				<li id="aub"><div class='listContent'><span class='listName'>Aubergine</span></div></li>
			</ul>
			</li>
		</ul>
		</li>
		<li><div class='listContent'><span class='listName'>Chocolate</span></div>
		  <ul>
			<li class='endList'><div class='listContent'><span class='listName'>Topdeck</span></div></li>
			<li><div class='listContent'><span class='listName'>Reese's Cups</span></div>
			<ul>
				<li class='endList'><div class='listContent'><span class='listName'>Bread1</span></div></li>
				<li class='endList'><div class='listContent'><span class='listName'>Bread2</span></div></li>
			</ul>
			</li>
		  </ul>
		</li>
	  </ul>
	</li>
	</ul>


-----

###The jQuery Call
Add this function somewhere in your document:
	

	$(document).ready(function() {
    var opts = {
      chartElement: '#chart',
      dragAndDrop: true,
      control: true,
	  //orientation: "horizontal",
	  nodeHeight: 48
	  
    };
	$("#org").jOrgChart(opts);
	});

	
This call will append the markup for the OrgChart to the `<body>` element by default, but you can specify this as part of the options.


------

##Demo Page

Demo of the code is unavailable. May be someone do it!? Write me and I paste your link here 

-----

##Configuration

Here the below configurations.

1. **chartElement** - used to specify which HTML element you'd like to append the OrgChart markup to. *[default='body']*
2. **depth** - tells the code what depth to parse to. The default value of "-1" instructs it to parse like it's 1999. *[default=-1]*
3. **chartClass** - the name of the style class that is assigned to the generated markup. *[default='jOrgChart']*
4. **dragAndDrop** - determines whether the drag-and-drop feature of tree node elements is enabled. *[default=false]*
5. **orientation** - mode view of the tree. *["horizontal"/"vertical"]* *[default="vertical"]*
6. **control** - Enable options to ADD, EDIT and DELETE the nodes. *[default=false]*
7. **nodeHeight** - Must be set in vertical mode. nodeHeight must be a sum of div.node height, paddings, margins and borders
For example in this css

******
-----
###The CSS
.jOrgChart .node {
  background-color 		: rgba(53, 115, 156, 0.7);
  width                 : 150px;
  height                : 30px;
  z-index 				: 10;
  border-radius: 2px;
  color: #fff;
  font-family: Arial;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 4px 8px;
  text-transform: uppercase;
  border: 1px solid white;
}
.vertical .node {
  margin               : 4px 0;
}
-----
******

nodeHeight=height (30px) + padding (4px*2) + border (1px*2) + margin (4px*2) = 30px+8px+2px+8px=48px
So, in this case nodeHeight must be set to 48 (without 'px')

