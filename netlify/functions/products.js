const products = [
  {
    id: "toalha-lavabo-rosa",
    name: "Toalha Lavabo Rosa",
    category: "Toalha Lavabo",
    price: 35,
    unit: "unidade",
    image: "assets/artes/toalha-lavabo-rosa.jpeg",
    description: "Toalha lavabo bordada com acabamento delicado e embalagem para presente.",
  },
  {
    id: "toalha-lavabo-lilas",
    name: "Toalha Lavabo Lilas",
    category: "Toalha Lavabo",
    price: 35,
    unit: "unidade",
    image: "assets/artes/toalha-lavabo-lilas.jpeg",
    description: "Modelo suave, personalizado e ideal para presentear com carinho.",
  },
  {
    id: "kit-toalhas-familia",
    name: "Kit Toalhas Familia",
    category: "Kit Toalhas",
    price: 105,
    unit: "kit",
    image: "assets/artes/kit-toalhas-familia.jpeg",
    description: "Kit de toalhas bordadas para familia, com nomes e iniciais personalizados.",
  },
  {
    id: "kit-toalhas-infantil",
    name: "Kit Toalhas Infantil",
    category: "Kit Toalhas",
    price: 70,
    unit: "kit",
    image: "assets/artes/kit-toalhas-infantil.jpeg",
    description: "Kit infantil com bordados coloridos e embalagem pronta para presente.",
  },
  {
    id: "kit-panos-prato-colorido",
    name: "Kit Pano de Prato Colorido",
    category: "Pano de Prato",
    price: 100,
    unit: "kit",
    image: "assets/artes/kit-panos-prato-colorido.jpeg",
    description: "Panos de prato 100% algodao com barrado e acabamento especial.",
  },
  {
    id: "kit-panos-prato-bordado",
    name: "Kit Pano de Prato Bordado",
    category: "Pano de Prato",
    price: 150,
    unit: "kit",
    image: "assets/artes/kit-panos-prato-bordado.jpeg",
    description: "Kit com 5 panos bordados, visual elegante e pronto para presentear.",
  },
  {
    id: "cesto-pao-kit",
    name: "Cesto de Pao Kit",
    category: "Cesto de Pao",
    price: 150,
    unit: "kit",
    image: "assets/artes/cesto-pao-kit.jpeg",
    description: "Cesto de pao com kit de 3 panos de prato, delicado e presenteavel.",
  },
];

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204 };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Metodo nao permitido" }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(products),
  };
};
