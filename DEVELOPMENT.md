# Developer documentation

## Technical implementation

This tool uses React + Vite in the frontend. It is basically gluing together the wikidatawiki revision database with a validation tool written in Python using 2 backends.

We currently use 2 backends:
1. revisions - this backend fetches revisions based on the user input from the mediawiki mysql database
2. validator - this backend download and validates each entity according to a specific entityschema.

Everything is hosted in Toolforge and built using the container build-system there.

### Principles
This app is based on 2 guiding principles:
1. Nobody wants to wait. 
2. Keep it simple, stupid

The waiting is reduced by 
1. in the revisions backend we only access the database and nothing else. No fetching of labels, lemmas or anything that takes extra time.
2. in the validation backend we allow batch validation of up to 100 entities at a time. We download the entities asynchronously which saves time. Then we validate them synchronously.

None of the backends should take more than 1-2 seconds for processing 100 revisions/entities and that goal has been reached in the MVP.

TODO use 4 workers in each backend so users don't have to wait for a worker to be available.

### Code structure

This is a small MVP React app with 2 pages, a handful of components and one model.

The user story map roughly is:
1. get input from the user
2. fetch revisions from one backend
3. display result
4. validate result entities
5. display validation result

The code is split in these directories
```
src/
├── components
├── layout
├── models
└── pages
```

#### components
This directory have components. This is functionality that is split betweeen multiple pages or fleshed out to make the code easier to read.

At the time of writing we have the following components:
```
src/components
├── src/components/apiClient.tsx
├── src/components/revisions
│   ├── src/components/revisions/NoticeLink.tsx
│   ├── src/components/revisions/QueryInputFields.tsx
│   ├── src/components/revisions/QueryInputForm.tsx
│   ├── src/components/revisions/ResultLinks.tsx
│   ├── src/components/revisions/ResultsTable.tsx
│   └── src/components/revisions/useFetchRevisions.tsx
└── src/components/validation
    ├── src/components/validation/EntityValidator.tsx
    ├── src/components/validation/QueryInputFields.tsx
    ├── src/components/validation/QueryInputForm.tsx
    └── src/components/validation/ValidateLink.tsx
```

Hopefully the names of the files gives you an idea about the logic that each of them contain

#### layout
```
src/layout
└── src/layout/Navbar.tsx
└── src/layout/Footer.tsx
```

#### models
This directory is for typescript OOP classes that are used in the react components
```
src/models
├── src/models/Entity.tsx
└── src/models/WDQS.tsx
```

#### pages
Currently we have 2 pages
```
src/pages
├── src/pages/CoMaintainer.tsx
├── src/pages/RevisionsTool.tsx
└── src/pages/Validate.tsx
```

### Local development 

#### Set up 

How to set up development environment:
* Download vscode or vscodium
* Install the [copy combined markdown plugin](https://marketplace.visualstudio.com/items?itemName=skaramicke.copy-combined-markdown) and plugins for react and js development e.g. Babel ES6/ES7, ES7 react, prettier, etc.
* Install npm in your operating system

#### Install

How to install:
* Install all project requirements with `$ npm install` 

#### Run locally

* Run using `$ npm run dev`

#### Build and test 

How to build and run locally:
* Build using `$ npm build` 

How to run tests:
* At present there are no tests. Feel free to send a pull request!

# Tips
## Suggested workflow
* Copy the relevant files using copy combined markdown and tell the chatbot what you want changed.
* Copy paste into your IDE
* Test locally in a browser
* (Write a test and make sure it passes)
* Send a pull request