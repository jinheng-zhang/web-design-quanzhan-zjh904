/*
姓名：zjh | 学号：904 |
时间：2026-11-19 | 大模型：CodeBuddy (Tencent Hunyuan Hy)
*/
(function () {
  const zjh_canvas = document.getElementById('zjh_bg_canvas');
  if (!zjh_canvas) return;
  const zjh_ctx = zjh_canvas.getContext('2d');
  let zjh_particles = [];
  let zjh_width = 0;
  let zjh_height = 0;
  const zjh_mouse = { x: -9999, y: -9999 };

  function zjh_resize() {
    const zjh_ratio = Math.min(window.devicePixelRatio || 1, 2);
    zjh_width = window.innerWidth;
    zjh_height = window.innerHeight;
    zjh_canvas.width = zjh_width * zjh_ratio;
    zjh_canvas.height = zjh_height * zjh_ratio;
    zjh_ctx.setTransform(zjh_ratio, 0, 0, zjh_ratio, 0, 0);
    const zjh_count = Math.min(90, Math.max(35, Math.floor((zjh_width * zjh_height) / 16000)));
    zjh_particles = Array.from({ length: zjh_count }, () => ({
      x: Math.random() * zjh_width,
      y: Math.random() * zjh_height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.8 + 0.8
    }));
  }

  function zjh_draw() {
    zjh_ctx.clearRect(0, 0, zjh_width, zjh_height);
    for (const zjh_p of zjh_particles) {
      zjh_p.x += zjh_p.vx;
      zjh_p.y += zjh_p.vy;
      if (zjh_p.x < 0 || zjh_p.x > zjh_width) zjh_p.vx *= -1;
      if (zjh_p.y < 0 || zjh_p.y > zjh_height) zjh_p.vy *= -1;
      const zjh_dx = zjh_p.x - zjh_mouse.x;
      const zjh_dy = zjh_p.y - zjh_mouse.y;
      if (Math.hypot(zjh_dx, zjh_dy) < 120) {
        zjh_p.x += zjh_dx * 0.008;
        zjh_p.y += zjh_dy * 0.008;
      }
      zjh_ctx.beginPath();
      zjh_ctx.arc(zjh_p.x, zjh_p.y, zjh_p.r, 0, Math.PI * 2);
      zjh_ctx.fillStyle = 'rgba(150, 200, 255, 0.55)';
      zjh_ctx.fill();
    }
    for (let zjh_i = 0; zjh_i < zjh_particles.length; zjh_i++) {
      for (let zjh_j = zjh_i + 1; zjh_j < zjh_particles.length; zjh_j++) {
        const zjh_a = zjh_particles[zjh_i];
        const zjh_b = zjh_particles[zjh_j];
        const zjh_dist = Math.hypot(zjh_a.x - zjh_b.x, zjh_a.y - zjh_b.y);
        if (zjh_dist < 130) {
          zjh_ctx.beginPath();
          zjh_ctx.moveTo(zjh_a.x, zjh_a.y);
          zjh_ctx.lineTo(zjh_b.x, zjh_b.y);
          zjh_ctx.strokeStyle = `rgba(110, 231, 255, ${0.14 * (1 - zjh_dist / 130)})`;
          zjh_ctx.lineWidth = 1;
          zjh_ctx.stroke();
        }
      }
    }
    requestAnimationFrame(zjh_draw);
  }

  window.addEventListener('resize', zjh_resize);
  window.addEventListener('mousemove', (zjh_event) => {
    zjh_mouse.x = zjh_event.clientX;
    zjh_mouse.y = zjh_event.clientY;
  });
  window.addEventListener('mouseleave', () => {
    zjh_mouse.x = -9999;
    zjh_mouse.y = -9999;
  });

  zjh_resize();
  zjh_draw();

  fetch('/api/health')
    .then((zjh_response) => zjh_response.json())
    .then((zjh_result) => console.log('[zjh] 健康接口返回:', zjh_result))
    .catch((zjh_error) => console.error('[zjh] 健康接口请求失败:', zjh_error));
})();
