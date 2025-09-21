import requests

def get_crypto_price(symbol="ETH"):
    try:
        url = f"https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        r = requests.get(url)
        data = r.json()
        return {"symbol": symbol, "price_usd": data["ethereum"]["usd"]}
    except Exception as e:
        return {"error": str(e)}

