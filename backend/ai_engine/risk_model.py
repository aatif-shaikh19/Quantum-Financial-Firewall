import random

def evaluate_risk(tx):
    """
    Simple risk evaluation for hackathon demo
    """
    # rule 1: large amount → risky
    if tx["amount"] > 1000:
        return random.randint(70, 95)

    # rule 2: suspicious receiver wallet
    if tx["receiver"].startswith("0xBAD"):
        return random.randint(80, 99)

    # else: safe-ish
    return random.randint(10, 40)

