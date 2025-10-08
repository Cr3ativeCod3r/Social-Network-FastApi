import requests
import random

URL = "http://localhost:8000/auth/register"

first_names = ["Jan", "Anna", "Piotr", "Maria", "Tomasz", "Agnieszka", "Krzysztof", "Katarzyna", "Michał", "Joanna"]
last_names = ["Nowak", "Kowalski", "Wiśniewski", "Wójcik", "Kowalczyk", "Kamińska", "Lewandowski", "Zielińska", "Szymański", "Dąbrowska"]
universities = ["Politechnika Warszawska", "UJ", "AGH", "UW", "PG", "PWr"]
departments = ["Informatyka", "Matematyka", "Fizyka", "Biologia", "Ekonomia", "Automatyka"]

for i in range(1, 21):
    first = random.choice(first_names)
    last = random.choice(last_names)
    email = f"{first.lower()}.{last.lower()}{i}@example.com"
    password = f"Pass{i}word!"
    university = random.choice(universities)
    department = random.choice(departments)

    payload = {
        "email": email,
        "password": password,
        "first_name": first,
        "last_name": last,
        "university": university,
        "department": department
    }

    response = requests.post(URL, json=payload)

    if response.status_code == 201:
        print(f"✅ Użytkownik {email} utworzony.")
    else:
        print(f"❌ Błąd przy {email}: {response.status_code} - {response.text}")