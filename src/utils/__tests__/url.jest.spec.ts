import { describe, expect, it } from "@jest/globals";
import * as urlUtils from "../url";

describe("url utils", () => {
  it.each(Object.entries(urlUtils))("%s", (_, url) => {
    if (typeof url === "string") {
      expect(url).toMatchSnapshot();
    } else {
      expect(url("foo")).toMatchSnapshot();
    }
  });
});
