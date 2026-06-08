// ===============================
// 🎲 CENA
// ===============================
const scene = new THREE.Scene();
scene.background = null;

// ===============================
// 📷 CÂMERA
// ===============================
const camera = new THREE.PerspectiveCamera(
  75,
  1,
  0.1,
  1000
);

camera.position.z = 6;

// ===============================
// 🖥️ RENDER
// ===============================
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});

renderer.setSize(140, 140);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document
  .getElementById("dice3d")
  .appendChild(renderer.domElement);

// ===============================
// 💡 LUZES
// ===============================
const ambientLight = new THREE.AmbientLight(
  0xffffff,
  0.5
);

scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(
  0xffffff,
  1.3
);

keyLight.position.set(5, 8, 5);

keyLight.castShadow = true;

scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(
  0xffffff,
  0.6
);

fillLight.position.set(-5, 3, -5);

scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(
  0xffffff,
  0.7
);

rimLight.position.set(0, -5, 5);

scene.add(rimLight);

// ===============================
// 🌑 SOMBRA
// ===============================
const shadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),

  new THREE.ShadowMaterial({
    opacity: 0.2
  })
);

shadowPlane.rotation.x = -Math.PI / 2;

shadowPlane.position.y = -2;

shadowPlane.receiveShadow = true;

scene.add(shadowPlane);

// ===============================
// 🎨 FACE DO DADO
// ===============================
function criarFace(numero) {

  const canvas = document.createElement("canvas");

  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(
    0,
    0,
    512,
    512
  );

  grad.addColorStop(0, "#f5f5f5");
  grad.addColorStop(1, "#dcdcdc");

  ctx.fillStyle = grad;

  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = "#bdbdbd";

  ctx.lineWidth = 18;

  ctx.strokeRect(10, 10, 492, 492);

  ctx.fillStyle = "#111";

  function ponto(x, y) {

    ctx.beginPath();

    ctx.arc(x, y, 32, 0, Math.PI * 2);

    ctx.fill();

  }

  const pos = {

    1: [[256,256]],

    2: [
      [120,120],
      [392,392]
    ],

    3: [
      [120,120],
      [256,256],
      [392,392]
    ],

    4: [
      [120,120],
      [120,392],
      [392,120],
      [392,392]
    ],

    5: [
      [120,120],
      [120,392],
      [392,120],
      [392,392],
      [256,256]
    ],

    6: [
      [120,120],
      [120,256],
      [120,392],
      [392,120],
      [392,256],
      [392,392]
    ]

  };

  pos[numero].forEach(p => {

    ponto(p[0], p[1]);

  });

  return new THREE.CanvasTexture(canvas);

}

// ===============================
// 🧊 MATERIAL
// ===============================
function criarMaterial(numero) {

  return new THREE.MeshPhysicalMaterial({

    map: criarFace(numero),

    roughness: 0.25,

    metalness: 0.05,

    clearcoat: 0.7,

    clearcoatRoughness: 0.15

  });

}

// ===============================
// 🎲 DADO
// ===============================
const dice = new THREE.Mesh(

  new THREE.BoxGeometry(3, 3, 3),

  [
    criarMaterial(1),
    criarMaterial(2),
    criarMaterial(3),
    criarMaterial(4),
    criarMaterial(5),
    criarMaterial(6)
  ]

);

dice.castShadow = true;

scene.add(dice);

// ===============================
// 🔄 ROTAÇÕES
// ===============================
const frenteRotacoes = {

  1: {
    x: 0,
    y: -Math.PI / 2
  },

  2: {
    x: 0,
    y: Math.PI / 2
  },

  3: {
    x: Math.PI / 2,
    y: 0
  },

  4: {
    x: -Math.PI / 2,
    y: 0
  },

  5: {
    x: 0,
    y: 0
  },

  6: {
    x: 0,
    y: Math.PI
  }

};

// ===============================
// 🎮 CONTROLE
// ===============================
let estado = "parado";

let velocidadeX = 0;
let velocidadeY = 0;

let alvoX = 0;
let alvoY = 0;

// ===============================
// 📝 TEXTO
// ===============================
const texto = document.getElementById("texto");

// ===============================
// 🎲 CLIQUE DADO
// ===============================
document
  .getElementById("dice3d")
  .addEventListener("click", () => {

    if (estado !== "parado") return;

    const numero =
      Math.floor(Math.random() * 6) + 1;

    texto.innerHTML = "Girando... 🎲";

    velocidadeX =
      Math.random() * 0.6 + 0.4;

    velocidadeY =
      Math.random() * 0.6 + 0.4;

    estado = "girando";

    setTimeout(() => {

      alvoX =
        frenteRotacoes[numero].x +
        Math.PI * 4;

      alvoY =
        frenteRotacoes[numero].y +
        Math.PI * 4;

      estado = "ajustando";

      texto.innerHTML =
        `Saiu o número ${numero} 🎉`;

    }, 1200);

  });

// ===============================
// 🃏 CARTAS
// ===============================
function clicou(nome) {

  texto.innerHTML =
    `Carta escolhida: ${nome} 🃏`;

  const cartas =
    document.getElementById("cartas-osmose");

  // =========================
  // OSMOSE
  // =========================
  if (nome === "Osmose") {

    const numero =
      Math.floor(Math.random() * 13) + 1;

    cartas.innerHTML = `

      <button id="fechar-cartas">
        ✖
      </button>

      <img
        src="cartaosmose${numero}.jpeg"
        class="carta-sorteada"
      >

    `;

    cartas.style.display = "flex";

  }

  // =========================
  // DIFUSÃO SIMPLES
  // =========================
  else if (nome === "Difusão Simples") {

    const numero =
      Math.floor(Math.random() * 10) + 1;

    cartas.innerHTML = `

      <button id="fechar-cartas">
        ✖
      </button>

      <img
        src="difusao${numero}.jpeg"
        class="carta-sorteada"
      >

    `;

    cartas.style.display = "flex";

  }

  // =========================
// CASOS CLÍNICOS
// =========================
else if (nome === "Casos Clínicos") {

  const numero =
    Math.floor(Math.random() * 10) + 1;

  cartas.innerHTML = `

    <button id="fechar-cartas">
      ✖
    </button>

    <img
      src="casos${numero}.jpeg"
      class="carta-sorteada"
    >

  `;

  cartas.style.display = "flex";

}

// =========================
// DIFUSÃO FACILITADA
// =========================
else if (nome === "Difusão Facilitada") {

  const numero =
    Math.floor(Math.random() * 10) + 1;

  cartas.innerHTML = `

    <button id="fechar-cartas">
      ✖
    </button>

    <img
      src="facilitada${numero}.jpeg"
      class="carta-sorteada"
    >

  `;

  cartas.style.display = "flex";

}

  // =========================
  // OUTRAS CARTAS
  // =========================
  else {

    cartas.style.display = "none";

  }

  // =========================
  // BOTÃO FECHAR
  // =========================
  document
    .getElementById("fechar-cartas")
    .addEventListener("click", () => {

      cartas.style.display = "none";

    });

}

// ===============================
// 🔁 ANIMAÇÃO
// ===============================
function animate() {

  requestAnimationFrame(animate);

  // FLUTUAÇÃO DO DADO
  dice.position.y =
    Math.sin(Date.now() * 0.002) * 0.08;

  // GIRANDO
  if (estado === "girando") {

    dice.rotation.x += velocidadeX;

    dice.rotation.y += velocidadeY;

  }

  // AJUSTANDO
  if (estado === "ajustando") {

    dice.rotation.x +=
      (alvoX - dice.rotation.x) * 0.08;

    dice.rotation.y +=
      (alvoY - dice.rotation.y) * 0.08;

    if (
      Math.abs(alvoX - dice.rotation.x) < 0.01 &&
      Math.abs(alvoY - dice.rotation.y) < 0.01
    ) {

      estado = "parado";

    }

  }

  renderer.render(scene, camera);

}

animate();

// ==========================
// REGRAS DO JOGO
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const regras = [
        "regra1.png",
        "regra2.png",
        "regra3.png",
        "regra4.png"
    ];

    let regraAtual = 0;

    const imagemRegra = document.getElementById("imagemRegra");
    const btnProxima = document.getElementById("btnProxima");
    const btnFechar = document.getElementById("btnFechar");
    const modalRegras = document.getElementById("modalRegras");

    // Próxima regra
    btnProxima.addEventListener("click", () => {

        regraAtual++;

        if (regraAtual < regras.length) {
            imagemRegra.src = regras[regraAtual];
        }

        // Quando chegar na última imagem
        if (regraAtual === regras.length - 1) {
            btnProxima.style.display = "none";
            btnFechar.style.display = "inline-block";
        }

    });

    // Fechar modal
    btnFechar.addEventListener("click", () => {
        modalRegras.style.display = "none";
    });

});