exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204 };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Metodo nao permitido" }),
    };
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Configure MERCADO_PAGO_ACCESS_TOKEN nas variaveis do Netlify.",
      }),
    };
  }

  try {
    const order = JSON.parse(event.body || "{}");

    if (!order.items?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Pedido sem produtos." }),
      };
    }

    const siteUrl = process.env.URL || "https://thriving-gumption-2d1562.netlify.app";
    const preference = {
      items: order.items.map((item) => ({
        id: item.id,
        title: item.name,
        quantity: Number(item.quantity || 1),
        unit_price: Number(item.price),
        currency_id: "BRL",
      })),
      payer: {
        name: order.customer?.name || "",
        email: order.customer?.email || "",
        phone: {
          number: order.customer?.phone || "",
        },
      },
      back_urls: {
        success: siteUrl,
        failure: siteUrl,
        pending: siteUrl,
      },
      auto_return: "approved",
      external_reference: `atelie-muniz-${Date.now()}`,
      notification_url: `${siteUrl}/.netlify/functions/mercado-pago-webhook`,
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Erro Mercado Pago:", JSON.stringify(data));
      return {
        statusCode: response.status,
        body: JSON.stringify({
          message: "Nao foi possivel criar o checkout do Mercado Pago.",
          details: data,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: true,
        checkoutUrl: data.init_point,
        sandboxCheckoutUrl: data.sandbox_init_point,
        preferenceId: data.id,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro ao criar checkout do Mercado Pago." }),
    };
  }
};
