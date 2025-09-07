import { jest } from "@jest/globals";

let repo;
let mockQuery;

describe("repo DB functions", () => {
  const originalConsole = { log: console.log, error: console.error };
  beforeEach(async () => {
    jest.resetModules();
    mockQuery = jest.fn();
    jest.unstable_mockModule("../libs/postgreSQL.js", () => ({
      __esModule: true,
      default: { query: mockQuery },
      pool: { query: mockQuery },
    }));
    repo = await import("../server_utils/dbCalls_utils.js");
    // silence logs in test output
    console.log = jest.fn();
    console.error = jest.fn();
  });
  afterAll(() => {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
  });

  describe("getIDsForEvent", () => {
    it("returns first row on success", async () => {
      const row = { company_id: "c-123", id: "u-456" };
      mockQuery.mockResolvedValueOnce({ rows: [row] });

      const result = await repo.getIDsForEvent("theonewhothinks");

      expect(mockQuery).toHaveBeenCalledWith(
        "SELECT company_id, id FROM creator WHERE name = $1",
        ["theonewhothinks"]
      );
      expect(result).toEqual(row);
    });

    it("returns [] on error", async () => {
      mockQuery.mockRejectedValueOnce(new Error("boom"));

      const result = await repo.getIDsForEvent("theonewhothinks");

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("pushEvent", () => {
    it('inserts and returns "Creator pushed" on success', async () => {
      mockQuery.mockResolvedValueOnce({});

      const out = await repo.pushEvent(
        "channel.follow",
        "b2a916fc-93cb-403a-9090-6d4e4cafec2a",
        "b2a916fc-93cb-403a-9090-6d4e4cafec2a",
        {
          x: 1,
        }
      );

      expect(mockQuery).toHaveBeenCalledWith(
        "INSERT INTO events (id, subscription_type, creator_id, company_id, payload, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())",
        [
          "channel.follow",
          "b2a916fc-93cb-403a-9090-6d4e4cafec2a",
          "b2a916fc-93cb-403a-9090-6d4e4cafec2a",
          { x: 1 },
        ]
      );
      expect(out).toBe("Creator pushed");
      expect(console.log).toHaveBeenCalledWith("Creator pushed");
    });

    it('returns "event not pushed" on error', async () => {
      mockQuery.mockRejectedValueOnce(new Error("db down"));

      const out = await repo.pushEvent("follow", "creator-1", "company-1", {
        x: 1,
      });

      expect(out).toBe("event not pushed");
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("addCreator", () => {
    it("inserts creator and logs success", async () => {
      mockQuery.mockResolvedValueOnce({});

      await repo.addCreator("b123", "c123", "Ninja", "https://img");

      expect(mockQuery).toHaveBeenCalledWith(
        "INSERT INTO creator (id, broadcaster_id, company_id, name, logo) VALUES (gen_random_uuid(), $1, $2, $3, $4)",
        ["b123", "c123", "Ninja", "https://img"]
      );
      expect(console.log).toHaveBeenCalledWith("Creator added");
    });

    it("logs error if insert fails", async () => {
      mockQuery.mockRejectedValueOnce(new Error("nope"));

      await repo.addCreator("b", "c", "name", "logo");

      expect(console.log).toHaveBeenCalledWith("Creator not added");
      expect(console.error).toHaveBeenCalled();
    });
  });
});
