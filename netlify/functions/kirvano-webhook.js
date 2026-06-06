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
    const payload = JSON.parse(event.body || "{}");
    console.log("Webhook Kirvano recebido:", JSON.stringify(payload));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Payload invalido." }),
    };
  }
};
