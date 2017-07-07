import requests
import argparse
import sys
import json

def main():
    vendor = sys.argv[1]
    software = sys.argv[2]
    SEARCHURL =  "http://cve.circl.lu/api/search/" + vendor + "/" + software
    r = requests.get(SEARCHURL)
    if r.status_code != 200:
        sys.exit("Something has gone horribly wrong.")
    else:
        jdata = json.loads(r.text)
        print(json.dumps(jdata))

main()
