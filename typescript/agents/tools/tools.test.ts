import { pickedTools } from './tools';

describe("Tools", () => {
  test("should be able to return 'sunny'", async () => {
    const res = await pickedTools("getCurrentWeather")[0].invoke({location: "BeiJing"})
    expect(res).toBe("sunny")
  });
});
