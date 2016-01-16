# Binary Creation sub-folder

This is used to create the binaries for distribution.


## Installing

install `nw-builder` globally by running

```
npm install nw-builder -g
```

## Generating build files

To build for all platform versions, run:

```
npm build.js
```

This will create the binaries for all platforms (`linux32/64`, `osx32/64`, `windows`)
Built binaries are present in the `build/` folder, which can then be uploaded.

TODO
====

Write a script that auto-generates build for tagged releases, with a changelog pulled
from a known file. Also uploads this to github.

Use the [Github Releases API](https://developer.github.com/v3/repos/releases/) to do this.