import DatamapResponse from "../../../src/Application/DatamapResponse";
import FetchHttpClient from "../../../src/Infrastructure/FetchHttpClient";

describe("FetchHttpClient", () => {
    test("get_json() returns correct data", async () => {
        jest.spyOn(global, "fetch").mockImplementationOnce((input) => {
            expect(input).toBe("get_url");
            const response: string = JSON.stringify({
                success: true,
                data: {},
                error_code: 200,
                message: "",
            });
            return Promise.resolve(new Response(response));
        });

        const client = new FetchHttpClient();
        const map: DatamapResponse<object> = await client.get_json("get_url");

        expect(map.success).toBeTruthy();
    });

    test("post_json() sends and returns correct data", async () => {
        jest.spyOn(global, "fetch").mockImplementationOnce((input, init) => {
            expect(input).toBe("post_url");
            expect(init).toStrictEqual({ body: "json", method: "POST" });
            const response: string = JSON.stringify({
                success: true,
                data: {},
                error_code: 200,
                message: "",
            });
            return Promise.resolve(new Response(response));
        });

        const client = new FetchHttpClient();
        const map: DatamapResponse<object> = await client.post_json(
            "post_url",
            "json",
        );

        expect(map.success).toBeTruthy();
    });
});
