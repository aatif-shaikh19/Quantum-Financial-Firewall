# backend/app/hsm_client.py
"""
HSM (Hardware Security Module) Client for secure key management
Simulates HSM operations with optional integration points for real HSM devices
"""
import os
import secrets
import hashlib
from typing import Optional, Dict, Tuple
from datetime import datetime
import json

class HSMClient:
    """
    HSM Client for secure cryptographic operations
    In production, this would interface with physical HSM devices (e.g., Thales, Utimaco)
    or cloud HSM services (AWS CloudHSM, Azure Key Vault HSM, Google Cloud HSM)
    """
    
    def __init__(self, mode: str = "simulation"):
        """
        Initialize HSM client
        mode: 'simulation' | 'aws_cloudhsm' | 'azure_keyvault' | 'physical'
        """
        self.mode = mode
        self.key_store: Dict[str, Dict] = {}
        self.audit_log: list = []
        self.initialized = True
        
        if mode == "simulation":
            self._init_simulation()
        else:
            # Placeholder for real HSM initialization
            self._init_real_hsm()
    
    def _init_simulation(self):
        """Initialize simulated HSM with master keys"""
        # Generate simulated master encryption key
        self.master_key = secrets.token_bytes(32)
        self._log_audit("HSM_INIT", "Simulation mode initialized")
    
    def _init_real_hsm(self):
        """Initialize connection to real HSM device"""
        # Placeholder for real HSM SDK initialization
        # Example: boto3 for AWS CloudHSM, Azure SDK for Key Vault
        self._log_audit("HSM_INIT", f"Real HSM mode: {self.mode} (stub)")
    
    def generate_key(self, key_id: str, key_type: str = "AES256", exportable: bool = False) -> Dict:
        """
        Generate cryptographic key in HSM
        
        Args:
            key_id: Unique identifier for the key
            key_type: Type of key (AES256, RSA2048, RSA4096, KYBER1024, etc.)
            exportable: Whether key can be exported from HSM
        
        Returns:
            Dictionary with key metadata
        """
        if self.mode == "simulation":
            key_material = secrets.token_bytes(32 if "AES" in key_type else 64)
            key_metadata = {
                "key_id": key_id,
                "key_type": key_type,
                "created_at": datetime.utcnow().isoformat(),
                "exportable": exportable,
                "algorithm": key_type,
                "length_bits": 256 if "AES" in key_type else 2048,
                "usage": ["ENCRYPT", "DECRYPT", "SIGN", "VERIFY"],
                "material": key_material.hex() if exportable else None
            }
            self.key_store[key_id] = key_metadata
            self._log_audit("KEY_GENERATE", f"Generated {key_type} key: {key_id}")
            return {k: v for k, v in key_metadata.items() if k != "material"}
        else:
            # Call real HSM API
            return self._real_hsm_generate_key(key_id, key_type, exportable)
    
    def encrypt(self, key_id: str, plaintext: bytes, algorithm: str = "AES-GCM") -> Tuple[bytes, bytes]:
        """
        Encrypt data using HSM key
        
        Returns:
            (ciphertext, iv/nonce)
        """
        if key_id not in self.key_store:
            raise ValueError(f"Key {key_id} not found in HSM")
        
        if self.mode == "simulation":
            from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
            from cryptography.hazmat.backends import default_backend
            
            # Simulate AES-GCM encryption
            key = bytes.fromhex(self.key_store[key_id].get("material", self.master_key.hex()))
            iv = secrets.token_bytes(12)  # 96-bit IV for GCM
            cipher = Cipher(algorithms.AES(key[:32]), modes.GCM(iv), backend=default_backend())
            encryptor = cipher.encryptor()
            ciphertext = encryptor.update(plaintext) + encryptor.finalize()
            
            self._log_audit("ENCRYPT", f"Encrypted data with key {key_id}")
            return ciphertext + encryptor.tag, iv
        else:
            return self._real_hsm_encrypt(key_id, plaintext, algorithm)
    
    def decrypt(self, key_id: str, ciphertext: bytes, iv: bytes, algorithm: str = "AES-GCM") -> bytes:
        """
        Decrypt data using HSM key
        """
        if key_id not in self.key_store:
            raise ValueError(f"Key {key_id} not found in HSM")
        
        if self.mode == "simulation":
            from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
            from cryptography.hazmat.backends import default_backend
            
            key = bytes.fromhex(self.key_store[key_id].get("material", self.master_key.hex()))
            # Extract tag (last 16 bytes)
            tag = ciphertext[-16:]
            actual_ciphertext = ciphertext[:-16]
            
            cipher = Cipher(algorithms.AES(key[:32]), modes.GCM(iv, tag), backend=default_backend())
            decryptor = cipher.decryptor()
            plaintext = decryptor.update(actual_ciphertext) + decryptor.finalize()
            
            self._log_audit("DECRYPT", f"Decrypted data with key {key_id}")
            return plaintext
        else:
            return self._real_hsm_decrypt(key_id, ciphertext, iv, algorithm)
    
    def sign(self, key_id: str, data: bytes, algorithm: str = "SHA256-RSA") -> bytes:
        """
        Sign data using HSM key
        """
        if self.mode == "simulation":
            # Simulate signing with HMAC for simplicity
            key = bytes.fromhex(self.key_store[key_id].get("material", self.master_key.hex()))
            signature = hashlib.sha256(key + data).digest()
            self._log_audit("SIGN", f"Signed data with key {key_id}")
            return signature
        else:
            return self._real_hsm_sign(key_id, data, algorithm)
    
    def verify(self, key_id: str, data: bytes, signature: bytes, algorithm: str = "SHA256-RSA") -> bool:
        """
        Verify signature using HSM key
        """
        if self.mode == "simulation":
            expected_signature = self.sign(key_id, data, algorithm)
            result = secrets.compare_digest(expected_signature, signature)
            self._log_audit("VERIFY", f"Verified signature with key {key_id}: {result}")
            return result
        else:
            return self._real_hsm_verify(key_id, data, signature, algorithm)
    
    def rotate_key(self, old_key_id: str, new_key_id: str) -> Dict:
        """
        Rotate cryptographic key (create new, deprecate old)
        """
        old_key = self.key_store.get(old_key_id)
        if not old_key:
            raise ValueError(f"Key {old_key_id} not found")
        
        new_key = self.generate_key(new_key_id, old_key["key_type"], old_key["exportable"])
        old_key["status"] = "DEPRECATED"
        old_key["rotated_at"] = datetime.utcnow().isoformat()
        old_key["successor"] = new_key_id
        
        self._log_audit("KEY_ROTATE", f"Rotated {old_key_id} -> {new_key_id}")
        return new_key
    
    def delete_key(self, key_id: str) -> bool:
        """
        Securely delete key from HSM
        """
        if key_id in self.key_store:
            # In real HSM, this would securely wipe the key
            self.key_store[key_id]["status"] = "DELETED"
            self.key_store[key_id]["deleted_at"] = datetime.utcnow().isoformat()
            self._log_audit("KEY_DELETE", f"Deleted key {key_id}")
            return True
        return False
    
    def list_keys(self) -> list:
        """List all keys in HSM"""
        return [
            {k: v for k, v in key.items() if k != "material"}
            for key in self.key_store.values()
            if key.get("status") != "DELETED"
        ]
    
    def get_key_metadata(self, key_id: str) -> Optional[Dict]:
        """Get metadata for specific key"""
        key = self.key_store.get(key_id)
        if key and key.get("status") != "DELETED":
            return {k: v for k, v in key.items() if k != "material"}
        return None
    
    def export_public_key(self, key_id: str) -> Optional[str]:
        """Export public key portion (for asymmetric keys)"""
        key = self.key_store.get(key_id)
        if not key or not key.get("exportable"):
            return None
        # Simulate public key export
        return f"-----BEGIN PUBLIC KEY-----\n{key['material'][:64]}\n-----END PUBLIC KEY-----"
    
    def _log_audit(self, action: str, details: str):
        """Log audit event"""
        self.audit_log.append({
            "timestamp": datetime.utcnow().isoformat(),
            "action": action,
            "details": details,
            "mode": self.mode
        })
    
    def get_audit_log(self, limit: int = 100) -> list:
        """Retrieve audit log"""
        return self.audit_log[-limit:]
    
    # Placeholder methods for real HSM integration
    def _real_hsm_generate_key(self, key_id: str, key_type: str, exportable: bool) -> Dict:
        """Integrate with real HSM key generation"""
        # TODO: Implement AWS CloudHSM, Azure Key Vault, or physical HSM integration
        raise NotImplementedError("Real HSM integration not implemented")
    
    def _real_hsm_encrypt(self, key_id: str, plaintext: bytes, algorithm: str) -> Tuple[bytes, bytes]:
        raise NotImplementedError("Real HSM integration not implemented")
    
    def _real_hsm_decrypt(self, key_id: str, ciphertext: bytes, iv: bytes, algorithm: str) -> bytes:
        raise NotImplementedError("Real HSM integration not implemented")
    
    def _real_hsm_sign(self, key_id: str, data: bytes, algorithm: str) -> bytes:
        raise NotImplementedError("Real HSM integration not implemented")
    
    def _real_hsm_verify(self, key_id: str, data: bytes, signature: bytes, algorithm: str) -> bool:
        raise NotImplementedError("Real HSM integration not implemented")


# Global HSM client instance
hsm_client = HSMClient(mode=os.environ.get("QFF_HSM_MODE", "simulation"))

# Initialize default keys
try:
    hsm_client.generate_key("qff_master_key", "AES256", exportable=False)
    hsm_client.generate_key("qff_tx_signing_key", "RSA2048", exportable=False)
except Exception as e:
    print(f"HSM initialization warning: {e}")
