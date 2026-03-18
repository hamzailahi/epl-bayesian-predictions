"""
=============================================================
01_base_model.py — Bayesian Poisson + Bradley-Terry (v2)
=============================================================
Fits team attack/defense parameters from real match scorelines
using Maximum Likelihood with Bayesian regularization priors.

Data: football-data.co.uk E0.csv (301 EPL 2025-26 matches)
Output: output/base_model_predictions.json
=============================================================
"""
import json, warnings, os
import numpy as np
import pandas as pd
from scipy.stats import poisson
from scipy.optimize import minimize
warnings.filterwarnings('ignore')

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'output')
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("=" * 65)
print("  01 — BASE MODEL: Poisson + Bradley-Terry")
print("=" * 65)

# Load data
matches = pd.read_csv(os.path.join(DATA_DIR, 'E0.csv'), encoding='utf-8-sig')
fixtures = pd.read_csv(os.path.join(DATA_DIR, 'remaining_fixtures.csv'))
print(f"  Loaded {len(matches)} matches, {len(fixtures)} remaining fixtures")

team_names = sorted(matches['HomeTeam'].unique())
n_teams = len(team_names)
team_idx = {t: i for i, t in enumerate(team_names)}

# Precompute arrays
home_idx = np.array([team_idx[t] for t in matches['HomeTeam']])
away_idx = np.array([team_idx[t] for t in matches['AwayTeam']])
home_goals = matches['FTHG'].values.astype(int)
away_goals = matches['FTAG'].values.astype(int)
results_arr = matches['FTR'].values
avg_hg = matches['FTHG'].mean()
avg_ag = matches['FTAG'].mean()

# ═══ Poisson MLE ═══
print("\n  Fitting Poisson model...")
def poisson_nll(params):
    att = np.exp(params[:n_teams])
    dfn = np.exp(params[n_teams:2*n_teams])
    ha = np.exp(params[2*n_teams])
    lh = np.maximum(att[home_idx] * dfn[away_idx] * ha, 0.01)
    la = np.maximum(att[away_idx] * dfn[home_idx], 0.01)
    nll = -np.sum(home_goals * np.log(lh) - lh + away_goals * np.log(la) - la)
    nll += 2.0 * np.sum(params[:n_teams]**2) + 2.0 * np.sum(params[n_teams:2*n_teams]**2)
    nll += 50.0 * (np.sum(params[:n_teams]))**2
    return nll

init = np.zeros(2 * n_teams + 1)
init[2 * n_teams] = np.log(avg_hg / avg_ag)
res = minimize(poisson_nll, init, method='L-BFGS-B', options={'maxiter': 5000, 'ftol': 1e-10})

att = np.exp(res.x[:n_teams])
dfn = np.exp(res.x[n_teams:2*n_teams])
ha = np.exp(res.x[2*n_teams])
att /= np.exp(np.mean(np.log(att)))
dfn /= np.exp(np.mean(np.log(dfn)))

print(f"  Home advantage: {ha:.3f}")
print(f"  Converged: {res.success}")

# Validate
correct = 0
for i in range(len(matches)):
    lh = att[home_idx[i]] * dfn[away_idx[i]] * ha
    la = att[away_idx[i]] * dfn[home_idx[i]]
    ph = sum(poisson.pmf(hg, lh) * poisson.pmf(ag, la) for hg in range(7) for ag in range(7) if hg > ag)
    pd_ = sum(poisson.pmf(g, lh) * poisson.pmf(g, la) for g in range(7))
    pa = max(0, 1 - ph - pd_)
    pred = max([('H', ph), ('D', pd_), ('A', pa)], key=lambda x: x[1])[0]
    if pred == results_arr[i]:
        correct += 1

print(f"  Poisson accuracy: {correct}/{len(matches)} = {correct/len(matches)*100:.1f}%")

# ═══ Bradley-Terry ═══
print("\n  Fitting Bradley-Terry model...")
def bt_nll(params):
    th = np.exp(params[:n_teams])
    bha = np.exp(params[n_teams])
    dw = np.exp(params[n_teams + 1])
    hs = th[home_idx] * bha
    asr = th[away_idx]
    tot = hs + asr + dw * np.sqrt(hs * asr)
    nll = 0
    for i in range(len(matches)):
        if results_arr[i] == 'H': nll -= np.log(max(hs[i] / tot[i], 1e-10))
        elif results_arr[i] == 'D': nll -= np.log(max(dw * np.sqrt(hs[i] * asr[i]) / tot[i], 1e-10))
        else: nll -= np.log(max(asr[i] / tot[i], 1e-10))
    nll += 1.0 * np.sum(params[:n_teams]**2) + 30 * (np.sum(params[:n_teams]))**2
    return nll

bt_res = minimize(bt_nll, np.zeros(n_teams + 2), method='L-BFGS-B', options={'maxiter': 5000})
bt_theta = np.exp(bt_res.x[:n_teams])
bt_theta /= np.sum(bt_theta)
bt_ha = np.exp(bt_res.x[n_teams])
bt_dw = np.exp(bt_res.x[n_teams + 1])

bt_correct = 0
for i in range(len(matches)):
    hs = bt_theta[home_idx[i]] * bt_ha
    asr = bt_theta[away_idx[i]]
    tot = hs + asr + bt_dw * np.sqrt(hs * asr)
    probs = {'H': hs / tot, 'D': bt_dw * np.sqrt(hs * asr) / tot, 'A': asr / tot}
    if max(probs, key=probs.get) == results_arr[i]:
        bt_correct += 1

print(f"  BT accuracy: {bt_correct}/{len(matches)} = {bt_correct/len(matches)*100:.1f}%")
print(f"  BT home advantage: {bt_ha:.3f}, draw param: {bt_dw:.3f}")

# Save parameters
params_out = {
    "model": "base_poisson_bt",
    "attack": {t: round(float(att[team_idx[t]]), 4) for t in team_names},
    "defense": {t: round(float(dfn[team_idx[t]]), 4) for t in team_names},
    "home_advantage": round(float(ha), 4),
    "bt_strength": {t: round(float(bt_theta[team_idx[t]]), 6) for t in team_names},
    "bt_home_advantage": round(float(bt_ha), 4),
    "bt_draw_param": round(float(bt_dw), 4),
    "poisson_accuracy": round(correct / len(matches) * 100, 1),
    "bt_accuracy": round(bt_correct / len(matches) * 100, 1),
}
with open(os.path.join(OUTPUT_DIR, 'base_model_params.json'), 'w') as f:
    json.dump(params_out, f, indent=2)

print(f"\n  Saved: output/base_model_params.json")
print("=" * 65)
