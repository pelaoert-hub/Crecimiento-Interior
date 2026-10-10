"""Construye UN solo archivo HTML (anima_prueba.html) con todo incrustado, para revisarlo sin servidor.
Uso: python3 tools/vista_previa/construir.py [carpeta_de_salida]   (por defecto: revision/)"""
import re,base64,sys
import os
R=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))+'/'
S=(sys.argv[1] if len(sys.argv)>1 else os.path.join(R,'revision'))+'/'
os.makedirs(S,exist_ok=True)
b64=lambda f,m: 'data:%s;base64,%s'%(m,base64.b64encode(open(R+f,'rb').read()).decode())
css=open(R+'estilo.css').read()
css=css.replace("url('/fuentes/Marcellus-400.woff2')","url('%s')"%b64('fuentes/Marcellus-400.woff2','font/woff2')).replace("url('/fuentes/HankenGrotesk.woff2')","url('%s')"%b64('fuentes/HankenGrotesk.woff2','font/woff2'))
html=open(R+'index.html').read()
body=re.search(r'<body>(.*)</body>',html,re.S).group(1)
body=re.sub(r'<script src="[^"]+"></script>\s*','',body)
body=body.replace('/icons/favicon-32.png',b64('icons/favicon-32.png','image/png')).replace('/icons/icon-192.png',b64('icons/icon-192.png','image/png'))
js=''.join('<script>'+open(R+f).read()+'</script>\n' for f in ['config.js','articulos.js','app.js','lecturas.js','lecturas-ui.js','iching.js','capas.js','cuba-datos.js','cuba.js'])
shim=open(os.path.join(os.path.dirname(__file__),'shim.js')).read()
open(S+'anima_prueba.html','w').write('<title>Ánima</title>\n<style>\n'+css+'\n</style>\n'+body+'\n'+js+'<script>'+shim+'</script>\n')
