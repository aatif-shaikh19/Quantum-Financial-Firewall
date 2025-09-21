import random

def scrape_social_signals(wallet):
    """
    Fake social media sentiment for a wallet
    """
    sentiments = ["positive", "neutral", "negative", "scam-alert"]
    result = random.choice(sentiments)
    return {"wallet": wallet, "sentiment": result}

