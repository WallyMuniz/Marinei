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

  try {
    const order = JSON.parse(event.body || "{}");

    if (!order.customer?.name || !order.customer?.phone || !order.items?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Pedido incompleto." }),
      };
    }

    console.log("Pedido recebido pelo site Atelie Muniz:", JSON.stringify(order));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: true,
        message: "Pedido recebido. A equipe do Atelie Muniz entrara em contato.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro ao receber pedido." }),
    };
  }
};
