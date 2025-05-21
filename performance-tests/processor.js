/**
 * Custom functions for Artillery performance tests
 * These functions are referenced in load-test.yml and provide
 * dynamic data generation for test scenarios.
 */

/**
 * Generates a random username and stores it in the context
 * Usage in YAML: - function: "setRandomUsername"
 *
 * @param {Object} context - The Artillery context object
 * @param {Object} events - Event hooks
 * @param {Function} done - Callback to signal completion
 */
function setRandomUsername(context, events, done) {
  // Generate a random string for username
  const randomString = Math.random().toString(36).substring(2, 10);
  // Create a username with "testuser_" prefix
  context.vars.randomUsername = `testuser_${randomString}`;

  // Log the generated username for debugging (optional)
  console.log(`Generated random username: ${context.vars.randomUsername}`);

  return done();
}

/**
 * Sets realistic reservation times in the context
 * Generates start time (now + 1 hour) and end time (start + 2 hours)
 * Usage in YAML: - function: "setReservationTimes"
 *
 * @param {Object} context - The Artillery context object
 * @param {Object} events - Event hooks
 * @param {Function} done - Callback to signal completion
 */
function setReservationTimes(context, events, done) {
  const now = new Date();

  // Start time: 1 hour from now
  const startTime = new Date(now.getTime() + 60 * 60 * 1000);

  // End time: 3 hours from now (2 hours after start time)
  const endTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);

  // Updated times for reservation updates (shift by 30 minutes)
  const updatedStartTime = new Date(startTime.getTime() + 30 * 60 * 1000);
  const updatedEndTime = new Date(endTime.getTime() + 30 * 60 * 1000);

  // Store ISO string format for API compatibility
  context.vars.startTime = startTime.toISOString();
  context.vars.endTime = endTime.toISOString();
  context.vars.updatedStartTime = updatedStartTime.toISOString();
  context.vars.updatedEndTime = updatedEndTime.toISOString();

  // Log the generated times for debugging (optional)
  console.log(
    `Reservation time range: ${context.vars.startTime} to ${context.vars.endTime}`,
  );

  return done();
}

/**
 * Generate random test data for file uploads
 * Creates a simple text file with random content
 * Usage in YAML: - function: "generateTestFile"
 *
 * @param {Object} context - The Artillery context object
 * @param {Object} events - Event hooks
 * @param {Function} done - Callback to signal completion
 */
function generateTestFile(context, events, done) {
  // Generate a simple text file content (simulated)
  const randomContent = `This is a test file generated at ${new Date().toISOString()}
Content-ID: ${Math.random().toString(36).substring(2, 15)}
Random data: ${Array(50)
    .fill()
    .map(() => Math.random().toString(36).charAt(2))
    .join('')}`;

  // Store the file content in the context
  context.vars.fileContent = Buffer.from(randomContent).toString('base64');
  context.vars.fileName = `test-${Math.random()
    .toString(36)
    .substring(2, 10)}.txt`;
  context.vars.fileSize = randomContent.length;

  return done();
}

/**
 * Export all functions that will be used in the test scenarios
 */
module.exports = {
  setRandomUsername,
  setReservationTimes,
  generateTestFile,
};
