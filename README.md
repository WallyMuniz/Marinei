# Atelie Muniz

Site estatico para venda de presentes bordados, com catalogo, busca, carrinho,
checkout e integracao preparada para API e pagamento online. Marca configurada
como `Atelie Muniz` com assinatura `Marinei Vende`.

## Como abrir

Abra o arquivo `index.html` no navegador.

## Publicar no GitHub Pages

Este site pode ser publicado pelo GitHub Pages como site estatico. Envie para
um repositorio os arquivos:

- `index.html`
- `styles.css`
- `app.js`
- `api-config.js`
- `payment-gateway.js`
- `.nojekyll`
- pasta `assets`

Depois, no GitHub:

1. Abra o repositorio.
2. Va em `Settings`.
3. Entre em `Pages`.
4. Em `Build and deployment`, escolha `Deploy from a branch`.
5. Em `Branch`, escolha `main` e `/root`.
6. Salve.

O GitHub Pages nao executa backend/API. Por isso, para pagamento com Mercado
Pago nesse modo, use links de pagamento em `checkoutLinks`.

## Onde configurar a API

Edite `api-config.js`:

```js
window.STORE_CONFIG = {
  apiBaseUrl: "https://sua-api.com",
  productsEndpoint: "/products",
  ordersEndpoint: "/orders",
  payment: {
    provider: "mercado_pago_links",
    publicKey: "COLOQUE_A_CHAVE_PUBLICA_AQUI",
    createPaymentIntentEndpoint: "",
  },
};
```

Para conectar a compra direta, coloque o WhatsApp real e os links de pagamento
do Mercado Pago:

```js
whatsappNumber: "5599999999999",
payment: {
  provider: "mercado_pago_links"
},
checkoutLinks: {
  "toalha-lavabo-rosa": "https://mpago.la/...",
  "kit-panos-prato-bordado": "https://mpago.la/...",
  "cesto-pao-kit": "https://mpago.la/..."
}
```

## Formato esperado dos produtos pela API

O endpoint `GET /products` deve retornar uma lista assim:

```json
[
  {
    "id": "toalha-lavabo-rosa",
    "name": "Toalha Lavabo Rosa",
    "category": "Toalha Lavabo",
    "price": 35,
    "unit": "unidade",
    "image": "https://..."
  }
]
```

## Pagamento com Mercado Pago

Para deploy manual por ZIP no Netlify, o caminho recomendado e usar links de
pagamento do Mercado Pago em `checkoutLinks`. Assim o cliente clica em
`Comprar agora` e vai direto para o checkout seguro do Mercado Pago.

## API no Netlify

O projeto inclui Netlify Functions:

- `/.netlify/functions/products`: retorna os produtos do catalogo.
- `/.netlify/functions/orders`: recebe pedidos personalizados do formulario.
- `/.netlify/functions/mercado-pago-preference`: cria a preferencia de pagamento.
- `/.netlify/functions/mercado-pago-webhook`: endpoint preparado para notificacoes do Mercado Pago.
- `/.netlify/functions/kirvano-webhook`: endpoint antigo preparado para webhooks da Kirvano.

Para publicar a API junto com o site, envie tambem `netlify.toml` e a pasta
`netlify/functions` no deploy.

Observacao: o deploy manual por ZIP no Netlify nao roda build. Para usar a API
com functions em producao, prefira conectar o projeto ao GitHub ou publicar via
Netlify CLI.

Importante: dados sensiveis do cartao e chaves secretas devem ficar no backend,
nunca direto no site. O frontend deve usar somente chave publica e elementos
seguros do provedor escolhido.
