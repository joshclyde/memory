import { describe, expect, it } from "@jest/globals";
import { Timestamp } from "firebase/firestore";
import {
  convertComputedFields,
  convertLastModified,
  convertTimestampToString,
} from "../firestore";

/*
  Since I'm dealing with time, these tests may fail depending on what device
  I am running the test on. Eventually, may need to fix this. But not an
  issue for now.
*/
describe("Firestore Utils", () => {
  describe("convertTimestampToString", () => {
    it("should convert a Firestore Timestamp to a string", () => {
      expect(
        convertTimestampToString(
          Timestamp.fromDate(new Date("December 17, 1995 03:24:00"))
        )
      ).toBe("Sun Dec 17 1995 03:24:00 GMT-0500 (Eastern Standard Time)");
    });
  });
  describe("convertLastModified", () => {
    it("should convert the lastModified Timestamp field to a string", () => {
      expect(
        convertLastModified({
          lastModified: Timestamp.fromDate(
            new Date("December 17, 1995 03:24:00")
          ),
        })
      ).toMatchObject({
        lastModified:
          "Sun Dec 17 1995 03:24:00 GMT-0500 (Eastern Standard Time)",
      });
    });
  });
  describe("convertComputedFields", () => {
    it("should convert the lastModified and createdDate Timestamp fields to a string", () => {
      expect(
        convertComputedFields({
          lastModified: Timestamp.fromDate(
            new Date("December 17, 1995 03:24:00")
          ),
          createdDate: Timestamp.fromDate(
            new Date("December 16, 1995 03:24:00")
          ),
        })
      ).toMatchObject({
        lastModified:
          "Sun Dec 17 1995 03:24:00 GMT-0500 (Eastern Standard Time)",
        createdDate:
          "Sat Dec 16 1995 03:24:00 GMT-0500 (Eastern Standard Time)",
      });
    });
  });
});
