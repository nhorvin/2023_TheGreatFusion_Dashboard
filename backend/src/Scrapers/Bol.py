import requests
from bs4 import BeautifulSoup
import csv
import os

# Headers instellen voor de request
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

# Een lijst maken om de links van de producten op te slaan
product_pages = []

# Een lijst maken om de links van de categorien in te plaatsen
categorie_pages = []

# Categorien toe voegen aan de lijst.
categorie_pages.append('https://www.bol.com/nl/nl/l/outdoor-jassen/29506/')
categorie_pages.append('https://www.bol.com/nl/nl/l/outdoortruien/29511/')
categorie_pages.append('https://www.bol.com/nl/nl/l/outdoor-vesten/29512/')
categorie_pages.append('https://www.bol.com/nl/nl/l/outdoor-broeken/29505/')
categorie_pages.append('https://www.bol.com/nl/nl/l/outdoorshirts/29509/')
categorie_pages.append('https://www.bol.com/nl/nl/l/outdoorbodywarmers/29503/')
categorie_pages.append('https://www.bol.com/nl/nl/l/outdoorsokken/18052/')
categorie_pages.append('https://www.bol.com/nl/nl/l/outdoorblouses/29500/')
categorie_pages.append('https://www.bol.com/nl/nl/l/outdoorrokken/40188/')
categorie_pages.append('https://www.bol.com/nl/nl/l/outdoorjurken/29508/')
categorie_pages.append('https://www.bol.com/nl/nl/l/outdoorschoenen/39510/')
categorie_pages.append('https://www.bol.com/nl/nl/l/outdoorsandalen/39520/')
categorie_pages.append('https://www.bol.com/nl/nl/l/outdoorlaarzen/39521/')


# Door de pagina's loopen en de links van de producten in de categorie schrapen en opslaan in de lijst
for page in categorie_pages:
    url_category = page
    response = requests.get(url_category, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    product_tags = soup.find_all('div', {'class': 'product-item__image'})

    for tag in product_tags:
        page = tag.find('a')['href']
        product_categorie = soup.find("h1", class_="h1 bol_header").text.strip()
        product_pages.append(('https://www.bol.com' + page, product_categorie))


    
# CSV-bestand openen om de productinformatie en beoordelingen op te slaan
with open(os.path.join('backend/src/Scrapers/Data/bol-populair.csv'), 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['Categorie','Naam', 'Beschrijving']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()    
    
    for page in product_pages:
        url = page[0]
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")
        
        Categorie = page[1]
        Naam = soup.find('h1', {'class': 'page-heading'}).find('span', {'data-test': 'title'}).text.strip()
        Beschrijving = soup.find("div", class_="product-description").text.strip()
         
        writer.writerow({'Categorie': Categorie , 'Naam': Naam , 'Beschrijving': Beschrijving})  
print("It be DONE")