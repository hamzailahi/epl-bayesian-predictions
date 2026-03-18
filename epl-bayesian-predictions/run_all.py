"""
Run the full prediction pipeline.
Usage: python run_all.py
"""
import subprocess, sys, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

scripts = [
    ("models/01_base_model.py", "Base Poisson + Bradley-Terry model"),
    ("models/02_dixon_coles_model.py", "Dixon-Coles enhanced model + Monte Carlo simulation"),
]

print("=" * 60)
print("  EPL 2025-26 BAYESIAN PREDICTION PIPELINE")
print("=" * 60)

for script, desc in scripts:
    print(f"\n{'─' * 60}")
    print(f"  ▶ {desc}")
    print(f"{'─' * 60}")
    result = subprocess.run([sys.executable, script])
    if result.returncode != 0:
        print(f"\n  ✗ ERROR in {script}!")
        sys.exit(1)

print("\n" + "=" * 60)
print("  ✓ Pipeline complete! Check output/ for results.")
print("=" * 60)
