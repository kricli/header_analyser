import re
import json
import sys

# Separate the fields
# pat1 = "(\S.+:\B[.\S\s]+?)(?=[A-Z][\-a-zA-Z]+:\B|$)"
pat1 = "(?:^|\n)([A-z].+?:[.\S\s]*?)(?=\n[A-z].+?:\B|$)"
# pat1 = "([A-Z][\-a-zA-Z]+:\B[.\S\s]+?)(?=[A-Z][\-a-zA-Z]+:\B|$)"
# Get header key
pat2 = "^([A-z][\-a-zA-Z\s]+):\B"
# Get content
pat3 = "^[A-z][\-a-zA-Z\s]+:\B\s([.\S\s]+)"
# Get from content
pat_from = "from\s(.+?)(?=\s?(?:by|with|id|for|;|$))"
# Get by address
pat7 = "by\s(.+?)(?=\s?(?:with|id|for|;|$))"
# Get with content
pat8 = "with\s(.+?)(?=\s?(?:id|for|;|$))"
# Get id
pat9 = "id\s(.+?);?\s"
# Get for address
pat10 = "for\s<?([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)>?"
# Get date and time
pat11 = "\d{1,2}\s\w{3}\s\d{4}\s\d{2}:\d{2}:\d{2}\s(?:\+|\-)\d{4}"

def main():

    string = sys.argv[1]

    fields = re.findall(pat1,string)

    received_list, others = [], []

    for field in fields:
        stripped_field = field.replace('\r', '').replace('\n', '').replace('\t', ' ')
        if field.startswith( 'Received' ):
            received_list.append(stripped_field)
            # print(stripped_field)
        else:
            others.append(stripped_field)
            # print(field)

    results = others_parser(others)
    results["Received"] = received_parser(received_list)

    results_json = json.dumps(results)

    print(results_json)

def received_parser(received_list):
    reversed_received_list = list(reversed(received_list))
    results = []
    step = 0
    for received in reversed_received_list:
        content = next(iter(re.findall(pat3,received)), '')
        from_content = next(iter(re.findall(pat_from,content)), '')
        from_results = from_parser(from_content)
        by_address = next(iter(re.findall(pat7,content)), '')
        with_content = next(iter(re.findall(pat8,content)), '')
        with_results = with_parser(with_content)
        id = next(iter(re.findall(pat9,content)), '')
        for_address = next(iter(re.findall(pat10,content)), '')
        timestamp = next(iter(re.findall(pat11,content)), '')
        results.append({
            "step"      : step,
            "from"      : from_results,
            "by"        : by_address,
            "with"      : with_results,
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

def from_parser(from_content):
    # Get address
    pat1 = "^from\s(.+?\s)"
    # Get IP
    pat2 = "(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
    # Get port number
    pat3 = "\[?\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]?:(\d+)"
    from_address = next(iter(re.findall(pat1,from_content)), '')
    from_IP = next(iter(re.findall(pat2,from_content)), '')
    from_port = next(iter(re.findall(pat3,from_content)), '')
    results = {
        "address" : from_address,
        "IP"      : from_IP,
        "port"    : from_port
    }
    return results

def with_parser(with_content):
    str = with_content.lower()

    if "esmtpsa" in str:
        with_protocol = "ESMTPSA"
        with_protocol_description = "Extended Simple Mail Transfer Protocol with both STARTTLS and SMTP AUTH successfully negotiated"
    elif "esmtps" in str:
        with_protocol = "ESMTPS"
        with_protocol_description = "Extended Simple Mail Transfer Protocol with STARTTLS successfully negotiated"
    elif "esmtpa" in str:
        with_protocol = "ESMTPA"
        with_protocol_description = "Extended Simple Mail Transfer Protocol with SMTP AUTH successfully negotiated"
    elif "esmtp" in str:
        with_protocol = "ESMTP"
        with_protocol_description = "Extended Simple Mail Transfer Protocol"
    elif "smtp" in str:
        with_protocol = "SMTP"
        with_protocol_description = "Simple Mail Transfer Protocol"
    elif "mapi" in str:
        with_protocol = "MAPI"
        with_protocol_description = "Messaging Application Programming Interface"
    elif "imap" in str:
        with_protocol = "IMAP"
        with_protocol_description = "Internet Message Access Protocol"
    elif "pop" in str:
        with_protocol = "POP"
        with_protocol_description = "Post Office Protocol"
    elif "http" in str:
        with_protocol = "HTTP"
        with_protocol_description = "Hypertext Transfer Protocol"
    else:
        with_protocol = ""
        with_protocol_description = ""

    if "exim" in str:
        with_MTA = "Exim"
    elif "postfix" in str:
        with_MTA = "Postfix"
    elif "sendmail" in str:
        with_MTA = "Sendmail"
    elif "qmail" in str:
        with_MTA = "Qmail"
    elif "microsoft smtp server" in str:
        with_MTA = "Microsoft SMTP Server"
    else:
        with_MTA = ""

    results = {
        "content"               : with_content,
        "protocol"              : with_protocol,
        "protocol_description"  : with_protocol_description,
        "MTA"                   : with_MTA
    }
    return results

main()
