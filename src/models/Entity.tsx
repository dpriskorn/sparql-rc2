import { restApiClient } from "../components/apiClient";


class Entity {
  // todo detect entity type based on id and adapt accordingly
  public qid: string;
  public lang: string;

  constructor(qid: string, lang: string) {
    // Remove "http://www.wikidata.org/entity/" if present
    qid = qid.replace(/^http:\/\/www\.wikidata\.org\/entity\//, "");

    // Validate the qid format
    if (!/^Q\d+$/.test(qid)) {
      throw new Error(`Invalid qid: ${qid}. Expected format: "Q1234".`);
    }

    this.qid = qid;
    this.lang = lang;
  }
  /**
   * Returns the Wikidata URL for the item's QID.
   */
  get qidUrl(): string {
    return `https://www.wikidata.org/wiki/${this.qid}`;
  }
    /**
   * Fetches the description for the given QID in the specified language.
   */
  async fetchDescription(): Promise<string> {
    try {
      const descriptionUrl = `/entities/items/${this.qid}/descriptions`;
      const response = await restApiClient.get(descriptionUrl);

      if (response.status === 200) {
        return response.data[this.lang] || "No description yet, please improve";
      } else {
        throw new Error(`Description fetch error: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Description fetch error: ${error}`);
    }
  }
  /**
   * Fetches the label for the given QID in the specified language.
   */
  async fetchLabel(): Promise<string> {
    try {
      const descriptionUrl = `/entities/items/${this.qid}/labels`;
      const response = await restApiClient.get(descriptionUrl);

      if (response.status === 200) {
        return response.data[this.lang] || "No label yet, please improve";
      } else {
        throw new Error(`Label fetch error: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Label fetch error: ${error}`);
    }
  }
}

export { Entity };
