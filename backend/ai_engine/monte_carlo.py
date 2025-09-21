import random

def monte_carlo_simulation(tx, runs=10):
    results = []
    for _ in range(runs):
        risk = random.randint(0, 100)
        results.append(risk)
    return results

