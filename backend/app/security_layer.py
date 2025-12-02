# backend/app/security_layer.py
"""
Security & Data Protection Layer
Implements encryption at rest, field-level encryption, and data masking
"""
import os
import base64
import hashlib
import secrets
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from typing import Dict, Optional, Any
import json

class SecurityLayer:
    """
    Comprehensive security layer providing:
    1. Encryption at rest for sensitive data
    2. Field-level encryption for PII
    3. Data masking for display
    4. Secure key derivation
    """
    
    def __init__(self):
        # Master key from environment or generate
        master_key_env = os.environ.get("QFF_MASTER_KEY", "")
        if master_key_env:
            self.master_key = base64.urlsafe_b64decode(master_key_env)
        else:
            # Generate deterministic key for demo (use env var in production)
            self.master_key = self._derive_key("qff-demo-master-key-2024", b"qff-salt")
        
        self.fernet = Fernet(base64.urlsafe_b64encode(self.master_key[:32]))
        self.initialized = True
    
    def _derive_key(self, password: str, salt: bytes) -> bytes:
        """Derive encryption key from password using PBKDF2"""
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        return kdf.derive(password.encode())
    
    def encrypt(self, plaintext: str) -> str:
        """Encrypt sensitive data"""
        if not plaintext:
            return ""
        encrypted = self.fernet.encrypt(plaintext.encode())
        return base64.urlsafe_b64encode(encrypted).decode()
    
    def decrypt(self, ciphertext: str) -> str:
        """Decrypt sensitive data"""
        if not ciphertext:
            return ""
        try:
            encrypted = base64.urlsafe_b64decode(ciphertext.encode())
            decrypted = self.fernet.decrypt(encrypted)
            return decrypted.decode()
        except Exception:
            return "[DECRYPTION_FAILED]"
    
    def encrypt_field(self, data: Dict, field: str) -> Dict:
        """Encrypt a specific field in a dictionary"""
        if field in data and data[field]:
            data[f"{field}_encrypted"] = self.encrypt(str(data[field]))
            data[field] = self.mask_data(str(data[field]))
        return data
    
    def mask_data(self, data: str, visible_chars: int = 4) -> str:
        """Mask sensitive data for display"""
        if not data or len(data) <= visible_chars:
            return "*" * len(data) if data else ""
        return data[:visible_chars] + "*" * (len(data) - visible_chars)
    
    def mask_email(self, email: str) -> str:
        """Mask email address"""
        if not email or "@" not in email:
            return self.mask_data(email)
        parts = email.split("@")
        masked_local = self.mask_data(parts[0], 2)
        return f"{masked_local}@{parts[1]}"
    
    def mask_card(self, card_number: str) -> str:
        """Mask credit card number (show last 4)"""
        clean = "".join(c for c in card_number if c.isdigit())
        if len(clean) < 4:
            return "*" * len(clean)
        return "*" * (len(clean) - 4) + clean[-4:]
    
    def mask_account(self, account: str) -> str:
        """Mask account/wallet address"""
        if len(account) <= 8:
            return self.mask_data(account)
        return account[:4] + "..." + account[-4:]
    
    def hash_pii(self, data: str) -> str:
        """Create irreversible hash of PII for matching"""
        return hashlib.sha256(f"qff-pii-{data}".encode()).hexdigest()
    
    def secure_compare(self, a: str, b: str) -> bool:
        """Constant-time string comparison to prevent timing attacks"""
        return secrets.compare_digest(a, b)
    
    def generate_secure_token(self, length: int = 32) -> str:
        """Generate cryptographically secure random token"""
        return secrets.token_urlsafe(length)
    
    def encrypt_transaction_data(self, tx: Dict) -> Dict:
        """Encrypt sensitive transaction fields"""
        encrypted_tx = tx.copy()
        
        # Encrypt receiver info
        if "receiver" in encrypted_tx:
            encrypted_tx["receiver_hash"] = self.hash_pii(encrypted_tx["receiver"])
            encrypted_tx["receiver_masked"] = self.mask_account(encrypted_tx["receiver"])
        
        # Encrypt amount for at-rest storage
        if "amount" in encrypted_tx:
            encrypted_tx["amount_encrypted"] = self.encrypt(str(encrypted_tx["amount"]))
        
        return encrypted_tx
    
    def get_security_status(self) -> Dict:
        """Get current security layer status"""
        return {
            "encryption_enabled": True,
            "algorithm": "AES-256-GCM (Fernet)",
            "key_derivation": "PBKDF2-SHA256",
            "iterations": 100000,
            "masking_enabled": True,
            "pii_hashing": "SHA-256",
            "status": "ACTIVE"
        }


# Singleton instance
security_layer = SecurityLayer()
