export type Language = "ca" | "es" | "pt" | "en";

export interface Translation {
  // Navbar
  shop: string;
  collections: string;
  soul: string;
  searchPlaceholder: string;
  bag: string;

  // Hero
  newCollection: string;
  performanceWithSoul: string;
  heroDescription: string;
  shopCollection: string;
  ourStory: string;
  scrollToExplore: string;

  // Products Section
  essentialsCollection: string;
  essentialsDescription: string;
  all: string;
  tops: string;
  bottoms: string;
  outerwear: string;
  onePiece: string;
  sets: string;
  shorts: string;
  leggings: string;
  bodys: string;
  socks: string;
  tshirts: string;
  jackets: string;
  jumpsuits: string;
  accessories: string;
  noResults: string;
  clearFilters: string;

  // Soul Section
  ourEssence: string;
  moreThanActivewear: string;
  essenceDescription1: string;
  essenceDescription2: string;
  exploreHeritage: string;

  // Rio Section
  bornInRio: string;
  madeForMovement: string;
  sustainableSoul: string;
  sustainableDescription: string;
  performanceFirst: string;
  performanceDescription: string;

  // Newsletter
  joinMovement: string;
  newsletterDescription: string;
  subscribedMessage: string;
  emailPlaceholder: string;
  signUp: string;

  // Cart
  yourBag: string;
  bagEmpty: string;
  startShopping: string;
  total: string;
  checkout: string;
  secureCheckout: string;

  // Footer
  company: string;
  support: string;
  newArrivals: string;
  bestSellers: string;
  sale: string;
  sustainability: string;
  careers: string;
  press: string;
  shipping: string;
  returns: string;
  sizeGuide: string;
  contact: string;
  privacyPolicy: string;
  termsOfService: string;
  shippingContent: string;
  returnsContent: string;
  sizeGuideContent: string;
  contactContent: string;
  backToHome: string;

  // Mobile Menu & Sub-menus
  home: string;
  products: string;
  new: string;
  giftCard: string;
  lastUnits: string;
  sambaEnergy: string;
  brasilHeat: string;
  sambaPower: string;
  rioEnergy: string;
  tropicalBurn: string;
  sambaBoost: string;
  heatDoBrasil: string;
  powerCarioca: string;
  skateCovers: string;
  hairAccessories: string;
  bags: string;
  phoneStrap: string;
  sweatshirt: string;
  thermal: string;
  giftCardTitle: string;
  giftCardDescription: string;
  lastUnitsTitle: string;
  lastUnitsDescription: string;
  newArrivalsTitle: string;
  newArrivalsDescription: string;

  // Auth & Profile
  login: string;
  signup: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  personalInfo: string;
  dob: string;
  gender: string;
  phone: string;
  residentialAddress: string;
  deliveryAddress: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  saveChanges: string;
  deleteAccount: string;
  deleteAccountConfirm: string;
  logout: string;
  back: string;
  hello: string;
  welcomeBack: string;
  createAccount: string;
  loginSubtitle: string;
  signupSubtitle: string;
  passwordsDontMatch: string;
  errorOccurred: string;
  loginButton: string;
  signupButton: string;
  dontHaveAccountAction: string;
  alreadyHaveAccountAction: string;
  profileUpdated: string;
  profileUpdateError: string;
  deleteAccountError: string;
  theme: string;
  light: string;
  dark: string;
  selectGender: string;
  genderMale: string;
  genderFemale: string;
  genderOther: string;
  genderPreferNotToSay: string;
  preferredLanguage: string;
  completeProfile: string;
  sameAsShipping: string;
  allRightsReserved: string;
  loginToFavorite: string;
  checkoutTitle: string;
  paymentMethod: string;
  creditCard: string;
  paypal: string;
  bizum: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  payNow: string;
  orderSummary: string;
  subtotal: string;
  shippingCost: string;
  currency: string;
  converting: string;
  conversionRate: string;
  paymentSuccess: string;
  paymentError: string;

  // Favorites
  myFavorites: string;
  favoritesDescription: string;
  favoritesEmpty: string;
  favoritesEmptyDesc: string;
  selectSizeWarning: string;
  selectCollection: string;
  unitsSold: string;
  purchaseHistory: string;
}

export const translations: Record<Language, Translation> = {
  ca: {
    shop: "Botiga",
    collections: "Col·leccions",
    soul: "Ànima",
    searchPlaceholder: "Cercar productes...",
    bag: "Bossa",
    newCollection: "Nova Col·lecció 2026",
    performanceWithSoul: "Rendiment amb Ànima.",
    heroDescription:
      "Ànima brasilera, artesania catalana. Roba esportiva que uneix el ritme vibrant del Brasil amb la qualitat i producció local de Catalunya.",
    shopCollection: "Comprar Col·lecció",
    ourStory: "La Nostra Història",
    scrollToExplore: "Explora",
    essentialsCollection: "La Col·lecció Essentials",
    essentialsDescription:
      "Inspirada en l'energia tropical i fabricada amb la precisió del disseny català. Peces creades localment per moure's amb tu.",
    all: "Tots",
    tops: "Part Superior",
    bottoms: "Part Inferior",
    outerwear: "Roba d'abric",
    onePiece: "D'una sola peça",
    sets: "Conjunts",
    shorts: "Pantalons Curts",
    leggings: "Malles",
    bodys: "Bodys",
    socks: "Mitjons",
    tshirts: "Samarretes",
    jackets: "Jaquetes",
    jumpsuits: "Micos",
    accessories: "Accessoris",
    noResults: "No s'han trobat productes que coincideixin amb la teva cerca.",
    clearFilters: "Netejar tots els filtres",
    ourEssence: "La Nostra Essència",
    moreThanActivewear: "Més que Roba Esportiva.",
    essenceDescription1:
      "SambaFit és el pont entre dos mons. L'energia de la samba i el color de Rio es troben amb la tradició tèxtil i el disseny d'avantguarda de Barcelona.",
    essenceDescription2:
      "Creiem en la fusió: l'esperit resilient del Brasil i la fabricació conscient a Catalunya. Cada peça és un tribut a aquesta unió única.",
    exploreHeritage: "Explora el Nostre Llegat",
    bornInRio: "Ànima Brasilera,",
    madeForMovement: "Fabricat a Catalunya.",
    sustainableSoul: "Ànima Sostenible",
    sustainableDescription:
      "Produïm localment a Catalunya per reduir la petjada de carboni. Utilitzem materials reciclats i donem suport a l'economia circular del nostre entorn.",
    performanceFirst: "El Rendiment Primer",
    performanceDescription:
      "Dissenyat per resistir el ritme urbà i l'entrenament més intens. Qualitat mediterrània amb l'esperit imparable del Brasil.",
    joinMovement: "Uneix-te al Moviment",
    newsletterDescription:
      "Subscriu-te al nostre butlletí per a llançaments exclusius, consells d'estil de vida SambaFit i un 15% de descompte en la teva primera comanda.",
    subscribedMessage: "Gràcies! Ja ets a la llista. 🌴",
    emailPlaceholder: "el-teu@email.com",
    signUp: "Subscriure's",
    yourBag: "La Teva Bossa",
    bagEmpty: "La teva bossa està buida.",
    startShopping: "Comença a Comprar",
    total: "Total",
    checkout: "Finalitzar Compra",
    secureCheckout: "Pagament Segur",
    company: "Empresa",
    support: "Suport",
    newArrivals: "Noves Arribades",
    bestSellers: "Més Venuts",
    sale: "Rebaixes",
    sustainability: "Sostenibilitat",
    careers: "Carreres",
    press: "Premsa",
    shipping: "Enviament",
    returns: "Devolucions",
    sizeGuide: "Guia de Talles",
    contact: "Contacte",
    privacyPolicy: "Política de Privadesa",
    termsOfService: "Termes de Servei",
    shippingContent:
      "Oferim enviament gratuït en comandes superiors a 100€. El termini de lliurament és de 3 a 5 dies laborables.",
    returnsContent:
      "Tens 30 dies per retornar la teva comanda si no estàs satisfet. El producte ha d'estar en el seu estat original.",
    sizeGuideContent:
      "Consulta la nostra taula de talles per trobar l'ajust perfecte per a tu. Les nostres peces tallen normal.",
    contactContent:
      "Pots contactar amb nosaltres a través del correu hola@sambafit.com o al telèfon +34 900 000 000.",
    backToHome: "Tornar a l'Inici",
    home: "INICI",
    products: "PRODUCTES",
    new: "NOU",
    giftCard: "TARJETA REGAL",
    lastUnits: "ÚLTIMES UNITATS",
    sambaEnergy: "Samba Energy",
    brasilHeat: "Brasil Heat",
    sambaPower: "Samba Power",
    rioEnergy: "Rio Energy",
    tropicalBurn: "Tropical Burn",
    sambaBoost: "Samba Boost",
    heatDoBrasil: "Heat do Brasil",
    powerCarioca: "Power Carioca",
    skateCovers: "Cobrepatins",
    hairAccessories: "Accessoris per al Cabell",
    bags: "Bosses",
    phoneStrap: "Corda per a Mòbil",
    sweatshirt: "Sudadera",
    thermal: "Tèrmiques",
    giftCardTitle: "Targeta Regal",
    giftCardDescription:
      "El regal perfecte per a qualsevol ocasió. Tria l'import que prefereixis.",
    lastUnitsTitle: "Últimes Unitats",
    lastUnitsDescription:
      "Aprofita les nostres últimes existències abans que s'exhaureixin.",
    newArrivalsTitle: "Noves Arribades",
    newArrivalsDescription:
      "Descobreix les nostres últimes peces dissenyades per al teu rendiment.",
    login: "Iniciar Sessió",
    signup: "Registrar-se",
    firstName: "Nom",
    lastName: "Cognom",
    email: "Correu Electrònic",
    password: "Contrasenya",
    confirmPassword: "Confirmar Contrasenya",
    alreadyHaveAccount: "Ja tens un compte?",
    dontHaveAccount: "No tens un compte?",
    personalInfo: "Informació Personal",
    dob: "Data de Naixement",
    gender: "Gènere",
    phone: "Telèfon",
    residentialAddress: "Adreça Residencial",
    deliveryAddress: "Adreça d'Enviament",
    street: "Carrer",
    city: "Ciutat",
    state: "Província",
    zipCode: "Codi Postal",
    country: "País",
    saveChanges: "Guardar Canvis",
    deleteAccount: "Eliminar Compte",
    deleteAccountConfirm:
      "Estàs segur que vols eliminar el teu compte? Aquesta acció no es pot desfer.",
    logout: "Sair",
    back: "Tornar",
    hello: "Hola",
    welcomeBack: "Benvingut de nou",
    createAccount: "Crea el teu compte",
    loginSubtitle: "Entra per accedir a les teves comandes i favorits",
    signupSubtitle: "Uneix-te a la comunitat SambaFit",
    passwordsDontMatch: "Les contrasenyes no coincideixen",
    errorOccurred: "Ha sorgit un error",
    loginButton: "Entrar",
    signupButton: "Registrar-se",
    dontHaveAccountAction: "No tens un compte? Registra't",
    alreadyHaveAccountAction: "Ja tens un compte? Entra ara",
    profileUpdated: "Perfil actualitzat amb èxit!",
    profileUpdateError: "Error en actualitzar el perfil",
    deleteAccountError: "Error en eliminar el compte",
    theme: "Tema",
    light: "Clar",
    dark: "Fosc",
    selectGender: "Selecciona",
    genderMale: "Masculí",
    genderFemale: "Femení",
    genderOther: "Altre",
    genderPreferNotToSay: "Prefereixo no dir-ho",
    preferredLanguage: "Idioma de preferència",
    completeProfile: "Completa la teva informació de perfil",
    sameAsShipping: "La mateixa que l'adreça d'enviament",
    allRightsReserved: "Tots els drets reservats.",
    loginToFavorite: "Si us plau, inicia sessió per afegir a favorits",
    checkoutTitle: "Finalitzar Compra",
    paymentMethod: "Mètode de Pagament",
    creditCard: "Targeta de Crèdit",
    paypal: "PayPal",
    bizum: "Bizum",
    cardNumber: "Número de Targeta",
    expiryDate: "Data de Caducitat",
    cvv: "CVV",
    payNow: "Pagar Ara",
    orderSummary: "Resum de la Comanda",
    subtotal: "Subtotal",
    shippingCost: "Enviament",
    currency: "Moneda",
    converting: "Convertint...",
    conversionRate: "Tipus de canvi",
    paymentSuccess: "Pagament realitzat amb èxit!",
    paymentError: "Error en el pagament. Torna-ho a intentar.",
    myFavorites: "Els Meus Favorits",
    favoritesDescription:
      "Les teves peces preferides de SambaFit en un sol lloc.",
    favoritesEmpty: "La teva llista està buida",
    favoritesEmptyDesc:
      "Encara no has afegit cap producte als teus favorits. Explora la nostra col·lecció!",
    selectSizeWarning: "Selecciona una talla",
    selectCollection: "Tria una col·lecció",
    unitsSold: "unitats venudes",
    purchaseHistory: "El meu historial de compres",
  },
  es: {
    shop: "Tienda",
    collections: "Colecciones",
    soul: "Alma",
    searchPlaceholder: "Buscar productos...",
    bag: "Bolsa",
    newCollection: "Nueva Colección 2026",
    performanceWithSoul: "Rendimiento con Alma.",
    heroDescription:
      "Alma brasileña, artesanía catalana. Ropa deportiva que une el ritmo vibrante de Brasil con la calidad y producción local de Catalunya.",
    shopCollection: "Comprar Colección",
    ourStory: "Nuestra Historia",
    scrollToExplore: "Explora",
    essentialsCollection: "La Colección Essentials",
    essentialsDescription:
      "Inspirada en la energía tropical y fabricada con la precisión del diseño catalán. Prendas creadas localmente para moverse contigo.",
    all: "Todos",
    tops: "Partes Superiores",
    bottoms: "Partes Inferiores",
    outerwear: "Ropa de Abrigo",
    onePiece: "De una pieza",
    sets: "Conjuntos",
    shorts: "Pantalones Cortos",
    leggings: "Mallas",
    bodys: "Bodys",
    socks: "Calcetines",
    tshirts: "Camisetas",
    jackets: "Chaquetas",
    jumpsuits: "Monos",
    accessories: "Accesorios",
    noResults: "No se encontraron productos que coincidan con tu búsqueda.",
    clearFilters: "Limpiar todos los filtros",
    ourEssence: "Nuestra Esencia",
    moreThanActivewear: "Más que Ropa Deportiva.",
    essenceDescription1:
      "SambaFit es el puente entre dos mundos. La energía de la samba y el color de Río se encuentran con la tradición textil y el diseño de vanguardia de Barcelona.",
    essenceDescription2:
      "Creemos en la fusión: el espíritu resiliente de Brasil y la fabricación consciente en Catalunya. Cada prenda es un tributo a esta unión única.",
    exploreHeritage: "Explora Nuestro Legado",
    bornInRio: "Alma Brasileña,",
    madeForMovement: "Fabricado en Catalunya.",
    sustainableSoul: "Alma Sostenible",
    sustainableDescription:
      "Producimos localmente en Catalunya para reducir la huella de carbono. Utilizamos materiales reciclados y apoyamos la economía circular de nuestro entorno.",
    performanceFirst: "El Rendimiento Primero",
    performanceDescription:
      "Diseñado para resistir el ritmo urbano y el entrenamiento más intenso. Calidad mediterránea con el espíritu imparable de Brasil.",
    joinMovement: "Únete al Movimiento",
    newsletterDescription:
      "Suscríbete a nuestro boletín para lanzamientos exclusivos, consejos de estilo de vida SambaFit y un 15% de descuento en tu primer pedido.",
    subscribedMessage: "¡Gracias! Ya estás en la lista. 🌴",
    emailPlaceholder: "tu@email.com",
    signUp: "Registrarse",
    yourBag: "Tu Bolsa",
    bagEmpty: "Tu bolsa está vacía.",
    startShopping: "Comenzar a Comprar",
    total: "Total",
    checkout: "Finalizar Compra",
    secureCheckout: "Pago Seguro",
    company: "Empresa",
    support: "Soporte",
    newArrivals: "Novedades",
    bestSellers: "Más Vendidos",
    sale: "Ofertas",
    sustainability: "Sostenibilidad",
    careers: "Carreras",
    press: "Prensa",
    shipping: "Envío",
    returns: "Devoluciones",
    sizeGuide: "Guía de Tallas",
    contact: "Contacto",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    shippingContent:
      "Ofrecemos envío gratuito en pedidos superiores a 100€. El plazo de entrega es de 3 a 5 días laborables.",
    returnsContent:
      "Tienes 30 días para devolver tu pedido si no estás satisfecho. El producto debe estar en su estado original.",
    sizeGuideContent:
      "Consulta nuestra tabla de tallas para encontrar el ajuste perfecto para ti. Nuestras prendas tallan normal.",
    contactContent:
      "Puedes contactar con nosotros a través del correo hola@sambafit.com o al teléfono +34 900 000 000.",
    backToHome: "Volver al Inicio",
    home: "INICIO",
    products: "PRODUCTOS",
    new: "NUEVO",
    giftCard: "TARJETA REGALO",
    lastUnits: "ÚLTIMAS UNIDADES",
    sambaEnergy: "Samba Energy",
    brasilHeat: "Brasil Heat",
    sambaPower: "Samba Power",
    rioEnergy: "Rio Energy",
    tropicalBurn: "Tropical Burn",
    sambaBoost: "Samba Boost",
    heatDoBrasil: "Heat do Brasil",
    powerCarioca: "Power Carioca",
    skateCovers: "Cubrepatines",
    hairAccessories: "Accesorios para el Cabello",
    bags: "Bolsas",
    phoneStrap: "Cuerda para Móvil",
    sweatshirt: "Sudadera",
    thermal: "Térmicas",
    giftCardTitle: "Tarjeta Regalo",
    giftCardDescription:
      "El regalo perfecto para cualquier ocasión. Elige el importe que prefieras.",
    lastUnitsTitle: "Últimas Unidades",
    lastUnitsDescription:
      "Aprovecha nuestras últimas existencias antes de que se agoten.",
    newArrivalsTitle: "Novedades",
    newArrivalsDescription:
      "Descubre nuestras últimas prendas diseñadas para tu rendimiento.",
    login: "Iniciar Sesión",
    signup: "Registrarse",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo Electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    dontHaveAccount: "¿No tienes una cuenta?",
    personalInfo: "Información Personal",
    dob: "Fecha de Nacimiento",
    gender: "Género",
    phone: "Teléfono",
    residentialAddress: "Dirección Residencial",
    deliveryAddress: "Dirección de Envío",
    street: "Calle",
    city: "Ciudad",
    state: "Provincia",
    zipCode: "Código Postal",
    country: "País",
    saveChanges: "Guardar Cambios",
    deleteAccount: "Eliminar Cuenta",
    deleteAccountConfirm:
      "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.",
    logout: "Sair",
    back: "Volver",
    hello: "Hola",
    welcomeBack: "Bienvenido de nuevo",
    createAccount: "Crea tu cuenta",
    loginSubtitle: "Entra para acceder a tus pedidos y favoritos",
    signupSubtitle: "Únete a la comunidad SambaFit",
    passwordsDontMatch: "Las contraseñas no coinciden",
    errorOccurred: "Ha ocurrido un error",
    loginButton: "Entrar",
    signupButton: "Registrarse",
    dontHaveAccountAction: "¿No tienes una cuenta? Regístrate",
    alreadyHaveAccountAction: "¿Ya tienes una cuenta? Entra ahora",
    profileUpdated: "¡Perfil actualizado con éxito!",
    profileUpdateError: "Error al actualizar el perfil",
    deleteAccountError: "Error al eliminar la cuenta",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    selectGender: "Selecciona",
    genderMale: "Masculino",
    genderFemale: "Femenino",
    genderOther: "Otro",
    genderPreferNotToSay: "Prefiero no decirlo",
    preferredLanguage: "Idioma de preferencia",
    completeProfile: "Completa tu información de perfil",
    sameAsShipping: "La misma que la dirección de envío",
    allRightsReserved: "Todos los derechos reservados.",
    loginToFavorite: "Por favor, inicia sesión para añadir a favoritos",
    checkoutTitle: "Finalizar Compra",
    paymentMethod: "Método de Pago",
    creditCard: "Tarjeta de Crédito",
    paypal: "PayPal",
    bizum: "Bizum",
    cardNumber: "Número de Tarjeta",
    expiryDate: "Fecha de Caducidad",
    cvv: "CVV",
    payNow: "Pagar Ahora",
    orderSummary: "Resumen del Pedido",
    subtotal: "Subtotal",
    shippingCost: "Envío",
    currency: "Moneda",
    converting: "Convirtiendo...",
    conversionRate: "Tipo de cambio",
    paymentSuccess: "¡Pago realizado con éxito!",
    paymentError: "Error en el pago. Inténtalo de nuevo.",
    myFavorites: "Mis Favoritos",
    favoritesDescription: "Tus piezas favoritas de SambaFit en un solo lugar.",
    favoritesEmpty: "Tu lista está vacía",
    favoritesEmptyDesc:
      "Aún no has añadido ningún producto a tus favoritos. ¡Explora nuestra colección!",
    selectSizeWarning: "Selecciona una talla",
    selectCollection: "Elige una colección",
    unitsSold: "unidades vendidas",
    purchaseHistory: "Mi historial de compras",
  },
  pt: {
    shop: "Loja",
    collections: "Coleções",
    soul: "Alma",
    searchPlaceholder: "Buscar produtos...",
    bag: "Sacola",
    newCollection: "Nova Coleção 2026",
    performanceWithSoul: "Performance com Alma.",
    heroDescription:
      "Alma brasileira, artesanato catalão. Moda fitness que une o ritmo vibrante do Brasil com a qualidade e produção local da Catalunha.",
    shopCollection: "Comprar Coleção",
    ourStory: "Nossa História",
    scrollToExplore: "Explore",
    essentialsCollection: "A Coleção Essentials",
    essentialsDescription:
      "Inspirada na energia tropical e fabricada com a precisão do design catalão. Peças criadas localmente para se moverem com você.",
    all: "Todos",
    tops: "Partes de Cima",
    bottoms: "Partes de Baixo",
    outerwear: "Casacos",
    onePiece: "Peça Única",
    sets: "Conjuntos",
    shorts: "Shorts",
    leggings: "Leggings",
    bodys: "Bodys",
    socks: "Meias",
    tshirts: "T-Shirts",
    jackets: "Casacos",
    jumpsuits: "Macacão",
    accessories: "Acessórios",
    noResults: "Nenhum produto encontrado para sua busca.",
    clearFilters: "Limpar todos os filtros",
    ourEssence: "Nossa Essência",
    moreThanActivewear: "Mais que Moda Fitness.",
    essenceDescription1:
      "SambaFit é a ponte entre dois mundos. A energia do samba e as cores do Rio encontram a tradição têxtil e o design de vanguarda de Barcelona.",
    essenceDescription2:
      "Acreditamos na fusão: o espírito resiliente do Brasil e a fabricação consciente na Catalunha. Cada peça é um tributo a esta união única.",
    exploreHeritage: "Explore Nosso Legado",
    bornInRio: "Alma Brasileira,",
    madeForMovement: "Fabricado na Catalunha.",
    sustainableSoul: "Alma Sustentável",
    sustainableDescription:
      "Produzimos localmente na Catalunha para reduzir a pegada de carbono. Utilizamos materiais reciclados e apoiamos a economia circular do nosso entorno.",
    performanceFirst: "Performance em Primeiro Lugar",
    performanceDescription:
      "Desenhado para resistir ao ritmo urbano e ao treino mais intenso. Qualidade mediterrânea com o espírito imparável do Brasil.",
    joinMovement: "Junte-se ao Movimento",
    newsletterDescription:
      "Assine nossa newsletter para lançamentos exclusivos, dicas de estilo de vida SambaFit e 15% de desconto no seu primeiro pedido.",
    subscribedMessage: "Obrigado! Você está na lista. 🌴",
    emailPlaceholder: "seu@email.com",
    signUp: "Cadastrar",
    yourBag: "Sua Sacola",
    bagEmpty: "Sua sacola está vazia.",
    startShopping: "Começar a Comprar",
    total: "Total",
    checkout: "Finalizar Compra",
    secureCheckout: "Pagamento Seguro",
    company: "Empresa",
    support: "Suporte",
    newArrivals: "Novidades",
    bestSellers: "Mais Vendidos",
    sale: "Promoção",
    sustainability: "Sustentabilidade",
    careers: "Carreiras",
    press: "Imprensa",
    shipping: "Envio",
    returns: "Devoluções",
    sizeGuide: "Guia de Tamanhos",
    contact: "Contato",
    privacyPolicy: "Política de Privacidade",
    termsOfService: "Termos de Serviço",
    shippingContent:
      "Oferecemos envio gratuito em pedidos acima de 100€. O prazo de entrega é de 3 a 7 dias úteis.",
    returnsContent:
      "Você tem 30 dias para devolver seu pedido se não estiver satisfeito. O produto deve estar em seu estado original.",
    sizeGuideContent:
      "Consulte nossa tabela de tamanhos para encontrar o ajuste perfeito para você. Nossas peças têm modelagem padrão.",
    contactContent:
      "Você pode entrar em contato conosco pelo e-mail ola@sambafit.com ou pelo telefone +55 21 0000-0000.",
    backToHome: "Voltar ao Início",
    home: "HOME",
    products: "PRODUTOS",
    new: "NOVO",
    giftCard: "CARTÃO PRESENTE",
    lastUnits: "ÚLTIMAS UNIDADES",
    sambaEnergy: "Samba Energy",
    brasilHeat: "Brasil Heat",
    sambaPower: "Samba Power",
    rioEnergy: "Rio Energy",
    tropicalBurn: "Tropical Burn",
    sambaBoost: "Samba Boost",
    heatDoBrasil: "Heat do Brasil",
    powerCarioca: "Power Carioca",
    skateCovers: "Cobrepatins",
    hairAccessories: "Acessórios para Cabelo",
    bags: "Bolsas",
    phoneStrap: "Corda para Celular",
    sweatshirt: "Moletom",
    thermal: "Térmicas",
    giftCardTitle: "Cartão Presente",
    giftCardDescription:
      "O presente perfeito para qualquer ocasião. Escolha o valor que preferir.",
    lastUnitsTitle: "Últimas Unidades",
    lastUnitsDescription: "Aproveite nossas últimas unidades antes que acabem.",
    newArrivalsTitle: "Novidades",
    newArrivalsDescription:
      "Descubra nossas últimas peças projetadas para sua performance.",
    login: "Entrar",
    signup: "Cadastrar",
    firstName: "Nome",
    lastName: "Sobrenome",
    email: "E-mail",
    password: "Senha",
    confirmPassword: "Confirmar Senha",
    alreadyHaveAccount: "Já tem uma conta?",
    dontHaveAccount: "Não tem uma conta?",
    personalInfo: "Informações Pessoais",
    dob: "Data de Nascimento",
    gender: "Gênero",
    phone: "Telefone",
    residentialAddress: "Endereço Residencial",
    deliveryAddress: "Endereço de Entrega",
    street: "Rua",
    city: "Cidade",
    state: "Estado",
    zipCode: "CEP",
    country: "País",
    saveChanges: "Salvar Alterações",
    deleteAccount: "Cancelar Conta",
    deleteAccountConfirm:
      "Tem certeza que deseja cancelar sua conta? Todos os seus dados serão apagados permanentemente.",
    logout: "Sair",
    back: "Voltar",
    hello: "Olá",
    welcomeBack: "Bem-vindo de volta",
    createAccount: "Cadastrar",
    loginSubtitle: "Entre para acessar seus pedidos e favoritos",
    signupSubtitle: "Junte-se à comunidade SambaFit",
    passwordsDontMatch: "As senhas não coincidem",
    errorOccurred: "Ocorreu um erro",
    loginButton: "Entrar",
    signupButton: "Registra-se",
    dontHaveAccountAction: "Não tem uma conta? Registra-se",
    alreadyHaveAccountAction: "Já tem uma conta? Entre agora",
    profileUpdated: "Perfil atualizado com sucesso!",
    profileUpdateError: "Erro ao atualizar perfil",
    deleteAccountError: "Erro ao deletar conta",
    theme: "Tema",
    light: "Claro",
    dark: "Escuro",
    selectGender: "Selecione",
    genderMale: "Masculino",
    genderFemale: "Feminino",
    genderOther: "Outro",
    genderPreferNotToSay: "Prefiro não dizer",
    preferredLanguage: "Idioma de preferência",
    completeProfile: "Complete suas informações de perfil",
    sameAsShipping: "Mesmo que o endereço de entrega",
    allRightsReserved: "Todos os direitos reservados.",
    loginToFavorite: "Por favor, faça login para favoritar produtos",
    checkoutTitle: "Finalizar Compra",
    paymentMethod: "Método de Pagamento",
    creditCard: "Cartão de Crédito",
    paypal: "PayPal",
    bizum: "Bizum",
    cardNumber: "Número do Cartão",
    expiryDate: "Data de Validade",
    cvv: "CVV",
    payNow: "Pagar Agora",
    orderSummary: "Resumo do Pedido",
    subtotal: "Subtotal",
    shippingCost: "Envio",
    currency: "Moeda",
    converting: "Convertendo...",
    conversionRate: "Taxa de conversão",
    paymentSuccess: "Pagamento realizado com sucesso!",
    paymentError: "Erro no pagamento. Tente novamente.",
    myFavorites: "Meus Favoritos",
    favoritesDescription: "Suas peças favoritas da SambaFit em um só lugar.",
    favoritesEmpty: "Sua lista está vazia",
    favoritesEmptyDesc:
      "Você ainda não adicionou nenhum produto aos seus favoritos. Explore nossa coleção!",
    selectSizeWarning: "Escolher tamanho",
    selectCollection: "Escolha uma coleção",
    unitsSold: "unidades vendidas",
    purchaseHistory: "Meu histórico de compras",
  },
  en: {
    shop: "Shop",
    collections: "Collections",
    soul: "Soul",
    searchPlaceholder: "Search products...",
    bag: "Bag",
    newCollection: "New Collection 2026",
    performanceWithSoul: "Performance with Soul.",
    heroDescription:
      "Brazilian soul, Catalan craftsmanship. Activewear that unites the vibrant rhythm of Brazil with the local quality and production of Catalonia.",
    shopCollection: "Shop Collection",
    ourStory: "Our Story",
    scrollToExplore: "Explore",
    essentialsCollection: "The Essentials Collection",
    essentialsDescription:
      "Inspired by tropical energy and manufactured with the precision of Catalan design. Locally created garments made to move with you.",
    all: "All",
    tops: "Tops",
    bottoms: "Bottoms",
    outerwear: "Outerwear",
    onePiece: "One-piece",
    sets: "Sets",
    shorts: "Shorts",
    leggings: "Leggings",
    bodys: "Bodys",
    socks: "Socks",
    tshirts: "T-Shirts",
    jackets: "Jackets",
    jumpsuits: "Jumpsuits",
    accessories: "Accessories",
    noResults: "No products found matching your search.",
    clearFilters: "Clear all filters",
    ourEssence: "Our Essence",
    moreThanActivewear: "More Than Activewear.",
    essenceDescription1:
      "SambaFit is the bridge between two worlds. The energy of samba and the colors of Rio meet the textile tradition and avant-garde design of Barcelona.",
    essenceDescription2:
      "We believe in fusion: the resilient spirit of Brazil and conscious manufacturing in Catalonia. Every piece is a tribute to this unique union.",
    exploreHeritage: "Explore Our Heritage",
    bornInRio: "Brazilian Soul,",
    madeForMovement: "Crafted in Catalonia.",
    sustainableSoul: "Sustainable Soul",
    sustainableDescription:
      "We produce locally in Catalonia to reduce our carbon footprint. We use recycled materials and support the circular economy of our region.",
    performanceFirst: "Performance First",
    performanceDescription:
      "Designed to withstand the urban rhythm and the most intense training. Mediterranean quality with the unstoppable spirit of Brazil.",
    joinMovement: "Join the Movement",
    newsletterDescription:
      "Subscribe to our newsletter for exclusive drops, SambaFit lifestyle tips, and 15% off your first order.",
    subscribedMessage: "Obrigado! You're on the list. 🌴",
    emailPlaceholder: "your@email.com",
    signUp: "Sign Up",
    yourBag: "Your Bag",
    bagEmpty: "Your bag is empty.",
    startShopping: "Start Shopping",
    total: "Total",
    checkout: "Checkout",
    secureCheckout: "Secure Checkout",
    company: "Company",
    support: "Support",
    newArrivals: "New Arrivals",
    bestSellers: "Best Sellers",
    sale: "Sale",
    sustainability: "Sustainability",
    careers: "Careers",
    press: "Press",
    shipping: "Shipping",
    returns: "Returns",
    sizeGuide: "Size Guide",
    contact: "Contact",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    shippingContent:
      "We offer free shipping on orders over 100€. Delivery time is 3 to 5 business days.",
    returnsContent:
      "You have 30 days to return your order if you are not satisfied. The product must be in its original condition.",
    sizeGuideContent:
      "Check our size chart to find the perfect fit for you. Our garments fit true to size.",
    contactContent:
      "You can contact us via email at hello@sambafit.com or by phone at +1 800 000 0000.",
    backToHome: "Back to Home",
    home: "HOME",
    products: "PRODUCTS",
    new: "NEW",
    giftCard: "GIFT CARD",
    lastUnits: "LAST UNITS",
    sambaEnergy: "Samba Energy",
    brasilHeat: "Brasil Heat",
    sambaPower: "Samba Power",
    rioEnergy: "Rio Energy",
    tropicalBurn: "Tropical Burn",
    sambaBoost: "Samba Boost",
    heatDoBrasil: "Heat do Brasil",
    powerCarioca: "Power Carioca",
    skateCovers: "Skate Covers",
    hairAccessories: "Hair Accessories",
    bags: "Bolsas",
    phoneStrap: "Phone Strap",
    sweatshirt: "Sweatshirt",
    thermal: "Thermal",
    giftCardTitle: "Gift Card",
    giftCardDescription:
      "The perfect gift for any occasion. Choose the amount you prefer.",
    lastUnitsTitle: "Last Units",
    lastUnitsDescription:
      "Take advantage of our last stock before they run out.",
    newArrivalsTitle: "New Arrivals",
    newArrivalsDescription:
      "Discover our latest pieces designed for your performance.",
    login: "Login",
    signup: "Signup",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    personalInfo: "Personal Information",
    dob: "Date of Birth",
    gender: "Gender",
    phone: "Phone",
    residentialAddress: "Residential Address",
    deliveryAddress: "Delivery Address",
    street: "Street",
    city: "City",
    state: "State",
    zipCode: "Zip Code",
    country: "Country",
    saveChanges: "Save Changes",
    deleteAccount: "Delete Account",
    deleteAccountConfirm:
      "Are you sure you want to delete your account? This action cannot be undone.",
    logout: "Logout",
    back: "Back",
    hello: "Hello",
    welcomeBack: "Welcome back",
    createAccount: "Create your account",
    loginSubtitle: "Sign in to access your orders and favorites",
    signupSubtitle: "Join the SambaFit community",
    passwordsDontMatch: "Passwords do not match",
    errorOccurred: "An error occurred",
    loginButton: "Login",
    signupButton: "Signup",
    dontHaveAccountAction: "Don't have an account? Sign up",
    alreadyHaveAccountAction: "Already have an account? Sign in now",
    profileUpdated: "Profile updated successfully!",
    profileUpdateError: "Error updating profile",
    deleteAccountError: "Error deleting account",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    selectGender: "Select",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Other",
    genderPreferNotToSay: "Prefer not to say",
    preferredLanguage: "Preferred Language",
    completeProfile: "Complete your profile information",
    sameAsShipping: "Same as shipping address",
    allRightsReserved: "All rights reserved.",
    loginToFavorite: "Please login to favorite products",
    checkoutTitle: "Checkout",
    paymentMethod: "Payment Method",
    creditCard: "Credit Card",
    paypal: "PayPal",
    bizum: "Bizum",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    cvv: "CVV",
    payNow: "Pay Now",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shippingCost: "Shipping",
    currency: "Currency",
    converting: "Converting...",
    conversionRate: "Exchange rate",
    paymentSuccess: "Payment successful!",
    paymentError: "Payment error. Please try again.",
    myFavorites: "My Favorites",
    favoritesDescription: "Your favorite SambaFit pieces in one place.",
    favoritesEmpty: "Your list is empty",
    favoritesEmptyDesc:
      "You haven't added any products to your favorites yet. Explore our collection!",
    selectSizeWarning: "Select size",
    selectCollection: "Select a collection",
    unitsSold: "units sold",
    purchaseHistory: "My purchase history",
  },
};
