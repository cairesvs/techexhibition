from django.http import HttpResponse
import urllib,logging, random,re
from django.shortcuts import render_to_response

def agendatechhtml(request):
  sock = urllib.urlopen("http://www.agendatech.com.br/")
  agenda_html = sock.read()
  sock.close()
  return render_to_response("agenda.html", locals())


def index(request):
  return render_to_response("canvas.html")
