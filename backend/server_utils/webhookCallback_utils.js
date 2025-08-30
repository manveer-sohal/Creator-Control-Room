export function verifyHMACSignature(hmacMessage, signature) {
  const hmac = crypto
    .createHmac("sha256", CLIENT_SECRET)
    .update(hmacMessage)
    .digest("hex");

  const expectedSignature = `sha256=${hmac}`;

  if (signature !== expectedSignature) {
    console.error("Invalid signature");
    return 403;
  }
  return 200;
}

export function logRevocation(notification) {
  console.log(`${notification.subscription.type} notifications revoked!`);
  console.log(`reason: ${notification.subscription.status}`);
  console.log(
    `condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`
  );
}
