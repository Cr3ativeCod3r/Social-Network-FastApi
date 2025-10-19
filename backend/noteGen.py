import psycopg2
import random

conn = psycopg2.connect(
    dbname='pracainz',
    user='user',
    password='root',
    host='localhost',
    port=5432
)
cursor = conn.cursor()

subjects = ['Matematyka', 'Fizyka', 'Chemia', 'Biologia', 'Informatyka', 'Historia', 'Geografia', 'Polski', 'Angielski', 'Ekonomia']
titles = ['Wprowadzenie do {}', 'Podstawy {}', 'Zaawansowane {}', 'Notatki {}', 'Materiały {}']

for i in range(20):
    subject = random.choice(subjects)
    title = random.choice(titles).format(subject)
    content = f"Treść notatki z przedmiotu {subject}. Lorem ipsum dolor sit amet."
    
    cursor.execute(
        "INSERT INTO notes (title, content, subject, user_id) VALUES (%s, %s, %s, %s)",
        (title, content, subject, 1)
    )

conn.commit()
cursor.close()
conn.close()
print("Dodano 20 notatek")