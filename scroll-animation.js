gsap.registerPlugin(ScrollTrigger);

function criarSequenciaFrames({ canvasId, folder, frameCount, prefix = 'img', extension = 'jpg' }) {
  const canvas = document.getElementById(canvasId);
  const context = canvas.getContext('2d');

  let frameAtual = 0;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    desenharFrame(frameAtual);
  }

  const images = [];

  function getFrameName(index) {
    return `${folder}/${prefix}${index + 1}.${extension}`;
  }

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = getFrameName(i);
    img.decode().catch(() => {}); // pré-decodifica assim que carregar, evita flash na troca de frame
    images.push(img);
  }

  function desenharFrame(index) {
    const img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    frameAtual = index;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  resizeCanvas();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
  });

  images[0].decode().then(() => desenharFrame(0)).catch(() => {});

  return { desenharFrame, frameCount };
}

// ===== cria as duas sequências — AJUSTE frameCount aqui se algum lado tiver quantidade diferente =====
const animEsquerda = criarSequenciaFrames({
  canvasId: 'canvas-animation1',
  folder: 'imagens/animation',
  frameCount: 200,
});

const animDireita = criarSequenciaFrames({
  canvasId: 'canvas-animation2',
  folder: 'imagens/animation/animation2',
  frameCount: 150,
});

// ===== um único ScrollTrigger com pin, controlando as duas animações pelo mesmo progresso =====
const progresso = { valor: 0 };

gsap.to(progresso, {
  valor: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: '.secao-ia-ilimitada',
    start: 'top top',
    end: () => '+=' + (window.innerHeight * 4), // ajuste esse número pra controlar a duração do scroll
    scrub: 1.5,
    pin: true,
  },
  onUpdate: () => {
    const frameEsquerda = Math.round(progresso.valor * (animEsquerda.frameCount - 1));
    const frameDireita = Math.round(progresso.valor * (animDireita.frameCount - 1));
    animEsquerda.desenharFrame(frameEsquerda);
    animDireita.desenharFrame(frameDireita);
  },
});

// recalcula as posições de scroll depois que a página carregar por completo
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});