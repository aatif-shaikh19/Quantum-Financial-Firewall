from web3 import Web3

def handle_escrow(tx_hash, decision):
    """
    Dummy escrow handler: if decision is BLOCKED, funds stay locked
    """
    if decision == "BLOCKED":
        return f"Escrow: Funds locked for transaction {tx_hash}"
    elif decision == "APPROVED":
        return f"Escrow: Funds released for transaction {tx_hash}"
    else:
        return f"Escrow: Transaction {tx_hash} requires manual review"

