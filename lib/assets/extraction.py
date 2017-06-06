import re
import json
import sys

# Separate the fields
pat1 = "([A-Z][\-a-zA-Z]+:\B[.\S\s]+?)(?=[A-Z][\-a-zA-Z]+:\B|$)"
# Get header key
pat2 = "^([A-Z][\-a-zA-Z]+):\B"
# Get content
pat3 = "^[A-Z][\-a-zA-Z]+:\B\s(.+)"
# Get from address
pat4 = "^from\s(.+?\s)"
# Get from IP
pat5 = "(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
# Get from port number
pat6 = "\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]:(\d+)"
# Get by address
pat7 = "by\s(.+?\s)"
# Get with content
pat8 = "with\s(.+)\sid"
# Get id
pat9 = "id\s(.+?)\s"
# Get for address
pat10 = "for\s([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)"
# Get date and time
pat11 = "\d{1,2}\s\w{3}\s\d{4}\s\d{2}:\d{2}:\d{2}\s\+\d{4}"

def main():
    # file = open( "headers/1.txt" , "r")
    # string = file.read()
    # file.close

    string = sys.argv[1]

    fields = re.findall(pat1,string)

    received_list, others = [], []

    for field in fields:
        stripped_field = field.replace('\r', '').replace('\n', '').replace('\t', ' ')
        if field.startswith( 'Received' ):
            received_list.append(stripped_field)
        else:
            others.append(stripped_field)

    results = others_parser(others)
    results["Received"] = received_parser(received_list)

    results_json = json.dumps(results)

    print(results_json)

    return results_json

def received_parser(received_list):
    reversed_received_list = list(reversed(received_list))
    results = []
    step = 0
    for received in reversed_received_list:
        content = next(iter(re.findall(pat3,received)), '')
        from_address = next(iter(re.findall(pat4,content)), '')
        from_IP = next(iter(re.findall(pat5,content)), '')
        from_port = next(iter(re.findall(pat6,content)), '')
        by_address = next(iter(re.findall(pat7,content)), '')
        with_content = next(iter(re.findall(pat8,content)), '')
        id = next(iter(re.findall(pat9,content)), '')
        for_address = next(iter(re.findall(pat10,content)), '')
        timestamp = next(iter(re.findall(pat11,content)), '')
        results.append({
            "step"      : step,
            "from"      : {
                "address" : from_address,
                "IP"      : from_IP,
                "port"    : from_port
            },
            "by"        : by_address,
            "with"      : with_content,
            "id"        : id,
            "for"       : for_address,
            "timestamp" : timestamp
        })
        step += 1
    return results

def others_parser(others):
    results = {}
    for other in others:
        key = next(iter(re.findall(pat2,other)), '')
        value = next(iter(re.findall(pat3,other)), '')
        results[key] = value
    return results

main()
