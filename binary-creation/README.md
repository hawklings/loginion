# Binary Creation sub-folder

This is used to create the various distributable binaries for cross-platform support.

First install `nw-builder` globally by running

```
npm install nw-builder -g
```

To actually build all platform versions, use

```
npm build.js
```


Built binaries are present in the `build` folder.

TODO
====

Write a script that auto-generates build for tagged releases, with a changelog pulled
from a known file. Also uploads this to github.

Use the [Github Releases API](https://developer.github.com/v3/repos/releases/) to do this.