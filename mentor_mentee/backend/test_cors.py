import requests

def test_cors():
    url = "http://localhost:8000/api/auth/login/"
    
    # Test preflight request
    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type, Authorization"
    }
    
    try:
        response = requests.options(url, headers=headers)
        print(f"CORS Preflight Status: {response.status_code}")
        print("Response Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
        
        if "Access-Control-Allow-Origin" in response.headers:
            print("\nCORS is properly configured!")
        else:
            print("\nCORS might not be properly configured!")
            print("Missing Access-Control-Allow-Origin header in response.")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_cors() 