import os
import pickle
import codecs
import json

PARENT_DIR = os.path.dirname(os.path.abspath(__file__))
GEO_FILE = os.path.join(PARENT_DIR, 'college_geocode.txt')

geo_dat_prev = str(codecs.open(GEO_FILE, 'r', 'utf8').read())
geo_json = pickle.loads(geo_dat_prev)

for geo in geo_json[:10]:
    print 'loc_range', geo['loc_range']
    print'univ_name', geo['univ_name']
    print 'loc_exact', geo['loc_exact']

print len(geo_json)