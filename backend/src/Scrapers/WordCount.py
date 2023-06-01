import pandas as pd
import re

# Lijst van stopwoorden die je wilt verwijderen
filterWoorden = ['de', 'het', 'een', 'van', 'in', 'op', 'en', 'is', 'voor', 'je', 'met', 'deze', 'te', 'aan', 'of', 'kan', 'gemaakt', 'als', 'zijn', 'voorkomt', 'heeft', 'tot', 'ook', 'die', 'dat', 'bij', 'om', 'door', 'worden', 'door', 'zit', 'maken', 'tijdens' , 'and', 'dan', 'the', 'over', 'for', 'dit', 'onze', 'twee', 'u' , 'zo', 'gaat', 'alle', 'kunnen', 'geeft', 'jij', 'maar' ]  # Voeg hier meer stopwoorden toe indien nodig

# Tekens die je wilt verwijderen
tekens = ['.', ',', ';', ':', '!', '?']  # Voeg hier meer tekens toe indien nodig

# Lees het CSV-bestand in een pandas dataframe
df = pd.read_csv('backend/src/Scrapers/Data/bol-populair.csv')

# Maak een lege dictionary om de woordentellingen per categorie bij te houden
word_counts_per_category = {}

# Loop door elke rij in de dataframe en tel de woorden in de "Beschrijving"-kolom per categorie
for index, row in df.iterrows():
    category = row['Categorie']
    body = row['Beschrijving']
    # splits de tekst in woorden en verwijder tekens
    words = re.findall(r'\b\w+\b', body.lower())  # Converteer naar kleine letters en verwijder tekens
    
    # Filter stopwoorden
    words = [word for word in words if word not in filterWoorden]
    
    # tel elk woord in de dictionary voor de bijbehorende categorie
    if category in word_counts_per_category:
        category_word_counts = word_counts_per_category[category]
    else:
        category_word_counts = {}
        word_counts_per_category[category] = category_word_counts

    for word in words:
        if word in category_word_counts:
            category_word_counts[word] += 1
        else:
            category_word_counts[word] = 1

# Loop door de woordentellingen per categorie en converteer ze naar dataframes
dataframes_per_category = {}
for category, word_counts in word_counts_per_category.items():
    # Filter woorden die maar 1 keer voorkomen en langer zijn dan 2 tekens
    filtered_word_counts = {word: count for word, count in word_counts.items() if count > 2 and len(word) > 2}
    
    word_counts_df = pd.DataFrame.from_dict(filtered_word_counts, orient='index', columns=['count'])
    word_counts_df = word_counts_df.sort_values(by='count', ascending=False)
    dataframes_per_category[category] = word_counts_df


# Sla de resultaten op in afzonderlijke CSV-bestanden per categorie
for category, df in dataframes_per_category.items():
    filename = f'backend/src/Scrapers/Data/WordCounts/{category}.csv'
    df.to_csv(filename)
