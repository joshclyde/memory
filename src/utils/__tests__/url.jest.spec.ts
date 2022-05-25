import { describe, expect, it } from "@jest/globals";
import * as urlUtils from "../url";

describe("url utils", () => {
  it.each(Object.entries(urlUtils))("%s", (name, thing) => {
    if (typeof thing === "string") {
      expect(thing).toMatchSnapshot();
    } else {
      expect(thing("foo")).toMatchSnapshot();
    }
  });
});
