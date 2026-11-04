import { afterEach, describe, expect, it, vi } from "vitest";
import { personApi, creditsApi } from "./authApi";

afterEach(() => vi.unstubAllGlobals());

describe("personApi.validate", () => {
  it("sends JSON content type together with the API key", async () => {
    const fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          datosCoinciden: true,
          cumpleEdadMinima: true,
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetch);

    await personApi.validate("rnp_test_key", {
      dni: 40111222,
      nombre: "Lucas Matias",
      apellido: "Gomez",
      edadMinima: 18,
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/v1\/personas\/validar$/),
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "rnp_test_key",
        },
      }),
    );
  });
});

it("uses session Bearer authentication without client-supplied price for checkout", async () => {
  const fetch = vi
    .fn()
    .mockResolvedValue(
      new Response(JSON.stringify({ id: "order", checkoutUrl: "sandbox" }), {
        status: 200,
      }),
    );
  vi.stubGlobal("fetch", fetch);
  await creditsApi.checkout("session-token");
  expect(fetch).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/v1\/clientes\/compras$/),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer session-token",
      },
    },
  );
});
