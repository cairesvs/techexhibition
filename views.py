from django.http import HttpResponse
import urllib,logging, random,re
from django.shortcuts import render_to_response
from BeautifulSoup import BeautifulSoup

def agendatechhtml(request):
  sock = urllib.urlopen("http://www.agendatech.com.br/")
  agenda_html = sock.read()
  sock.close()
  soup = BeautifulSoup(agenda_html)
  divs = soup.findAll("div", "evento clearfix")
  return render_to_response("agenda.html", {"divs" : divs })


def index(request):
  return render_to_response("canvas.html")
