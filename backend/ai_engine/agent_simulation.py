def simulate_agents(tx, risk_score):
    """
    Very simplified: defender wins if risk < 60
    """
    if risk_score < 60:
        return "Defender blocked attacker"
    else:
        return "Attacker almost succeeded, transaction flagged"

