import React, { useState } from "react";
import YoutubeEmbed from "../components/YoutubeEmbed";
import ParallaxBackground from "../components/ParallaxBackground";

const Kyokushinkaikan = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const menuItems = [
    { label: "Inicio", target: "inicio" },
    { label: "História", target: "historia" },
    { label: "Filosofia", target: "filosofia" },
    { label: "Fundadores", target: "fundadores" },
    { label: "Galeria", target: "galeria" },
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Menu lateral/topo - sem marca d'água */}
      <aside className="w-full md:w-48 bg-gray-100 p-4 shadow-md md:h-screen sticky top-0 z-10">
        <nav>
          <ul className="flex md:flex-col justify-around">
            {menuItems.map((item) => (
              <li
                key={item.target}
                className="mb-2 md:mb-4 cursor-pointer text-blue-600 hover:underline text-sm md:text-base"
                onClick={() => scrollToSection(item.target)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 relative">
        {/* Componente Parallax */}
        <ParallaxBackground imageUrl="https://i.imgur.com/vF5SgMB.png" />

        {/* Conteúdo principal */}
        <main className="flex-1 p-8 space-y-16 bg-white bg-opacity-90">
          {" "}
          {/* Fundo semi-transparente para melhor legibilidade */}
          {/* Seção: História */}
          <section id="inicio" className="space-y-4">
            <h1 className="text-3xl font-bold mb-4">Karate Kyokushinkaikan</h1>
            <p>
              Para você saber o que é o Karate Kyokushinkaikan, primeiramente
              você deve conhecer o Mentor deste estilo o Sosai Masutatsu Oyama,
              depois conhecer quem difundiu no Brasil e os mestres introdutores.
            </p>
            <h2 className="text-3xl font-bold mb-4">Sosai Masutatsu Oyama</h2>

            <img
              src="https://i.imgur.com/4JqAODo.jpg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <h3 className="text-3xl font-bold mb-4">
              HISTÓRICO DO SOSAI MASUTATSU OYAMA E DE SEU ESTILO DE KARATE:
              KYOKUSHINKAIKAN
            </h3>

            <p>
              Logo após a Segunda Guerra Mundial, ainda durante a ocupação do
              Japão pelos aliados, os espectadores de um Torneio de Karate
              levado a público pelos japoneses no "Sanno Hotel" de Tóquio
              presenciaram uma cena que nunca mais esqueceriam. Terminado o
              último combate, dois homens passaram a discutir em pleno tablado:
              um japonês magro e alto, que estava lívido de furor, e um coreano
              rijo e troncudo, que não demonstrava maiores preocupações.
            </p>
            <p>
              De repente o japonês saca um punhal oculto por trás de seu
              cinturão e rasga vivamente o ar em direção ao coreano. Num
              milésimo de segundo o braço do atacante é interceptado e um
              poderosíssimo soco reverso esmaga-lhe o rosto. Ouvisse um ruído de
              ossos quebrados e o agressor está no chão, agora salpicado por
              pequenas poças vermelhas. O homem estava morto, esfacelado por um
              único golpe! Esse episódio constituiu-se no ponto decisivo da
              carreira marcial de um jovem, então com 24 anos, que mais tarde
              adotaria o nome de Masutatsu (Mas) Oyama e que se tornaria
              mundialmente famoso. Sosai Masutatsu Oyama seguiu meteórica e
              tumultuada carreira nas artes de combate. Criança ainda aprendia
              Chabee (uma combinação coreana de Jujitsu e Kempo) na escola que
              frequentava dos 9 aos 13 anos passou a praticar diariamente tanto
              o Chabee quanto o Boxe Shaolim na propriedade de seu pai, sob a
              orientação de um fazendeiro do norte da Coréia.
            </p>
            <p>
              Em 1937, por ocasião da guerra entre o Japão e a China começou a
              estudar Karate Shotokan, persistindo nesse estilo por dois anos.
              Não satisfeito, matriculou-se na Takushuko University para
              aperfeiçoar seu Karate, treinando por mais dois anos no distrito
              de Meijiro, Tóquio, onde Gichin Funakoshi ensinava.
            </p>
            <img
              src="https://i.imgur.com/trpesGt.jpg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/trpesGt.jpg")
              }
            />
            <p>
              No auge do conflito entre Japão/ Estados Unidos e Grã Bretanha,
              aos 18 anos Sosai Oyama entrava para o Exercito Imperial e
              juntava-se a Butokukai - Organização Governamental que compreendia
              todas as principais artes marciais. Tornou-se então um membro da
              Kokai, especializando-se em táticas de espionagem e guerrilha.
              Sosai Oyama veio a ser aluno de Cho Yung Ju e de Tenshichiro
              Ozawa, com quem se submeteu a um "treinamento mental"
            </p>
            <p>
              Foi quando decidiu levar uma vida solitária nas montanhas,
              praticando Karate 7 horas por dia, aperfeiçoando suas técnicas e
              culminando na criação de um estilo que veio a chamar formalmente
              de Kyokushinkaikan, em 1961. A partir de 1952 e durante 10 anos,
              Sosai Masutatsu Oyama excursionou por quase todo o mundo,
              demonstrando seu estilo e propagando sua arte.
            </p>
            <p>
              Sua rede internacional expandira-se por 43 países (em 180
              ramificações) e sua obra contava ainda com a publicação de 12
              livros (dos quais 6 no idioma japonês), sendo o mais famoso deles
              "What is Karate?" com 170 mil exemplares vendidos até 1960.
            </p>
            <p>
              Possuidor de descomunal força física, Sosai Oyama ficou famoso
              pelas suas técnicas de quebramento: partia mais de 30 telhas, além
              de tijolos e pedras com uma única pancada descendente e matava
              touros também com um só golpe. Sosai Masutatsu Oyama esteve no
              Brasil por 03 vezes, visitando academia e como convidado em
              Torneios Sulamericanos.
            </p>
            <p>
              Infelizmente e para pesar de todos os praticantes de artes
              marciais um mês depois de diagnosticado um câncer pulmonar Sosai
              Masutatsu Oyama veio a falecer no dia 26 de abril de 1994 aos 70
              anos de idade.
            </p>

            <h3 className="text-3xl font-bold mb-4">
              SOSAI MASUTATSU OYAMA O ÚLTIMO DOS GIGANTES
            </h3>

            <p>
              Sosai Oyama nasceu na Coréia em 27 de Julho de 1923 e recebeu o
              nome de Hyung Yee. Só mais tarde, quando decide dedicar sua vida
              ao Karate que adota o nome japonês de "Masutatsu Oyama", que
              significa "elevação da alta montanha". Na sua terra natal, o jovem
              Hyung Yee descobre bem cedo as artes marciais locais, notadamente
              o Tae-Kyon e o Tae-Kwon-Pup. Estas duas disciplinas seriam depois
              combinadas para dar nascimento ao Tae-kwondo. Ainda em seu País,
              Sosai Oyama estuda também diferentes formas de Kenpo Chinês e
              Japonês. Nessa época, o principal modelo humano de Sosai Oyama
              "Otto Von Bismarck","o unificador da Alemanha": Sempre tive o
              desejo de ser o Bisrnarck do Oriente, saí de casa aos 13 anos e
              fui para Tóquio".
            </p>
            <p>
              Em Tóquio, Sosai Oyama pratica de início o Judô no Kodokan -
              Centro Mundial dessa arte. Em 1938 matricula-se na escola de
              Karate Shotokan, dirigida por Gichin Funakoshi e seu filho
              Yoshitaka: "Pratiquei o Karate Shotokan... mas já duvidava de sua
              abordagem linear. E não gostava da idéia de controlar minhas
              técnicas. Era rígido demais para mim, então parti..."
            </p>
            <img
              src="https://i.imgur.com/70XTKOp.jpg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/70XTKOp.jpg")
              }
            />
            <p>
              Sosai Oyama deixa o Dojo Shotokan em 1940, depois de ter
              trabalhado cerca de um ano e meio. Partiu depois que Yoshitaka,
              filho do fundador, é derrotado por um expert do Goju-Ryu.
            </p>
            <p>
              De qualquer forma, a maioria dos experts japoneses mais
              conhecidos, em um momento ou outro, haviam passado pelo Shotokan e
              Sosai Oyama não seria exceção. Deixando Sensei Funakoshi, Sosai
              Oyama torna-se discípulo de So Neishu. Este, de origem coreana
              (seu nome anterior era Cho Hyung Ju), tinha pôr mestre Sensei
              Gogen Yamaguchi, fundador da ramificação japonesa do Karate-Dô
              Goju-Ryu, e era membro da organização Nichiren-Shô-Shu. É por seu
              intermédio que Sosai Oyama estudaria o Zen. No Karate, o que conta
              sempre mais que as técnicas ou a força é o elemento espiritual que
              permite ao indivíduo mover-se e agir em plena liberdade.
            </p>
            <img
              src="https://i.imgur.com/7bzqy2n.jpg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/7bzqy2n.jpg")
              }
            />
            <p>
              Para se alcançar a boa atitude de espírito, a meditação Zen é
              muito importante. Quando dizemos que essa meditação implica em um
              estado de impassividade e na ausência total de pensamento,
              queremos dizer que através dessa meditação podemos vencer a emoção
              e o pensamento, e dar a nossas capacidades um curso mais livre que
              nunca. O homem que quer seguir o caminho do Karate não pode
              negligenciar o Zen e o aperfeiçoamento espiritual".
            </p>
            <p>
              Sob os conselhos de So Neishu, Sosai Oyama estuda durante algum
              tempo sob a direção do próprio Yamaguchi. Em 1947, vence o All
              Japan Karate Championship que teve lugar em Kyoto, no Karuyama
              Gimmasium.
            </p>

            <h3 className="text-3xl font-bold mb-4">UM EXÍLIO VOLUNTÁRIO</h3>

            <p>
              Em 1948, depois de ter passado alguns meses na prisão, Sosai Oyama
              se impõe um exílio voluntário de 18 meses, no monte Kiyosumi,
              distrito de Chiba: “Quando estava na prisão, depois da Segunda
              Guerra Mundial, ciente de não estar qualificado para ensinar ou
              para trabalhar e incerto quanto ao futuro, decidi me dedicar
              exclusivamente ao Karate… Ao ser posto em liberdade dirigi-me
              imediatamente para as florestas retiradas do monte Kiyosumi, onde
              treinei sozinho por um ano e meio. Penso que todos que se dedicam
              à uma causa devem passar por um período de isolamento desse
              gênero.
            </p>
            <img
              src="https://i.imgur.com/dMKYy7Q.jpg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/dMKYy7Q.jpg")
              }
            />
            <p>
              Meu treinamento cotidiano começava bem cedo, com uma sessão de
              purificação espiritual efetuada sob as águas geladas de uma
              cascata. Depois do que eu voltava, correndo, à minha humilde
              moradia para dar prosseguimento ao meu treino. Utilizava tudo que
              a natureza colocava à minha disposição para desenvolver minhas
              condições físicas e minha força Tomava cuidado em não negligenciar
              nenhuma parte do corpo, nenhum aspecto do treinamento. A manhã era
              assim dedicada ao fortalecimento de minhas qualidades musculares e
              funções respiratórias. Corria pelas montanhas, mudava de lugar,
              subia em pedras e troncos de árvores, mergulhava nas torrentes
              geladas. Esse treino matinal terminava com nova sessão de
              meditação.
            </p>
            <p>
              A tarde era dedicada à prática do Karate. Eu havia instalado
              makiwaras nos troncos das árvores e eu os golpeava durante várias
              horas, com os punhos e com os pés. Exercitava-me também no
              quebramento até que o estado de minhas mãos me impedisse de
              continuar.
            </p>
            <p>
              Durante todo o tempo de meu retiro nessas montanhas, nem um dia se
              passava sem que me entregasse ao penoso e violento treinamento,
              fizesse que tempo fizesse. Quando a escuridão caía sobre as
              montanhas, eu podia medir a absoluta profundeza de minha solidão…
              cercado pelas trevas e pelo silêncio, acendia uma vela em minha
              pobre cabana e pendurava na parede uma folha de papel branco sobre
              a qual eu havia traçado dois círculos: o da direita (Sei),
              simbolizava a ação e o da esquerda (Do), simbolizava a
              inatividade.
            </p>
            <p>
              Observando esses dois círculos, entrava em profunda meditação.
              Esse prolongado retiro, longe de toda civilização permitiu-me
              aumentar de maneira considerável o nível de Karate, mas sobretudo
              atingir um estado mental peculiar que não tinha mais nada em comum
              com o de antes…”
            </p>
            <p>
              A medida em que Sosai Oyama toma consciência de suas prodigiosas
              faculdades, um projeto começa a germinar em seu espírito: o de
              realizar uma façanha fora do comum, que provasse a superioridade
              do seu Karate sobre todas as outras formas de combate a mãos nuas.
              Decide finalmente repetir os feitos de certos praticantes de Kempo
              de Okinawa: Abater Touros.
            </p>

            <h3 className="text-3xl font-bold mb-4">DUELO COM TOUROS</h3>

            <p>
              Antes de enfrentar os primeiros touros, Sosai Oyama vai a
              diferentes matadouros da prefeitura de Chiba, a fim de testar seu
              poder de golpe. Depois de várias tentativas cuidadosas, ele
              consegue abater seu primeiro touro. A técnica consistia em
              desferir um golpe de punho direto (tsuki) sobre a fronte do
              animal, entre os olhos, no ponto em que os profissionais exercem a
              pressão com a ajuda de uma marreta e de um martelo.
            </p>
            <p>
              Em 1950, Sosai Oyama enfrenta seu primeiro touro em uma arena. A
              besta dobra sob o efeito do primeiro tsuki mas Sosai Oyama não
              consegue acabar com ela. Tenta um golpe circular com a mão (Shuto
              Mawashi Uchi) e quebra os chifres do animal. Depois disso, no
              Japão e nos Estados Unidos, enfrentaria 52 touros, partindo os
              chifres de 49 e matando os 3 outros. Um desses confrontos foi
              filmado pela Shochiku Motion Picture (Produtora de Filmes).
            </p>

            <h3 className="text-3xl font-bold mb-4">
              ESTADOS UNIDOS E SUDESTE ASIÁTICO
            </h3>

            <p>
              Em 1952, Sosai Oyama é convidado pela U.S.A. Professional
              Wrestling Association, de Chicago (Estados Unidos). Faz-se
              acompanhar do judoca Endo Kokichi, faixa preta 6º Dan e de um
              lutador havaiano apelidado “The Great Togo”.
            </p>
            <p>
              O Wrestling Hall de Chicago era um imenso ginásio que podia
              receber mais de 15.000 pessoas. Naquela noite, estava lotado.
              Great Togo me apresentou ao público. Ele falava inglês e eu não
              entendi uma palavra do que ele disse. Eu devia fazer uma
              demonstração de meus talentos de Karateca, antes da luta-combate
              que deveria se constituir no acontecimento principal da noite. Eu
              havia previsto quebrar de início uma única tábua de madeira de uma
              polegada de espessura, depois duas, três… até quebrar cinco tábuas
              empilhadas umas sobre as outras. Mas quando me apresentaram as
              tábuas surpreendi-me com o tamanho delas: tratava-se na verdade de
              duas tábuas de madeiras de 5 polegadas de espessura cada!
              Compreendi então que a barreira da linguagem poderia me custar
              caro… A primeira tábua quebrou no ato sob o efeito de meu primeiro
              golpe e Endo me perguntou se eu queria continuar. Ele segurou a
              segunda tábua com ambas as mãos e recuou um passo para firmar sua
              posição.
            </p>
            <p>
              Era a primeira vez que eu tentava quebrar uma madeira tão espessa,
              mantida verticalmente… Após breve instante de concentração quebrei
              essa segunda tábua com um único tsuki. Devia efetuar a quebra
              seguinte em tijolos. Mas ignorava-me que os tijolos americanos
              eram bem mais duros que os tijolos japoneses, além disso, não
              havia nenhum suporte rígido sobre o qual dispô-los e o chão era
              coberto por espesso e macio tapete. Golpeei a primeira vez em
              Shuto, sem sucesso. Fiz nova tentativa, de resultado idêntico…
              Decidi então tomar mais tempo para me concentrar e estranha calma
              começou a me invadir. A cólera e a impaciência deixaram aos poucos
              meu espírito, enquanto nova força me penetrava… Consegui! Fui
              ovacionado como jamais o fora antes.
            </p>
            <p>
              Voltando ao vestiário, encontrei um homem que me esperava… Ele
              examinou minha mão direita com atenção e disse: “Queria que as
              mãos de meu filho fossem tão fortes como esta”. Esse homem era
              Jack Dempsey, um dos maiores pugilistas de todos os tempos. Após
              essa demonstração, na turnê que empreendem pelos Estados Unidos,
              Endo e Sosai Oyama tomam respectivamente os nomes de”Ko
              Togo”(Pequeno Togo) e “Mas Togo”. Entre 1952 e 1954, Sosai Oyama
              efetuaria mais de 200 demonstrações e aceitaria vitoriosamente
              numerosos desafios contra lutadores e pugilistas: “Na verdade, eu
              não tinha vontade de partir nessa turnê. Desgostava-me aceitar
              dinheiro em demonstração de Budô, mas era preciso viver e me
              ofereciam 100 dólares por semana, todas as despesas pagas. Para o
              período pós-guerra, no Japão, era uma fortuna… Ah! eu era muito
              forte nesse tempo. Teria podido ser campeão de atletismo, mas tudo
              que me interessava era o Karate”.
            </p>

            <img
              src="https://i.imgur.com/SNZ5ZN0.jpg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/SNZ5ZN0.jpg")
              }
            />

            <p>
              Um dos objetivos de minha viagem pelo Sudeste Asiático era testar
              a eficiência do Thai Boxing como método de autodefesa… Black Cobra
              era um lutador perfeitamente confiante de suas capacidades em
              enfrentar um Karateca. Eu não tinha dúvidas de que ele era rápido
              e poderoso! Suas técnicas de pernas eram notáveis e perigosamente
              eficientes. Varias vezes ele tentou me atingir na cabeça com
              chutes circulares. Ele tinha também excelente disparo de golpe e
              não hesitava em saltar sobre mim cada vez que via urna
              oportunidade… Possuía um sentido espantoso de equilíbrio e ainda
              que tivesse falhado em suas tentativas de chutes, não perdeu por
              um instante sequer a posição, o que é raro nesse tipo de técnica.
            </p>

            <img
              src="https://i.imgur.com/vCFTJu4.jpg"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/vCFTJu4.jpg")
              }
            />

            <p>
              Durante os primeiros minutos do combate, eu lhe dei a impressão de
              suportar mais ou menos seus ataques… Eu precisava encontrar a
              abertura e o momento favorável… Finalmente consegui encaixar um
              ataque no queixo, de mão em faca. Encadeei imediatamente um chute
              no corpo. Ambos caímos… mas eu fui o único a levantar! Apesar de
              tudo, eu não ficara inteiramente satisfeito com minha vitória.
              “Precisava melhorar minha capacidade de encadear técnicas de
              braços e pernas…”.
            </p>

            <h3 className="text-3xl font-bold mb-4">
              A ORGANIZAÇÃO INTERNACIONAL KYOKUSHINKAIKAN KARATE
            </h3>

            <p>
              Em 1957, Sosai Oyama funda a International Karate Organization
              Kyokushinkaikan (Associação da Extrema Verdade), em margem a
              outras organizações japonesas de Karate. Sosai Oyama detestava o
              “Business-Karate” e os permanentes desentendimentos da Japan
              Karate Association: Na época do primeiro campeonato mundial,
              decidi manter as competições no Ginásio destinado a Artes Marciais
              (Budo-kan) em Tóquio, porque de todos os imóveis disponíveis era o
              único capaz de acomodar mais de 10 mil espectadores que sabíamos
              viriam assistir as competições (em outra ocasião usamos um Ginásio
              Municipal com capacidade para 1.300 pessoas).
            </p>
            <p>
              O recinto lotou e cerca de 5 mil pessoas viram-se impedidas de
              entrar, na porta, por falta de espaço. Entretanto, notificaram-nos
              que o Ginásio Budo-kan não nos iria ser alugado. Corri para saber
              o motivo e ouvi de um jovem empregado, que nosso pedido havia sido
              recusado por acharem que o Karate Kyokushinkaikan não era um
              Karate legítimo. Perguntei então que justificativa havia para isso
              e o serviçal me disse que era o numero de adeptos de uma escola de
              Karate que determinava sua legitimidade.
            </p>

            <img
              src="https://imgur.com/OcLndhu.png"
              alt="História Kyokushinkaikan"
              className="mx-auto cursor-pointer w-104 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() => handleImageClick("https://imgur.com/OcLndhu.png")}
            />

            <p>
              O recinto lotou e cerca de 5 mil pessoas viram-se impedidas de
              entrar, na porta, por falta de espaço. Entretanto, notificaram-nos
              que o Ginásio Budo-kan não nos iria ser alugado. Corri para saber
              o motivo e ouvi de um jovem empregado, que nosso pedido havia sido
              recusado por acharem que o Karate Kyokushinkaikan não era um
              Karate legítimo. Perguntei então que justificativa havia para isso
              e o serviçal me disse que era o numero de adeptos de uma escola de
              Karate que determinava sua legitimidade.
            </p>
            <p>
              Acrescentou que considerava determinada escola verdadeiramente
              legítima e ficou muito embaraçado quando lhe fiz notar que o maior
              número de público que aquela escola era capaz de reunir em
              Torneios e Campeonatos era cerca de 3 mil pessoas, enquanto o
              Karate Kyokushinkaikan atraia mais de 10 mil pessoas. Percebendo
              que o número de publico não ia justificar a recusa do Budo-kan, o
              interlocutor me disse que não podia nos alugar a sala porque
              durante nossos Torneios derramava-se sangue. Mas sangue era também
              derramado nas competições de Boxe que o Budo-kan nunca havia
              hesitado em permitir nas suas dependências. Mais tarde, verifiquei
              que um poderoso dirigente de outra associação de Karate estava por
              trás desse incidente. Alguns anos antes, havia nos oferecido uma
              grande ajuda financeira se nossa organização se filiasse a tal
              associação, mas eu recusara… ”
            </p>

            <h3>PRIMEIRA PUBLICACÃO – PRIMEIROS ENCONTROS</h3>

            <p>
              Em 1958, Sosai Oyama publica seu primeiro livro: “What is
              Karate?”. O sucesso fulgurante dessa obra o levará a publicar mais
              tarde “This is Karate” (1965) e “Karate, The World of the
              Ultimate” (1984). Também em 1958, Edward Bobby Lowe cria a
              ramificação havaiana da Kyokushin-kai e no ano seguinte organiza
              em Honolulu o primeiro torneio oficial de Karate Kyokushin, o
              First Hawai Karate Tournament. Nessa ocasião, Sosai Oyama efetua
              pessoalmente uma demonstração de Kata e quebramento. Em 1960, o
              segundo torneio havaiano já conta com a participação de 16 países.
              Em 1962, é organizado no Madison Square Garden de Nova York o
              primeiro North America Open Karate Tournament, vencido por Gary
              Alexander.
            </p>
            <p>
              Em 1964, a organização Kyokushinkaikan ocupa espaço na crônica
              internacional ao aceitar um desafio lançado por lutadores
              tailandeses. A escola de Sosai Oyama é a única a aceitar e delega
              3 de seus representantes para ir a Bangkok. Três lutadores
              viajaram até a Tailândia para desafiar os Tailandeses, os combates
              terminaram em 2×1 para os Japoneses, Tadashi Nakamura e Akio
              Fujihira (conhecido como Noboru Osawa) venceram. Nessa mesma
              noite, o único perdedor foi Kenji Kurosaki, que futuramente
              recebeu o título de “Rachaderman” após ter realizado mais de 120
              lutas na Tailândia, tornando-se o percussor do Kickboxing no
              Japão, formando inclusive uns dos melhores lutadores da época como
              Toshio Fujiwara. Kenji Kurosaki descende de família de Samurais,
              fundou seu próprio Dojo chamado “Mejiro GYM”, e por ter
              divergências com Osamu Noguchi pelo título de criador do
              Kickboxing Japonês, resolveu criar seu próprio estilo conhecido
              com “Shin Kakuto Jutsu” (Nova Arte de Combate).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <YoutubeEmbed embedId="9zpMAVcvH5Q" />
            </div>

            <p>
              E somente em 1969 que se organiza em Tóquio o primeiro All Japan
              Open Karate Tournament. Esse torneio e vencido por Yamazaki
              Terutomo, enquanto Soeno Yoshiji (futuro fundador do Shidokan) se
              classifica em segundo lugar e Hasegawa Kazuyuki em terceiro. No
              ano seguinte, Hasegawa é o primeiro, Yamazaki o segundo e Soeno o
              terceiro. Depois, os vencedores desse torneio serão: Sato Katsuaki
              (1971), Miura Miyuki (1972), Royama Hatsuo (1973), Sato Katsuaki
              (1974), Sato Katsuaki (1975), Sato Toshikazu (1976), Azuma Takashi
              (1977), Ninomiya Joko (1978), Nakamura Makoto (1979), Sanpei Keiji
              (1980), Sanpei Keiji (1981), Sanpei Keiji (1982), Onishi Yasuto
              (1983), Kurosawa (1984), Matsui Akiyoshi (1985), Matsui Akiyoshi
              (1986), Yasuhiko Kuwajima (1988), Yamaki Kenji (1989), Akira
              Matsuda (1990), Yoshihiro Tamura (1992), Kazumi Hajime (1993),
              Yamaki Kenji (1994), Kazumi Hajime (1996), etc.
            </p>
            <p>
              Em 1972, Sosai Oyama ocupa novamente a crônica internacional.
              Nesse ano, uma equipe japonesa (independente da IKO e da
              Kyokushinkaikan) participa de maneira desastrosa de uma competição
              organizada em Paris. Sosai Oyama insiste no caráter duvidoso desse
              confronto, denuncia as regras de “não contato” em vigor nessa
              competição e lembra a total ausência de representatividade da
              equipe japonesa presente na França.
            </p>
            <p>
              Em 1975, a I.K.O. organiza em Tóquio seu primeiro World Open
              Karate Tournament, vencido por Katsuaki Sato. Hoje a organização
              Kyokushinkaikan esta presente em mais de 130 países. Todos os
              anos, em cada um desses países, desenvolvem-se as competições
              regionais e nacionais que preparam os competidores para o torneio
              mundial de Tóquio, a cada 4 anos. “Aparentemente todo mundo quer
              ver o Karate nos Jogos Olímpicos. Com certeza, para o Karate
              esportivo seria muito bom. Mas o problema é como entrar. Há tantos
              estilos diferentes. Se aceitarem a modalidade, seria preciso que
              fosse em 4 categorias: peso pluma, médio, pesado e categoria
              aberta. Mas tudo isso não é Budô e para o verdadeiro budoka não
              tem nenhuma importância”. Katsuaki.
            </p>

            <h2 className="text-3xl font-bold mb-4">Shihan Jose Koei Nagata</h2>

            <img
              src="https://i.imgur.com/RNx7uBF.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p>
              Iniciou-se nas Artes Marciais aos 13 anos de idade, em 1980 na
              Academia de Karate Oyama Kyokushinkaikan, na cidade de Sorocaba,
              obtendo instrução com Shihan Mayuki Mizukoshi, Faixa Preta 4º Dan.
            </p>

            <img
              src="https://i.imgur.com/I6vDIXb.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p>
              Após árduos treinamentos, aos 16 anos conquista a faixa marrom e
              auxilia o Sensei Agenor Oliva de Moraes 1º Dan a ministrar aulas.
            </p>

            <p>
              Por razões políticas, filia-se ao Shihan Eisho Nakaza, faixa Preta
              4º Dan de Kyokushinkaikan Karate. Por ser franzino, mas técnico,
              presta o Exame de Faixa Preta, sendo reprovado na parte de Kumite
              em 1984 (nocauteado na costela).
            </p>

            <p>
              Mesmo assim continua a treinar firme, sempre objetivando
              conquistar a faixa preta e um dia poder ministrar aula. Em 30 de
              Julho de 1982 em conjunto com seu pai (Shihan Kojem Nagata),
              inaugura em Sorocaba a Academia de Karate Oyama Kyokushinkai,
              vinculada ao Shihan Eisho Nakaza.
            </p>

            <img
              src="https://i.imgur.com/fo3Vytk.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p>
              Em 30 de Julho de 1982 em conjunto com seu pai (Shihan Kojem
              Nagata), inaugura em Sorocaba a Academia de Karate Oyama
              Kyokushinkai, vinculada ao Shihan Eisho Nakaza.
            </p>

            <img
              src="https://i.imgur.com/AdnpZaB.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p>
              Começa a ministrar aulas e assim passar o seu conhecimento do
              Kyokushinkaikan Karate.
            </p>

            <p>
              Em 1984 por razões políticas, Shihan Eisho Nakaza desliga-se do
              Kyokushin e funda o seu estilo próprio, denominado de Nakaza Juku.
            </p>

            <p>
              Em 1985 presta novo Exame de Faixa, sendo aprovado para Faixa
              Preta 1º Dan, sob a tutela do Shihan Eisho Nakaza.
            </p>

            <p>
              Em 1986 Shihan Eisho Nakaza por problemas familiares retorna ao
              Japão.
            </p>

            <p>
              Em 1986 desvinculamos do estilo Nakaza Juku e fundamos a
              Associação Nagata de Artes Marciais.
            </p>
            <p>
              Em 1988 graduou-se em Licenciatura Plena em Educação Física pela
              Faculdade de Educação Física de Sorocaba.
            </p>
            <p>
              Em 1988 seu Pai (Shihan Kojem Nagata) nomea-o com Instrutor-Chefe
              da AssociaçãoNagata de Artes Marciais.
            </p>
            <p>
              Em 1989 elaborou toda a parte técnica, física e espiritual que
              culminaria na criação do Budô Karate Nagata Ryu.
            </p>

            <img
              src="https://i.imgur.com/hrEVnki.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p>
              Em 1990 realizou eFull Contactm Sorocaba o 1º Torneio Budô Nagata
              Ryu de Contato Marcial, com a presença de 300 atletas.
              Participaram atletas de Karate, Kung-Fu e Hapkido, competindo nas
              regras do Karate Kyokushinkaikan.
            </p>

            <img
              src="https://i.imgur.com/t2AcVLU.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p>
              Em 1990 começou a treinar o Full Contact e participou do
              Campeonato Brasileiro de Full Contact obtendo o 3º lugar na
              categoria Peso Pluma.
            </p>
            <p>
              Em 1991 o estilo Nagata Ryu expande-se e começa a surgir às
              primeiras filiais vinculadas: Boituva, Mogi Guaçu, Mogi Mirim,
              Bahia, Minas Gerais, Rondônia, Alagoas e Amazonas.
            </p>
            <p>
              Em 1992 começa a ter o reconhecimento de outras entidade
              desportivas marciais como: United States Karate Association (USA),
              United States Karate Association do Brasil, International Okinawa
              Martias Arts Union (Japão) e começo a participar de Torneios de
              Karate Tradicional (Kata e Kobudô), levando ao conhecimentos dos
              dirigentes o estilo “Nagata Ryu”
            </p>

            <img
              src="https://i.imgur.com/S2fK1yH.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p>
              Em 1992 começou a desenvolver o Kobudô Nagata Ryu, pesquisando e
              desenvolvimento técnicas de Bô, Sai, Tonfa, Nunchaku, Kama,
              Espada, etc. Em 1993 ministrou o curso de Kobudô – Arma Tonfa para
              Polícia Militar da Bahia. Em 1994 começou a divulgar o Karate de
              Contato em outras Federações congêneres, levando ao conhecimento o
              estilo Nagata Ryu.
            </p>

            <img
              src="https://i.imgur.com/qNwww99.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p>
              Em 1993 ministrou o curso de Kobudô – Arma Tonfa para Polícia
              Militar da Bahia. Em 1994 começou a divulgar o Karate de Contato
              em outras Federações congêneres, levando ao conhecimento o estilo
              Nagata Ryu.
            </p>
            <p></p>
            <p>
              Em 1994 começou a divulgar o Karate de Contato em outras
              Federações congêneres, levando ao conhecimento o estilo Nagata
              Ryu. No mesmo ano funda a Associação Brasileira de Karate de
              Contato (em conjunto com o Shihan Misumi (Shidokan) e Shihan
              Manuel (Oyama Karate) sendo esta a primeira entidade a
              regularizada a ter filiados de diferentes estilos de Karate de
              Contato. A partir da implantação da Associação Brasileira de
              Karate de Contato muitas pessoas começaram o utilizar a
              denominação desta modalidade.
            </p>

            <img
              src="https://i.imgur.com/QFCqvyh.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p>
              Em 1995 viajou para a Argentina para participar de eventos e
              contactar entidades congêneres. Em 1995 começou a formular o
              Kickboxing Nagata Ryu através de experiência pessoais.
            </p>
            <p>
              Em 1996 viajou ao Chile para participar de evento e contactar
              entidades congêneres. Em 1996 fundou a Federação Paulista de
              Kakutô Karate, para dar suporte aos eventos de Karate e aos
              filiados também. Obtiveram a vinculação dos seguintes estilos
              internacionais: Oyama (Shihan Manoel Gomes da Silva), Shidokan
              (Shihan Michio Misumi), Daido Juku (Sensei Edilton Garcia), Daido
              Juku Chile (Shihan Cristian Martinez), e muitos estilos nacionais
              de Karate de Contato.
            </p>
            <p>
              Em 1997 promoveu em Sorocaba / SP o Paulista Open de Kakutô
              Karate, sucesso que culminou na implantação definitiva desta
              Federação dos Estados Unidos. Em 1998 viajou aos Estados Unidos
              para participar do Ultimate Test Championship em Atlantic City e
              contactar entidades congêneres. Aproveitando a oportunidade
              consegue o 3º lugar no Kobudô, com a arma SAI.
            </p>
            <p>
              Em 1999 recebeu o convite da International Karate Organization
              Kyokushinkaikan – IKO Matsushima para representar o Karate
              Kyokushinkaikan no Brasil. Foi nomeado Branch Chief e funda a
              Confederação Brasileira de Kyokushinkaikan Karate. Começa a
              divulgar sua representatividade e trabalhos antes ao Karate
              Kyokushinkaikan.
            </p>

            <img
              src="https://i.imgur.com/9TVxw6o.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p>
              Em 2000 viajou à várias cidades do Brasil para ministrar Curso e
              demonstrações do Karate Kyokushinkaikan para implantação
              definitiva da IKO-Matsushima. Organizou pequenos núcleos de grupos
              simpatizantes do Karate Kyokushinkaikan em diversas regiões. Em
              2000 algumas das filiais do estilo Nagata Ryu passam para o estilo
              Kyokushinkaikan, todos tiveram que prestar um novo exame técnico,
              visto que houve mudanças tanto na teoria como na prática.
            </p>
            <p>
              Em 2000 fez alteração nos estatutos da Organização denominando
              Confederação Brasileira de Kyokushinkaikan Karate & Kickboxing.
              Com o advento do Kickboxing Kyokushinkaikan, começa a obter
              filiações a esta modalidade de Thai Boxing. Em 2001 viajou ao
              Uruguai para participar de eventos e contactar entidades
              congêneres. Em 2001 começou a treinar Jiu Jitsu, sob a tutela de
              Professor Herman Gutierrez, subordinado ao Mestre Octávio de
              Almeida Junior.
            </p>
            <p>
              Em 2002 começou a participar de eventos de Jiu Jitsu e consegue
              ótimos resultados. Em 2003 conquista a faixa azul em Brazilian Jiu
              Jitsu, reconhecido pela Federação Paulista de Jiu Jitsu. Em 2002
              culmina com a implantação definitiva do Kyokushinkaikan Karate no
              Brasil, vindo a visitar na matriz o atleta canadense Diego Beltran
              (6º Colocado no Campeonato Mundial Kyokushin 2000).
            </p>
            <p>
              Em 2003 viajou ao Chile para contactar entidades congêneres e
              vincular 02 academias a IKO-Matsushima. Em 2003 recebeu a visita
              dos Chilenos Cláudio Toledo e Mariano Gaston, vindo a estagiar e
              competir em nosso eventos. No dia 06 de Abril de 2003 realizou o
              Primeiro Evento de Karate Kyokushinkaikan, a 1ª Copa
              Kyokushinkaikan Karate, na cidade de Caraguatatuba–SP, sob a
              supervisão da Confederação Brasileira de Kyokushinkaikan Karate &
              Kickboxing.
            </p>
            <p>
              Em 2010 fez alteração nos estatutos da Organização denominando
              Confederação Brasileira de Kyokushinkaikan Karate, Thai-Kickboxing
              & Mixed Martial Arts.
            </p>

            <img
              src="https://i.imgur.com/sjnQ488.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p>
              Em 2015 funda a SAIKO – South American IKO Matsushima Karate
              Organization, na cidade de Tomé / Concepcion – Chile englobando os
              Países Brasil, Chile e Peru. A intenção é a união dos professores
              IKO Matsushima, realização de eventos: Sulamericano e futuramente
              Panamericano. Em 2023 desfilia-se a IKO Matsushima e filia-se a
              International Karate Organization World Kyokushinkaikan do Daihyo
              Ryuko Take.
            </p>
            <p>
              Em 2023 cria o Cursos em EAD do Karate Kyokushinkaikan, do
              Kickboxing Kyokushinkaikan, Arbitragem em Kumite & Kata
              Kyokushinkaikan, Terminologias tailandesas do Muaythai. Em 2023
              lança o livro “A enciclopédia do Karate Kyokushinkaikan” com 500
              páginas e mais de 1.000 fotos, um fato inédito no Brasil e na
              história do Kyokushinkaikan. Em 2024 cria conteúdo para o Youtube
              no canal da World Kyokushinkaikan Brasil onde divulga as técnicas
              e pensamentos do Shihan José Koei Nagata, levando o legado
              adiante.
            </p>
            <p>
              Continuo a trilhar o caminho do guerreiro, não importando com as
              condições e as pressões à qual é submetido. Triunfará em prol do
              desenvolvimento do KARATE, KICKBOXING, MUAYTHAI, KOBUDÔ E MIXED
              MARTIAL ARTS.
            </p>
            <p>
              Esta é uma pequena história do Shihan José Koei Nagata pois ainda
              há muita coisa pra acontecer.
            </p>
            <p>Vamos avante ! Osu !</p>

            <img
              src="https://i.imgur.com/6pcnKdY.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p>A História da WKK – Brasil</p>
            <p>O Representante brasileiro – Shihan Nagata</p>
            <p>As Academias e os Faixas Pretas</p>
            <p>Parte Técnica 1</p>
            <p>Parte Técnica 2</p>
            <p>Parte Técnica 3</p>
            <p>Diversos</p>
            <p>Notícias</p>
            <p>Contato</p>

            <img
              src="https://i.imgur.com/zxfgSfN.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p>Sosai Masutatsu Oyama</p>
            <p>Shihan José Koei Nagata</p>
            <p>Os Mestres do Brasil</p>
            <p>O Histórico</p>
            <p>Parte Técnica 1</p>
            <p>Parte Técnica 2</p>
            <p>Parte Técnica 3</p>
            <p>Graduação no Kyokushinkaikan</p>
            <p>Download Kyokushinkaikan</p>
            <p>Academias Filiadas</p>
            <p>Diversos</p>
            <p>WKK – Brasil</p>

            <img
              src="https://i.imgur.com/apRXa3D.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />
            <h2 className="text-3xl font-bold mb-4">
              <em>
                A HISTÓRIA DO KYOKUSHINKAIKAN NO BRASIL SHIHAN EISHO NAKAZA
                Escrito por José Koei Nagata, em 07 de Maio de 2016 em
                Sorocaba/SP
              </em>
            </h2>
            <p>
              Pouca gente conhece, mas a história da implantação do
              Kyokushinkaikan Karate no Brasil está relacionada não somente a
              uma única pessoa e sim a outros Mestres que ajudaram a difundir o
              estilo. Um dos mestres à qual tive o privilégio de conhecer e ter
              me formado na faixa preta é o SHIHAN EISHO NAKAZA.
            </p>
            <img
              src="https://i.imgur.com/K4wKtJK.jpeg"
              alt="Shihan Jose Koei Nagata"
              className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/K4wKtJK.jpeg")
              }
            />

            <h2 className="text-3xl font-bold mb-4">Homenagem</h2>

            <p>
              Após árduo treinamento e conquistas, não poderia deixar de
              mencionar este ícone do Kyokushinkaikan Karate, que foi
              perseguido, não teve como se defender e ter uma honraria prestada.
              Por isso em nome da história do Kyokushinkaikan Karate do Brasil,
              e pelos discípulos diretos e indiretos, e pela justiça, homenageio
              este grande Shihan e percursor de meu trabalho aqui estabelecido.
              Osu !
            </p>
          </section>
          <img
            src="https://i.imgur.com/HS6uKEp.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/HS6uKEp.jpeg")}
          />
          <img
            src="https://i.imgur.com/Gt2Tdxl.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/Gt2Tdxl.jpeg")}
          />
          <img
            src="https://i.imgur.com/f3YfOqK.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/f3YfOqK.jpeg")}
          />
          <img
            src="https://i.imgur.com/WqmWA39.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/WqmWA39.jpeg")}
          />
          <img
            src="https://i.imgur.com/bgevfbm.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/bgevfbm.jpeg")}
          />
          <img
            src="https://i.imgur.com/1EJWaKj.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/1EJWaKj.jpeg")}
          />
          <img
            src="https://i.imgur.com/guW43xI.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/guW43xI.jpeg")}
          />
          <img
            src="https://i.imgur.com/SrqgTBi.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/SrqgTBi.jpeg")}
          />
          <img
            src="https://i.imgur.com/0SxPDT5.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/0SxPDT5.jpeg")}
          />
          <img
            src="https://i.imgur.com/2vXUPmO.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/2vXUPmO.jpeg")}
          />
          <img
            src="https://i.imgur.com/6NAw3fr.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/6NAw3fr.jpeg")}
          />
          <img
            src="https://i.imgur.com/vB1omWH.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/vB1omWH.jpeg")}
          />
          <img
            src="https://i.imgur.com/zKkiaVP.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/zKkiaVP.jpeg")}
          />
          <img
            src="https://i.imgur.com/mAmEcbE.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/mAmEcbE.jpeg")}
          />
          <img
            src="https://i.imgur.com/n8fCeON.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/n8fCeON.jpeg")}
          />
          <img
            src="https://i.imgur.com/sN21RWI.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/sN21RWI.jpeg")}
          />
          <img
            src="https://i.imgur.com/VAjZyQA.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/VAjZyQA.jpeg")}
          />
          <img
            src="https://i.imgur.com/xhfFtMX.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/xhfFtMX.jpeg")}
          />
          <img
            src="https://i.imgur.com/42YX9M9.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/42YX9M9.jpeg")}
          />
          <img
            src="https://i.imgur.com/CGsYtY3.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/CGsYtY3.jpeg")}
          />
          <img
            src="https://i.imgur.com/PBDkWQw.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/PBDkWQw.jpeg")}
          />
          <img
            src="https://i.imgur.com/ue4Um12.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/ue4Um12.jpeg")}
          />
          <img
            src="https://i.imgur.com/FRqHA8K.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/FRqHA8K.jpeg")}
          />
          <img
            src="https://i.imgur.com/XZxHaAC.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/XZxHaAC.jpeg")}
          />
          <img
            src="https://i.imgur.com/pVlejTD.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/pVlejTD.jpeg")}
          />
          <img
            src="https://i.imgur.com/TKYRK0q.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/TKYRK0q.jpeg")}
          />
          <img
            src="https://i.imgur.com/VVqzO9G.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/VVqzO9G.jpeg")}
          />
          <img
            src="https://i.imgur.com/kBUn94w.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/kBUn94w.jpeg")}
          />
          <img
            src="https://i.imgur.com/GnvBOiM.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/GnvBOiM.jpeg")}
          />
          <img
            src="https://i.imgur.com/x9qTnfx.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/x9qTnfx.jpeg")}
          />
          <img
            src="https://i.imgur.com/VOtqfux.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/VOtqfux.jpeg")}
          />
          <img
            src="https://i.imgur.com/cXcLMGo.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/cXcLMGo.jpeg")}
          />
          <img
            src="https://i.imgur.com/GOvGXrc.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/GOvGXrc.jpeg")}
          />
          <img
            src="https://i.imgur.com/qlt3WGj.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/qlt3WGj.jpeg")}
          />
          <img
            src="https://i.imgur.com/BEYrZr2.jpeg"
            alt=""
            className="mx-auto cursor-pointer w-90 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
            onClick={() => handleImageClick("https://i.imgur.com/BEYrZr2.jpeg")}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <YoutubeEmbed embedId="T19f95LqjEE" />
          </div>
          <section id="historia" className="space-y-4">
            <h1 className="text-3xl font-bold mb-4">
              História do Kyokushinkaikan
            </h1>
            <p>
              O Kyokushinkaikan foi fundado por Masutatsu Oyama, conhecido por
              sua dedicação e força no karatê de contato total. Desde sua
              criação, o estilo se expandiu pelo mundo, formando uma grande
              comunidade de praticantes.
            </p>

            <img
              src="https://i.imgur.com/4JqAODo.jpg"
              alt="História Kyokushinkaikan"
              className="cursor-pointer w-64 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />
          </section>
          {/* Seção: Filosofia */}
          <section id="filosofia" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-2">Filosofia</h2>
            <p>
              A filosofia do Kyokushinkaikan baseia-se na disciplina, respeito e
              superação pessoal. Os treinos são intensos, buscando sempre o
              aprimoramento técnico e mental.
            </p>
            <img
              src="https://i.imgur.com/4JqAODo.jpg"
              alt="Filosofia Kyokushinkaikan"
              className="cursor-pointer w-64 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />

            <p></p>
          </section>
          <section id="fundadores" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-2">Fundadores</h2>
            <p>
              Masutatsu Oyama é o fundador do estilo, conhecido mundialmente por
              suas demonstrações de força e técnica impecável. Seu legado vive
              através dos instrutores e praticantes do Kyokushinkaikan.
            </p>

            <img
              src="https://i.imgur.com/l3LGF4O.jpg"
              alt="Fundadores Kyokushinkaikan"
              className="cursor-pointer w-64 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/l3LGF4O.jpg")
              }
            />
          </section>
          {/* Seção: Galeria */}
          <section id="galeria" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-2">Galeria de Fotos</h2>
            <p>
              Confira algumas imagens representando a trajetória e prática do
              Kyokushinkaikan.
            </p>
            <img
              src="https://i.imgur.com/4JqAODo.jpg"
              alt="Galeria Kyokushinkaikan"
              className="cursor-pointer w-64 rounded shadow-md hover:opacity-75 transition-transform transform hover:scale-105"
              onClick={() =>
                handleImageClick("https://i.imgur.com/4JqAODo.jpg")
              }
            />
          </section>
        </main>
      </div>

      {/* Modal de Imagem */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Imagem Ampliada"
            className="max-w-3xl max-h-full rounded shadow-lg transition-transform transform hover:scale-105"
          />
        </div>
      )}
    </div>
  );
};

export default Kyokushinkaikan;
