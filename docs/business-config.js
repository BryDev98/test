window.ABDELITO_CONFIG = {
  version: 2,

  // Para activar el horario automático, cambia mode a "auto" y completa
  // weeklyHours con el formato de 24 horas. Mientras tanto la web permite
  // pedidos programados sin afirmar que la cocina está abierta.
  service: {
    mode: "scheduled",
    timezone: "America/Lima",
    scheduledLabel: "Pedidos programados disponibles",
    hoursLabel: "Confirma disponibilidad y hora por WhatsApp",
    weeklyHours: {
      0: null,
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
    },
  },

  delivery: {
    originLabel: "Tarifas referenciales para Lima",
    disclaimer: "El costo y el tiempo final se confirman por WhatsApp según la dirección y disponibilidad del repartidor.",
    districts: [
      { id: "pueblo-libre", name: "Pueblo Libre", fee: 6, eta: "25–40 min" },
      { id: "jesus-maria", name: "Jesús María", fee: 8, eta: "30–45 min" },
      { id: "magdalena", name: "Magdalena del Mar", fee: 8, eta: "30–45 min" },
      { id: "san-miguel", name: "San Miguel", fee: 9, eta: "35–50 min" },
      { id: "brena", name: "Breña", fee: 10, eta: "35–50 min" },
      { id: "cercado", name: "Cercado de Lima", fee: 11, eta: "40–60 min" },
      { id: "lince", name: "Lince", fee: 11, eta: "40–55 min" },
      { id: "rimac", name: "Rímac", fee: 13, eta: "45–65 min" },
      { id: "la-victoria", name: "La Victoria", fee: 13, eta: "45–65 min" },
      { id: "san-isidro", name: "San Isidro", fee: 14, eta: "45–65 min" },
      { id: "surquillo", name: "Surquillo", fee: 14, eta: "45–65 min" },
      { id: "miraflores", name: "Miraflores", fee: 15, eta: "50–70 min" },
      { id: "san-borja", name: "San Borja", fee: 15, eta: "50–70 min" },
      { id: "otro", name: "Otro distrito", fee: null, eta: "Por confirmar" },
    ],
  },

  availability: {},

  payments: {
    yape: { enabled: true, label: "Yape", number: "", qr: "" },
    plin: { enabled: true, label: "Plin", number: "", qr: "" },
    transfer: { enabled: true, label: "Transferencia bancaria", account: "" },
  },

  bundles: [
    { id: "familiar-imperial", comboPrice: 67.9, serves: "3–4 personas" },
    { id: "cubanazo", comboPrice: 76.9, serves: "2 personas" },
    { id: "antojo-criollo", comboPrice: 45, serves: "1 persona" },
  ],

  productDetails: {
    "croquetas-jamon": { serves: "1–2 personas", portion: "6 unidades", prep: "Preparado al momento", includes: ["Jamón", "Bechamel casera", "Empanizado crujiente"], allergens: ["Gluten", "Leche", "Huevo"], options: "Indica si deseas alguna salsa aparte." },
    "ensalada-fría": { serves: "1 persona", portion: "Porción individual", prep: "Lista para servir", includes: ["Pasta", "Jamón", "Piña", "Huevo", "Mayonesa"], allergens: ["Gluten", "Huevo"], options: "Puedes pedirla sin alguno de los ingredientes indicados." },
    "tamal-criollo": { serves: "1 persona", portion: "1 tamal", prep: "Preparado al momento", includes: ["Masa de maíz sazonada", "Cerdo criollo"], allergens: ["Cerdo"], options: "Confirma disponibilidad antes de cerrar el pedido." },
    "ropa-vieja": { serves: "1 persona", portion: "Plato personal con guarniciones", prep: "Preparado al momento", includes: ["Res deshilachada", "Arroz congrí", "Ensalada", "Yuca con mojo"], allergens: [], options: "Puedes pedir ajustes de guarnición en observaciones." },
    "lechon-asado": { serves: "1 persona", portion: "Plato personal con guarniciones", prep: "Preparado al momento", includes: ["Cerdo al horno", "Arroz congrí", "Ensalada", "Yuca con mojo"], allergens: ["Cerdo"], options: "Puedes pedir ajustes de guarnición en observaciones." },
    "arroz-imperial-personal": { serves: "1 persona", portion: "Presentación personal", prep: "Preparado al momento", includes: ["Arroz amarillo", "Pollo", "Jamón", "Mayonesa", "Mozzarella"], allergens: ["Huevo", "Leche", "Cerdo"], options: "Consulta cualquier ajuste antes de pedir." },
    "arroz-imperial-familiar": { serves: "3–4 personas", portion: "Presentación familiar", prep: "Recomendado pedir con anticipación", includes: ["Arroz amarillo", "Pollo", "Jamón", "Mayonesa", "Mozzarella"], allergens: ["Huevo", "Leche", "Cerdo"], options: "Ideal para compartir; confirma el horario de preparación." },
    "lasana-habanera": { serves: "1 persona", portion: "Porción individual", prep: "Preparado al momento", includes: ["Pasta", "Carne", "Salsa roja", "Queso gratinado"], allergens: ["Gluten", "Leche"], options: "Consulta cualquier ajuste antes de pedir." },
    "bistec-encebollado": { serves: "1 persona", portion: "Plato personal con guarniciones", prep: "Preparado al momento", includes: ["Bistec", "Cebolla salteada", "Arroz congrí", "Ensalada", "Yuca con mojo"], allergens: [], options: "Puedes pedirlo sin cebolla en observaciones." },
    "pollo-rostizado": { serves: "1 persona", portion: "Plato personal con guarniciones", prep: "Preparado al momento", includes: ["Pollo rostizado", "Arroz congrí", "Ensalada", "Yuca con mojo"], allergens: [], options: "Puedes pedir ajustes de guarnición en observaciones." },
    "cerdo-cazuela": { serves: "1 persona", portion: "Plato personal con guarniciones", prep: "Preparado al momento", includes: ["Cerdo en cazuela", "Arroz congrí", "Ensalada", "Yuca"], allergens: ["Cerdo"], options: "Puedes pedir ajustes de guarnición en observaciones." },
    "flan-abuela": { serves: "1 persona", portion: "1 porción", prep: "Listo para servir", includes: ["Flan casero", "Caramelo"], allergens: ["Huevo", "Leche"], options: "Sujeto a disponibilidad del día." },
    "torrija-cubana": { serves: "1 persona", portion: "1 porción", prep: "Preparado al momento", includes: ["Pan", "Canela", "Almíbar"], allergens: ["Gluten", "Huevo", "Leche"], options: "Sujeto a disponibilidad del día." },
    "arroz-leche": { serves: "1 persona", portion: "1 porción", prep: "Listo para servir", includes: ["Arroz con leche", "Canela", "Chocolate"], allergens: ["Leche"], options: "Consulta si lo deseas sin lluvia de chocolate." },
    "platano-maduro": { serves: "1–2 personas", portion: "Porción adicional", prep: "Frito al momento", includes: ["Plátano maduro"], allergens: [], options: "Ideal para añadir a cualquier plato fuerte." },
    "tostones": { serves: "1–2 personas", portion: "Porción adicional", prep: "Frito al momento", includes: ["Plátano verde"], allergens: [], options: "Ideal para añadir a cualquier plato fuerte." },
    "arroz-congris": { serves: "1 persona", portion: "Porción adicional", prep: "Listo para servir", includes: ["Arroz", "Frijoles negros", "Sazón cubana"], allergens: [], options: "Ideal para completar o ampliar tu plato." },
  },

  // Solo se muestran reseñas con verified: true. Así evitamos inventar prueba social.
  testimonials: [],

  analytics: {
    ga4Id: "",
    metaPixelId: "",
    tiktokPixelId: "",
  },
};
