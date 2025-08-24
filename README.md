# sparql-rc2
This is a Python backend and React frontend rewrite of https://bitbucket.org/magnusmanske/wikidata-todo/src/master/public_html/sparql_rc.php by Magnus Manske which recently stopped working. It has been extended with entity validation based on [EntityShape](https://github.com/Teester/entityshape) by Mark Tully

## Features
This tool helps contributors track Recent Changes to entities using SPARQL queries and EntitySchemas

## Backends
I built two Python backends to make this tool work. I decided to speed things up by patching EntityShape to no longer download labels. 
See https://sparql-rc2-backend.toolforge.org/ and https://github.com/dpriskorn/sparql-rc2-backend
See https://entityvalidator-backend.toolforge.org/ and https://github.com/dpriskorn/entityvalidator-backend

## Thanks
Thanks to Magnus Manske for the idea to get recent changes based on a SPARQL query and Mark Tully for updating EntityShape to support lexemes and use JSONLD as a basis for the validation.

## What I learned and did
* ChatGPT-5 is very good at coding React and Python but it still needs quite a lot of hand-holding to get things right. It's very nice that it remembers between chats now.
* Copy markdown plugin in VSCodium is great for copying code to a chatbot so it gets the right context.
* The combination of a well oiled Python backend and a smooth and fast React frontend is very nice!
* I had to find the database schema of wikidatawiki for the chatbot to make correct SQL.
* I improved documentation in toolforge on replica database environment variables because it could not be found by the chatbot
* It was a bit challenging to overload the EntityShape classes such that they skip downloading labels and speed the validation up.

## License
GPLv3+
