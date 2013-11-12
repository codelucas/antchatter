# -*- coding: utf-8 -*-

""" Scrape the university names from some website and serialize
it into a file. We don't need addr's or anything fancy because
google's geocode api can churn any sensible univ name into
it's geolocation.
"""

import os
import requests
import codecs
import pickle # not cPickle, we are using unicode
from BeautifulSoup import BeautifulSoup

PARENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(PARENT_DIR, 'college_names.txt')
BASE_URL = 'http://www.utexas.edu/world/univ/alpha/'

keyw = ['college', 'university', 'institution']
college_names = []

html = requests.get(BASE_URL).text
soup = BeautifulSoup(html)
valid = soup.findAll('a', attrs={'class':'institution'})

for v in valid:
    college_names.append(v.getText())
    print v.getText()

print 'we have extracted', len(college_names), 'universities'

pickle.dump(college_names, codecs.open(DATA_FILE, 'w', 'utf8'))
