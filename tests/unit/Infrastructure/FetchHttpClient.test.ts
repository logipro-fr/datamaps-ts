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

    test("get_json() throws error on failure", async () => {
        jest.spyOn(global, "fetch").mockImplementationOnce((input) => {
            expect(input).toBe("error_get_url");
            const response: string = JSON.stringify({
                success: false,
                data: {},
                error_code: 404,
                message: "Map not found",
            });
            return Promise.resolve(new Response(response));
        });

        const expectedError = new Error(404 + ": Map not found");

        try {
            const client = new FetchHttpClient();
            await client.get_json("error_get_url");
            expect("Error not thrown").toEqual("Even thought it should have");
        } catch(error) {
            expect(error).toEqual(expectedError);
        }
    });

    test("post_json() throws error on failure", async () => {
        jest.spyOn(global, "fetch").mockImplementationOnce((input, init) => {
            expect(input).toBe("error_post_url");
            expect(init).toStrictEqual({ body: "json", method: "POST" });
            const response: string = JSON.stringify({
                success: false,
                data: {},
                error_code: 409,
                message: "Map already exists",
            });
            return Promise.resolve(new Response(response));
        });

        const expectedError = new Error(409 + ": Map already exists");

        try {
            const client = new FetchHttpClient();
            await client.post_json("error_post_url", "json");
            expect("Error not thrown").toEqual("Even thought it should have");
        } catch(error) {
            expect(error).toEqual(expectedError);
        }
    });
});