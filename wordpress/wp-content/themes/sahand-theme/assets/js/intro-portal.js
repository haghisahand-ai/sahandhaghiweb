/**
 * SAHAND Cinematic Intro Portal JavaScript
 * Pure Vanilla JS, zero dependencies, lightweight 60fps canvas
 */
(function() {
  'use strict';

  var canvas = document.getElementById('sahand-neural-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var animationFrameId = null;
  var isMotionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motionToggleBtn = document.getElementById('toggle-motion-btn');
  var headlineElem = document.getElementById('intro-headline');

  var headlines = {
    fa: 'فراتر از فناوری. ساخت آنچه در راه است.',
    en: "Beyond Technology. Building What's Next.",
    tr: 'Teknolojinin Ötesinde. Geleceği İnşa Etmek.'
  };

  // Resize canvas
  var width = (canvas.width = window.innerWidth);
  var height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', function() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle network simulation
  var nodeCount = Math.min(50, Math.floor(window.innerWidth / 28));
  var nodes = [];

  for (var i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.8,
      pulse: Math.random() * Math.PI
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Radial gradient
    var gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      60,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.7
    );
    gradient.addColorStop(0, '#0a101f');
    gradient.addColorStop(0.6, '#070b14');
    gradient.addColorStop(1, '#03060b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle coordinate lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (var x = 0; x < width; x += 90) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (var y = 0; y < height; y += 90) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Connect node threads
    for (var a = 0; a < nodes.length; a++) {
      for (var b = a + 1; b < nodes.length; b++) {
        var dx = nodes[a].x - nodes[b].x;
        var dy = nodes[a].y - nodes[b].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          var alpha = (1 - dist / 130) * 0.2;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(2, 132, 199, ' + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (var n = 0; n < nodes.length; n++) {
      var node = nodes[n];
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      node.pulse += 0.02;
      var currentAlpha = 0.35 + Math.sin(node.pulse) * 0.25;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, ' + currentAlpha + ')';
      ctx.fill();
    }

    if (!isMotionReduced) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  if (motionToggleBtn) {
    motionToggleBtn.textContent = isMotionReduced ? 'MOTION: OFF' : 'MOTION: ON';
    motionToggleBtn.setAttribute('aria-pressed', isMotionReduced ? 'true' : 'false');
  }

  // Render one static frame when the operating system requests reduced motion.
  render();

  // Toggle Motion
  if (motionToggleBtn) {
    motionToggleBtn.addEventListener('click', function() {
      isMotionReduced = !isMotionReduced;
      motionToggleBtn.textContent = isMotionReduced ? 'MOTION: OFF' : 'MOTION: ON';
      motionToggleBtn.setAttribute('aria-pressed', isMotionReduced ? 'true' : 'false');

      if (!isMotionReduced) {
        render();
      } else if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });
  }

  // Language cards use their server-rendered URLs. This preserves WordPress
  // subdirectory installs and Polylang's translated front-page destinations.
  var langCards = document.querySelectorAll('.lang-card');
  langCards.forEach(function(card) {
    var lang = card.getAttribute('data-lang');

    card.addEventListener('mouseenter', function() {
      if (headlines[lang] && headlineElem) {
        headlineElem.textContent = headlines[lang];
      }
    });

    card.addEventListener('mouseleave', function() {
      if (headlineElem) {
        headlineElem.textContent = headlines.en;
      }
    });
  });

})();
