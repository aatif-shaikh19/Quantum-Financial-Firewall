# backend/app/alerter.py
"""
Incident Alert System - Email and Webhook Notifications
Supports multiple notification channels for security events
"""
import os
import json
import smtplib
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Dict, Optional, List

# Configuration from environment
ALERT_WEBHOOK = os.environ.get("QFF_ALERT_WEBHOOK", "")
ALERT_EMAIL_ENABLED = os.environ.get("QFF_ALERT_EMAIL_ENABLED", "false").lower() == "true"
SMTP_HOST = os.environ.get("QFF_SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("QFF_SMTP_PORT", "587"))
SMTP_USER = os.environ.get("QFF_SMTP_USER", "")
SMTP_PASS = os.environ.get("QFF_SMTP_PASS", "")
ALERT_EMAIL_TO = os.environ.get("QFF_ALERT_EMAIL_TO", "").split(",")
ALERT_EMAIL_FROM = os.environ.get("QFF_ALERT_EMAIL_FROM", "qff-alerts@example.com")

# Alert history for dashboard
alert_history: List[Dict] = []
MAX_HISTORY = 100


class AlertLevel:
    CRITICAL = "CRITICAL"
    SECURITY = "SECURITY"
    WARNING = "WARNING"
    INFO = "INFO"


def notify(level: str, title: str, message: str, metadata: Optional[Dict] = None):
    """
    Send alert notification through all configured channels.
    
    Args:
        level: Alert severity (CRITICAL, SECURITY, WARNING, INFO)
        title: Alert title/subject
        message: Alert message body
        metadata: Additional context data
    """
    timestamp = datetime.utcnow().isoformat() + "Z"
    
    payload = {
        "time": timestamp,
        "level": level,
        "title": title,
        "message": message,
        "metadata": metadata or {}
    }
    
    # Store in history
    alert_history.insert(0, payload)
    if len(alert_history) > MAX_HISTORY:
        alert_history.pop()
    
    # Console logging
    print(f"[ALERT][{level}] {title}: {message}")
    
    # Webhook notification
    if ALERT_WEBHOOK:
        _send_webhook(payload)
    
    # Email notification for critical/security alerts
    if ALERT_EMAIL_ENABLED and level in (AlertLevel.CRITICAL, AlertLevel.SECURITY):
        _send_email(level, title, message, metadata)
    
    return payload


def _send_webhook(payload: Dict):
    """Send alert to configured webhook (Slack, Discord, Teams, etc.)"""
    try:
        # Format for Slack-compatible webhook
        webhook_payload = {
            "text": f"🚨 *[{payload['level']}]* {payload['title']}",
            "attachments": [{
                "color": _get_color(payload['level']),
                "fields": [
                    {"title": "Message", "value": payload['message'], "short": False},
                    {"title": "Time", "value": payload['time'], "short": True},
                    {"title": "Level", "value": payload['level'], "short": True}
                ]
            }]
        }
        
        if payload.get('metadata'):
            webhook_payload["attachments"][0]["fields"].append({
                "title": "Details",
                "value": f"```{json.dumps(payload['metadata'], indent=2)[:500]}```",
                "short": False
            })
        
        response = requests.post(
            ALERT_WEBHOOK,
            json=webhook_payload,
            timeout=5
        )
        
        if response.status_code != 200:
            print(f"Webhook failed: {response.status_code}")
            
    except Exception as e:
        print(f"Webhook error: {e}")


def _send_email(level: str, title: str, message: str, metadata: Optional[Dict] = None):
    """Send email alert for critical incidents"""
    if not SMTP_USER or not ALERT_EMAIL_TO:
        print("Email not configured, skipping")
        return
    
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[QFF {level}] {title}"
        msg["From"] = ALERT_EMAIL_FROM
        msg["To"] = ", ".join(ALERT_EMAIL_TO)
        
        # Plain text version
        text_content = f"""
QFF Security Alert
==================
Level: {level}
Title: {title}
Time: {datetime.utcnow().isoformat()}Z

Message:
{message}

Metadata:
{json.dumps(metadata or {}, indent=2)}

---
Quantum Financial Firewall
        """
        
        # HTML version
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="background: {_get_color(level)}; color: white; padding: 15px; border-radius: 5px;">
                <h2 style="margin: 0;">🚨 QFF Security Alert</h2>
            </div>
            <div style="padding: 20px; border: 1px solid #ddd; margin-top: 10px; border-radius: 5px;">
                <p><strong>Level:</strong> {level}</p>
                <p><strong>Title:</strong> {title}</p>
                <p><strong>Time:</strong> {datetime.utcnow().isoformat()}Z</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>{message}</p>
                <hr>
                <p><strong>Details:</strong></p>
                <pre style="background: #f5f5f5; padding: 10px; overflow-x: auto;">{json.dumps(metadata or {}, indent=2)}</pre>
            </div>
            <p style="color: #888; font-size: 12px; margin-top: 20px;">
                Quantum Financial Firewall - Automated Security Alert
            </p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))
        
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(ALERT_EMAIL_FROM, ALERT_EMAIL_TO, msg.as_string())
            
        print(f"Email alert sent to {ALERT_EMAIL_TO}")
        
    except Exception as e:
        print(f"Email send failed: {e}")


def _get_color(level: str) -> str:
    """Get color code for alert level"""
    colors = {
        AlertLevel.CRITICAL: "#dc3545",  # Red
        AlertLevel.SECURITY: "#fd7e14",  # Orange
        AlertLevel.WARNING: "#ffc107",   # Yellow
        AlertLevel.INFO: "#17a2b8"       # Blue
    }
    return colors.get(level, "#6c757d")


def get_alert_history(limit: int = 50) -> List[Dict]:
    """Get recent alert history"""
    return alert_history[:limit]


def get_alert_stats() -> Dict:
    """Get alert statistics"""
    stats = {
        "total": len(alert_history),
        "critical": 0,
        "security": 0,
        "warning": 0,
        "info": 0
    }
    
    for alert in alert_history:
        level = alert.get("level", "").upper()
        if level == "CRITICAL":
            stats["critical"] += 1
        elif level == "SECURITY":
            stats["security"] += 1
        elif level == "WARNING":
            stats["warning"] += 1
        else:
            stats["info"] += 1
    
    return stats

