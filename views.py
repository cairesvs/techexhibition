from django.http import HttpResponse
import urllib,logging, random,re
from django.shortcuts import render_to_response

def agendatechhtml(request):
  sock = urllib.urlopen("http://http://www.agendatech.com.br/")
