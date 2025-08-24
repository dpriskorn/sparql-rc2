import axios from "axios";
const USER_AGENT =
  "https://github.com/dpriskorn/topic-curator-frontend/ by User:So9q";

export const WIKIBASE_REST_API =
  "https://www.wikidata.org/w/rest.php/wikibase/v1";

export const restApiClient = axios.create({
  baseURL: WIKIBASE_REST_API,
  headers: {
    "User-Agent": USER_AGENT,
  },
});
