// go to jest docs

// import { it } from "zod/locales";
import {
  serializeDataV1,
  serializeData,
} from "../socket_utils/twitchNoti_utils.js";
import {
  follow_payload,
  bits_payload,
  raid_payload,
  cheer_payload,
  subscriber_payload,
} from "./payload.js";

it("Get the serialzed Data for a follow payload", () => {
  const data = serializeDataV1(follow_payload);
  expect(data).toMatchObject({
    user_name: expect.any(String),
    broadcaster_user_name: expect.any(String),
    type: expect.any(String),
  });
});

it("Get the serialzed Data for a bits payload", () => {
  const data = serializeDataV1(bits_payload);
  expect(data).toMatchObject({
    user_name: expect.any(String),
    broadcaster_user_name: expect.any(String),
    type: expect.any(String),
  });
});

it("Get the serialzed Data for a raid payload", () => {
  const data = serializeData(raid_payload);
  expect(data).toMatchObject({
    from_broadcaster_user_name: expect.any(String),
    to_broadcaster_user_name: expect.any(String),
    type: expect.any(String),
  });
});

it("Get the serialzed Data for a cheer payload", () => {
  const data = serializeDataV1(cheer_payload);
  expect(data).toMatchObject({
    user_name: expect.any(String),
    broadcaster_user_name: expect.any(String),
    type: expect.any(String),
  });
});

it("Get the serialzed Data for a subscriber payload", () => {
  const data = serializeDataV1(subscriber_payload);
  expect(data).toMatchObject({
    user_name: expect.any(String),
    broadcaster_user_name: expect.any(String),
    type: expect.any(String),
  });
});
