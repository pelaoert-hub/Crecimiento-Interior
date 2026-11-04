-- APLICADO en el proyecto de Supabase anima el 4/11/2026.
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
