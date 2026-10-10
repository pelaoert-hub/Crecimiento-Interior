"""Hoja adicional: obras para profundizar y tabla de contraste. Lo lanza generar.sh."""
import json
import os
AQUI=os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(AQUI,'hacer_revision.py')).read().split("S=[]")[0])   # estilos y utilidades
S=[p('Anexo: obras para profundizar',T), p('Proyecto Ánima · hoja adicional a la revisión de la capa Cuba',st('sub',s=10,l=14,textColor=GRIS)), Spacer(1,8),
 p('Esta hoja corresponde a una sección nueva de la web, <b>posterior al documento principal</b>. Se añadió después de preguntarse si existen obras escritas sobre estas religiones, entre ellas <i>Los orishas en Cuba</i>, de Natalia Bolívar. De cada obra solo se comprobó, en páginas públicas, <b>que existe y de qué trata</b>. No se usaron como fuente de los datos de la capa y no se reproduce su contenido.',P), Spacer(1,8)]
for l in C['LECTURAS']:
    S.append(bloque(l['obra'],[('Autor',esc(l['autor'])),('Datos',esc(l.get('datos',''))),('Qué dice la web',esc(l['que'])),('Aviso en la web',esc(l.get('nota',''))),('Fuentes',fu(l['f']))]))
S+=[p('<b>Preguntas para quien revisa</b>',H2), Spacer(1,4)]
Q=[('El Monte','¿Conoce la obra? ¿Es correcta mi descripción: primer gran estudio etnográfico de las tradiciones afrocubanas, con su religión, su magia y su herbolaria?'),
   ('Las plantas','La web <b>no</b> indica para qué sirve cada planta ni cómo usarla, por derechos de autor y porque algunas son tóxicas. Solo dice que el dominio de las hierbas es de Osain (Regla de Ocha) y de Gurunfinda (Palo Monte). ¿Está de acuerdo con ese enfoque? ¿Es correcto lo que se dice de Osain y Gurunfinda?'),
   ('Otras obras','¿Qué otras obras escritas, cubanas o africanas, recomienda para esta sección?')]
S.append(tabla(['N.º','Pregunta','Respuesta / corrección'],[[p(str(i+1),PB),p('<b>'+esc(a)+'</b><br/>'+b,PC),p('',PS)] for i,(a,b) in enumerate(Q)],[9*mm,95*mm,None]))
S[-1].setStyle(TableStyle([('BOTTOMPADDING',(0,1),(-1,-1),26)]))

S.append(Spacer(1,16))
S+=[p('Hoja de contraste con «Los orishas en Cuba»',H1), p('Si quien revisa tiene el libro de Natalia Bolívar (u otra obra de su confianza), puede cotejar estos puntos. En cada uno, la web indica lo que dice y deja un espacio para anotar lo que dice el libro y en qué página.',P), Spacer(1,6)]
PTS=[('Elegguá: santo católico','Santo Niño de Atocha y San Antonio de Padua. No se indica fecha.'),
('Ogún: santo católico','San Pedro.'),
('Ochosi: santo católico','San Norberto (fiesta: 6 de junio).'),
('Osun: santo católico','San Juan Bautista (una sola fuente, que otras fuentes contradicen).'),
('Osain: santo católico','Varía: San Silvestre o San Norberto.'),
('Obatalá: santo y fiesta','Virgen de las Mercedes; 24 de septiembre.'),
('Yemayá: santo y fiesta','Virgen de Regla; 7 de septiembre.'),
('Ochún: santo y fiesta','Virgen de la Caridad del Cobre; 8 de septiembre.'),
('Changó: santo y fiesta','Santa Bárbara; 4 de diciembre.'),
('Oyá: santo y fiesta','Virgen de la Candelaria y Santa Teresa; 2 de febrero.'),
('Orula: santo y fiesta','San Francisco de Asís; 4 de octubre.'),
('Babalú Ayé: santo y fiesta','San Lázaro; 17 de diciembre.'),
('Ibeyi: santo católico','San Cosme y San Damián.'),
('Yewá, Oba, Naná Burukú','Santa Clara, Santa Catalina de Siena y Santa Ana (una sola fuente cada una).'),
('Diloggún: orishas por letra','Okana: Elegguá, Yewá. Eyioko: Ochosi, Orisha Oko, Ibeyi. Ogunda: Ogún. Iroso: Yemayá, Olokun, Yewá, Babalú Ayé, Orula. Oshe: Ochún, Naná Burukú. Obara: Changó, Orula. Odi: Elegguá, Yemayá, Orisha Oko. Eyeunle: Obatalá, Ochún, Obba, Orisha Oko, Olokun. Osa: Obba, Yewá, Oyá. Ofún: Ochún, Naná Burukú. Ojuani: Elegguá, Babalú Ayé. Eyila: Changó, Obañeñe.'),
('Diloggún: letras 13 a 16','Solo las leen los babalawos.')]
filas=[[p(str(i+1),PB),p('<b>'+esc(a)+'</b>',PC),p(esc(b),PC),p('',PS)] for i,(a,b) in enumerate(PTS)]
t=Table([[p('N.º',PS),p('Punto',PS),p('Lo que dice esta web',PS),p('Lo que dice el libro (página)',PS)]]+filas,colWidths=[11*mm,34*mm,62*mm,None],repeatRows=1)
t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),FONDO),('GRID',(0,0),(-1,-1),.25,LINEA),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),3),('BOTTOMPADDING',(0,0),(-1,-1),9)]))
S.append(t)

def pie(c,d):
    c.saveState(); c.setFont('DJ',7); c.setFillColor(GRIS); c.drawString(15*mm,9*mm,'Ánima · Anexo a la revisión de la capa Cuba · Borrador'); c.drawRightString(A4[0]-15*mm,9*mm,'Página '+str(d.page)); c.restoreState()
doc=SimpleDocTemplate(os.path.join(AQUI,'Anexo_obras_para_profundizar_Anima.pdf'),pagesize=A4,leftMargin=15*mm,rightMargin=15*mm,topMargin=15*mm,bottomMargin=18*mm,title='Anexo: obras para profundizar · Ánima',author='Ánima')
doc.build(S,onFirstPage=pie,onLaterPages=pie); print('ok')
