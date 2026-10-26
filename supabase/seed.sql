-- Dados de exemplo — ajuste para a realidade da paróquia.
insert into public.horarios_missa (dia_semana, hora, tipo) values
  (0, '07:30', 'Missa'),
  (0, '09:30', 'Missa'),
  (0, '19:00', 'Missa'),
  (2, '19:00', 'Missa'),
  (3, '19:00', 'Missa'),
  (4, '19:00', 'Missa'),
  (5, '19:00', 'Missa'),
  (6, '18:00', 'Missa');

insert into public.avisos (titulo, conteudo, destaque) values
  ('Bem-vindo ao novo site da paróquia', 'Aqui você encontra horários, avisos, eventos e como participar das pastorais.', true);

insert into public.eventos (titulo, descricao, data_inicio, local) values
  ('Festa da Padroeira', 'Novena, missa solene e quermesse em honra a Maria, Serva do Senhor.', now() + interval '30 days', 'Igreja Matriz');
