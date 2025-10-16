/**
 * Gets the needed data from a twitch notifcaiton
 * @param {number} event_data - The notifcation.
 * @returns {user_name: string, broadcaster_user_name: string, type: string } The user_name, broadcaster_user_name, and the type of notifcation
 */
export function serializeDataV1(event_data) {
  var user_name = event_data.event.user_name;
  var broadcaster_user_name = event_data.event.broadcaster_user_name;
  var type = event_data.subscription.type;
  return {
    user_name: user_name,
    broadcaster_user_name: broadcaster_user_name,
    type: type,
  };
}

export function serializeData(event_data) {
  var user_name = event_data.event.user_name;
  var broadcaster_user_name = event_data.event.broadcaster_user_name;
  var type = event_data.subscription.type;
  var json = {};
  console.log("HERE-", event_data);
  if (type == "channel.follow") {
    json = {
      type: "follow",
      user_name: user_name,
      broadcaster_user_name: broadcaster_user_name,
    };
  }
  if (type == "channel.subscribe") {
    json = {
      type: "subscribe",
      user_name: user_name,
      broadcaster_user_name: broadcaster_user_name,
      teir: event_data.event.teir,
      is_gift: event_data.event.gift,
    };
  }
  if (type == "channel.cheer") {
    json = {
      type: "cheer",
      user_name: user_name,
      broadcaster_user_name: broadcaster_user_name,
      message: event_data.event.message, // pogchamp
      bits: event_data.event.bits, // 1000
    };
  }
  if (type == "channel.bits.use") {
    json = {
      type: "bits",
      user_name: user_name,
      broadcaster_user_name: broadcaster_user_name,
      bits: event_data.event.bits,
      event_type: event_data.event.event, // type: "cheer",
      power_up: event_data.event.power_up, // power_up: null,
      message: event_data.event.message, // This will be multiple objects
    };
  }
  if (type == "channel.raid") {
    json = {
      broadcaster_user_name: event_data.event.to_broadcaster_user_name,
      type: "raid",
      from_broadcaster_user_name: event_data.event.from_broadcaster_user_name,
      to_broadcaster_user_name: event_data.event.to_broadcaster_user_name,
      viewers: event_data.event.viewers,
    };
  }
  if (type == "channel.subscription.gift") {
    json = {
      type: "gift",
      user_name: user_name,
      broadcaster_user_name: broadcaster_user_name,
      teir: event_data.event.teir,
      total: event_data.event.total, // Number of gifts
    };
    //cumulative_total: 284, //null if anonymous or not shared by the user
    //is_anonymous: false,
  }
  return json;
}
