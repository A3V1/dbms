import requests
import json

# Test login with the correct endpoint
def test_login():
    base_url = "http://localhost:8000"
    credentials = {
        "email": "admin@example.com",
        "password": "admin123"
    }
    
    # The correct endpoint based on the Django URLs
    endpoint = "/api/auth/login/"
    
    url = base_url + endpoint
    print(f"\nTesting endpoint: {url}")
    print(f"Credentials: {json.dumps(credentials, indent=2)}")
    
    try:
        response = requests.post(url, json=credentials)
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("\nLogin successful! Token received.")
            data = response.json()
            if 'token' in data:
                print(f"Token: {data['token'][:20]}...")
            if 'user' in data:
                print(f"User: {data['user']['email']}")
                print(f"Role: {data['user']['role']}")
        else:
            print("\nLogin failed. Check credentials and server status.")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_login() 