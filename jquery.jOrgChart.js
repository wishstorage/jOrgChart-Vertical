/**
 * jQuery org-chart/tree plugin.
 *
 * Author: Nikolay Zubarev
 *
 * Based on the work of Mark Lee
 * http://www.capricasoftware.co.uk
 *
 * Copyright (c) 2015 Nikolay Zubarev
 * Dual licensed under the MIT and GPL licenses.
 *
 */
(function($) {

    $.fn.jOrgChart = function(options) {
        var opts = $.extend({}, $.fn.jOrgChart.defaults, options);
        var $appendTo = $(opts.chartElement);

        // build the tree
        $this = $(this);
        var $container = $("<div class='" + opts.chartClass +" "+ opts.orientation +"'/>");
        if($this.is("ul")) {
            buildNode($this.find("li:first"), $container, 0, opts);
        }
        else if($this.is("li")) {
            buildNode($this, $container, 0, opts);
        }
        $appendTo.append($container);

        // add drag and drop if enabled
        if(opts.dragAndDrop){
            $('div.node').draggable({
                cursor      : 'move',
                distance    : 40,
                helper      : 'clone',
                opacity     : 0.8,
                revert      : 'invalid',
                revertDuration : 100,
                snap        : 'div.node.expanded',
                snapMode    : 'inner',
                stack       : 'div.node'
            });

            $('div.node').droppable({
                accept      : '.node',
                activeClass : 'drag-active',
                hoverClass  : 'drop-hover'
            });

            // Drag start event handler for nodes
            $('div.node').bind("dragstart", function handleDragStart( event, ui ){

                var sourceNode = $(this);
                sourceNode.parentsUntil('.node-container')
                    .find('*')
                    .filter('.node')
                    .droppable({ disabled: true }).css('border','1px dotted red');
                sourceNode.css('border','2px solid white');
                ui.helper.css("border", "1px solid white");
            });

            // Drag stop event handler for nodes
            $('div.node').bind("dragstop", function handleDragStop( event, ui ){

                /* reload the plugin */
                $(opts.chartElement).children().remove();
                $this.jOrgChart(opts);
            });

            // Drop event handler for nodes
            $('div.node').bind("drop", function handleDropEvent( event, ui ) {

                var targetID = $(this).data("tree-node");
                var targetLi = $this.find("li").filter(function() { return $(this).data("tree-node") === targetID; } );
                var targetUl = targetLi.children('ul');

                var sourceID = ui.draggable.data("tree-node");
                var sourceLi = $this.find("li").filter(function() { return $(this).data("tree-node") === sourceID; } );
                var sourceUl = sourceLi.parent('ul');

                if (targetUl.length > 0){
                    targetUl.append(sourceLi);
                } else {
                    targetLi.append("<ul></ul>");
                    targetLi.children('ul').append(sourceLi);
                }

                //Removes any empty lists
                if (sourceUl.children().length === 0){
                    sourceUl.remove();
                }

            }); // handleDropEvent

        } // Drag and drop
    };

    // Option defaults
    $.fn.jOrgChart.defaults = {
        chartElement : 'body',
        depth      : -1,
        chartClass : "jOrgChart",
        dragAndDrop: false,
        orientation: "vertical"
    };

    var nodeCount = 0;
    // Method that recursively builds the tree
    function buildNode($node, $appendTo, level, opts) {
        if(opts.orientation=="vertical")
        {
            var td_tr_str="td";
            var td_tr_str2="tr";
            var row_col_span_str="rowspan";
            var cursor_type_1="e-resize";
            var cursor_type_2="w-resize";
        }
        else if(opts.orientation=="horizontal")
        {
            var td_tr_str="tr";
            var td_tr_str2="td";
            var row_col_span_str="colspan";
            var cursor_type_1="n-resize";
            var cursor_type_2="s-resize";
        }
        var $table = $("<table cellpadding='0' cellspacing='0' border='0'/>");
        var $tbody = $("<tbody/>");

        // Construct the node container(s)
        var $nodeRow = $("<tr/>").addClass("node-cells");
        var $nodeCell = $("<td/>").addClass("node-cell").attr(row_col_span_str, 2);
        var $childNodes = $node.children("ul:first").children("li");
        var $nodeDiv;

        if($childNodes.length > 1) {
            $nodeCell.attr(row_col_span_str, $childNodes.length * 2);
        }
        // Draw the node
        // Get the contents - any markup except li and ul allowed
        var $nodeContent = $node.clone()
            .children("ul,li")
            .remove()
            .end()
            .html();

        //Increaments the node count which is used to link the source list and the org chart
        nodeCount++;
        $node.data("tree-node", nodeCount);
        $nodeDiv = $("<div>").addClass("node")
            .data("tree-node", nodeCount)
            .append($nodeContent);

        $nodeDiv.append(
            "<div class='opciones'>" +
            "</div>");

        // Expand and contract nodes
        if ($childNodes.length > 0) {
            $nodeDiv.click(function() {
                var $this = $(this);
                var $td_tr = $this.closest(td_tr_str);

                if($td_tr.hasClass('contracted')){
                    $this.css('cursor',cursor_type_1);
                    $td_tr.removeClass('contracted').addClass('expanded');
                    if(opts.orientation=="vertical")
                    {
                        $td_tr.parent().nextAll(td_tr_str).css('visibility', '');
                    }
                    else if(opts.orientation=="horizontal")
                    {
                        $td_tr.nextAll(td_tr_str).css('visibility', '');
                    }

                    // Update the <li> appropriately so that if the tree redraws collapsed/non-collapsed nodes
                    // maintain their appearance
                    $node.removeClass('collapsed');
                }else{
                    $this.css('cursor',cursor_type_2);
                    $td_tr.removeClass('expanded').addClass('contracted');
                    if(opts.orientation=="vertical")
                    {
                        $td_tr.parent().nextAll(td_tr_str).css('visibility', 'hidden');
                    }
                    else if(opts.orientation=="horizontal")
                    {
                        $td_tr.nextAll(td_tr_str).css('visibility', 'hidden');
                    }

                    $node.addClass('collapsed');
                }
            });
        }

        $nodeCell.append($nodeDiv);
        $nodeRow.append($nodeCell);
        $tbody.append($nodeRow);

        if($childNodes.length > 0) {
            // if it can be expanded then change the cursor
            $nodeDiv.css('cursor',cursor_type_1);

            // recurse until leaves found (-1) or to the level specified
            if(opts.depth == -1 || (level+1 < opts.depth)) {
                var $downLineRow = $("<"+td_tr_str+"/>");
                var $downLineCell = $("<"+td_tr_str2+"/>").attr(row_col_span_str, $childNodes.length*2);
                $downLineRow.append($downLineCell);

                // draw the connecting line from the parent node to the horizontal line
                $downLine = $("<div></div>").addClass("line down");
                $downLineCell.append($downLine);
                $tbody.append($downLineRow);

                // Draw the horizontal lines
                var $linesRow = $("<"+td_tr_str+"/>");
                if(opts.orientation=="vertical")
                {
                    $childNodes.each(function(i) {
                        var CurrentEndListsCount=$(this).find("li:not(:has( > ul))").size();
                        if(CurrentEndListsCount==0 || CurrentEndListsCount==1)
                        {
                            var f_h=opts.nodeHeight/2;
                        }
                        else
                        {

                            var f_h=opts.nodeHeight*CurrentEndListsCount/2;
                        }
                        var $tr=$("<tr height='"+f_h+"' />");
                        var $tr2=$("<tr height='"+f_h+"' />");
                        if(i==0)
                        {
                            if(i==($childNodes.size()-1))
                            {
                                var $left = $tr.append($("<td>&nbsp;</td>").addClass("line top"));
                                var $right = $tr2.append($("<td>&nbsp;</td>").addClass("line bottom"));
                            }
                            else
                            {
                                var $left = $tr.append($("<td>&nbsp;</td>").addClass("line right top"));
                                var $right = $tr2.append($("<td>&nbsp;</td>").addClass("line bottom"));
                            }

                        }
                        else
                        {
                            if(i==($childNodes.size()-1))
                            {
                                var $left = $tr.append($("<td>&nbsp;</td>").addClass("line top"));
                                var $right = $tr2.append($("<td>&nbsp;</td>").addClass("line right bottom"));
                            }
                            else
                            {
                                var $left = $tr.append($("<td>&nbsp;</td>").addClass("line right top"));
                                var $right = $tr2.append($("<td>&nbsp;</td>").addClass("line right bottom"));
                            }
                        }
                        $linesRow.append($right).append($left);
                    });
                }
                else if(opts.orientation=="horizontal")
                {
                    $childNodes.each(function() {
                        var $left = $("<td>&nbsp;</td>").addClass("line left top");
                        var $right = $("<td>&nbsp;</td>").addClass("line right top");
                        $linesRow.append($left).append($right);
                    });
                }


                // horizontal line shouldn't extend beyond the first and last child branches
                $linesRow.find(td_tr_str2+":first")
                    .removeClass("top")
                    .end()
                    .find(td_tr_str2+":last")
                    .removeClass("top");

                $tbody.append($linesRow);
                var $childNodesRow = $("<"+td_tr_str+"/>");
                $childNodes.each(function() {
                    var $tr_td = $("<"+td_tr_str2+" class='node-container'/>");
                    $tr_td.attr(row_col_span_str, 2);
                    // recurse through children lists and items
                    buildNode($(this), $tr_td, level+1, opts);
                    $childNodesRow.append($tr_td);
                });

            }
            $tbody.append($childNodesRow);
        }

        // any classes on the LI element get copied to the relevant node in the tree
        // apart from the special 'collapsed' class, which collapses the sub-tree at this point
        if ($node.attr('class') != undefined) {
            var classList = $node.attr('class').split(/\s+/);
            $.each(classList, function(index,item) {
                if (item == 'collapsed') {
                    console.log($node);
                    $nodeRow.nextAll(td_tr_str).css('visibility', 'hidden');
                    if(opts.orientation=="vertical")
                    {
                        $nodeCell.removeClass('expanded');
                        $nodeCell.addClass('contracted');
                    }
                    else if(opts.orientation=="horizontal")
                    {
                        $nodeRow.removeClass('expanded');
                        $nodeRow.addClass('contracted');
                    }
                    $nodeDiv.css('cursor',cursor_type_2);
                } else {
                    $nodeDiv.addClass(item);
                }
            });
        }
        if (opts.control) {
            if (!$nodeDiv.hasClass("root")) {
                $nodeDiv.find(".opciones:eq(0)").append("<span class='edit' href='#fancy_edit'></span>");
                $nodeDiv.find(".opciones:eq(0)").append("<span class='add' href='#fancy_add'></span>");
                if ($nodeDiv.hasClass("child")) {
                    $nodeDiv.find(".opciones:eq(0)").append("<span class='del'></span>");
                }
            } else {
                $nodeDiv.find(".opciones:eq(0)").append("<span class='add' href='#fancy_add'></span>");
            }
        }
        $table.append($tbody);
        $appendTo.append($table);

        /* Prevent trees collapsing if a link inside a node is clicked */
        $nodeDiv.children('a').click(function(e){
            console.log(e);
            e.stopPropagation();
        });
    };

})(jQuery);