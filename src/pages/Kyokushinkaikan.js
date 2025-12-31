import React, { useState } from "react";
import YoutubeEmbed from '../components/YoutubeEmbed';
import ParallaxBackground from '../components/ParallaxBackground';
import PageWithSidebar from '../components/PageWithSidebar';
import Gallery from '../components/Gallery';

const menuItems = [
  { label: "Inicio", target: "inicio" },
  { label: "História", target: "historia" },
  { label: "Fundadores", target: "fundadores" },
  { label: "Filosofia", target: "filosofia" },
  { label: "Galeria", target: "galeria" },
];

const galeriaImagens = [
  { src: "https://i.imgur.com/HS6uKEp.jpeg", alt: "" },
  { src: "https://i.imgur.com/Gt2Tdxl.jpeg", alt: "" },
  { src: "https://i.imgur.com/f3YfOqK.jpeg", alt: "" },
  { src: "https://i.imgur.com/WqmWA39.jpeg", alt: "" },
  { src: "https://i.imgur.com/bgevfbm.jpeg", alt: "" },
  { src: "https://i.imgur.com/1EJWaKj.jpeg", alt: "" },
  { src: "https://i.imgur.com/guW43xI.jpeg", alt: "" },
  { src: "https://i.imgur.com/SrqgTBi.jpeg", alt: "" },
  { src: "https://i.imgur.com/0SxPDT5.jpeg", alt: "" },
  { src: "https://i.imgur.com/2vXUPmO.jpeg", alt: "" },
  { src: "https://i.imgur.com/6NAw3fr.jpeg", alt: "" },
  { src: "https://i.imgur.com/vB1omWH.jpeg", alt: "" },
  { src: "https://i.imgur.com/zKkiaVP.jpeg", alt: "" },
  { src: "https://i.imgur.com/mAmEcbE.jpeg", alt: "" },
  { src: "https://i.imgur.com/n8fCeON.jpeg", alt: "" },
  { src: "https://i.imgur.com/sN21RWI.jpeg", alt: "" },
  { src: "https://i.imgur.com/VAjZyQA.jpeg", alt: "" },
  { src: "https://i.imgur.com/xhfFtMX.jpeg", alt: "" },
  { src: "https://i.imgur.com/42YX9M9.jpeg", alt: "" },
  { src: "https://i.imgur.com/CGsYtY3.jpeg", alt: "" },
  { src: "https://i.imgur.com/PBDkWQw.jpeg", alt: "" },
  { src: "https://i.imgur.com/ue4Um12.jpeg", alt: "" },
  { src: "https://i.imgur.com/FRqHA8K.jpeg", alt: "" },
  { src: "https://i.imgur.com/XZxHaAC.jpeg", alt: "" },
  { src: "https://i.imgur.com/pVlejTD.jpeg", alt: "" },
  { src: "https://i.imgur.com/TKYRK0q.jpeg", alt: "" },
  { src: "https://i.imgur.com/VVqzO9G.jpeg", alt: "" },
  { src: "https://i.imgur.com/kBUn94w.jpeg", alt: "" },
  { src: "https://i.imgur.com/GnvBOiM.jpeg", alt: "" },
  { src: "https://i.imgur.com/x9qTnfx.jpeg", alt: "" },
  { src: "https://i.imgur.com/VOtqfux.jpeg", alt: "" },
  { src: "https://i.imgur.com/cXcLMGo.jpeg", alt: "" },
  { src: "https://i.imgur.com/GOvGXrc.jpeg", alt: "" },
  { src: "https://i.imgur.com/qlt3WGj.jpeg", alt: "" },
  { src: "https://i.imgur.com/BEYrZr2.jpeg", alt: "" },
];

const Kyokushinkaikan = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageClick = (imageSrc) => setSelectedImage(imageSrc);

  return (
    <PageWithSidebar menuItems={menuItems}>
      <ParallaxBackground imageUrl="https://i.imgur.com/vF5SgMB.png" />
      <main className="flex-1 p-8 space-y-16 bg-white bg-opacity-90">
        {/* INICIO */}
        <section id="inicio" className="space-y-4">
          <h1 className="text-3xl font-bold mb-4">Karate Kyokushinkaikan</h1>
          <p>Para você saber o que é o Karate Kyokushinkaikan, primeiramente você deve conhecer o Mentor deste estilo o Sosai Masutatsu Oyama, depois conhecer quem difundiu no Brasil e os mestres introdutores.</p>
        </section>
        {/* HISTÓRIA */}
        <section id="historia" className="space-y-4">
          <h1 className="text-3xl font-bold mb-4">História do Kyokushinkaikan</h1>
          <p>O Kyokushinkaikan foi fundado por Masutatsu Oyama, conhecido por sua dedicação e força no karatê de contato total. Desde sua criação, o estilo se expandiu pelo mundo, formando uma grande comunidade de praticantes.</p>
          <img src="https://i.imgur.com/4JqAODo.jpg" alt="História Kyokushinkaikan" className="cursor-pointer w-64 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/4JqAODo.jpg")} />
        </section>
        {/* FUNDADORES */}
        <section id="fundadores" className="space-y-8">
          {/* SOSAI MASUTATSU OYAMA */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">Sosai Masutatsu Oyama</h2>
            <img src="https://i.imgur.com/4JqAODo.jpg" alt="Sosai Masutatsu Oyama" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/4JqAODo.jpg")} />
            <h3 className="text-3xl font-bold mb-4">HISTÓRICO DO SOSAI MASUTATSU OYAMA E DE SEU ESTILO DE KARATE: KYOKUSHINKAIKAN</h3>
            <p>Logo após a Segunda Guerra Mundial, ainda durante a ocupação do Japão pelos aliados, os espectadores de um Torneio de Karate levado a público pelos japoneses no "Sanno Hotel" de Tóquio presenciaram uma cena que nunca mais esqueceriam. Terminado o último combate, dois homens passaram a discutir em pleno tablado: um japonês magro e alto, que estava lívido de furor, e um coreano rijo e troncudo, que não demonstrava maiores preocupações.</p>
            <p>De repente o japonês saca um punhal oculto por trás de seu cinturão e rasga vivamente o ar em direção ao coreano. Num milésimo de segundo o braço do atacante é interceptado e um poderosíssimo soco reverso esmaga-lhe o rosto. Ouvisse um ruído de ossos quebrados e o agressor está no chão, agora salpicado por pequenas poças vermelhas. O homem estava morto, esfacelado por um único golpe! Esse episódio constituiu-se no ponto decisivo da carreira marcial de um jovem, então com 24 anos, que mais tarde adotaria o nome de Masutatsu (Mas) Oyama e que se tornaria mundialmente famoso. Sosai Masutatsu Oyama seguiu meteórica e tumultuada carreira nas artes de combate. Criança ainda aprendia Chabee (uma combinação coreana de Jujitsu e Kempo) na escola que frequentava dos 9 aos 13 anos passou a praticar diariamente tanto o Chabee quanto o Boxe Shaolim na propriedade de seu pai, sob a orientação de um fazendeiro do norte da Coréia.</p>
            <p>Em 1937, por ocasião da guerra entre o Japão e a China começou a estudar Karate Shotokan, persistindo nesse estilo por dois anos. Não satisfeito, matriculou-se na Takushuko University para aperfeiçoar seu Karate, treinando por mais dois anos no distrito de Meijiro, Tóquio, onde Gichin Funakoshi ensinava.</p>
            <img
              src="https://i.imgur.com/trpesGt.jpg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            />
            <p>No auge do conflito entre Japão/ Estados Unidos e Grã Bretanha, aos 18 anos Sosai Oyama entrava para o Exercito Imperial e juntava-se a Butokukai - Organização Governamental que compreendia todas as principais artes marciais. Tornou-se então um membro da Kokai, especializando-se em táticas de espionagem e guerrilha. Sosai Oyama veio a ser aluno de Cho Yung Ju e de Tenshichiro Ozawa, com quem se submeteu a um "treinamento mental"</p>
            <p>Foi quando decidiu levar uma vida solitária nas montanhas, praticando Karate 7 horas por dia, aperfeiçoando suas técnicas e culminando na criação de um estilo que veio a chamar formalmente de Kyokushinkaikan, em 1961. A partir de 1952 e durante 10 anos, Sosai Masutatsu Oyama excursionou por quase todo o mundo, demonstrando seu estilo e propagando sua arte.</p>
            <p>Sua rede internacional expandira-se por 43 países (em 180 ramificações) e sua obra contava ainda com a publicação de 12 livros (dos quais 6 no idioma japonês), sendo o mais famoso deles "What is Karate?" com 170 mil exemplares vendidos até 1960.</p>
            <p>Possuidor de descomunal força física, Sosai Oyama ficou famoso pelas suas técnicas de quebramento: partia mais de 30 telhas, além de tijolos e pedras com uma única pancada descendente e matava touros também com um só golpe. Sosai Masutatsu Oyama esteve no Brasil por 03 vezes, visitando academia e como convidado em Torneios Sulamericanos.</p>
            <p>Infelizmente e para pesar de todos os praticantes de artes marciais um mês depois de diagnosticado um câncer pulmonar Sosai Masutatsu Oyama veio a falecer no dia 26 de abril de 1994 aos 70 anos de idade.</p>

            <h3 className="text-3xl font-bold mb-4">SOSAI MASUTATSU OYAMA O ÚLTIMO DOS GIGANTES</h3>

            <p>Sosai Oyama nasceu na Coréia em 27 de Julho de 1923 e recebeu o nome de Hyung Yee. Só mais tarde, quando decide dedicar sua vida ao Karate que adota o nome japonês de "Masutatsu Oyama", que significa "elevação da alta montanha". Na sua terra natal, o jovem Hyung Yee descobre bem cedo as artes marciais locais, notadamente o Tae-Kyon e o Tae-Kwon-Pup. Estas duas disciplinas seriam depois combinadas para dar nascimento ao Tae-kwondo. Ainda em seu País, Sosai Oyama estuda também diferentes formas de Kenpo Chinês e Japonês. Nessa época, o principal modelo humano de Sosai Oyama "Otto Von Bismarck","o unificador da Alemanha": Sempre tive o desejo de ser o Bisrnarck do Oriente, saí de casa aos 13 anos e fui para Tóquio".</p>
            <p>Em Tóquio, Sosai Oyama pratica de início o Judô no Kodokan - Centro Mundial dessa arte. Em 1938 matricula-se na escola de Karate Shotokan, dirigida por Gichin Funakoshi e seu filho Yoshitaka: "Pratiquei o Karate Shotokan... mas já duvidava de sua abordagem linear. E não gostava da idéia de controlar minhas técnicas. Era rígido demais para mim, então parti..."</p>
            <img
              src="https://i.imgur.com/70XTKOp.jpg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            />
            <p>Sosai Oyama deixa o Dojo Shotokan em 1940, depois de ter trabalhado cerca de um ano e meio. Partiu depois que Yoshitaka, filho do fundador, é derrotado por um expert do Goju-Ryu.</p>
            <p>De qualquer forma, a maioria dos experts japoneses mais conhecidos, em um momento ou outro, haviam passado pelo Shotokan e Sosai Oyama não seria exceção. Deixando Sensei Funakoshi, Sosai Oyama torna-se discípulo de So Neishu. Este, de origem coreana (seu nome anterior era Cho Hyung Ju), tinha pôr mestre Sensei Gogen Yamaguchi, fundador da ramificação japonesa do Karate-Dô Goju-Ryu, e era membro da organização Nichiren-Shô-Shu. É por seu intermédio que Sosai Oyama estudaria o Zen. No Karate, o que conta sempre mais que as técnicas ou a força é o elemento espiritual que permite ao indivíduo mover-se e agir em plena liberdade.</p>
            <img
              src="https://i.imgur.com/7bzqy2n.jpg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            />
            <p>Para se alcançar a boa atitude de espírito, a meditação Zen é muito importante. Quando dizemos que essa meditação implica em um estado de impassividade e na ausência total de pensamento, queremos dizer que através dessa meditação podemos vencer a emoção e o pensamento, e dar a nossas capacidades um curso mais livre que nunca. O homem que quer seguir o caminho do Karate não pode negligenciar o Zen e o aperfeiçoamento espiritual".</p>
            <p>Sob os conselhos de So Neishu, Sosai Oyama estuda durante algum tempo sob a direção do próprio Yamaguchi. Em 1947, vence o All Japan Karate Championship que teve lugar em Kyoto, no Karuyama Gimmasium.</p>

            <h3 className="text-3xl font-bold mb-4">UM EXÍLIO VOLUNTÁRIO</h3>

            <p>Em 1948, depois de ter passado alguns meses na prisão, Sosai Oyama se impõe um exílio voluntário de 18 meses, no monte Kiyosumi, distrito de Chiba: "Quando estava na prisão, depois da Segunda Guerra Mundial, ciente de não estar qualificado para ensinar ou para trabalhar e incerto quanto ao futuro, decidi me dedicar exclusivamente ao Karate… Ao ser posto em liberdade dirigi-me imediatamente para as florestas retiradas do monte Kiyosumi, onde treinei sozinho por um ano e meio. Penso que todos que se dedicam à uma causa devem passar por um período de isolamento desse gênero.</p>
            <img
              src="https://i.imgur.com/dMKYy7Q.jpg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            />
            <p>Meu treinamento cotidiano começava bem cedo, com uma sessão de purificação espiritual efetuada sob as águas geladas de uma cascata. Depois do que eu voltava, correndo, à minha humilde moradia para dar prosseguimento ao meu treino. Utilizava tudo que a natureza colocava à minha disposição para desenvolver minhas condições físicas e minha força Tomava cuidado em não negligenciar nenhuma parte do corpo, nenhum aspecto do treinamento. A manhã era assim dedicada ao fortalecimento de minhas qualidades musculares e funções respiratórias. Corria pelas montanhas, mudava de lugar, subia em pedras e troncos de árvores, mergulhava nas torrentes geladas. Esse treino matinal terminava com nova sessão de meditação.</p>
            <p>A tarde era dedicada à prática do Karate. Eu havia instalado makiwaras nos troncos das árvores e eu os golpeava durante várias horas, com os punhos e com os pés. Exercitava-me também no quebramento até que o estado de minhas mãos me impedisse de continuar.</p>
            <p>Durante todo o tempo de meu retiro nessas montanhas, nem um dia se passava sem que me entregasse ao penoso e violento treinamento, fizesse que tempo fizesse. Quando a escuridão caía sobre as montanhas, eu podia medir a absoluta profundeza de minha solidão… cercado pelas trevas e pelo silêncio, acendia uma vela em minha pobre cabana e pendurava na parede uma folha de papel branco sobre a qual eu havia traçado dois círculos: o da direita (Sei), simbolizava a ação e o da esquerda (Do), simbolizava a inatividade.</p>
            <p>Observando esses dois círculos, entrava em profunda meditação. Esse prolongado retiro, longe de toda civilização permitiu-me aumentar de maneira considerável o nível de Karate, mas sobretudo atingir um estado mental peculiar que não tinha mais nada em comum com o de antes…"</p>
            <p>A medida em que Sosai Oyama toma consciência de suas prodigiosas faculdades, um projeto começa a germinar em seu espírito: o de realizar uma façanha fora do comum, que provasse a superioridade do seu Karate sobre todas as outras formas de combate a mãos nuas. Decide finalmente repetir os feitos de certos praticantes de Kempo de Okinawa: Abater Touros.</p>

            <h3 className="text-3xl font-bold mb-4">DUELO COM TOUROS</h3>

            <p>Antes de enfrentar os primeiros touros, Sosai Oyama vai a diferentes matadouros da prefeitura de Chiba, a fim de testar seu poder de golpe. Depois de várias tentativas cuidadosas, ele consegue abater seu primeiro touro. A técnica consistia em desferir um golpe de punho direto (tsuki) sobre a fronte do animal, entre os olhos, no ponto em que os profissionais exercem a pressão com a ajuda de uma marreta e de um martelo.</p>
            <p>Em 1950, Sosai Oyama enfrenta seu primeiro touro em uma arena. A besta dobra sob o efeito do primeiro tsuki mas Sosai Oyama não consegue acabar com ela. Tenta um golpe circular com a mão (Shuto Mawashi Uchi) e quebra os chifres do animal. Depois disso, no Japão e nos Estados Unidos, enfrentaria 52 touros, partindo os chifres de 49 e matando os 3 outros. Um desses confrontos foi filmado pela Shochiku Motion Picture (Produtora de Filmes).</p>

            <h3 className="text-3xl font-bold mb-4">ESTADOS UNIDOS E SUDESTE ASIÁTICO</h3>

            <p>Em 1952, Sosai Oyama é convidado pela U.S.A. Professional Wrestling Association, de Chicago (Estados Unidos). Faz-se acompanhar do judoca Endo Kokichi, faixa preta 6º Dan e de um lutador havaiano apelidado "The Great Togo".</p>
            <p>O Wrestling Hall de Chicago era um imenso ginásio que podia receber mais de 15.000 pessoas. Naquela noite, estava lotado. Great Togo me apresentou ao público. Ele falava inglês e eu não entendi uma palavra do que ele disse. Eu devia fazer uma demonstração de meus talentos de Karateca, antes da luta-combate que deveria se constituir no acontecimento principal da noite. Eu havia previsto quebrar de início uma única tábua de madeira de uma polegada de espessura, depois duas, três… até quebrar cinco tábuas empilhadas umas sobre as outras. Mas quando me apresentaram as tábuas surpreendi-me com o tamanho delas: tratava-se na verdade de duas tábuas de madeiras de 5 polegadas de espessura cada! Compreendi então que a barreira da linguagem poderia me custar caro… A primeira tábua quebrou no ato sob o efeito de meu primeiro golpe e Endo me perguntou se eu queria continuar. Ele segurou a segunda tábua com ambas as mãos e recuou um passo para firmar sua posição.</p>
            <p>Era a primeira vez que eu tentava quebrar uma madeira tão espessa, mantida verticalmente… Após breve instante de concentração quebrei essa segunda tábua com um único tsuki. Devia efetuar a quebra seguinte em tijolos. Mas ignorava-me que os tijolos americanos eram bem mais duros que os tijolos japoneses, além disso, não havia nenhum suporte rígido sobre o qual dispô-los e o chão era coberto por espesso e macio tapete. Golpeei a primeira vez em Shuto, sem sucesso. Fiz nova tentativa, de resultado idêntico… Decidi então tomar mais tempo para me concentrar e estranha calma começou a me invadir. A cólera e a impaciência deixaram aos poucos meu espírito, enquanto nova força me penetrava… Consegui! Fui ovacionado como jamais o fora antes.</p>
            <p>Voltando ao vestiário, encontrei um homem que me esperava… Ele examinou minha mão direita com atenção e disse: "Queria que as mãos de meu filho fossem tão fortes como esta". Esse homem era Jack Dempsey, um dos maiores pugilistas de todos os tempos. Após essa demonstração, na turnê que empreendem pelos Estados Unidos, Endo e Sosai Oyama tomam respectivamente os nomes de"Ko Togo"(Pequeno Togo) e "Mas Togo". Entre 1952 e 1954, Sosai Oyama efetuaria mais de 200 demonstrações e aceitaria vitoriosamente numerosos desafios contra lutadores e pugilistas: "Na verdade, eu não tinha vontade de partir nessa turnê. Desgostava-me aceitar dinheiro em demonstração de Budô, mas era preciso viver e me ofereciam 100 dólares por semana, todas as despesas pagas. Para o período pós-guerra, no Japão, era uma fortuna… Ah! eu era muito forte nesse tempo. Teria podido ser campeão de atletismo, mas tudo que me interessava era o Karate".</p>

            <img
              src="https://i.imgur.com/SNZ5ZN0.jpg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            />

            <p>Um dos objetivos de minha viagem pelo Sudeste Asiático era testar a eficiência do Thai Boxing como método de autodefesa… Black Cobra era um lutador perfeitamente confiante de suas capacidades em enfrentar um Karateca. Eu não tinha dúvidas de que ele era rápido e poderoso! Suas técnicas de pernas eram notáveis e perigosamente eficientes. Varias vezes ele tentou me atingir na cabeça com chutes circulares. Ele tinha também excelente disparo de golpe e não hesitava em saltar sobre mim cada vez que via urna oportunidade… Possuía um sentido espantoso de equilíbrio e ainda que tivesse falhado em suas tentativas de chutes, não perdeu por um instante sequer a posição, o que é raro nesse tipo de técnica.</p>

            <img
              src="https://i.imgur.com/vCFTJu4.jpg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            />

            <p>Durante os primeiros minutos do combate, eu lhe dei a impressão de suportar mais ou menos seus ataques… Eu precisava encontrar a abertura e o momento favorável… Finalmente consegui encaixar um ataque no queixo, de mão em faca. Encadeei imediatamente um chute no corpo. Ambos caímos… mas eu fui o único a levantar! Apesar de tudo, eu não ficara inteiramente satisfeito com minha vitória. "Precisava melhorar minha capacidade de encadear técnicas de braços e pernas…".</p>

            <h3 className="text-3xl font-bold mb-4">A ORGANIZAÇÃO INTERNACIONAL KYOKUSHINKAIKAN KARATE</h3>

            <p>Em 1957, Sosai Oyama funda a International Karate Organization Kyokushinkaikan (Associação da Extrema Verdade), em margem a outras organizações japonesas de Karate. Sosai Oyama detestava o "Business-Karate" e os permanentes desentendimentos da Japan Karate Association: Na época do primeiro campeonato mundial, decidi manter as competições no Ginásio destinado a Artes Marciais (Budo-kan) em Tóquio, porque de todos os imóveis disponíveis era o único capaz de acomodar mais de 10 mil espectadores que sabíamos viriam assistir as competições (em outra ocasião usamos um Ginásio Municipal com capacidade para 1.300 pessoas).</p>
            <p>O recinto lotou e cerca de 5 mil pessoas viram-se impedidas de entrar, na porta, por falta de espaço. Entretanto, notificaram-nos que o Ginásio Budo-kan não nos iria ser alugado. Corri para saber o motivo e ouvi de um jovem empregado, que nosso pedido havia sido recusado por acharem que o Karate Kyokushinkaikan não era um Karate legítimo. Perguntei então que justificativa havia para isso e o serviçal me disse que era o numero de adeptos de uma escola de Karate que determinava sua legitimidade.</p>

            <img
              src="https://imgur.com/OcLndhu.png"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            />

            <p>O recinto lotou e cerca de 5 mil pessoas viram-se impedidas de entrar, na porta, por falta de espaço. Entretanto, notificaram-nos que o Ginásio Budo-kan não nos iria ser alugado. Corri para saber o motivo e ouvi de um jovem empregado, que nosso pedido havia sido recusado por acharem que o Karate Kyokushinkaikan não era um Karate legítimo. Perguntei então que justificativa havia para isso e o serviçal me disse que era o numero de adeptos de uma escola de Karate que determinava sua legitimidade.</p>
            <p>Acrescentou que considerava determinada escola verdadeiramente legítima e ficou muito embaraçado quando lhe fiz notar que o maior número de público que aquela escola era capaz de reunir em Torneios e Campeonatos era cerca de 3 mil pessoas, enquanto o Karate Kyokushinkaikan atraia mais de 10 mil pessoas. Percebendo que o número de publico não ia justificar a recusa do Budo-kan, o interlocutor me disse que não podia nos alugar a sala porque durante nossos Torneios derramava-se sangue. Mas sangue era também derramado nas competições de Boxe que o Budo-kan nunca havia hesitado em permitir nas suas dependências. Mais tarde, verifiquei que um poderoso dirigente de outra associação de Karate estava por trás desse incidente. Alguns anos antes, havia nos oferecido uma grande ajuda financeira se nossa organização se filiasse a tal associação, mas eu recusara… "</p>

            <h3>PRIMEIRA PUBLICACÃO – PRIMEIROS ENCONTROS</h3>

            <p>Em 1958, Sosai Oyama publica seu primeiro livro: "What is Karate?". O sucesso fulgurante dessa obra o levará a publicar mais tarde "This is Karate" (1965) e "Karate, The World of the Ultimate" (1984). Também em 1958, Edward Bobby Lowe cria a ramificação havaiana da Kyokushin-kai e no ano seguinte organiza em Honolulu o primeiro torneio oficial de Karate Kyokushin, o First Hawai Karate Tournament. Nessa ocasião, Sosai Oyama efetua pessoalmente uma demonstração de Kata e quebramento. Em 1960, o segundo torneio havaiano já conta com a participação de 16 países. Em 1962, é organizado no Madison Square Garden de Nova York o primeiro North America Open Karate Tournament, vencido por Gary Alexander.</p>
            <p>Em 1964, a organização Kyokushinkaikan ocupa espaço na crônica internacional ao aceitar um desafio lançado por lutadores tailandeses. A escola de Sosai Oyama é a única a aceitar e delega 3 de seus representantes para ir a Bangkok. Três lutadores viajaram até a Tailândia para desafiar os Tailandeses, os combates terminaram em 2×1 para os Japoneses, Tadashi Nakamura e Akio Fujihira (conhecido como Noboru Osawa) venceram. Nessa mesma noite, o único perdedor foi Kenji Kurosaki, que futuramente recebeu o título de "Rachaderman" após ter realizado mais de 120 lutas na Tailândia, tornando-se o percussor do Kickboxing no Japão, formando inclusive uns dos melhores lutadores da época como Toshio Fujiwara. Kenji Kurosaki descende de família de Samurais, fundou seu próprio Dojo chamado "Mejiro GYM", e por ter divergências com Osamu Noguchi pelo título de criador do Kickboxing Japonês, resolveu criar seu próprio estilo conhecido com "Shin Kakuto Jutsu" (Nova Arte de Combate).</p>

            <YoutubeEmbed
              embedId="9zpMAVcvH5Q"
            />

            <p>E somente em 1969 que se organiza em Tóquio o primeiro All Japan Open Karate Tournament. Esse torneio e vencido por Yamazaki Terutomo, enquanto Soeno Yoshiji (futuro fundador do Shidokan) se classifica em segundo lugar e Hasegawa Kazuyuki em terceiro. No ano seguinte, Hasegawa é o primeiro, Yamazaki o segundo e Soeno o terceiro. Depois, os vencedores desse torneio serão: Sato Katsuaki (1971), Miura Miyuki (1972), Royama Hatsuo (1973), Sato Katsuaki (1974), Sato Katsuaki (1975), Sato Toshikazu (1976), Azuma Takashi (1977), Ninomiya Joko (1978), Nakamura Makoto (1979), Sanpei Keiji (1980), Sanpei Keiji (1981), Sanpei Keiji (1982), Onishi Yasuto (1983), Kurosawa (1984), Matsui Akiyoshi (1985), Matsui Akiyoshi (1986), Yasuhiko Kuwajima (1988), Yamaki Kenji (1989), Akira Matsuda (1990), Yoshihiro Tamura (1992), Kazumi Hajime (1993), Yamaki Kenji (1994), Kazumi Hajime (1996), etc.</p>
            <p>Em 1972, Sosai Oyama ocupa novamente a crônica internacional. Nesse ano, uma equipe japonesa (independente da IKO e da Kyokushinkaikan) participa de maneira desastrosa de uma competição organizada em Paris. Sosai Oyama insiste no caráter duvidoso desse confronto, denuncia as regras de "não contato" em vigor nessa competição e lembra a total ausência de representatividade da equipe japonesa presente na França.</p>
            <p>Em 1975, a I.K.O. organiza em Tóquio seu primeiro World Open Karate Tournament, vencido por Katsuaki Sato. Hoje a organização Kyokushinkaikan esta presente em mais de 130 países. Todos os anos, em cada um desses países, desenvolvem-se as competições regionais e nacionais que preparam os competidores para o torneio mundial de Tóquio, a cada 4 anos. "Aparentemente todo mundo quer ver o Karate nos Jogos Olímpicos. Com certeza, para o Karate esportivo seria muito bom. Mas o problema é como entrar. Há tantos estilos diferentes. Se aceitarem a modalidade, seria preciso que fosse em 4 categorias: peso pluma, médio, pesado e categoria aberta. Mas tudo isso não é Budô e para o verdadeiro budoka não tem nenhuma importância". Katsuaki.</p>

            <h3 className="text-3xl font-bold mb-4">A PROVA DOS CEM COMBATES (HYAKUNIN KUMITE)</h3>

            <p>Depois de suas estadias em Okinawa e nas ilhas do Havaí, Sosai Oyama decide reviver, no Karate Kyokushinkaikan, uma prova antiga, praticada desde muito tempo nas escolas de Kendo e Judo: a prova dos cem combates. Existe a história celebre de que Sosai Oyama, na época de seus melhores dias, efetuou a prova dos cem kumite durante 3 dias seguidos, ou seja, fez cem combates por dia durante 3 dias. Nessa ocasião seu dojô já era famoso pelo valor de seus lutadores e o próprio Sosai Oyama teria saído seriamente ferido de uma das provas, tendo entretanto vencido todas elas. Esta é a prova máxima de perseverança e espírito do OSU!</p>
            <p>A Organização Kyokushinkaikan construiu a sua força não somente com a habilidade em combate e a coragem do seu fundador, o Sosai Masutatsu Oyama, mas também com a força dos seus praticantes. Assim, Sosai Oyama introduziu um teste único e exclusivo chamado de "Hyakunin Kumite", que significa "combater contra 100 Homens". Este teste é considerado como o último teste no Kyokushinkaikan Karate. Quando um karateka chega ao grau de Shodan (Faixa Preta), é confrontado com dez rounds de kumite duro. Mas o teste final do espírito do Osu encontra-se na prova dos "100 Combates", onde enfrentará cem oponentes consecutivos em rounds que duram um minuto cada.</p>
            <p>Sosai Oyama descobriu que o elemento primário não é a habilidade física, que facilmente poderá ser ensinada, mas uma atitude face à vida – força de vontade indomável, coragem e determinação – o espírito de Osu no seu extremo. O karateka não deve somente completar os cem combates, deve também preencher outros requisitos para o êxito da prova – quando derrubado não pode ficar no solo mais de cinco segundos, e deve ganhar claramente por Ippon ( nocaute), mais de cinquenta combates. Quem ficar no tatame por mais de 5 segundos falha o teste, mesmo se isto acontecer no último combate.</p>
            <p>Sosai Oyama adaptou essa ideia de uma tradição das Artes Marciais que datava da metade do século XIX. A fim de demostrar que é possível passar este teste, na sua juventude, Sosai Oyama combateu 100 opositores por dia durante três dias consecutivos. Ele queria continuar por mais um quarto dia, mas ficou sem oponentes para combater. Ganhar um torneio como o Campeonato do Mundo representa sete ou oito rounds de kumite duro, normalmente divididos sobre três dias. Mesmo contando com quatro prolongamentos no máximo o competidor teria de encarar não mais do que trinta minutos de kumite, mas com intervalos demorados entre os combates para descansar e tratar dos ferimentos; e isto dificilmente pode ser comparado com os trezentos combates sem intervalos efetuados por Sosai!</p>
            <p>Um praticante de boxe poderá comparar esta prova com 300 rounds de boxe divididos sobre três dias, com um oponente fresco em cada round ! Para um jogador de futebol, isto seria como jogar três jogos de Grandes Finais por dia durante três dias consecutivos, e sempre sem intervalo ou qualquer outra paragem entre os jogos. E mesmo hoje, na nossa era dos super – atletas e programas de treino científicos e assistidos por computador, provavelmente não há um só homem que poderia repetir esta incrível proeza de Trezentos Homens Kumite, de Oyama. Não é de admirar, que só 14 pessoas no mundo passaram este teste com êxito, porque neste teste só os mais fortes, tanto mentalmente como fisicamente, vencem.</p>
            <p>O primeiro a completar este teste foi Steve Arneil de Inglaterra (30 anos de idade em 1965) e cinco meses mais tarde Tadashi Nakamura. A seguir Shigueru Oyama (1966), Loek Hollander da Holanda e John Jarvis (ambos em 1966). Até esta data a prova dos Cem Combates realizava-se em dois dias.</p>
            <p>É então que Sosai Oyama decide que a prova dos Cem Combates passará a realizar-se num só dia. Shihan Howard Collins, 7º Dan da Grã – Bretanha foi o primeiro a completar o teste com esta nova regra e em menos de 4 horas, em 1972. Desde então, todos os que passaram o teste fizeram esta proeza em menos de quatro horas. A seguir foi o Miyuki Miura (1973) e treze anos mais tarde Akiyoshi Matsui (1986) e Ademir da Costa do Brasil em 1987. Em 1995 dois dos mais experimentados karatekas também conseguiram passar este teste: Kenji Yamaki, 4º Dan do Japão, e Francisco Filho, 4º Dan do Brasil. Estas últimas provas tiveram lugar na sede da organização de Kyokushin no Japão e foram filmados ao vivo. Yamaki, campeão mundial. realizou a sua prova em 18 de Março de 1995 e teve a duração de 3 horas e 27 minutos. Francisco Filho, (1º não japonês) Campeão Mundial, combateu no dia 22 de Março, 1995, e levou 3 horas e 8 minutos para completar a prova. Ganhou 26 combates por Ippon, 50 por decisão (wazari), e empatou em 24. O último a passar este teste foi Hajime Kazumi no dia 13 de Março de 1999, em 3 horas e 20 minutos. Ao completar este proeza, eles juntaram-se a um grupo de elite de homens que são considerados lendas vivas no Japão e no Mundo do Karate. São estas as pessoas que o Sosai Oyama considera como os verdadeiras budokas, porque a sua preparação leva anos a formar um espírito indomável e uma vontade de ferro.</p>
            <p>Todos os que passaram este teste único são pessoas muito humildes, e nunca se gabam deste fato. Para conseguir este proeza não é preciso ser Campeão do Mundo, porque dos 14 , só Matsui, que ganhou o 5º Campeonato Mundiall, Kenji Yamaki e Francisco Filho, o recente vencedor do 7º Campeonato Mundial foram Campeões. Muitos karatekas incluindo o Bi-Campeão Mundial Makoto Nakamura, tentaram passar este teste e falharam. Kenji Sampei, falhou a sua primeira tentativa após 49 combates. Mas não desistiu e conseguiu passar o teste na Segunda tentativa.</p>
            <p>Para conseguir este proeza, é necessário ter um forte domínio do "Espírito do Osu", em outras palavras, perseverança além dos limites normais. A "prova dos Cem Combates" é o "Teste Supremo do Espírito do Osu", o último teste da perseverança física e mental do Kyokushinkaikan Karate. A Prova dos Cem Combates oferece ao karateka sério e dedicado, um desafio como não há outro em qualquer outra Arte Marcial ou desporto. Até o tortuoso Tour de France, ou a Havaí Ironman Triathlon não podem ser comparados, se bem que requerem uma capacidade de resistência e força de vontade enorme. Difíceis como são, mesmo assim são passados todos os anos por muitos participantes. Sosai Oyama demostrou que este último teste do Kyokushinkaikan Karate pode ser ultrapassado, e lembra-nos de colocar os nossos objetivos tão longe e alto quanto podemos.</p>

            <h3 className="text-3xl font-bold mb-4">HYAKUNIN KUMITE – AKIRA MATSUDA</h3>

            <YoutubeEmbed
              embedId="i-cB1kyqkPk"
            />

            <h3 className="text-3xl font-bold mb-4">HYAKUNIN KUMITE – MATSUI AKIYOSHI</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <YoutubeEmbed
                embedId="I5ITw4UjmHU"
              />
            </div>

            <h3 className="text-3xl font-bold mb-4">HYAKUNIN KUMITE – KAZUMI HAJIME</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <YoutubeEmbed
                embedId="TJC5IOPrkIg"
              />
            </div>

            <h3 className="text-3xl font-bold mb-4">OS ALUNOS DE SOSAI OYAMA</h3>

            <p>Sosai Masutatsu Oyama teve um certo numero de alunos que, por razões diversas, separaram-se da corrente original do Kyokushinkaikan para fundar suas próprias organizações. Entre eles: Ashihara Hideyuki (fundador do New International Karate Ashihara-Kaikan), Azuma Takashi (fundador do Karate-Dô Daido-Juku), Kurosaki Kenji (pioneiro do Kick Boxing japonês), Ninomiya Joko (fundador do Karate Enshin-kai), Oyama Shigeru (fundador do World Oyama Karate Organization), Sato Katsuaki (Campeão do 1º Campeonato Mundial Kyokushinkai em 1975 e fundador do Karate Sato-Juku), Nakamura Tadashi (fundador do World Karate Seido-Juku), Soeno Yoshiji (fundador do World Karate Association – The Shidokan), Kazuyoshi Ishii (fundador da World Seidokaikan Karate Organization e criador do evento de maior popularidade no Japão – K-1). Na Europa, Steve Arneil (Inglaterra, o primeiro estrangeiro a conseguir êxito na prova dos cem combates – fundador da International Kyokushin Karate Federation), Jhon Bluming (pioneiro do Kyokushinkai na Holanda e o primeiro 6º Dan estrangeiro concedido por Oyama – fundador do Kyokushin Budokai), Jan Kallenbach (atualmente responsável pelo Taikiken na Holanda) e Alain Setrouk (pioneiro do Kyokushinkai na França, fundador do Kyokushin-Boxing). No Brasil assim como no restante do mundo tivemos alguns alunos diretos de Sosai Masutatsu Oyama, que fundaram suas próprias organizações: Shihan Eisho Nakaza (fundador do estilo Nakaza Juku), e outros que foram discípulos de S. Isobe (Branch Chief of Brazil): Eduardo Hatakeyama (fundador do estilo Kyoei Kan), Kojem Nagata (fundador do estilo Nagata Ryu), Ademir da Costa (fundador da Seiwakai), e muitos outros.</p>
            <p>Outros alunos diretos formam os mais recentes grupos:</p>
            <p>O Campeão Mundial Kenji Yamaki, fundador do o Yamaki Ryu; Yukio Nishida fundador da Sebukai Karate, Hiroki Kurosawa (Campeão Japonês) fundador do Kurosawa Dojo, Hatsuo Oyama fundador da Kyokushin-Kan, Ryuko Take fundador da World Kyokuhinkaikan, Midori Kenji fundador da Shin Kyokushinkai, Tsuyoshi Hiroshige fundador da Kyokushin Ken, Peter Chong fundador da Kyokushin Ryu, Daihyo Ryuko Take fundador da World Kyokushinkaikan e muitos outros que ainda fundarão diversos estilos.</p>

            <img
              src="https://i.imgur.com/7q6Ntya.jpeg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() => handleImageClick("https://i.imgur.com/7q6Ntya.jpeg")}
            />

            <h3 className="text-3xl font-bold mb-4">OS LIVROS DE SOSAI MASUTATSU OYAMA</h3>
            <p>Sosai Masutatsu Oyama escreveu inúmeros livros que ajudaram a divulgar o Kyokushinkaikan no mundo inteiro. Os pensamentos, filosofias assim como as técnicas do Karate Kyokushinkaikan foi amplamente divulgado nestes livros e ajudaram a cultuar todo o misticismo em torno deste estilo.</p>
            <p>Sosai Masutatsu Oyama fez com que muitas pessoas de diferentes países do mundo, onde não havia o Kyokushinkaikan viajassem até o Japão para conhecê-lo. Ou até mesmo Sosai Masutatsu Oyama passasse temporadas ensinando o Kyokushinkaikan, por contas todas pagas pelo contratante entre eles empresários, reis e príncipes. Assim o Kyokushinkaikan ganhou fama internacional e puderam ser praticados por inúmeras pessoas.</p>
            <p>Muita gente ainda não conhece estes livros escritos por Sosai Masutatsu Oyama, mas em breve o Shihan José Koei Nagata estará disponibilizando estes livros digitalmente, entre os mais famosos "WHAT IS KARATE", "THIS IS KARATE" e "ADVANCED KARATE".</p>
            <p>O Shihan José Koei Nagata digitalizou o Livro "KARATE VITAL" (em português) e as pessoas interessadas podem entrar em contato por e-mail: nagatajk@gmail.com</p>

            <img
              src="https://i.imgur.com/Pct6Fz2.jpeg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() => handleImageClick("https://i.imgur.com/Pct6Fz2.jpeg")}
            />

            <h3 className="text-3xl font-bold mb-4">VIDEOS</h3>
            <h3 className="text-3xl font-bold mb-4">FILME – FIGHTER IN THE WIN – OYAMA O LUTADOR LENDÁRIO</h3>
            <p>Se você deseja adquirir o DVD OYAMA O LUTADOR LENDÁRIO</p>
            <p>FIGHTER IN THE WIND – entre em contato: nagatajk@gmail.com e obtenha maiores informações.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <YoutubeEmbed
                embedId="bqQ8Bqq9UAs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <YoutubeEmbed
                embedId="lVnkhIojunA"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <YoutubeEmbed
                embedId="PPu31D0WqXg"
              />
            </div>


            <h3 className="text-3xl font-bold mb-4">OS LIVROS DE SOSAI MASUTATSU OYAMA</h3>
            <p>Sosai Masutatsu Oyama escreveu inúmeros livros que ajudaram a divulgar o Kyokushinkaikan no mundo inteiro. Os pensamentos, filosofias assim como as técnicas do Karate Kyokushinkaikan foi amplamente divulgado nestes livros e ajudaram a cultuar todo o misticismo em torno deste estilo.</p>
            <p>Sosai Masutatsu Oyama fez com que muitas pessoas de diferentes países do mundo, onde não havia o Kyokushinkaikan viajassem até o Japão para conhecê-lo. Ou até mesmo Sosai Masutatsu Oyama passasse temporadas ensinando o Kyokushinkaikan, por contas todas pagas pelo contratante entre eles empresários, reis e príncipes. Assim o Kyokushinkaikan ganhou fama internacional e puderam ser praticados por inúmeras pessoas.</p>
            <p>Muita gente ainda não conhece estes livros escritos por Sosai Masutatsu Oyama, mas em breve o Shihan José Koei Nagata estará disponibilizando estes livros digitalmente, entre os mais famosos "WHAT IS KARATE", "THIS IS KARATE" e "ADVANCED KARATE".</p>
            <p>O Shihan José Koei Nagata digitalizou o Livro "KARATE VITAL" (em português) e as pessoas interessadas podem entrar em contato por e-mail: nagatajk@gmail.com</p>

            <img
              src="https://i.imgur.com/Pct6Fz2.jpeg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            />

            <h3 className="text-3xl font-bold mb-4">VIDEOS</h3>
            <h3 className="text-3xl font-bold mb-4">FILME – FIGHTER IN THE WIN – OYAMA O LUTADOR LENDÁRIO</h3>
            <p>Se você deseja adquirir o DVD OYAMA O LUTADOR LENDÁRIO</p>
            <p>FIGHTER IN THE WIND – entre em contato: nagatajk@gmail.com e obtenha maiores informações.</p>

            <YoutubeEmbed
              embedId="bqQ8Bqq9UAs"
            />

            <YoutubeEmbed
              embedId="lVnkhIojunA"
            />
            <YoutubeEmbed
              embedId="PPu31D0WqXg"
            />
          </div>
          {/* SHIHAN JOSE KOEI NAGATA */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">Shihan Jose Koei Nagata</h2>
            <img src="https://i.imgur.com/RNx7uBF.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/RNx7uBF.jpeg")} />
            <p>Iniciou-se nas Artes Marciais aos 13 anos de idade, em 1980 na Academia de Karate Oyama Kyokushinkaikan, na cidade de Sorocaba, obtendo instrução com Shihan Mayuki Mizukoshi, Faixa Preta 4º Dan.</p>
            <img src="https://i.imgur.com/I6vDIXb.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/I6vDIXb.jpeg")} />
            <p>Após árduos treinamentos, aos 16 anos conquista a faixa marrom e auxilia o Sensei Agenor Oliva de Moraes 1º Dan a ministrar aulas.</p>
            <p>Por razões políticas, filia-se ao Shihan Eisho Nakaza, faixa Preta 4º Dan de Kyokushinkaikan Karate. Por ser franzino, mas técnico, presta o Exame de Faixa Preta, sendo reprovado na parte de Kumite em 1984 (nocauteado na costela).</p>
            <p>Mesmo assim continua a treinar firme, sempre objetivando conquistar a faixa preta e um dia poder ministrar aula. Em 30 de Julho de 1982 em conjunto com seu pai (Shihan Kojem Nagata), inaugura em Sorocaba a Academia de Karate Oyama Kyokushinkai, vinculada ao Shihan Eisho Nakaza.</p>
            <img src="https://i.imgur.com/fo3Vytk.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/fo3Vytk.jpeg")} />
            <p>Em 30 de Julho de 1982 em conjunto com seu pai (Shihan Kojem Nagata), inaugura em Sorocaba a Academia de Karate Oyama Kyokushinkai, vinculada ao Shihan Eisho Nakaza.</p>
            <img src="https://i.imgur.com/AdnpZaB.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/AdnpZaB.jpeg")} />
            <p>Começa a ministrar aulas e assim passar o seu conhecimento do Kyokushinkaikan Karate.</p>
            <p>Em 1984 por razões políticas, Shihan Eisho Nakaza desliga-se do Kyokushin e funda o seu estilo próprio, denominado de Nakaza Juku.</p>
            <p>Em 1985 presta novo Exame de Faixa, sendo aprovado para Faixa Preta 1º Dan, sob a tutela do Shihan Eisho Nakaza.</p>
            <p>Em 1986 Shihan Eisho Nakaza por problemas familiares retorna ao Japão.</p>
            <p>Em 1986 desvinculamos do estilo Nakaza Juku e fundamos a Associação Nagata de Artes Marciais.</p>
            <p>Em 1988 graduou-se em Licenciatura Plena em Educação Física pela Faculdade de Educação Física de Sorocaba.</p>
            <p>Em 1988 seu Pai (Shihan Kojem Nagata) nomea-o com Instrutor-Chefe da AssociaçãoNagata de Artes Marciais.</p>
            <p>Em 1989 elaborou toda a parte técnica, física e espiritual que culminaria na criação do Budô Karate Nagata Ryu.</p>
            <img src="https://i.imgur.com/hrEVnki.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/hrEVnki.jpeg")} />
            <p>Em 1990 realizou eFull Contactm Sorocaba o 1º Torneio Budô Nagata Ryu de Contato Marcial, com a presença de 300 atletas. Participaram atletas de Karate, Kung-Fu e Hapkido, competindo nas regras do Karate Kyokushinkaikan.</p>
            <img src="https://i.imgur.com/t2AcVLU.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/t2AcVLU.jpeg")} />
            <p>Em 1990 começou a treinar o Full Contact e participou do Campeonato Brasileiro de Full Contact obtendo o 3º lugar na categoria Peso Pluma.</p>
            <p>Em 1991 o estilo Nagata Ryu expande-se e começa a surgir às primeiras filiais vinculadas: Boituva, Mogi Guaçu, Mogi Mirim, Bahia, Minas Gerais, Rondônia, Alagoas e Amazonas.</p>
            <p>Em 1992 começa a ter o reconhecimento de outras entidade desportivas marciais como: United States Karate Association (USA), United States Karate Association do Brasil, International Okinawa Martias Arts Union (Japão) e começo a participar de Torneios de Karate Tradicional (Kata e Kobudô), levando ao conhecimentos dos dirigentes o estilo "Nagata Ryu"</p>
            <img src="https://i.imgur.com/S2fK1yH.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/S2fK1yH.jpeg")} />
            <p>Em 1992 começou a desenvolver o Kobudô Nagata Ryu, pesquisando e desenvolvimento técnicas de Bô, Sai, Tonfa, Nunchaku, Kama, Espada, etc. Em 1993 ministrou o curso de Kobudô – Arma Tonfa para Polícia Militar da Bahia. Em 1994 começou a divulgar o Karate de Contato em outras Federações congêneres, levando ao conhecimento o estilo Nagata Ryu.</p>
            <img src="https://i.imgur.com/qNwww99.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/qNwww99.jpeg")} />
            <p>Em 1993 ministrou o curso de Kobudô – Arma Tonfa para Polícia Militar da Bahia. Em 1994 começou a divulgar o Karate de Contato em outras Federações congêneres, levando ao conhecimento o estilo Nagata Ryu.</p>
            <p>Em 1994 começou a divulgar o Karate de Contato em outras Federações congêneres, levando ao conhecimento o estilo Nagata Ryu. No mesmo ano funda a Associação Brasileira de Karate de Contato (em conjunto com o Shihan Misumi (Shidokan) e Shihan Manuel (Oyama Karate) sendo esta a primeira entidade a regularizada a ter filiados de diferentes estilos de Karate de Contato. A partir da implantação da Associação Brasileira de Karate de Contato muitas pessoas começaram o utilizar a denominação desta modalidade.</p>
            <img src="https://i.imgur.com/QFCqvyh.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/QFCqvyh.jpeg")} />
            <p>Em 1995 viajou para a Argentina para participar de eventos e contactar entidades congêneres. Em 1995 começou a formular o Kickboxing Nagata Ryu através de experiência pessoais.</p>
            <p>Em 1996 viajou ao Chile para participar de evento e contactar entidades congêneres. Em 1996 fundou a Federação Paulista de Kakutô Karate, para dar suporte aos eventos de Karate e aos filiados também. Obtiveram a vinculação dos seguintes estilos internacionais: Oyama (Shihan Manoel Gomes da Silva), Shidokan (Shihan Michio Misumi), Daido Juku (Sensei Edilton Garcia), Daido Juku Chile (Shihan Cristian Martinez), e muitos estilos nacionais de Karate de Contato.</p>
            <p>Em 1997 promoveu em Sorocaba / SP o Paulista Open de Kakutô Karate, sucesso que culminou na implantação definitiva desta Federação dos Estados Unidos. Em 1998 viajou aos Estados Unidos para participar do Ultimate Test Championship em Atlantic City e contactar entidades congêneres. Aproveitando a oportunidade consegue o 3º lugar no Kobudô, com a arma SAI.</p>
            <p>Em 1999 recebeu o convite da International Karate Organization Kyokushinkaikan – IKO Matsushima para representar o Karate Kyokushinkaikan no Brasil. Foi nomeado Branch Chief e funda a Confederação Brasileira de Kyokushinkaikan Karate. Começa a divulgar sua representatividade e trabalhos antes ao Karate Kyokushinkaikan.</p>
            <img src="https://i.imgur.com/9TVxw6o.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/9TVxw6o.jpeg")} />
            <p>Em 2000 viajou à várias cidades do Brasil para ministrar Curso e demonstrações do Karate Kyokushinkaikan para implantação definitiva da IKO-Matsushima. Organizou pequenos núcleos de grupos simpatizantes do Karate Kyokushinkaikan em diversas regiões. Em 2000 algumas das filiais do estilo Nagata Ryu passam para o estilo Kyokushinkaikan, todos tiveram que prestar um novo exame técnico, visto que houve mudanças tanto na teoria como na prática.</p>
            <p>Em 2000 fez alteração nos estatutos da Organização denominando Confederação Brasileira de Kyokushinkaikan Karate & Kickboxing. Com o advento do Kickboxing Kyokushinkaikan, começa a obter filiações a esta modalidade de Thai Boxing. Em 2001 viajou ao Uruguai para participar de eventos e contactar entidades congêneres. Em 2001 começou a treinar Jiu Jitsu, sob a tutela de Professor Herman Gutierrez, subordinado ao Mestre Octávio de Almeida Junior.</p>
            <p>Em 2002 começou a participar de eventos de Jiu Jitsu e consegue ótimos resultados. Em 2003 conquista a faixa azul em Brazilian Jiu Jitsu, reconhecido pela Federação Paulista de Jiu Jitsu. Em 2002 culmina com a implantação definitiva do Kyokushinkaikan Karate no Brasil, vindo a visitar na matriz o atleta canadense Diego Beltran (6º Colocado no Campeonato Mundial Kyokushin 2000).</p>
            <p>Em 2003 viajou ao Chile para contactar entidades congêneres e vincular 02 academias a IKO-Matsushima. Em 2003 recebeu a visita dos Chilenos Cláudio Toledo e Mariano Gaston, vindo a estagiar e competir em nosso eventos. No dia 06 de Abril de 2003 realizou o Primeiro Evento de Karate Kyokushinkaikan, a 1ª Copa Kyokushinkaikan Karate, na cidade de Caraguatatuba–SP, sob a supervisão da Confederação Brasileira de Kyokushinkaikan Karate & Kickboxing.</p>
            <p>Em 2010 fez alteração nos estatutos da Organização denominando Confederação Brasileira de Kyokushinkaikan Karate, Thai-Kickboxing & Mixed Martial Arts.</p>
            <img src="https://i.imgur.com/sjnQ488.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/sjnQ488.jpeg")} />
            <p>Em 2015 funda a SAIKO – South American IKO Matsushima Karate Organization, na cidade de Tomé / Concepcion – Chile englobando os Países Brasil, Chile e Peru. A intenção é a união dos professores IKO Matsushima, realização de eventos: Sulamericano e futuramente Panamericano. Em 2023 desfilia-se a IKO Matsushima e filia-se a International Karate Organization World Kyokushinkaikan do Daihyo Ryuko Take.</p>
            <p>Em 2023 cria o Cursos em EAD do Karate Kyokushinkaikan, do Kickboxing Kyokushinkaikan, Arbitragem em Kumite & Kata Kyokushinkaikan, Terminologias tailandesas do Muaythai. Em 2023 lança o livro "A enciclopédia do Karate Kyokushinkaikan" com 500 páginas e mais de 1.000 fotos, um fato inédito no Brasil e na história do Kyokushinkaikan. Em 2024 cria conteúdo para o Youtube no canal da World Kyokushinkaikan Brasil onde divulga as técnicas e pensamentos do Shihan José Koei Nagata, levando o legado adiante.</p>
            <p>Continuo a trilhar o caminho do guerreiro, não importando com as condições e as pressões à qual é submetido. Triunfará em prol do desenvolvimento do KARATE, KICKBOXING, MUAYTHAI, KOBUDÔ E MIXED MARTIAL ARTS.</p>
            <p>Esta é uma pequena história do Shihan José Koei Nagata pois ainda há muita coisa pra acontecer.</p>
            <p>Vamos avante ! Osu !</p>
            <img src="https://i.imgur.com/6pcnKdY.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/6pcnKdY.jpeg")} />
            <h2 className="text-3xl font-bold mb-4"><em>Shihan Kojem Nagata & Shihan Eisho Nakaza</em></h2>

            <h3 className="text-3xl font-bold mb-4"><em>A HISTÓRIA DO KYOKUSHINKAIKAN NO BRASIL SHIHAN EISHO NAKAZA</em></h3>
            <h3><em>Escrito por José Koei Nagata, em 07 de Maio de 2016 em Sorocaba/SP</em></h3>

            <p>Pouca gente conhece, mas a história da implantação do Kyokushinkaikan Karate no Brasil está relacionada não somente a uma única pessoa e sim a outros Mestres que ajudaram a difundir o estilo. Um dos mestres à qual tive o privilégio de conhecer e ter me formado na faixa preta é o SHIHAN EISHO NAKAZA.</p>
            <img src="https://i.imgur.com/K4wKtJK.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/K4wKtJK.jpeg")} />
            <h2 className="text-3xl font-bold mb-4">Homenagem</h2>
            <p>Após árduo treinamento e conquistas, não poderia deixar de mencionar este ícone do Kyokushinkaikan Karate, que foi perseguido, não teve como se defender e ter uma honraria prestada. Por isso em nome da história do Kyokushinkaikan Karate do Brasil, e pelos discípulos diretos e indiretos, e pela justiça, homenageio este grande Shihan e percursor de meu trabalho aqui estabelecido. Osu !</p>
            <img src="https://i.imgur.com/zxfgSfN.jpeg" alt="Shihan Jose Koei Nagata" className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105" onClick={() => handleImageClick("https://i.imgur.com/zxfgSfN.jpeg")} />
          </div>
        </section>
        {/* GALERIA */}
        <section id="galeria" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-2">Galeria de Fotos</h2>
          <p>Confira algumas imagens representando a trajetória e prática do Kyokushinkaikan.</p>
          <Gallery images={galeriaImagens} />
        </section>
      </main>
    </PageWithSidebar>
  );
};

export default Kyokushinkaikan;
