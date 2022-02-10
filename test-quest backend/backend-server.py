import urllib
from pprint import pprint
from fake_useragent import UserAgent
import requests
from bs4 import BeautifulSoup
# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask
from flask import jsonify 
from flask_cors import CORS
# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__)
CORS(app)
os = "mac"

@app.route('/search/<text>')
def test_search(text):
    ua = UserAgent()
    text = urllib.parse.quote_plus(text)
    answer_sites = ["all", "quizlet.com", "chegg.com"]
    top_hits = dict()
    site_name = ""
    links = []
    headers = {
    'User-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582'
    }
    # Fetch the URL data using requests.get(url),
    # store it in a variable, request_result.
    for site in answer_sites:
        top_hits[site] = []
        if site == "all":
           url = 'https://google.com/search?q=' + text
        else: 
            url = 'https://google.com/search?q=' + text + " "+site
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.text)
   
        for g in soup.find_all(class_='g'):
            content_title = ""
            content_link = ""
            content_prev = ""
            #get link to answer
            try:
                links = g.find_all("a")
                content_link = links[0]["href"]
                site_name = content_link.split('/')[2]
            except:
                continue
            #try fetching search title
            try:
                titles = g.find_all('h3')
                content_title = titles[0].text
            except:
                continue
            try:
                content_prev = g.find_all(attrs={"data-content-feature" : "1"})[0].text
            except:
                continue
            top_hits[site].append({"title":content_title, "link":content_link, "preview":content_prev, "site": site_name })
    pprint(top_hits)
    return jsonify(top_hits)
  
if __name__ == '__main__':
    app.run()