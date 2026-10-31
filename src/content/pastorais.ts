// ============================================================
// VALORES PADRÃO (reserva).
// As pastorais reais ficam no banco (Supabase > tabela `pastorais`) e podem
// ser alteradas, criadas ou desativadas sem novo build. Estes valores só
// aparecem se o Supabase não estiver configurado ou a migração 0003 ainda
// não tiver sido executada.
// ============================================================

import type { Pastoral } from "@/lib/types";

export const pastoraisPadrao: Pastoral[] = [
  {
    slug: "casamento",
    nome: "Casamento",
    resumo: "Prepare-se para o Sacramento do Matrimônio e agende sua celebração.",
    icone: "aliancas",
    sobre: [
      "O Matrimônio é a aliança pela qual o homem e a mulher constituem entre si uma comunhão de vida toda, ordenada ao bem dos cônjuges e à geração e educação dos filhos.",
      "A paróquia acompanha os noivos desde o primeiro contato até a celebração, com o curso de preparação, a habilitação matrimonial e o ensaio da cerimônia.",
    ],
    requisitos: [
      "Procurar a secretaria com no mínimo 6 meses de antecedência",
      "Certidões de batismo atualizadas (emitidas há menos de 6 meses)",
      "Participação no curso de noivos",
      "Documentos de identidade e comprovante de residência",
    ],
    encontros: "Cursos de noivos mensais - consulte as datas pelo WhatsApp.",
    whatsapp: "5531999625767",
    mensagemWhatsapp: "Olá! Gostaria de informações sobre casamento na paróquia.",
  },
  {
    slug: "coroinhas",
    nome: "Coroinhas",
    resumo: "Crianças e adolescentes que servem ao altar com alegria e reverência.",
    icone: "vela",
    sobre: [
      "Os coroinhas auxiliam o sacerdote nas celebrações litúrgicas, aprendendo desde cedo o amor pela Eucaristia e o serviço à comunidade.",
      "A formação inclui conhecimento da liturgia, dos objetos e vestes litúrgicas e momentos de convivência e oração.",
    ],
    requisitos: [
      "Ter feito ou estar na catequese de Primeira Eucaristia",
      "Idade a partir de 9 anos",
      "Autorização dos pais ou responsáveis",
      "Disponibilidade para as formações",
    ],
    encontros: "Formação aos sábados pela manhã.",
    whatsapp: "5531999625767",
    mensagemWhatsapp: "Olá! Gostaria de informações para meu filho(a) ser coroinha.",
  },
  {
    slug: "ministros",
    nome: "Ministros Extraordinários",
    resumo: "Leigos que auxiliam na distribuição da Sagrada Comunhão e visitam os enfermos.",
    icone: "calice",
    sobre: [
      "Os Ministros Extraordinários da Sagrada Comunhão servem a comunidade auxiliando na distribuição da Eucaristia nas missas e levando a Comunhão aos doentes e idosos.",
      "O ministério é assumido após indicação, formação específica e envio pelo pároco.",
    ],
    requisitos: [
      "Ser maior de idade e ter recebido os sacramentos de iniciação cristã",
      "Se casado, ser casado na Igreja",
      "Vida de participação ativa na comunidade",
      "Participar da formação arquidiocesana",
    ],
    encontros: "Reunião mensal e escala definida pela coordenação.",
    whatsapp: "5531999625767",
    mensagemWhatsapp: "Olá! Gostaria de saber mais sobre o ministério extraordinário da comunhão.",
  },
  {
    slug: "acolhida",
    nome: "Pastoral da Acolhida",
    resumo: "O primeiro sorriso de quem chega: acolher cada pessoa como Cristo nos acolhe.",
    icone: "maos",
    sobre: [
      "A Pastoral da Acolhida recebe os fiéis na porta da igreja, orienta os visitantes, ajuda os idosos e pessoas com deficiência e cuida para que todos se sintam em casa.",
      "É um serviço simples e essencial, aberto a todos que desejam servir com alegria.",
    ],
    requisitos: [
      "Desejo de servir e de acolher",
      "Disponibilidade para participar da escala das missas",
      "Participar das reuniões de formação",
    ],
    encontros: "Reunião bimestral; escala mensal.",
    whatsapp: "5531999625767",
    mensagemWhatsapp: "Olá! Gostaria de participar da Pastoral da Acolhida.",
  },
];
