# QFF Decision Flow & Thresholds

## Overview
The Quantum-Safe Financial Fabric (QFF) uses an Agentic AI engine to score transactions in real-time. The engine evaluates multiple factors including amount, transaction type, receiver reputation, and velocity to assign a risk score (0-100).

## Scoring Logic
The base score starts at **95** and is penalized based on risk factors.

### Risk Factors & Penalties
| Factor | Penalty | Condition |
| :--- | :--- | :--- |
| **Invalid Amount** | -40 | Amount <= 0 |
| **High Value** | -15 | Amount > 10,000 |
| **Anomaly** | -25 | Detected by Isolation Forest (unusual for history) |
| **Irreversible Type** | -20 | CRYPTO_TRANSFER, SMART_CONTRACT |
| **Cross-border** | -10 | FOREX_PAYMENT |
| **Receiver Flagged** | Set to 0 | Receiver address starts with `0xdead` or contains `unverified` |
| **Velocity Spike** | -10 | Random check (simulated velocity spike) |

## Thresholds & Actions
The final score determines the risk level and recommended action.

| Score Range | Risk Level | Recommendation | Description |
| :--- | :--- | :--- | :--- |
| **< 50** | **CRITICAL** | **BLOCK** | Immediate blocking of transaction. High probability of fraud. |
| **50 - 69** | **HIGH** | **FLAG** | Suspicious transaction. Requires manual review or step-up auth. |
| **70 - 84** | **MEDIUM** | **PROCEED** | Moderate risk. Logged for audit but allowed to proceed. |
| **85 - 100** | **LOW** | **PROCEED** | Safe transaction. Standard processing. |

## Fail-Safes
1. **Default Deny**: If the score calculation fails, the system defaults to a safe state (or fails open depending on config, currently fails safe by returning error).
2. **Human-in-the-Loop**: "FLAG" recommendations trigger alerts for analyst review.
3. **Auto-Protect**: "BLOCK" recommendations can be configured to automatically prevent execution.
