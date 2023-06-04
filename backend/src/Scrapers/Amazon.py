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
#Outdoor categorieen man
categorie_pages.append('https://www.amazon.nl/s?i=fashion&bbn=17721360031&rh=n%3A16241836031%2Cn%3A26970094031%2Cn%3A17721343031%2Cn%3A17721360031%2Cn%3A22960462031&dc&fs=true&language=en&ds=v1%3AVHO289rdLHTBJ0Wjg%2F0LZWF6%2BFt6x3OBNNUFRWKEjcU&qid=1685900955&rnid=17721360031&ref=sr_nr_n_3')
categorie_pages.append('https://www.amazon.nl/s?i=fashion&bbn=17721360031&rh=n%3A16241836031%2Cn%3A26970094031%2Cn%3A17721343031%2Cn%3A17721360031%2Cn%3A17721388031&dc&fs=true&language=en&ds=v1%3AFdc49r6Cnm2qffWPfYmA7oiA%2FXcAYt9L9JeU4LuaeDw&qid=1685900955&rnid=17721360031&ref=sr_nr_n_4')
categorie_pages.append('https://www.amazon.nl/s?i=fashion&bbn=17721360031&rh=n%3A16241836031%2Cn%3A26970094031%2Cn%3A17721343031%2Cn%3A17721360031%2Cn%3A22522879031&dc&fs=true&language=en&ds=v1%3Ay6%2BgHiaNTyZOTYgF53Pjzyedu%2FdD53n9LEJ%2BkZi1o%2Bk&qid=1685900955&rnid=17721360031&ref=sr_nr_n_5')
categorie_pages.append('https://www.amazon.nl/s?i=fashion&bbn=17721360031&rh=n%3A16241836031%2Cn%3A26970094031%2Cn%3A17721343031%2Cn%3A17721360031%2Cn%3A16392440031&dc&fs=true&language=en&ds=v1%3A0wau6BgWNfDMQPtytm76jZTMFChoAX7djOa0DKeJR7I&qid=1685900955&rnid=17721360031&ref=sr_nr_n_7')
categorie_pages.append('https://www.amazon.nl/s?i=fashion&bbn=17721360031&rh=n%3A16241836031%2Cn%3A26970094031%2Cn%3A17721343031%2Cn%3A17721360031%2Cn%3A17721390031&dc&fs=true&language=en&ds=v1%3An8ZBq227JzkB7Pt4qStqek2xqiGYbvVAkiJjXUKnRxs&qid=1685900955&rnid=17721360031&ref=sr_nr_n_8')
categorie_pages.append('https://www.amazon.nl/s?i=fashion&bbn=17721360031&rh=n%3A16241836031%2Cn%3A26970094031%2Cn%3A17721343031%2Cn%3A17721360031%2Cn%3A17721389031&dc&fs=true&language=en&ds=v1%3AqQdQ3Ug68fdx4G9ay3rAYrM9kAJpMPBcBPV8h8qhTDQ&qid=1685900955&rnid=17721360031&ref=sr_nr_n_9')
categorie_pages.append('https://www.amazon.nl/s?i=fashion&bbn=17721360031&rh=n%3A16241836031%2Cn%3A26970094031%2Cn%3A17721343031%2Cn%3A17721360031%2Cn%3A22522881031&dc&fs=true&language=en&ds=v1%3AQskQ71IrSBCGRrhcE1K1RPyu2QN4OdJA0A4R5GDUVLg&qid=1685900955&rnid=17721360031&ref=sr_nr_n_10')
categorie_pages.append('https://www.amazon.nl/s?i=fashion&bbn=17721360031&rh=n%3A16241836031%2Cn%3A26970094031%2Cn%3A17721343031%2Cn%3A17721360031%2Cn%3A22522767031&dc&fs=true&language=en&ds=v1%3AeNptmOgZUFU5vqNf7O2KkHuouL8dKPFIRHzgQev11%2Bk&qid=1685900955&rnid=17721360031&ref=sr_nr_n_1')
categorie_pages.append('https://www.amazon.nl/s?i=fashion&bbn=17721360031&rh=n%3A16241836031%2Cn%3A26970094031%2Cn%3A17721343031%2Cn%3A17721360031%2Cn%3A22522880031&dc&fs=true&language=en&ds=v1%3A8%2FWxWBVRL%2BlB6bisTVm8XBADdcJTTJ2x4DJuOR%2BSPUw&qid=1685900955&rnid=17721360031&ref=sr_nr_n_2')

#Outdoor categorieen vrouw
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A22960406031&fs=true&language=en&ref=lp_22960406031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A22522875031&fs=true&language=en&ref=lp_22522875031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A17721391031&fs=true&language=en&ref=lp_17721391031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A22522878031&fs=true&language=en&ref=lp_22522878031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A16392401031&fs=true&language=en&ref=lp_16392401031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A17721393031&fs=true&language=en&ref=lp_17721393031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A17721392031&fs=true&language=en&ref=lp_17721392031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A22522873031&fs=true&language=en&ref=lp_22522873031_sar')


#Fiets categorieen 
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A16545281031&fs=true&language=en&ref=lp_16545281031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A16545282031&fs=true&language=en&ref=lp_16545282031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A16545283031&fs=true&language=en&ref=lp_16545283031_sar')
categorie_pages.append('https://www.amazon.nl/s?bbn=16241836031&rh=n%3A16545847031&fs=true&language=en&ref=lp_16545847031_sar')
categorie_pages.append('https://www.amazon.nl/s?bbn=16241836031&rh=n%3A16545848031&fs=true&language=en&ref=lp_16545848031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A16545285031&fs=true&language=en&ref=lp_16545285031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A22522802031&fs=true&language=en&ref=lp_22522802031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A16545287031&fs=true&language=en&ref=lp_16545287031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A16545288031&fs=true&language=en&ref=lp_16545288031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A16545289031&fs=true&language=en&ref=lp_16545289031_sar')
categorie_pages.append('https://www.amazon.nl/s?rh=n%3A16545286031&fs=true&language=en&ref=lp_16545286031_sar')


#Voedselhandelaar categorieen

# Door de pagina's loopen en de links van de producten in de categorie schrapen en opslaan in de lijst
for page in categorie_pages:
    url_category = page
    response = requests.get(url_category, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    product_tags = soup.find_all('div', {'class': 's-card-container s-overflow-hidden aok-relative puis-wide-grid-style puis-wide-grid-style-t3 puis-expand-height puis-include-content-margin puis puis-vq5jx2gqv0wlc24bxfr2durjsx s-latency-cf-section s-card-border'})

    for tag in product_tags:
        page = tag.find('a')['href']
        product_categorie = soup.find('span', id='nav-search-label-id', class_='nav-search-label').text.strip()
        product_pages.append(('https://www.amazon.nl' + page, product_categorie))
             
print("Door alle pagina's heen")
    
# CSV-bestand openen om de productinformatie en beoordelingen op te slaan
with open(os.path.join('backend/src/Scrapers/Data/Amazon-populair.csv'), 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['Categorie','Naam', 'Beschrijving']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()    
    
    for page in product_pages:
        print("Volgende scrapen")
        url = page[0]
        response = requests.get(url, headers=headers)
        print (url)
        soup = BeautifulSoup(response.text, "html.parser")
        
        Categorie = page[1]
        Naam_element = soup.find('span', id='productTitle', class_='a-size-large product-title-word-break')
        if Naam_element:
            Naam = Naam_element.text.strip()
        else:
            Naam = "Niet beschikbaar"
                   
        print(Naam)
        beschrijving_element = soup.find('div', id='feature-bullets')
        if beschrijving_element:
            beschrijving_ul = beschrijving_element.find('ul', class_='a-unordered-list')
            if beschrijving_ul:
                beschrijving_li_list = beschrijving_ul.find_all('li')
                beschrijving = [li.span.text.strip() for li in beschrijving_li_list]
            else:
                beschrijving = "Niet beschikbaar"
        else:
            beschrijving = "Niet beschikbaar"
            
        writer.writerow({'Categorie': Categorie , 'Naam': Naam , 'Beschrijving': beschrijving})  
        
print("It be DONE")