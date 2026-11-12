-- APLICADO en el proyecto de Supabase anima el 4/11/2026 (tabla inicial + migracion 2 al final).
-- Proyecto "anima" (ref vxnaztujvdbhbgherpoa), NO el de Puentes.
-- Los cambios frente al SQL inicial (permisos minimos, no-vacio, indice) estan marcados con [CAMBIO].

create table public.comunidad_mensajes (
  id bigint generated always as identity primary key,
  nombre text not null check (char_length(nombre) between 1 and 40),
  texto  text not null check (char_length(texto)  between 5 and 500),
  aprobado boolean not null default false,
  created_at timestamptz not null default now(),

  -- [CAMBIO b] que nombre y texto no sean solo espacios, tabuladores o saltos de linea.
  -- (btrim con lista explicita de caracteres: btrim() a secas solo quita espacios.)
  constraint comunidad_nombre_no_vacio
    check (char_length(btrim(nombre, E' \t\r\n')) >= 1),
  constraint comunidad_texto_no_vacio
    check (char_length(btrim(texto, E' \t\r\n')) >= 5)
);

alter table public.comunidad_mensajes enable row level security;

-- [CAMBIO a] permisos explicitos. Supabase suele dar a anon/authenticated todos los
-- permisos sobre tablas nuevas de public; la RLS los frena, pero no dependemos solo
-- de ella: se quitan todos y se da lo minimo.
revoke all on public.comunidad_mensajes from anon, authenticated;
-- anon puede leer (la politica de abajo limita a filas aprobadas)
grant select on public.comunidad_mensajes to anon;
-- anon solo puede escribir nombre y texto: id, created_at y aprobado salen
-- siempre de sus valores por defecto (identity, now(), false)
grant insert (nombre, texto) on public.comunidad_mensajes to anon;
-- Nota: authenticated queda sin permisos a proposito (esta web no usa login).
-- Si algun dia se anade login de usuarios, habra que darles permisos y politicas.

-- cualquiera puede enviar, pero siempre sin aprobar (igual que el original)
create policy "enviar" on public.comunidad_mensajes
  for insert to anon with check (aprobado = false);
-- cualquiera puede leer solo lo aprobado (igual que el original)
create policy "leer aprobados" on public.comunidad_mensajes
  for select to anon using (aprobado = true);
-- anon no tiene UPDATE ni DELETE: ni permiso ni politica.

-- [CAMBIO c] indice parcial para la lista publica (aprobados, mas recientes primero)
create index comunidad_aprobados_reciente_idx
  on public.comunidad_mensajes (created_at desc)
  where aprobado;

-- [CAMBIO d] COMO MODERAR (desde el panel de Supabase; ahi se entra como "postgres",
-- que se salta la RLS, asi que funciona aunque anon no pueda tocar nada):
--
--   Ver pendientes (SQL Editor):
--     select id, created_at, nombre, texto
--       from public.comunidad_mensajes
--      where not aprobado
--      order by created_at;
--
--   Aprobar uno (SQL Editor):
--     update public.comunidad_mensajes set aprobado = true where id = 123;
--   o en Table Editor: abrir la fila y marcar la casilla "aprobado".
--
--   Borrar uno (SQL Editor):
--     delete from public.comunidad_mensajes where id = 123;
--   o en Table Editor: seleccionar la fila y pulsar "Delete".
--
--   Antes de aprobar, leer el texto completo: la web debe mostrarlo siempre como
--   texto (textContent / escapado), nunca como HTML.

-- =====================================================================================
-- MIGRACION 2: RETIRO DE VELAS, APLICADA EL 4/11/2026 (migracion "comunidad_retiro_vela")
-- Cambia los permisos de anon de arriba: desde aqui SELECT e INSERT van por columna.
-- Estado resultante para anon: SELECT (id, nombre, texto, aprobado, created_at),
-- INSERT (nombre, texto, token_hash), EXECUTE de retirar_vela. Nunca SELECT de token_hash.
-- =====================================================================================

-- (a) huella de la clave secreta de retiro. Solo la huella: la clave nunca sale del navegador
-- al enviar. Las velas antiguas o enviadas sin clave quedan con null y no se pueden retirar desde la web.
alter table public.comunidad_mensajes
  add column token_hash text,
  add constraint comunidad_token_hash_formato
    check (token_hash is null or token_hash ~ '^[0-9a-f]{64}$');

-- (b) permisos por columna. Al anadir la columna, el SELECT de tabla que tenia anon la
-- habria dejado legible; se quita y se da columna a columna, sin token_hash.
revoke select, insert on public.comunidad_mensajes from anon;
grant select (id, nombre, texto, aprobado, created_at) on public.comunidad_mensajes to anon;
grant insert (nombre, texto, token_hash) on public.comunidad_mensajes to anon;
-- las politicas "enviar" y "leer aprobados" no cambian (leer aprobados usa la columna
-- aprobado, que anon sigue pudiendo leer).

-- (c) retirar una vela con su clave secreta.
-- Es SECURITY DEFINER porque anon no tiene (ni debe tener) DELETE sobre la tabla: la funcion
-- borra con los permisos de su dueno, pero solo la fila cuya huella coincide exactamente con
-- la de la clave recibida. Sin conocer la clave (128 bits aleatorios) no se puede borrar
-- una vela ajena. Las filas con token_hash null nunca coinciden (null = x no es verdadero).
-- search_path vacio y nombres con esquema para que nadie pueda colar otra tabla o funcion.
-- El aviso del advisor de Supabase sobre funciones SECURITY DEFINER ejecutables por anon es
-- conocido y aceptado: la funcion hace una sola cosa, con validacion de entrada.
create function public.retirar_vela(p_token text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_huella text;
  v_borradas integer;
begin
  if p_token is null or char_length(p_token) < 16 or char_length(p_token) > 128 then
    return false;
  end if;
  v_huella := pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token, 'UTF8')), 'hex');
  delete from public.comunidad_mensajes where token_hash = v_huella;
  get diagnostics v_borradas = row_count;
  return v_borradas > 0;
end;
$$;

-- (d) solo anon puede ejecutarla (la web no usa login).
revoke execute on function public.retirar_vela(text) from public, anon, authenticated;
grant execute on function public.retirar_vela(text) to anon;

-- Moderacion: lo de arriba (ver, aprobar y borrar desde el panel) sigue valiendo igual.
