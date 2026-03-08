// ─── 2-STEP CALCULATOR ───
function calc2step() {
  const paa = parseFloat(document.getElementById('paa').value);
  const pab = parseFloat(document.getElementById('pab').value);
  const pba = parseFloat(document.getElementById('pba').value);
  const pbb = parseFloat(document.getElementById('pbb').value);
  const start = document.getElementById('startState').value;
  const end = document.getElementById('endState').value;

  const P = { a: { a: paa, b: pab }, b: { a: pba, b: pbb } };

  // Check rows sum to 1
  const rowA = paa + pab, rowB = pba + pbb;
  if (Math.abs(rowA - 1) > 0.01 || Math.abs(rowB - 1) > 0.01) {
    document.getElementById('calcResult').textContent = `⚠ Rows don't sum to 1 (row a: ${rowA.toFixed(3)}, row b: ${rowB.toFixed(3)}). Please fix the matrix.`;
    return;
  }

  let result = 0, breakdown = [];
  for (const mid of ['a', 'b']) {
    const term = P[start][mid] * P[mid][end];
    result += term;
    breakdown.push(`p(${start},${mid})×p(${mid},${end}) = ${P[start][mid].toFixed(3)}×${P[mid][end].toFixed(3)} = ${term.toFixed(4)}`);
  }

  document.getElementById('calcResult').innerHTML =
    `P(X₂=${end} | X₀=${start}) = ${breakdown.join(' + ')}<br>= <strong>${result.toFixed(6)}</strong> ≈ ${(result*100).toFixed(2)}%`;
}

// ─── RANDOM WALK ───
const canvas = document.getElementById('rwCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
const N_STEPS = 60;
const colors = ['#7c6af7','#5fc4f0','#5fe6a0','#f0a05f','#f05f8a'];
let walkCount = 0;

function drawGrid() {
  ctx.strokeStyle = '#2e3254';
  ctx.lineWidth = 0.5;
  const yCenter = H / 2;
  const xStep = (W - 60) / N_STEPS;
  const yScale = 12;
  // horizontal grid
  for (let y = -8; y <= 8; y += 2) {
    const py = yCenter - y * yScale;
    ctx.beginPath(); ctx.moveTo(40, py); ctx.lineTo(W - 10, py); ctx.stroke();
    if (y !== 0) { ctx.fillStyle = '#3a3f6e'; ctx.font = '9px monospace'; ctx.fillText(y, 5, py + 3); }
  }
  // zero line
  ctx.strokeStyle = '#4a4e7e'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(40, yCenter); ctx.lineTo(W - 10, yCenter); ctx.stroke();
  ctx.fillStyle = '#9095b8'; ctx.font = '9px monospace'; ctx.fillText('0', 5, yCenter + 3);
  // axis labels
  ctx.fillStyle = '#5fc4f0'; ctx.font = '11px Georgia';
  ctx.fillText('Xₙ', 18, 20);
  ctx.fillText('n', W - 15, yCenter + 3);
}

function simulateWalk(color) {
  const c = color || colors[walkCount % colors.length];
  walkCount++;
  const yCenter = H / 2, xStep = (W - 60) / N_STEPS, yScale = 12;
  let x = 0;
  ctx.strokeStyle = c; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.moveTo(40, yCenter);
  for (let i = 1; i <= N_STEPS; i++) {
    x += Math.random() < 0.5 ? 1 : -1;
    const px = 40 + i * xStep, py = yCenter - x * yScale;
    ctx.lineTo(px, Math.max(10, Math.min(H - 10, py)));
  }
  ctx.stroke();
}

function simulate5Walks() { for (let i = 0; i < 5; i++) simulateWalk(); }

function clearCanvas() {
  ctx.clearRect(0, 0, W, H);
  walkCount = 0;
  drawGrid();
}

drawGrid();

// ─── FLASHCARDS ───
const cards = [
  { tag:'Definition', q:'What is a stochastic process?', a:'A collection of random variables (X_n) defined on a common probability space (Ω, 𝒜, P), indexed by time (n ∈ ℕ for discrete time, t ∈ ℝ₊ for continuous time).', f:'(Xₙ)ₙ∈ℕ or (Xₜ)ₜ∈ℝ₊' },
  { tag:'Probability Space', q:'What are the three components of a probability space?', a:'(1) Ω — sample space (set of all outcomes ω).\n(2) 𝒜 — sigma-algebra (collection of events = subsets of Ω).\n(3) P — probability measure: a countably additive function from 𝒜 to [0,1] with P(Ω) = 1.', f:'(Ω, 𝒜, P)' },
  { tag:'Definition', q:'What does "state space" mean in the context of stochastic processes?', a:'The state space S is the set of possible values that each random variable Xₙ can take. It can be a finite set (e.g. {a,b}), the natural numbers ℕ, or the reals ℝ. For each n, Xₙ: Ω → S.', f:'S = {a,b}, ℕ, or ℝ' },
  { tag:'i.i.d.', q:'What does "i.i.d." mean?', a:'"Independent and Identically Distributed." A sequence (Xₙ) is i.i.d. if (1) all Xₙ have the same distribution function F, and (2) for any n and sets A₁,…,Aₙ: P(Xᵢ ∈ Aᵢ for all i) = ∏ P(Xᵢ ∈ Aᵢ). Independence means knowing one variable tells you nothing about the others.', f:'P(X₁∈A₁,…,Xₙ∈Aₙ) = ∏P(Xᵢ∈Aᵢ)' },
  { tag:'Markov Property', q:'State the Markov property precisely.', a:'A process (Xₙ) satisfies the Markov property if for all states x,y ∈ S and all past values x₀,…,xₙ₋₁: P(Xₙ₊₁=y | Xₙ=x, Xₙ₋₁=xₙ₋₁, …, X₀=x₀) = P(X₁=y | X₀=x). In words: the future depends only on the present, not the full past.', f:'P(Xₙ₊₁=y|Xₙ=x, past) = p(x,y)' },
  { tag:'Intuition', q:'What is the key intuition behind the Markov property?', a:'"The future is independent of the past, given the present." Knowing the entire history of the process gives you no extra information about the next state beyond knowing the current state. Think of it as a "memoryless" property.', f:'"Only the present matters"' },
  { tag:'Transition Probabilities', q:'What is p(x,y) in a Markov chain?', a:'p(x,y) is the one-step transition probability from state x to state y:\np(x,y) = P(X₁ = y | X₀ = x) = P(Xₙ₊₁ = y | Xₙ = x)\nFor time-homogeneous chains, this doesn\'t depend on n.', f:'p(x,y) = P(X₁=y | X₀=x)' },
  { tag:'Transition Matrix', q:'What is the transition probability matrix, and what must its rows satisfy?', a:'For a finite-state Markov chain with states S = {s₁, s₂, …}, the transition matrix P has entries Pᵢⱼ = p(sᵢ, sⱼ). Each row must sum to 1 (since from any state, you must go somewhere): ∑ⱼ p(x,y) = 1 for each x.', f:'P = [p(x,y)]  ← each row sums to 1' },
  { tag:'Computation', q:'How do you compute P(X₃=a, X₂=b, X₁=a | X₀=a) for a Markov chain?', a:'By the Markov property, multiply one-step transition probabilities along the trajectory:\nP(X₃=a, X₂=b, X₁=a | X₀=a)\n= p(b,a) · p(a,b) · p(a,a)\nThis works because at each step, only the current state matters.', f:'= p(a,a)·p(a,b)·p(b,a)' },
  { tag:'Computation', q:'How do you compute P(X₂ = b | X₀ = a)?', a:'Sum over all possible intermediate states for X₁:\nP(X₂=b | X₀=a) = Σ_{z∈S} p(a,z)·p(z,b)\n= p(a,a)·p(a,b) + p(a,b)·p(b,b)\nThis is the "law of total probability" applied with the Markov property.', f:'Σz p(x,z)·p(z,y)' },
  { tag:'Random Walk', q:'Define a random walk. What is the simple symmetric random walk?', a:'A random walk is (Xₙ) where Xₙ = ξ₁+ξ₂+⋯+ξₙ with (ξₙ) i.i.d. increments. The simple symmetric random walk takes ξₙ = +1 or −1 each with probability 1/2 (e.g. fair coin: Heads→+1, Tails→−1).', f:'Xₙ = ξ₁ + ··· + ξₙ' },
  { tag:'Random Walk', q:'What are E[Xₙ] and Var(Xₙ) for the simple symmetric random walk?', a:'E[Xₙ] = 0 for all n (equal chance of +1 and −1, so the mean stays at 0).\nVar(Xₙ) = n (variances of independent increments add: each Var(ξᵢ) = 1).\nSo the standard deviation grows as √n — the walk "spreads out" over time.', f:'𝔼[Xₙ]=0, Var(Xₙ)=n' },
  { tag:'Key Symbol', q:'What does "≝ᵈ" (equals with d above) mean?', a:'"Equal in distribution." Two random variables X and Y satisfy X ≝ᵈ Y if they have the same distribution (probability law), meaning P(X ≤ z) = P(Y ≤ z) for all z. They are NOT necessarily the same random variable — they can be defined on different probability spaces.', f:'X ≝ᵈ Y ⟺ P(X≤z) = P(Y≤z) ∀z' },
  { tag:'Construction', q:'How can you construct a 2-state Markov chain using i.i.d. Uniform[0,1] draws?', a:'Take i.i.d. sequence (Uₙ) ~ Uniform[0,1]. At each step, given current state: If Xₙ=a: set Xₙ₊₁=a if Uₙ₊₁≤p(a,a), else Xₙ₊₁=b. If Xₙ=b: set Xₙ₊₁=b if Uₙ₊₁≤p(b,b), else Xₙ₊₁=a. The independence of Uₙ₊₁ from all past U₁,…,Uₙ ensures the Markov property holds.', f:'Use Uₙ₊₁ ~ Unif[0,1] to "decide" transitions' },
];

let order = cards.map((_, i) => i);
let current = 0;
let isFlipped = false;

function renderCard() {
  const idx = order[current];
  const c = cards[idx];
  document.getElementById('cardTag').textContent = c.tag;
  document.getElementById('cardQ').textContent = c.q;
  document.getElementById('cardA').innerHTML = c.a.replace(/\n/g, '<br>');
  document.getElementById('cardF').textContent = c.f || '';
  if (!c.f) document.getElementById('cardF').style.display = 'none';
  else document.getElementById('cardF').style.display = '';
  document.getElementById('fcProgress').textContent = `Card ${current + 1} / ${cards.length}`;
  // dots
  const dots = document.getElementById('fcDots');
  dots.innerHTML = '';
  const show = Math.min(cards.length, 14);
  for (let i = 0; i < show; i++) {
    const d = document.createElement('div');
    d.className = 'fc-dot' + (i === current ? ' active' : '');
    dots.appendChild(d);
  }
  // unflip
  isFlipped = false;
  document.getElementById('flashcard').classList.remove('flipped');
  if (window.MathJax) MathJax.typesetPromise();
}

function flipCard() {
  isFlipped = !isFlipped;
  document.getElementById('flashcard').classList.toggle('flipped', isFlipped);
}
function nextCard() { current = (current + 1) % cards.length; renderCard(); }
function prevCard() { current = (current - 1 + cards.length) % cards.length; renderCard(); }
function shuffleCards() {
  order = order.sort(() => Math.random() - 0.5);
  current = 0; renderCard();
}
function resetCards() {
  order = cards.map((_, i) => i);
  current = 0; renderCard();
}

renderCard();
