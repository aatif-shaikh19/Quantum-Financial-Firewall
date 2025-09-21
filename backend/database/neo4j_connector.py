from neo4j import GraphDatabase

class FraudGraphDB:
    def __init__(self, uri="bolt://localhost:7687", user="neo4j", password="test"):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def log_relationship(self, sender, receiver):
        with self.driver.session() as session:
            session.run(
                "MERGE (a:Wallet {id:$sender}) "
                "MERGE (b:Wallet {id:$receiver}) "
                "MERGE (a)-[:SENT_TO]->(b)",
                sender=sender, receiver=receiver
            )

