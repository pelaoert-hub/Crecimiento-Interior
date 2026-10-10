"""PDF de revision de la capa Cuba para un practicante. Lo lanza generar.sh."""
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
D='/usr/share/fonts/truetype/dejavu/'
pdfmetrics.registerFont(TTFont('DJ',D+'DejaVuSans.ttf')); pdfmetrics.registerFont(TTFont('DJB',D+'DejaVuSans-Bold.ttf'))
from reportlab.pdfbase.pdfmetrics import registerFontFamily
registerFontFamily('DJ',normal='DJ',bold='DJB',italic='DJ',boldItalic='DJB')
import os
AQUI=os.path.dirname(os.path.abspath(__file__))
C=json.load(open(os.path.join(AQUI,'cuba.json'))); F=C['FUENTES']
VIO=colors.HexColor('#3b2f8f'); GRIS=colors.HexColor('#5b5870'); LINEA=colors.HexColor('#c9c4e6'); FONDO=colors.HexColor('#f1eefc'); AMB=colors.HexColor('#fff4de')
def st(n,**k): return ParagraphStyle(n,fontName=k.pop('f','DJ'),fontSize=k.pop('s',9),leading=k.pop('l',13),**k)
T=st('t',f='DJB',s=20,l=25,textColor=VIO); H1=st('h1',f='DJB',s=14,l=18,textColor=VIO,spaceBefore=6,spaceAfter=6); H2=st('h2',f='DJB',s=10.5,l=14,textColor=VIO)
P=st('p'); PS=st('ps',s=8,l=11,textColor=GRIS); PB=st('pb',f='DJB'); PC=st('pc',s=8.5,l=12)
def p(t,s=P): return Paragraph(t,s)
def esc(t): return str(t).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
def fu(lst): return ', '.join('F'+str(n) for n in lst)
BOX='[   ]'
def revision(n=1): return Table([[p(BOX+' Correcto &nbsp;&nbsp; '+BOX+' Corregir / quitar:',PS), p('',PS)]],colWidths=[52*mm,None],rowHeights=[16*mm*n] ,style=TableStyle([('LINEBELOW',(1,0),(1,0),.4,LINEA),('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,-1),FONDO),('LEFTPADDING',(0,0),(-1,-1),5)]))
def bloque(titulo, filas, rev=True):
    data=[[p(titulo,H2),'']]+[[p(k,PS),p(v,PC)] for k,v in filas if v]
    t=Table(data,colWidths=[34*mm,None]); t.setStyle(TableStyle([('SPAN',(0,0),(1,0)),('BACKGROUND',(0,0),(-1,0),FONDO),('LINEBELOW',(0,0),(-1,-1),.25,LINEA),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),3),('BOTTOMPADDING',(0,0),(-1,-1),3)]))
    return KeepTogether([t, revision() if rev else Spacer(1,0), Spacer(1,7)])
def tabla(cab, filas, anchos):
    data=[[p(c,PS) for c in cab]]+filas
    t=Table(data,colWidths=anchos,repeatRows=1); t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),FONDO),('GRID',(0,0),(-1,-1),.25,LINEA),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),3),('BOTTOMPADDING',(0,0),(-1,-1),3)])); return t

S=[]
# ---------- portada ----------
S+= [Spacer(1,10), p('Revisión de la capa Cuba',T), p('Proyecto Ánima · tradiciones afrocubanas',st('sub',s=11,l=15,textColor=GRIS)), Spacer(1,10),
 p('<b>Borrador para revisión por un practicante.</b> Fecha de las fuentes: 10 de octubre de 2026.',P), Spacer(1,8),
 p('<b>Para quién es este documento.</b> Para un santero y babalawo que quiera revisar lo que se piensa publicar en una web sobre crecimiento personal y espiritualidad, en una sección dedicada a Cuba. Nadie de la web pertenece a estas religiones. Por eso necesita su criterio.',P), Spacer(1,6),
 p('<b>De dónde sale lo escrito.</b> Estas religiones son de tradición oral: el conocimiento se transmite por iniciación y no hay un texto único. Por eso <b>no se ha usado ningún conocimiento reservado</b>. Todo se tomó de páginas públicas (F1 a F9, al final) y se contrastó entre ellas. Que varias fuentes coincidan <b>no significa</b> que sea correcto: eso solo lo puede decir usted.',P), Spacer(1,6),
 p('<b>Qué se le pide.</b> En cada recuadro marque <b>Correcto</b> o <b>Corregir / quitar</b>, y si quiere, escriba la corrección. No hace falta revisarlo todo: puede empezar por las <b>preguntas de la página siguiente</b>, donde las fuentes se contradicen.',P), Spacer(1,6),
 p('<b>Qué muestra la web.</b> Un resumen educativo y cultural, no una consulta ni una ceremonia. Lleva un aviso visible de que no sustituye a un sacerdote iniciado. No se publicará nada sin su revisión, y la sección está marcada para que no aparezca en buscadores mientras tanto.',P), Spacer(1,6),
 p('<b>Secciones:</b> 1. Preguntas clave · 2. Orishas y santos · 3. Sincretismo · 4. Diloggún · 5. Ifá y el tablero de Orula · 6. Palo Monte · 7. Fuentes · 8. Opinión general.',P), PageBreak()]

# ---------- 1. preguntas clave ----------
S+= [p('1. Preguntas clave',H1), p('Aquí es donde las fuentes se contradicen, o donde hay una sola fuente. Si solo puede contestar algunas, que sean estas.',P), Spacer(1,6)]
Q=[
 ('Ochosi y San Norberto','Tres fuentes (F1, F2, F3) dicen que Ochosi corresponde a San Norberto. La F8 vincula a su equivalente en Palo Monte (Surumba Mukalla) con San Juan Bautista. ¿Cuál es la correspondencia en Cuba?'),
 ('Osun y San Juan Bautista','Solo F2 asigna San Juan Bautista a Osun. Otras fuentes dan ese santo a Ogún u Ochosi. ¿Qué santo corresponde a Osun?'),
 ('Osain','F8 da «San Silvestre o San Norberto». ¿Cuál es el más aceptado, o hay otro?'),
 ('Elegguá: fiesta','Una fuente (F1) dice «3 de junio». San Antonio de Padua se celebra el 13 de junio. ¿Se celebra alguna fecha para Elegguá? Mientras no se aclare, la web no pone fecha.'),
 ('Yemayá: 7 de septiembre','F1 da el 7 de septiembre. La Virgen de Regla se celebra el 8. ¿Es correcto el 7?'),
 ('Oyá: Candelaria y Santa Teresa','Las fuentes citan las dos. ¿Cuál se usa más en Cuba, o se usan las dos?'),
 ('Ibeyi','F1: San Cosme y San Damián. F2: solo San Damián. ¿Es correcto San Cosme y San Damián?'),
 ('Orishas con una sola fuente','Yewá (Santa Clara), Oba (Santa Catalina de Siena), Naná Burukú (Santa Ana). ¿Son correctos? ¿Es apropiado mostrarlos?'),
 ('Letras del diloggún','¿Las frases-resumen de cada letra (F5) son las que se usan? ¿Los orishas que hablan en cada letra (F4) son correctos? ¿Los nombres (Okana, Eyioko, Ogunda, Iroso, Oshe, Obara, Odi, Eyeunle, Osa, Ofún, Ojuani, Eyila) están bien escritos?'),
 ('Letras 13 a 16','F4 dice que solo las leen los babalawos. La web no muestra lectura de esas cuatro. ¿Es correcto?'),
 ('Tirada simbólica de caracoles','La web incluye una simulación que muestra una letra al azar, con su frase y los orishas que hablan, y aclara que no es una consulta. <b>¿Le parece respetuoso incluirla, o debe quitarse?</b>'),
 ('Odu de Ifá','Se citan los 16 odu mayores con el tema que les atribuye Wikipedia, algunos duros (por ejemplo «la hechicería y la maldad», «la enfermedad y el daño»). ¿Es correcto mostrarlos así, con otro texto, o quitarlos?'),
 ('Ékuele, ikin y tablero','Se dice que el babalawo consulta con la cadena (opele, ékuele en Cuba) o con los ikin sobre el opon Ifá. ¿Es correcto? ¿Falta o sobra algo?'),
 ('Palo Monte','¿Son correctas las equivalencias de los mpungu? ¿Es correcta la descripción de los chamalongos y del vititi mensu?'),
 ('Lo reservado','¿Hay algo de lo que aparece que no debería publicarse, aunque esté en fuentes públicas?'),
 ('Lo que falta','Abakuá y el espiritismo solo se mencionan. ¿Falta algo importante, o algo está mal planteado?')]
filas=[[p(str(i+1),PB),p('<b>'+esc(a)+'</b><br/>'+b,PC),p('',PS)] for i,(a,b) in enumerate(Q)]
t=Table([[p('N.º',PS),p('Pregunta',PS),p('Respuesta / corrección',PS)]]+filas,colWidths=[9*mm,95*mm,None],repeatRows=1,rowHeights=[None]+[None]*len(filas))
t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),FONDO),('GRID',(0,0),(-1,-1),.25,LINEA),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),22)]))
S+=[t, PageBreak()]

# ---------- 2. orishas ----------
S+=[p('2. Orishas y santos',H1), p('Cada recuadro es una ficha de la web. «F» indica en qué fuentes de la lista final aparece el dato. Cuando una ficha dice «Una sola fuente», solo una página lo recoge.',P), Spacer(1,6)]
for o in C['ORISHAS']:
    n=len(o['f']); etq='Coinciden '+str(n)+' fuentes públicas' if n>=2 else 'UNA SOLA FUENTE'
    S.append(bloque(o['n']+'  ·  '+etq,[('Qué representa',esc(o['rep'])),('Colores',esc(o['col'])),('Santo católico',esc(o['santo'])+(' (fiesta: '+esc(o['fiesta'])+', según F1)' if o.get('fiesta') else '')),('En Palo Monte',esc(o.get('palo',''))),('Nota',esc(o.get('nota',''))),('Fuentes',fu(o['f']))]))
S.append(PageBreak())

# ---------- 3. sincretismo ----------
S+=[p('3. Sincretismo',H1), p('Texto que aparece en la web (basado en F1):',PS),
 p('«El sincretismo se explica como un proceso cultural entre la religión traída por las personas esclavizadas y el catolicismo impuesto: un equilibrio entre la resistencia y la acomodación. Cada país produjo sus propias equivalencias, entre otras cosas por la función del santo como intercesor o patrono y por las imágenes populares de cada lugar. Algunos lo consideran una manera de proteger a los dioses bajo ropaje cristiano, aunque el proceso fue más complejo.»',P),
 p('Y esta frase, añadida por la web: «Que se identifiquen no quiere decir que para todos los practicantes sean lo mismo.»',P), Spacer(1,4), revision(1.3), Spacer(1,6),
 p('La web también muestra una tabla orisha, santo católico, mpungu de Palo Monte con los orishas que la fuente F8 relaciona (ver la sección 6).',PS), Spacer(1,14)]

# ---------- 4. diloggun ----------
S+=[p('4. Diloggún',H1), p('Texto de la web sobre el diloggún (basado en F4 y F9):',PS),
 p('«El diloggún se lee con caracoles. Se interpretan según hayan caído boca arriba o boca abajo. Hay 16 posiciones principales, y cada una tiene a su vez 16 más, hasta completar 256 odun. En cada odun hablan uno o varios orishas. Las 12 primeras las leen los santeros, y las 4 últimas son de dominio exclusivo de los babalawos. La tirada se repite dos veces para formar un odu compuesto. Los resultados se leen como ire (buena fortuna) u osogbo (obstáculos que se pueden superar con ayuda de los orishas). Existen además otros oráculos: el de Biague (coco) y el de Ifá (ékuele), este último manejado solo por babalawos.»',P), Spacer(1,4), revision(1.3), Spacer(1,8),
 p('<b>Las 12 letras</b>. La frase entre comillas es literal de F5. Los orishas son de F4. La pregunta «Para pensar» la escribió la web, no es de la tradición.',P), Spacer(1,6)]
for l in C['LETRAS']:
    if l.get('solo'): continue
    S.append(bloque('Letra '+str(l['num'])+' · '+l['n']+(' ('+l['alt']+')' if l.get('alt') else ''),[('Frase (F5)','«'+'<br/>'.join(esc(x) for x in l['frase'])+'»'),('Orishas que hablan (F4)',esc(', '.join(l['orishas']))),('Para pensar (de la web)',esc(l['q']))]))
S+=[p('<b>Letras 13 a 16</b> (Metanla, Merinla, Marunla, Merindilogun): la web solo dice que, según F4, son de dominio exclusivo de los babalawos, y no muestra lectura.',P), Spacer(1,4), revision(1), PageBreak()]

# ---------- 5. Ifa ----------
S+=[p('5. Ifá y el tablero de Orula',H1), p('Texto de la web (basado en F6, F4 y F1):',PS),
 p('«Ifá es un sistema religioso y de adivinación yoruba. Su corpus son los Odu Ifá, 256 en total, que salen de combinar los 16 odu mayores (Meji). Orunmila (Orula) es considerado el gran sacerdote. Los babalawos consultan con una cadena de adivinación (opele, que en Cuba se conoce como ékuele) o con semillas de la palma sagrada (ikin) sobre una bandeja de madera, el opon Ifá, que es el tablero de Orula.»',P),
 p('«Esta web no simula la consulta de Ifá: solo pueden hacerla los babalawos.»',P), Spacer(1,4), revision(1.3), Spacer(1,8),
 p('<b>Los 16 odu mayores.</b> Nombre y epíteto de F7 (Wikipedia en inglés, traducido); tema de F6 (Wikipedia en español). Entre paréntesis, el nombre usado en Cuba según F5.',P), Spacer(1,6)]
filas=[]
for i,m in enumerate(C['MEJI']):
    filas.append([p(str(i+1),PS),p(esc(m['n'])+(' ('+esc(m['alt'])+')' if m.get('alt') else ''),PC),p(esc(m['ep']).replace('Oṣun','Osun'),PC),p(esc(m['tema']),PC),p(BOX+' OK',PS)])
S+=[tabla(['N.º','Odu','Epíteto','Tema atribuido','Revisión'],filas,[8*mm,34*mm,38*mm,None,17*mm]), Spacer(1,6), p('Observaciones sobre los odu (nombres, orden, temas, o si deben quitarse):',PS), revision(1.6), PageBreak()]

# ---------- 6. Palo ----------
S+=[p('6. Palo Monte',H1), p('Texto de la web (basado en F8 y F1):',PS),
 p('«Es una religión afroamericana, politeísta, sincrética y animista, derivada de la religión kongo y mezclada en Cuba con el espiritismo. Su dios alto es Nzambi, y trabaja con deidades llamadas mpungu y con los espíritus de los muertos.»',P),
 p('«Cómo ven las cosas: la fuente menciona dos métodos: el vititi mensu, que consiste en mirar en un cuerno de un animal sacralizado tapado con un espejo, y los chamalongos, conchas de coco que se lanzan y cuya caída expresaría la respuesta del muerto. Los mayomberos usan el coco para saber si su nganga (el caldero sagrado) está satisfecha. Las fuentes consultadas no detallan cómo se interpretan, y esta web no lo inventa.»',P),
 p('Ramas que cita la web: Mayombe, Briyumba y Kimbisa.',P), Spacer(1,4), revision(1.5), Spacer(1,8),
 p('<b>Deidades (mpungu) y su equivalencia</b> según F8:',P), Spacer(1,6)]
filas=[[p(esc(m['n']),PC),p(esc(m['ori']),PC),p(esc(m['santo']) if m['santo'] else '—',PC),p(esc(m.get('nota','')),PS),p(BOX+' OK',PS)] for m in C['MPUNGOS']]
S+=[tabla(['Mpungu','Orisha','Santo católico','Nota','Revisión'],filas,[40*mm,24*mm,38*mm,None,17*mm]), PageBreak()]

# ---------- 7. fuentes ----------
S+=[p('7. Fuentes',H1), p('Todas son públicas. Son divulgativas; ninguna es una fuente interna de una casa de ocha, de ifá o de palo.',P), Spacer(1,6)]
for i,f in enumerate(F):
    if f: S.append(p('<b>F'+str(i)+'.</b> '+esc(f['t'])+'<br/><font size="7.5" color="#5b5870">'+esc(f['u'])+'</font>',P)); S.append(Spacer(1,4))
S+=[Spacer(1,10), p('8. Opinión general',H1), p('Marque la que corresponda y añada lo que quiera:',P), Spacer(1,6),
 p(BOX+' Se puede publicar como está.',P), Spacer(1,3), p(BOX+' Se puede publicar con las correcciones que he marcado.',P), Spacer(1,3), p(BOX+' Se debe reducir a lo básico (orishas y santos principales) y quitar el resto.',P), Spacer(1,3), p(BOX+' No se debe publicar.',P), Spacer(1,10),
 p('Comentarios generales:',PS), Table([['']],colWidths=[None],rowHeights=[60*mm],style=TableStyle([('BOX',(0,0),(-1,-1),.4,LINEA),('BACKGROUND',(0,0),(-1,-1),FONDO)])), Spacer(1,10),
 Table([[p('Nombre de quien revisa:',PS),p('',PS),p('Fecha:',PS),p('',PS)]],colWidths=[38*mm,70*mm,16*mm,None],style=TableStyle([('LINEBELOW',(1,0),(1,0),.4,LINEA),('LINEBELOW',(3,0),(3,0),.4,LINEA)]),rowHeights=[10*mm])]

def pie(c,d):
    c.saveState(); c.setFont('DJ',7); c.setFillColor(GRIS); c.drawString(15*mm,9*mm,'Ánima · Revisión de la capa Cuba · Borrador'); c.drawRightString(A4[0]-15*mm,9*mm,'Página '+str(d.page)); c.restoreState()
doc=SimpleDocTemplate(os.path.join(AQUI,'Revision_capa_Cuba_Anima.pdf'),pagesize=A4,leftMargin=15*mm,rightMargin=15*mm,topMargin=15*mm,bottomMargin=18*mm,title='Revisión de la capa Cuba · Ánima',author='Ánima')
doc.build(S,onFirstPage=pie,onLaterPages=pie)
print('ok')
