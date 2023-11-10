# trenutno dostupni računi
admin@gmail.com   pass:123
user@gmail.com    pass:123

# stranica javno dostupna na 138.201.184.55:3000

# pokretanje ručno
Potreban node verzija >= 20

cd app
npm install
(ako baca axios error -> npm install -g axios  )
npm run start
po defaultu je trenutno aktivan na portu 3000

# pokretanje dockera

docker build -t balkan-lingo .
docker run -p 3000:3000 balkan-lingo
