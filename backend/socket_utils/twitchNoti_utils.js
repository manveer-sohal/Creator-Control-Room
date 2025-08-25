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

export function serializeDataV2(event_data) {
  var to_broadcaster_user_name = event_data.event.to_broadcaster_user_name;
  var from_broadcaster_user_name = event_data.event.from_broadcaster_user_name;
  var type = event_data.subscription.type;
  return {
    from_broadcaster_user_name: from_broadcaster_user_name,
    to_broadcaster_user_name: to_broadcaster_user_name,
    type: type,
  };
}

const subscription_dict = {};

export function checkPayloadType(event_data) {
  var subscription_type = event_data.payload.subscription.type;
  console.log(subscription_type);
}
