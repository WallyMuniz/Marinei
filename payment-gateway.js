(function () {
  const config = window.STORE_CONFIG || {};
  const payment = config.payment || {};

  async function postJson(endpoint, payload) {
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Nao foi possivel processar o pagamento.");
    }

    return response.json();
  }

  async function createStripePayment(order) {
    // No backend, crie um PaymentIntent e retorne o clientSecret.
    return postJson(payment.createPaymentIntentEndpoint, order);
  }

  async function createMercadoPagoPayment(order) {
    // No backend, crie a preferencia segura do Checkout Pro.
    return postJson(payment.createPaymentIntentEndpoint, order);
  }

  async function createPagarmePayment(order) {
    // No backend, crie o pedido/transacao usando as credenciais secretas.
    return postJson(payment.createPaymentIntentEndpoint, order);
  }

  async function createPayment(order) {
    if (!config.apiBaseUrl || config.apiBaseUrl.includes("sua-api.com")) {
      return {
        demo: true,
        message:
          "Modo demonstracao: configure sua API e o gateway em api-config.js.",
      };
    }

    switch (payment.provider) {
      case "stripe":
        return createStripePayment(order);
      case "mercado_pago":
        return createMercadoPagoPayment(order);
      case "pagarme":
        return createPagarmePayment(order);
      default:
        return postJson(config.ordersEndpoint, order);
    }
  }

  window.PaymentGateway = {
    createPayment,
  };
})();
