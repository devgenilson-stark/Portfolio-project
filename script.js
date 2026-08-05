// =========================================================
// OVERLAY DE INTRODUÇÃO - vídeo + flash de revelação
// =========================================================
(function () {
  const overlay = document.getElementById('overlayIntro');
  const video = document.getElementById('videoIntro');
  const flash = document.getElementById('flashIntro');
  const botaoPular = document.getElementById('botaoPularIntro');

  // Proteção: se qualquer elemento essencial não existir, aborta sem quebrar o resto do script
  if (!overlay || !video || !flash || !botaoPular) return;

  document.body.classList.add('intro-ativa');

  let jaEncerrou = false;

  function encerrarIntro() {
    if (jaEncerrou) return;
    jaEncerrou = true;

    // 1) "Explosão": vídeo estoura de brilho e escala
    video.classList.add('explodindo');

    // 2) Flash branco disparando quase junto (leve defasagem pra sincronizar com o pico do brilho)
    setTimeout(() => {
      flash.classList.add('disparar');
    }, 120);

    // 3) Depois do flash, some tudo revelando o Hero
    setTimeout(() => {
      overlay.classList.add('escondido');
      document.body.classList.remove('intro-ativa');

      iniciarReveal();
      iniciarTypingEffect();
    }, 320);

    // 4) Remove o overlay do DOM depois da transição, por limpeza
    setTimeout(() => {
      overlay.remove();
    }, 1000);
  }

  // Encerra quando o vídeo termina naturalmente
  video.addEventListener('ended', encerrarIntro);

  // Botão de pular, pra quem não quer esperar
  botaoPular.addEventListener('click', encerrarIntro);

  // Fallback de segurança: se o vídeo não carregar/travar, encerra sozinho após ~10s
  setTimeout(encerrarIntro, 10800);
})();

/* ============================================================
   EFEITO DE DIGITAÇÃO NO TERMINAL (elemento assinatura)
   ============================================================ */
function iniciarTypingEffect() {
  const el = document.getElementById("typedCode");
  if (!el) return; // proteção: evita erro se o terminal não existir nessa página

  const linhas = [
    "const voce = { antes: \"iniciante\" };",
    "",
    "function treinar(pessoa) {",
    "  pessoa.pratica += diaria;",
    "  pessoa.comunidade = \"DevClub\";",
    "  return pessoa;",
    "}",
    "",
    "const dev = treinar(voce);",
    "console.log(dev.pronto); // true",
  ];
  const textoCompleto = linhas.join("\n");
  let i = 0;

  function digitar() {
    if (i <= textoCompleto.length) {
      el.textContent = textoCompleto.slice(0, i);
      i++;
      // velocidade levemente variável, imita digitação humana
      setTimeout(digitar, 18 + Math.random() * 22);
    }
  }
  digitar();
}

// Ativa o fade-in escalonado dos elementos .reveal no Hero
function iniciarReveal() {
  document.querySelectorAll('.reveal').forEach((el) => {
    requestAnimationFrame(() => el.classList.add('reveal--ativo'));
  });
}
// --- SCROLL LATERAL + PROFUNDIDADE ---
const trilha = document.querySelector('.trilha');
const pinWrap = document.querySelector('.pin-wrap');

if (trilha && pinWrap) {
  gsap.registerPlugin(ScrollTrigger);

  const bufferFinal = window.innerWidth * 0.4;
  const distancia = () => -(trilha.scrollWidth - window.innerWidth) - bufferFinal;

  let movimento = gsap.to(trilha, {
    x: distancia,
    ease: 'none',
  });

  ScrollTrigger.create({
    trigger: pinWrap,
    start: 'top top',
    end: () => `+=${Math.abs(distancia())}`,
    pin: true,
    animation: movimento,
    scrub: 1,
  });

  const cartoes = gsap.utils.toArray('.cartao-bloco');

  cartoes.forEach((cartao) => {
    ScrollTrigger.create({
      trigger: cartao,
      containerAnimation: movimento,
      start: 'left 85%',
      end: 'right 15%',
      onUpdate: (self) => {
        const distanciaDoCentro = Math.abs(self.progress - 0.5) * 2;
        gsap.set(cartao, {
          scale: gsap.utils.interpolate(1, 0.86, distanciaDoCentro),
          filter: `blur(${distanciaDoCentro * 3}px)`,
          opacity: gsap.utils.interpolate(1, 0.5, distanciaDoCentro),
        });
      },
    });
  });
}

// ==== Fade das áreas laterais - Seção 3 (IA Ilimitada) ====
(function () {
  const secao = document.querySelector('.secao-ia-ilimitada');
  const areasLaterais = document.querySelectorAll('.area-scroll-lateral');
  if (!secao || !areasLaterais.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        areasLaterais.forEach((area) => {
          area.classList.toggle('visivel', entrada.isIntersecting);
        });
      });
    },
    {
      threshold: 0.85, // precisa de ~35% da seção visível pra aparecer
    }
  );

  observer.observe(secao);
})();

// =========================================================
// SEÇÃO QUATRO - Itens surgindo da direita ao scrollar
// =========================================================
(function () {
  const itens = document.querySelectorAll('.item-alem');
  if (!itens.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada, indice) => {
        if (entrada.isIntersecting) {
          const item = entrada.target;
          // pequeno atraso escalonado caso mais de um apareça ao mesmo tempo (telas maiores)
          const atraso = indice * 100;
          setTimeout(() => item.classList.add('visivel'), atraso);
          observer.unobserve(item);
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '0px 0px -60px 0px', // dispara um pouco antes do item chegar no fundo da tela
    }
  );

  itens.forEach((item) => observer.observe(item));
})();

// ==== Carrossel Seção 5 - Plataforma ====
(function () {
  const slidesContainer = document.getElementById('carrosselSlides');
  const dotsContainer = document.getElementById('carrosselDots');
  const setaEsquerda = document.getElementById('setaEsquerda');
  const setaDireita = document.getElementById('setaDireita');

  if (!slidesContainer) return;

  const slides = slidesContainer.querySelectorAll('.carrossel-slide');
  let indiceAtual = 0;

  // Cria os dots dinamicamente
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carrossel-dot');
    if (i === 0) dot.classList.add('ativo');
    dot.addEventListener('click', () => irParaSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.carrossel-dot');

  function irParaSlide(indice) {
    indiceAtual = indice;
    slidesContainer.style.transform = `translateX(-${indiceAtual * 100}%)`;
    dots.forEach(d => d.classList.remove('ativo'));
    dots[indiceAtual].classList.add('ativo');
  }

  setaDireita.addEventListener('click', () => {
    indiceAtual = (indiceAtual + 1) % slides.length;
    irParaSlide(indiceAtual);
  });

  setaEsquerda.addEventListener('click', () => {
    indiceAtual = (indiceAtual - 1 + slides.length) % slides.length;
    irParaSlide(indiceAtual);
  });

  // Autoplay opcional (troca a cada 5s) - remova este bloco se não quiser
  setInterval(() => {
    indiceAtual = (indiceAtual + 1) % slides.length;
    irParaSlide(indiceAtual);
  }, 5000);
})();

// ==== Duração proporcional do scroll nos cards de projetos (Seção 6) ====
(function () {
  const VELOCIDADE_PX_POR_SEGUNDO = 65; // ajuste aqui: menor = mais devagar, maior = mais rápido
  const DURACAO_MINIMA = 3; // segundos, evita ficar rápido demais em prints curtos

  function calcularDuracao(card) {
    const janela = card.querySelector('.janela-projeto-real');
    const imagem = card.querySelector('.imagem-projeto-real');

    const alturaJanela = janela.offsetHeight;
    const alturaImagem = imagem.offsetHeight;
    const distancia = alturaImagem - alturaJanela;

    if (distancia <= 0) return; // print menor que a janela, não precisa animar

    const duracao = Math.max(DURACAO_MINIMA, distancia / VELOCIDADE_PX_POR_SEGUNDO);
    imagem.style.transitionDuration = duracao.toFixed(2) + 's';
  }

  document.querySelectorAll('.card-projeto-real').forEach((card) => {
    const imagem = card.querySelector('.imagem-projeto-real');

    if (imagem.complete) {
      calcularDuracao(card);
    } else {
      imagem.addEventListener('load', () => calcularDuracao(card));
    }
  });

  // Recalcula se a janela for redimensionada (ex: usuário muda o zoom ou a tela)
  window.addEventListener('resize', () => {
    document.querySelectorAll('.card-projeto-real').forEach((card) => calcularDuracao(card));
  });
})();

// =========================================================
// SEÇÃO OITO - Carrossel de professores (setas)
// =========================================================
(function () {
  const trilho = document.getElementById('trilhoProfessores');
  const setaEsq = document.getElementById('professoresEsquerda');
  const setaDir = document.getElementById('professoresDireita');
  if (!trilho || !setaEsq || !setaDir) return;

  function larguraCard() {
    const card = trilho.querySelector('.card-professor');
    return card ? card.offsetWidth + 22 : 260; // 22 = gap aproximado
  }

  setaDir.addEventListener('click', () => {
    trilho.scrollBy({ left: larguraCard(), behavior: 'smooth' });
  });

  setaEsq.addEventListener('click', () => {
    trilho.scrollBy({ left: -larguraCard(), behavior: 'smooth' });
  });
})();

// =========================================================
// SEÇÃO NOVE - Carrossel de módulos bônus (setas)
// =========================================================
// (function () {
//   const trilho = document.getElementById('trilhoBonus');
//   const setaEsq = document.getElementById('bonusEsquerda');
//   const setaDir = document.getElementById('bonusDireita');
//   if (!trilho) return;

//   function larguraCard() {
//     const card = trilho.querySelector('.card-bonus');
//     return card ? card.offsetWidth + 19 : 220;
//   }

//   setaDir.addEventListener('click', () => {
//     trilho.scrollBy({ left: larguraCard(), behavior: 'smooth' });
//   });

//   setaEsq.addEventListener('click', () => {
//     trilho.scrollBy({ left: -larguraCard(), behavior: 'smooth' });
//   });
// })();


// =========================================================
// SEÇÃO ONZE - Gráfico de mercado animado ao entrar na tela
// =========================================================
(function () {
  const linhas = document.querySelectorAll('.linha-grafico');
  if (!linhas.length) return;

  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada, indice) => {
      if (entrada.isIntersecting) {
        // Delay escalonado entre as 3 linhas (júnior, pleno, sênior)
        const linha = entrada.target;
        const atraso = Array.from(linhas).indexOf(linha) * 150;
        setTimeout(() => linha.classList.add('animar'), atraso);
        observer.unobserve(linha);
      }
    });
  }, { threshold: 0.4 });

  linhas.forEach((linha) => observer.observe(linha));
})();


// =========================================================
// SEÇÃO TREZE - Acordeon do FAQ
// =========================================================
(function () {
  const itens = document.querySelectorAll('.item-faq');
  if (!itens.length) return;

  itens.forEach((item) => {
    const botao = item.querySelector('.pergunta-faq');
    const resposta = item.querySelector('.resposta-faq');

    botao.addEventListener('click', () => {
      const jaAberto = item.classList.contains('aberto');

      // Fecha todos os outros itens (comportamento de acordeon único)
      itens.forEach((outro) => {
        outro.classList.remove('aberto');
        outro.querySelector('.resposta-faq').style.maxHeight = null;
      });

      if (!jaAberto) {
        item.classList.add('aberto');
        resposta.style.maxHeight = resposta.scrollHeight + 'px';
      }
    });
  });
})();

// =======================FOOTER======================
// --- CUBO 3D ---
const scene = document.getElementById('areaCuboFooter');

if (scene) {
  const cube = document.getElementById('cube');

  function rotateCube(clientX, clientY) {
    const rect = scene.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) - 0.5;
    const y = ((clientY - rect.top) / rect.height) - 0.5;
    const targetY = x * 360;
    const targetX = -y * 360;
    cube.style.transform = `rotateX(${targetX}deg) rotateY(${targetY}deg)`;
  }

  function resetCube() {
    cube.style.transform = `rotateX(-15deg) rotateY(15deg)`;
  }

  scene.addEventListener('mousemove', (e) => rotateCube(e.clientX, e.clientY));
  scene.addEventListener('mouseleave', resetCube);
  scene.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      e.preventDefault();
      rotateCube(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });
  scene.addEventListener('touchend', resetCube);
}