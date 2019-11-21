"use strict";

const assert = require("assert");
require("../server");
const request = require("request-promise");
const { redis, REDIS_KEYS } = require("../caches");
const { mongo } = require("../models");
mongo.setup();
const uri = "http://127.0.0.1:3002/api";

describe("test article api", async () => {
  describe("initial clean step", async () => {
    it("clean redis", async () => {
      const rateLimitKeys = REDIS_KEYS.API_USER_TOKEN("*");
      const keys = await redis.keys(rateLimitKeys);
      for (let i = 0; i < keys.length; i++) {
        await redis.del(keys[i]);
      }
    });

    it("clean mongo", async () => {
      //   await delay(3);
      await mongo.models.user.deleteMany({});
      await mongo.models.article.deleteMany({});
    });
  });

  describe("test api post users/register step", async () => {
    it("create user without account must fail", async () => {
      const path = "/users/register";
      const options = {
        uri: uri + `${path}`,
        method: "POST",
        body: {
          password: "1234",
          name: "1234"
        },
        json: true
      };
      try {
        await request(options);
      } catch (error) {
        assert.equal(error.statusCode, 422);
      }
    });

    it("create user without password must fail", async () => {
      const path = "/users/register";
      const options = {
        uri: uri + `${path}`,
        method: "POST",
        body: {
          account: "1234",
          name: "1234"
        },
        json: true
      };
      try {
        await request(options);
      } catch (error) {
        assert.equal(error.statusCode, 422);
      }
    });

    it("create first user must successful", async () => {
      const path = "/users/register";
      const options = {
        uri: uri + `${path}`,
        method: "POST",
        body: {
          account: "test1",
          password: "1234",
          name: "test1"
        },
        json: true
      };
      try {
        const response = await request(options);
        assert.equal(response.statusCode, 201);
      } catch (error) {}
    });

    it("create second user must successful", async () => {
      const path = "/users/register";
      const options = {
        uri: uri + `${path}`,
        method: "POST",
        body: {
          account: "test2",
          password: "1234",
          name: "test2"
        },
        json: true
      };
      try {
        const response = await request(options);
        assert.equal(response.statusCode, 201);
      } catch (error) {}
    });
  });

  describe("test api post users/login step", async () => {
    it("login with incorrect account/password must fail", async () => {
      const path = "/users/login";
      const options = {
        uri: uri + `${path}`,
        method: "POST",
        body: {
          account: "test1",
          password: "1222"
        },
        json: true
      };
      let response = {};
      try {
        response = await request(options);
      } catch (error) {
        assert.equal(error.statusCode, 400);
      }
    });

    it("login with account/password must successful", async () => {
      const path = "/users/login";
      const options = {
        uri: uri + `${path}`,
        method: "POST",
        body: {
          account: "test1",
          password: "1234"
        },
        json: true
      };
      let response = {};
      try {
        response = await request(options);
      } catch (error) {}
      assert.equal(response.code, 201);
    });
  });

  describe("test api post articles/ step", async () => {
    it("post article whitout token must fail", async () => {
      const path = "/articles";
      const options = {
        uri: uri + `${path}`,
        method: "POST",
        headers: {
          account: "test1"
        },
        json: true
      };
      try {
        await request(options);
      } catch (error) {
        assert.equal(error.statusCode, 401);
      }
    });

    it("post article with account/token must successful", async () => {
      const token = await redis.get(REDIS_KEYS.API_USER_TOKEN("test1"));
      const path = "/articles";
      const options = {
        uri: uri + `${path}`,
        method: "POST",
        body: {
          subject: "test",
          content: "content"
        },
        headers: {
          account: "test1",
          token
        },
        json: true
      };
      let response = {};
      try {
        response = await request(options);
      } catch (error) {}
      assert(response.code, 201);
    });
  });
});
