import supertest from "supertest";
import { app, createServer } from "../app.js";

describe("Health endpoint tests", () => {
  let server;

  beforeAll(() => {
    // Create the server but don’t listen automatically
    server = createServer().listen(0); // random free port
  });

  afterAll((done) => {
    server.close(done);
  });

  test("GET /healthz should return 200 with ok message", async () => {
    await supertest(app)
      .get("/healthz")
      .expect(200)
      .then((res) => {
        expect(res.text).toContain("ok"); // adjust depending on your response
      });
  });
});
