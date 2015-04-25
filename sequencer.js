var sequence = [];
var beatInterval = 500;
var beatIndex = 0;
var shouldPlay = false;
var measureIndex = 0;

var beatsPerMeasure = 32;

function beatHandler()
{
	$(".sequenceBeat.active").removeClass("active");
	$(".sequenceBeat").eq((beatsPerMeasure * measureIndex) + beatIndex).addClass("active");
	
	var s = sequence[measureIndex][beatIndex];
	for(var i = 0; i < s.length; i++)
	{
		var c = s[i].toUpperCase().charCodeAt(0);
		var e = jQuery.Event("keydown");
		e.which = c;
		e.keyCode = c;
		$(window).trigger(e);
	}
	beatIndex = (beatIndex + 1) % beatsPerMeasure;
	if(shouldPlay)
	{
		interval = setTimeout(beatHandler, beatInterval);
	}
}



var interval = null;

function startSequencer()
{
	shouldPlay = true;
	interval = setTimeout(beatHandler, beatInterval);
}

function stopSequencer()
{
	shouldPlay = false;
}

function addBeat()
{
	var beat = $("<div class='sequenceBeat'></div>");
	beat.attr("data-beat-index", $(".measure").last().find(".sequenceBeat").length);
	$(".measure").last().append(beat);
	return beat;
}

function addNote(beat, note)
{
	var noteItem = $("<div class='note' contenteditable='true'></div>");
	noteItem.attr("data-note-index", beat.children(".note").length);
	noteItem.html(note);
	beat.append(noteItem);
	return noteItem;
}

function addMeasure()
{
	var measureCount = sequence.length;
	
	var measure = $("<div class='measure measure_" + measureCount + "' data-measure-index='"+measureCount+"'></div>");
	$("#sequenceContainer").append(measure);
	$(".measure.active").removeClass("active");
	measure.addClass("active");
	
	var seqMeasure = [];
	for(var i = 0; i < beatsPerMeasure; i++)
	{
		var index = i + sequence.length;
		seqMeasure.push(["", "", "", ""]);
		var beat = addBeat();		
		for(var b = 0; b < 4; b++)
		{
			addNote(beat, "");
		}
	}
	sequence.push(seqMeasure);
	measureIndex = measureCount;
	return measure;
}


function nextMeasure()
{
	measureIndex++;
	if(measureIndex >= sequence.length)
	{
		measureIndex = 0;
	}
	
	$(".measure.active").removeClass("active");
	$(".measure_" + measureIndex).addClass("active");
}

function prevMeasure()
{
	measureIndex--;
	if(measureIndex < 0)
	{
		measureIndex = sequence.length - 1;
	}
	
	$(".measure.active").removeClass("active");
	$(".measure_" + measureIndex).addClass("active");
}

function clearMeasure()
{
	for(var i = 0; i < sequence[measureIndex].length; i++)
	{
		for(var j = 0; j < sequence[measureIndex][i].length; j++)
		{
			sequence[measureIndex][i][j] = "";
			$(".measure.active .sequenceBeat").eq(i).find(".note").eq(j).html("");
		}
	}
}


function setupSequenceContainer()
{
	var seq = $("#sequenceContainer");
	seq.html("");

	addMeasure();
}



function buildSequencer()
{
	
	$('head').append('<link rel="stylesheet" href=' + baseGit + '"/sequencer.css" type="text/css" />');
	var container = $("<div></div>");
	container.attr("id", "sequencer");
	$("body").append(container);
	
	//sub-containers
	
	var sliders = $("<div></div>");
	sliders.attr("id", "sliders");
	container.append(sliders);
	
	
	//inputs
	var bpmRange = $("<input />");
	bpmRange.attr("type", "range");
	bpmRange.attr("min","60");
	bpmRange.attr("max", "300");
	bpmRange.attr("step", "1");
	bpmRange.attr("value", "120");
	bpmRange.attr("name", "bpmRange");
	bpmRange.attr("id", "bpmRange");
	
	var bpmOutput = $('<span id="bpmDisplay"></span>');
	bpmOutput.html(bpmRange.val());
	sliders.append(bpmRange);
	sliders.append(bpmOutput);

	var prev = $("<button class='nextMeasure'> &lt;</button>");	
	var next = $("<button class='nextMeasure'> &gt;</button>");
	var add = $("<button class='addMeasure'>+</button>");
	var clear = $("<button class='clearMeasure'>clear</button>");
	sliders.append(prev);
	sliders.append(next);
	sliders.append(add);	
	sliders.append(clear);
	// sequencer set
	
	var sequenceContainer = $("<div id='sequenceContainer'></div>");
	
	container.append(sequenceContainer);	
	
	//input bindings
	
	bpmRange.on("input change", function(){
		var bpm = bpmRange.val();
		bpmOutput.html(bpm);
		
		var bpm_milli =  Math.floor((60 / bpm) * 1000);
		beatInterval = bpm_milli;
		
		
	});
	
	prev.on("click", function(){
		prevMeasure();
	});
	
	next.on("click", function(){
		nextMeasure();
	});
	
	add.on("click", function(){
		addMeasure();
	});
	
	clear.on("click", function(){
		clearMeasure();
	});
	
	$("body").on("keydown", ".note", function(e){

		
		var character = String.fromCharCode(e.which);
		var noteIndex = $(this).data("note-index");
		var beatIndex = $(this).parent(".sequenceBeat").data("beat-index");

		if (! (/[a-zA-Z]/.test(character)))
		{
			if(e.which == 8 || e.which == 46)
			{
				e.stopPropagation();
				sequence[measureIndex][beatIndex][noteIndex] = "";
				$(this).html("");
				return false;
			}
			return true;
		}
		e.stopPropagation();
		sequence[measureIndex][beatIndex][noteIndex] = character.toUpperCase();		
		$(this).html(character.toUpperCase());
		return false;
	});
	
	$("body").on("keydown", function(e){
		if(e.which == 39)
		{
			nextMeasure();
		}
		return true;
	});
	
	$("body").on("keydown", function(e){
		if(e.which == 37)
		{
			nextMeasure();
		}
		return true;
	});
	
}




buildSequencer();
setupSequenceContainer();
startSequencer();