How do I use this?

Go to patatap.com
Paste this into the js console:
```
var script = $("<script></script");
var baseGit = "https://rawgit.com/mjvotaw/a-patatap-sequencer/master";
script.attr("src", baseGit + "/sequencer.js");
$("body").append(script);
```
And enjoy!