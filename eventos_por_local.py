class EventosPorLocal:
  def __init__(self, local):
    self.local = local
    self.eventos = []

  def append_evento(self, evento):
    self.eventos.append(evento)

  def eventos(self):
    return self.eventos
  
  def local(self):
    return self.local
  
  def local_safe(self):
    safe = "".join(self.local.split(' '))
    return safe

