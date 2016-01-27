# Binary Creation sub-folder

This is used to create the various distributable binaries for cross-platform support.

First install `nw-builder` globally by running

```
npm install nw-builder -g
```

Copy `build.js.sample` to `build.js` and modify the settings needed (you will most likely only
need to change the `platforms` option).

To actually build all platform versions, use

```
npm build.js
```


Built binaries are present in the `build` folder.

Changing Favicon
================

If you choose to change the favicon, then please generate new `.ico` (for windows) and `.icns` (for mac) files
from [IConvert Icons](https://iconverticons.com/online/). 

To Do
====

Write a script that auto-generates build for tagged releases, with a changelog pulled
from a known file. Also uploads this to github.

Use the [Github Releases API](https://developer.github.com/v3/repos/releases/) to do this.