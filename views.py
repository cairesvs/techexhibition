from django.http import HttpResponse
import urllib,logging, random,re
from django.shortcuts import render_to_response
from BeautifulSoup import BeautifulSoup
from eventos_por_local import EventosPorLocal

def agendatechhtml(request):
  sock = urllib.urlopen("http://www.agendatech.com.br/")
  agenda_html = sock.read()
  sock.close()
  soup = BeautifulSoup(agenda_html)
  divs = soup.findAll("div", "evento clearfix")
  eventos = {}
  for div in divs:
    local = div.find("div","info").small.string
    if(local in eventos):
      eventos[local].append_evento(div)
    else:
      eventosPorLocal = EventosPorLocal(local)
      eventosPorLocal.append_evento(div)
      eventos[local] = eventosPorLocal
  logging.info(eventos.keys())
  return render_to_response("agenda.html", {"eventosPorLocal" : eventos.values() })


def index(request):
  return render_to_response("canvas.html")
