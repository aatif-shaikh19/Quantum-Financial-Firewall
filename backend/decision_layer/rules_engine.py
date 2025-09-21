def apply_rules(tx, risk_score):
    if risk_score > 75:
        return "BLOCKED"
    elif 40 < risk_score <= 75:
        return "FLAGGED - REVIEW"
    else:
        return "APPROVED"

