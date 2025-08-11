```
$ become sparql-rc2
$ toolforge build start https://github.com/dpriskorn/sparql-rc2.git --envvar USE_NPM_INSTALL
$ # wait until command finishes
```

Indeed it did work.

This is how you start it
```
$ toolforge webservice --mount=none buildservice start