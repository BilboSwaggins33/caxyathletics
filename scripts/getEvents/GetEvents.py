import requests
from bs4 import BeautifulSoup

URL = "https://www.lfacaxys.org/schedule-results?cal_date=2022-05-11"
page = requests.get(URL)
soup = BeautifulSoup(page.content, "html.parser")

events = soup.find_all("div", class_="fsCalendarInfo")
for event in events:
    event_title = event.find("a", class_="fsCalendarEventTitle")
    if "Home" in event_title.text and ("CANCELLED" not in event_title.text):
        event_time = event.find("time", class_="fsStartTime")
        print(event_title.text)
        print(event_time["datetime"])
# print(page.text)
