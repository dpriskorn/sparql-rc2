# DEPLOYMENT
```
$ become sparql-rc2
$ toolforge build start https://github.com/dpriskorn/sparql-rc2.git --envvar USE_NPM_INSTALL
$ toolforge webservice --mount=none buildservice restart
```
Debug with
`$ webservice logs -f`