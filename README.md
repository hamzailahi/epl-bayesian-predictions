# EPL 2025-26 Bayesian Match Predictions

Predicting the final Premier League standings using a **Bayesian ensemble model** that combines Dixon-Coles Poisson regression with Bradley-Terry pairwise strength estimation, fitted on 301 real match results.

**Model accuracy: 51.2%** — outperforms Bet365 bookmakers (49.5%) on both accuracy and log-loss.

![Dashboard Preview](https://img.shields.io/badge/Model-Dixon--Coles%20%2B%20BT-blue) ![Accuracy](https://img.shields.io/badge/Accuracy-51.2%25-green) ![Simulations](https://img.shields.io/badge/Monte%20Carlo-10%2C000%20sims-orange)

---

## Key Predictions (as of GW31)

| | Team | Current Pts | Predicted Final | Title % | Top 4 % | Relegation % |
|---|---|---|---|---|---|---|
| 1 | Arsenal | 70 | 85.5 ± 2.9 | **99.5%** | 100% | — |
| 2 | Man City | 61 | 73.6 ± 3.2 | 0.5% | 99.9% | — |
| 3 | Man United | 54 | 68.4 ± 3.5 | — | 94.6% | — |
| 4 | Aston Villa | 51 | 61.7 ± 3.6 | — | 34.9% | — |
| 5 | Liverpool | 49 | 61.0 ± 3.6 | — | 34.3% | — |
| 6 | Chelsea | 48 | 60.7 ± 3.5 | — | 31.8% | — |
| ... | ... | ... | ... | ... | ... | ... |
| 18 | Tottenham | 30 | 37.9 ± 3.3 | — | — | 33.0% |
| 19 | Burnley | 20 | 26.6 ± 3.1 | — | — | 99.8% |
| 20 | Wolves | 17 | 26.0 ± 3.2 | — | — | 99.8% |

---

## Model Architecture

### Ensemble Components

**1. Dixon-Coles Poisson Model (primary)**
- Each team has latent **attack** (α) and **defense** (β) parameters
- Match goals: `Home ~ Poisson(α_home × β_away × home_advantage)`
- **ρ parameter** inflates draw probabilities for low-scoring games (0-0, 1-1)
- Fitted via Maximum Likelihood Estimation with Bayesian shrinkage priors

**2. Bradley-Terry Pairwise Model**
- Latent team strength parameters with home advantage and draw width
- Provides calibrated win/draw/loss probabilities per fixture

**3. Ensemble → Monte Carlo**
- 65/35 weighted combination of Dixon-Coles and Bradley-Terry
- 10,000 season simulations of all 78 remaining fixtures
- Outputs: probability distributions for final position, points, title, top 4, relegation

### Improvements Over Basic Poisson

| Feature | Impact | Description |
|---|---|---|
| Dixon-Coles ρ | +2% accuracy | Inflates P(0-0) and P(1-1) — fixed the draw prediction problem |
| Recency weighting | +1% accuracy | Exponential decay (half-life=80 matches), recent form weighted more |
| SOT-based xG proxy | Better calibration | Shots on target → expected goals (r=0.557 with actual goals) |
| Form adjustment | Forward prediction | Last 8 games weighted 25% in final parameters |

### Validation

```
Our model:  154/301 = 51.2% accuracy | Log-loss: 1.010
Bet365:     149/301 = 49.5% accuracy | Log-loss: 1.019
```

The model's biggest improvement was fixing the **draw problem**: basic Poisson predicted 3 draws out of 301 matches (actual: 82). Dixon-Coles ρ raised this to 54 predicted draws.

---

## Repository Structure

```
epl-bayesian-predictions/
├── README.md
├── requirements.txt
├── run_all.py                          # Run full pipeline
├── data/
│   ├── E0.csv                          # 301 match results (football-data.co.uk)
│   └── remaining_fixtures.csv          # MW31-38 real fixtures
├── models/
│   ├── 01_base_model.py                # Base Poisson + Bradley-Terry
│   └── 02_dixon_coles_model.py         # Enhanced DC + recency + form (main model)
├── output/
│   ├── predictions.json                # Full predictions with position distributions
│   ├── predicted_standings.csv         # Summary table
│   └── fixture_analysis.csv            # Per-fixture win/draw/loss probabilities
└── dashboard/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        └── App.jsx                     # Full React dashboard (4 tabs)
```

---

## Quick Start

### Run the models

```bash
# Install dependencies
pip install -r requirements.txt

# Run full pipeline (base model → enhanced model → Monte Carlo)
python run_all.py

# Or run individually
python models/01_base_model.py
python models/02_dixon_coles_model.py
```

### Run the dashboard locally

```bash
cd dashboard
npm install
npm run dev
# Open http://localhost:5173
```

### Build for GitHub Pages

```bash
cd dashboard
npm run build
# Deploy the build/ folder to GitHub Pages
```

---

## Data Sources

| Source | What | License |
|---|---|---|
| [football-data.co.uk](https://www.football-data.co.uk/englandm.php) | 301 match results with scores, shots, odds | Free / public |
| [premierleague.com](https://www.premierleague.com/fixtures) | Remaining fixture schedule (MW31-38) | Public |
| Bet365 odds (in E0.csv) | Used for benchmarking only | Via football-data.co.uk |

### E0.csv Key Columns

- `HomeTeam`, `AwayTeam` — team names
- `FTHG`, `FTAG` — full-time home/away goals
- `FTR` — full-time result (H/D/A)
- `HS`, `AS`, `HST`, `AST` — shots and shots on target
- `B365H`, `B365D`, `B365A` — Bet365 closing odds

---

## Dashboard

The React dashboard has 4 interactive tabs:

1. **Predicted Standings** — sortable table with 90% confidence intervals, probability bars for title/top4/relegation
2. **Monte Carlo** — title race, top 4, and relegation probability breakdowns + attack vs defense scatter plot
3. **Team Profiles** — per-team deep dives with radar charts and position distribution histograms from 10K simulations
4. **Fixture Analysis** — remaining match probabilities with expected goals + fixture difficulty heatmap

---

## Technical Details

### Bayesian Priors

- Attack/defense parameters: `N(0, σ²)` with `σ² = 1/3` (weakly informative)
- Sum-to-zero constraint on log-attack for identifiability
- Rho parameter: `N(0, σ²)` with `σ² = 1/10` (prior toward no adjustment)

### Monte Carlo Simulation

- 10,000 full season simulations
- Each remaining fixture sampled independently
- Parameter uncertainty injected via `exp(N(0, 0.08))` multiplicative noise on λ
- Rankings computed by: points → goal difference → goals scored

### Anti-Overfitting Measures

- Bayesian shrinkage priors (regularization strength = 1.5)
- Recency weighting prevents overfitting to early-season form
- Form window (8 games) blended at only 25% weight
- Posterior predictive checks on all 301 training matches
- Cross-validation of half-life parameter

---

## License

MIT

---

## Acknowledgments

- [football-data.co.uk](https://www.football-data.co.uk/) for free match data
- Dixon & Coles (1997): "Modelling Association Football Scores and Inefficiencies in the Football Betting Market"
- Bradley & Terry (1952): "Rank Analysis of Incomplete Block Designs"
