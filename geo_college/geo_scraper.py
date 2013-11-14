# -*- coding: utf-8 -*-

"""Utilizes the list of universities we have extracted
and extracts out a longitude & latitude range for
each one using google's geocode. We will construct
out own reverse geocode cache because google's api
limits us to 2000 requests a day or something.
"""

import os
import pickle
import requests
import codecs
import json

PARENT_DIR = os.path.dirname(os.path.abspath(__file__))
NAMES_FILE = os.path.join(PARENT_DIR, 'college_names.txt')
GEO_FILE = os.path.join(PARENT_DIR, 'college_geocode.txt')
BASE_URL = lambda college_addr: \
    'https://maps.googleapis.com/maps/api/geocode/json?address=%s&sensor=false' % (college_addr)

# a list of { univ_name, loc_range, loc_exact } dicts.
geo_json = []

# b/c of google api limit, i run this script multiple times,
# this is just for bookeeping and building my dataset
if os.path.exists(GEO_FILE):
    geo_dat_prev = str(codecs.open(GEO_FILE, 'r', 'utf8').read())
    geo_json = pickle.loads(geo_dat_prev)

print 'starting from geo length of', len(geo_json)

# internal issue with pickle, this redundant conversion is necessary
str_dat = str(codecs.open(NAMES_FILE, 'r', 'utf8').read())

college_names = pickle.loads(str_dat)
print 'We still have', len(college_names), 'colleges'
cnt = 0

for name in college_names[2000:]:
    # json keypath:
    #   univ name: results -> address_components -> short_name
    #   geo_range: results -> geometry -> viewport
    #   (We are getting two dicts, "northeast", and
    #   "southwest" each with a "lng" and "lat")
    #   location: results -> geometry -> location
    try:
        json = requests.get(BASE_URL(name)).json()
        dd = {}
        dd['univ_name'] = json['results'][0]['address_components'][0]['short_name']
        # "northeast" and "southwest", "lng" and "lat"s.
        dd['loc_range'] = json['results'][0]['geometry']['viewport']
        dd['loc_exact'] = json['results'][0]['geometry']['location']
        try:
            dd['univ_name'] = dd['univ_name'].decode('utf8', errors='ignore')
            #dd['loc_range'] = dd['loc_range'].decode('utf8', errors='ignore')
            #dd['loc_exact'] = dd['loc_exact'].decode('utf8', errors='ignore')
            geo_json.append(dd)
        except ValueError, e:
            print 'ERR ON', str(e), 'for', name

    except Exception, e:
        print 'failed at', name, 'because', str(e), 'count', cnt
    cnt += 1

pickle.dump(geo_json, codecs.open(GEO_FILE, 'w', 'utf8'))

print 'all', cnt, 'geocodes have been dumped'